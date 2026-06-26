/** Check if vibration API is available */
export function isVibrationAvailable(): boolean {
  return 'vibrate' in navigator;
}

/** Vibrate for a given duration (ms) or pattern (ms[]) */
export function vibrate(pattern: number | number[]): void {
  if (!isVibrationAvailable()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Silently ignore — some browsers expose vibrate but block it
  }
}

/** Short tap feedback (~30ms) */
export function vibrateTap(): void {
  vibrate(30);
}

/** Punch hit feedback (short burst) */
export function vibratePunch(): void {
  vibrate(50);
}

/** Heavy hit (slightly longer) */
export function vibrateHeavy(): void {
  vibrate([30, 50, 30]);
}
