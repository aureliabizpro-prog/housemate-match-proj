# 後端 API 規格：配對推薦模式（已填問卷用戶）

## 端點資訊

**端點**: `GET /api/matches/:userEmail`

**用途**: 提供給已填寫問卷的用戶，查看系統為其推薦的前 5 名最佳室友配對

**認證**: 需要用戶認證（JWT Token 或 Session）

---

## Request 參數

### Path Parameters

| 參數名 | 類型 | 必填 | 說明 | 範例 |
|--------|------|------|------|------|
| `userEmail` | string | 是 | 用戶 Email | `/api/matches/han911522@gmail.com` |

### Query Parameters (Optional)

| 參數名 | 類型 | 必填 | 說明 | 範例 |
|--------|------|------|------|------|
| `limit` | number | 否 | 返回筆數，預設 5，最大 10 | `?limit=5` |
| `minScore` | number | 否 | 最低配對分數門檻，預設 60 | `?minScore=70` |

### Headers

```
Authorization: Bearer {JWT_TOKEN}
```

---

## Response 格式

### 成功回應 (200 OK)

```json
{
  "success": true,
  "requestUser": {
    "email": "han911522@gmail.com",
    "userId": "han911522",
    "displayName": "han***22"
  },
  "matches": [
    {
      "matchId": "han911522_viviloveexce_2025-10-10",
      "matchedUser": {
        "email": "viv***@gmail.com",
        "userId": "viviloveexce"
      },
      "matchScore": 94,
      "scoreBreakdown": {
        "genderPreference": 40,
        "location": 20,
        "budget": 15,
        "lifestyle": 19
      },
      "whyRecommended": [
        "你們都接受任何性別的室友，相處彈性高",
        "地點偏好高度重疊（松山區、中山區）",
        "預算範圍完全一致（$10k-$12k）",
        "都習慣看到髒就立刻掃，能維護乾淨環境"
      ],
      "lifestyle": {
        "schedule": "正常作息",
        "cleaning": "看到髒就立刻掃",
        "pets": "喜歡寵物，覺得有貓狗很好",
        "interaction": "偶爾會聊天，適度互動"
      },
      "quote": "期待合租的室友是可以一同維護環境的人，使用完的東西會歸位",
      "matchDate": "2025-10-10T14:30:00Z"
    },
    {
      "matchId": "han911522_ruby61428_2025-10-10",
      "matchedUser": {
        "email": "rub***28@gmail.com",
        "userId": "ruby61428"
      },
      "matchScore": 82,
      "scoreBreakdown": {
        "genderPreference": 40,
        "location": 0,
        "budget": 15,
        "lifestyle": 17
      },
      "whyRecommended": [
        "性別偏好完全匹配",
        "預算範圍一致（$10k-$12k）",
        "都能接受室友養寵物",
        "互動方式相近，打招呼即可"
      ],
      "lifestyle": {
        "schedule": "正常作息",
        "cleaning": "願意配合大家共識",
        "pets": "OK，只要有清潔、安靜的規範就好",
        "interaction": "有基本禮貌，打招呼就好"
      },
      "quote": "希望可以一起維護共同生活的環境，也可以提供彼此在異鄉的基本支持",
      "matchDate": "2025-10-10T14:30:00Z"
    }
  ],
  "total": 5
}
```

---

## 資料欄位說明

### `MatchRecommendation` 物件

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| `matchId` | string | 配對唯一識別碼 | `"user1_user2_2025-10-10"` |
| `matchedUser` | object | 被推薦的室友資訊 | 見下方 |
| `matchScore` | number | 總配對分數（0-100） | `94` |
| `scoreBreakdown` | object | 分數細項 | 見下方 |
| `whyRecommended` | string[] | 推薦理由（3-5 條） | `["你們都接受任何性別...", ...]` |
| `lifestyle` | object | 室友的生活習慣 | 見下方 |
| `quote` | string? | 選填：室友的自我介紹或期待（從 bio 提取） | `"期待合租的室友..."` |
| `matchDate` | string | 配對計算時間（ISO 8601） | `"2025-10-10T14:30:00Z"` |

### `matchedUser` 物件

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| `email` | string | 混淆後的 Email | `"viv***@gmail.com"` |
| `userId` | string | 用戶 ID | `"viviloveexce"` |

### `scoreBreakdown` 物件

| 欄位 | 類型 | 滿分 | 說明 |
|------|------|------|------|
| `genderPreference` | number | 40 | 性別偏好匹配分數（必須雙向匹配，否則為 0） |
| `location` | number | 20 | 地點重疊分數（有任何重疊即得分） |
| `budget` | number | 15 | 預算匹配分數（範圍相同即得分） |
| `lifestyle` | number | 25 | 生活習慣相似度（5 題各 5 分） |

### `lifestyle` 物件

| 欄位 | 類型 | 對應問卷題號 | 範例 |
|------|------|------------|------|
| `schedule` | string | q12_schedule | `"正常作息"` |
| `cleaning` | string | q9_cleaning | `"看到髒就立刻掃"` |
| `pets` | string | q11_pets | `"喜歡寵物，覺得有貓狗很好"` |
| `interaction` | string | q13_interaction | `"偶爾會聊天，適度互動"` |

---

## 資料產生邏輯

### 1. 配對分數計算

**使用現有的 `calculateMatchScore` 函數**：

```typescript
// 前端已實作，後端需實作相同邏輯
export const calculateMatchScore = (user1: User, user2: User): number => {
  let score = 0;
  let maxScore = 100;

  // 1. Gender Preference (40 分) - 必須雙向匹配
  const genderMatch = checkGenderPreferenceMatch(user1, user2);
  if (!genderMatch) {
    return 0; // 硬性淘汰
  }
  score += 40;

  // 2. Location Overlap (20 分)
  const locationOverlap = user1.q4_location_pref.some(loc =>
    user2.q4_location_pref.includes(loc)
  );
  if (locationOverlap) {
    score += 20;
  }

  // 3. Budget Match (15 分)
  if (user1.q5_budget === user2.q5_budget) {
    score += 15;
  }

  // 4. Lifestyle Similarity (25 分)
  const lifestyleQuestions = [
    'q9_cleaning',
    'q10_visitors',
    'q11_pets',
    'q12_schedule',
    'q13_interaction'
  ];

  let lifestyleScore = 0;
  lifestyleQuestions.forEach(q => {
    if (user1[q] === user2[q]) {
      lifestyleScore += 5;
    }
  });
  score += lifestyleScore;

  return score;
};
```

### 2. `whyRecommended` 生成邏輯

根據 `scoreBreakdown` 自動生成推薦理由：

```typescript
const generateWhyRecommended = (
  user1: User,
  user2: User,
  breakdown: ScoreBreakdown
): string[] => {
  const reasons: string[] = [];

  // 性別偏好（40 分）
  if (breakdown.genderPreference === 40) {
    if (user1.q3_gender_pref === 'ANY' && user2.q3_gender_pref === 'ANY') {
      reasons.push('你們都接受任何性別的室友，相處彈性高');
    } else {
      reasons.push('性別偏好完全匹配');
    }
  }

  // 地點（20 分）
  if (breakdown.location === 20) {
    const overlap = user1.q4_location_pref.filter(loc =>
      user2.q4_location_pref.includes(loc)
    );
    if (overlap.length >= 2) {
      reasons.push(`地點偏好高度重疊（${overlap.join('、')}）`);
    } else {
      reasons.push(`都想住在${overlap[0]}`);
    }
  }

  // 預算（15 分）
  if (breakdown.budget === 15) {
    reasons.push(`預算範圍完全一致（${formatBudget(user1.q5_budget)}）`);
  }

  // 生活習慣（最高 25 分）
  if (user1.q9_cleaning === user2.q9_cleaning) {
    reasons.push(`都${user1.q9_cleaning}，能維護乾淨環境`);
  }
  if (user1.q11_pets === user2.q11_pets) {
    reasons.push(`對寵物的態度一致`);
  }
  if (user1.q13_interaction === user2.q13_interaction) {
    reasons.push(`互動方式相近，${user1.q13_interaction}`);
  }

  return reasons.slice(0, 5); // 最多 5 條
};
```

### 3. `quote` 提取邏輯

從用戶的 `q6_bio`（自我介紹）中提取最有代表性的一句話：

```typescript
const extractQuote = (bio: string): string | undefined => {
  if (!bio || bio.length < 10) return undefined;

  // 優先提取「期待」、「希望」開頭的句子
  const sentences = bio.split(/[。！？\n]/);
  const keywordSentence = sentences.find(s =>
    s.includes('期待') || s.includes('希望') || s.includes('理想')
  );

  if (keywordSentence && keywordSentence.length < 100) {
    return keywordSentence.trim();
  }

  // 否則返回前 80 字
  return bio.substring(0, 80) + (bio.length > 80 ? '...' : '');
};
```

### 4. 排序邏輯

```typescript
// 按配對分數降序排列，取前 N 名
const sortedMatches = allMatches
  .filter(m => m.matchScore >= minScore)
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, limit);
```

---

## 錯誤回應

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You can only access your own match recommendations"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with email han911522@gmail.com not found"
  }
}
```

### 422 Unprocessable Entity
```json
{
  "success": false,
  "error": {
    "code": "INCOMPLETE_PROFILE",
    "message": "User profile is incomplete. Please complete the questionnaire first."
  }
}
```

---

## 實作注意事項

### 性能優化

1. **快取配對結果**:
   ```typescript
   // 配對結果可以快取 24 小時
   const cacheKey = `matches:${userEmail}:${minScore}`;
   const cached = await redis.get(cacheKey);
   if (cached) return JSON.parse(cached);

   // 計算並快取
   const matches = await calculateMatches(user);
   await redis.setex(cacheKey, 86400, JSON.stringify(matches));
   ```

2. **批次查詢**:
   ```typescript
   // 一次載入所有需要比對的用戶
   const allUsers = await User.find({
     userId: { $ne: requestUser.userId },
     profileComplete: true
   });
   ```

3. **非同步處理**:
   - 用戶填寫問卷後，可以透過 background job 預先計算配對結果
   - 避免 API 請求時即時計算造成延遲

### 資料隱私

- ✅ **混淆 Email**: `viviloveexce@gmail.com` → `viv***@gmail.com`
- ❌ **不要**暴露完整 Email（除非雙方都已同意聯絡）
- ✅ **可以**顯示對方的問卷回答內容
- ✅ **可以**顯示詳細的配對分析

### Email 混淆函數

```typescript
export const obfuscateEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (username.length <= 3) {
    return `${username.charAt(0)}***@${domain}`;
  }
  return `${username.substring(0, 3)}***@${domain}`;
};
```

---

## 測試範例

### cURL 範例

```bash
# 基本查詢（需要認證）
curl -X GET "http://localhost:3000/api/matches/han911522@gmail.com" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 自定義參數
curl -X GET "http://localhost:3000/api/matches/han911522@gmail.com?limit=5&minScore=70" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### TypeScript 型別定義

```typescript
export interface ScoreBreakdown {
  genderPreference: number;  // 0-40
  location: number;          // 0-20
  budget: number;            // 0-15
  lifestyle: number;         // 0-25
}

export interface MatchRecommendation {
  matchId: string;
  matchedUser: {
    email: string;  // obfuscated
    userId: string;
  };
  matchScore: number;  // 0-100
  scoreBreakdown: ScoreBreakdown;
  whyRecommended: string[];  // 3-5 items
  lifestyle: {
    schedule: string;
    cleaning: string;
    pets: string;
    interaction: string;
  };
  quote?: string;
  matchDate: string;  // ISO 8601
}

export interface MatchModeResponse {
  success: boolean;
  requestUser: {
    email: string;
    userId: string;
    displayName: string;
  };
  matches: MatchRecommendation[];
  total: number;
}
```

---

## 前端整合範例

### React Component 使用範例

```typescript
'use client';

import { useState, useEffect } from 'react';
import { MatchRecommendation, MatchModeResponse } from '@/types/user';

export default function MyMatchesPage() {
  const [matches, setMatches] = useState<MatchRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/matches/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data: MatchModeResponse = await response.json();

        if (data.success) {
          setMatches(data.matches);
        }
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>你的最佳室友推薦</h1>
      {matches.map(match => (
        <MatchCard key={match.matchId} match={match} />
      ))}
    </div>
  );
}
```

---

**最後更新**: 2025-12-06
**文件版本**: 1.0
**負責人**: Backend Team
