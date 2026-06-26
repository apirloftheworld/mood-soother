import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send, Sparkles } from 'lucide-react';
import EmojiPicker from '@/components/ui/EmojiPicker';
import { useMoodStore } from '@/store';
import { playSound } from '@/utils/sound';

export default function QuickNote() {
  const [content, setContent] = useState('');
  const [emoji, setEmoji] = useState('😊');
  const [saved, setSaved] = useState(false);
  const [focused, setFocused] = useState(false);
  const addNote = useMoodStore((s) => s.addNote);

  const handleSave = async () => {
    if (!content.trim()) return;
    await addNote(content.trim(), emoji);
    playSound('ding-success');
    setSaved(true);
    setContent(''); setEmoji('😊');
    setTimeout(() => setSaved(false), 2200);
  };

  const charCount = content.length;
  const isLong = charCount > 50;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Input area */}
      <motion.div
        animate={{
          borderColor: focused ? 'rgba(240,160,64,0.35)' : 'rgba(0,0,0,0.05)',
          boxShadow: focused ? '0 0 0 3px rgba(240,160,64,0.08)' : 'none',
        }}
        style={{
          borderRadius: 16,
          border: '1.5px solid rgba(0,0,0,0.05)',
          background: 'rgba(255,255,255,0.8)',
          overflow: 'hidden',
          transition: 'border-color 0.25s',
        }}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="今天有什么好事发生？✨"
          rows={focused ? 3 : 2}
          style={{
            width: '100%', padding: '14px 16px', border: 'none',
            background: 'transparent', fontSize: 15, color: '#5c3d2e',
            resize: 'none', outline: 'none', fontFamily: 'inherit',
          }}
        />

        {/* Bottom bar when focused */}
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                padding: '0 14px 12px',
                borderTop: '1px solid rgba(0,0,0,0.04)',
                paddingTop: 10,
              }}>
                <EmojiPicker selected={emoji} onSelect={setEmoji} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Emoji + Save row (when not focused) */}
      {!focused && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <EmojiPicker selected={emoji} onSelect={setEmoji} />
          </div>
          <motion.button
            whileTap={{ scale: content.trim() ? 0.94 : 1 }}
            onClick={handleSave}
            disabled={!content.trim()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 14, flexShrink: 0,
              background: content.trim()
                ? 'linear-gradient(135deg, #fbbf60, #f0a040)'
                : '#e8e0d8',
              color: '#fff', fontSize: 14, fontWeight: 600, border: 'none',
              cursor: content.trim() ? 'pointer' : 'not-allowed',
              boxShadow: content.trim() ? '0 4px 14px rgba(240,160,64,0.25)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {saved ? (
              <>已保存 <CheckCircle2 size={16} /></>
            ) : (
              <>记录 <Send size={14} /></>
            )}
          </motion.button>
        </div>
      )}

      {/* Focused save button */}
      {focused && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{
            fontSize: 11, color: isLong ? '#f0a040' : '#c0b0a0',
            fontWeight: isLong ? 600 : 400,
          }}>
            {charCount} 字 {isLong && '· 写得很棒！'}
          </span>
          <motion.button
            whileTap={{ scale: content.trim() ? 0.94 : 1 }}
            onClick={handleSave}
            disabled={!content.trim()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginLeft: 'auto', padding: '10px 22px', borderRadius: 14,
              background: content.trim()
                ? 'linear-gradient(135deg, #fbbf60, #f0a040)'
                : '#e8e0d8',
              color: '#fff', fontSize: 14, fontWeight: 600, border: 'none',
              cursor: content.trim() ? 'pointer' : 'not-allowed',
              boxShadow: content.trim() ? '0 4px 14px rgba(240,160,64,0.25)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {saved ? (
              <>已保存 <CheckCircle2 size={16} /></>
            ) : (
              <>保存 <Send size={14} /></>
            )}
          </motion.button>
        </div>
      )}

      {/* Save success toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px', borderRadius: 12,
              background: 'rgba(16,185,129,0.1)',
              color: '#10b981', fontSize: 13, fontWeight: 600,
            }}
          >
            <Sparkles size={14} /> 已加入快乐收藏！
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
