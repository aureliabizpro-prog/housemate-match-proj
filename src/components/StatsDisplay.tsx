import React from 'react';
import { Users, Heart } from 'lucide-react';

interface StatsDisplayProps {
  totalUsers: number;
  totalMatches: number;
}

/**
 * 統計資訊顯示組件
 * 顯示有效填答人數和高分配對數量
 */
export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  totalUsers,
  totalMatches
}) => {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <Users className="stat-icon" size={24} />
        <div className="stat-content">
          <span className="stat-label">有效填答：</span>
          <span className="stat-value">{totalUsers}</span>
        </div>
      </div>

      <div className="stat-card">
        <Heart className="stat-icon" size={24} />
        <div className="stat-content">
          <span className="stat-label">高分配對：</span>
          <span className="stat-value">{totalMatches}</span>
        </div>
      </div>
    </div>
  );
};
