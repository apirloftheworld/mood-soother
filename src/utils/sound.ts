type SoundName = 'breath-in' | 'breath-out' | 'hit-punch' | 'egg-splash' | 'ding-success';

const SOUND_PATHS: Record<SoundName, string> = {
  'breath-in': '/sounds/breath-in.mp3',
  'breath-out': '/sounds/breath-out.mp3',
  'hit-punch': '/sounds/hit-punch.mp3',
  'egg-splash': '/sounds/egg-splash.mp3',
  'ding-success': '/sounds/ding-success.mp3',
};

const audioCache: Partial<Record<SoundName, HTMLAudioElement>> = {};

function getAudio(name: SoundName): HTMLAudioElement {
  if (!audioCache[name]) {
    audioCache[name] = new Audio(SOUND_PATHS[name]);
    audioCache[name]!.preload = 'auto';
  }
  return audioCache[name]!;
}

export function playSound(name: SoundName): void {
  try {
    const audio = getAudio(name);
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Autoplay might be blocked — that's fine, silently ignore
    });
  } catch {
    // Browser doesn't support audio — silently ignore
  }
}
