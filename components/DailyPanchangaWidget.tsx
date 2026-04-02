
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Wind, Zap, Sparkles, Loader2 } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { generatePanchanga } from '../services/gemini';

interface DailyPanchangaWidgetProps {
  lang: Language;
}

const DailyPanchangaWidget: React.FC<DailyPanchangaWidgetProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [loading, setLoading] = useState(true);
  const [panchangaHtml, setPanchangaHtml] = useState<string | null>(null);

  useEffect(() => {
    const fetchPanchanga = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toLocaleTimeString();
        const data = await generatePanchanga(dateStr, timeStr, "Current Location", lang, 'SEEKER');
        setPanchangaHtml(data);
      } catch (error) {
        console.error("Failed to fetch panchanga:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPanchanga();
  }, [lang]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-br from-[#451a03] to-[#7c2d12] rounded-[3rem] p-8 sm:p-10 shadow-2xl border-4 border-[#D4AF37]/40 relative overflow-hidden group min-h-[300px]"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
        <Sparkles size={120} className="text-[#D4AF37]" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-[#451a03] shadow-lg">
            {loading ? <Loader2 className="animate-spin" size={28} /> : <Sun size={28} />}
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#D4AF37] uppercase tracking-widest astrological-font leading-none">
              {t.today_panchanga || "Today's Panchanga"}
            </h3>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] mt-2">
              Celestial Alignment for Today
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
            <p className="text-[#D4AF37] font-bold animate-pulse uppercase tracking-widest text-xs">Consulting the Heavens...</p>
          </div>
        ) : (
          <div 
            className="panchanga-content text-white/90 font-serif leading-relaxed"
            dangerouslySetInnerHTML={{ __html: panchangaHtml || '' }}
          />
        )}
      </div>
      <style>{`
        .panchanga-content h3 { color: #D4AF37; font-size: 1.25rem; font-weight: 900; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .panchanga-content p { margin-bottom: 1rem; font-size: 0.95rem; }
        .panchanga-content ul { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        .panchanga-content li { background: rgba(255,255,255,0.1); padding: 1rem; rounded: 1.5rem; border: 1px solid rgba(255,255,255,0.1); }
        .panchanga-content strong { color: #D4AF37; display: block; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.25rem; }
      `}</style>
    </motion.div>
  );
};

export default DailyPanchangaWidget;
