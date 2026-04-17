
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language, UserMode, CityData } from '../types';
import { generatePanchanga } from '../services/gemini';
import { LoadingIndicator } from './LoadingIndicator';
import CitySearch from './CitySearch';
import MandalaBackground from './MandalaBackground';

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
    <div className={`min-h-screen flex flex-col relative overflow-x-hidden ${mode === 'SCHOLAR' ? 'scholar-theme' : 'seeker-theme'}`}>
      <MandalaBackground />
      <header className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-4 sm:p-8 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[var(--border-primary)]">
        <button onClick={view === 'RESULT' ? () => setView('OPTIONS') : goBack} className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all">
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="ml-2 sm:ml-4 text-xl sm:text-3xl font-ancient font-black gold-leaf uppercase tracking-widest">{t.panchanga_title}</h2>
      </header>

      <main className="flex-1 p-4 sm:p-10 max-w-4xl mx-auto w-full z-10">
        <AnimatePresence mode="wait">
          {view === 'OPTIONS' ? (
            <motion.div 
              key="options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 sm:space-y-10"
            >
              <button 
                onClick={() => handleFetch(true)}
                className="w-full p-8 sm:p-16 bg-[var(--bg-secondary)] backdrop-blur-2xl border border-[var(--border-primary)] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4 sm:gap-8 hover:bg-[var(--accent-primary)]/5 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--accent-primary)]/10 rounded-full blur-3xl group-hover:bg-[var(--accent-primary)]/20 transition-all" />
                <span className="text-5xl sm:text-8xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">📅</span>
                <div className="space-y-2 relative z-10">
                  <span className="text-xl sm:text-4xl font-ancient font-black gold-leaf uppercase tracking-[0.4em] block">{t.today_panchanga}</span>
                  <span className="text-[10px] sm:text-xs font-ancient font-bold text-[var(--accent-primary)]/90 uppercase tracking-[0.3em]">Celestial Alignment for the Present Moment</span>
                </div>
              </button>

              <div className="bg-[var(--bg-secondary)] backdrop-blur-2xl border border-[var(--border-primary)] rounded-lg p-8 sm:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-8 sm:space-y-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-4 relative z-10">
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl sm:text-3xl font-ancient font-black gold-leaf uppercase tracking-[0.3em] mb-2">{t.custom_panchanga}</h3>
                    <p className="text-[10px] sm:text-xs font-ancient font-bold text-[var(--accent-primary)]/90 uppercase tracking-widest">Calculate for any point in time and space</p>
                  </div>
                  <button 
                    onClick={() => {
                      const now = new Date();
                      setFormData({
                        ...formData,
                        date: now.toISOString().split('T')[0],
                        time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                      });
                    }}
                    className="text-[10px] sm:text-xs font-ancient font-black text-[var(--accent-primary)] uppercase tracking-[0.2em] flex items-center gap-2.5 bg-[var(--bg-primary)]/50 border border-[var(--border-primary)] px-6 py-3 rounded-lg hover:bg-[var(--accent-primary)] hover:text-white dark:hover:text-[#020617] transition-all shadow-xl"
                  >
                    <Clock size={14} /> Set to Now
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-3">
                    <label className="text-[10px] sm:text-[12px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-[0.3em] ml-1">{t.birth_date}</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="details-input w-full p-5 text-sm sm:text-base font-premium font-bold bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg focus:border-[var(--accent-primary)] transition-all shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] sm:text-[12px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-[0.3em] ml-1">{t.birth_time}</label>
                    <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="details-input w-full p-5 text-sm sm:text-base font-premium font-bold bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg focus:border-[var(--accent-primary)] transition-all shadow-inner" />
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <label className="text-[10px] sm:text-[12px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">{t.location}</label>
                  <CitySearch value={formData.city.name} onChange={city => setFormData({...formData, city})} placeholder={t.search_city_placeholder} />
                </div>

                <button 
                  onClick={() => handleFetch(false)}
                  disabled={!formData.city.lat}
                  className="w-full py-5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] rounded-lg font-ancient font-black uppercase tracking-[0.3em] text-sm sm:text-base shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 relative z-10"
                >
                  {t.submit}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--bg-secondary)] backdrop-blur-2xl border border-[var(--border-primary)] rounded-lg p-6 sm:p-12 shadow-2xl min-h-[60vh] relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <LoadingIndicator variant="card" size={48} label={t.calculating_heavens} />
                </div>
              ) : (
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-4">
                    <h3 className="text-xl sm:text-2xl font-ancient font-black gold-leaf uppercase tracking-widest">Celestial Data</h3>
                    <div className="text-[10px] font-ancient font-bold text-[var(--text-primary)]/80 uppercase tracking-widest">
                      {formData.date} • {formData.time}
                    </div>
                  </div>
                  
                  <div className="prose max-w-none dark:prose-invert">
                    <div 
                      dangerouslySetInnerHTML={{ __html: result.replace(/<script type="application\/json" id="panchanga-data">.*?<\/script>/s, '') }} 
                      className="astrological-content analysis-rich-text text-[var(--text-primary)]" 
                    />
                  </div>
                  
                  <div className="pt-8 border-t border-[var(--border-primary)]">
                    <button 
                      onClick={() => setView('OPTIONS')}
                      className="w-full py-4 border border-[var(--border-primary)] text-[var(--accent-primary)] rounded-lg font-ancient font-black uppercase tracking-[0.3em] text-xs hover:bg-[var(--accent-primary)]/10 transition-all"
                    >
                      Calculate Another
                    </button>
                  </div>
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
