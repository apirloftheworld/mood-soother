import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  colorTheme?: 'soothe' | 'vent' | 'goodmood';
  children: ReactNode;
}

const variantStyles = {
  primary: {
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    border: '2px solid currentColor',
  },
  ghost: {
    background: 'transparent',
    border: 'none',
    opacity: 0.8,
  },
};

const colorMap = {
  soothe: 'var(--soothe-primary)',
  vent: 'var(--vent-primary)',
  goodmood: 'var(--goodmood-primary)',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  colorTheme = 'soothe',
  children,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '14px', borderRadius: 'var(--radius-sm)' },
    md: { padding: '12px 24px', fontSize: '16px', borderRadius: 'var(--radius-md)' },
    lg: { padding: '16px 32px', fontSize: '18px', borderRadius: 'var(--radius-lg)' },
  };

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.96 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: variant === 'primary' ? colorMap[colorTheme] : 'transparent',
        opacity: disabled ? 0.5 : undefined,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
