# 數據管理 API 文檔

> **模組位置:** `src/data/users.ts`

## 概述

數據管理模組負責存儲和訪問用戶數據，提供統一的數據訪問接口。

---

## 數據結構

### `users`

所有用戶數據的主數組。

```typescript
export const users: User[]
```

#### 特點
- 導出為常量，保持數據穩定性
- 包含所有註冊用戶的完整信息
- 按用戶 ID 排序

#### 當前數據量
- 總用戶數: 9

---

## API 函數

### `getUserById()`

根據用戶 ID 查找用戶。

#### 函數簽名
```typescript
function getUserById(userId: string): User | undefined
```

#### 參數
- `userId: string` - 用戶唯一標識符

#### 返回值
- `User` - 找到的用戶對象
- `undefined` - 用戶不存在

#### 使用範例
```typescript
import { getUserById } from '@/data/users';

const user = getUserById('han911522');
if (user) {
  console.log(`找到用戶: ${user.userId}`);
  console.log(`性別認同: ${user.q1_gender_identity}`);
  console.log(`偏好地點: ${user.q4_location_pref.join(', ')}`);
} else {
  console.log('用戶不存在');
}
```

---

### `getAllUserIds()`

獲取所有用戶 ID 列表。

#### 函數簽名
```typescript
function getAllUserIds(): string[]
```

#### 返回值
- `string[]` - 所有用戶 ID 的數組

#### 使用範例
```typescript
import { getAllUserIds } from '@/data/users';

const userIds = getAllUserIds();
console.log(`總用戶數: ${userIds.length}`);

// 創建下拉選單選項
const options = userIds.map(id => ({
  value: id,
  label: id
}));
```

---

## 數據訪問模式

### 1. 直接訪問（不推薦）

❌ 不好的做法
```typescript
import { users } from '@/data/users';

// 直接修改數據
users[0].q6_bio = '新的簡介';  // 危險！
```

### 2. 通過函數訪問（推薦）

✅ 好的做法
```typescript
import { getUserById } from '@/data/users';

const user = getUserById('han911522');
// 使用展開運算符創建副本
const updatedUser = {
  ...user,
  q6_bio: '新的簡介'
};
```

---

## 未來擴展

### 1. API 整合

將靜態數據替換為 API 調用：

```typescript
// src/data/api.ts (未來添加)
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function fetchUserById(userId: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
```

### 2. 緩存層

添加數據緩存以提升性能：

```typescript
// src/data/cache.ts (未來添加)
class UserCache {
  private cache = new Map<string, User>();
  private expiryTime = 5 * 60 * 1000; // 5 分鐘

  set(userId: string, user: User) {
    this.cache.set(userId, user);
    setTimeout(() => this.cache.delete(userId), this.expiryTime);
  }

  get(userId: string): User | undefined {
    return this.cache.get(userId);
  }

  clear() {
    this.cache.clear();
  }
}

export const userCache = new UserCache();
```

### 3. 數據驗證

使用 Zod 進行運行時驗證：

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  userId: z.string().min(1),
  q1_gender_identity: z.string(),
  q2_sex_at_birth: z.string(),
  q3_gender_pref: z.enum(['ANY', 'GIF_ONLY', 'GIM_ONLY', 'SAF_ONLY', 'SAM_ONLY']),
  q4_location_pref: z.array(z.string()).min(1),
  q5_budget: z.enum(['10k-15k', '15k-20k', '20k-25k', '25k+']),
  q6_bio: z.string(),
  q9_cleaning: z.enum(['非常不同意', '不同意', '中立', '同意', '非常同意']),
  q10_visitors: z.enum(['非常不同意', '不同意', '中立', '同意', '非常同意']),
  q11_pets: z.enum(['非常不同意', '不同意', '中立', '同意', '非常同意']),
  q12_schedule: z.enum(['非常不同意', '不同意', '中立', '同意', '非常同意']),
  q13_interaction: z.enum(['非常不同意', '不同意', '中立', '同意', '非常同意']),
});

export function validateUser(data: unknown): User {
  return UserSchema.parse(data);
}
```

### 4. CRUD 操作

完整的 CRUD 函數集：

```typescript
// src/data/operations.ts (未來添加)

// Create
export async function createUser(userData: Omit<User, 'userId'>): Promise<User> {
  const userId = generateUserId();
  const newUser: User = { userId, ...userData };

  await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  });

  return newUser;
}

// Read (已實現)
export function getUserById(userId: string): User | undefined {
  // ...
}

// Update
export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });

  return await response.json();
}

// Delete
export async function deleteUser(userId: string): Promise<void> {
  await fetch(`/api/users/${userId}`, {
    method: 'DELETE'
  });
}
```

### 5. 查詢功能

添加更多查詢函數：

```typescript
// 根據條件過濾用戶
export function filterUsers(predicate: (user: User) => boolean): User[] {
  return users.filter(predicate);
}

// 根據地點查找用戶
export function getUsersByLocation(location: Location): User[] {
  return users.filter(user =>
    user.q4_location_pref.includes(location)
  );
}

// 根據預算範圍查找用戶
export function getUsersByBudget(budget: BudgetRange): User[] {
  return users.filter(user => user.q5_budget === budget);
}

// 根據性別偏好查找用戶
export function getUsersByGenderPref(pref: GenderPreference): User[] {
  return users.filter(user => user.q3_gender_pref === pref);
}
```

---

## 數據遷移

### 從靜態到 API

#### 步驟 1: 創建 API Hook

```typescript
// src/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { User } from '@/types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
}
```

#### 步驟 2: 更新組件

```typescript
// 原本
import { users } from '@/data/users';

// 改為
import { useUsers } from '@/hooks/useUsers';

function App() {
  const { users, loading, error } = useUsers();

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error.message}</div>;

  // 使用 users
}
```

---

## 數據安全

### 1. 敏感資訊保護

```typescript
// 創建公開用戶信息類型
type PublicUser = Omit<User, 'q2_sex_at_birth'>;

export function getPublicUser(userId: string): PublicUser | undefined {
  const user = getUserById(userId);
  if (!user) return undefined;

  const { q2_sex_at_birth, ...publicInfo } = user;
  return publicInfo;
}
```

### 2. 數據加密

```typescript
// src/utils/encryption.ts (未來添加)
export function encryptSensitiveData(data: string): string {
  // 使用加密算法
  return encrypted;
}

export function decryptSensitiveData(encrypted: string): string {
  // 解密
  return decrypted;
}
```

---

## 性能優化

### 1. 索引

建立用戶 ID 索引以加速查找：

```typescript
class UserStore {
  private users: User[] = [];
  private indexById = new Map<string, User>();

  constructor(users: User[]) {
    this.users = users;
    this.buildIndex();
  }

  private buildIndex() {
    this.users.forEach(user => {
      this.indexById.set(user.userId, user);
    });
  }

  getUserById(userId: string): User | undefined {
    return this.indexById.get(userId);  // O(1)
  }
}
```

### 2. 分頁

處理大量用戶時使用分頁：

```typescript
export function getUsersPaginated(page: number, pageSize: number = 10) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    users: users.slice(start, end),
    total: users.length,
    page,
    pageSize,
    totalPages: Math.ceil(users.length / pageSize)
  };
}
```

---

## 測試範例

```typescript
import { describe, it, expect } from 'vitest';
import { getUserById, getAllUserIds } from './users';

describe('getUserById', () => {
  it('應該返回存在的用戶', () => {
    const user = getUserById('han911522');
    expect(user).toBeDefined();
    expect(user?.userId).toBe('han911522');
  });

  it('應該對不存在的用戶返回 undefined', () => {
    const user = getUserById('nonexistent');
    expect(user).toBeUndefined();
  });
});

describe('getAllUserIds', () => {
  it('應該返回所有用戶 ID', () => {
    const ids = getAllUserIds();
    expect(ids).toBeInstanceOf(Array);
    expect(ids.length).toBeGreaterThan(0);
  });
});
```

---

## 相關文檔

- [類型定義](./types.md)
- [配對算法](./matching-algorithm.md)
- [系統架構](../architecture/overview.md)
