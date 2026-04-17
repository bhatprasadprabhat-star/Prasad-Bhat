
import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  className?: string;
  size?: number;
  label?: string;
  variant?: 'spinner' | 'progress' | 'card';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  className = "", 
  size = 24, 
  label, 
  variant = 'spinner' 
}) => {
  if (variant === 'progress') {
    return (
      <div className={`w-full h-1 bg-[var(--accent-primary)]/10 overflow-hidden relative ${className}`}>
        <motion.div 
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent w-full h-full"
        />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-8 bg-[var(--bg-secondary)]/50 backdrop-blur-xl rounded-2xl border border-[var(--border-primary)] flex flex-col items-center justify-center gap-4 text-center ${className}`}>
        <Loader2 size={size * 1.5} className="text-[var(--accent-primary)] animate-spin" />
        {label && (
          <p className="text-[10px] font-ancient font-black uppercase tracking-[0.3em] text-[var(--accent-primary)] animate-pulse">
            {label}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Loader2 size={size} className="text-[var(--accent-primary)] animate-spin" />
      {label && (
        <span className="text-[10px] font-ancient font-black uppercase tracking-widest text-[var(--accent-primary)]/80 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};
