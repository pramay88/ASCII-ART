'use client';

import styles from './StatusBar.module.css';
import { CharsetName, RenderMode, SourceType } from '../../core/types';

interface StatusBarProps {
  fps: number;
  source: SourceType;
  renderMode: RenderMode;
  width: number;
  charset: CharsetName;
  isRecording: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function StatusBar({
  fps,
  source,
  renderMode,
  width,
  charset,
  isRecording,
  isFullscreen,
  onToggleFullscreen,
}: StatusBarProps) {
  const sourceLabel = source === 'none' ? 'No input' : source;

  return (
    <footer className={styles.statusBar}>
      <div className={styles.statusLeft}>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Source</span>
          <span className={`${styles.sourceBadge} ${source === 'none' ? styles.sourceNone : styles.sourceActive}`}>
            {sourceLabel}
          </span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Mode</span>
          <span className={styles.statusValue}>{renderMode}</span>
        </div>
      </div>

      <div className={styles.statusRight}>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Width</span>
          <span className={styles.statusValue}>{width}</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Charset</span>
          <span className={styles.statusValue}>{charset}</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>FPS</span>
          <span className={styles.statusValue}>{fps}</span>
        </div>
        {isRecording && (
          <div className={styles.statusItem}>
            <span className={styles.recordingDot} />
            <span className={styles.recordingText}>REC</span>
          </div>
        )}
        <button className={styles.fullscreenButton} onClick={onToggleFullscreen}>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
    </footer>
  );
}
