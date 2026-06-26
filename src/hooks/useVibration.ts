import { useCallback } from 'react';
import { vibrateTap, vibratePunch, vibrateHeavy, isVibrationAvailable } from '@/utils/vibration';

export function useVibration() {
  const available = isVibrationAvailable();

  const tap = useCallback(() => vibrateTap(), []);
  const punch = useCallback(() => vibratePunch(), []);
  const heavy = useCallback(() => vibrateHeavy(), []);

  return { available, tap, punch, heavy };
}
