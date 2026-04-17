// ─── ASCII Mapper ────────────────────────────────────────────────────────────
// Maps processed ImageData pixels to ASCII characters.
// Supports grayscale, colored, and inverted modes.

import { AsciiGrid, AsciiCell, RenderMode } from './types';
import { getCharset } from './CharacterSets';
import type { CharsetName } from './types';

/**
 * Converts ImageData to an AsciiGrid based on the selected render mode.
 * For edge detection mode, expects a pre-processed binary edge map as ImageData.
 */
export function mapToAscii(
  imageData: ImageData,
  charsetName: CharsetName,
  mode: RenderMode
): AsciiGrid {
  const { width, height, data } = imageData;
  const chars = getCharset(charsetName);
  const charCount = chars.length;
  const grid: AsciiGrid = [];

  for (let y = 0; y < height; y++) {
    const row: AsciiCell[] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Weighted luminance (ITU-R BT.601)
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      let charIndex: number;

      switch (mode) {
        case 'inverted':
          // Bright areas → dense characters, dark areas → sparse characters
          charIndex = Math.floor((luminance / 255) * (charCount - 1));
          break;

        case 'edge':
          // Edge map: white (255) = edge → dense char, black (0) = no edge → space
          charIndex = luminance > 128 ? 0 : charCount - 1;
          break;

        case 'grayscale':
        case 'colored':
        default:
          // Dark areas → dense characters, bright areas → sparse characters
          charIndex = Math.floor(((255 - luminance) / 255) * (charCount - 1));
          break;
      }

      charIndex = Math.max(0, Math.min(charIndex, charCount - 1));

      row.push({
        char: chars[charIndex],
        r: mode === 'colored' ? r : 200,
        g: mode === 'colored' ? g : 200,
        b: mode === 'colored' ? b : 200,
      });
    }
    grid.push(row);
  }

  return grid;
}

/**
 * Converts an AsciiGrid to a plain text string.
 */
export function gridToText(grid: AsciiGrid): string {
  return grid.map(row => row.map(cell => cell.char).join('')).join('\n');
}
