
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface MantraPlayerProps {
  lang: Language;
}

const MantraPlayer: React.FC<MantraPlayerProps> = ({ lang }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMantra, setCurrentMantra] = useState(0);
  const [progress, setProgress] = useState(0);

  const mantras = [
    { title: 'Surya Mantra', planet: 'Sun', color: 'bg-orange-500', mantra: 'Om Hram Hrim Hraum Sah Suryaya Namah' },
    { title: 'Chandra Mantra', planet: 'Moon', color: 'bg-blue-300', mantra: 'Om Shram Shrim Shraum Sah Chandraya Namah' },
    { title: 'Guru Mantra', planet: 'Jupiter', color: 'bg-yellow-500', mantra: 'Om Gram Grim Graum Sah Gurave Namah' },
    { title: 'Shani Mantra', planet: 'Saturn', color: 'bg-indigo-900', mantra: 'Om Pram Prim Praum Sah Shanaye Namah' }
  ];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const next = () => {
    setCurrentMantra(prev => (prev + 1) % mantras.length);
    setProgress(0);
  };

  const prev = () => {
    setCurrentMantra(prev => (prev - 1 + mantras.length) % mantras.length);
    setProgress(0);
  };

  return (
    <div className="w-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] rounded-[3rem] p-8 border-4 border-[var(--accent-primary)]/30 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Volume2 size={80} className="text-[var(--accent-primary)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="text-[var(--accent-primary)]" size={20} />
          <h3 className="text-xl font-black text-[var(--accent-primary)] uppercase tracking-widest astrological-font">Planetary Mantras</h3>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <motion.h4 
              key={currentMantra}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter"
            >
              {mantras[currentMantra].title}
            </motion.h4>
            <p className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-[0.4em]">{mantras[currentMantra].planet}</p>
          </div>

          <div className="bg-[var(--bg-primary)]/50 p-6 rounded-3xl border border-[var(--border-primary)] text-center">
            <p className="text-sm font-medium text-[var(--text-primary)]/80 italic leading-relaxed">
              "{mantras[currentMantra].mantra}"
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-full h-1.5 bg-[var(--accent-primary)]/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[var(--accent-primary)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-8">
              <button onClick={prev} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <SkipBack size={24} />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-white dark:text-[#020617] shadow-xl hover:scale-110 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>
              <button onClick={next} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <SkipForward size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MantraPlayer;
