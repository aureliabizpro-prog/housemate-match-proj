// ============================================
// 好室友® V2.0.0 - 地區篩選器組件
// ============================================

import React from 'react';
import { MapPin, X } from 'lucide-react';

interface LocationFilterProps {
  availableLocations: string[];
  selectedLocations: string[];
  onLocationToggle: (location: string) => void;
  onClearAll: () => void;
}

/**
 * 地區篩選器組件
 * 允許用戶選擇一個或多個地區來篩選配對結果
 */
export const LocationFilter: React.FC<LocationFilterProps> = ({
  availableLocations,
  selectedLocations,
  onLocationToggle,
  onClearAll
}) => {
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
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={20} color="#E08E6D" />
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#2D2A26',
              margin: 0
            }}
          >
            地區篩選
          </h3>
        </div>

        {selectedLocations.length > 0 && (
          <button
            onClick={onClearAll}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#E08E6D',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(224, 142, 109, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X size={16} />
            清除全部
          </button>
        )}
      </div>

      {/* 地區標籤 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        {availableLocations.map((location) => {
          const isSelected = selectedLocations.includes(location);

          return (
            <button
              key={location}
              onClick={() => onLocationToggle(location)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: isSelected ? '2px solid #E08E6D' : '2px solid #e5e7eb',
                background: isSelected ? '#E08E6D' : 'white',
                color: isSelected ? 'white' : '#4b5563',
                fontSize: '14px',
                fontWeight: isSelected ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = '#E08E6D';
                  e.currentTarget.style.background = 'rgba(224, 142, 109, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.background = 'white';
                }
              }}
            >
              {location}
            </button>
          );
        })}
      </div>

      {/* 已選擇提示 */}
      {selectedLocations.length > 0 && (
        <div
          style={{
            marginTop: '12px',
            fontSize: '13px',
            color: '#6b7280'
          }}
        >
          已選擇 {selectedLocations.length} 個地區
        </div>
      )}
    </div>
  );
};
