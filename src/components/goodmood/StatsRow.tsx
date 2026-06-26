import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, CalendarDays, TrendingUp, Trophy } from 'lucide-react';
import { useMoodStore } from '@/store';

export default function StatsRow() {
  const notes = useMoodStore((s) => s.notes);

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekAgo = today - 7 * 86400000;
    const monthAgo = today - 30 * 86400000;

    // Entries with date keys
    const dates = notes.map((n) => {
      const d = new Date(n.timestamp);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    });

    // Total
    const total = notes.length;

    // This week
    const thisWeek = notes.filter((n) => n.timestamp >= weekAgo).length;

    // This month
    const thisMonth = notes.filter((n) => n.timestamp >= monthAgo).length;

    // Current streak (consecutive days with at least 1 entry)
    let streak = 0;
    const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);
    for (let i = 0; i < uniqueDates.length; i++) {
      const expected = today - i * 86400000;
      if (uniqueDates[i] === expected) streak++;
      else break;
    }

    // Best streak
    let bestStreak = 0;
    let currentRun = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      if (uniqueDates[i - 1] - uniqueDates[i] === 86400000) {
        currentRun++;
      } else {
        bestStreak = Math.max(bestStreak, currentRun);
        currentRun = 1;
      }
    }
    bestStreak = Math.max(bestStreak, currentRun, streak);

    return { total, thisWeek, thisMonth, streak, bestStreak };
  }, [notes]);

  const items = [
    { icon: Flame, value: stats.streak, label: '连续天数', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    { icon: CalendarDays, value: stats.thisWeek, label: '本周记录', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    { icon: TrendingUp, value: stats.total, label: '总记录', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
    { icon: Trophy, value: stats.bestStreak, label: '最长连续', color: '#ec4899', bg: 'rgba(236,72,153,0.08)' },
  ];

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
    }}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 16px', borderRadius: 16,
              background: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(0,0,0,0.03)',
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: item.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={18} color={item.color} strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#3d2e1c', lineHeight: 1.2 }}>
                {item.value}
              </div>
              <div style={{ fontSize: 11, color: '#a89880', fontWeight: 500 }}>
                {item.label}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
