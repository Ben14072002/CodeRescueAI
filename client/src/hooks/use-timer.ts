import { useState, useRef, useCallback } from "react";

interface Timer {
  startTime: number;
  isRunning: boolean;
}

export function useTimer() {
  const [timers, setTimers] = useState<Record<number, Timer>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback((id: number) => {
    setTimers(prev => ({
      ...prev,
      [id]: {
        startTime: Date.now(),
        isRunning: true,
      }
    }));

    // Start interval to update all running timers
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimers(prev => ({ ...prev })); // Force re-render
      }, 1000);
    }
  }, []);

  const stopTimer = useCallback((id: number): number => {
    const timer = timers[id];
    if (!timer || !timer.isRunning) return 0;

    const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
    
    setTimers(prev => {
      const updated = { ...prev };
      delete updated[id];
      
      // If no more running timers, clear interval
      const hasRunningTimers = Object.values(updated).some(t => t.isRunning);
      if (!hasRunningTimers && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      return updated;
    });

    return elapsed;
  }, [timers]);

  const getElapsedTime = useCallback((id: number): number => {
    const timer = timers[id];
    if (!timer || !timer.isRunning) return 0;
    return Math.floor((Date.now() - timer.startTime) / 1000);
  }, [timers]);

  const isTimerRunning = useCallback((id: number): boolean => {
    return timers[id]?.isRunning || false;
  }, [timers]);

  const stopAllTimers = useCallback(() => {
    const elapsed: Record<number, number> = {};
    
    Object.keys(timers).forEach(idStr => {
      const id = parseInt(idStr);
      elapsed[id] = stopTimer(id);
    });

    return elapsed;
  }, [timers, stopTimer]);

  return {
    timers,
    startTimer,
    stopTimer,
    getElapsedTime,
    isTimerRunning,
    stopAllTimers,
  };
}
