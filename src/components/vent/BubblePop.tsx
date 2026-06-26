import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleDot, RefreshCw, Grid3X3 } from 'lucide-react';
import { playSound } from '@/utils/sound';
import { vibrateTap } from '@/utils/vibration';

interface BubblePopProps { onBack: () => void; }

interface Bubble {
  id: number;
  x: number; y: number;
  size: number;
  popped: boolean;
  color: string;
  delay: number;
}

const COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b', '#cc5de8', '#20c997'];

function generateBubbles(count: number): Bubble[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    y: 5 + Math.random() * 85,
    size: 28 + Math.random() * 22,
    popped: false,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.3,
  }));
}

export default function BubblePop({ onBack }: BubblePopProps) {
  const [bubbles, setBubbles] = useState(() => generateBubbles(35));
  const [poppedCount, setPoppedCount] = useState(0);

  const allPopped = bubbles.every((b) => b.popped);

  const handlePop = useCallback((bubble: Bubble, _e: React.MouseEvent) => {
    if (bubble.popped) return;
    setBubbles((prev) => prev.map((b) => b.id === bubble.id ? { ...b, popped: true } : b));
    setPoppedCount((c) => c + 1);
    playSound('egg-splash');
    vibrateTap();
  }, []);

  const handleReset = () => {
    setBubbles(generateBubbles(40));
    setPoppedCount(0);
  };

  const remaining = bubbles.filter((b) => !b.popped).length;
  const progress = allPopped ? 100 : Math.round((poppedCount / bubbles.length) * 100);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 16, width: '100%', maxWidth: 420,
    }}>
      {/* Header stats */}
      <div style={{
        display: 'flex', gap: 24, alignItems: 'center',
        width: '100%', justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 20,
          background: 'rgba(107,203,119,0.1)',
        }}>
          <CircleDot size={16} color="#6bcb77" />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#6bcb77' }}>
            已捏爆 {poppedCount}
          </span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 20,
          background: 'rgba(255,255,255,0.05)',
        }}>
          <Grid3X3 size={14} color="#9999b0" />
          <span style={{ fontSize: 13, color: '#9999b0' }}>
            {remaining} 剩余
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          style={{
            height: '100%', borderRadius: 2,
            background: 'linear-gradient(90deg, #6bcb77, #20c997)',
          }}
        />
      </div>

      {/* Bubble area */}
      <div style={{
        position: 'relative',
        width: '100%', height: 360,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 20,
        border: '1.5px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        {bubbles.map((bubble) => (
          <AnimatePresence key={bubble.id}>
            {!bubble.popped && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ scale: [1, 1.4, 0], opacity: [1, 0.8, 0] }}
                transition={{
                  duration: 0.3,
                  delay: bubble.delay,
                  exit: { duration: 0.25 },
                }}
                onClick={(e) => handlePop(bubble, e)}
                style={{
                  position: 'absolute',
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: bubble.size,
                  height: bubble.size,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 30%, ${bubble.color}88, ${bubble.color}22)`,
                  border: `1.5px solid ${bubble.color}44`,
                  cursor: 'pointer',
                  boxShadow: `inset 0 0 ${bubble.size * 0.4}px ${bubble.color}22`,
                  transform: 'translate(-50%, -50%)',
                }}
                whileHover={{ scale: 1.2, boxShadow: `0 0 ${bubble.size}px ${bubble.color}44` }}
                whileTap={{ scale: 1.3 }}
              />
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* All popped celebration */}
      <AnimatePresence>
        {allPopped && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{
              textAlign: 'center',
              padding: '20px 28px',
              borderRadius: 20,
              background: 'rgba(107,203,119,0.1)',
              border: '1px solid rgba(107,203,119,0.2)',
            }}
          >
            <p style={{ fontSize: 28, marginBottom: 4 }}>🎉</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#6bcb77', marginBottom: 8 }}>
              全部捏爆！爽快！
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                margin: '0 auto', padding: '10px 20px', borderRadius: 12,
                background: 'rgba(107,203,119,0.2)',
                border: 'none', color: '#6bcb77', fontSize: 14, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={15} /> 再来一张
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        {!allPopped && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 12,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#9999b0', fontSize: 14, cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} /> 换一张
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#9999b0', fontSize: 14, cursor: 'pointer',
          }}
        >
          换种方式
        </motion.button>
      </div>
    </div>
  );
}
