import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldAlert } from 'lucide-react';
import DisclaimerModal from '@/components/ui/DisclaimerModal';
import VentModeSelect from '@/components/vent/VentModeSelect';
import type { VentType } from '@/components/vent/VentModeSelect';
import EggThrow from '@/components/vent/EggThrow';
import BossPunch from '@/components/vent/BossPunch';
import BubblePop from '@/components/vent/BubblePop';
import RantWall from '@/components/vent/RantWall';
import Modal from '@/components/ui/Modal';

type Step = 'disclaimer' | 'select' | VentType;
const VENT_TIME_LIMIT = 180;

const ventComponents: Record<VentType, React.ComponentType<{ onBack: () => void }>> = {
  egg: EggThrow,
  punch: BossPunch,
  bubble: BubblePop,
  rant: RantWall,
};

export default function VentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('disclaimer');
  const [timerStarted, setTimerStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(VENT_TIME_LIMIT);
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    if (!timerStarted || secondsLeft <= 0) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setShowTimeout(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timerStarted]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const isLow = secondsLeft < 30;

  const ActiveComponent = (step !== 'disclaimer' && step !== 'select')
    ? ventComponents[step]
    : null;

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(170deg, #0f0f23 0%, #141428 40%, #1a1a30 100%)',
      paddingBottom: '100px',
    }}>
      <DisclaimerModal
        open={step === 'disclaimer'}
        onConfirm={() => { setStep('select'); setTimerStarted(true); }}
        onCancel={() => navigate('/')}
      />

      {/* Timeout modal */}
      <Modal open={showTimeout} persistent>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(124,140,224,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Clock size={28} color="#7c8ce0" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#333', marginBottom: 8 }}>
            已经 3 分钟了
          </h3>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 24, lineHeight: 1.6 }}>
            发泄得差不多了，要不要去呼吸一下，让心情平静下来？
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => navigate('/soothe')}
              style={{
                padding: '12px', borderRadius: 14, width: '100%',
                background: 'linear-gradient(135deg, #818cf8, #7c8ce0)',
                color: '#fff', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer',
              }}
            >
              前往安抚模式
            </button>
            <button
              onClick={() => { setShowTimeout(false); setSecondsLeft(VENT_TIME_LIMIT); }}
              style={{
                padding: '10px', borderRadius: 14, width: '100%',
                background: 'transparent', color: '#bbb', fontSize: 14, border: 'none', cursor: 'pointer',
              }}
            >
              再来 3 分钟
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--space-md) var(--space-lg)',
        paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (step === 'select') navigate('/');
            else if (step !== 'disclaimer') setStep('select');
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(255,255,255,0.05)', border: 'none',
            borderRadius: 12, padding: '8px 14px',
            cursor: 'pointer', fontSize: 13, fontWeight: 500,
            color: '#9999b0',
          }}
        >
          <ArrowLeft size={16} /> {step === 'select' ? '首页' : '返回'}
        </motion.button>

        {timerStarted && step !== 'disclaimer' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 12,
            background: isLow ? 'rgba(255,107,107,0.12)' : 'rgba(255,255,255,0.04)',
            transition: 'background 0.3s',
          }}>
            <Clock size={14} color={isLow ? '#ff6b6b' : '#8888a8'} />
            <span style={{
              fontSize: 14, fontWeight: isLow ? 700 : 500,
              color: isLow ? '#ff6b6b' : '#8888a8',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {fmt(secondsLeft)}
            </span>
          </div>
        )}
      </header>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'var(--space-lg)',
      }}>
        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <VentModeSelect onSelect={(t) => setStep(t)} />
            </motion.div>
          )}

          {ActiveComponent && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <ActiveComponent onBack={() => setStep('select')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Disclaimer footer */}
      {step !== 'disclaimer' && (
        <p style={{
          textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.12)',
          paddingBottom: 'var(--space-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <ShieldAlert size={10} /> 虚拟互动·仅为情绪释放·不代表鼓励暴力
        </p>
      )}
    </div>
  );
}
