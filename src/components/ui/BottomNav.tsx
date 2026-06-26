import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Wind, Zap, Sparkles } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/soothe', icon: Wind, label: '安抚' },
  { path: '/vent', icon: Zap, label: '发泄' },
  { path: '/goodmood', icon: Sparkles, label: '好心情' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeBg: Record<string, string> = {
    '/': 'rgba(129,140,248,0.12)',
    '/soothe': 'rgba(124,140,224,0.14)',
    '/vent': 'rgba(255,107,107,0.14)',
    '/goodmood': 'rgba(240,160,64,0.14)',
  };

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.82)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(0,0,0,0.05)',
      display: 'flex', justifyContent: 'space-around',
      padding: '6px 0 max(6px, env(safe-area-inset-bottom))',
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        const activeColor =
          item.path === '/vent' ? '#ff6b6b'
          : item.path === '/goodmood' ? '#f0a040'
          : '#7c8ce0';

        return (
          <motion.button
            key={item.path}
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, background: isActive ? activeBg[item.path] : 'transparent',
              border: 'none', cursor: 'pointer', padding: '6px 14px',
              borderRadius: 12, position: 'relative',
            }}
          >
            <motion.div
              animate={{ scale: isActive ? 1.05 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Icon
                size={21}
                color={isActive ? activeColor : '#c5c0d8'}
                strokeWidth={isActive ? 2.2 : 1.8}
                fill={isActive ? activeColor : 'transparent'}
                fillOpacity={0.15}
              />
            </motion.div>
            <span style={{
              fontSize: 10, fontWeight: isActive ? 600 : 400,
              color: isActive ? activeColor : '#c5c0d8',
            }}>
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
