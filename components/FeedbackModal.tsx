
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
            className="relative w-full max-w-lg bg-gradient-to-br from-[#fef3c7] to-[#fde68a] rounded-[2.5rem] shadow-2xl border-4 border-[#D4AF37] overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <MessageSquare className="text-[#D4AF37]" size={24} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#451a03] uppercase tracking-widest astrological-font">
                    {t.feedback_title}
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-[#451a03]/5 rounded-full transition-colors"
                >
                  <X className="text-[#451a03]/40" size={24} />
                </button>
              </div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="text-emerald-600 fill-emerald-600" size={40} />
                  </div>
                  <p className="text-xl font-black text-[#451a03] uppercase tracking-widest">
                    {t.feedback_success}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star 
                          size={36} 
                          className={`${
                            star <= rating ? 'text-amber-500 fill-amber-500' : 'text-amber-200'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t.feedback_placeholder}
                    className="w-full h-32 p-4 bg-white border-2 border-[#451a03]/10 rounded-2xl focus:border-[#D4AF37] focus:ring-0 transition-all resize-none text-[#451a03] font-medium"
                  />

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-[10px] font-bold text-left space-y-2">
                      <div className="flex items-center gap-2">
                        <X size={14} className="shrink-0" />
                        <span>{error}</span>
                      </div>
                      {error.includes('Application-specific password required') && (
                        <div className="mt-2 p-3 bg-white/50 rounded-lg border border-red-100 space-y-1">
                          <p className="uppercase tracking-wider opacity-60">How to Fix:</p>
                          <ol className="list-decimal list-inside space-y-1 opacity-80">
                            <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" className="underline">Google App Passwords</a></li>
                            <li>Select "Other", name it "ASTRO LOGIC"</li>
                            <li>Copy the 16-character code</li>
                            <li>Paste it into <b>EMAIL_PASS</b> in AI Studio Settings</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!rating || !comment || loading}
                    className="w-full py-4 bg-[#451a03] text-[#D4AF37] rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#5a2304] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={20} />
                        {t.submit_feedback}
                      </>
                    )}
                  </button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-[#451a03]/10"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                      <span className="bg-[#fef3c7] px-4 text-[#451a03]/40">Or</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const mailtoLink = `mailto:bhatprasadprabhat@gmail.com?subject=ASTRO LOGIC Feedback (${rating} Stars)&body=${encodeURIComponent(comment)}`;
                      window.open(mailtoLink, '_blank');
                    }}
                    className="w-full py-4 bg-white/50 text-[#451a03] border-2 border-[#451a03]/10 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/80 transition-all shadow-lg"
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
