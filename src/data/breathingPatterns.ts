import { createBreathingPattern, type BreathingPattern } from '@/utils/timer';

export const breathingPatterns: BreathingPattern[] = [
  createBreathingPattern('4-7-8', '4-7-8 放松呼吸', 4, 7, 8, 3),
  createBreathingPattern('box', '盒式呼吸 (Box Breathing)', 4, 4, 4, 4),
  createBreathingPattern('4-2-6', '4-2-6 深长呼吸', 4, 2, 6, 4),
];

export const defaultPattern = breathingPatterns[0];
