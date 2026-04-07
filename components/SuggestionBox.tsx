
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        className="bg-white/40 backdrop-blur-xl border-2 border-[#f59e0b]/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <MessageSquare size={120} className="text-[#facc15]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#facc15] flex items-center justify-center text-[#451a03] shadow-lg">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#facc15] uppercase tracking-widest leading-none">{t.suggestion_title || 'Suggestions'}</h3>
              <p className="text-[10px] font-bold text-[#b45309]/60 uppercase tracking-widest mt-1">{t.suggestion_desc || 'Help Guruji improve your experience'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder={t.suggestion_placeholder || "Share your thoughts or report an issue..."}
              className="w-full h-32 bg-white/50 border-2 border-[#facc15]/10 rounded-3xl p-6 text-[#451a03] placeholder-[#451a03]/30 focus:outline-none focus:border-[#FFD700] transition-all font-medium resize-none"
              disabled={isSubmitting || isSubmitted}
            />
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted || !suggestion.trim()}
                className={`group flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                  isSubmitted 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-[#facc15] text-[#451a03] hover:scale-105 disabled:opacity-50 disabled:scale-100'
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
