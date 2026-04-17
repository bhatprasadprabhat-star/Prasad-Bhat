
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface SuggestionBoxProps {
  lang: string;
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({ lang }) => {
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const t = (TRANSLATIONS as any)[lang] || TRANSLATIONS.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    setIsSubmitting(true);
    
    // Use mailto to ensure user actually "sends" it to the specified email
    const mailtoLink = `mailto:bhatprasadprabhat@gmail.com?subject=ASTRO LOGIC Suggestion&body=${encodeURIComponent(suggestion)}`;
    window.open(mailtoLink, '_blank');
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setSuggestion('');

    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-secondary)]/50 backdrop-blur-xl border border-[var(--border-primary)] rounded-lg p-8 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
          <MessageSquare size={120} className="text-[var(--accent-primary)]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-white dark:text-[#020617] shadow-lg">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-ancient font-black gold-leaf uppercase tracking-widest leading-none">{t.suggestion_title || 'Suggestions'}</h3>
              <p className="text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest mt-1">{t.suggestion_desc || 'Help Guruji improve your experience'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder={t.suggestion_placeholder || "Share your thoughts or report an issue..."}
              className="w-full h-32 bg-[var(--bg-primary)]/50 border border-[var(--border-primary)] rounded-lg p-6 text-[var(--text-primary)] placeholder-[var(--text-primary)]/60 focus:outline-none focus:border-[var(--accent-primary)] transition-all font-premium font-bold resize-none"
              disabled={isSubmitting || isSubmitted}
            />
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted || !suggestion.trim()}
                className={`group flex items-center gap-3 px-8 py-4 rounded-lg text-xs font-ancient font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                  isSubmitted 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] hover:scale-105 disabled:opacity-50 disabled:scale-100'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div 
                      key="success"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 size={18} />
                      {t.suggestion_sent || 'Sent to Guruji'}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="send"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? 'Sending...' : (t.suggestion_send || 'Send Suggestion')}
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SuggestionBox;
