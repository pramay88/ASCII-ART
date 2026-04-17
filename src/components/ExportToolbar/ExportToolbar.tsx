'use client';
import React from 'react';
import styles from './ExportToolbar.module.css';

interface ExportToolbarProps {
  onExportText: () => void;
  onExportHtml: () => void;
  onExportImage: () => void;
  onToggleRecording: () => void;
  isRecording: boolean;
  sourceType: string;
  disabled: boolean;
}

export function ExportToolbar({
  onExportText,
  onExportHtml,
  onExportImage,
  onToggleRecording,
  isRecording,
  sourceType,
  disabled,
}: ExportToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.exportButtons}>
        <button
          className={styles.toolButton}
          onClick={onExportText}
          disabled={disabled}
          title="Export as TXT"
        >
          <span className={styles.toolButtonLabel}>TXT</span>
        </button>
        <button
          className={styles.toolButton}
          onClick={onExportHtml}
          disabled={disabled}
          title="Export as HTML"
        >
          <span className={styles.toolButtonLabel}>HTML</span>
        </button>
        <button
          className={styles.toolButton}
          onClick={onExportImage}
          disabled={disabled}
          title="Export as PNG"
        >
          <span className={styles.toolButtonLabel}>PNG</span>
        </button>
        {sourceType === 'webcam' && (
          <button
            className={`${styles.toolButton} ${isRecording ? styles.recording : ''}`}
            onClick={onToggleRecording}
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
          >
            <span className={styles.toolButtonLabel}>
              {isRecording ? 'REC' : 'REC'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
