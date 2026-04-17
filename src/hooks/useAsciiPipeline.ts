'use client';
// ─── ASCII Pipeline Hook ────────────────────────────────────────────────────
// Orchestrates: input frame → ImageProcessor → AsciiMapper → output grid

import { useState, useCallback, useRef } from 'react';
import { AsciiGrid, ProcessingSettings } from '../core/types';
import { processImage } from '../core/ImageProcessor';
import { mapToAscii } from '../core/AsciiMapper';
import { detectEdges } from '../core/EdgeDetector';
import { renderToCanvas } from '../core/CanvasRenderer';

interface PipelineReturn {
  asciiGrid: AsciiGrid | null;
  outputCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  processFrame: (sourceCanvas: HTMLCanvasElement, settings: ProcessingSettings) => void;
}

export function useAsciiPipeline(): PipelineReturn {
  const [asciiGrid, setAsciiGrid] = useState<AsciiGrid | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridRef = useRef<AsciiGrid | null>(null);

  const processFrame = useCallback(
    (sourceCanvas: HTMLCanvasElement, settings: ProcessingSettings) => {
      if (sourceCanvas.width === 0 || sourceCanvas.height === 0) return;

      // Step 1: Process image (downscale + brightness + contrast)
      let imageData = processImage(
        sourceCanvas,
        settings.width,
        settings.brightness,
        settings.contrast
      );

      // Step 2: Apply edge detection if in edge mode
      if (settings.renderMode === 'edge') {
        imageData = detectEdges(imageData, settings.edgeThreshold);
      }

      // Step 3: Map to ASCII characters
      const grid = mapToAscii(imageData, settings.charset, settings.renderMode);
      gridRef.current = grid;
      setAsciiGrid(grid);

      // Step 4: Render to canvas (for colored mode, export, recording)
      if (outputCanvasRef.current) {
        const themeColors = getThemeColors();
        renderToCanvas(outputCanvasRef.current, grid, {
          fontSize: settings.fontSize,
          lineSpacing: settings.lineSpacing,
          colored: settings.renderMode === 'colored',
          backgroundColor: themeColors.bg,
          defaultColor: themeColors.fg,
        });
      }
    },
    []
  );

  return { asciiGrid, outputCanvasRef, processFrame };
}

function getThemeColors(): { bg: string; fg: string } {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  switch (theme) {
    case 'light':
      return { bg: '#f8f9fa', fg: '#1a1a2e' };
    case 'neon':
      return { bg: '#000000', fg: '#00ff41' };
    default:
      return { bg: '#0a0a0f', fg: '#e0e0e0' };
  }
}
