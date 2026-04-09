
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSLATIONS } from '../constants';
import { Language, UserMode, CityData } from '../types';
import { generatePanchanga } from '../services/gemini';
import CitySearch from './CitySearch';

const Panchanga = ({ lang, mode, goBack }: { lang: Language, mode: UserMode, goBack: () => void }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [view, setView] = useState<'OPTIONS' | 'RESULT'>('OPTIONS');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [formData, setFormData] = useState(() => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return {
      date,
      time,
      city: { name: '', lat: '', lon: '', tz: '' } as CityData
    };
  });

  const handleFetch = async (isToday: boolean) => {
    setLoading(true);
    setView('RESULT');
    try {
      const date = isToday ? new Date().toISOString().split('T')[0] : formData.date;
      const time = isToday ? new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : formData.time;
      const pob = isToday ? 'Current Location' : formData.city.name;
      const data = await generatePanchanga(date, time, pob, lang, mode, formData.city.lat, formData.city.lon, formData.city.tz);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden">
      <header className="bg-gradient-to-b from-[#312e81] to-[#1e1b4b] p-6 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[#D4AF37]/40">
        <button onClick={view === 'RESULT' ? () => setView('OPTIONS') : goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="ml-3 text-2xl font-black text-[#D4AF37] uppercase astrological-font tracking-widest">{t.panchanga_title}</h2>
      </header>

      <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full z-10">
        <AnimatePresence mode="wait">
          {view === 'OPTIONS' ? (
            <motion.div 
              key="options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <button 
                onClick={() => handleFetch(true)}
                className="w-full p-8 bg-white/95 backdrop-blur-xl border-4 border-[#D4AF37]/30 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 hover:scale-[1.02] transition-all group"
              >
                <span className="text-6xl group-hover:rotate-12 transition-transform">📅</span>
                <span className="text-2xl font-black text-[#312e81] uppercase tracking-widest">{t.today_panchanga}</span>
              </button>

              <div className="bg-white/95 backdrop-blur-xl border-4 border-[#D4AF37]/30 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-black text-[#312e81] uppercase tracking-widest">{t.custom_panchanga}</h3>
                  <button 
                    onClick={() => {
                      const now = new Date();
                      setFormData({
                        ...formData,
                        date: now.toISOString().split('T')[0],
                        time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                      });
                    }}
                    className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest flex items-center gap-1 bg-[#312e81] px-3 py-1.5 rounded-full hover:scale-105 transition-all"
                  >
                    Set to Now
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#312e81] uppercase tracking-widest ml-1">{t.birth_date}</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-white/90 border-2 border-[#D4AF37]/20 rounded-2xl p-4 text-sm font-bold text-[#312e81]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#312e81] uppercase tracking-widest ml-1">{t.birth_time}</label>
                    <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-white/90 border-2 border-[#D4AF37]/20 rounded-2xl p-4 text-sm font-bold text-[#312e81]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#312e81] uppercase tracking-widest ml-1">{t.location}</label>
                  <CitySearch value={formData.city.name} onChange={city => setFormData({...formData, city})} placeholder={t.search_city_placeholder} />
                </div>

                <button 
                  onClick={() => handleFetch(false)}
                  disabled={!formData.city.lat}
                  className="w-full py-5 bg-gradient-to-r from-[#312e81] to-[#1e1b4b] text-[#D4AF37] rounded-2xl font-black uppercase tracking-[0.3em] text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {t.submit}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/90 backdrop-blur-2xl border-4 border-[#D4AF37]/30 rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-12 shadow-2xl min-h-[60vh] relative overflow-x-auto"
            >
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                  <div className="w-24 h-24 border-8 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                  <p className="text-[#312e81] font-black uppercase tracking-widest animate-pulse">{t.calculating_heavens}</p>
                </div>
              ) : (
                <div className="prose prose-amber max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: result }} className="astrological-content" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Panchanga;
