// ─── Character Set Definitions ───────────────────────────────────────────────
// Each set maps brightness levels to ASCII characters, sorted from densest
// (darkest) to lightest. The mapper indexes into these arrays.

import { CharsetName } from './types';

const CHARSETS: Record<CharsetName, string> = {
  standard: '@%#*+=-:. ',
  minimal: '@#. ',
  detailed: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  block: '█▓▒░ ',
};

/**
 * Returns the character array for a given charset name.
 * Characters are ordered from dense (dark) to sparse (light).
 */
export function getCharset(name: CharsetName): string[] {
  return CHARSETS[name].split('');
}

/**
 * Returns all available charset names with descriptive labels.
 */
export function getCharsetOptions(): { value: CharsetName; label: string }[] {
  return [
    { value: 'standard', label: 'Standard (@%#*+=-:.)' },
    { value: 'minimal', label: 'Minimal (@#.)' },
    { value: 'detailed', label: 'Detailed (Extended Gradient)' },
    { value: 'block', label: 'Block (█▓▒░)' },
  ];
}
