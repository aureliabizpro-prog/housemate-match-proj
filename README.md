# 室友配對分析系統

一個模組化的室友配對系統，使用 React + TypeScript 開發。

## 專案結構

```
housemate-match-proj/
├── src/
│   ├── types/              # 類型定義
│   │   └── index.ts        # 所有 TypeScript 接口和類型
│   ├── utils/              # 工具函數
│   │   └── matchingAlgorithm.ts  # 配對算法邏輯
│   ├── data/               # 數據文件
│   │   └── users.ts        # 用戶數據
│   ├── components/         # UI 組件
│   │   ├── MatchCard.tsx   # 配對卡片組件
│   │   ├── ScoreSlider.tsx # 分數滑桿組件
│   │   ├── ViewModeSelector.tsx  # 視圖模式選擇器
│   │   ├── UserSelector.tsx      # 用戶選擇器
│   │   ├── StatsDisplay.tsx      # 統計顯示組件
│   │   └── index.ts        # 組件導出
│   ├── App.tsx             # 主應用組件
│   └── styles.css          # 全局樣式
├── main.tsx                # 應用入口
├── index.html              # HTML 模板
├── package.json            # 項目配置
├── vite.config.ts          # Vite 配置
└── tsconfig.json           # TypeScript 配置

```

## 模組化設計優勢

### 1. **類型安全** (`src/types/`)
- 所有數據結構都有明確的 TypeScript 類型定義
- 減少運行時錯誤，提高代碼可維護性

### 2. **可重用組件** (`src/components/`)
每個 UI 組件都是獨立的、可重用的：
- `MatchCard` - 顯示配對結果
- `ScoreSlider` - 分數調整滑桿
- `ViewModeSelector` - 視圖切換
- `UserSelector` - 用戶選擇下拉選單
- `StatsDisplay` - 統計資訊展示

### 3. **獨立的業務邏輯** (`src/utils/`)
配對算法與 UI 完全分離：
- `calculateMatchScore()` - 計算配對分數
- `findAllMatches()` - 找出所有配對
- `findMatchesForUser()` - 為特定用戶找配對
- 易於測試和修改算法

### 4. **數據層分離** (`src/data/`)
- 用戶數據集中管理
- 未來可輕鬆替換為 API 調用
- 提供輔助函數（如 `getUserById()`）

## 快速開始

### 安裝依賴
```bash
npm install
```

### 運行開發服務器
```bash
npm run dev
```

### 構建生產版本
```bash
npm run build
```

## 配對算法說明

### 分數計算（總分 100 分）

1. **性別/性傾向偏好 (40分)**
   - 必須雙向匹配，否則分數為 0
   - 支持：ANY, GIF_ONLY, GIM_ONLY, SAF_ONLY, SAM_ONLY

2. **地點偏好重疊 (20分)**
   - 有任何地點重疊即得分

3. **預算範圍匹配 (15分)**
   - 預算範圍相同即得分

4. **生活習慣匹配 (25分)**
   - 5個問題，每題最高5分：
     - q9_cleaning - 清潔習慣
     - q10_visitors - 訪客頻率
     - q11_pets - 寵物態度
     - q12_schedule - 作息時間
     - q13_interaction - 互動程度

## 未來擴展建議

### 1. API 整合
```typescript
// src/data/api.ts
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  return response.json();
}
```

### 2. 添加更多過濾條件
在 `src/utils/matchingAlgorithm.ts` 中添加新的評分函數

### 3. 用戶管理功能
創建 `src/components/UserForm.tsx` 讓用戶填寫問卷

### 4. 狀態管理
使用 Context API 或 Redux 管理全局狀態

### 5. 測試
```bash
# 添加測試框架
npm install -D vitest @testing-library/react

# 測試範例
// src/utils/__tests__/matchingAlgorithm.test.ts
```

## 技術棧

- **React 18** - UI 框架
- **TypeScript** - 類型安全
- **Vite** - 構建工具
- **Lucide React** - 圖標庫

## 貢獻

歡迎提交 Issue 和 Pull Request！
