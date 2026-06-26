import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

interface ComboCounterProps { combo: number; }

export default function ComboCounter({ combo }: ComboCounterProps) {
  if (combo < 2) return <span style={{ fontSize: 14, color: '#8888a8' }}>连击</span>;

  const isHot = combo > 20;
  const isWarm = combo > 10;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      {isHot && (
        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
          <Flame size={isHot ? 22 : 16} color="#ff4444" fill="#ff4444" />
        </motion.div>
      )}
      <AnimatePresence mode="wait">
        <motion.span
          key={combo}
          initial={{ scale: 1.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          style={{
            fontSize: isHot ? 30 : isWarm ? 22 : 16,
            fontWeight: 800, lineHeight: 1,
            color: isHot ? '#ff4444' : isWarm ? '#ffd93d' : '#e8e8f0',
            textShadow: isHot ? '0 0 20px rgba(255,60,60,0.7)' : 'none',
          }}
        >
          {combo}
        </motion.span>
      </AnimatePresence>
      <span style={{ fontSize: 12, fontWeight: 600, color: isHot ? '#ff4444' : '#ffd93d' }}>
        连击
      </span>
    </div>
  );
}
