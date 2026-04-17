'use client';
// ─── FPS Counter Hook ────────────────────────────────────────────────────────

import { useState, useRef, useCallback } from 'react';

/**
 * Measures and returns the current FPS. Call `tick()` on each frame.
 * Updates the FPS value every 500ms to avoid jitter.
 */
export function useFps(): { fps: number; tick: () => void } {
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    const now = performance.now();
    if (lastTimeRef.current === null) {
      lastTimeRef.current = now;
      return;
    }

    frameCountRef.current++;
    const elapsed = now - lastTimeRef.current;

    if (elapsed >= 500) {
      setFps(Math.round((frameCountRef.current / elapsed) * 1000));
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  }, []);

  return { fps, tick };
}
