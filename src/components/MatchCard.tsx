import React from 'react';
import { User } from '../types';

interface MatchCardProps {
  user1: User;
  user2: User;
  score: number;
  rank?: number;
}

/**
 * 配對卡片組件
 * 顯示兩個用戶的匹配信息
 */
export const MatchCard: React.FC<MatchCardProps> = ({ user1, user2, score, rank }) => {
  return (
    <div className="match-card">
      {rank && (
        <div className="rank-badge">
          {rank}
        </div>
      )}
      <div className="score-display">
        {score}%
      </div>

      <div className="users-container">
        <UserInfo user={user1} />
        <div className="divider">↔</div>
        <UserInfo user={user2} />
      </div>
    </div>
  );
};

/**
 * 用戶信息子組件
 */
const UserInfo: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="user-info">
      <h3 className="user-id">{user.userId}</h3>
      <p className="user-gender">
        {user.q1_gender_identity} · {formatGenderPref(user.q3_gender_pref)}
      </p>
      <p className="user-location">
        📍 {user.q4_location_pref.join('、')}
      </p>
      {user.q6_bio && (
        <p className="user-bio">{user.q6_bio}</p>
      )}
    </div>
  );
};

/**
 * 格式化性別偏好顯示
 */
function formatGenderPref(pref: string): string {
  const mapping: Record<string, string> = {
    'ANY': '找不到',
    'GIF_ONLY': '找認同為女',
    'GIM_ONLY': '找認同為男',
    'SAF_ONLY': '找生理女',
    'SAM_ONLY': '找生理男'
  };
  return mapping[pref] || pref;
}
