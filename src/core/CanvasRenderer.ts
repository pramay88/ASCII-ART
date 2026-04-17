// ─── Canvas Renderer ─────────────────────────────────────────────────────────
// Renders an AsciiGrid to an HTML canvas element for colored output,
// export, and video recording.

import { AsciiGrid } from './types';

export interface CanvasRenderSettings {
  fontSize: number;
  lineSpacing: number;
  backgroundColor: string;
  defaultColor: string;
  colored: boolean;
  fontFamily: string;
}

const DEFAULT_SETTINGS: CanvasRenderSettings = {
  fontSize: 10,
  lineSpacing: 1.0,
  backgroundColor: '#0a0a0f',
  defaultColor: '#e0e0e0',
  colored: false,
  fontFamily: '"JetBrains Mono", monospace',
};

/**
 * Renders an ASCII grid to a canvas element.
 * Sizes the canvas automatically based on grid dimensions and font settings.
 */
export function renderToCanvas(
  canvas: HTMLCanvasElement,
  grid: AsciiGrid,
  settings: Partial<CanvasRenderSettings> = {}
): void {
  const opts = { ...DEFAULT_SETTINGS, ...settings };
  const ctx = canvas.getContext('2d')!;

  if (grid.length === 0 || grid[0].length === 0) return;

  const rows = grid.length;
  const cols = grid[0].length;

  // Measure character dimensions
  ctx.font = `${opts.fontSize}px ${opts.fontFamily}`;
  const charWidth = ctx.measureText('M').width;
  const lineHeight = opts.fontSize * opts.lineSpacing;

  const logicalWidth = Math.ceil(cols * charWidth) + 4;
  const logicalHeight = Math.ceil(rows * lineHeight) + 4;
  const dpr = typeof window === 'undefined' ? 1 : Math.max(window.devicePixelRatio || 1, 1);

  // Resize canvas to fit content, using DPR for sharper rendering/export.
  canvas.width = Math.floor(logicalWidth * dpr);
  canvas.height = Math.floor(logicalHeight * dpr);
  canvas.style.width = `${logicalWidth}px`;
  canvas.style.height = `${logicalHeight}px`;

  // Clear with background
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = opts.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set font again after canvas resize (resets context), then scale drawing coordinates.
  ctx.scale(dpr, dpr);
  ctx.font = `${opts.fontSize}px ${opts.fontFamily}`;
  ctx.textBaseline = 'top';

  // Batch render: group characters by color to minimize fillStyle changes
  if (!opts.colored) {
    // Monochrome mode — single fillStyle for all characters
    ctx.fillStyle = opts.defaultColor;
    for (let y = 0; y < rows; y++) {
      const line = grid[y].map(cell => cell.char).join('');
      ctx.fillText(line, 2, y * lineHeight + 2);
    }
  } else {
    // Colored mode — per-character fillStyle
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = grid[y][x];
        ctx.fillStyle = `rgb(${cell.r},${cell.g},${cell.b})`;
        ctx.fillText(cell.char, x * charWidth + 2, y * lineHeight + 2);
      }
    }
  }
}
