import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Heart, Sparkles } from 'lucide-react';
import { useMoodStore } from '@/store';

export default function JoyFlashback() {
  const notes = useMoodStore((s) => s.notes);
  const [flashback, setFlashback] = useState<typeof notes[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const triggerFlashback = useCallback(() => {
    if (notes.length === 0) return;
    const random = notes[Math.floor(Math.random() * notes.length)];
    setFlashback(random);
    setIsVisible(true);
  }, [notes]);

  if (notes.length === 0) return null;

  const fmtDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onClick={triggerFlashback}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '12px 20px', borderRadius: 14, width: '100%',
          background: 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(245,158,11,0.08))',
          border: '1.5px dashed rgba(236,72,153,0.2)',
          cursor: 'pointer', color: '#d08090',
          fontSize: 14, fontWeight: 600,
        }}
      >
        <Shuffle size={16} />
        随机回顾一条开心回忆
      </motion.button>

      <AnimatePresence>
        {isVisible && flashback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)',
              padding: 24,
            }}
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(150deg, #fff9f0, #fff3e0, #fffdf7)',
                borderRadius: 24, padding: '32px 28px',
                maxWidth: 340, width: '100%', textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ marginBottom: 16 }}
              >
                <Sparkles size={32} color="#f0a040" />
              </motion.div>
              <div style={{
                width: 56, height: 56, borderRadius: 18,
                background: 'rgba(255,255,255,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: 28,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}>
                {flashback.emojiTag}
              </div>
              <p style={{
                fontSize: 18, fontWeight: 600, color: '#5c3d2e',
                lineHeight: 1.6, marginBottom: 8,
              }}>
                {flashback.content}
              </p>
              <p style={{ fontSize: 13, color: '#c0a890', marginBottom: 20 }}>
                {fmtDate(flashback.timestamp)}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={triggerFlashback}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 12,
                    background: 'rgba(240,160,64,0.1)',
                    color: '#f0a040', fontSize: 14, fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  }}
                >
                  <Shuffle size={14} /> 再换一条
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 12,
                    background: 'rgba(0,0,0,0.04)',
                    color: '#999', fontSize: 14, fontWeight: 500,
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  }}
                >
                  <Heart size={14} /> 记住了
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
