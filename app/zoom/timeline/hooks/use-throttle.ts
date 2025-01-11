import { useRef, useEffect, useCallback } from 'react';

function useThrottle<T extends (...args: any[]) => void>(callback: T, delay: number): T {
  const lastCall = useRef<number>(0);
  const savedCallback = useRef<T>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        savedCallback.current(...args);
      }
    },
    [delay],
  ) as T;
}

export default useThrottle;
