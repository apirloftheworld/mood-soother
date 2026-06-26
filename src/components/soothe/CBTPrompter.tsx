import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { cbtPrompts } from '@/data/cbtPrompts';

interface CBTPrompterProps {
  onDone: () => void;
}

export default function CBTPrompter({ onDone }: CBTPrompterProps) {
  const navigate = useNavigate();
  const [promptIndex, setPromptIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const timerRef = useRef<number | null>(null);

  const allPrompts = cbtPrompts.flatMap((s) =>
    s.prompts.map((p) => ({ stage: s.stage, title: s.title, text: p }))
  );
  const current = allPrompts[promptIndex];
  const isLast = promptIndex >= allPrompts.length - 1;

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      if (!isLast) setPromptIndex((i) => i + 1);
    }, 10000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [promptIndex, isLast]);

  const handleNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isLast) setPromptIndex((i) => i + 1);
  };

  if (!current) return null;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 24, width: '100%', maxWidth: 380, padding: 'var(--space-lg)',
    }}>
      {/* Stage badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 20,
          background: 'rgba(124,140,224,0.08)',
        }}
      >
        <Brain size={16} color="#7c8ce0" />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#7c8ce0', letterSpacing: '0.04em' }}>
          阶段 {current.stage} · {current.title}
        </span>
      </motion.div>

      {/* Prompt card */}
      <div style={{
        width: '100%', padding: '28px 24px',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(12px)',
        borderRadius: 20, border: '1.5px solid rgba(0,0,0,0.04)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
        minHeight: 160, display: 'flex', alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={promptIndex}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45 }}
            style={{
              fontSize: 17, lineHeight: 1.85, fontWeight: 500,
              color: '#3a3a5c', textAlign: 'center',
            }}
          >
            {current.text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Hint */}
      <p style={{ fontSize: 12, color: '#b0adc8', textAlign: 'center' }}>
        无需回答，只需在心中想一想
      </p>

      {/* Optional input */}
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="想写下来也可以…（不会保存）"
        rows={2}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: 14,
          border: '1.5px solid rgba(0,0,0,0.06)',
          background: 'rgba(255,255,255,0.7)',
          fontSize: 14, color: '#3a3a5c', resize: 'none',
          outline: 'none', fontFamily: 'inherit',
        }}
      />

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 280 }}>
        {allPrompts.map((_, i) => (
          <div
            key={i}
            style={{
              width: 4, height: 4, borderRadius: '50%',
              background: i <= promptIndex ? '#7c8ce0' : '#e0ddf0',
              opacity: Math.abs(i - promptIndex) > 10 ? 0.15 : 1,
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        {!isLast ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '12px', borderRadius: 14,
              background: 'rgba(255,255,255,0.7)',
              border: '1.5px solid rgba(0,0,0,0.06)',
              color: '#7c7b9c', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              width: '100%',
            }}
          >
            下一条 <ChevronRight size={16} />
          </motion.button>
        ) : (
          <>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onDone}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '14px', borderRadius: 14,
                background: 'linear-gradient(135deg, #818cf8, #7c8ce0)',
                color: '#fff', fontSize: 15, fontWeight: 600, border: 'none',
                cursor: 'pointer', width: '100%',
                boxShadow: '0 4px 14px rgba(124,140,224,0.3)',
              }}
            >
              <CheckCircle2 size={18} /> 完成安抚，回到首页
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/goodmood')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '12px', borderRadius: 14,
                background: 'rgba(255,179,71,0.1)',
                border: 'none', color: '#f0a040', fontSize: 14, fontWeight: 500,
                cursor: 'pointer', width: '100%',
              }}
            >
              <Sparkles size={16} /> 去看看好心情库
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
