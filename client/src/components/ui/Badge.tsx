import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glow?: boolean;
  pulse?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  glow = false,
  pulse = false,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-700 text-gray-100',
    success: 'bg-avilasha-500 text-white',
    warning: 'bg-amber-500 text-white',
    danger: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };
  
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  const glowEffect = glow ? {
    default: 'shadow-gray-500/50 shadow-sm',
    success: 'shadow-avilasha-500/50 shadow-sm',
    warning: 'shadow-amber-500/50 shadow-sm',
    danger: 'shadow-red-500/50 shadow-sm',
    info: 'shadow-blue-500/50 shadow-sm',
  } : {
    default: '',
    success: '',
    warning: '',
    danger: '',
    info: '',
  };

  const pulseAnimation = pulse ? 'animate-pulse' : '';
  
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${glowEffect[variant]} ${pulseAnimation} ${className}`}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
