# 配對算法 API 文檔

> **模組位置:** `src/utils/matchingAlgorithm.ts`

## 概述

配對算法模組提供計算用戶間配對分數和查找最佳配對的功能。

---

## 核心函數

### `calculateMatchScore()`

計算兩個用戶的總配對分數（0-100）。

#### 函數簽名
```typescript
function calculateMatchScore(user1: User, user2: User): number
```

#### 參數
- `user1: User` - 第一個用戶
- `user2: User` - 第二個用戶

#### 返回值
- `number` - 配對分數（0-100），如果性別偏好不匹配則返回 0

#### 評分規則

| 維度 | 滿分 | 計算方式 |
|------|------|---------|
| 性別/性傾向偏好 | 40 | 雙向匹配檢查 |
| 地點偏好 | 20 | 地點重疊檢查 |
| 預算範圍 | 15 | 預算相同檢查 |
| 生活習慣 | 25 | 5個問題相似度 |

#### 使用範例
```typescript
import { calculateMatchScore } from '@/utils/matchingAlgorithm';
import { users } from '@/data/users';

const score = calculateMatchScore(users[0], users[1]);
console.log(`配對分數: ${score}%`);
// 輸出: 配對分數: 94%
```

---

### `checkGenderPreferenceMatch()`

檢查兩個用戶的性別偏好是否雙向匹配。

#### 函數簽名
```typescript
function checkGenderPreferenceMatch(user: User, otherUser: User): boolean
```

#### 參數
- `user: User` - 第一個用戶
- `otherUser: User` - 第二個用戶

#### 返回值
- `boolean` - `true` 表示雙向匹配，`false` 表示不匹配

#### 性別偏好類型

| 偏好值 | 說明 | 匹配條件 |
|--------|------|---------|
| `ANY` | 不限 | 總是匹配 |
| `GIF_ONLY` | 只找認同為女性 | gender_identity === "女" |
| `GIM_ONLY` | 只找認同為男性 | gender_identity === "男" |
| `SAF_ONLY` | 只找生理女性 | sex_at_birth === "女" |
| `SAM_ONLY` | 只找生理男性 | sex_at_birth === "男" |

#### 使用範例
```typescript
const isMatch = checkGenderPreferenceMatch(users[0], users[1]);
if (!isMatch) {
  console.log('性別偏好不匹配');
}
```

---

### `calculateLocationScore()`

計算兩個用戶的地點偏好重疊分數。

#### 函數簽名
```typescript
function calculateLocationScore(user1: User, user2: User): number
```

#### 參數
- `user1: User` - 第一個用戶
- `user2: User` - 第二個用戶

#### 返回值
- `number` - 20 分（有重疊）或 0 分（無重疊）

#### 邏輯
- 檢查 `user1.q4_location_pref` 和 `user2.q4_location_pref` 的交集
- 只要有任何一個地點重疊，即得 20 分

#### 使用範例
```typescript
const locationScore = calculateLocationScore(user1, user2);
// user1 偏好: ['松山區', '中山區']
// user2 偏好: ['中山區', '大安區']
// 結果: 20 (有重疊 '中山區')
```

---

### `calculateBudgetScore()`

計算預算範圍匹配分數。

#### 函數簽名
```typescript
function calculateBudgetScore(user1: User, user2: User): number
```

#### 參數
- `user1: User` - 第一個用戶
- `user2: User` - 第二個用戶

#### 返回值
- `number` - 15 分（相同）或 0 分（不同）

#### 預算範圍選項
- `"10k-15k"`
- `"15k-20k"`
- `"20k-25k"`
- `"25k+"`

#### 使用範例
```typescript
const budgetScore = calculateBudgetScore(user1, user2);
// user1.q5_budget: "10k-15k"
// user2.q5_budget: "10k-15k"
// 結果: 15
```

---

### `calculateLifestyleQuestionScore()`

計算單個生活習慣問題的匹配分數。

#### 函數簽名
```typescript
function calculateLifestyleQuestionScore(
  answer1: LifestyleAnswer,
  answer2: LifestyleAnswer
): number
```

#### 參數
- `answer1: LifestyleAnswer` - 第一個用戶的答案
- `answer2: LifestyleAnswer` - 第二個用戶的答案

#### 返回值
- `number` - 0-5 分，根據答案差異計算

#### 評分標準

| 答案差異 | 得分 |
|---------|------|
| 完全相同 (diff = 0) | 5 |
| 差 1 級 (diff = 1) | 3 |
| 差 2 級 (diff = 2) | 1 |
| 差 3 級以上 | 0 |

#### 答案量表
```typescript
"非常不同意" = 1
"不同意"     = 2
"中立"      = 3
"同意"      = 4
"非常同意"   = 5
```

#### 使用範例
```typescript
const score = calculateLifestyleQuestionScore("同意", "非常同意");
// diff = |4 - 5| = 1
// 結果: 3
```

---

### `calculateLifestyleScore()`

計算所有生活習慣問題的總分。

#### 函數簽名
```typescript
function calculateLifestyleScore(user1: User, user2: User): number
```

#### 參數
- `user1: User` - 第一個用戶
- `user2: User` - 第二個用戶

#### 返回值
- `number` - 0-25 分（5 題 × 每題最高 5 分）

#### 評估問題
1. `q9_cleaning` - 清潔習慣
2. `q10_visitors` - 訪客頻率
3. `q11_pets` - 寵物態度
4. `q12_schedule` - 作息時間
5. `q13_interaction` - 互動程度

#### 使用範例
```typescript
const lifestyleScore = calculateLifestyleScore(user1, user2);
// 結果: 0-25 之間的分數
```

---

### `calculateDetailedMatch()`

計算配對分數並返回詳細的分數細分。

#### 函數簽名
```typescript
function calculateDetailedMatch(user1: User, user2: User): MatchResult
```

#### 參數
- `user1: User` - 第一個用戶
- `user2: User` - 第二個用戶

#### 返回值
```typescript
interface MatchResult {
  user1: User;
  user2: User;
  score: number;
  breakdown: ScoreBreakdown;
}

interface ScoreBreakdown {
  genderMatch: number;    // 0 或 40
  locationMatch: number;  // 0 或 20
  budgetMatch: number;    // 0 或 15
  lifestyleMatch: number; // 0-25
}
```

#### 使用範例
```typescript
const match = calculateDetailedMatch(user1, user2);
console.log(match);
// {
//   user1: {...},
//   user2: {...},
//   score: 94,
//   breakdown: {
//     genderMatch: 40,
//     locationMatch: 20,
//     budgetMatch: 15,
//     lifestyleMatch: 19
//   }
// }
```

---

### `findAllMatches()`

找出所有超過門檻的配對組合。

#### 函數簽名
```typescript
function findAllMatches(users: User[], minScore: number): MatchResult[]
```

#### 參數
- `users: User[]` - 用戶數組
- `minScore: number` - 最低分數門檻

#### 返回值
- `MatchResult[]` - 配對結果數組，按分數降序排列

#### 算法複雜度
- 時間複雜度: O(n²)
- 空間複雜度: O(m)，m 為符合條件的配對數量

#### 使用範例
```typescript
import { findAllMatches } from '@/utils/matchingAlgorithm';
import { users } from '@/data/users';

const matches = findAllMatches(users, 60);
console.log(`找到 ${matches.length} 組配對`);

matches.forEach((match, index) => {
  console.log(
    `#${index + 1}: ${match.user1.userId} ↔ ${match.user2.userId} (${match.score}%)`
  );
});
```

#### 輸出範例
```
找到 22 組配對
#1: han911522 ↔ viviloveexce (94%)
#2: ruby61428 ↔ pomelo4187 (87%)
#3: yuchun1020243 ↔ forever93176 (82%)
...
```

---

### `findMatchesForUser()`

為特定用戶找出最佳配對。

#### 函數簽名
```typescript
function findMatchesForUser(
  targetUser: User,
  allUsers: User[],
  topN: number = 5
): MatchResult[]
```

#### 參數
- `targetUser: User` - 目標用戶
- `allUsers: User[]` - 所有用戶列表
- `topN: number` - 返回前 N 個配對（默認 5）

#### 返回值
- `MatchResult[]` - 配對結果數組，按分數降序排列，最多返回 topN 個

#### 算法特點
- 自動排除目標用戶自己
- 只返回分數 > 0 的配對
- 按分數降序排列

#### 使用範例
```typescript
import { findMatchesForUser, getUserById } from '@/utils';

const targetUser = getUserById('han911522');
if (targetUser) {
  const topMatches = findMatchesForUser(targetUser, users, 5);

  console.log(`為 ${targetUser.userId} 找到的最佳配對:`);
  topMatches.forEach((match, index) => {
    const partner = match.user2.userId === targetUser.userId
      ? match.user1
      : match.user2;
    console.log(`${index + 1}. ${partner.userId} (${match.score}%)`);
  });
}
```

#### 輸出範例
```
為 han911522 找到的最佳配對:
1. viviloveexce (94%)
2. pomelo4187 (78%)
3. ruby61428 (72%)
4. yuchun1020243 (65%)
5. chiyau0829 (60%)
```

---

## 擴展功能

### 自定義評分權重

未來可以添加權重配置：

```typescript
// 未來版本
interface ScoringWeights {
  genderWeight: number;
  locationWeight: number;
  budgetWeight: number;
  lifestyleWeight: number;
}

function calculateWeightedScore(
  user1: User,
  user2: User,
  weights: ScoringWeights
): number {
  // 實現加權計算
}
```

### 個性化推薦

```typescript
// 未來版本
function getPersonalizedMatches(
  targetUser: User,
  allUsers: User[],
  preferences: UserPreferences
): MatchResult[] {
  // 根據用戶偏好調整推薦策略
}
```

---

## 測試建議

### 單元測試範例

```typescript
import { describe, it, expect } from 'vitest';
import { calculateMatchScore } from './matchingAlgorithm';

describe('calculateMatchScore', () => {
  it('應該在性別偏好不匹配時返回 0', () => {
    const user1 = { /* SAF_ONLY */ };
    const user2 = { /* 男性 */ };
    expect(calculateMatchScore(user1, user2)).toBe(0);
  });

  it('應該計算完美匹配為 100 分', () => {
    const user1 = { /* 所有條件相同 */ };
    const user2 = { /* 所有條件相同 */ };
    expect(calculateMatchScore(user1, user2)).toBe(100);
  });
});
```

---

## 性能優化建議

### 1. 緩存計算結果
```typescript
const matchCache = new Map<string, number>();

function calculateMatchScoreWithCache(user1: User, user2: User): number {
  const key = `${user1.userId}-${user2.userId}`;
  if (matchCache.has(key)) {
    return matchCache.get(key)!;
  }

  const score = calculateMatchScore(user1, user2);
  matchCache.set(key, score);
  return score;
}
```

### 2. 並行計算（大量用戶時）
```typescript
import { Worker } from 'worker_threads';

// 使用 Web Workers 進行並行計算
```

---

## 常見問題

### Q: 為什麼性別偏好不匹配時直接返回 0？
A: 性別偏好是硬性條件，如果不符合則完全不適合配對。

### Q: 可以修改各維度的分數權重嗎？
A: 當前版本權重是固定的，未來版本可以添加自定義權重功能。

### Q: 如何添加新的評分維度？
A:
1. 在 `User` 類型中添加新字段
2. 編寫新的評分函數
3. 在 `calculateMatchScore` 中調用新函數
4. 調整總分比例

---

## 相關文檔

- [類型定義](./types.md)
- [數據管理](./data-management.md)
- [系統架構](../architecture/overview.md)
