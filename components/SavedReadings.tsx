import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, BookOpen, Trash2, ChevronRight, Share2, Download } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ReadingEntry {
  id: string;
  type: string;
  date: string;
  summary: string;
  result: string;
  sData?: any;
}

interface SavedReadingsProps {
  lang: Language;
  onView: (entry: ReadingEntry) => void;
}

const SavedReadings: React.FC<SavedReadingsProps> = ({ lang, onView }) => {
  const [history, setHistory] = useState<ReadingEntry[]>([]);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    const saved = localStorage.getItem('astro_readings_history_v2');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm(t.clear_history_confirm || "Clear all saved readings?")) {
      localStorage.removeItem('astro_readings_history_v2');
      setHistory([]);
    }
  };

  const removeEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(entry => entry.id !== id);
    setHistory(updated);
    localStorage.setItem('astro_readings_history_v2', JSON.stringify(updated));
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 bg-[var(--bg-secondary)]/30 backdrop-blur-xl rounded-3xl border border-[var(--border-primary)] shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center border border-[var(--accent-primary)]/20 animate-pulse">
          <BookOpen className="w-10 h-10 text-[var(--accent-primary)]/40" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-ancient font-black text-[var(--accent-primary)] uppercase tracking-widest">
            {t.no_readings || 'Archive Empty'}
          </h3>
          <p className="text-[var(--text-primary)]/60 text-xs font-premium uppercase tracking-[0.2em] max-w-xs leading-relaxed">
            {t.no_readings_desc || 'Perform a horoscope or prashna analysis to save your celestial insights for offline viewing.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 w-full max-w-4xl mx-auto px-2 sm:px-4 pb-20">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--accent-primary)]/20 rounded-xl border border-[var(--accent-primary)]/30 shadow-[0_0_15px_var(--accent-primary)]">
            <Clock className="w-5 h-5 text-[var(--accent-primary)]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-ancient font-black gold-leaf uppercase tracking-widest">
              {t.saved_readings || 'Reading Archive'}
            </h2>
            <p className="text-[8px] sm:text-[10px] font-premium uppercase tracking-[0.3em] text-[var(--accent-primary)]/70">
              Access your soul's journey anytime, even offline
            </p>
          </div>
        </div>
        <button 
          onClick={clearHistory}
          className="p-3 hover:bg-red-500/10 text-red-400 rounded-xl transition-all group"
          title="Clear Archive"
        >
          <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {history.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onView(entry)}
              className="group relative bg-[var(--bg-secondary)]/50 backdrop-blur-3xl border border-[var(--border-primary)] rounded-2xl p-6 sm:p-10 cursor-pointer overflow-hidden transition-all hover:border-[var(--accent-primary)] shadow-xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/5 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none"></div>
              
              <div className="flex items-center justify-between gap-6 relative z-10">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-widest border-b border-[var(--accent-primary)]/30 pb-0.5">
                      {entry.type}
                    </span>
                    <span className="text-[9px] font-premium text-[var(--text-primary)]/40 uppercase tracking-widest">
                      {entry.date}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-xl font-ancient font-black text-[var(--text-primary)] leading-tight italic group-hover:not-italic group-hover:text-[var(--accent-primary)] transition-all">
                    "{entry.summary}"
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <button 
                    onClick={(e) => removeEntry(entry.id, e)}
                    className="p-2 sm:p-4 text-[var(--text-primary)]/20 hover:text-red-400 hover:bg-red-500/5 rounded-full transition-all"
                  >
                    <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center bg-[var(--accent-primary)]/5 border border-[var(--border-primary)] group-hover:border-[var(--accent-primary)] rounded-full group-hover:bg-[var(--accent-primary)]/20 transition-all">
                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SavedReadings;
