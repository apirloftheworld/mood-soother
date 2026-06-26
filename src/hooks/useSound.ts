import { useCallback } from 'react';
import { playSound } from '@/utils/sound';

export function useSound() {
  const play = useCallback((name: Parameters<typeof playSound>[0]) => {
    playSound(name);
  }, []);

  return { play };
}
