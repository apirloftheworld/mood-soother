import { useState, useEffect, useCallback, useRef } from 'react';
import type { BreathingPattern, BreathingPhase } from '@/utils/timer';

interface BreathingState {
  phase: BreathingPhase;
  phaseIndex: number;
  cycleCount: number;
  secondsLeft: number;
  isActive: boolean;
  totalCycles: number;
}

export function useBreathingTimer(pattern: BreathingPattern) {
  const [state, setState] = useState<BreathingState>({
    phase: pattern.phases[0],
    phaseIndex: 0,
    cycleCount: 0,
    secondsLeft: pattern.phases[0].durationSeconds,
    isActive: true,
    totalCycles: pattern.cyclesRecommended,
  });

  const intervalRef = useRef<number | null>(null);

  const advance = useCallback(() => {
    setState((prev) => {
      if (!prev.isActive) return prev;

      if (prev.secondsLeft <= 1) {
        const nextPhaseIndex = prev.phaseIndex + 1;
        if (nextPhaseIndex >= pattern.phases.length) {
          // Cycle complete
          const nextCycle = prev.cycleCount + 1;
          if (nextCycle >= prev.totalCycles) {
            return { ...prev, isActive: false, secondsLeft: 0 };
          }
          return {
            ...prev,
            phase: pattern.phases[0],
            phaseIndex: 0,
            cycleCount: nextCycle,
            secondsLeft: pattern.phases[0].durationSeconds,
          };
        }
        return {
          ...prev,
          phase: pattern.phases[nextPhaseIndex],
          phaseIndex: nextPhaseIndex,
          secondsLeft: pattern.phases[nextPhaseIndex].durationSeconds,
        };
      }
      return { ...prev, secondsLeft: prev.secondsLeft - 1 };
    });
  }, [pattern]);

  useEffect(() => {
    if (!state.isActive) return;
    intervalRef.current = window.setInterval(advance, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isActive, advance]);

  const reset = useCallback(() => {
    setState({
      phase: pattern.phases[0],
      phaseIndex: 0,
      cycleCount: 0,
      secondsLeft: pattern.phases[0].durationSeconds,
      isActive: true,
      totalCycles: pattern.cyclesRecommended,
    });
  }, [pattern]);

  return { ...state, reset };
}
