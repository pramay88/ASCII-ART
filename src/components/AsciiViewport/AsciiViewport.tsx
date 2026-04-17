'use client';
import React, { useMemo } from 'react';
import styles from './AsciiViewport.module.css';
import { AsciiGrid, RenderMode, ThemeName } from '../../core/types';
import { Camera, Image as ImageIcon } from 'lucide-react';

interface AsciiViewportProps {
  grid: AsciiGrid | null;
  renderMode: RenderMode;
  fontSize: number;
  lineSpacing: number;
  outputCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  theme: ThemeName;
  onPickImage: () => void;
  onPickVideo: () => void;
  onStartWebcam: () => void;
}

export function AsciiViewport({
  grid,
  renderMode,
  fontSize,
  lineSpacing,
  outputCanvasRef,
  theme,
  onPickImage,
  onPickVideo,
  onStartWebcam,
}: AsciiViewportProps) {
  // For colored mode, render via canvas. For others, render as text.
  const useCanvas = renderMode === 'colored';

  const textContent = useMemo(() => {
    if (!grid || useCanvas) return null;
    return grid.map((row) => row.map((cell) => cell.char).join('')).join('\n');
  }, [grid, useCanvas]);

  const themeClass =
    theme === 'light' ? styles.themeLight : theme === 'custom' ? styles.themeCustom : styles.themeDark;

  if (!grid) {
    return (
      <div className={`${styles.viewport} ${themeClass}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⬡</div>
          <div className={styles.emptyTitle}>ASCII Art Studio</div>
          <div className={styles.emptySubtitle}>
            Upload an image, load a video, or start your webcam to begin converting visual media into ASCII art.
          </div>
          <div className={styles.emptyHint}>
            <button className={styles.hintChip} onClick={onPickImage}>
              <ImageIcon size={14} />
              Image
            </button>
            <button className={styles.hintChip} onClick={onPickVideo}>
              <ImageIcon size={14} />
              Video
            </button>
            <button className={styles.hintChip} onClick={onStartWebcam}>
              <Camera size={14} />
              Webcam
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.viewport} ${themeClass}`}>
      <div className={styles.asciiContainer}>
        {/* Canvas for colored mode + recording/export */}
        <canvas
          ref={outputCanvasRef}
          className={`${styles.asciiCanvas} ${!useCanvas ? styles.hidden : ''}`}
        />

        {/* Pre for text modes */}
        {!useCanvas && textContent !== null && (
          <pre
            className={styles.asciiPre}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: `${lineSpacing}`,
            }}
          >
            {textContent}
          </pre>
        )}
      </div>
    </div>
  );
}
