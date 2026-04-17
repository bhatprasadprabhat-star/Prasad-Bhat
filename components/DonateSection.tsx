
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface DonateSectionProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
}

const DonateSection: React.FC<DonateSectionProps> = ({ isOpen, onClose, lang = 'en' }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[var(--bg-secondary)] rounded-lg shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-[var(--border-primary)] overflow-hidden p-8 sm:p-12 text-center"
          >
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-[var(--accent-primary)]/70 hover:text-[var(--accent-primary)] transition-all z-50"
              aria-label="Close"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="w-20 h-20 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center border border-[var(--border-primary)] shadow-2xl animate-pulse">
                <Heart className="text-[var(--accent-primary)] w-10 h-10 fill-[var(--accent-primary)]/20" />
              </div>

              <div className="w-full h-40 rounded-lg overflow-hidden border border-[var(--border-primary)] shadow-inner relative">
                <img 
                  src="https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=600&auto=format&fit=crop" 
                  alt="Sacred Offering" 
                  className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent"></div>
              </div>
              
              <h3 className="text-2xl sm:text-4xl font-ancient font-black gold-leaf uppercase tracking-[0.2em]">{t.support_mission}</h3>
              
              <p className="text-[var(--accent-primary)]/90 text-sm sm:text-lg font-premium font-bold italic max-w-md leading-relaxed">
                {t.support_quote}
              </p>

              <div className="mt-4 p-6 bg-[var(--bg-primary)]/50 rounded-lg shadow-2xl border border-[var(--border-primary)] inline-block relative group backdrop-blur-md">
                <div className="w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-lg flex items-center justify-center border border-[var(--border-primary)]/20 overflow-hidden shadow-inner">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('upi://pay?pa=prabhatprasadbhat@oksbi&cu=INR&tn=Support')}`} 
                    alt="Support QR Code"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500">
                   <div className="bg-[var(--bg-secondary)]/90 text-[var(--accent-primary)] px-8 py-4 rounded-lg text-[12px] font-ancient font-black uppercase tracking-[0.3em] shadow-2xl border border-[var(--border-primary)] backdrop-blur-xl">{t.scan_to_support}</div>
                </div>
                <p className="mt-4 text-[10px] font-ancient font-black uppercase tracking-widest text-[var(--accent-primary)]/80">{t.scan_to_donate}</p>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <span className="px-5 py-2.5 bg-[var(--accent-primary)]/5 border border-[var(--border-primary)] rounded-lg text-[10px] font-ancient font-black uppercase text-[var(--accent-primary)]/80 tracking-[0.3em]">{t.secure}</span>
                <span className="px-5 py-2.5 bg-[var(--accent-primary)]/5 border border-[var(--border-primary)] rounded-lg text-[10px] font-ancient font-black uppercase text-[var(--accent-primary)]/80 tracking-[0.3em]">{t.spiritual}</span>
                <span className="px-5 py-2.5 bg-[var(--accent-primary)]/5 border border-[var(--border-primary)] rounded-lg text-[10px] font-ancient font-black uppercase text-[var(--accent-primary)]/80 tracking-[0.3em]">{t.support}</span>
              </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-primary)] blur-[100px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-primary)] blur-[100px]" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DonateSection;
