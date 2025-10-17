# Claude.md - 室友配對分析系統開發文檔

> **當前版本:** 1.0.0
> **最後更新:** 2025-10-17
> **維護者:** Sabrina Yang
> **Git Commit:** `8848a29`

---

## 📋 版本歷史與變更記錄

### Version 1.0.0 (2025-10-17) - Initial Release

**Git Commits:**
- `8848a29` - docs: 新增完整的模組化文檔系統
- `100c6e4` - refactor: 重構為模組化架構

#### 🎯 版本目的
建立完整的室友配對分析系統，採用模組化架構設計，確保代碼可維護性和可擴展性。

#### ✨ 主要內容

**1. 核心功能實現**
- 多維度配對評分系統（性別偏好 40 分、地點 20 分、預算 15 分、生活習慣 25 分）
- 查看所有高分配對功能（可調整分數門檻 50-90%）
- 個別用戶查詢功能（顯示前 5 個最佳配對）
- 響應式 UI 設計（支援桌面和移動裝置）
- 實時數據過濾和排序

**2. 模組化架構**

```
src/
├── types/              # 類型定義模組
│   └── index.ts        # User, MatchResult, ViewMode 等核心類型
│
├── utils/              # 工具函數模組
│   └── matchingAlgorithm.ts
│       ├── calculateMatchScore()          # 計算配對分數
│       ├── checkGenderPreferenceMatch()   # 性別偏好檢查
│       ├── calculateLocationScore()       # 地點匹配評分
│       ├── calculateBudgetScore()         # 預算匹配評分
│       ├── calculateLifestyleScore()      # 生活習慣評分
│       ├── findAllMatches()              # 查找所有配對
│       └── findMatchesForUser()          # 個別用戶配對查詢
│
├── data/               # 數據管理模組
│   └── users.ts
│       ├── users[]                # 9 位用戶數據
│       ├── getUserById()          # 根據 ID 查找用戶
│       └── getAllUserIds()        # 獲取所有用戶 ID
│
├── components/         # UI 組件模組
│   ├── MatchCard.tsx           # 配對卡片展示（含排名、分數、用戶信息）
│   ├── ScoreSlider.tsx         # 分數滑桿控制（50-90，步進 5）
│   ├── ViewModeSelector.tsx    # 視圖模式切換（全部/個別）
│   ├── UserSelector.tsx        # 用戶選擇下拉選單
│   ├── StatsDisplay.tsx        # 統計信息展示（用戶數、配對數）
│   └── index.ts               # 組件統一導出
│
├── App.tsx             # 主應用組件（整合所有模組）
└── styles.css          # 全局樣式（紫粉色系，漸層背景）
```

**3. 完整文檔系統**

```
docs/
├── architecture/
│   └── overview.md              # 系統架構詳解
│       ├── 架構層次圖
│       ├── 模組職責說明
│       ├── 數據流向分析
│       ├── 狀態管理策略
│       ├── 性能優化建議
│       └── 擴展點設計
│
├── api/
│   ├── types.md                 # TypeScript 類型定義文檔
│   │   ├── GenderPreference
│   │   ├── Location
│   │   ├── BudgetRange
│   │   ├── LifestyleAnswer
│   │   ├── User
│   │   ├── MatchResult
│   │   ├── ScoreBreakdown
│   │   └── ViewMode
│   │
│   ├── matching-algorithm.md    # 配對算法 API 文檔
│   │   ├── 所有函數簽名和參數說明
│   │   ├── 評分規則詳解
│   │   ├── 使用範例
│   │   ├── 性能優化建議
│   │   └── 測試策略
│   │
│   └── data-management.md       # 數據管理 API 文檔
│       ├── 數據訪問接口
│       ├── API 整合建議
│       ├── 緩存策略
│       └── CRUD 操作範例
│
└── components/
    └── ui-components.md         # UI 組件使用指南
        ├── 5 個組件完整說明
        ├── Props 接口定義
        ├── 視覺結構圖
        ├── 使用範例
        ├── 自定義建議
        └── 測試範例
```

**4. 配置文件**
- `package.json` - 項目依賴配置（React 18, TypeScript, Vite, Lucide React）
- `tsconfig.json` - TypeScript 編譯配置（嚴格模式、ES2020）
- `vite.config.ts` - Vite 構建配置（React 插件）
- `.gitignore` - Git 忽略規則（node_modules, dist, .env 等）
- `README.md` - 項目說明文檔

**5. 技術規格**
- **前端框架**: React 18 + TypeScript 5.2
- **構建工具**: Vite 5.0
- **UI 圖標**: Lucide React
- **樣式方案**: 純 CSS（無預處理器）
- **類型檢查**: 完整的 TypeScript 類型安全
- **代碼規範**: ESLint + Prettier（待添加）

#### 📊 數據統計
- **總文件數**: 21 個
- **總代碼行數**: ~6,000 行
- **用戶數據**: 9 位測試用戶
- **配對算法**: 4 個維度評分
- **UI 組件**: 5 個可重用組件
- **文檔頁數**: 6 個詳細文檔

#### 🎨 設計特色
- **配色方案**: 紫色 (#a855f7) + 粉色 (#ec4899) 主題
- **漸層背景**: 粉紫色漸層 (#fce7f3 → #e9d5ff)
- **卡片設計**: 白色卡片 + 陰影效果 + hover 動畫
- **響應式**: 移動裝置和桌面完全適配
- **圖標系統**: Lucide React 提供一致的圖標風格

---

## 📚 文檔導航

### 核心文檔
- [專案概述](#專案概述) - 系統介紹和功能說明
- [快速開始](#快速開始) - 安裝和運行指南
- [專案結構](#專案結構) - 目錄結構說明
- [模組化設計原則](#模組化設計原則) - 架構設計理念

### 架構文檔
- [系統架構詳解](docs/architecture/overview.md)
  - 架構層次圖
  - 模組職責
  - 數據流向
  - 狀態管理
  - 性能優化

### API 文檔
- [類型定義](docs/api/types.md) - TypeScript 接口和類型
- [配對算法](docs/api/matching-algorithm.md) - 配對演算法詳細說明
- [數據管理](docs/api/data-management.md) - 數據結構和訪問方法

### 組件文檔
- [UI 組件庫](docs/components/ui-components.md) - 所有可重用組件
- MatchCard - 配對卡片
- ScoreSlider - 分數滑桿
- ViewModeSelector - 視圖切換器
- UserSelector - 用戶選擇器
- StatsDisplay - 統計展示

---

## 專案概述

### 🎯 專案目標
建立一個智能化的室友配對平台，通過多維度評分系統幫助用戶找到最合適的室友，提升合租體驗。

### ✨ 核心功能

#### 1. 多維度配對評分（總分 100）
- **性別/性傾向偏好 (40 分)** - 雙向匹配檢查，支援 ANY/GIF_ONLY/GIM_ONLY/SAF_ONLY/SAM_ONLY
- **地點偏好重疊 (20 分)** - 檢查台北 12 個行政區的重疊
- **預算範圍匹配 (15 分)** - 4 個預算區間（10k-15k, 15k-20k, 20k-25k, 25k+）
- **生活習慣相似度 (25 分)** - 5 個問題（清潔、訪客、寵物、作息、互動）

#### 2. 查看所有高分配對
- 顯示所有超過門檻的配對組合
- 可調整最低分數門檻（50%-90%，步進 5%）
- 按分數降序排列
- 顯示配對排名
- 當前數據顯示 22 組高分配對（門檻 60%）

#### 3. 個別用戶查詢
- 選擇特定用戶查看其最佳配對
- 顯示前 5 個最佳配對
- 即時計算配對分數
- 顯示詳細的用戶信息

#### 4. 響應式設計
- 支援桌面瀏覽器（1200px+）
- 支援平板裝置（768px-1200px）
- 支援手機裝置（<768px）
- 流暢的動畫效果

### 🛠 技術棧

```
├─ 前端框架      React 18.2.0
├─ 類型系統      TypeScript 5.2.2
├─ 構建工具      Vite 5.0.8
├─ UI 圖標       Lucide React
├─ 樣式方案      純 CSS（模組化）
└─ 開發環境      Node.js 16+, npm 8+
```

### 📈 系統數據
- 總用戶數: 9
- 配對組合數: 36（9 選 2 的組合）
- 高分配對數: 22（分數 ≥ 60%）
- 最高配對分數: 94%（han911522 ↔ viviloveexce）

---

## 快速開始

### 環境要求
```bash
Node.js >= 16.x
npm >= 8.x
```

### 安裝步驟

**1. 克隆倉庫**
```bash
git clone <repository-url>
cd housemate-match-proj
```

**2. 安裝依賴**
```bash
npm install
```

**3. 啟動開發服務器**
```bash
npm run dev
```
服務器啟動後訪問: http://localhost:5173/

**4. 構建生產版本**
```bash
npm run build
```
構建產物位於 `dist/` 目錄

**5. 預覽生產構建**
```bash
npm run preview
```

### 可用指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發服務器（HMR 支援） |
| `npm run build` | 構建生產版本 |
| `npm run preview` | 預覽生產構建 |

---

## 專案結構

### 完整目錄樹

```
housemate-match-proj/
│
├── src/                          # 源代碼目錄
│   ├── types/                    # 類型定義模組
│   │   └── index.ts              # 核心類型接口
│   │
│   ├── utils/                    # 工具函數模組
│   │   └── matchingAlgorithm.ts  # 配對算法實現
│   │
│   ├── data/                     # 數據管理模組
│   │   └── users.ts              # 用戶數據和訪問函數
│   │
│   ├── components/               # UI 組件模組
│   │   ├── MatchCard.tsx         # 配對卡片
│   │   ├── ScoreSlider.tsx       # 分數滑桿
│   │   ├── ViewModeSelector.tsx  # 視圖切換器
│   │   ├── UserSelector.tsx      # 用戶選擇器
│   │   ├── StatsDisplay.tsx      # 統計展示
│   │   └── index.ts              # 組件統一導出
│   │
│   ├── App.tsx                   # 主應用組件
│   └── styles.css                # 全局樣式
│
├── docs/                         # 文檔目錄
│   ├── architecture/             # 架構文檔
│   │   └── overview.md
│   ├── api/                      # API 文檔
│   │   ├── types.md
│   │   ├── matching-algorithm.md
│   │   └── data-management.md
│   └── components/               # 組件文檔
│       └── ui-components.md
│
├── main.tsx                      # 應用入口
├── index.html                    # HTML 模板
├── package.json                  # 項目配置
├── package-lock.json             # 依賴鎖定文件
├── vite.config.ts                # Vite 配置
├── tsconfig.json                 # TypeScript 配置
├── tsconfig.node.json            # Node TypeScript 配置
├── .gitignore                    # Git 忽略規則
├── README.md                     # 項目說明
├── claude.md                     # 本文件（開發文檔）
└── roommate_matching.tsx         # 原始單文件版本（保留作為參考）
```

---

## 模組化設計原則

### 1. 關注點分離 (Separation of Concerns)
每個模組負責單一職責：
- **types/** - 只定義數據結構和類型
- **utils/** - 只包含純函數邏輯，無副作用
- **data/** - 只管理數據存取
- **components/** - 只處理 UI 呈現和用戶交互

### 2. 高內聚低耦合
- 模組內部功能高度相關
- 模組間依賴最小化
- 通過明確的接口通信
- 易於單元測試

### 3. 可擴展性
- 新增功能只需添加新模組
- 不影響現有代碼
- 支援插件化擴展
- 易於版本控制

### 4. 可維護性
- 代碼結構清晰
- 命名規範一致
- 完整的類型註解
- 詳細的文檔說明

### 5. 可測試性
- 每個模組可獨立測試
- 純函數易於單元測試
- 組件可進行快照測試
- 支援集成測試

---

## 配對算法概覽

### 評分系統（總分 100）

| 維度 | 滿分 | 權重 | 說明 |
|------|------|------|------|
| 性別/性傾向偏好 | 40 | 40% | 必須雙向匹配，否則直接返回 0 |
| 地點偏好重疊 | 20 | 20% | 檢查地點數組交集，有重疊即得分 |
| 預算範圍匹配 | 15 | 15% | 預算區間完全相同即得分 |
| 生活習慣相似度 | 25 | 25% | 5 個問題，每題最高 5 分 |

### 算法特點
- **硬性條件**: 性別偏好不匹配時直接淘汰（分數為 0）
- **軟性條件**: 地點、預算、生活習慣採用累加計分
- **時間複雜度**: O(n²) 用於全部配對查找
- **空間複雜度**: O(m) m 為符合條件的配對數量

詳細算法說明請參考: [配對算法文檔](docs/api/matching-algorithm.md)

---

## 未來規劃

### Phase 2 - 後端整合 (計劃中)
- [ ] 設計 RESTful API 接口
- [ ] 用戶註冊和登錄系統
- [ ] 數據庫設計（PostgreSQL/MongoDB）
- [ ] JWT 認證機制
- [ ] 實時數據同步

### Phase 3 - 功能擴展 (計劃中)
- [ ] 用戶問卷填寫界面
- [ ] 配對結果導出（PDF/CSV）
- [ ] 收藏和屏蔽功能
- [ ] 聊天/通知系統
- [ ] 進階過濾選項（年齡、職業等）
- [ ] 個人資料頁面

### Phase 4 - 優化與增強 (計劃中)
- [ ] 性能優化（虛擬滾動、懶加載）
- [ ] SEO 優化
- [ ] PWA 支援（離線功能）
- [ ] 多語言支援（i18n）
- [ ] 深色模式
- [ ] 數據分析儀表板

### Phase 5 - 測試與部署 (計劃中)
- [ ] 單元測試（Vitest）
- [ ] 集成測試
- [ ] E2E 測試（Playwright）
- [ ] CI/CD 流程（GitHub Actions）
- [ ] Docker 容器化
- [ ] 雲端部署（Vercel/AWS）

---

## 開發指南

### Commit 規範
使用 Conventional Commits:

```
feat:     新功能
fix:      Bug 修復
docs:     文檔更新
style:    代碼格式調整（不影響功能）
refactor: 重構（不改變功能）
perf:     性能優化
test:     測試相關
chore:    構建/工具變動
```

範例:
```bash
git commit -m "feat: 添加用戶收藏功能"
git commit -m "fix: 修復配對分數計算錯誤"
git commit -m "docs: 更新 API 文檔"
```

### 分支策略
```
main        - 生產環境
develop     - 開發環境
feature/*   - 功能開發
bugfix/*    - Bug 修復
hotfix/*    - 緊急修復
```

### 代碼審查檢查清單
- [ ] 代碼符合 TypeScript 類型規範
- [ ] 新增功能有對應的文檔更新
- [ ] 關鍵函數有註釋說明
- [ ] 無 console.log 等調試代碼
- [ ] 無硬編碼的敏感信息
- [ ] 組件 Props 有明確的類型定義

---

## 常見問題 (FAQ)

### Q1: 如何添加新的用戶數據？
**A:** 編輯 `src/data/users.ts` 文件，在 `users` 數組中添加新的用戶對象：

```typescript
{
  userId: 'newuser123',
  q1_gender_identity: '女',
  q2_sex_at_birth: '女',
  q3_gender_pref: 'ANY',
  q4_location_pref: ['大安區'],
  q5_budget: '10k-15k',
  q6_bio: '個人簡介',
  q9_cleaning: '中立',
  q10_visitors: '中立',
  q11_pets: '中立',
  q12_schedule: '中立',
  q13_interaction: '中立'
}
```

### Q2: 如何修改配對算法的評分權重？
**A:** 修改 `src/utils/matchingAlgorithm.ts` 中的分數常量：

```typescript
// 當前權重
const GENDER_SCORE = 40;
const LOCATION_SCORE = 20;
const BUDGET_SCORE = 15;
const LIFESTYLE_SCORE = 25;

// 修改為自定義權重（確保總和為 100）
```

### Q3: 如何自定義 UI 顏色主題？
**A:** 修改 `src/styles.css` 中的顏色變數：

```css
/* 建議添加 CSS 變數 */
:root {
  --primary-color: #a855f7;
  --secondary-color: #ec4899;
  --background-gradient-start: #fce7f3;
  --background-gradient-end: #e9d5ff;
}
```

### Q4: 如何添加新的 UI 組件？
**A:**
1. 在 `src/components/` 創建新組件文件
2. 定義 Props 接口
3. 實現組件邏輯
4. 在 `src/components/index.ts` 中導出
5. 更新 `docs/components/ui-components.md` 文檔

### Q5: 如何連接後端 API？
**A:** 參考 [數據管理文檔](docs/api/data-management.md) 中的「API 整合」章節，使用 fetch 或 axios 替換靜態數據。

### Q6: 為什麼某些配對分數是 0？
**A:** 當兩個用戶的性別偏好不匹配時，配對分數會直接返回 0，因為這是硬性條件。

### Q7: 如何運行測試？
**A:** 測試框架尚未配置，計劃添加 Vitest。配置後運行：
```bash
npm run test
```

### Q8: 如何部署到生產環境？
**A:**
```bash
# 構建
npm run build

# 部署到 Vercel
npx vercel

# 或上傳 dist/ 目錄到任何靜態託管服務
```

---

## 貢獻指南

### 如何貢獻

1. **Fork 專案**
2. **創建功能分支**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **提交變更**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. **推送到分支**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **開啟 Pull Request**

### 貢獻類型
- 🐛 Bug 修復
- ✨ 新功能開發
- 📝 文檔改進
- 🎨 UI/UX 優化
- ⚡️ 性能優化
- ♿️ 無障礙改進
- 🌐 國際化支援

---

## 技術支援

### 聯絡方式
- **專案維護者**: Sabrina Yang
- **Email**: [待補充]
- **GitHub Issues**: [待補充]

### 相關資源
- [React 官方文檔](https://react.dev)
- [TypeScript 手冊](https://www.typescriptlang.org/docs/)
- [Vite 指南](https://vitejs.dev/guide/)
- [Lucide Icons](https://lucide.dev)

---

## 授權

MIT License

Copyright (c) 2025 Sabrina Yang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

---

## 致謝

感謝所有為這個專案做出貢獻的開發者和測試用戶。

---

**📖 延伸閱讀**
- [系統架構詳解](docs/architecture/overview.md)
- [配對算法 API](docs/api/matching-algorithm.md)
- [UI 組件指南](docs/components/ui-components.md)
- [類型定義文檔](docs/api/types.md)

---

**最後更新**: 2025-10-17
**文檔版本**: 1.0.0
**Git Commit**: 8848a29
