'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './page.module.css';
import { AppProvider, useAppState } from '../context/AppContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { ControlPanel } from '../components/ControlPanel/ControlPanel';
import { ExportToolbar } from '../components/ExportToolbar/ExportToolbar';
import { AsciiViewport } from '../components/AsciiViewport/AsciiViewport';
import { StatusBar } from '../components/StatusBar/StatusBar';
import { useInputManager } from '../hooks/useInputManager';
import { useAsciiPipeline } from '../hooks/useAsciiPipeline';
import { useAnimationLoop } from '../hooks/useAnimationLoop';
import { useFps } from '../hooks/useFps';
import { useExport } from '../hooks/useExport';
import { ProcessingSettings } from '../core/types';

function Studio() {
  const { state, dispatch } = useAppState();
  const { theme, customColor } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mainAreaRef = useRef<HTMLElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const {
    sourceType,
    sourceCanvas,
    videoRef,
    handleImageUpload,
    handleVideoFile,
    startWebcam,
    stopSource,
    captureVideoFrame,
    isVideoReady,
  } = useInputManager();

  const { asciiGrid, outputCanvasRef, processFrame } = useAsciiPipeline();
  const { fps, tick } = useFps();
  const {
    handleExportText,
    handleExportHtml,
    handleExportImage,
    startRecording,
    stopRecording,
  } = useExport();

  const settings = useMemo<ProcessingSettings>(
    () => ({
      width: state.width,
      fontSize: state.fontSize,
      lineSpacing: state.lineSpacing,
      brightness: state.brightness,
      contrast: state.contrast,
      edgeThreshold: state.edgeThreshold,
      renderMode: state.renderMode,
      charset: state.charset,
    }),
    [state]
  );

  useEffect(() => {
    dispatch({ type: 'SET_SOURCE', payload: sourceType });
  }, [sourceType, dispatch]);

  useEffect(() => {
    if (sourceType === 'image' && sourceCanvas) {
      processFrame(sourceCanvas, settings);
    }
  }, [sourceType, sourceCanvas, processFrame, settings, theme]);

  const onFrame = useCallback(() => {
    if (sourceType !== 'video' && sourceType !== 'webcam') return;
    if (!sourceCanvas || !isVideoReady) return;

    const captured = captureVideoFrame();
    if (!captured) return;

    processFrame(sourceCanvas, settings);
    tick();
  }, [sourceType, sourceCanvas, isVideoReady, captureVideoFrame, processFrame, settings, tick]);

  useAnimationLoop(onFrame, (sourceType === 'video' || sourceType === 'webcam') && isVideoReady);

  const handleToggleRecording = useCallback(() => {
    if (!outputCanvasRef.current) return;
    if (state.isRecording) {
      stopRecording();
      dispatch({ type: 'SET_RECORDING', payload: false });
      return;
    }
    if (sourceType !== 'webcam') return;
    startRecording(outputCanvasRef.current);
    dispatch({ type: 'SET_RECORDING', payload: true });
  }, [state.isRecording, sourceType, outputCanvasRef, startRecording, stopRecording, dispatch]);

  useEffect(() => {
    if (sourceType === 'webcam' || !state.isRecording) return;
    stopRecording();
    dispatch({ type: 'SET_RECORDING', payload: false });
  }, [sourceType, state.isRecording, stopRecording, dispatch]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const apply = () => setSidebarOpen(!media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    const target = mainAreaRef.current;
    if (!target) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await target.requestFullscreen();
  }, []);

  return (
    <div className={styles.page}>
      {!isFullscreen && (
        <ControlPanel
          isOpen={isSidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onClose={() => setSidebarOpen(false)}
          onPickImage={() => imageInputRef.current?.click()}
          onPickVideo={() => videoInputRef.current?.click()}
          onStartWebcam={startWebcam}
          onStopSource={stopSource}
          onExportText={() => asciiGrid && handleExportText(asciiGrid)}
          onExportHtml={() =>
            asciiGrid &&
            handleExportHtml(asciiGrid, state.renderMode, theme, state.fontSize, state.lineSpacing, customColor)
          }
          onExportImage={() => outputCanvasRef.current && handleExportImage(outputCanvasRef.current)}
          onToggleRecording={handleToggleRecording}
        />
      )}

      <main className={styles.mainArea} ref={mainAreaRef}>
        {!isFullscreen && (
          <ExportToolbar
            onExportText={() => asciiGrid && handleExportText(asciiGrid)}
            onExportHtml={() =>
              asciiGrid &&
              handleExportHtml(asciiGrid, state.renderMode, theme, state.fontSize, state.lineSpacing, customColor)
            }
            onExportImage={() => outputCanvasRef.current && handleExportImage(outputCanvasRef.current)}
            onToggleRecording={handleToggleRecording}
            isRecording={state.isRecording}
            sourceType={sourceType}
            disabled={!state.source || state.source === 'none'}
          />
        )}
        <AsciiViewport
          grid={asciiGrid}
          renderMode={state.renderMode}
          fontSize={state.fontSize}
          lineSpacing={state.lineSpacing}
          outputCanvasRef={outputCanvasRef}
          theme={theme}
          onPickImage={() => imageInputRef.current?.click()}
          onPickVideo={() => videoInputRef.current?.click()}
          onStartWebcam={startWebcam}
        />
        <StatusBar
          fps={fps}
          source={sourceType}
          renderMode={state.renderMode}
          width={state.width}
          charset={state.charset}
          isRecording={state.isRecording}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
      </main>

      <video ref={videoRef} className={styles.hidden} playsInline />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className={styles.hidden}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = '';
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className={styles.hidden}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleVideoFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Studio />
      </AppProvider>
    </ThemeProvider>
  );
}
