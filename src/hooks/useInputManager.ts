'use client';
// ─── Input Manager Hook ─────────────────────────────────────────────────────
// Handles image upload, video file, and webcam input sources.

import { useState, useRef, useCallback, useEffect } from 'react';
import { SourceType } from '../core/types';

interface InputManagerReturn {
  sourceType: SourceType;
  sourceCanvas: HTMLCanvasElement | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  hiddenCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  handleImageUpload: (file: File) => void;
  handleVideoFile: (file: File) => void;
  startWebcam: () => Promise<void>;
  stopWebcam: () => void;
  stopSource: () => void;
  captureVideoFrame: () => boolean;
  isVideoReady: boolean;
}

export function useInputManager(): InputManagerReturn {
  const [sourceType, setSourceType] = useState<SourceType>('none');
  const [sourceCanvas] = useState<HTMLCanvasElement | null>(() =>
    typeof document === 'undefined' ? null : document.createElement('canvas')
  );
  const [isVideoReady, setIsVideoReady] = useState(false);

  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(sourceCanvas);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const stopSource = useCallback(() => {
    stopWebcam();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.srcObject = null;
    }
    setSourceType('none');
    setIsVideoReady(false);
  }, [stopWebcam]);

  const drawImageToCanvas = useCallback(
    (img: HTMLImageElement) => {
      const sourceCanvas = sourceCanvasRef.current;
      if (!sourceCanvas) return;
      sourceCanvas.width = img.naturalWidth;
      sourceCanvas.height = img.naturalHeight;
      const ctx = sourceCanvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
    },
    []
  );

  const handleImageUpload = useCallback(
    (file: File) => {
      stopSource();
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          drawImageToCanvas(img);
          setSourceType('image');
          setIsVideoReady(false);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [drawImageToCanvas, stopSource]
  );

  const handleVideoFile = useCallback(
    (file: File) => {
      stopSource();
      const url = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.loop = true;
        videoRef.current.muted = true;
        videoRef.current.play().then(() => {
          setSourceType('video');
          setIsVideoReady(true);
        });
      }
    },
    [stopSource]
  );

  const startWebcam = useCallback(async () => {
    stopSource();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().then(() => {
          setSourceType('webcam');
          setIsVideoReady(true);
        });
      }
    } catch (err) {
      console.error('Webcam access denied:', err);
    }
  }, [stopSource]);

  /**
   * Captures the current video frame to the source canvas.
   * Returns true if a frame was captured.
   */
  const captureVideoFrame = useCallback((): boolean => {
    const sourceCanvas = sourceCanvasRef.current;
    if (!videoRef.current || !sourceCanvas) return false;
    const video = videoRef.current;
    if (video.readyState < 2) return false;

    sourceCanvas.width = video.videoWidth;
    sourceCanvas.height = video.videoHeight;
    const ctx = sourceCanvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);
    return true;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  return {
    sourceType,
    sourceCanvas,
    videoRef,
    hiddenCanvasRef,
    handleImageUpload,
    handleVideoFile,
    startWebcam,
    stopWebcam,
    stopSource,
    captureVideoFrame,
    isVideoReady,
  };
}
