import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circle' | 'rounded';
  animation?: 'pulse' | 'shimmer' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'default',
  animation = 'shimmer',
}) => {
  const baseStyles = 'bg-gray-700';
  
  const variants = {
    default: 'rounded',
    circle: 'rounded-full',
    rounded: 'rounded-md',
  };
  
  const animations = {
    pulse: 'animate-pulse',
    shimmer: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-600/20 before:to-transparent',
    none: '',
  };
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${animations[animation]} ${className}`} />
  );
};

export default Skeleton;
