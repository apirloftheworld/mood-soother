import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, Zap, Sparkles, Shield, ChevronRight, MoonStar } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';

/* ── Floating particles ── */
function Particles() {
  const stars = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 6 + Math.random() * 10,
      delay: Math.random() * 5,
      opacity: 0.15 + Math.random() * 0.25,
    })), []
  );
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          animate={{ y: ['0%', '-120%'], opacity: [s.opacity, 0] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            bottom: `-${s.size * 2}px`,
            width: s.size, height: s.size,
            borderRadius: '50%',
            background: '#a78bfa',
            boxShadow: `0 0 ${s.size * 3}px #a78bfa88`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Mode cards data ── */
const modes = [
  {
    path: '/soothe',
    icon: Wind,
    title: '情绪安抚',
    subtitle: 'Calm Down',
    description: '焦虑、难过、紧张……让我陪你慢慢平静下来',
    bg: 'rgba(255,255,255,0.75)',
    border: 'rgba(139, 130, 240, 0.3)',
    accent: '#7c8ce0',
    accentLight: '#e8eaf6',
    glow: '0 0 30px rgba(124,140,224,0.15)',
  },
  {
    path: '/vent',
    icon: Zap,
    title: '情绪宣泄',
    subtitle: 'Let It Out',
    description: '砸臭鸡蛋、打拳击，安全地释放所有不痛快',
    bg: 'rgba(30,30,55,0.85)',
    border: 'rgba(255,107,107,0.35)',
    accent: '#ff6b6b',
    accentLight: '#3d2025',
    glow: '0 0 30px rgba(255,107,107,0.12)',
  },
  {
    path: '/goodmood',
    icon: Sparkles,
    title: '好心情记录',
    subtitle: 'Joy Journal',
    description: '今天有什么好事发生？攒一个属于你的快乐库',
    bg: 'rgba(255,255,255,0.75)',
    border: 'rgba(255,179,71,0.35)',
    accent: '#f0a040',
    accentLight: '#fff4e6',
    glow: '0 0 30px rgba(255,179,71,0.15)',
  },
];

/* ── Page ── */
export default function HomePage() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 6) setGreeting('夜深了');
    else if (h < 12) setGreeting('早上好');
    else if (h < 18) setGreeting('下午好');
    else setGreeting('晚上好');
  }, []);

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-lg)',
      paddingBottom: '100px',
      position: 'relative',
      background: 'linear-gradient(170deg, #f5f3ff 0%, #ede9fe 30%, #faf8ff 60%, #f0e6ff 100%)',
    }}>
      <Particles />

      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{
          position: 'relative', zIndex: 1,
          paddingTop: 'var(--space-2xl)',
          paddingBottom: 'var(--space-xl)',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 'var(--space-md)',
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(129,140,248,0.3)',
          }}>
            <MoonStar size={26} color="#fff" strokeWidth={1.8} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            fontSize: '30px', fontWeight: 700,
            letterSpacing: '0.02em',
            background: 'linear-gradient(135deg, #4c3f91 0%, #7c6fcf 50%, #9b8aeb 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 6,
          }}
        >
          {greeting}，今天感觉如何
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: 14, color: '#9c9ab8', fontWeight: 400 }}
        >
          选一个模式，照顾好你的情绪
        </motion.p>
      </motion.header>

      {/* ── Cards ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', gap: 14,
        width: '100%', maxWidth: 420, margin: '0 auto',
      }}>
        {modes.map((mode, i) => {
          const Icon = mode.icon;
          const isDark = mode.path === '/vent';
          return (
            <motion.button
              key={mode.path}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.1, duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
              whileHover={{ scale: 1.015, y: -2, boxShadow: mode.glow }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(mode.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '20px 22px',
                borderRadius: 20,
                background: mode.bg,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1.5px solid ${mode.border}`,
                boxShadow: mode.glow,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'box-shadow 0.3s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative gradient blob */}
              <div style={{
                position: 'absolute', top: -20, right: -20,
                width: 100, height: 100, borderRadius: '50%',
                background: `radial-gradient(circle, ${mode.accent}18, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              {/* Icon */}
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: isDark ? 'rgba(255,255,255,0.08)' : mode.accentLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={26} color={mode.accent} strokeWidth={1.8} />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'flex', alignItems: 'baseline', gap: 8,
                  marginBottom: 4,
                }}>
                  <span style={{
                    fontSize: 17, fontWeight: 700,
                    color: isDark ? '#e8e8f0' : '#3a3a5c',
                  }}>
                    {mode.title}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    color: isDark ? '#8888a8' : '#b0adc8',
                    letterSpacing: '0.04em',
                  }}>
                    {mode.subtitle}
                  </span>
                </div>
                <p style={{
                  fontSize: 13, lineHeight: 1.5,
                  color: isDark ? '#9999b0' : '#8b8aa8',
                  margin: 0,
                }}>
                  {mode.description}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight size={18} color={isDark ? '#666' : '#c5c0e0'} strokeWidth={1.5} />
            </motion.button>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center', marginTop: 'auto',
          paddingTop: 'var(--space-2xl)',
        }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 20,
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(8px)',
        }}>
          <Shield size={12} color="#b0adc8" />
          <span style={{ fontSize: 11, color: '#b0adc8', fontWeight: 500 }}>
            本地存储 · 无需注册 · 永久免费
          </span>
        </div>
      </motion.div>
    </div>
  );
}
