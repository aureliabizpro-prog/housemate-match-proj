// ============================================
// 好室友® V2.0.0 - 配對卡片組件
// 支援匿名化顯示 + 「了解更多生活細節」折疊功能
// ============================================

import React, { useState } from 'react';
import { Heart, MapPin, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { MatchResult, User } from '../types';
import { anonymizeUserId } from '../data/users';
import {
  getGenderDisplayLabel,
  getBudgetLabel,
  getScoreColor,
  getScoreRating,
  getCleaningLabel,
  getVisitorsLabel,
  getPetsLabel,
  getScheduleLabel,
  getInteractionLabel,
  getNoiseSensitivityLabel,
  getBathroomLabel,
  getSmokingLabel,
  getAllergiesDisplay,
  getExperienceLabel
} from '../utils/displayHelpers';

interface MatchCardProps {
  match: MatchResult;
  rank?: number;
}

/**
 * 配對卡片組件
 */
export const MatchCard: React.FC<MatchCardProps> = ({ match, rank }) => {
  const { user1, user2, score, breakdown, passHardFilters } = match;
  const scoreColor = getScoreColor(score);
  const scoreRating = getScoreRating(score);

  // 展開狀態
  const [expandedUser, setExpandedUser] = useState<'user1' | 'user2' | null>(null);

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '16px',
        border: passHardFilters ? '1px solid rgba(224, 142, 109, 0.2)' : '1px solid #e5e7eb',
        position: 'relative',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* 排名徽章 */}
      {rank && (
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            left: '20px',
            backgroundColor: '#E08E6D',
            color: 'white',
            borderRadius: '16px',
            padding: '4px 12px',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 2px 6px rgba(224,142,109,0.3)'
          }}
        >
          #{rank}
        </div>
      )}

      {/* 分數顯示 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          paddingTop: rank ? '8px' : '0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Heart
            size={24}
            fill={scoreColor}
            color={scoreColor}
            style={{ flexShrink: 0 }}
          />
          <div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: scoreColor,
                lineHeight: 1
              }}
            >
              {score}
            </div>
            <div style={{ fontSize: '12px', color: '#9E9E9E' }}>
              {scoreRating}
            </div>
          </div>
        </div>

        {!passHardFilters && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '500'
            }}
          >
            未通過篩選
          </div>
        )}
      </div>

      {/* 用戶配對顯示 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '16px',
          alignItems: 'start'
        }}
      >
        <UserCard
          user={user1}
          isExpanded={expandedUser === 'user1'}
          onToggleExpand={() => setExpandedUser(expandedUser === 'user1' ? null : 'user1')}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E08E6D',
            fontSize: '20px',
            fontWeight: '700',
            padding: '0 8px',
            marginTop: '20px'
          }}
        >
          ↔
        </div>

        <UserCard
          user={user2}
          isExpanded={expandedUser === 'user2'}
          onToggleExpand={() => setExpandedUser(expandedUser === 'user2' ? null : 'user2')}
        />
      </div>

      {/* 為什麼契合？ */}
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#FFF8F0',
          borderRadius: '10px',
          border: '1px solid rgba(224, 142, 109, 0.15)'
        }}
      >
        <h6
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#2D2D2D',
            marginBottom: '8px'
          }}
        >
          為什麼契合？
        </h6>
        <p style={{ fontSize: '12px', color: '#5A5A5A', lineHeight: '1.6' }}>
          {generateMatchReason(user1, user2, breakdown)}
        </p>
      </div>

      {/* 配對細節（可選展開） */}
      {passHardFilters && (
        <MatchBreakdown breakdown={breakdown} />
      )}
    </div>
  );
};

/**
 * 用戶卡片（支援展開生活細節）
 */
interface UserCardProps {
  user: User;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, isExpanded, onToggleExpand }) => {
  return (
    <div
      style={{
        backgroundColor: '#FFF8F0',
        borderRadius: '10px',
        padding: '16px',
        border: '1px solid rgba(224, 142, 109, 0.15)'
      }}
    >
      {/* 用戶 ID (匿名化) */}
      <h5
        style={{
          color: '#2D2D2D',
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '8px'
        }}
      >
        {anonymizeUserId(user.email || user.userId)}
      </h5>

      {/* 性別與偏好 */}
      <p style={{ fontSize: '13px', color: '#5A5A5A', marginBottom: '8px' }}>
        {getGenderDisplayLabel(user)}
      </p>

      {/* 地點 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px',
          marginBottom: '8px'
        }}
      >
        <MapPin size={14} color="#E08E6D" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontSize: '12px', color: '#5A5A5A' }}>
          {user.location_preferences.join('、')}
        </span>
      </div>

      {/* 預算 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '12px'
        }}
      >
        <DollarSign size={14} color="#E08E6D" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '12px', color: '#5A5A5A' }}>
          {getBudgetLabel(user.rent_budget_range)}
        </span>
      </div>

      {/* 推薦語 */}
      {user.recommendation && (
        <p
          style={{
            fontSize: '12px',
            color: '#5A5A5A',
            lineHeight: '1.5',
            fontStyle: 'italic',
            borderTop: '1px solid rgba(224, 142, 109, 0.15)',
            paddingTop: '12px',
            marginTop: '8px',
            marginBottom: '12px'
          }}
        >
          {user.recommendation}
        </p>
      )}

      {/* 了解更多按鈕 */}
      <button
        onClick={onToggleExpand}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #E08E6D',
          background: isExpanded ? '#FFF8F0' : 'white',
          color: '#E08E6D',
          fontSize: '12px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#FFF8F0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isExpanded ? '#FFF8F0' : 'white';
        }}
      >
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {isExpanded ? '收起' : '了解更多生活細節'}
      </button>

      {/* 展開的生活細節 */}
      {isExpanded && (
        <div
          style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(224, 142, 109, 0.15)'
          }}
        >
          <LifestyleDetail icon="🕐" label="作息" value={getScheduleLabel(user.q12_schedule)} />
          <LifestyleDetail icon="🧹" label="整潔" value={getCleaningLabel(user.q9_cleaning)} />
          <LifestyleDetail icon="👥" label="訪客" value={getVisitorsLabel(user.q10_visitors)} />
          <LifestyleDetail icon="🐱" label="寵物" value={getPetsLabel(user.q11_pets)} />
          <LifestyleDetail icon="💬" label="互動" value={getInteractionLabel(user.q13_interaction)} />
          <LifestyleDetail icon="🔇" label="噪音" value={getNoiseSensitivityLabel(user.q14_noise_sensitivity)} />
          <LifestyleDetail icon="🚿" label="衛浴" value={getBathroomLabel(user.q15_bathroom_pref)} />
          <LifestyleDetail icon="🏠" label="經驗" value={getExperienceLabel(user.q16_roommate_experience)} />
          <LifestyleDetail icon="🚭" label="抽菸" value={getSmokingLabel(user.smoking_habit)} />
          <LifestyleDetail icon="🤧" label="過敏" value={getAllergiesDisplay(user.allergies)} />
        </div>
      )}
    </div>
  );
};

/**
 * 生活細節項目
 */
interface LifestyleDetailProps {
  icon: string;
  label: string;
  value: string;
}

const LifestyleDetail: React.FC<LifestyleDetailProps> = ({ icon, label, value }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        marginBottom: '8px',
        fontSize: '12px'
      }}
    >
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: '600', color: '#2D2D2D' }}>{label}：</span>
        <span style={{ color: '#5A5A5A' }}>{value}</span>
      </div>
    </div>
  );
};

/**
 * 配對細節分析
 */
interface MatchBreakdownProps {
  breakdown: any;
}

const MatchBreakdown: React.FC<MatchBreakdownProps> = ({ breakdown }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ marginTop: '20px' }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '10px',
          background: 'transparent',
          border: '1px solid rgba(224, 142, 109, 0.2)',
          borderRadius: '8px',
          color: '#E08E6D',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(224, 142, 109, 0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {isExpanded ? '收起配對分析' : '查看配對分析'}
      </button>

      {isExpanded && (
        <div
          style={{
            marginTop: '12px',
            padding: '16px',
            backgroundColor: '#FFF8F0',
            borderRadius: '8px',
            border: '1px solid rgba(224, 142, 109, 0.15)'
          }}
        >
          <h6
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#2D2D2D',
              marginBottom: '12px'
            }}
          >
            配對條件
          </h6>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <FilterItem
              label="性別偏好"
              passed={breakdown.genderCompatible}
            />
            <FilterItem
              label="地點重疊"
              passed={breakdown.locationOverlap > 0}
              detail={breakdown.locationOverlap > 0 ? `${breakdown.locationOverlap} 個` : undefined}
            />
            <FilterItem
              label="預算匹配"
              passed={breakdown.budgetMatch}
            />
            <FilterItem
              label="過敏原相容"
              passed={breakdown.allergyCompatible}
            />
            <FilterItem
              label="抽菸習慣相容"
              passed={breakdown.smokingCompatible}
            />
            <FilterItem
              label="生活習慣相似度"
              passed={true}
              detail={`距離: ${breakdown.lifestyleDistance.toFixed(2)}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 篩選項目顯示
 */
interface FilterItemProps {
  label: string;
  passed: boolean;
  detail?: string;
}

const FilterItem: React.FC<FilterItemProps> = ({ label, passed, detail }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px'
      }}
    >
      <span style={{ color: '#5A5A5A' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {detail && (
          <span style={{ color: '#9E9E9E', fontSize: '11px' }}>
            {detail}
          </span>
        )}
        <span
          style={{
            color: passed ? '#10b981' : '#ef4444',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          {passed ? '✓' : '✗'}
        </span>
      </div>
    </div>
  );
};

/**
 * 生成配對原因說明
 */
function generateMatchReason(user1: User, user2: User, breakdown: any): string {
  const reasons: string[] = [];

  // 預算相同
  if (breakdown.budgetMatch) {
    reasons.push('預算相同');
  }

  // 地區重疊
  if (breakdown.locationOverlap > 0) {
    reasons.push(`地區${breakdown.locationOverlap > 1 ? '重疊多' : '相近'}`);
  }

  // 生活習慣相似
  if (breakdown.lifestyleDistance < 3) {
    reasons.push('生活習慣非常相似');
  } else if (breakdown.lifestyleDistance < 5) {
    reasons.push('生活習慣相似');
  }

  // 具體習慣匹配
  const lifestyleMatches: string[] = [];
  if (Math.abs((user1.q9_cleaning ?? 3) - (user2.q9_cleaning ?? 3)) <= 1) {
    lifestyleMatches.push('都重視環境維護');
  }
  if (Math.abs((user1.q13_interaction ?? 3) - (user2.q13_interaction ?? 3)) <= 1) {
    lifestyleMatches.push('互動期望相近');
  }
  if (Math.abs((user1.q12_schedule ?? 3) - (user2.q12_schedule ?? 3)) <= 1) {
    lifestyleMatches.push('作息時間相符');
  }

  if (lifestyleMatches.length > 0) {
    reasons.push(lifestyleMatches.join('且'));
  }

  if (reasons.length === 0) {
    return '配對分數顯示兩人有一定相容性';
  }

  return reasons.join('、') + '。';
}
