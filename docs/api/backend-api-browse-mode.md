# 後端 API 規格：瀏覽模式（未填問卷用戶）

## 端點資訊

**端點**: `GET /api/user-profiles/browse`

**用途**: 提供給尚未填寫問卷的第三方訪客瀏覽，展示單一用戶資訊及其在系統中的平均契合度

**認證**: 不需要（公開瀏覽）

---

## Request 參數

### Query Parameters (Optional)

| 參數名 | 類型 | 必填 | 說明 | 範例 |
|--------|------|------|------|------|
| `limit` | number | 否 | 返回筆數限制，預設 20 | `?limit=10` |
| `offset` | number | 否 | 分頁偏移量，預設 0 | `?offset=20` |
| `sortBy` | string | 否 | 排序方式：`averageScore`（預設）/ `potentialMatches` / `newest` | `?sortBy=potentialMatches` |

---

## Response 格式

### 成功回應 (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "userId": "han911522",
      "tagInfo": {
        "gender": "生理女",
        "highlightFeature": "養馬爾濟斯",
        "highlightEmoji": "🐕"
      },
      "matchStats": {
        "averageMatchScore": 82,
        "potentialMatchCount": 2
      },
      "preferences": [
        "從事影視業，作息不固定",
        "看到髒就立刻掃，用完會歸位、順手清潔",
        "沒限制帶朋友回家",
        "不太受噪音影響"
      ],
      "suitableFor": {
        "description": "台北市、性別不拘、能接受寵物、重視清潔的人",
        "location": "台北市區",
        "budgetRange": "$10k–$12k"
      },
      "pronoun": "她"
    },
    {
      "userId": "ruby61428",
      "tagInfo": {
        "gender": "生理女",
        "highlightFeature": "行銷工作者",
        "highlightEmoji": "💼"
      },
      "matchStats": {
        "averageMatchScore": 78,
        "potentialMatchCount": 3
      },
      "preferences": [
        "期望在中正、萬華、板橋找房",
        "願意配合大家共識打掃",
        "希望可以申請租補的房子",
        "偏好三人以內共用衛浴"
      ],
      "suitableFor": {
        "description": "台北市、性別認同女性、重視基本禮貌與互助的人",
        "location": "中正區、萬華區、板橋區",
        "budgetRange": "$10k–$12k"
      },
      "pronoun": "她"
    }
  ],
  "pagination": {
    "total": 9,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

---

## 資料欄位說明

### `BrowseUserCard` 物件

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| `userId` | string | 用戶唯一識別碼 | `"han911522"` |
| `tagInfo` | object | 標籤資訊（顯示在卡片頂部） | 見下方 |
| `matchStats` | object | 配對統計數據 | 見下方 |
| `preferences` | string[] | 用戶偏好列表（4-5 項，不包含已在標籤中的資訊） | `["從事影視業，作息不固定", ...]` |
| `suitableFor` | object | 適合什麼樣的人 | 見下方 |
| `pronoun` | string | 代名詞（用於文案） | `"他"` / `"她"` / `"TA"` |

### `tagInfo` 物件

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| `gender` | string | 生理性別 | `"生理女"` / `"生理男"` / `"非二元"` |
| `highlightFeature` | string | 最突出的特徵（養寵物 > 職業 > 其他） | `"養馬爾濟斯"` / `"行銷工作者"` / `"現有空間找室友"` |
| `highlightEmoji` | string? | 選填：對應特徵的 emoji | `"🐕"` / `"💼"` |

### `matchStats` 物件

| 欄位 | 類型 | 說明 | 計算方式 |
|------|------|------|----------|
| `averageMatchScore` | number | 平均契合度（0-100） | 該用戶與系統內所有其他用戶的配對分數平均值 |
| `potentialMatchCount` | number | 潛在配對數量 | 配對分數 ≥ 60 的用戶數量 |

### `suitableFor` 物件

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| `description` | string | 適合的室友類型描述 | `"台北市、性別不拘、能接受寵物、重視清潔的人"` |
| `location` | string | 地點偏好摘要 | `"台北市區"` / `"中正區、萬華區、板橋區"` |
| `budgetRange` | string | 預算範圍 | `"$10k–$12k"` |

---

## 資料產生邏輯

### 1. `highlightFeature` 優先順序

```
1. 寵物（最優先）
   - 如果 q11_pets 包含「有養」→ "養{寵物種類}"

2. 職業/身分
   - 從 q6_bio 提取職業關鍵字
   - 例：「從事影視業」→ "影視工作者"

3. 特殊居住狀態
   - 如果 bio 提到「現有空間」→ "現有空間找室友"

4. 其他顯著特徵
   - 極端作息（q12_schedule）
   - 特殊需求（q17_allergies）
```

### 2. `preferences` 生成規則

**必須排除**已在 `tagInfo` 中出現的資訊，避免重複！

**建議來源**:
- q12_schedule（作息）
- q9_cleaning（清潔習慣）
- q10_visitors（訪客態度）
- q8_noise（噪音敏感度）
- q13_interaction（互動偏好）
- q6_bio（特殊需求或期待）

**範例**:
```javascript
// ❌ 錯誤：重複標籤資訊
tagInfo: { highlightFeature: "養馬爾濟斯" }
preferences: ["養寵物", "從事影視業"] // 「養寵物」重複了！

// ✅ 正確：排除重複
tagInfo: { highlightFeature: "養馬爾濟斯" }
preferences: ["從事影視業，作息不固定", "看到髒就立刻掃"] // 沒有重複提寵物
```

### 3. `suitableFor.description` 生成邏輯

根據該用戶的偏好，反向描述「什麼樣的人適合跟他住」：

```typescript
// 範例邏輯
const description = [
  user.q4_location_pref.length > 2 ? "台北市" : user.q4_location_pref.join("、"),
  genderPreferenceToText(user.q3_gender_pref), // "性別不拘" / "性別認同女性"
  user.q11_pets.includes("有養") ? "能接受寵物" : "",
  user.q9_cleaning.includes("立刻掃") ? "重視清潔" : "",
].filter(Boolean).join("、") + "的人";
```

### 4. `averageMatchScore` 計算

```typescript
// 後端計算邏輯
const allOtherUsers = await User.find({ userId: { $ne: currentUser.userId } });
const scores = allOtherUsers.map(otherUser =>
  calculateMatchScore(currentUser, otherUser)
);
const averageMatchScore = Math.round(
  scores.reduce((sum, score) => sum + score, 0) / scores.length
);
```

### 5. `potentialMatchCount` 計算

```typescript
const potentialMatchCount = scores.filter(score => score >= 60).length;
```

---

## 錯誤回應

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "sortBy must be one of: averageScore, potentialMatches, newest"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Failed to calculate match scores"
  }
}
```

---

## 實作注意事項

### 性能優化

1. **快取策略**:
   - `averageMatchScore` 和 `potentialMatchCount` 可以在用戶資料更新時預先計算並存入資料庫
   - 避免每次 API 請求都重新計算所有配對分數

2. **批次查詢**:
   - 使用批次查詢一次載入所有需要的用戶資料
   - 避免 N+1 查詢問題

3. **索引建議**:
   ```javascript
   // MongoDB 索引範例
   db.users.createIndex({ averageMatchScore: -1 })
   db.users.createIndex({ potentialMatchCount: -1 })
   db.users.createIndex({ createdAt: -1 })
   ```

### 資料隱私

- ❌ **不要**暴露用戶的 email
- ❌ **不要**暴露用戶的精確地址
- ✅ **可以**顯示行政區級別的地點偏好
- ✅ **可以**顯示預算範圍

---

## 測試範例

### cURL 範例

```bash
# 基本查詢
curl -X GET "http://localhost:3000/api/user-profiles/browse"

# 分頁查詢
curl -X GET "http://localhost:3000/api/user-profiles/browse?limit=10&offset=0"

# 依潛在配對數排序
curl -X GET "http://localhost:3000/api/user-profiles/browse?sortBy=potentialMatches"
```

### TypeScript 型別定義

```typescript
export interface BrowseUserCard {
  userId: string;
  tagInfo: {
    gender: '生理女' | '生理男' | '非二元';
    highlightFeature: string;
    highlightEmoji?: string;
  };
  matchStats: {
    averageMatchScore: number;  // 0-100
    potentialMatchCount: number;
  };
  preferences: string[];  // 4-5 items
  suitableFor: {
    description: string;
    location: string;
    budgetRange: string;
  };
  pronoun: '他' | '她' | 'TA';
}

export interface BrowseModeResponse {
  success: boolean;
  data: BrowseUserCard[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
```

---

**最後更新**: 2025-12-06
**文件版本**: 1.0
**負責人**: Backend Team
