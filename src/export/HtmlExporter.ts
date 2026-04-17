// ─── HTML Exporter ───────────────────────────────────────────────────────────
import { AsciiGrid } from '../core/types';

interface HtmlExportOptions {
  backgroundColor: string;
  defaultColor: string;
  fontSize: number;
  lineSpacing: number;
  colored: boolean;
  title: string;
}

const DEFAULTS: HtmlExportOptions = {
  backgroundColor: '#0a0a0f',
  defaultColor: '#e0e0e0',
  fontSize: 10,
  lineSpacing: 1.0,
  colored: false,
  title: 'ASCII Art',
};

export function exportAsHtml(
  grid: AsciiGrid,
  options: Partial<HtmlExportOptions> = {},
  filename: string = 'ascii-art'
): void {
  const opts = { ...DEFAULTS, ...options };

  let asciiContent: string;

  if (opts.colored) {
    // Build spans with inline color
    asciiContent = grid
      .map(row =>
        row
          .map(cell => {
            const color = `rgb(${cell.r},${cell.g},${cell.b})`;
            const escaped = escapeHtml(cell.char);
            return `<span style="color:${color}">${escaped}</span>`;
          })
          .join('')
      )
      .join('\n');
  } else {
    // Plain monochrome text
    asciiContent = grid
      .map(row => row.map(cell => escapeHtml(cell.char)).join(''))
      .join('\n');
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(opts.title)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: ${opts.backgroundColor};
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    pre {
      font-family: 'JetBrains Mono', monospace;
      font-size: ${opts.fontSize}px;
      line-height: ${opts.lineSpacing};
      color: ${opts.defaultColor};
      letter-spacing: 0.05em;
      white-space: pre;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <pre>${asciiContent}</pre>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  downloadBlob(blob, `${filename}.html`);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
