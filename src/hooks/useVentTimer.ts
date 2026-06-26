import { useState, useEffect, useCallback } from 'react';

const DEFAULT_LIMIT_SECONDS = 180; // 3 minutes

export function useVentTimer(limitSeconds = DEFAULT_LIMIT_SECONDS) {
  const [secondsLeft, setSecondsLeft] = useState(limitSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!isRunning || isExpired) return;
    if (secondsLeft <= 0) {
      setIsExpired(true);
      setIsRunning(false);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, isExpired]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsExpired(false);
    setSecondsLeft(limitSeconds);
  }, [limitSeconds]);

  const reset = useCallback(() => {
    setSecondsLeft(limitSeconds);
    setIsExpired(false);
    setIsRunning(true);
  }, [limitSeconds]);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const formatTime = useCallback(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, [secondsLeft]);

  return { secondsLeft, isRunning, isExpired, start, reset, stop, formatTime };
}
