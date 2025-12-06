# 產品需求文件 (PRD) - 室友配對功能 V3

## 版本歷史
*   **V1 (原始版本):** 基礎配對邏輯，性別篩選較為簡化。
*   **V2 (2025-10-02):** 強化性別篩選邏輯，引入生理性別與性別認同區分，增加性別友善與可見性設定，並明確化演算法細節。
*   **V3 (2025-10-02):** 整合所有問卷設計細節，包括租金預算、合租經驗、過敏原、抽菸習慣、噪音敏感度、衛浴使用偏好等，並明確定義缺失數據處理策略與相似度計算方式。

## 1. 核心配對演算法概覽

本產品採用兩層式配對演算法：
1.  **第一層 (硬條件分群):** 以「室友性別」、「地區」、「租金預算」、「過敏原」、「抽菸習慣」等硬性條件進行初步篩選，大幅縮小候選人範圍。
2.  **第二層 (相似度排序):** 從通過第一層篩選的候選人中，計算生活習慣向量的 Euclidean Distance，由低到高排序。

---

## 2. 第一層 (硬條件分群) - 篩選邏輯 (V3 更新)

### 2.1 用戶性別相關資訊收集

用戶需回答以下問題，以建立其性別相關檔案：

**Q1: 您的生理性別是？ (Your Sex Assigned at Birth)**
*   **目的:** 捕捉用戶的生理性別，以支持基於生理性別的偏好篩選。
*   **選項 (單選):**
    *   `SAM` (男性)
    *   `SAF` (女性)
    *   `PNTS_SAAB` (不願透露)
*   **數據類型:** String

**Q2: 您的性別認同是？ (Your Gender Identity)**
*   **目的:** 捕捉用戶的性別認同，以支持基於性別認同的偏好篩選，並體現性別友善。
*   **選項 (單選):**
    *   `M` (男性)
    *   `F` (女性)
    *   `NB` (非二元性別)
    *   `PNTS_GI` (不願透露)
    *   `OTHER_GI` (其他)
*   **數據類型:** String
*   **邏輯流:**
    *   如果 Q2 選擇 `M` 或 `F`，則跳過 Q3，直接進入 Q4。
    *   如果 Q2 選擇 `NB`, `PNTS_GI`, `OTHER_GI`，則導入 Q3。

**Q3: 可見性設定 (Visibility Settings) - *僅當 Q2 選擇 NB, PNTS_GI, OTHER_GI 時顯示***
*   **目的:** 賦予性別認同非二元的用戶自主權，決定他們是否願意被有嚴格性別偏好的用戶看見。
*   **給用戶看的題目:** 「為了幫助您找到合適的室友，您是否願意被以下**偏好類型**的用戶看見？(可複選)」
*   **選項 (多選):**
    *   `visible_to_GIM_pref` (願意被尋找「性別認同為男性」室友的用戶看見)
    *   `visible_to_GIF_pref` (願意被尋找「性別認同為女性」室友的用戶看見)
    *   `visible_to_SAM_pref` (願意被尋找「生理男性」室友的用戶看見)
    *   `visible_to_SAF_pref` (願意被尋找「生理女性」室友的用戶看見)
*   **數據類型:** Boolean (每個選項獨立儲存為 True/False)
*   **特殊處理:** 「願意被尋找『不拘』室友的用戶看見」此項**不顯示**在問卷中，但在演算法中，對於 `gender_identity` 為 `NB`, `PNTS_GI`, `OTHER_GI` 的用戶，系統會**預設其對「不拘」偏好者可見 (即 `visible_to_ANY_pref` 邏輯上為 `True`)**。

**Q4: 您希望尋找什麼性別的室友？ (Your Roommate Preference)**
*   **目的:** 捕捉用戶對室友性別的偏好，區分基於性別認同或生理性別。
*   **選項 (單選):**
    *   `GIM_ONLY` (限性別認同為男性)
    *   `GIF_ONLY` (限性別認同為女性)
    *   `SAM_ONLY` (限生理男性)
    *   `SAF_ONLY` (限生理女性)
    *   `ANY` (不拘)
*   **數據類型:** String

### 2.2 性別篩選演算法邏輯

核心原則：**用戶 A 和用戶 B 能夠互相看見，必須「同時」滿足以下兩個條件：**
1.  用戶 A 的性別（及其可見性設定）符合用戶 B 的性別偏好。
2.  用戶 B 的性別（及其可見性設定）符合用戶 A 的性別偏好。

#### 2.2.1 函數：`is_gender_compatible(seeker_preference, target_user)`

此函數判斷一個尋找者 (`seeker`) 的性別偏好 (`seeker_preference`)，是否能被一個目標用戶 (`target_user`) 滿足。

```python
def is_gender_compatible(seeker_preference, target_user):
    # 處理「不拘」偏好：任何目標用戶都滿足「不拘」
    if seeker_preference == 'ANY':
        return True

    is_target_non_binary_or_prefer_not_to_say = (
        target_user.gender_identity == 'NB' or
        target_user.gender_identity == 'PNTS_GI' or
        target_user.gender_identity == 'OTHER_GI'
    )

    if seeker_preference == 'GIM_ONLY':
        if target_user.gender_identity == 'M': return True
        if is_target_non_binary_or_prefer_not_to_say and target_user.visibility_settings.get('visible_to_GIM_pref', False): return True
        return False

    if seeker_preference == 'GIF_ONLY':
        if target_user.gender_identity == 'F': return True
        if is_target_non_binary_or_prefer_not_to_say and target_user.visibility_settings.get('visible_to_GIF_pref', False): return True
        return False

    if seeker_preference == 'SAM_ONLY':
        if target_user.sex_assigned_at_birth == 'SAM': return True
        if is_target_non_binary_or_prefer_not_to_say and target_user.visibility_settings.get('visible_to_SAM_pref', False): return True
        return False

    if seeker_preference == 'SAF_ONLY':
        if target_user.sex_assigned_at_birth == 'SAF': return True
        if is_target_non_binary_or_prefer_not_to_say and target_user.visibility_settings.get('visible_to_SAF_pref', False): return True
        return False

    return False
```

#### 2.2.2 函數：`can_see_each_other(UserA, UserB)`

此函數判斷兩個用戶 (`UserA` 和 `UserB`) 是否能互相看見，也就是是否通過性別的硬篩選。

```python
def can_see_each_other(UserA, UserB):
    a_prefers_b = is_gender_compatible(UserA.roommate_gender_preference, UserB)
    b_prefers_a = is_gender_compatible(UserB.roommate_gender_preference, UserA)
    return a_prefers_b and b_prefers_a
```

### 2.3 租金預算 (Rent Budget) - 硬性篩選

**Q5: 您的租金預算範圍是？**
*   **目的:** 捕捉用戶個人分攤的月租金預算範圍。
*   **選項 (單選):**
    *   `SHARE_LT8K` ($8,000 以下)
    *   `SHARE_8K_10K` ($8,000 - $10,000)
    *   `SHARE_10K_12K` ($10,001 - $12,000)
    *   `SHARE_12K_15K` ($12,001 - $15,000)
    *   `SHARE_15K_18K` ($15,001 - $18,000)
    *   `SHARE_18K_22K` ($18,001 - $22,000)
    *   `SHARE_GT22K` ($22,001 以上)
*   **數據類型:** String
*   **篩選邏輯:** 兩個用戶的租金預算區間必須有重疊，才通過此硬性篩選。

### 2.4 地區偏好 (Location Preferences) - 硬性篩選

**Q6: 您想在哪裡找房子？**
*   **目的:** 捕捉用戶理想的租屋地區。
*   **選項 (多選):** 台北市各行政區列表 (e.g., 大安區, 中山區, 信義區...)
*   **數據類型:** Array of Strings
*   **篩選邏輯:** 兩個用戶的偏好地區必須至少有一個重疊，才通過此硬性篩選。

### 2.5 過敏原 (Allergies) - 硬性篩選 (不可略過)

**Q7: 您是否有任何過敏原，需要室友特別注意或避免在共享空間出現？**
*   **目的:** 捕捉用戶的過敏原，確保健康與安全。
*   **選項 (多選):**
    *   `ALLERGY_NONE` (無)
    *   `ALLERGY_FOOD` (特定食物)
    *   `ALLERGY_PET_DANDER` (寵物毛髮/皮屑)
    *   `ALLERGY_DUST` (塵蟎)
    *   `ALLERGY_POLLEN` (花粉)
    *   `ALLERGY_CHEMICALS` (清潔劑/化學品)
    *   `ALLERGY_OTHER` (其他)
*   **數據類型:** Array of Strings (儲存勾選的選項)
*   **篩選邏輯:**
    *   如果用戶 A 勾選了 `ALLERGY_NONE`，則與任何用戶匹配。
    *   如果用戶 A 勾選了過敏原 X，而用戶 B 的數據顯示他**有過敏原 X**，則視為**匹配**（因為雙方都有意識並會共同避免）。
    *   如果用戶 A 勾選了過敏原 X，而用戶 B 的生活習慣或物品（例如 `q11_pets` 顯示養寵物，且 `ALLERGY_PET_DANDER` 被勾選）會引入過敏原 X，則構成**硬性不匹配**。
    *   如果用戶 A 勾選了過敏原 X，而用戶 B 沒有過敏原，且不會引入過敏原 X，則視為**匹配**。

### 2.6 抽菸習慣 (Smoking Habits) - 硬性篩選 (不可略過)

**Q8: 您是否有抽菸習慣？**
*   **目的:** 捕捉用戶的抽菸習慣，判斷是否與室友偏好衝突。
*   **選項 (單選):**
    *   `SMOKING_NONE` (無)
    *   `SMOKING_COMPLIANT_OUTDOORS` (有，但我會遵守協商後的居住公約，不在室內抽菸)
    *   `SMOKING_SOMETIMES_INDOORS` (有，有時候無法避免在室內抽菸)
*   **數據類型:** String
*   **篩選邏輯:**
    *   如果用戶 A 選擇 `SMOKING_NONE`，而用戶 B 選擇 `SMOKING_SOMETIMES_INDOORS`，則構成**硬性不匹配**。
    *   如果用戶 A 選擇 `SMOKING_NONE`，而用戶 B 選擇 `SMOKING_COMPLIANT_OUTDOORS`，則視為**匹配**（但 LLM 報告中需特別提醒）。
    *   如果用戶 A 選擇 `SMOKING_COMPLIANT_OUTDOORS`，而用戶 B 選擇 `SMOKING_SOMETIMES_INDOORS`，則構成**硬性不匹配**。
    *   其他組合依據雙方偏好判斷。

---

## 3. 第二層 (相似度排序) - 生活習慣向量 (V3 更新)

此部分邏輯與 V1 保持一致，在通過第一層硬性篩選的候選人中，計算生活習慣向量的 Euclidean Distance，由低到高排序。

### 3.1 處理缺失數據 (Imputation Strategy)

針對 1-5 分量尺的問題（包括生活習慣五個維度、噪音敏感度、衛浴使用偏好等），若用戶未填寫，其缺失值 (NaN) 將被填補為 **3** (即中立值)。此填補策略旨在確保即使數據不完整，用戶也能參與計算，並保持中立性。

### 3.2 生活習慣向量問題 (1-5 分量尺，可略過)

**Q9: 關於公共區域的整潔... (Cleaning Habits)**
*   **目的:** 捕捉用戶對公共區域整潔的習慣。
*   **選項 (1-5 分量尺):**
    *   1: 隨時保持整潔
    *   2: 習慣性整理
    *   3: 輪流或協調
    *   4: 較為隨性
    *   5: 週末再整理
*   **數據類型:** Integer

**Q10: 關於帶朋友回家... (Guest Policy)**
*   **目的:** 捕捉用戶對帶朋友回家或舉辦聚會的態度。
*   **選項 (1-5 分量尺):**
    *   1: 偏好個人空間
    *   2: 偶爾帶朋友
    *   3: 彈性配合
    *   4: 喜歡熱鬧
    *   5: 社交生活豐富
*   **數據類型:** Integer

**Q11: 關於寵物... (Pet Policy)**
*   **目的:** 捕捉用戶對於和寵物一起合租的態度。
*   **選項 (1-5 分量尺):**
    *   1: 完全不行
    *   2: 不排斥但不想養
    *   3: 喜歡但有條件
    *   4: 歡迎寵物
    *   5: 超級歡迎
*   **數據類型:** Integer

**Q12: 您的作息時間比較偏向？ (Daily Routine)**
*   **目的:** 捕捉用戶的作息時間。
*   **選項 (1-5 分量尺):**
    *   1: 早睡早起
    *   2: 規律但稍晚
    *   3: 彈性調整
    *   4: 晚睡晚起
    *   5: 夜貓子
*   **數據類型:** Integer

**Q13: 您期望和室友的互動模式是？ (Social Interaction)**
*   **目的:** 捕捉用戶對和室友互動的期望。
*   **選項 (1-5 分量尺):**
    *   1: 各自獨立
    *   2: 禮貌交流
    *   3: 偶爾互動
    *   4: 朋友模式
    *   5: 像家人一樣
*   **數據類型:** Integer

**Q14: 您對噪音的敏感度如何？ (Noise Sensitivity)**
*   **目的:** 捕捉用戶對生活噪音的敏感度。
*   **選項 (1-5 分量尺):**
    *   1: 極度敏感
    *   2: 較為敏感
    *   3: 一般敏感
    *   4: 不太敏感
    *   5: 完全不介意
*   **數據類型:** Integer

**Q15: 您對衛浴設備的使用偏好？ (Bathroom Usage Preference)**
*   **目的:** 捕捉用戶對衛浴設備使用時間的偏好。
*   **選項 (1-5 分量尺):**
    *   1: 有固定且不可妥協的時段
        *   **子問題:** 請具體說明您不可妥協的衛浴使用時段 (文字輸入)
    *   2: 有偏好的時段，但若室友有需求，可提前告知並協調。
    *   3: 彈性高，會配合室友時段，不介意錯開。
    *   4: 會主動規劃使用時間，以避開室友的熱門時段。
    *   5: 對使用時間完全沒有限制或偏好，隨時可用即可。
*   **數據類型:** Integer (主問題), String (子問題)

### 3.3 其他輔助資訊 (可略過)

**Q16: 你是否有與他人合租的經驗？ (Roommate Experience)**
*   **目的:** 了解用戶對共享生活的熟悉程度。
*   **選項 (單選):**
    *   `NO_EXPERIENCE` (從未有過合租經驗)
    *   `BRIEF_EXPERIENCE` (有過合租經驗，但時間不長 (一年以下))
    *   `EXTENDED_EXPERIENCE` (有過合租經驗，時間較長 (一年以上))
    *   `CURRENTLY_LIVING_SEEKING_NEW` (目前正與室友合租中，並尋找新的合租機會)
*   **數據類型:** String

**Q17: 簡單自我介紹 (Bio)**
*   **目的:** 捕捉演算法難以量化的個人特質和軟性偏好。
*   **數據類型:** String (自由文字)

---

## 4. 用戶數據結構 (User Data Structure) - 完整版

```json
User {
    "sex_assigned_at_birth": "SAM" | "SAF" | "PNTS_SAAB",
    "gender_identity": "M" | "F" | "NB" | "PNTS_GI" | "OTHER_GI",
    "visibility_settings": {
        "visible_to_GIM_pref": boolean,
        "visible_to_GIF_pref": boolean,
        "visible_to_SAM_pref": boolean,
        "visible_to_SAF_pref": boolean
    },
    "roommate_gender_preference": "GIM_ONLY" | "GIF_ONLY" | "SAM_ONLY" | "SAF_ONLY" | "ANY",
    "rent_budget_range": "SHARE_LT8K" | "SHARE_8K_10K" | "SHARE_10K_12K" | "SHARE_12K_15K" | "SHARE_15K_18K" | "SHARE_18K_22K" | "SHARE_GT22K",
    "location_preferences": [string],
    "allergies": ["ALLERGY_NONE" | "ALLERGY_FOOD" | "ALLERGY_PET_DANDER" | "ALLERGY_DUST" | "ALLERGY_POLLEN" | "ALLERGY_CHEMICALS" | "ALLERGY_OTHER"],
    "smoking_habit": "SMOKING_NONE" | "SMOKING_COMPLIANT_OUTDOORS" | "SMOKING_SOMETIMES_INDOORS",
    "q9_cleaning": 1 | 2 | 3 | 4 | 5, // 1-5分，關於公共區域整潔
    "q10_visitors": 1 | 2 | 3 | 4 | 5, // 1-5分，關於帶朋友回家
    "q11_pets": 1 | 2 | 3 | 4 | 5, // 1-5分，關於寵物
    "q12_schedule": 1 | 2 | 3 | 4 | 5, // 1-5分，關於作息時間
    "q13_interaction": 1 | 2 | 3 | 4 | 5, // 1-5分，關於和室友互動
    "q14_noise_sensitivity": 1 | 2 | 3 | 4 | 5, // 1-5分，關於噪音敏感度
    "q15_bathroom_pref": 1 | 2 | 3 | 4 | 5, // 1-5分，關於衛浴使用偏好
    "q15_bathroom_fixed_timeslot": string, // 衛浴不可妥協時段 (若有)
    "q16_roommate_experience": "NO_EXPERIENCE" | "BRIEF_EXPERIENCE" | "EXTENDED_EXPERIENCE" | "CURRENTLY_LIVING_SEEKING_NEW",
    "bio": string,
    "move_in_date": string // 預計入住時間 (格式如 YYYY-MM-DD)
}
```

---