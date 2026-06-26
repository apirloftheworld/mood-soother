import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'mood-soother';
const DB_VERSION = 1;

interface GoodMoodNote {
  id: string;
  content: string;
  emojiTag: string;
  timestamp: number;
}

interface MoodEntry {
  id: string;
  timestamp: number;
  moodType: 'negative' | 'positive';
  emotionKeyword: string;
  sessionType: 'soothe' | 'vent' | 'goodmood';
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('goodMoodNotes')) {
          const notesStore = db.createObjectStore('goodMoodNotes', {
            keyPath: 'id',
          });
          notesStore.createIndex('timestamp', 'timestamp');
        }
        if (!db.objectStoreNames.contains('moodEntries')) {
          const entriesStore = db.createObjectStore('moodEntries', {
            keyPath: 'id',
          });
          entriesStore.createIndex('timestamp', 'timestamp');
        }
      },
    });
  }
  return dbPromise;
}

/** Check if IndexedDB is available */
async function isIDBAvailable(): Promise<boolean> {
  try {
    await getDB();
    return true;
  } catch {
    return false;
  }
}

// ===== Good Mood Notes =====

export async function saveGoodMoodNote(note: GoodMoodNote): Promise<void> {
  if (await isIDBAvailable()) {
    const db = await getDB();
    await db.put('goodMoodNotes', note);
  } else {
    // Fallback to localStorage
    const notes = getGoodMoodNotesFromLS();
    notes.push(note);
    localStorage.setItem('mood-soother:goodMoodNotes', JSON.stringify(notes));
  }
}

export async function getGoodMoodNotes(): Promise<GoodMoodNote[]> {
  if (await isIDBAvailable()) {
    const db = await getDB();
    return db.getAllFromIndex('goodMoodNotes', 'timestamp');
  }
  return getGoodMoodNotesFromLS();
}

export async function deleteGoodMoodNote(id: string): Promise<void> {
  if (await isIDBAvailable()) {
    const db = await getDB();
    await db.delete('goodMoodNotes', id);
  } else {
    const notes = getGoodMoodNotesFromLS().filter((n) => n.id !== id);
    localStorage.setItem('mood-soother:goodMoodNotes', JSON.stringify(notes));
  }
}

function getGoodMoodNotesFromLS(): GoodMoodNote[] {
  try {
    const raw = localStorage.getItem('mood-soother:goodMoodNotes');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ===== Mood Entries (history) =====

export async function saveMoodEntry(entry: MoodEntry): Promise<void> {
  if (await isIDBAvailable()) {
    const db = await getDB();
    await db.put('moodEntries', entry);
  }
}

export async function getMoodEntries(): Promise<MoodEntry[]> {
  if (await isIDBAvailable()) {
    const db = await getDB();
    return db.getAllFromIndex('moodEntries', 'timestamp');
  }
  return [];
}

// ===== Utility =====

export function generateId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}
