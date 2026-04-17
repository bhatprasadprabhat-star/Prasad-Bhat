
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TRANSLATIONS } from '../constants';
import { Language, UserIntake } from '../types';
import { generateLifeTimeline } from '../services/gemini';
import MandalaBackground from './MandalaBackground';

const TimelineDashboard = ({ intake, lang, goBack }: { intake: UserIntake, lang: Language, goBack: () => void }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `timeline_${intake.dob}_${intake.tob}_${intake.ampm}_${intake.pob}_${lang}`;
      const saved = localStorage.getItem(cacheKey);
      
      if (saved) {
        try {
          setData(JSON.parse(saved));
          setLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse cached timeline", e);
        }
      }

      setLoading(true);
      try {
        const result = await generateLifeTimeline(intake, lang);
        if (result && result.length > 0) {
          setData(result);
          localStorage.setItem(cacheKey, JSON.stringify(result));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [intake, lang]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[var(--bg-secondary)]/90 backdrop-blur-xl border border-[var(--accent-primary)]/40 p-5 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-xs relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
          <p className="text-[10px] font-ancient font-black text-[var(--accent-primary)]/80 uppercase tracking-widest mb-2">Age/Year: {item.year}</p>
          <p className={`text-sm sm:text-lg font-ancient font-black uppercase tracking-widest mb-3 gold-leaf ${
            item.category === 'Risk' ? 'text-red-600 dark:text-red-400' : 
            item.category === 'Good' ? 'text-green-700 dark:text-green-400' : 
            'text-[var(--accent-primary)]'
          }`}>
            {item.category}
          </p>
          <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-premium font-bold italic">"{item.description}"</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <MandalaBackground />
      <header className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-4 sm:p-8 flex items-center justify-between shadow-2xl sticky top-0 z-20 border-b border-[var(--border-primary)]">
        <button onClick={goBack} className="p-1.5 sm:p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all group">
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="ml-2 sm:ml-3 text-lg sm:text-2xl font-ancient font-black gold-leaf uppercase tracking-widest">{t.timeline_title}</h2>
      </header>

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full z-10">
        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 border-8 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin" />
            <p className="text-[var(--accent-primary)] font-ancient font-bold uppercase tracking-widest animate-pulse">{t.calculating_heavens}</p>
          </div>
        ) : (
          <div className="space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--bg-secondary)]/50 backdrop-blur-xl border border-[var(--border-primary)] rounded-lg p-4 sm:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
              <div className="h-[250px] sm:h-[450px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      stroke="var(--accent-primary)" 
                      fontSize={10} 
                      tick={{ fill: 'var(--accent-primary)', opacity: 0.8 }}
                      axisLine={{ stroke: 'var(--accent-primary)', strokeOpacity: 0.2 }}
                    />
                    <YAxis 
                      stroke="var(--accent-primary)" 
                      fontSize={10} 
                      tick={{ fill: 'var(--accent-primary)', opacity: 0.8 }}
                      axisLine={{ stroke: 'var(--accent-primary)', strokeOpacity: 0.2 }}
                      domain={[0, 100]} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="var(--accent-primary)" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                      animationDuration={2500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-6 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500/60 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                  <span className="text-[10px] font-ancient font-bold uppercase tracking-widest text-[var(--accent-primary)]/80">Good Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500/60 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                  <span className="text-[10px] font-ancient font-bold uppercase tracking-widest text-[var(--accent-primary)]/80">Risk Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500/60 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
                  <span className="text-[10px] font-ancient font-bold uppercase tracking-widest text-[var(--accent-primary)]/80">Career/Marriage</span>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
              {data.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-6 rounded-lg border shadow-xl backdrop-blur-xl transition-all hover:scale-[1.02] relative overflow-hidden group ${
                    item.category === 'Risk' ? 'bg-red-500/5 border-red-500/30' : 
                    item.category === 'Good' ? 'bg-green-500/5 border-green-500/30' : 
                    'bg-[var(--bg-secondary)]/50 border-[var(--border-primary)]'
                  }`}
                >
                  <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="text-xs font-ancient font-black text-[var(--accent-primary)] uppercase tracking-widest">Age {item.year}</span>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-ancient font-black uppercase tracking-widest border ${
                      item.category === 'Risk' ? 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30' : 
                      item.category === 'Good' ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30' : 
                      'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-[var(--border-primary)]'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed font-premium font-bold italic relative z-10">"{item.description}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TimelineDashboard;
