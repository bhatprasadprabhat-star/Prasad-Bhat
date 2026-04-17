
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Wind, Zap, Sparkles, Loader2, Sunset, Sunrise, Clock, Calendar } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { generatePanchanga } from '../services/gemini';

interface DailyPanchangaWidgetProps {
  lang: Language;
}

interface PanchangaElement {
  value: string;
  description: string;
}

interface PanchangaData {
  tithi: PanchangaElement;
  vara: PanchangaElement;
  nakshatra: PanchangaElement;
  yoga: PanchangaElement;
  karana: PanchangaElement;
  sunrise: PanchangaElement;
  sunset: PanchangaElement;
  rahu_kala: PanchangaElement;
}

const DailyPanchangaWidget: React.FC<DailyPanchangaWidgetProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [loading, setLoading] = useState(true);
  const [panchangaHtml, setPanchangaHtml] = useState<string | null>(null);
  
  const structuredData = useMemo(() => {
    if (!panchangaHtml) return null;
    try {
      const match = panchangaHtml.match(/<script type="application\/json" id="panchanga-data">(.*?)<\/script>/s);
      if (match && match[1]) {
        const json = JSON.parse(match[1]);
        if (json.type === 'panchanga_data' && json.data) {
          return json.data as PanchangaData;
        }
      }
    } catch (e) {
      console.warn("Failed to parse structured panchanga data", e);
    }
    return null;
  }, [panchangaHtml]);

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

  const cleanHtml = useMemo(() => {
    if (!panchangaHtml) return '';
    // Remove the script tag if present for display
    return panchangaHtml.replace(/<script type="application\/json" id="panchanga-data">.*?<\/script>/s, '');
  }, [panchangaHtml]);

  const elements = [
    { key: 'tithi', label: t.tithi || 'Tithi', icon: Moon, color: 'text-indigo-400' },
    { key: 'nakshatra', label: t.nakshatra || 'Nakshatra', icon: Sparkles, color: 'text-amber-400' },
    { key: 'yoga', label: t.yoga || 'Yoga', icon: Wind, color: 'text-blue-400' },
    { key: 'karana', label: t.karana || 'Karana', icon: Zap, color: 'text-purple-400' },
    { key: 'sunrise', label: t.sunrise || 'Sunrise', icon: Sunrise, color: 'text-orange-400' },
    { key: 'sunset', label: t.sunset || 'Sunset', icon: Sunset, color: 'text-rose-400' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="w-full bg-[var(--bg-secondary)]/50 backdrop-blur-3xl rounded-2xl p-6 sm:p-10 shadow-2xl border border-[var(--border-primary)] relative overflow-hidden group min-h-[400px]"
    >
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
      <div className="absolute top-0 right-0 p-4 sm:p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
        <Sparkles size={120} className="sm:w-[200px] sm:h-[200px] text-[var(--accent-primary)]" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--color-gold-dark)] rounded-xl flex items-center justify-center text-white dark:text-[#020617] shadow-2xl border border-[var(--border-primary)] group-hover:scale-110 transition-transform">
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Sun size={24} />}
            </div>
            <div>
              <h3 className="text-xl sm:text-3xl font-ancient font-black gold-leaf uppercase tracking-widest leading-none">
                {t.today_panchanga || "Today's Panchanga"}
              </h3>
              <p className="text-[10px] font-ancient font-bold text-[var(--accent-primary)]/80 uppercase tracking-[0.3em] mt-2">
                {structuredData?.vara?.value || "Celestial Alignment for Today"}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[var(--bg-primary)]/50 rounded-full border border-[var(--border-primary)]">
            <Calendar size={12} className="text-[var(--accent-primary)]" />
            <span className="text-[10px] font-ancient font-bold uppercase tracking-widest text-[var(--text-primary)]">
              {new Date().toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-[var(--accent-primary)] animate-spin" />
              <div className="absolute inset-0 blur-xl bg-[var(--accent-primary)]/20 animate-pulse"></div>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.4em] text-sm">Consulting the Heavens</p>
              <p className="text-[var(--text-secondary)] text-[10px] uppercase tracking-[0.2em]">Aligning with planetary frequencies...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {structuredData ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {elements.map((el) => {
                  const data = (structuredData as any)[el.key];
                  if (!data) return null;
                  const Icon = el.icon;
                  return (
                    <motion.div 
                      key={el.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -5, borderColor: 'var(--accent-primary)' }}
                      className="bg-[var(--bg-primary)]/50 p-4 rounded-xl border border-[var(--border-primary)] transition-all flex flex-col gap-2 group/card"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-ancient font-black text-[var(--accent-primary)]/60 uppercase tracking-widest">{el.label}</span>
                        <Icon size={14} className={`${el.color} group-hover/card:scale-125 transition-transform`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm sm:text-base font-premium font-black text-[var(--text-primary)] tracking-tight">{data.value}</span>
                        <span className="text-[8px] font-premium text-[var(--text-secondary)] leading-tight mt-1">{data.description}</span>
                      </div>
                    </motion.div>
                  );
                })}
                <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-[var(--bg-primary)] to-[var(--accent-primary)]/5 p-4 rounded-xl border border-[var(--accent-primary)]/30 transition-all flex flex-col justify-center">
                   <div className="flex items-center gap-2 mb-1">
                      <Clock size={12} className="text-red-400" />
                      <span className="text-[9px] font-ancient font-black text-red-400 uppercase tracking-widest">Rahu Kala</span>
                   </div>
                   <span className="text-sm sm:text-base font-premium font-black text-[var(--text-primary)]">{structuredData.rahu_kala?.value}</span>
                </div>
              </div>
            ) : null}

            <div 
              className="panchanga-content text-[var(--text-primary)] font-premium leading-relaxed text-sm sm:text-base opacity-90"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
          </div>
        )}
      </div>
      <style>{`
        .panchanga-content h3 { color: var(--accent-primary); font-size: 1.1rem; font-weight: 900; margin-top: 2rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.2em; font-family: var(--font-ancient); border-left: 4px solid var(--accent-primary); padding-left: 1rem; }
        .panchanga-content h4 { color: var(--accent-primary); font-size: 0.9rem; font-weight: 900; margin-top: 1.5rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; font-family: var(--font-ancient); }
        .panchanga-content p { margin-bottom: 1.25rem; font-size: 0.95rem; }
        .panchanga-content ul { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .panchanga-content li { background: var(--bg-primary); padding: 1.25rem; border-radius: 1rem; border: 1px solid var(--border-primary); transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .panchanga-content li:hover { background: var(--bg-secondary); border-color: var(--accent-primary); transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2); }
        .panchanga-content strong { color: var(--accent-primary); display: block; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem; font-family: var(--font-ancient); letter-spacing: 0.15em; }
        .panchanga-content table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 2rem 0; border: 1px solid var(--border-primary); border-radius: 1rem; overflow: hidden; background: var(--bg-primary)/40; }
        .panchanga-content th { background: var(--accent-primary); color: white; padding: 1rem; font-family: var(--font-ancient); text-transform: uppercase; font-size: 0.75rem; tracking: 0.2em; text-align: left; }
        .dark .panchanga-content th { color: #020617; }
        .panchanga-content td { padding: 1rem; border-bottom: 1px solid var(--border-primary); font-size: 0.9rem; }
        .panchanga-content tr:last-child td { border-bottom: none; }
        .panchanga-content tr:hover { background: var(--accent-primary)/5; }
      `}</style>
    </motion.div>
  );
};

export default DailyPanchangaWidget;
