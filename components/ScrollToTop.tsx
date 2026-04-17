
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-48 right-6 sm:bottom-56 sm:right-10 z-[60] p-4 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-[var(--border-primary)] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white dark:hover:text-[#020617] transition-all duration-300 group"
          aria-label="Go to top"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
          <div className="absolute inset-0 rounded-full border border-[var(--accent-primary)]/20 animate-ping pointer-events-none opacity-20"></div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
