import { motion } from 'framer-motion';
import { Egg, Crosshair, CircleDot, MessageSquareText, Sparkles } from 'lucide-react';

export type VentType = 'egg' | 'punch' | 'bubble' | 'rant';

interface VentModeSelectProps {
  onSelect: (type: VentType) => void;
}

const modes: {
  type: VentType;
  icon: typeof Egg;
  title: string;
  desc: string;
  accent: string;
  bg: string;
  tag?: string;
}[] = [
  {
    type: 'bubble', icon: CircleDot, title: '捏泡泡纸',
    desc: '一张满满的泡泡纸，一个个捏爆，解压到停不下来',
    accent: '#6bcb77', bg: 'rgba(107,203,119,0.08)',
    tag: '人气最高',
  },
  {
    type: 'rant', icon: MessageSquareText, title: '吐槽弹幕墙',
    desc: '把不爽写下来，让它们散落在墙上，写完就翻篇',
    accent: '#f06595', bg: 'rgba(240,101,149,0.08)',
    tag: '文字发泄',
  },
  {
    type: 'egg', icon: Egg, title: '立牌投掷臭鸡蛋',
    desc: '创建对象立牌，拖拽臭鸡蛋狠狠砸过去，看它碎掉',
    accent: '#ffd93d', bg: 'rgba(255,217,61,0.08)',
  },
  {
    type: 'punch', icon: Crosshair, title: '霸总拳击沙袋',
    desc: '连续出拳击打沙袋，霸总弹幕+连击计数，打到爽',
    accent: '#ff6b6b', bg: 'rgba(255,107,107,0.08)',
  },
];

export default function VentModeSelect({ onSelect }: VentModeSelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400 }}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 8 }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            width: 56, height: 56, borderRadius: 18,
            background: 'rgba(255,107,107,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}
        >
          <Sparkles size={28} color="#ff6b6b" strokeWidth={1.6} />
        </motion.div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#e8e8f0', marginBottom: 6 }}>
          选一种方式，尽情释放
        </h2>
        <p style={{ fontSize: 14, color: '#8888a8' }}>4 种发泄模式，总有一款适合你</p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
      }}>
        {modes.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.button
              key={m.type}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ scale: 1.03, borderColor: m.accent + '55', y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(m.type)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 10, padding: '18px 12px', borderRadius: 18,
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(255,255,255,0.07)',
                cursor: 'pointer', textAlign: 'center',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Tag badge */}
              {m.tag && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  padding: '2px 8px', borderRadius: 8,
                  background: `${m.accent}22`,
                  fontSize: 10, fontWeight: 700, color: m.accent,
                }}>
                  {m.tag}
                </div>
              )}

              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: m.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={22} color={m.accent} strokeWidth={1.8} />
              </div>

              <div>
                <p style={{
                  fontSize: 14, fontWeight: 700, color: '#e8e8f0',
                  marginBottom: 4,
                }}>
                  {m.title}
                </p>
                <p style={{
                  fontSize: 11, color: '#8888a8', lineHeight: 1.4,
                }}>
                  {m.desc}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
