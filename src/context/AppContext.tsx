'use client';
// ─── App Context ─────────────────────────────────────────────────────────────
// Global state for all processing settings, managed via useReducer.

import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import { AppState, AppAction } from '../core/types';

const initialState: AppState = {
  source: 'none',
  renderMode: 'grayscale',
  charset: 'standard',
  width: 200,
  fontSize: 8,
  lineSpacing: 1.0,
  brightness: 1.0,
  contrast: 2.0,
  edgeThreshold: 80,
  isRecording: false,
  isPlaying: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SOURCE':
      return { ...state, source: action.payload };
    case 'SET_RENDER_MODE':
      return { ...state, renderMode: action.payload };
    case 'SET_CHARSET':
      return { ...state, charset: action.payload };
    case 'SET_WIDTH':
      return { ...state, width: action.payload };
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload };
    case 'SET_LINE_SPACING':
      return { ...state, lineSpacing: action.payload };
    case 'SET_BRIGHTNESS':
      return { ...state, brightness: action.payload };
    case 'SET_CONTRAST':
      return { ...state, contrast: action.payload };
    case 'SET_EDGE_THRESHOLD':
      return { ...state, edgeThreshold: action.payload };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'RESET':
      return { ...initialState, source: state.source };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}
