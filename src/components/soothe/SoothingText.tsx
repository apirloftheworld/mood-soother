import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, SkipForward } from 'lucide-react';
import type { EmotionKey } from '@/data/soothingMessages';
import { soothingMessages } from '@/data/soothingMessages';

interface SoothingTextProps {
  emotionKey: EmotionKey;
  onDone: () => void;
}

export default function SoothingText({ emotionKey, onDone }: SoothingTextProps) {
  const messages = soothingMessages[emotionKey];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= messages.length - 1) return;
    const timer = setTimeout(() => setIndex((i) => i + 1), 3800);
    return () => clearTimeout(timer);
  }, [index, messages.length]);

  const current = messages[index];
  const isLast = index >= messages.length - 1;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 32, width: '100%', maxWidth: 380, minHeight: 320,
      padding: 'var(--space-lg)',
    }}>
      {/* Floating heart */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 56, height: 56, borderRadius: 18,
          background: 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(244,143,177,0.15)',
        }}
      >
        <Heart size={26} color="#f06292" strokeWidth={1.8} fill="#f06292" fillOpacity={0.15} />
      </motion.div>

      {/* Message */}
      <div style={{
        minHeight: 120, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{
              fontSize: 18, lineHeight: 1.85, fontWeight: 500,
              color: '#3a3a5c', textAlign: 'center',
              maxWidth: 320,
            }}
          >
            {current}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 6 }}>
        {messages.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i <= index ? 20 : 6, height: 6,
              background: i <= index ? '#7c8ce0' : '#d5d0e8',
            }}
            transition={{ duration: 0.35 }}
            style={{ borderRadius: 3 }}
          />
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {!isLast && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIndex((i) => i + 1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '10px 18px', borderRadius: 12,
              background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(0,0,0,0.06)',
              color: '#7c7b9c', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}
          >
            下一条 <ChevronRight size={15} />
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onDone}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 22px', borderRadius: 12,
            background: 'linear-gradient(135deg, #818cf8, #7c8ce0)',
            color: '#fff', fontSize: 14, fontWeight: 600, border: 'none',
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,140,224,0.3)',
          }}
        >
          {isLast ? '开始呼吸练习' : '跳过文字'} <SkipForward size={15} />
        </motion.button>
      </div>
    </div>
  );
}
