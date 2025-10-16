import React, { useState, useMemo } from 'react';
import { Heart } from 'lucide-react';
import './styles.css';

// 導入類型
import { ViewMode, MatchResult } from './types';

// 導入數據
import { users, getUserById } from './data/users';

// 導入工具函數
import { findAllMatches, findMatchesForUser } from './utils/matchingAlgorithm';

// 導入組件
import {
  MatchCard,
  ScoreSlider,
  ViewModeSelector,
  UserSelector,
  StatsDisplay
} from './components';

/**
 * 室友配對系統主組件
 */
const RoommateMatchingSystem: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [minScore, setMinScore] = useState<number>(60);

  // 計算所有配對（使用 useMemo 優化性能）
  const allMatches = useMemo(() => {
    return findAllMatches(users, minScore);
  }, [minScore]);

  // 計算個別用戶的配對
  const individualMatches = useMemo(() => {
    if (!selectedUserId) return [];
    const targetUser = getUserById(selectedUserId);
    if (!targetUser) return [];
    return findMatchesForUser(targetUser, users, 5);
  }, [selectedUserId]);

  // 根據視圖模式決定顯示的配對結果
  const displayMatches: MatchResult[] = viewMode === 'all' ? allMatches : individualMatches;

  return (
    <div className="app-container">
      {/* 頁首 */}
      <header className="app-header">
        <Heart className="header-icon" size={40} />
        <h1 className="app-title">室友配對分析系統</h1>
      </header>

      {/* 統計資訊 */}
      <StatsDisplay
        totalUsers={users.length}
        totalMatches={allMatches.length}
      />

      {/* 視圖模式選擇器 */}
      <ViewModeSelector
        currentMode={viewMode}
        onModeChange={setViewMode}
      />

      {/* 分數滑桿 */}
      <ScoreSlider
        value={minScore}
        onChange={setMinScore}
        label="最低分數"
      />

      {/* 個別查詢模式的用戶選擇器 */}
      {viewMode === 'individual' && (
        <UserSelector
          users={users}
          selectedUserId={selectedUserId}
          onUserSelect={setSelectedUserId}
          label="選擇用戶"
        />
      )}

      {/* 配對結果列表 */}
      <section className="matches-section">
        <h2 className="section-title">
          {viewMode === 'all' ? '高分配對列表' : '個別配對結果'}
        </h2>

        {displayMatches.length === 0 ? (
          <div className="no-matches">
            {viewMode === 'all'
              ? `沒有找到分數 ≥ ${minScore}% 的配對`
              : selectedUserId
              ? '沒有找到合適的配對'
              : '請選擇一個用戶查看配對結果'}
          </div>
        ) : (
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
        )}
      </section>
    </div>
  );
};

export default RoommateMatchingSystem;
