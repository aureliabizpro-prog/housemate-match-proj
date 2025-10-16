# 系統架構概覽

## 架構設計理念

### 核心原則
1. **模組化** - 功能分散在獨立模組中
2. **可維護性** - 代碼清晰，易於理解和修改
3. **可擴展性** - 容易添加新功能
4. **可測試性** - 每個模組可獨立測試
5. **類型安全** - 完整的 TypeScript 支持

---

## 架構層次

```
┌─────────────────────────────────────────────┐
│          Presentation Layer (UI)             │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │MatchCard │  │ Slider   │  │ Selector │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                              │
│              App.tsx (主組件)                │
└─────────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────┐
│          Business Logic Layer                │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │  matchingAlgorithm.ts               │   │
│  │  - calculateMatchScore()            │   │
│  │  - findAllMatches()                 │   │
│  │  - findMatchesForUser()             │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────┐
│            Data Layer                        │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │  users.ts                           │   │
│  │  - users[]                          │   │
│  │  - getUserById()                    │   │
│  │  - getAllUserIds()                  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────┐
│            Type System                       │
│                                              │
│  types/index.ts - 所有類型定義              │
└─────────────────────────────────────────────┘
```

---

## 模組職責

### 1. Types Module (`src/types/`)
**職責:** 定義系統中所有的數據結構和類型

**主要類型:**
- `User` - 用戶基本信息
- `MatchResult` - 配對結果
- `ScoreBreakdown` - 分數細分
- `ViewMode` - 視圖模式

**特點:**
- 純類型定義，無業務邏輯
- 被所有其他模組引用
- 確保類型安全

---

### 2. Utils Module (`src/utils/`)
**職責:** 包含所有業務邏輯和算法

**主要功能:**
- 配對分數計算
- 配對結果查找
- 數據處理工具

**特點:**
- 純函數實現
- 無副作用
- 易於測試
- 可在其他項目中重用

---

### 3. Data Module (`src/data/`)
**職責:** 管理應用數據

**主要功能:**
- 存儲用戶數據
- 提供數據訪問接口
- 數據轉換和驗證

**擴展點:**
- 可替換為 API 調用
- 可添加緩存層
- 可實現數據持久化

---

### 4. Components Module (`src/components/`)
**職責:** 可重用的 UI 組件

**設計原則:**
- 每個組件職責單一
- Props 接口清晰
- 樣式獨立可配置
- 無業務邏輯依賴

**組件列表:**
- `MatchCard` - 配對卡片展示
- `ScoreSlider` - 分數控制滑桿
- `ViewModeSelector` - 視圖模式切換
- `UserSelector` - 用戶選擇下拉框
- `StatsDisplay` - 統計信息展示

---

## 數據流向

### 查看所有配對模式

```
1. 用戶調整 minScore
        ↓
2. App.tsx 觸發 useMemo
        ↓
3. 調用 findAllMatches(users, minScore)
        ↓
4. 遍歷所有用戶對，計算配對分數
        ↓
5. 過濾並排序結果
        ↓
6. 渲染 MatchCard 組件列表
```

### 個別查詢模式

```
1. 用戶選擇特定用戶
        ↓
2. App.tsx 觸發 useMemo
        ↓
3. 調用 getUserById(selectedUserId)
        ↓
4. 調用 findMatchesForUser(targetUser, users, 5)
        ↓
5. 計算該用戶與所有其他用戶的配對分數
        ↓
6. 返回前 5 個最佳配對
        ↓
7. 渲染 MatchCard 組件列表
```

---

## 狀態管理

### 當前方案: React Hooks + useMemo

**主要狀態:**
```typescript
const [viewMode, setViewMode] = useState<ViewMode>('all');
const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
const [minScore, setMinScore] = useState<number>(60);
```

**計算屬性:**
```typescript
const allMatches = useMemo(() =>
  findAllMatches(users, minScore),
  [minScore]
);

const individualMatches = useMemo(() => {
  if (!selectedUserId) return [];
  const targetUser = getUserById(selectedUserId);
  if (!targetUser) return [];
  return findMatchesForUser(targetUser, users, 5);
}, [selectedUserId]);
```

**優點:**
- 簡單直觀
- 性能優化（useMemo）
- 適合中小型應用

**未來升級選項:**
- Context API（全局狀態共享）
- Redux（大型應用狀態管理）
- Zustand（輕量級狀態管理）

---

## 性能優化策略

### 1. 記憶化 (Memoization)
使用 `useMemo` 避免不必要的重新計算：
```typescript
const allMatches = useMemo(() =>
  findAllMatches(users, minScore),
  [minScore]
);
```

### 2. 組件優化
未來可添加 `React.memo` 包裝組件：
```typescript
export const MatchCard = React.memo<MatchCardProps>(({ ... }) => {
  // ...
});
```

### 3. 虛擬滾動
當配對結果過多時，可引入虛擬滾動庫：
```bash
npm install react-window
```

---

## 安全考慮

### 1. 類型安全
- 完整的 TypeScript 類型定義
- 編譯時錯誤檢查

### 2. 數據驗證
未來可添加運行時驗證：
```typescript
import { z } from 'zod';

const UserSchema = z.object({
  userId: z.string(),
  q1_gender_identity: z.string(),
  // ...
});
```

### 3. XSS 防護
- React 自動轉義輸出
- 避免使用 `dangerouslySetInnerHTML`

---

## 測試策略

### 單元測試
```typescript
// src/utils/__tests__/matchingAlgorithm.test.ts
describe('calculateMatchScore', () => {
  it('should return 0 if gender preferences do not match', () => {
    // ...
  });
});
```

### 組件測試
```typescript
// src/components/__tests__/MatchCard.test.tsx
describe('MatchCard', () => {
  it('should render user information correctly', () => {
    // ...
  });
});
```

### 集成測試
測試完整的數據流程

---

## 部署架構

### 開發環境
```
Vite Dev Server (HMR)
↓
http://localhost:5173
```

### 生產環境
```
npm run build
↓
dist/ (靜態文件)
↓
部署到:
- Vercel
- Netlify
- GitHub Pages
- 自有服務器
```

---

## 擴展點設計

### 1. API 整合
```typescript
// src/data/api.ts (未來添加)
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  return response.json();
}
```

### 2. 認證系統
```typescript
// src/auth/AuthContext.tsx (未來添加)
export const AuthProvider: React.FC = ({ children }) => {
  // ...
};
```

### 3. 即時通訊
```typescript
// src/chat/ChatModule.tsx (未來添加)
export const ChatModule: React.FC = () => {
  // WebSocket connection
};
```

---

## 依賴管理

### 核心依賴
- `react` - UI 框架
- `react-dom` - DOM 渲染
- `lucide-react` - 圖標庫

### 開發依賴
- `typescript` - 類型系統
- `vite` - 構建工具
- `@vitejs/plugin-react` - React 插件

### 未來可能添加
- `axios` - HTTP 客戶端
- `react-query` - 數據獲取
- `zod` - 數據驗證
- `vitest` - 測試框架

---

## 最佳實踐

### 1. 命名規範
- 組件: PascalCase (`MatchCard`)
- 函數: camelCase (`calculateScore`)
- 常量: UPPER_SNAKE_CASE (`MAX_SCORE`)
- 文件: kebab-case (`matching-algorithm.ts`)

### 2. 文件組織
- 一個文件一個組件
- 相關功能放在同一目錄
- 使用 `index.ts` 統一導出

### 3. 類型優先
- 先定義類型，再實現功能
- 避免使用 `any`
- 利用類型推斷

---

## 參考資源

- [React 官方文檔](https://react.dev)
- [TypeScript 手冊](https://www.typescriptlang.org/docs/)
- [Vite 指南](https://vitejs.dev/guide/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
