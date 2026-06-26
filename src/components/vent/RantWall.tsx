import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, MessageSquareText, Skull } from 'lucide-react';
import { playSound } from '@/utils/sound';
import { vibrateTap } from '@/utils/vibration';

interface RantWallProps { onBack: () => void; }

interface RantBubble {
  id: number;
  text: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: 'sm' | 'md' | 'lg';
}

const STORM_COLORS = ['#ff6b6b', '#ffd93d', '#ff922b', '#f06595', '#cc5de8', '#4d96ff', '#ff4444'];
const ROTATIONS = [-8, -4, -2, 0, 2, 4, 8, 12];

export default function RantWall({ onBack }: RantWallProps) {
  const [input, setInput] = useState('');
  const [rants, setRants] = useState<RantBubble[]>([]);
  const [shake, setShake] = useState(false);
  const nextId = useRef(0);
  const wallRef = useRef<HTMLDivElement>(null);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const id = nextId.current++;
    const rant: RantBubble = {
      id,
      text: input.trim(),
      x: 5 + Math.random() * 80,
      y: 5 + Math.random() * 80,
      rotation: ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)],
      color: STORM_COLORS[Math.floor(Math.random() * STORM_COLORS.length)],
      size: (['sm', 'md', 'lg'] as const)[Math.floor(Math.random() * 3)],
    };
    setRants((prev) => [...prev.slice(-29), rant]); // max 30
    setInput('');
    setShake(true);
    setTimeout(() => setShake(false), 150);
    playSound('hit-punch');
    vibrateTap();
  }, [input]);

  const handleClear = () => {
    setRants([]);
    playSound('ding-success');
  };

  const getFontSize = (size: 'sm' | 'md' | 'lg') => {
    if (size === 'lg') return 24;
    if (size === 'md') return 17;
    return 13;
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 14, width: '100%', maxWidth: 420,
    }}>
      {/* Stats */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 14px', borderRadius: 20,
        background: 'rgba(240,101,149,0.1)',
      }}>
        <MessageSquareText size={16} color="#f06595" />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#f06595' }}>
          已吐槽 {rants.length} 条
        </span>
      </div>

      {/* Rant wall */}
      <motion.div
        ref={wallRef}
        animate={shake ? { x: [-4, 4, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'relative',
          width: '100%', height: 340,
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 20,
          border: '1.5px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.015) 39px, rgba(255,255,255,0.015) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.015) 39px, rgba(255,255,255,0.015) 40px)
          `,
          pointerEvents: 'none',
        }} />

        {/* Rant bubbles */}
        <AnimatePresence>
          {rants.map((rant) => (
            <motion.div
              key={rant.id}
              initial={{ opacity: 0, scale: 0, rotate: rant.rotation * 3 }}
              animate={{
                opacity: 0.85,
                scale: 1,
                rotate: rant.rotation,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                delay: 0,
              }}
              style={{
                position: 'absolute',
                left: `${rant.x}%`,
                top: `${rant.y}%`,
                transform: 'translate(-50%, -50%)',
                padding: '6px 14px',
                borderRadius: 12,
                background: `${rant.color}22`,
                border: `1.5px solid ${rant.color}33`,
                maxWidth: '85%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: getFontSize(rant.size),
                fontWeight: rant.size === 'lg' ? 800 : 600,
                color: rant.color,
                textShadow: rant.size === 'lg' ? `0 0 8px ${rant.color}44` : 'none',
                zIndex: rant.size === 'lg' ? 3 : 1,
              }}
              whileHover={{ scale: 1.08, zIndex: 10 }}
            >
              {rant.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {rants.length === 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 8,
          }}>
            <Skull size={36} color="rgba(255,255,255,0.08)" />
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.15)' }}>
              写下你的不满，它们会散落在墙上
            </p>
          </div>
        )}
      </motion.div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8, width: '100%' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="写一句吐槽…然后回车发射！"
          maxLength={30}
          style={{
            flex: 1,
            padding: '14px 18px',
            borderRadius: 14,
            border: '1.5px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#e8e8f0',
            fontSize: 15,
            outline: 'none',
          }}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            width: 48, height: 48, borderRadius: 14,
            background: input.trim()
              ? 'linear-gradient(135deg, #f06595, #e0447a)'
              : 'rgba(255,255,255,0.05)',
            border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Send size={18} color={input.trim() ? '#fff' : '#555'} />
        </motion.button>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        {rants.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 12,
              background: 'rgba(255,107,107,0.1)',
              border: 'none', color: '#ff6b6b', fontSize: 14, cursor: 'pointer',
            }}
          >
            <Trash2 size={15} /> 清空吐槽 ({rants.length})
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
