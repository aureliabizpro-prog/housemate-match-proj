# Housemate Match v3 - Flowchart

```mermaid
flowchart TD
  %% 入口
  V[陌生訪客<br/>直接進站] --> B[Browse Mode<br/>單人卡列表<br/>平均契合度 / 潛在配對數<br/>偏好摘要 / 適合對象<br/>模糊地區 / 預算]
  V --> CTA_fill[CTA: 我想填 60 秒表<br/>→ 跳轉 Google Form]

  N[收到通知 Email<br/>附網站連結] --> S[訪問網站<br/>輸入 Email 搜尋]

  %% 填表後
  CTA_fill --> F1[Google Form 提交]
  F1 --> F2[提交頁提醒<br/>3 天內收到通知]
  F2 --> F3[等待 1-3 天]
  F3 --> F4[Agent 清洗/媒合<br/>push 到 usersData<br/>演算法 7 維度]
  F4 --> N

  %% 搜尋狀態機
  S -->|email 不在 usersData| ST_notFound[searchState = notFound<br/>彈窗 + Browse Mode]
  S -->|email 在 usersData| ST_calc[計算配對]
  ST_calc -->|有配對| ST_has[searchState = hasMatches<br/>顯示配對卡]
  ST_calc -->|無配對| ST_no[searchState = noMatches<br/>顯示「媒合中」訊息]

  %% 前端展示
  subgraph Frontend
    B
    M[Match Mode<br/>Top N 配對卡<br/>分數細項 / 為何推薦 / 生活習慣摘要<br/>CTA: 聯絡室友]
    W[「媒合中」卡片<br/>隱藏 Why Choose Us / CTA Survey]
  end
  ST_notFound --> B
  ST_has --> M
  ST_no --> W

  %% CTA 往返
  B --> CTA_fill
  M --> CTA_contact[CTA: 我要聯繫他]
  CTA_contact --> H2[後端代發留言<br/>附配對報告給對方]

  %% 後端管線與輸出
  subgraph Backend
    G1[Google Form 原始填答] --> G2[清洗 / 匯入]
    G2 --> G3[演算法 7 維度<br/>硬篩(性別/地區/預算/過敏/抽菸)<br/>+ 生活習慣向量]
    G3 --> GA[輸出 A: 單人卡資料<br/>平均契合度 / 潛在配對數<br/>偏好摘要 / 適合對象]
    G3 --> GB[輸出 B: 配對結果<br/>Top N 配對 + 分數拆解<br/>Why recommended / Lifestyle]
  end
  GA --> B
  GB --> M
  H2 -.-> GB
```

說明：
- 兩條入口：陌生訪客（直接瀏覽單人卡，CTA 填表）與已收到通知 Email 的用戶（直接輸入 email 查配對）。
- 填表後：提醒 3 天 → Agent 清洗/媒合 → push 到 usersData → 發通知 Email。
- 搜尋狀態機：notFound（未入庫或錯誤 email）/ noMatches / hasMatches；對應不同 UI。
- 兩種輸出：A 單人卡（瀏覽用），B 配對卡（email 搜尋用）。***
