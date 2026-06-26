import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, RotateCcw, CheckCircle2 } from 'lucide-react';
import { defaultPattern } from '@/data/breathingPatterns';
import type { BreathingPattern, BreathingPhase } from '@/utils/timer';
import { playSound } from '@/utils/sound';

interface BreathingCircleProps {
  pattern?: BreathingPattern;
  onDone: () => void;
}

const phaseColors: Record<string, string> = {
  inhale: '#818cf8',
  hold: '#a78bfa',
  exhale: '#f59e9f',
};

const phaseGradients: Record<string, string> = {
  inhale: 'radial-gradient(circle at 40% 40%, #818cf866, #818cf818)',
  hold: 'radial-gradient(circle at 40% 40%, #a78bfa66, #a78bfa18)',
  exhale: 'radial-gradient(circle at 40% 40%, #f59e9f66, #f59e9f18)',
};

export default function BreathingCircle({ pattern = defaultPattern, onDone }: BreathingCircleProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(pattern.phases[0].durationSeconds);
  const [isActive, setIsActive] = useState(true);
  const intervalRef = useRef<number | null>(null);

  const totalCycles = pattern.cyclesRecommended;
  const phase = pattern.phases[phaseIndex];

  const advance = useCallback(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        const nextPhaseIndex = phaseIndex + 1;
        if (nextPhaseIndex >= pattern.phases.length) {
          const nextCycle = cycleCount + 1;
          setCycleCount(nextCycle);
          if (nextCycle >= totalCycles) {
            setIsActive(false);
            return 0;
          }
          setPhaseIndex(0);
          playSound('breath-in');
          return pattern.phases[0].durationSeconds;
        }
        setPhaseIndex(nextPhaseIndex);
        const np = pattern.phases[nextPhaseIndex];
        if (np.name === 'exhale') playSound('breath-out');
        return np.durationSeconds;
      }
      return prev - 1;
    });
  }, [phaseIndex, cycleCount, pattern, totalCycles]);

  useEffect(() => {
    if (!isActive) return;
    intervalRef.current = window.setInterval(advance, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, advance]);

  function getScale(p: BreathingPhase, sec: number) {
    const ratio = sec / p.durationSeconds;
    switch (p.name) {
      case 'inhale': return 0.45 + ratio * 0.55;
      case 'hold': return 1.0;
      case 'exhale': return 0.45 + ratio * 0.55;
      default: return 0.7;
    }
  }

  const color = phaseColors[phase.name] ?? '#7c8ce0';
  const gradient = phaseGradients[phase.name] ?? phaseGradients.inhale;
  const scale = getScale(phase, secondsLeft);
  const progress = 1 - secondsLeft / phase.durationSeconds;
  const circumference = 2 * Math.PI * 72;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 28, width: '100%', maxWidth: 380,
    }}>
      {/* Phase label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${phaseIndex}-${cycleCount}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          style={{ textAlign: 'center' }}
        >
          <p style={{ fontSize: 26, fontWeight: 700, color: '#3a3a5c', marginBottom: 4 }}>
            {phase.label}
          </p>
          <p style={{
            fontSize: 42, fontWeight: 300, color, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {secondsLeft}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Breathing circle */}
      <div style={{
        position: 'relative', width: 220, height: 220,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* SVG ring */}
        <svg width="220" height="220" style={{ position: 'absolute' }}>
          <circle cx="110" cy="110" r="72" fill="none"
            stroke="#e8e6f2" strokeWidth="3" />
          <motion.circle cx="110" cy="110" r="72" fill="none"
            stroke={color} strokeWidth="3" strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 0.9, ease: 'linear' }}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '110px 110px' }}
          />
        </svg>

        {/* Animated circle blob */}
        <motion.div
          animate={{ scale }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          style={{
            width: 160, height: 160, borderRadius: '50%',
            background: gradient,
            border: `2.5px solid ${color}55`,
            boxShadow: `0 0 50px ${color}33, 0 0 100px ${color}18`,
          }}
        />

        {/* Center info */}
        <div style={{
          position: 'absolute', textAlign: 'center',
          color: '#9b99b8', fontSize: 12, fontWeight: 500,
        }}>
          <Wind size={20} color={color} strokeWidth={1.5} style={{ marginBottom: 4 }} />
          <div>{cycleCount + 1} / {totalCycles}</div>
        </div>
      </div>

      {/* Cycle dots */}
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: totalCycles }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i < cycleCount ? 1.2 : 1,
              background: i < cycleCount ? color : '#e0ddf0',
            }}
            style={{
              width: 8, height: 8, borderRadius: '50%',
            }}
          />
        ))}
      </div>

      {/* Done state */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center' }}
          >
            <p style={{ fontSize: 18, fontWeight: 600, color: '#3a3a5c', marginBottom: 20 }}>
              做得好，感觉如何？
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onDone}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '12px 24px', borderRadius: 14,
                  background: 'linear-gradient(135deg, #818cf8, #7c8ce0)',
                  color: '#fff', fontSize: 15, fontWeight: 600, border: 'none',
                  cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,140,224,0.3)',
                }}
              >
                <CheckCircle2 size={18} /> 好多了
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCycleCount(0); setPhaseIndex(0);
                  setSecondsLeft(pattern.phases[0].durationSeconds);
                  setIsActive(true);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '12px 20px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.7)',
                  border: '1.5px solid rgba(0,0,0,0.06)',
                  color: '#7c7b9c', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                }}
              >
                <RotateCcw size={16} /> 再来一轮
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip */}
      {isActive && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onDone}
          style={{
            fontSize: 13, color: '#b0adc8',
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          跳过呼吸引导
        </motion.button>
      )}
    </div>
  );
}
