import { create } from 'zustand';

export type AppMode = 'idle' | 'soothe' | 'vent' | 'goodmood';

interface AppState {
  /** Current active mode */
  mode: AppMode;
  /** Set the current mode */
  setMode: (mode: AppMode) => void;
  /** Navigate back to home */
  goHome: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'idle',
  setMode: (mode) => set({ mode }),
  goHome: () => set({ mode: 'idle' }),
}));
