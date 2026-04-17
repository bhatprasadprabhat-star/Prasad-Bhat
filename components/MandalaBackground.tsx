
import React from 'react';
import { motion } from 'motion/react';

const MandalaBackground = React.memo(() => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {/* Atmospheric Glows */}
    <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[var(--accent-primary)]/5 dark:bg-[var(--accent-primary)]/10 rounded-full blur-[150px] animate-pulse"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-[var(--color-gold-dark)]/5 dark:bg-[var(--color-gold-dark)]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }}></div>
    
    {/* Subtle Parchment Overlay */}
    <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/p6.png')] mix-blend-overlay"></div>

    {/* Animated Stars - Only visible in dark mode or very subtle in light */}
    <div className="absolute inset-0 opacity-10 dark:opacity-40">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-[1px] h-[1px] bg-[var(--accent-primary)] dark:bg-white rounded-full animate-pulse"
          style={{ 
            left: Math.random() * 100 + '%', 
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 8 + 's',
            opacity: Math.random() * 0.7 + 0.3,
            scale: Math.random() * 0.8 + 0.2
          }}
        />
      ))}
    </div>

    {/* Rotating Sacred Geometry */}
    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
      <motion.svg 
        viewBox="0 0 200 200" 
        className="w-[150vmax] h-[150vmax] text-[var(--accent-primary)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 600, repeat: Infinity, ease: "linear" }}
      >
        <g fill="none" stroke="currentColor" strokeWidth="0.05">
          {[...Array(24)].map((_, i) => (
            <circle key={i} cx="100" cy="100" r={2 + i * 8} />
          ))}
          {[...Array(72)].map((_, i) => (
            <line key={i} x1="100" y1="100" x2={100 + 200 * Math.cos(i * Math.PI / 36)} y2={100 + 200 * Math.sin(i * Math.PI / 36)} />
          ))}
        </g>
      </motion.svg>
    </div>
  </div>
));

export default MandalaBackground;
