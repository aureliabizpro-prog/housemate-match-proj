# UI 組件文檔

> **模組位置:** `src/components/`

## 概述

本系統包含 5 個可重用的 UI 組件，每個組件職責單一，易於維護和擴展。

---

## 組件列表

### `MatchCard`

配對卡片組件，展示兩個用戶的配對信息。

#### 位置
`src/components/MatchCard.tsx`

#### Props

```typescript
interface MatchCardProps {
  user1: User;           // 第一個用戶
  user2: User;           // 第二個用戶
  score: number;         // 配對分數 (0-100)
  rank?: number;         // 排名（可選）
}
```

#### 使用範例

```typescript
import { MatchCard } from '@/components';

function MatchList({ matches }: { matches: MatchResult[] }) {
  return (
    <div>
      {matches.map((match, index) => (
        <MatchCard
          key={`${match.user1.userId}-${match.user2.userId}`}
          user1={match.user1}
          user2={match.user2}
          score={match.score}
          rank={index + 1}
        />
      ))}
    </div>
  );
}
```

#### 視覺結構

```
┌─────────────────────────────────────────┐
│  [1]                          94%        │ ← rank & score
│                                          │
│  ┌──────────────┐     ┌──────────────┐ │
│  │  han911522   │  ↔  │ viviloveexce │ │
│  │  女 · 找不到 │     │ 男 · 找認同女 │ │
│  │  📍松山、中山 │     │ 📍中山       │ │
│  │  從事影視業...│     │ 34歲男性...  │ │
│  └──────────────┘     └──────────────┘ │
└─────────────────────────────────────────┘
```

#### 樣式類

- `.match-card` - 卡片容器
- `.rank-badge` - 排名徽章
- `.score-display` - 分數顯示
- `.users-container` - 用戶信息容器
- `.user-info` - 單個用戶信息
- `.user-id` - 用戶 ID
- `.user-gender` - 性別信息
- `.user-location` - 地點信息
- `.user-bio` - 個人簡介

#### 自定義

修改 `formatGenderPref()` 函數來自定義性別偏好顯示：

```typescript
function formatGenderPref(pref: string): string {
  const mapping: Record<string, string> = {
    'ANY': '不限',
    'GIF_ONLY': '找認同為女',
    // 添加更多映射...
  };
  return mapping[pref] || pref;
}
```

---

### `ScoreSlider`

分數滑桿組件，用於調整最低匹配分數門檻。

#### 位置
`src/components/ScoreSlider.tsx`

#### Props

```typescript
interface ScoreSliderProps {
  value: number;                    // 當前值
  onChange: (value: number) => void; // 變更回調
  min?: number;                     // 最小值（默認 50）
  max?: number;                     // 最大值（默認 90）
  step?: number;                    // 步進（默認 5）
  label?: string;                   // 標籤（默認 "最低分數"）
}
```

#### 使用範例

```typescript
import { ScoreSlider } from '@/components';
import { useState } from 'react';

function App() {
  const [minScore, setMinScore] = useState(60);

  return (
    <ScoreSlider
      value={minScore}
      onChange={setMinScore}
      min={50}
      max={90}
      step={5}
      label="最低分數"
    />
  );
}
```

#### 樣式類

- `.score-slider-container` - 容器
- `.slider-label` - 標籤
- `.slider` - 滑桿輸入

#### 自定義樣式

```css
.slider {
  /* 自定義軌道顏色 */
  background: linear-gradient(to right, #your-color-1, #your-color-2);
}

.slider::-webkit-slider-thumb {
  /* 自定義滑塊顏色 */
  background: #your-color;
}
```

---

### `ViewModeSelector`

視圖模式選擇器，在「查看所有配對」和「個別查詢」之間切換。

#### 位置
`src/components/ViewModeSelector.tsx`

#### Props

```typescript
interface ViewModeSelectorProps {
  currentMode: ViewMode;              // 當前模式
  onModeChange: (mode: ViewMode) => void; // 模式變更回調
}
```

#### 使用範例

```typescript
import { ViewModeSelector } from '@/components';
import { useState } from 'react';
import { ViewMode } from '@/types';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  return (
    <ViewModeSelector
      currentMode={viewMode}
      onModeChange={setViewMode}
    />
  );
}
```

#### 樣式類

- `.view-mode-selector` - 容器
- `.mode-button` - 按鈕
- `.mode-button.active` - 激活狀態

#### 圖標

使用 Lucide React 圖標：
- `TrendingUp` - 查看所有配對
- `Search` - 個別查詢

---

### `UserSelector`

用戶選擇器組件，下拉選單讓用戶選擇要查詢的目標用戶。

#### 位置
`src/components/UserSelector.tsx`

#### Props

```typescript
interface UserSelectorProps {
  users: User[];                     // 用戶列表
  selectedUserId: string | null;     // 當前選中的用戶 ID
  onUserSelect: (userId: string) => void; // 選擇回調
  label?: string;                    // 標籤（默認 "選擇用戶"）
}
```

#### 使用範例

```typescript
import { UserSelector } from '@/components';
import { useState } from 'react';
import { users } from '@/data/users';

function App() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <UserSelector
      users={users}
      selectedUserId={selectedUserId}
      onUserSelect={setSelectedUserId}
      label="選擇用戶"
    />
  );
}
```

#### 樣式類

- `.user-selector-container` - 容器
- `.selector-label` - 標籤
- `.user-select` - 下拉選單

#### 選項格式

每個選項顯示為：`userId (性別認同)`

例如：`han911522 (女)`

---

### `StatsDisplay`

統計信息顯示組件，展示系統概況數據。

#### 位置
`src/components/StatsDisplay.tsx`

#### Props

```typescript
interface StatsDisplayProps {
  totalUsers: number;    // 總用戶數
  totalMatches: number;  // 總配對數
}
```

#### 使用範例

```typescript
import { StatsDisplay } from '@/components';
import { users } from '@/data/users';

function App() {
  const matches = findAllMatches(users, 60);

  return (
    <StatsDisplay
      totalUsers={users.length}
      totalMatches={matches.length}
    />
  );
}
```

#### 視覺結構

```
┌─────────────────┐   ┌─────────────────┐
│ 👥 有效填答：9   │   │ ❤️  高分配對：22  │
└─────────────────┘   └─────────────────┘
```

#### 樣式類

- `.stats-container` - 容器
- `.stat-card` - 統計卡片
- `.stat-icon` - 圖標
- `.stat-content` - 內容
- `.stat-label` - 標籤
- `.stat-value` - 數值

#### 圖標

使用 Lucide React 圖標：
- `Users` - 用戶數
- `Heart` - 配對數

---

## 組件組合模式

### 完整應用範例

```typescript
import React, { useState, useMemo } from 'react';
import {
  MatchCard,
  ScoreSlider,
  ViewModeSelector,
  UserSelector,
  StatsDisplay
} from '@/components';
import { users, getUserById } from '@/data/users';
import { findAllMatches, findMatchesForUser } from '@/utils/matchingAlgorithm';
import { ViewMode } from '@/types';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [minScore, setMinScore] = useState<number>(60);

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

  const displayMatches = viewMode === 'all' ? allMatches : individualMatches;

  return (
    <div className="app-container">
      <h1>室友配對系統</h1>

      <StatsDisplay
        totalUsers={users.length}
        totalMatches={allMatches.length}
      />

      <ViewModeSelector
        currentMode={viewMode}
        onModeChange={setViewMode}
      />

      <ScoreSlider
        value={minScore}
        onChange={setMinScore}
      />

      {viewMode === 'individual' && (
        <UserSelector
          users={users}
          selectedUserId={selectedUserId}
          onUserSelect={setSelectedUserId}
        />
      )}

      <div className="matches-list">
        {displayMatches.map((match, index) => (
          <MatchCard
            key={`${match.user1.userId}-${match.user2.userId}`}
            user1={match.user1}
            user2={match.user2}
            score={match.score}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 設計原則

### 1. 單一職責

每個組件只做一件事：
- `MatchCard` 只負責展示配對
- `ScoreSlider` 只負責分數調整
- 等等...

### 2. Props 明確

所有 Props 都有明確的類型定義和用途說明。

### 3. 無業務邏輯

組件不包含配對算法等業務邏輯，只負責 UI 呈現。

### 4. 樣式獨立

所有樣式通過 CSS 類管理，易於自定義。

---

## 擴展建議

### 1. 添加載入狀態

```typescript
interface MatchCardProps {
  // 現有 props...
  loading?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  user1,
  user2,
  score,
  rank,
  loading = false
}) => {
  if (loading) {
    return <MatchCardSkeleton />;
  }

  // 正常渲染...
};
```

### 2. 添加點擊事件

```typescript
interface MatchCardProps {
  // 現有 props...
  onClick?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  // props...
  onClick
}) => {
  return (
    <div className="match-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {/* 內容 */}
    </div>
  );
};
```

### 3. 添加動畫

```typescript
import { motion } from 'framer-motion';

export const MatchCard: React.FC<MatchCardProps> = (props) => {
  return (
    <motion.div
      className="match-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 內容 */}
    </motion.div>
  );
};
```

---

## 測試範例

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MatchCard } from './MatchCard';

describe('MatchCard', () => {
  const mockUser1 = {
    userId: 'user1',
    q1_gender_identity: '女',
    // ...其他欄位
  };

  const mockUser2 = {
    userId: 'user2',
    q1_gender_identity: '男',
    // ...其他欄位
  };

  it('應該正確渲染用戶信息', () => {
    render(
      <MatchCard
        user1={mockUser1}
        user2={mockUser2}
        score={94}
        rank={1}
      />
    );

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
```

---

## 無障礙 (Accessibility)

### 改進建議

```typescript
// 添加 ARIA 標籤
<button
  className="mode-button"
  onClick={() => onModeChange('all')}
  aria-label="查看所有配對"
  aria-pressed={currentMode === 'all'}
>
  <TrendingUp size={20} aria-hidden="true" />
  <span>查看所有配對</span>
</button>

// 添加鍵盤導航
<div
  className="match-card"
  tabIndex={0}
  role="article"
  onKeyDown={(e) => {
    if (e.key === 'Enter' && onClick) {
      onClick();
    }
  }}
>
  {/* 內容 */}
</div>
```

---

## 相關文檔

- [樣式指南](./styling-guide.md)
- [系統架構](../architecture/overview.md)
- [最佳實踐](../guides/best-practices.md)
