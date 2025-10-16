import React from 'react';
import { TrendingUp, Search } from 'lucide-react';
import { ViewMode } from '../types';

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

/**
 * 視圖模式選擇器組件
 * 允許用戶在「查看所有配對」和「個別查詢」之間切換
 */
export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  currentMode,
  onModeChange
}) => {
  return (
    <div className="view-mode-selector">
      <button
        className={`mode-button ${currentMode === 'all' ? 'active' : ''}`}
        onClick={() => onModeChange('all')}
      >
        <TrendingUp size={20} />
        <span>查看所有配對</span>
      </button>

      <button
        className={`mode-button ${currentMode === 'individual' ? 'active' : ''}`}
        onClick={() => onModeChange('individual')}
      >
        <Search size={20} />
        <span>個別查詢</span>
      </button>
    </div>
  );
};
