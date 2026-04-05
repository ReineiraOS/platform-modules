import { useCallback, useEffect, useRef, useState } from 'react';

export function usePolling(callback: () => Promise<void>, intervalMs = 3000) {
  const [isPolling, setIsPolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const stop = useCallback(() => {
    setIsPolling(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (timerRef.current) return;
    setIsPolling(true);
    timerRef.current = setInterval(async () => {
      try {
        await callbackRef.current();
      } catch {
        stop();
      }
    }, intervalMs);
  }, [intervalMs, stop]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return { isPolling, start, stop };
}
