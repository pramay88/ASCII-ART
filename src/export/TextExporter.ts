// ─── Text Exporter ───────────────────────────────────────────────────────────
import { AsciiGrid } from '../core/types';
import { gridToText } from '../core/AsciiMapper';

export function exportAsText(grid: AsciiGrid, filename: string = 'ascii-art'): void {
  const text = gridToText(grid);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, `${filename}.txt`);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
