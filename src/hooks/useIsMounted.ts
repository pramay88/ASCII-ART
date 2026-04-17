'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to handle client-only rendering to avoid hydration mismatch.
 * Returns false on server and during hydration, true after mount.
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
