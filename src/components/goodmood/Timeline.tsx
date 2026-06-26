import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Sparkles, Pencil, Check, X } from 'lucide-react';
import { useMoodStore } from '@/store';
import type { GoodMoodNote } from '@/store';

export default function Timeline() {
  const { notes, isLoading, loadNotes, removeNote, updateNote } = useMoodStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const startEdit = (note: GoodMoodNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
    setEditEmoji(note.emojiTag);
  };

  const saveEdit = async () => {
    if (editingId && editContent.trim()) {
      await updateNote(editingId, editContent.trim(), editEmoji || '😊');
    }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  if (isLoading) {
    return <p style={{ textAlign: 'center', color: '#c0b0a0', fontSize: 14, padding: 32 }}>加载中…</p>;
  }

  if (notes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          textAlign: 'center', padding: '48px 20px', color: '#c0b0a0',
        }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'rgba(240,160,64,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Sparkles size={30} color="#e0c0a0" strokeWidth={1.5} />
        </motion.div>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#b8a090', marginBottom: 6 }}>
          还没有好心情记录
        </p>
        <p style={{ fontSize: 13, opacity: 0.7 }}>
          写下今天的第一条吧，点点滴滴都值得被记住
        </p>
      </motion.div>
    );
  }

  // Group by date
  const grouped = notes.reduce<Record<string, GoodMoodNote[]>>((acc, note) => {
    const d = new Date(note.timestamp);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {});

  const fmtDateHeader = (key: string) => {
    const [y, m, d] = key.split('-').map(Number);
    const date = new Date(y!, m! - 1, d!);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diff = (today.getTime() - dateDay.getTime()) / 86400000;
    if (diff === 0) return '今天';
    if (diff === 1) return '昨天';
    if (diff < 7) return `${diff}天前`;
    return `${m}月${d}日`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {Object.entries(grouped).map(([dateKey, dayNotes]) => (
        <div key={dateKey}>
          {/* Date header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 10, paddingLeft: 4,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'linear-gradient(135deg, #f0a040, #fbbf60)',
            }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#b89870' }}>
              {fmtDateHeader(dateKey)}
            </span>
            <span style={{ fontSize: 12, color: '#d0c0b0' }}>
              {dayNotes.length} 条记录
            </span>
          </div>

          {/* Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dayNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '14px 16px', borderRadius: 16,
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(0,0,0,0.03)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                {/* Emoji */}
                <div style={{
                  width: 42, height: 42, borderRadius: 13,
                  background: 'rgba(255,255,255,0.9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                  {editingId === note.id ? editEmoji : note.emojiTag}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingId === note.id ? (
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                      style={{
                        width: '100%', padding: '6px 10px', borderRadius: 10,
                        border: '1.5px solid rgba(240,160,64,0.3)',
                        background: 'rgba(255,255,255,0.9)',
                        fontSize: 14, color: '#5c3d2e', outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  ) : (
                    <p style={{
                      fontSize: 14, color: '#5c3d2e', lineHeight: 1.5,
                      wordBreak: 'break-word',
                    }}>
                      {note.content}
                    </p>
                  )}
                  <p style={{ fontSize: 11, color: '#c0b0a0', marginTop: 4 }}>
                    {new Date(note.timestamp).getHours().toString().padStart(2, '0')}:
                    {new Date(note.timestamp).getMinutes().toString().padStart(2, '0')}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  {editingId === note.id ? (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={saveEdit}
                        style={{
                          padding: 6, borderRadius: 8, background: 'rgba(16,185,129,0.1)',
                          border: 'none', cursor: 'pointer', display: 'flex',
                        }}
                      >
                        <Check size={14} color="#10b981" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={cancelEdit}
                        style={{
                          padding: 6, borderRadius: 8, background: 'rgba(0,0,0,0.04)',
                          border: 'none', cursor: 'pointer', display: 'flex',
                        }}
                      >
                        <X size={14} color="#999" />
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => startEdit(note)}
                        style={{
                          padding: 6, borderRadius: 8, border: 'none',
                          cursor: 'pointer', background: 'none', opacity: 0.25,
                        }}
                      >
                        <Pencil size={13} color="#b0a090" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => removeNote(note.id)}
                        style={{
                          padding: 6, borderRadius: 8, border: 'none',
                          cursor: 'pointer', background: 'none', opacity: 0.25,
                        }}
                      >
                        <Trash2 size={13} color="#c0a0a0" />
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
