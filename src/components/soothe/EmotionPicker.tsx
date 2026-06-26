import { useState } from 'react';
import { motion } from 'framer-motion';
import { Frown, CloudRain, Flame, AlertTriangle, HeartCrack, PenLine, Send } from 'lucide-react';
import { emotionLabels, matchEmotion, type EmotionKey } from '@/data/soothingMessages';

const iconMap: Record<EmotionKey, typeof Frown> = {
  anxiety: AlertTriangle,
  sad: CloudRain,
  anger: Flame,
  stress: AlertTriangle,
  hurt: HeartCrack,
};

const colorMap: Record<EmotionKey, string> = {
  anxiety: '#a78bfa',
  sad: '#60a5fa',
  anger: '#f87171',
  stress: '#fbbf24',
  hurt: '#fb923c',
};

interface EmotionPickerProps {
  onSelect: (key: EmotionKey, label: string) => void;
}

export default function EmotionPicker({ onSelect }: EmotionPickerProps) {
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleCustom = () => {
    if (customInput.trim()) {
      const key = matchEmotion(customInput.trim());
      onSelect(key, customInput.trim());
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 28, width: '100%', maxWidth: 380,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center' }}
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'linear-gradient(135deg, #e8e6f8, #d5d0f0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(124,140,224,0.12)',
          }}
        >
          <Frown size={30} color="#7c8ce0" strokeWidth={1.6} />
        </motion.div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#3a3a5c', marginBottom: 6 }}>
          你现在感觉怎么样
        </h2>
        <p style={{ fontSize: 14, color: '#9b99b8' }}>选一个最贴近此刻感受的词</p>
      </motion.div>

      {/* Emotion grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: 10, width: '100%',
      }}>
        {emotionLabels.map((item, i) => {
          const Icon = iconMap[item.key];
          const color = colorMap[item.key];
          return (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelect(item.key, item.label)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 8, padding: '16px 10px', borderRadius: 16,
                background: 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(0,0,0,0.05)',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `${color}14`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} color={color} strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#4a4a6a' }}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Custom input */}
      {!showCustom ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCustom(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 500,
            color: '#9b99b8', background: 'none', border: 'none',
            cursor: 'pointer',
          }}
        >
          <PenLine size={15} />
          没有想说的？自己写一个
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ display: 'flex', gap: 8, width: '100%' }}
        >
          <input
            type="text" value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustom()}
            placeholder="写下你的感受…"
            autoFocus
            style={{
              flex: 1, padding: '14px 18px', borderRadius: 14,
              border: '1.5px solid rgba(124,140,224,0.25)',
              background: 'rgba(255,255,255,0.8)',
              fontSize: 15, color: '#3a3a5c', outline: 'none',
            }}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleCustom}
            style={{
              padding: '0 18px', borderRadius: 14,
              background: 'linear-gradient(135deg, #818cf8, #7c8ce0)',
              color: '#fff', fontSize: 14, fontWeight: 600,
              border: 'none', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: 4,
            }}
          >
            <Send size={15} />
            确认
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
