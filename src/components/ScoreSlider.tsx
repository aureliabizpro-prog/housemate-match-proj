import React from 'react';

interface ScoreSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

/**
 * 分數滑桿組件
 * 用於設定最低匹配分數門檻
 */
export const ScoreSlider: React.FC<ScoreSliderProps> = ({
  value,
  onChange,
  min = 50,
  max = 90,
  step = 5,
  label = '最低分數'
}) => {
  return (
    <div className="score-slider-container">
      <label className="slider-label">
        {label}：{value}%
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
      />
    </div>
  );
};
