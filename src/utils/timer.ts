export interface BreathingPhase {
  name: string;
  label: string;
  durationSeconds: number;
}

export interface BreathingPattern {
  id: string;
  name: string;
  phases: BreathingPhase[];
  cyclesRecommended: number;
}

export function createBreathingPattern(
  id: string,
  name: string,
  inhale: number,
  hold: number,
  exhale: number,
  cycles: number
): BreathingPattern {
  return {
    id,
    name,
    phases: [
      { name: 'inhale', label: '吸气', durationSeconds: inhale },
      { name: 'hold', label: '屏息', durationSeconds: hold },
      { name: 'exhale', label: '呼气', durationSeconds: exhale },
    ],
    cyclesRecommended: cycles,
  };
}

export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
