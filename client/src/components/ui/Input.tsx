import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled';
  animate?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, variant = 'default', animate = true, className = '', ...props }, ref) => {
    const baseInputStyles = 'w-full rounded-md text-sm transition-colors duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2';
    
    const variants = {
      default: 'border border-gray-700 bg-gray-800 text-white focus:border-avilasha-500 focus:ring-avilasha-500/20',
      filled: 'border-none bg-gray-700 text-white focus:bg-gray-600 focus:ring-avilasha-500/20',
    };
    
    const inputSizes = props.size === 'sm' 
      ? 'h-8 px-3 py-1' 
      : props.size === 'lg' 
        ? 'h-12 px-4 py-3' 
        : 'h-10 px-4 py-2';
    
    const inputWithIconsClass = `${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`;
    
    const inputComponent = (
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`${baseInputStyles} ${variants[variant]} ${inputSizes} ${inputWithIconsClass} ${className} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {label}
          </label>
        )}
        
        {animate ? (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {inputComponent}
          </motion.div>
        ) : (
          inputComponent
        )}
        
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
