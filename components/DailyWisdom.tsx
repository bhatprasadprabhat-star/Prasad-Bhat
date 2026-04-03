
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Sparkles, RefreshCw } from 'lucide-react';
import { Language } from '../types';

interface DailyWisdomProps {
  lang: Language;
}

const DailyWisdom: React.FC<DailyWisdomProps> = ({ lang }) => {
  const [quoteIdx, setQuoteIdx] = useState(0);

  const quotes = [
    {
      en: "The stars do not compel us, they only impel us. Your Karma is the ink, and the planets are the pen.",
      kn: "ನಕ್ಷತ್ರಗಳು ನಮ್ಮನ್ನು ಒತ್ತಾಯಿಸುವುದಿಲ್ಲ, ಅವು ಕೇವಲ ಪ್ರೇರೇಪಿಸುತ್ತವೆ. ನಿಮ್ಮ ಕರ್ಮವೇ ಶಾಯಿ, ಮತ್ತು ಗ್ರಹಗಳೇ ಪೆನ್ನು.",
      hi: "तारे हमें मजबूर नहीं करते, वे केवल हमें प्रेरित करते हैं। आपका कर्म स्याही है, और ग्रह कलम हैं।"
    },
    {
      en: "Time is the greatest healer and the greatest teacher. Align with the cosmic rhythm to find peace.",
      kn: "ಸಮಯವೇ ಶ್ರೇಷ್ಠ ವೈದ್ಯ ಮತ್ತು ಶ್ರೇಷ್ಠ ಶಿಕ್ಷಕ. ಶಾಂತಿಯನ್ನು ಪಡೆಯಲು ವಿಶ್ವದ ಲಯದೊಂದಿಗೆ ಹೊಂದಿಕೊಳ್ಳಿ.",
      hi: "समय सबसे बड़ा मरहम लगाने वाला और सबसे बड़ा शिक्षक है। शांति पाने के लिए ब्रह्मांडीय लय के साथ तालमेल बिठाएं।"
    },
    {
      en: "Every planetary transit is an opportunity for growth. Challenges are merely lessons in disguise.",
      kn: "ಪ್ರತಿ ಗ್ರಹಗಳ ಸಂಚಾರವು ಬೆಳವಣಿಗೆಗೆ ಒಂದು ಅವಕಾಶ. ಸವಾಲುಗಳು ಕೇವಲ ವೇಷ ಮರೆಸಿಕೊಂಡ ಪಾಠಗಳು.",
      hi: "प्रत्येक ग्रह गोचर विकास का एक अवसर है। चुनौतियाँ केवल छद्म वेश में सबक हैं।"
    },
    {
      en: "The universe speaks in the language of geometry and light. Astrology is the translation of that divine speech.",
      kn: "ಬ್ರಹ್ಮಾಂಡವು ಜ್ಯಾಮಿತಿ ಮತ್ತು ಬೆಳಕಿನ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡುತ್ತದೆ. ಜ್ಯೋತಿಷ್ಯವು ಆ ದೈವಿಕ ಭಾಷಣದ ಅನುವಾದವಾಗಿದೆ.",
      hi: "ब्रह्मांड ज्यामिति और प्रकाश की भाषा में बोलता है। ज्योतिष उस दिव्य वाणी का अनुवाद है।"
    },
    {
      en: "Each planet is a mirror reflecting a part of your own soul. To know the stars is to know yourself.",
      kn: "ಪ್ರತಿ ಗ್ರಹವು ನಿಮ್ಮ ಸ್ವಂತ ಆತ್ಮದ ಒಂದು ಭಾಗವನ್ನು ಪ್ರತಿಬಿಂಬಿಸುವ ಕನ್ನಡಿಯಾಗಿದೆ. ನಕ್ಷತ್ರಗಳನ್ನು ತಿಳಿದುಕೊಳ್ಳುವುದು ಎಂದರೆ ನಿಮ್ಮನ್ನು ನೀವು ತಿಳಿದುಕೊಳ್ಳುವುದು.",
      hi: "प्रत्येक ग्रह आपके अपने आत्मा के एक हिस्से को प्रतिबिंबित करने वाला दर्पण है। सितारों को जानना स्वयं को जानना है।"
    },
    {
      en: "Your birth chart is the blueprint of your destiny, but your actions are the construction workers.",
      kn: "ನಿಮ್ಮ ಜನ್ಮ ಪಟ್ಟಿಯು ನಿಮ್ಮ ಹಣೆಬರಹದ ನೀಲನಕ್ಷೆಯಾಗಿದೆ, ಆದರೆ ನಿಮ್ಮ ಕ್ರಿಯೆಗಳೇ ನಿರ್ಮಾಣ ಕಾರ್ಮಿಕರು.",
      hi: "आपकी जन्म कुंडली आपके भाग्य का खाका है, लेकिन आपके कार्य निर्माण श्रमिक हैं।"
    },
    {
      en: "The Moon rules the mind, and the Sun rules the soul. Balance both to find true enlightenment.",
      kn: "ಚಂದ್ರನು ಮನಸ್ಸನ್ನು ಆಳುತ್ತಾನೆ ಮತ್ತು ಸೂರ್ಯನು ಆತ್ಮವನ್ನು ಆಳುತ್ತಾನೆ. ನಿಜವಾದ ಜ್ಞಾನೋದಯವನ್ನು ಪಡೆಯಲು ಎರಡನ್ನೂ ಸಮತೋಲನಗೊಳಿಸಿ.",
      hi: "चंद्रमा मन पर शासन करता है, और सूर्य आत्मा पर। सच्ची आत्मज्ञान पाने के लिए दोनों को संतुलित करें।"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx(prev => (prev + 1) % quotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const q = quotes[quoteIdx] as any;
  const text = q[lang] || q.en;

  return (
    <div className="w-full bg-white/10 backdrop-blur-xl rounded-[3rem] p-8 sm:p-12 border-4 border-[#D4AF37]/30 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <Quote size={120} className="text-[#D4AF37]" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="text-[#D4AF37] animate-pulse" size={24} />
          <h3 className="text-xl sm:text-2xl font-black text-[#D4AF37] uppercase tracking-[0.3em] astrological-font">Daily Vedic Wisdom</h3>
          <Sparkles className="text-[#D4AF37] animate-pulse" size={24} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl"
          >
            <p className="text-lg sm:text-2xl font-serif italic text-white leading-relaxed drop-shadow-md">
              "{text}"
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="pt-4 flex items-center gap-2 text-[#D4AF37]/40 text-[10px] font-black uppercase tracking-widest">
          <RefreshCw size={12} className="animate-spin-slow" />
          <span>Cycles Every 10 Seconds</span>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DailyWisdom;
