'use client';
// ─── Export Hook ─────────────────────────────────────────────────────────────

import { useRef, useCallback } from 'react';
import { AsciiGrid, RenderMode, ThemeName } from '../core/types';
import { exportAsText } from '../export/TextExporter';
import { exportAsHtml } from '../export/HtmlExporter';
import { exportAsImage } from '../export/ImageExporter';
import { VideoRecorder } from '../export/VideoRecorder';

interface ExportReturn {
  handleExportText: (grid: AsciiGrid) => void;
  handleExportHtml: (grid: AsciiGrid, mode: RenderMode, theme: ThemeName, fontSize: number, lineSpacing: number, customColor?: string) => void;
  handleExportImage: (canvas: HTMLCanvasElement) => void;
  startRecording: (canvas: HTMLCanvasElement) => void;
  stopRecording: () => void;
  isRecording: boolean;
}

const THEME_COLORS: Record<ThemeName, { bg: string; fg: string }> = {
  dark: { bg: '#0a0a0f', fg: '#e0e0e0' },
  light: { bg: '#f8f9fa', fg: '#1a1a2e' },
  custom: { bg: '#0a0a0f', fg: '#7d85ff' },
};

export function useExport(): ExportReturn {
  const recorderRef = useRef<VideoRecorder>(new VideoRecorder());
  const recordingRef = useRef(false);

  const handleExportText = useCallback((grid: AsciiGrid) => {
    if (grid) exportAsText(grid);
  }, []);

  const handleExportHtml = useCallback(
    (grid: AsciiGrid, mode: RenderMode, theme: ThemeName, fontSize: number, lineSpacing: number, customColor?: string) => {
      if (!grid) return;
      const colors = THEME_COLORS[theme];
      const fgColor = theme === 'custom' && customColor ? customColor : colors.fg;
      exportAsHtml(grid, {
        backgroundColor: colors.bg,
        defaultColor: fgColor,
        fontSize,
        lineSpacing,
        colored: mode === 'colored',
      });
    },
    []
  );

  const handleExportImage = useCallback((canvas: HTMLCanvasElement) => {
    exportAsImage(canvas);
  }, []);

  const startRecording = useCallback((canvas: HTMLCanvasElement) => {
    recorderRef.current.start(canvas, 30);
    recordingRef.current = true;
  }, []);

  const stopRecording = useCallback(() => {
    recorderRef.current.stop();
    recordingRef.current = false;
  }, []);

  return {
    handleExportText,
    handleExportHtml,
    handleExportImage,
    startRecording,
    stopRecording,
    get isRecording() {
      return recordingRef.current;
    },
  };
}
