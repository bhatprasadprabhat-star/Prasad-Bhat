
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Star } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, lang }) => {
  const t = TRANSLATIONS[lang];
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setRating(0);
          setComment('');
        }, 2000);
      } else {
        setError(data.message || 'Failed to send feedback. Please try again.');
      }
    } catch (err: any) {
      console.error('Feedback submission error:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[var(--bg-secondary)] rounded-lg shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-[var(--border-primary)] overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
            <div className="p-8 sm:p-12 relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[var(--accent-primary)]/10 rounded-lg border border-[var(--border-primary)]">
                    <MessageSquare className="text-[var(--accent-primary)]" size={24} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-ancient font-black gold-leaf uppercase tracking-widest">
                    {t.feedback_title}
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-[var(--bg-primary)]/50 rounded-full transition-all text-[var(--accent-primary)]/70 hover:text-[var(--accent-primary)]"
                >
                  <X size={24} />
                </button>
              </div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[var(--border-primary)]">
                    <Star className="text-[var(--accent-primary)] fill-[var(--accent-primary)] animate-pulse" size={48} />
                  </div>
                  <p className="text-xl font-ancient font-black gold-leaf uppercase tracking-widest">
                    {t.feedback_success}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-all hover:scale-125 hover:rotate-12"
                      >
                        <Star 
                          size={40} 
                          className={`${
                            star <= rating ? 'text-[var(--accent-primary)] fill-[var(--accent-primary)]' : 'text-[var(--accent-primary)]/40'
                          } drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]`} 
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t.feedback_placeholder}
                    className="w-full h-40 p-6 bg-[var(--bg-primary)]/50 border border-[var(--border-primary)] rounded-lg focus:border-[var(--accent-primary)] focus:ring-0 transition-all resize-none text-[var(--text-primary)] font-premium font-bold text-lg placeholder:text-[var(--accent-primary)]/50 backdrop-blur-md shadow-inner"
                  />

                  {error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-[10px] font-ancient font-bold text-left space-y-2">
                      <div className="flex items-center gap-2">
                        <X size={14} className="shrink-0" />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!rating || !comment || loading}
                    className="w-full py-5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] rounded-lg font-ancient font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl border border-[var(--accent-primary)]/20"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-4 border-white dark:border-[#020617] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={20} />
                        {t.submit_feedback}
                      </>
                    )}
                  </button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-[var(--border-primary)]"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.5em] font-ancient font-black">
                      <span className="bg-[var(--bg-secondary)] px-6 text-[var(--accent-primary)]/60">Or</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const mailtoLink = `mailto:bhatprasadprabhat@gmail.com?subject=ASTRO LOGIC Feedback (${rating} Stars)&body=${encodeURIComponent(comment)}`;
                      window.open(mailtoLink, '_blank');
                    }}
                    className="w-full py-5 bg-[var(--bg-primary)]/50 text-[var(--accent-primary)] border border-[var(--border-primary)] rounded-lg font-ancient font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[var(--bg-primary)] transition-all shadow-xl backdrop-blur-md"
                  >
                    <MessageSquare size={20} />
                    Send via Email App
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
