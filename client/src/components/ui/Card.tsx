import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'glass';
  animate?: boolean;
  onClick?: () => void;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  animate = false,
  onClick,
  hoverEffect = false,
}) => {
  const baseStyles = 'rounded-lg overflow-hidden';
  
  const variants = {
    default: 'bg-dark-800 shadow-lg',
    outline: 'border border-gray-700 bg-dark-800/50',
    glass: 'backdrop-blur-md bg-dark-800/40 shadow-lg border border-gray-700/50',
  };
  
  const content = (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={hoverEffect ? 'transition-all duration-300 hover:shadow-xl hover:shadow-avilasha-500/10' : ''}
        onClick={onClick}
      >
        {content}
      </motion.div>
    );
  }

  if (hoverEffect) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="transition-all duration-300 hover:shadow-xl hover:shadow-avilasha-500/10"
        onClick={onClick}
      >
        {content}
      </motion.div>
    );
  }

  return onClick ? <div onClick={onClick}>{content}</div> : content;
};

export default Card;
