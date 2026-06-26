import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EmotionPicker from '@/components/soothe/EmotionPicker';
import SoothingText from '@/components/soothe/SoothingText';
import BreathingCircle from '@/components/soothe/BreathingCircle';
import CBTPrompter from '@/components/soothe/CBTPrompter';
import type { EmotionKey } from '@/data/soothingMessages';

type Step = 'pick-emotion' | 'soothing-text' | 'breathing' | 'cbt';

const steps: { key: Step; label: string }[] = [
  { key: 'pick-emotion', label: '感受' },
  { key: 'soothing-text', label: '陪伴' },
  { key: 'breathing', label: '呼吸' },
  { key: 'cbt', label: '思考' },
];

export default function SoothePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('pick-emotion');
  const [emotionKey, setEmotionKey] = useState<EmotionKey>('anxiety');

  const handleEmotionSelect = (key: EmotionKey, _label: string) => {
    setEmotionKey(key);
    setStep('soothing-text');
  };

  const stepIdx = steps.findIndex((s) => s.key === step);

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(175deg, #f5f3ff 0%, #ede9fe 30%, #faf8ff 70%)',
      paddingBottom: '100px',
    }}>
      {/* ── Top bar ── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--space-md) var(--space-lg)',
        paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (step === 'pick-emotion') navigate('/');
            else {
              const prev = steps[stepIdx - 1];
              if (prev) setStep(prev.key);
            }
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(255,255,255,0.7)', border: 'none',
            borderRadius: 12, padding: '8px 14px',
            cursor: 'pointer', fontSize: 13, fontWeight: 500,
            color: '#7c7b9c',
          }}
        >
          <ArrowLeft size={16} />
          返回
        </motion.button>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {steps.map((s, i) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: i <= stepIdx ? 22 : 8, height: 8,
                borderRadius: 4,
                background: i <= stepIdx ? '#7c8ce0' : '#d5d0e8',
                transition: 'all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)',
              }} />
              {i < steps.length - 1 && (
                <div style={{ width: 16, height: 1, background: '#d5d0e8' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ width: 64 }} /> {/* spacer for balance */}
      </header>

      {/* ── Content ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'var(--space-lg)',
      }}>
        <AnimatePresence mode="wait">
          {step === 'pick-emotion' && (
            <motion.div
              key="pick"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <EmotionPicker onSelect={handleEmotionSelect} />
            </motion.div>
          )}
          {step === 'soothing-text' && (
            <motion.div
              key="text"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <SoothingText emotionKey={emotionKey} onDone={() => setStep('breathing')} />
            </motion.div>
          )}
          {step === 'breathing' && (
            <motion.div
              key="breathe"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <BreathingCircle onDone={() => setStep('cbt')} />
            </motion.div>
          )}
          {step === 'cbt' && (
            <motion.div
              key="cbt"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <CBTPrompter onDone={() => navigate('/')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
