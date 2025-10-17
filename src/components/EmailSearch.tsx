// ============================================
// 好室友® V2.0.0 - Email 搜尋組件
// ============================================

import React, { useState } from 'react';
import { Search, Mail, X } from 'lucide-react';
import { User } from '../types';

interface EmailSearchProps {
  users: User[];
  onUserFound: (user: User | null) => void;
}

/**
 * Email 搜尋組件
 * 允許用戶通過 email 搜尋特定用戶
 */
export const EmailSearch: React.FC<EmailSearchProps> = ({ users, onUserFound }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<User | null | 'not-found'>(null);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResult(null);
      onUserFound(null);
      return;
    }

    const foundUser = users.find(
      (user) => user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (foundUser) {
      setSearchResult(foundUser);
      onUserFound(foundUser);
    } else {
      setSearchResult('not-found');
      onUserFound(null);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResult(null);
    onUserFound(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFF8F0',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        border: '2px solid #E08E6D'
      }}
    >
      {/* 標題 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}
      >
        <Mail size={20} color="#E08E6D" />
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2D2A26',
            margin: 0
          }}
        >
          Email 搜尋
        </h3>
      </div>

      {/* 搜尋框 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="輸入 email 搜尋用戶..."
            style={{
              width: '100%',
              padding: '12px 40px 12px 16px',
              borderRadius: '12px',
              border: '2px solid #e5e7eb',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
              backgroundColor: 'white'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#E08E6D';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          />

          {searchTerm && (
            <button
              onClick={handleClear}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} color="#6b7280" />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: '#E08E6D',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#d17a5a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#E08E6D';
          }}
        >
          <Search size={16} />
          搜尋
        </button>
      </div>

      {/* 搜尋結果 */}
      {searchResult === 'not-found' && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            borderRadius: '8px',
            color: '#991b1b',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <X size={16} />
          找不到匹配的用戶
        </div>
      )}

      {searchResult && searchResult !== 'not-found' && (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '2px solid #10b981'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2D2A26',
                  margin: '0 0 4px 0'
                }}
              >
                {searchResult.userId}
              </h4>
              <p
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}
              >
                {searchResult.email}
              </p>
            </div>
            <div
              style={{
                padding: '6px 12px',
                backgroundColor: '#d1fae5',
                borderRadius: '8px',
                color: '#065f46',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              已找到
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
