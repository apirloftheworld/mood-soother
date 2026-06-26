import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Egg, RotateCcw, Target, Type } from 'lucide-react';
import TargetBoard from './TargetBoard';
import { playSound } from '@/utils/sound';

interface EggThrowProps { onBack: () => void; }
interface FlyingEgg { id: number; x: number; y: number; targetX: number; targetY: number; }

export default function EggThrow({ onBack }: EggThrowProps) {
  const [label, setLabel] = useState('');
  const [labelSet, setLabelSet] = useState(false);
  const [dirtLevel, setDirtLevel] = useState(0);
  const [isBroken, setIsBroken] = useState(false);
  const [eggs, setEggs] = useState<FlyingEgg[]>([]);
  const [nextId, setNextId] = useState(0);
  const [hitCount, setHitCount] = useState(0);

  const handleSetLabel = () => { if (label.trim()) setLabelSet(true); };

  const handleThrow = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isBroken) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const tx = e.clientX - rect.left;
    const ty = e.clientY - rect.top;
    const sx = rect.width / 2 + (Math.random() - 0.5) * 80;
    const sy = rect.height + 40;
    const egg: FlyingEgg = { id: nextId, x: sx, y: sy, targetX: tx, targetY: ty };
    setNextId((n) => n + 1);
    setEggs((p) => [...p, egg]);

    setTimeout(() => {
      setEggs((p) => p.filter((e) => e.id !== egg.id));
      playSound('egg-splash');
      setHitCount((h) => h + 1);
      const nd = dirtLevel + 7 + Math.floor(Math.random() * 9);
      if (nd >= 100) { setDirtLevel(100); setIsBroken(true); playSound('hit-punch'); }
      else setDirtLevel(nd);
    }, 380);
  }, [isBroken, dirtLevel, nextId]);

  const handleReset = () => {
    setDirtLevel(0); setIsBroken(false); setLabelSet(false);
    setLabel(''); setHitCount(0);
  };

  if (!labelSet) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 20, width: '100%', maxWidth: 380,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'rgba(255,217,61,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Type size={26} color="#ffd93d" strokeWidth={1.6} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#e8e8f0', textAlign: 'center' }}>
          创建一个立牌
        </h3>
        <p style={{ fontSize: 13, color: '#8888a8', textAlign: 'center' }}>
          写上让你不爽的对象，名字不会保存
        </p>
        <input
          type="text" value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSetLabel()}
          placeholder="输入一个名字或标签…"
          autoFocus
          style={{
            width: '100%', padding: '14px 18px', borderRadius: 14,
            border: '1.5px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#e8e8f0', fontSize: 16, outline: 'none',
          }}
        />
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSetLabel}
          style={{
            padding: '14px', borderRadius: 14, width: '100%',
            background: 'linear-gradient(135deg, #ff6b6b, #e55a5a)',
            color: '#fff', fontSize: 16, fontWeight: 600, border: 'none',
            cursor: 'pointer',
          }}
        >
          创建立牌
        </motion.button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 20, width: '100%', maxWidth: 380,
    }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 20,
          background: 'rgba(255,217,61,0.1)',
        }}>
          <Egg size={15} color="#ffd93d" />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#ffd93d' }}>
            {hitCount} 次命中
          </span>
        </div>
      </div>

      <p style={{ fontSize: 13, color: '#8888a8' }}>点击立牌投掷臭鸡蛋！</p>

      <div style={{ position: 'relative' }}>
        <TargetBoard label={label} dirtLevel={dirtLevel} isBroken={isBroken} onHit={() => {}} />

        <AnimatePresence>
          {eggs.map((egg) => (
            <motion.div
              key={egg.id}
              initial={{ x: egg.x - 10, y: egg.y, opacity: 1, scale: 1 }}
              animate={{ x: egg.targetX - 10, y: egg.targetY - 10, opacity: 0.7, scale: 0.6 }}
              exit={{ opacity: 0, scale: 3 }}
              transition={{ duration: 0.32, ease: 'easeIn' }}
              style={{
                position: 'absolute', zIndex: 10, pointerEvents: 'none',
                width: 22, height: 26,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                background: 'radial-gradient(circle at 40% 30%, #e8dca0, #b8a060)',
                border: '1px solid rgba(0,0,0,0.15)',
              }}
            />
          ))}
        </AnimatePresence>

        {!isBroken && (
          <div onClick={handleThrow} style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} />
        )}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {isBroken && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 12,
              background: 'linear-gradient(135deg, #ff6b6b, #e55a5a)',
              color: '#fff', fontSize: 14, fontWeight: 600, border: 'none',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={15} /> 再建一个
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
          <Target size={15} /> 换种方式
        </motion.button>
      </div>
    </div>
  );
}
