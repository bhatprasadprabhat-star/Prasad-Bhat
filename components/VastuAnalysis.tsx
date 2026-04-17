
import React from 'react';
import { motion } from 'motion/react';
import { Language, UserMode } from '../types';
import { TRANSLATIONS } from '../constants';
import MandalaBackground from './MandalaBackground';

interface VastuAnalysisProps {
  html: string;
  lang: Language;
  mode: UserMode;
  onBack: () => void;
}

const VastuAnalysis: React.FC<VastuAnalysisProps> = ({ html, lang, mode, onBack }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen relative overflow-hidden flex flex-col"
    >
      <MandalaBackground />
      
      <header className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-4 sm:p-8 flex items-center shadow-2xl sticky top-0 z-30 border-b border-[var(--accent-primary)]/40">
        <button onClick={onBack} className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all group">
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="ml-4">
          <h2 className="text-xl sm:text-3xl font-ancient font-black gold-leaf uppercase tracking-widest leading-none">
            {t.vastu_title || 'Vastu Shastra'}
          </h2>
          <p className="text-[8px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)]/80 uppercase tracking-[0.2em] mt-1">
            {mode === 'SCHOLAR' ? (t.vastu_analysis || 'Sthapatya Veda Analysis') : (t.home_harmony || 'Home Harmony')}
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-10 z-10 w-full max-w-5xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="modern-card p-6 sm:p-12 rounded-3xl bg-[var(--bg-secondary)]/50 backdrop-blur-3xl shadow-2xl border border-[var(--accent-primary)]/20"
        >
          <div 
            className="vastu-content text-[var(--text-primary)] font-premium leading-relaxed text-sm sm:text-lg"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </motion.div>
      </main>

      <style>{`
        .vastu-content h2 { 
          color: var(--accent-primary); 
          font-family: var(--font-ancient); 
          font-weight: 900; 
          text-transform: uppercase; 
          font-size: 1.5rem; 
          margin-top: 3rem; 
          margin-bottom: 1.5rem; 
          letter-spacing: 0.15em;
          border-left: 4px solid var(--accent-primary);
          padding-left: 1rem;
        }
        .vastu-content h3 { 
          color: var(--accent-primary); 
          font-family: var(--font-ancient); 
          font-weight: 800; 
          text-transform: uppercase; 
          font-size: 1.1rem; 
          margin-top: 2rem; 
          margin-bottom: 1rem; 
          letter-spacing: 0.1em;
        }
        .vastu-content p { margin-bottom: 1.5rem; opacity: 0.9; }
        .vastu-content ul { list-style: none; padding: 0; margin-bottom: 2rem; }
        .vastu-content li { 
          position: relative; 
          padding-left: 2rem; 
          margin-bottom: 1rem; 
          background: var(--bg-primary)/30;
          padding: 1.5rem;
          padding-left: 3rem;
          border-radius: 1rem;
          border: 1px solid var(--border-primary);
          transition: all 0.3s;
        }
        .vastu-content li:hover { border-color: var(--accent-primary); transform: translateX(5px); }
        .vastu-content li::before { 
          content: '✨'; 
          position: absolute; 
          left: 1rem; 
          top: 1.5rem; 
          font-size: 1rem; 
        }
        .vastu-content strong { color: var(--accent-primary); font-family: var(--font-ancient); letter-spacing: 0.05em; }
      `}</style>
    </motion.div>
  );
};

export default VastuAnalysis;
