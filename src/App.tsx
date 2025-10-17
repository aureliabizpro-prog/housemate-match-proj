// ============================================
// 好室友® V2.0.0 - 主應用組件
// 實作「高分配對範例」（未輸入 email）和「Friends List」（已輸入 email）兩種模式
// ============================================

import React, { useState, useMemo } from 'react';
import { Heart, ExternalLink, Mail } from 'lucide-react';
import './styles.css';

// 導入類型
import { MatchResult, User } from './types';

// 導入數據
import { users, getUserByEmail, anonymizeUserId } from './data/users';

// 導入工具函數
import { findAllMatches, findMatchesForUser } from './utils/matchingAlgorithm';

// 導入組件
import { Banner } from './components/Banner';
import { MatchCard } from './components/MatchCard';

// Google Form URL
const GOOGLE_FORM_URL = 'https://forms.gle/dwm2jfVfK8hc6Po97';

/**
 * 好室友® V2.0.0 主應用
 */
const App: React.FC = () => {
  // ===== 狀態管理 =====
  const [emailInput, setEmailInput] = useState<string>('');
  const [searchedUser, setSearchedUser] = useState<User | null>(null);

  // ===== 計算配對 =====

  // 1. 計算所有配對
  const allMatches = useMemo(() => {
    return findAllMatches(users, { minScore: 0, includeNonPassingFilters: true });
  }, []);

  // 2. 高分配對範例：隨機選擇 5-8 組配對度最高的配對
  const highScoreExamples = useMemo(() => {
    // 先嘗試找通過硬性篩選且分數 >= 70 的
    let highScoreMatches = allMatches.filter(
      match => match.score >= 70 && match.passHardFilters
    );

    // 如果沒有，就顯示所有配對（按分數排序）
    if (highScoreMatches.length === 0) {
      highScoreMatches = [...allMatches].sort((a, b) => b.score - a.score);
    }

    // 隨機打亂並取 5-8 組（如果有足夠數據的話）
    const shuffled = [...highScoreMatches].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(8, shuffled.length));
  }, [allMatches]);

  // 3. Friends List：已搜尋用戶的配對推薦（前 5-10 位）
  const friendsList = useMemo(() => {
    if (!searchedUser) return [];
    return findMatchesForUser(searchedUser, users, { topN: 10, minScore: 0 });
  }, [searchedUser]);

  // ===== 事件處理 =====

  const handleEmailSearch = () => {
    if (!emailInput.trim()) {
      setSearchedUser(null);
      return;
    }

    const found = getUserByEmail(emailInput.trim());
    setSearchedUser(found || null);
  };

  const handleClearSearch = () => {
    setEmailInput('');
    setSearchedUser(null);
  };

  // ===== 渲染 =====

  return (
    <div className="app-container">
      {/* Banner 輪播 */}
      <Banner />

      {/* 頁首 */}
      <header className="app-header">
        <Heart className="header-icon" size={48} fill="#E08E6D" color="#E08E6D" />
        <h1 className="app-title">好室友®</h1>
      </header>

      {/* Email 搜尋區 */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
          border: '1px solid rgba(224, 142, 109, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Mail size={20} color="#E08E6D" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2D2D2D', margin: 0 }}>
            {searchedUser ? '你的配對推薦' : '查看你的配對推薦'}
          </h3>
        </div>

        {!searchedUser ? (
          <>
            <p style={{ fontSize: '14px', color: '#5A5A5A', marginBottom: '16px' }}>
              已經填寫問卷？輸入你的 email 查看配對結果
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEmailSearch()}
                placeholder="輸入你的 email..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#E08E6D'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
              />
              <button
                onClick={handleEmailSearch}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#E08E6D',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#C97456'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#E08E6D'; }}
              >
                搜尋
              </button>
            </div>
          </>
        ) : (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}
            >
              <div>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#2D2D2D', marginBottom: '4px' }}>
                  {anonymizeUserId(searchedUser.email)} (你)
                </p>
                <p style={{ fontSize: '14px', color: '#5A5A5A' }}>
                  {searchedUser.email}
                </p>
              </div>
              <button
                onClick={handleClearSearch}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E08E6D',
                  background: 'transparent',
                  color: '#E08E6D',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFF8F0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                清除搜尋
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 主要內容區域 */}
      {!searchedUser ? (
        // ===== 模式 A：未輸入 email - 展示高分配對範例 =====
        <section>
          <h2 className="section-title">
            💌 配對推薦
          </h2>
          <p style={{ textAlign: 'center', color: '#5A5A5A', marginBottom: '32px', fontSize: '16px' }}>
            看看誰跟誰最契合？以下是配對度最高的組合 ✨
          </p>

          {highScoreExamples.length === 0 ? (
            <div className="no-matches">
              目前還沒有足夠的配對資料
            </div>
          ) : (
            <div className="matches-list">
              {highScoreExamples.map((match, index) => (
                <MatchCard
                  key={`${match.user1.userId}-${match.user2.userId}`}
                  match={match}
                  rank={index + 1}
                />
              ))}
            </div>
          )}

          {/* CTA 區域 */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '48px',
              padding: '40px 20px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid rgba(224, 142, 109, 0.1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)'
            }}
          >
            <h3 style={{ fontSize: '20px', color: '#2D2D2D', marginBottom: '12px', fontWeight: '700' }}>
              💡 想找到你的最佳配對？
            </h3>
            <p style={{ fontSize: '14px', color: '#5A5A5A', marginBottom: '8px' }}>
              已經加入？ 在上方輸入 email 查看你的推薦 →
            </p>
            <p style={{ fontSize: '14px', color: '#5A5A5A', marginBottom: '24px' }}>
              還沒加入？
            </p>
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                background: '#E08E6D',
                color: 'white',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(224, 142, 109, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#C97456';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#E08E6D';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Heart size={20} />
              立即加入
              <ExternalLink size={16} />
            </a>
          </div>
        </section>
      ) : (
        // ===== 模式 B：已輸入 email - 展示 Friends List =====
        <section>
          <h2 className="section-title">
            {anonymizeUserId(searchedUser.email)} 的配對推薦
          </h2>
          <p style={{ textAlign: 'center', color: '#5A5A5A', marginBottom: '32px', fontSize: '14px' }}>
            為你找到 {friendsList.length} 位潛在室友
          </p>

          {friendsList.length === 0 ? (
            <div className="no-matches">
              目前沒有找到合適的配對
            </div>
          ) : (
            <div className="matches-list">
              {friendsList.map((match, index) => (
                <MatchCard
                  key={`${match.user1.userId}-${match.user2.userId}`}
                  match={match}
                  rank={index + 1}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 頁尾 */}
      <footer
        style={{
          textAlign: 'center',
          marginTop: '48px',
          padding: '20px',
          color: '#9E9E9E',
          fontSize: '13px'
        }}
      >
        <p style={{ marginBottom: '8px' }}>好室友® V2.0.0 | 用科學配對，找到真正合得來的室友</p>
        <p style={{ fontSize: '12px' }}>
          配對演算法基於雙向性別匹配、地點重疊、預算相容、過敏原檢查及 7 維度生活習慣相似度
        </p>
      </footer>
    </div>
  );
};

export default App;
