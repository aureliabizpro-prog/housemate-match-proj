// ============================================
// 好室友® V2.0.0 - Banner 輪播組件
// ============================================

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  title: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
}

const slides: BannerSlide[] = [
  {
    title: '好室友®',
    subtitle: '用科學配對，找到真正合得來的室友',
    backgroundColor: 'linear-gradient(135deg, #E08E6D 0%, #F5B89A 100%)',
    textColor: '#FFF8F0'
  },
  {
    title: '雙向匹配算法',
    subtitle: '確保你和室友的需求都能被滿足',
    backgroundColor: 'linear-gradient(135deg, #FFA578 0%, #FFD4B8 100%)',
    textColor: '#2D2A26'
  },
  {
    title: '7 維度生活習慣分析',
    subtitle: '從清潔、作息到社交，全方位評估相似度',
    backgroundColor: 'linear-gradient(135deg, #FFB894 0%, #FFF0E5 100%)',
    textColor: '#2D2A26'
  }
];

/**
 * Banner 輪播組件
 */
export const Banner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 自動輪播
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  return (
    <div
      style={{
        background: currentSlide.backgroundColor,
        borderRadius: '20px',
        padding: '48px 32px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(224, 142, 109, 0.25)',
        transition: 'background 0.5s ease'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 內容 */}
      <div
        style={{
          textAlign: 'center',
          color: currentSlide.textColor,
          transition: 'color 0.5s ease'
        }}
      >
        <h1
          style={{
            fontSize: '42px',
            fontWeight: 'bold',
            marginBottom: '12px',
            letterSpacing: '1px'
          }}
        >
          {currentSlide.title}
        </h1>
        <p
          style={{
            fontSize: '18px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          {currentSlide.subtitle}
        </p>
      </div>

      {/* 左箭頭 */}
      <button
        onClick={goToPrevious}
        style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.3)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.2s',
          backdropFilter: 'blur(4px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
        }}
      >
        <ChevronLeft size={24} color={currentSlide.textColor} />
      </button>

      {/* 右箭頭 */}
      <button
        onClick={goToNext}
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.3)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.2s',
          backdropFilter: 'blur(4px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
        }}
      >
        <ChevronRight size={24} color={currentSlide.textColor} />
      </button>

      {/* 指示點 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '24px'
        }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: index === currentIndex ? '32px' : '8px',
              height: '8px',
              borderRadius: '4px',
              border: 'none',
              background: index === currentIndex
                ? currentSlide.textColor
                : `${currentSlide.textColor}66`,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};
