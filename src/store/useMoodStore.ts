import { create } from 'zustand';
import {
  getGoodMoodNotes,
  saveGoodMoodNote,
  deleteGoodMoodNote,
} from '@/utils/storage';

export interface GoodMoodNote {
  id: string;
  content: string;
  emojiTag: string;
  timestamp: number;
}

interface MoodState {
  notes: GoodMoodNote[];
  isLoading: boolean;

  loadNotes: () => Promise<void>;
  addNote: (content: string, emojiTag: string) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  updateNote: (id: string, content: string, emojiTag: string) => Promise<void>;
}

export const useMoodStore = create<MoodState>((set) => ({
  notes: [],
  isLoading: false,

  loadNotes: async () => {
    set({ isLoading: true });
    const all = await getGoodMoodNotes();
    all.sort((a, b) => b.timestamp - a.timestamp);
    set({ notes: all, isLoading: false });
  },

  addNote: async (content, emojiTag) => {
    const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 11);
    const note: GoodMoodNote = { id, content, emojiTag, timestamp: Date.now() };
    await saveGoodMoodNote(note);
    set((state) => ({ notes: [note, ...state.notes] }));
  },

  removeNote: async (id) => {
    await deleteGoodMoodNote(id);
    set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
  },

  updateNote: async (id, content, emojiTag) => {
    const updated = { id, content, emojiTag, timestamp: Date.now() };
    await saveGoodMoodNote(updated);
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, content, emojiTag } : n)),
    }));
  },
}));
