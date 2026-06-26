import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Swords } from 'lucide-react';
import ComboCounter from './ComboCounter';
import { bossQuotes } from '@/data/bossQuotes';
import { playSound } from '@/utils/sound';
import { vibratePunch } from '@/utils/vibration';

interface BossPunchProps { onBack: () => void; }

interface Danmaku { id: number; text: string; y: number; }

export default function BossPunch({ onBack }: BossPunchProps) {
  const [combo, setCombo] = useState(0);
  const [flash, setFlash] = useState(false);
  const [danmakus, setDanmakus] = useState<Danmaku[]>([]);
  const [shake, setShake] = useState(false);
  const [totalHits, setTotalHits] = useState(0);
  const nextId = useRef(0);
  const comboTimer = useRef<number | null>(null);

  const resetCombo = useCallback(() => {
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = window.setTimeout(() => setCombo(0), 1500);
  }, []);

  const handleHit = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const nc = combo + 1;
    setCombo(nc); setTotalHits((h) => h + 1); resetCombo();
    setFlash(true); setTimeout(() => setFlash(false), 60);
    setShake(true); setTimeout(() => setShake(false), 280);
    playSound('hit-punch'); vibratePunch();

    if (nc % 3 === 0 || nc === 1) {
      const id = nextId.current++;
      const q = bossQuotes[Math.floor(Math.random() * bossQuotes.length)];
      setDanmakus((p) => [...p.slice(-7), { id, text: q, y: 15 + Math.random() * 55 }]);
      setTimeout(() => setDanmakus((p) => p.filter((d) => d.id !== id)), 2800);
    }
  }, [combo, resetCombo]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 20, width: '100%', maxWidth: 380,
    }}>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#ff6b6b' }}>{totalHits}</div>
          <div style={{ fontSize: 11, color: '#8888a8' }}>总击打</div>
        </div>
        <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ textAlign: 'center' }}>
          <ComboCounter combo={combo} />
        </div>
      </div>

      {/* Punch area */}
      <div style={{ position: 'relative', width: '100%', height: 320, overflow: 'hidden' }}>
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{
                position: 'absolute', inset: 0, zIndex: 5,
                background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent)',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        {/* Danmaku */}
        {danmakus.map((d) => (
          <motion.div
            key={d.id}
            initial={{ x: '100%', opacity: 1 }}
            animate={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 2.8, ease: 'linear' }}
            style={{
              position: 'absolute', top: `${d.y}%`, zIndex: 6,
              fontSize: 18, fontWeight: 800, color: '#ffd93d',
              whiteSpace: 'nowrap', pointerEvents: 'none',
              textShadow: '0 0 14px rgba(255,200,50,0.5)',
            }}
          >
            {d.text}
          </motion.div>
        ))}

        {/* Bag */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '100%',
        }}>
          <motion.div
            onClick={handleHit}
            onTouchStart={handleHit}
            animate={shake ? { x: [-8, 8, -5, 5, -3, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.28 }}
            style={{
              width: 180, height: 260, borderRadius: '50px 50px 24px 24px',
              background: 'linear-gradient(180deg, #d63031, #a71d2a)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', userSelect: 'none',
              boxShadow: '0 12px 40px rgba(200,0,0,0.3), inset 0 -6px 12px rgba(0,0,0,0.3)',
              position: 'relative', zIndex: 2,
            }}
          >
            <div style={{
              width: 8, height: 50, borderRadius: 4,
              background: 'linear-gradient(180deg, #999, #666)',
              marginBottom: 20,
            }} />
            <Crosshair size={40} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />
            <span style={{
              fontSize: 13, color: 'rgba(255,255,255,0.5)',
              marginTop: 12, userSelect: 'none',
            }}>
              点击出拳
            </span>

            {/* Glow ring */}
            <div style={{
              position: 'absolute', inset: -4, borderRadius: '54px 54px 28px 28px',
              border: '2px solid rgba(255,107,107,0.15)',
              pointerEvents: 'none',
            }} />
          </motion.div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
        连续点击保持连击 · 停顿 1.5 秒连击重置
      </p>

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
        <Swords size={15} /> 换种方式
      </motion.button>
    </div>
  );
}
