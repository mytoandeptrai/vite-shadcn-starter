import { useState, useEffect } from 'react';

interface CountdownTimerResult {
  left: number;
  isEnd: boolean;
}

export const useCountdownTimer = (targetTime: number): CountdownTimerResult => {
  const [left, setLeft] = useState(() => {
    const diff = targetTime - Date.now();
    return diff > 0 ? diff : 0;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLeft(() => {
        const diff = targetTime - Date.now();
        return diff > 0 ? diff : 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return { left, isEnd: left === 0 };
};