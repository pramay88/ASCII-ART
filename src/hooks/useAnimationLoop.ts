'use client';
// ─── Animation Loop Hook ─────────────────────────────────────────────────────

import { useRef, useEffect } from 'react';

/**
 * requestAnimationFrame wrapper with start/stop control.
 * Uses useRef for the callback to avoid stale closures.
 */
export function useAnimationLoop(
  callback: (timestamp: number) => void,
  active: boolean
): void {
  const callbackRef = useRef(callback);
  const rafIdRef = useRef<number | null>(null);

  // Keep callback ref fresh
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    const loop = (timestamp: number) => {
      callbackRef.current(timestamp);
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [active]);
}
