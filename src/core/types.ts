// ─── ASCII Art Studio — Shared Types ─────────────────────────────────────────

export interface AsciiCell {
  char: string;
  r: number;
  g: number;
  b: number;
}

export type AsciiGrid = AsciiCell[][];

export type RenderMode = 'grayscale' | 'colored' | 'edge' | 'inverted';

export type CharsetName = 'standard' | 'minimal' | 'detailed' | 'block';

export type ThemeName = 'dark' | 'light' | 'custom';

export type SourceType = 'none' | 'image' | 'video' | 'webcam';

export type ExportFormat = 'txt' | 'html' | 'png' | 'webm';

export interface ProcessingSettings {
  width: number;
  fontSize: number;
  lineSpacing: number;
  brightness: number;
  contrast: number;
  edgeThreshold: number;
  renderMode: RenderMode;
  charset: CharsetName;
}

export interface AppState {
  source: SourceType;
  renderMode: RenderMode;
  charset: CharsetName;
  width: number;
  fontSize: number;
  lineSpacing: number;
  brightness: number;
  contrast: number;
  edgeThreshold: number;
  isRecording: boolean;
  isPlaying: boolean;
}

export type AppAction =
  | { type: 'SET_SOURCE'; payload: SourceType }
  | { type: 'SET_RENDER_MODE'; payload: RenderMode }
  | { type: 'SET_CHARSET'; payload: CharsetName }
  | { type: 'SET_WIDTH'; payload: number }
  | { type: 'SET_FONT_SIZE'; payload: number }
  | { type: 'SET_LINE_SPACING'; payload: number }
  | { type: 'SET_BRIGHTNESS'; payload: number }
  | { type: 'SET_CONTRAST'; payload: number }
  | { type: 'SET_EDGE_THRESHOLD'; payload: number }
  | { type: 'SET_RECORDING'; payload: boolean }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'RESET' };
