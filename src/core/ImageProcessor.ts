// ─── Image Processing Pipeline ───────────────────────────────────────────────
// Handles downscaling, brightness adjustment, and contrast scaling.
// All operations work directly on Uint8ClampedArray for performance.

/**
 * Downscales an image (from a canvas) to the target ASCII width.
 * Accounts for the ~2:1 character height:width ratio so output isn't stretched.
 */
export function downscale(
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number
): ImageData {
  const aspect = sourceCanvas.height / sourceCanvas.width;
  // Characters are roughly 2x taller than wide, so halve the height ratio
  const targetHeight = Math.round(targetWidth * aspect * 0.5);

  const offscreen = document.createElement('canvas');
  offscreen.width = targetWidth;
  offscreen.height = targetHeight;
  const ctx = offscreen.getContext('2d')!;

  // Use bilinear interpolation for quality downscale
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'medium';
  ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);

  return ctx.getImageData(0, 0, targetWidth, targetHeight);
}

/**
 * Applies brightness gain (multiplier) to pixel data in-place.
 * gain = 1.0 → no change, < 1.0 → darker, > 1.0 → brighter
 */
export function applyBrightness(
  data: Uint8ClampedArray,
  gain: number
): void {
  if (gain === 1.0) return;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] * gain;         // R
    data[i + 1] = data[i + 1] * gain; // G
    data[i + 2] = data[i + 2] * gain; // B
    // Alpha (i+3) unchanged
  }
}

/**
 * Applies contrast scaling to pixel data in-place.
 * factor = 1.0 → no change, > 1.0 → more contrast, < 1.0 → less contrast
 * Uses midpoint (128) normalization.
 */
export function applyContrast(
  data: Uint8ClampedArray,
  factor: number
): void {
  if (factor === 1.0) return;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp((data[i] - 128) * factor + 128);
    data[i + 1] = clamp((data[i + 1] - 128) * factor + 128);
    data[i + 2] = clamp((data[i + 2] - 128) * factor + 128);
  }
}

/**
 * Processes an image through the full pipeline: downscale → brightness → contrast.
 */
export function processImage(
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  brightness: number,
  contrast: number
): ImageData {
  const imageData = downscale(sourceCanvas, targetWidth);
  applyBrightness(imageData.data, brightness);
  applyContrast(imageData.data, contrast);
  return imageData;
}

function clamp(value: number): number {
  return value < 0 ? 0 : value > 255 ? 255 : value;
}
