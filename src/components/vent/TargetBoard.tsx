import { motion } from 'framer-motion';
import { User, HeartCrack } from 'lucide-react';

interface TargetBoardProps {
  label: string;
  dirtLevel: number;
  isBroken: boolean;
  onHit: () => void;
}

export default function TargetBoard({ label, dirtLevel, isBroken }: TargetBoardProps) {
  const stage = dirtLevel < 30 ? 'clean' : dirtLevel < 70 ? 'dirty' : 'cracked';

  const boards = {
    clean: { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.15)', text: '#ddd' },
    dirty: { bg: 'rgba(180,160,120,0.15)', border: 'rgba(180,160,100,0.3)', text: '#bba' },
    cracked: { bg: 'rgba(160,120,80,0.2)', border: 'rgba(180,100,60,0.4)', text: '#aa9' },
  };

  const style = boards[stage];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <motion.div
        animate={isBroken ? { rotate: -4, scale: 0.9 } : { rotate: 0, scale: 1 }}
        style={{
          width: 150, height: 200, borderRadius: 18,
          background: isBroken ? 'rgba(100,100,100,0.15)' : style.bg,
          border: `2px solid ${isBroken ? 'rgba(255,100,100,0.3)' : style.border}`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 12, position: 'relative', overflow: 'hidden',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Dirt splatters */}
        {!isBroken && dirtLevel > 0 && Array.from({ length: Math.floor(dirtLevel / 12) }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 18 + Math.random() * 28,
            height: 18 + Math.random() * 28,
            borderRadius: '50%',
            background: 'rgba(140,120,60,0.45)',
            top: `${8 + Math.random() * 165}px`,
            left: `${8 + Math.random() * 115}px`,
          }} />
        ))}

        {isBroken ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <HeartCrack size={40} color="#ff6b6b" />
          </motion.div>
        ) : (
          <>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={22} color={style.text} strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: style.text, textAlign: 'center', padding: '0 8px' }}>
              {label}
            </span>
          </>
        )}
      </motion.div>

      {/* Dirt meter */}
      {!isBroken && (
        <div style={{ width: 150 }}>
          <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${dirtLevel}%` }}
              style={{
                height: '100%', borderRadius: 3,
                background: dirtLevel > 70
                  ? 'linear-gradient(90deg, #ff6b6b, #ff4444)'
                  : 'linear-gradient(90deg, #ffd93d, #f0a040)',
              }}
            />
          </div>
        </div>
      )}

      {isBroken && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 14, color: '#ff6b6b', fontWeight: 600 }}
        >
          立牌已碎！💥
        </motion.p>
      )}
    </div>
  );
}
