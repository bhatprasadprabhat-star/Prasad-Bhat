
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
            className="relative w-full max-w-lg bg-gradient-to-br from-[#431407] to-[#1a0803] rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-2 border-[#D4AF37]/40 overflow-hidden p-8 sm:p-12 text-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all z-50 border-2 border-white shadow-lg group"
              aria-label="Close"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Heart className="text-[#431407] w-8 h-8 fill-current" />
              </div>

              <div className="w-full h-32 rounded-3xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-inner mb-2">
                <img 
                  src="https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=600&auto=format&fit=crop" 
                  alt="Sacred Offering" 
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <h3 className="text-2xl sm:text-4xl font-black text-[#D4AF37] uppercase tracking-widest astrological-font">{t.support_mission}</h3>
              
              <p className="text-[#D4AF37]/80 text-sm sm:text-lg font-serif italic max-w-md leading-relaxed">
                {t.support_quote}
              </p>

              <div className="mt-4 p-4 bg-white rounded-3xl shadow-2xl border-4 border-[#D4AF37]/50 inline-block relative group">
                <div className="w-48 h-48 sm:w-64 sm:h-64 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('upi://pay?pa=prabhatprasadbhat@oksbi&cu=INR&tn=Support')}`} 
                    alt="Support QR Code"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-[#431407]/90 text-[#D4AF37] px-6 py-3 rounded-full text-[12px] font-black uppercase tracking-widest shadow-2xl border border-[#D4AF37]/30">{t.scan_to_support}</div>
                </div>
                <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-[#431407]">{t.scan_to_donate}</p>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[9px] font-black uppercase text-[#D4AF37] tracking-widest">{t.secure}</span>
                <span className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[9px] font-black uppercase text-[#D4AF37] tracking-widest">{t.spiritual}</span>
                <span className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[9px] font-black uppercase text-[#D4AF37] tracking-widest">{t.support}</span>
              </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#D4AF37] blur-[100px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#D4AF37] blur-[100px]" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DonateSection;
