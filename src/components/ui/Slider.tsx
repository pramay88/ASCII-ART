'use client';
import React from 'react';
import styles from './Slider.module.css';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  id: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  id,
}: SliderProps) {
  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <div className={styles.sliderGroup}>
      <div className={styles.sliderHeader}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <span className={styles.value}>{displayValue}</span>
      </div>
      <input
        id={id}
        type="range"
        className={styles.slider}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
