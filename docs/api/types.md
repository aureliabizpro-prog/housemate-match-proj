# 類型定義 API 文檔

> **模組位置:** `src/types/index.ts`

## 概述

本模組定義了系統中所有的 TypeScript 類型和接口，確保類型安全。

---

## 類型列表

### `GenderPreference`

性別偏好類型定義。

```typescript
type GenderPreference = "ANY" | "GIF_ONLY" | "GIM_ONLY" | "SAF_ONLY" | "SAM_ONLY";
```

#### 值說明

| 值 | 含義 | 說明 |
|---|------|------|
| `ANY` | 不限 | 接受任何性別 |
| `GIF_ONLY` | 只找認同為女性 | Gender Identity Female |
| `GIM_ONLY` | 只找認同為男性 | Gender Identity Male |
| `SAF_ONLY` | 只找生理女性 | Sex Assigned Female |
| `SAM_ONLY` | 只找生理男性 | Sex Assigned Male |

---

### `Location`

台北市行政區類型定義。

```typescript
type Location =
  | "松山區" | "信義區" | "大安區" | "中山區"
  | "中正區" | "大同區" | "萬華區" | "文山區"
  | "南港區" | "內湖區" | "士林區" | "北投區";
```

---

### `BudgetRange`

租金預算範圍類型定義。

```typescript
type BudgetRange = "10k-15k" | "15k-20k" | "20k-25k" | "25k+";
```

#### 範圍說明
- `10k-15k`: 10,000 - 15,000 元/月
- `15k-20k`: 15,000 - 20,000 元/月
- `20k-25k`: 20,000 - 25,000 元/月
- `25k+`: 25,000 元以上/月

---

### `LifestyleAnswer`

生活習慣問卷答案類型。

```typescript
type LifestyleAnswer =
  | "非常不同意"
  | "不同意"
  | "中立"
  | "同意"
  | "非常同意";
```

#### 對應數值
```typescript
"非常不同意" = 1
"不同意"     = 2
"中立"      = 3
"同意"      = 4
"非常同意"   = 5
```

---

### `User`

用戶完整信息接口。

```typescript
interface User {
  userId: string;
  q1_gender_identity: string;
  q2_sex_at_birth: string;
  q3_gender_pref: GenderPreference;
  q4_location_pref: Location[];
  q5_budget: BudgetRange;
  q6_bio: string;
  q9_cleaning: LifestyleAnswer;
  q10_visitors: LifestyleAnswer;
  q11_pets: LifestyleAnswer;
  q12_schedule: LifestyleAnswer;
  q13_interaction: LifestyleAnswer;
}
```

#### 欄位說明

| 欄位 | 類型 | 說明 |
|------|------|------|
| `userId` | `string` | 用戶唯一標識符 |
| `q1_gender_identity` | `string` | 性別認同 |
| `q2_sex_at_birth` | `string` | 出生性別 |
| `q3_gender_pref` | `GenderPreference` | 室友性別偏好 |
| `q4_location_pref` | `Location[]` | 偏好地點列表 |
| `q5_budget` | `BudgetRange` | 租金預算範圍 |
| `q6_bio` | `string` | 個人簡介 |
| `q9_cleaning` | `LifestyleAnswer` | 清潔習慣 |
| `q10_visitors` | `LifestyleAnswer` | 訪客頻率接受度 |
| `q11_pets` | `LifestyleAnswer` | 寵物接受度 |
| `q12_schedule` | `LifestyleAnswer` | 作息時間相似度 |
| `q13_interaction` | `LifestyleAnswer` | 互動程度偏好 |

#### 使用範例

```typescript
const user: User = {
  userId: 'han911522',
  q1_gender_identity: '女',
  q2_sex_at_birth: '女',
  q3_gender_pref: 'ANY',
  q4_location_pref: ['松山區', '中山區'],
  q5_budget: '10k-15k',
  q6_bio: '從事影視業，有養馬爾濟斯',
  q9_cleaning: '非常不同意',
  q10_visitors: '非常同意',
  q11_pets: '非常同意',
  q12_schedule: '中立',
  q13_interaction: '中立'
};
```

---

### `ScoreBreakdown`

分數細分接口。

```typescript
interface ScoreBreakdown {
  genderMatch: number;
  locationMatch: number;
  budgetMatch: number;
  lifestyleMatch: number;
}
```

#### 欄位說明

| 欄位 | 範圍 | 說明 |
|------|------|------|
| `genderMatch` | 0 或 40 | 性別偏好匹配分數 |
| `locationMatch` | 0 或 20 | 地點重疊分數 |
| `budgetMatch` | 0 或 15 | 預算匹配分數 |
| `lifestyleMatch` | 0-25 | 生活習慣匹配分數 |

#### 使用範例

```typescript
const breakdown: ScoreBreakdown = {
  genderMatch: 40,
  locationMatch: 20,
  budgetMatch: 15,
  lifestyleMatch: 19
};

const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0);
// totalScore = 94
```

---

### `MatchResult`

配對結果接口。

```typescript
interface MatchResult {
  user1: User;
  user2: User;
  score: number;
  breakdown: ScoreBreakdown;
}
```

#### 欄位說明

| 欄位 | 類型 | 說明 |
|------|------|------|
| `user1` | `User` | 第一個用戶 |
| `user2` | `User` | 第二個用戶 |
| `score` | `number` | 總配對分數（0-100） |
| `breakdown` | `ScoreBreakdown` | 分數細分 |

#### 使用範例

```typescript
const match: MatchResult = {
  user1: {
    userId: 'han911522',
    // ... 其他欄位
  },
  user2: {
    userId: 'viviloveexce',
    // ... 其他欄位
  },
  score: 94,
  breakdown: {
    genderMatch: 40,
    locationMatch: 20,
    budgetMatch: 15,
    lifestyleMatch: 19
  }
};
```

---

### `ViewMode`

視圖模式類型。

```typescript
type ViewMode = "all" | "individual";
```

#### 值說明

| 值 | 說明 |
|---|------|
| `all` | 查看所有配對模式 |
| `individual` | 個別用戶查詢模式 |

#### 使用範例

```typescript
const [viewMode, setViewMode] = useState<ViewMode>('all');

if (viewMode === 'all') {
  // 顯示所有配對
} else {
  // 顯示個別用戶配對
}
```

---

## 類型守衛 (Type Guards)

### 檢查是否為有效的 GenderPreference

```typescript
function isGenderPreference(value: string): value is GenderPreference {
  return ['ANY', 'GIF_ONLY', 'GIM_ONLY', 'SAF_ONLY', 'SAM_ONLY'].includes(value);
}
```

### 檢查是否為有效的 BudgetRange

```typescript
function isBudgetRange(value: string): value is BudgetRange {
  return ['10k-15k', '15k-20k', '20k-25k', '25k+'].includes(value);
}
```

### 檢查是否為有效的 LifestyleAnswer

```typescript
function isLifestyleAnswer(value: string): value is LifestyleAnswer {
  return ['非常不同意', '不同意', '中立', '同意', '非常同意'].includes(value);
}
```

---

## 工具類型

### 部分用戶類型（用於表單）

```typescript
type UserFormData = Pick<User,
  | 'q1_gender_identity'
  | 'q2_sex_at_birth'
  | 'q3_gender_pref'
  | 'q4_location_pref'
  | 'q5_budget'
  | 'q6_bio'
>;
```

### 用戶預覽類型（不包含問卷）

```typescript
type UserPreview = Omit<User,
  | 'q9_cleaning'
  | 'q10_visitors'
  | 'q11_pets'
  | 'q12_schedule'
  | 'q13_interaction'
>;
```

### 只讀用戶類型

```typescript
type ReadonlyUser = Readonly<User>;
```

---

## 類型擴展建議

### 1. 添加時間戳

```typescript
interface UserWithTimestamps extends User {
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. 添加驗證狀態

```typescript
interface UserWithVerification extends User {
  isVerified: boolean;
  verificationDate?: Date;
}
```

### 3. 添加配對歷史

```typescript
interface UserWithHistory extends User {
  matchHistory: {
    userId: string;
    score: number;
    matchedAt: Date;
  }[];
}
```

---

## 最佳實踐

### 1. 使用類型別名 vs 接口

**類型別名** - 用於聯合類型和原始類型
```typescript
type GenderPreference = "ANY" | "GIF_ONLY" | ...;
```

**接口** - 用於對象結構
```typescript
interface User { ... }
```

### 2. 避免使用 `any`

❌ 不好的做法
```typescript
function processUser(user: any) {
  // 失去類型安全
}
```

✅ 好的做法
```typescript
function processUser(user: User) {
  // 完整的類型檢查
}
```

### 3. 使用可選屬性

```typescript
interface User {
  userId: string;
  bio?: string;  // 可選
}
```

### 4. 使用 Readonly 保護數據

```typescript
function displayUser(user: Readonly<User>) {
  // 無法修改 user
}
```

---

## 相關文檔

- [配對算法](./matching-algorithm.md)
- [數據管理](./data-management.md)
- [系統架構](../architecture/overview.md)
