import { motion } from 'framer-motion';

const EMOJIS = ['😊', '😎', '🥳', '❤️', '😆', '🙏', '🌟', '💪', '🎉', '☀️', '🌈', '💖'];

interface EmojiPickerProps { selected: string; onSelect: (emoji: string) => void; }

export default function EmojiPicker({ selected, onSelect }: EmojiPickerProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
      {EMOJIS.map((emoji) => {
        const isSelected = selected === emoji;
        return (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => onSelect(emoji)}
            style={{
              width: 42, height: 42, fontSize: 22,
              borderRadius: 12,
              background: isSelected ? 'rgba(240,160,64,0.15)' : 'rgba(0,0,0,0.03)',
              border: isSelected ? '2px solid rgba(240,160,64,0.4)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s, border-color 0.2s',
            }}
          >
            {emoji}
          </motion.button>
        );
      })}
    </div>
  );
}
