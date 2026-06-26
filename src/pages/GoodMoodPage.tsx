import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, CalendarHeart, Wand2 } from 'lucide-react';
import { useMoodStore } from '@/store';
import QuickNote from '@/components/goodmood/QuickNote';
import StatsRow from '@/components/goodmood/StatsRow';
import JoyFlashback from '@/components/goodmood/JoyFlashback';
import Timeline from '@/components/goodmood/Timeline';

export default function GoodMoodPage() {
  const navigate = useNavigate();
  const loadNotes = useMoodStore((s) => s.loadNotes);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(170deg, #fffdf7 0%, #fff9f0 30%, #fff5e8 60%, #fffaef 100%)',
      padding: 'var(--space-lg)',
      paddingBottom: '100px',
    }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        {/* ── Header ── */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
          marginBottom: 20,
        }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(255,255,255,0.6)', border: 'none',
              borderRadius: 12, padding: '8px 14px',
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              color: '#b8a090',
            }}
          >
            <ArrowLeft size={16} /> 返回
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Wand2 size={20} color="#f0a040" />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#5c3d2e' }}>
              好心情记录
            </h2>
          </motion.div>

          <div style={{ width: 64 }} />
        </header>

        {/* ── Stats Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 20 }}
        >
          <StatsRow />
        </motion.div>

        {/* ── Quick Note Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          style={{
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(12px)',
            borderRadius: 20,
            padding: 18, marginBottom: 14,
            border: '1px solid rgba(0,0,0,0.03)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, #fbbf60, #f0a040)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={15} color="#fff" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#5c3d2e' }}>
              记录此刻好心情
            </span>
          </div>
          <QuickNote />
        </motion.div>

        {/* ── Flashback ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          style={{ marginBottom: 24 }}
        >
          <JoyFlashback />
        </motion.div>

        {/* ── Timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 12, paddingLeft: 4,
          }}>
            <CalendarHeart size={17} color="#d0a080" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#8b6f5e' }}>
              过往好心情
            </h3>
          </div>
          <Timeline />
        </motion.div>
      </div>
    </div>
  );
}
