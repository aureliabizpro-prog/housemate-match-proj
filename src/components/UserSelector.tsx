import React from 'react';
import { User } from '../types';

interface UserSelectorProps {
  users: User[];
  selectedUserId: string | null;
  onUserSelect: (userId: string) => void;
  label?: string;
}

/**
 * 用戶選擇器組件
 * 下拉選單讓用戶選擇要查詢的目標用戶
 */
export const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUserId,
  onUserSelect,
  label = '選擇用戶'
}) => {
  return (
    <div className="user-selector-container">
      <label className="selector-label">{label}：</label>
      <select
        value={selectedUserId || ''}
        onChange={(e) => onUserSelect(e.target.value)}
        className="user-select"
      >
        <option value="">-- 請選擇 --</option>
        {users.map((user) => (
          <option key={user.userId} value={user.userId}>
            {user.userId} ({user.q1_gender_identity})
          </option>
        ))}
      </select>
    </div>
  );
};
