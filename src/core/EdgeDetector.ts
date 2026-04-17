// ─── Edge Detector (Sobel) ───────────────────────────────────────────────────
// Lightweight Sobel-based edge detection. Avoids the 8MB OpenCV.js dependency.
// Steps: Grayscale → Gaussian Blur → Sobel Gx/Gy → Gradient Magnitude → Threshold

/**
 * Detects edges in an ImageData using a Sobel operator.
 * Returns a new ImageData where edges are white (255) and non-edges are black (0).
 */
export function detectEdges(
  imageData: ImageData,
  threshold: number = 80
): ImageData {
  const { width, height, data } = imageData;

  // Step 1: Convert to grayscale
  const gray = new Float32Array(width * height);
  for (let i = 0; i < gray.length; i++) {
    const idx = i * 4;
    gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  }

  // Step 2: Gaussian blur (3×3)
  const blurred = gaussianBlur3x3(gray, width, height);

  // Step 3: Sobel operator
  const sobelGx = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];
  const sobelGy = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ];

  const magnitude = new Float32Array(width * height);
  let maxMag = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0;
      let gy = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixel = blurred[(y + ky) * width + (x + kx)];
          gx += pixel * sobelGx[ky + 1][kx + 1];
          gy += pixel * sobelGy[ky + 1][kx + 1];
        }
      }

      const mag = Math.sqrt(gx * gx + gy * gy);
      magnitude[y * width + x] = mag;
      if (mag > maxMag) maxMag = mag;
    }
  }

  // Step 4: Normalize & threshold → output ImageData
  const output = new ImageData(width, height);
  const outData = output.data;

  for (let i = 0; i < magnitude.length; i++) {
    const normalized = maxMag > 0 ? (magnitude[i] / maxMag) * 255 : 0;
    const value = normalized > threshold ? 255 : 0;
    const idx = i * 4;
    outData[idx] = value;
    outData[idx + 1] = value;
    outData[idx + 2] = value;
    outData[idx + 3] = 255;
  }

  return output;
}

/**
 * Applies a 3×3 Gaussian blur to a grayscale float array.
 */
function gaussianBlur3x3(
  gray: Float32Array,
  width: number,
  height: number
): Float32Array {
  const kernel = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1],
  ];
  const kernelSum = 16;
  const blurred = new Float32Array(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          sum += gray[(y + ky) * width + (x + kx)] * kernel[ky + 1][kx + 1];
        }
      }
      blurred[y * width + x] = sum / kernelSum;
    }
  }

  return blurred;
}
