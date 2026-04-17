// ─── Image Exporter ──────────────────────────────────────────────────────────
// Exports the current ASCII canvas as a PNG image.

export function exportAsImage(
  canvas: HTMLCanvasElement,
  filename: string = 'ascii-art'
): void {
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
