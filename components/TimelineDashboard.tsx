
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TRANSLATIONS } from '../constants';
import { Language, UserIntake } from '../types';
import { generateLifeTimeline } from '../services/gemini';

const TimelineDashboard = ({ intake, lang, goBack }: { intake: UserIntake, lang: Language, goBack: () => void }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await generateLifeTimeline(intake, lang);
        setData(result);
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
        <div className="bg-white/95 backdrop-blur-md border-2 border-[#D4AF37] p-4 rounded-2xl shadow-2xl max-w-xs">
          <p className="text-xs font-black text-[#451a03] uppercase mb-1">Age/Year: {item.year}</p>
          <p className={`text-sm font-black uppercase mb-2 ${
            item.category === 'Risk' ? 'text-red-600' : 
            item.category === 'Good' ? 'text-green-600' : 
            'text-blue-600'
          }`}>
            {item.category}
          </p>
          <p className="text-xs text-[#451a03]/80 leading-relaxed italic">"{item.description}"</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden">
      <header className="bg-gradient-to-b from-[#312e81] to-[#1e1b4b] p-6 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[#D4AF37]/40">
        <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="ml-3 text-2xl font-black text-[#D4AF37] uppercase astrological-font tracking-widest">{t.timeline_title}</h2>
      </header>

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full z-10">
        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 border-8 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
            <p className="text-[#451a03] font-black uppercase tracking-widest animate-pulse">{t.calculating_heavens}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl border-4 border-[#D4AF37]/30 rounded-[3rem] p-6 sm:p-10 shadow-2xl"
            >
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D4AF3722" />
                    <XAxis dataKey="year" stroke="#451a03" fontSize={12} fontWeight="bold" />
                    <YAxis stroke="#451a03" fontSize={12} fontWeight="bold" domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#D4AF37" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                  <span className="text-[10px] font-black uppercase text-[#451a03]">Good Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full" />
                  <span className="text-[10px] font-black uppercase text-[#451a03]">Risk Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  <span className="text-[10px] font-black uppercase text-[#451a03]">Career/Marriage</span>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-6 rounded-[2rem] border-2 shadow-xl backdrop-blur-md transition-all hover:scale-105 ${
                    item.category === 'Risk' ? 'bg-red-50 border-red-200' : 
                    item.category === 'Good' ? 'bg-green-50 border-green-200' : 
                    'bg-white/80 border-[#D4AF37]/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-black text-[#451a03] uppercase tracking-widest">Age {item.year}</span>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      item.category === 'Risk' ? 'bg-red-200 text-red-800' : 
                      item.category === 'Good' ? 'bg-green-200 text-green-800' : 
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#451a03] leading-relaxed font-serif italic">"{item.description}"</p>
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
