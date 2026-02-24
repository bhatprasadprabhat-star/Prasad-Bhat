
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stars, Sparkles, Moon, Sun, Compass } from 'lucide-react';
import { AppTab, Language, UserIntake, MatchingIntake, UserMode, PlanetPosition, CityData } from './types';
import LiveAstrologer from './components/LiveAstrologer';
import SearchAssistant from './components/SearchAssistant';
import SouthIndianChart from './components/SouthIndianChart';
import { generateHoroscope, findMuhurtha, matchKundali, generateDailyForecastForRasi, searchCities, generatePrashnaAnalysis } from './services/gemini';
import { RASIS, TRANSLATIONS, LANGUAGES, COLORS, HOURS, MINUTES, MUHURTA_TYPES } from './constants';

const MandalaBackground = React.memo(() => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {/* Deep Space Gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]"></div>
    
    {/* Animated Stars */}
    <div className="absolute inset-0 opacity-30">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{ 
            x: Math.random() * 100 + 'vw', 
            y: Math.random() * 100 + 'vh',
            opacity: Math.random(),
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{ 
            duration: Math.random() * 3 + 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>

    {/* Rotating Mandala */}
    <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
      <motion.svg 
        viewBox="0 0 200 200" 
        className="w-[180vmax] h-[180vmax] text-[#D4AF37]"
        animate={{ rotate: 360 }}
        transition={{ duration: 400, repeat: Infinity, ease: "linear" }}
      >
        <g fill="none" stroke="currentColor" strokeWidth="0.1">
          {[...Array(18)].map((_, i) => (
            <circle key={i} cx="100" cy="100" r={5 + i * 10} />
          ))}
          {[...Array(36)].map((_, i) => (
            <line key={i} x1="100" y1="100" x2={100 + 160 * Math.cos(i * Math.PI / 18)} y2={100 + 160 * Math.sin(i * Math.PI / 18)} />
          ))}
        </g>
      </motion.svg>
    </div>

    {/* Subtle Nebula Clouds */}
    <div className="absolute inset-0 opacity-20 mix-blend-screen">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#431407] blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1e1b4b] blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  </div>
));

const FantasticLogo = React.memo(({ className = "" }: { className?: string }) => (
  <div className={`relative w-36 h-36 sm:w-56 md:w-80 group cursor-default perspective-1000 ${className}`}>
    <div className="absolute inset-[-10px] sm:inset-[-25px] border-2 border-[#D4AF37]/50 rounded-full animate-[spin_100s_linear_infinite]"></div>
    <div className="absolute inset-0 animate-[spin_70s_linear_infinite] opacity-80 group-hover:opacity-100 transition-opacity duration-1000">
      <svg viewBox="0 0 100 100" className="w-full h-full fill-[#D4AF37]">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="0.4" strokeDasharray="1 4" />
        {RASIS.map((r, i) => (
          <g key={i} transform={`rotate(${i * 30} 50 50)`}>
            <text x="50" y="8" fontSize="8" textAnchor="middle" className="font-serif font-black drop-shadow-md select-none fill-[#D4AF37]">{r.icon}</text>
          </g>
        ))}
      </svg>
    </div>
    <div className="absolute inset-8 sm:inset-12 md:inset-16 bg-gradient-to-tr from-[#D4AF37]/40 via-[#FFD700]/30 to-transparent rounded-full blur-[30px] sm:blur-[70px] transition-all duration-1000 animate-pulse"></div>
    <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 md:p-8">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_50px_rgba(212,175,55,0.7)]">
        <g className="animate-[pulse_4s_easeInOut_infinite]">
          {[...Array(48)].map((_, i) => (
            <path key={i} d="M50 5 L51.5 35 L48.5 35 Z" fill={i % 2 === 0 ? "#D4AF37" : "#FFD700"} transform={`rotate(${i * 7.5} 50 50)`} />
          ))}
        </g>
        <circle cx="50" cy="50" r="22" fill="#431407" className="stroke-[#D4AF37] stroke-[1.5]" />
        <text x="50" y="55" fontSize="14" textAnchor="middle" fill="#D4AF37" className="astrological-font font-bold">ॐ</text>
      </svg>
    </div>
  </div>
));

const TimePicker = ({ time, ampm, onChange }: { time: string, ampm: string, onChange: (t: string, a: string) => void }) => {
  const [h, m] = (time || '12:00').split(':');
  return (
    <div className="flex gap-1.5 w-full">
      <div className="flex-1 relative">
        <select value={h} onChange={e => onChange(`${e.target.value}:${m}`, ampm)} className="details-input text-center appearance-none cursor-pointer w-full bg-white font-bold text-[#431407]">
          {HOURS.map(hour => <option key={hour} value={hour}>{hour}</option>)}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#431407] text-[10px]">▼</div>
      </div>
      <span className="flex items-center font-black text-[#431407] text-lg">:</span>
      <div className="flex-1 relative">
        <select value={m} onChange={e => onChange(`${h}:${e.target.value}`, ampm)} className="details-input text-center appearance-none cursor-pointer w-full bg-white font-bold text-[#431407]">
          {MINUTES.map(min => <option key={min} value={min}>{min}</option>)}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#431407] text-[10px]">▼</div>
      </div>
      <div className="w-18 sm:w-24 relative">
        <select value={ampm} onChange={e => onChange(time, e.target.value)} className="details-input text-center appearance-none cursor-pointer w-full bg-[#431407] text-[#D4AF37] font-black">
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

const CitySearch = ({ value, onChange }: { value: string, onChange: (v: CityData) => void }) => {
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [show, setShow] = useState(false);
  const timer = useRef<any>(null);

  const fetchSuggestions = async (val: string) => {
    if (val.length < 3) return;
    const cities = await searchCities(val);
    setSuggestions(cities);
    setShow(true);
  };

  const handleInput = (val: string) => {
    // We only update the string value for typing, but we need to handle the selection separately
    // This is a bit tricky with the current structure, but let's try to keep it simple
    // We'll pass a dummy CityData if it's just typing
    onChange({ name: val, lat: '', lon: '', tz: '' });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  return (
    <div className="relative w-full">
      <input value={value} onChange={e => handleInput(e.target.value)} placeholder="Search City..." className="details-input w-full pl-4 pr-8 font-bold text-[#431407]" onFocus={() => setShow(suggestions.length > 0)} onBlur={() => setTimeout(() => setShow(false), 250)} />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-md text-[#431407]">📍</div>
      {show && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border-2 border-[#D4AF37] rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto backdrop-blur-xl">
          {suggestions.map((city, i) => (
            <button key={i} onMouseDown={() => { onChange(city); setShow(false); }} className="w-full px-4 py-3 text-left text-sm font-bold text-[#431407] hover:bg-[#431407] hover:text-[#D4AF37] transition-all border-b border-slate-200 last:border-0">
              {city.name} ({city.lat}, {city.lon})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<UserMode | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [lang, setLang] = useState<Language>('en');
  const [horoscopeState, setHoroscopeState] = useState<'INPUT' | 'MENU' | 'ANALYSIS'>('INPUT');
  const [currentSection, setCurrentSection] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [chartData, setChartData] = useState<PlanetPosition[] | null>(null);
  const [isChatOverlayOpen, setIsChatOverlayOpen] = useState(false);
  const [cache, setCache] = useState<Record<string, string>>({});
  
  const [intake, setIntake] = useState<UserIntake & { lat: string, lon: string, tz: string }>({ 
    name: '', dob: '2026-02-10', tob: '06:30', ampm: 'AM', pob: 'UDUPI,KAR,IND', gender: 'Male', lat: "13° 20' N", lon: "74° 45' E", tz: "+ 5:30"
  });
  const [savedProfiles, setSavedProfiles] = useState<UserIntake[]>([]);
  const [prashnaInput, setPrashnaInput] = useState({ question: '', pob: 'UDUPI,KAR,IND' });

  const [matchingIntake, setMatchingIntake] = useState<MatchingIntake>({
    person1: { name: '', dob: '2000-01-01', tob: '10:00', ampm: 'AM', pob: '', gender: 'Male' },
    person2: { name: '', dob: '2000-01-01', tob: '10:00', ampm: 'AM', pob: '', gender: 'Female' }
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    const saved = localStorage.getItem('astro_logic_profiles_v4');
    if (saved) setSavedProfiles(JSON.parse(saved));
  }, []);

  const handleSaveProfile = () => {
    if (!intake.name) {
      alert("Please enter a name to save.");
      return;
    }
    const updated = [intake, ...savedProfiles.filter(p => p.name !== intake.name)].slice(0, 5);
    setSavedProfiles(updated);
    localStorage.setItem('astro_logic_profiles_v4', JSON.stringify(updated));
    alert("Profile Saved.");
  };

  const handleAction = async (type: string, payload?: any) => {
    if (!mode) return;
    
    const cacheKey = `${type}_${payload}_${lang}_${mode}_${JSON.stringify(intake)}_${JSON.stringify(matchingIntake)}_${JSON.stringify(prashnaInput)}`;
    if (cache[cacheKey]) {
      const res = cache[cacheKey];
      setAnalysisResult(res);
      extractChartData(res);
      if (type === 'HOROSCOPE' || type === 'DAILY' || type === 'MUHURTA') {
        setHoroscopeState('ANALYSIS');
      }
      setCurrentSection(payload || type);
      return;
    }

    setIsProcessing(true);
    setAnalysisResult(null);
    setChartData(null);
    try {
      let res = '';
      if (type === 'HOROSCOPE') {
        setCurrentSection(payload);
        res = await generateHoroscope({ ...intake, tob: `${intake.tob} ${intake.ampm}` }, payload, lang, mode);
        setHoroscopeState('ANALYSIS');
      } else if (type === 'DAILY') {
        setCurrentSection(payload + " Forecast");
        res = await generateDailyForecastForRasi(payload, lang, mode);
        setHoroscopeState('ANALYSIS');
      } else if (type === 'MATCHING') {
        setCurrentSection(t.matching);
        res = await matchKundali(matchingIntake, lang, mode);
      } else if (type === 'MUHURTA') {
        setCurrentSection(payload);
        res = await findMuhurtha(payload, 'Planetary Alignment', lang, mode);
        setHoroscopeState('ANALYSIS');
      } else if (type === 'PRASHNA') {
        setCurrentSection('Prashna Analysis');
        res = await generatePrashnaAnalysis(prashnaInput.question, prashnaInput.pob, lang, mode);
      }
      setAnalysisResult(res);
      extractChartData(res);
      setCache(prev => ({ ...prev, [cacheKey]: res }));
    } catch (err) { console.error(err); } finally { setIsProcessing(false); }
  };

  const extractChartData = (html: string) => {
    try {
      const match = html.match(/<script type="application\/json" id="chart-data">([\s\S]*?)<\/script>/);
      if (match && match[1]) {
        const data = JSON.parse(match[1]);
        setChartData(data);
      } else {
        setChartData(null);
      }
    } catch (e) {
      console.error("Failed to parse chart data", e);
      setChartData(null);
    }
  };

  const goBack = () => {
    if (analysisResult) { setAnalysisResult(null); return; }
    if (horoscopeState === 'MENU') { setHoroscopeState('INPUT'); }
    else { setActiveTab(AppTab.DASHBOARD); setHoroscopeState('INPUT'); }
  };

  if (!mode) {
    return (
      <motion.div 
        key="mode-selection"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-6 overflow-hidden relative"
      >
        <MandalaBackground />
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-6 sm:top-16 opacity-30 pointer-events-none scale-50 sm:scale-75"
        >
          <FantasticLogo />
        </motion.div>
        
        <div className="z-10 text-center mb-8 sm:mb-12 mt-16">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-7xl font-black text-[#D4AF37] astrological-font tracking-widest uppercase mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]"
          >
            Astro Logic
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white font-serif italic text-sm sm:text-xl tracking-wide"
          >
            Sacred Geometry • Ancient Logic
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 w-full max-w-5xl z-10">
          <motion.button 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(212, 175, 55, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode('SEEKER')}
            className="flex-1 group relative flex flex-col items-center justify-center p-8 sm:p-14 transition-all duration-300 bg-white/10 border-2 border-[#D4AF37]/40 rounded-[2rem] sm:rounded-[3rem] shadow-xl overflow-hidden"
          >
            <div className="z-10 text-center space-y-4">
              <span className="text-5xl sm:text-7xl block group-hover:scale-110 transition-transform">🌟</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#D4AF37] uppercase tracking-wide astrological-font">Seeker</h2>
              <p className="text-xs sm:text-sm text-white font-serif leading-relaxed max-w-[240px] mx-auto opacity-90">
                "Simple life guidance, career flow, and daily energy in clear, accessible language."
              </p>
              <div className="pt-2">
                <span className="inline-block px-6 py-3 border-2 border-[#D4AF37] text-[#D4AF37] rounded-full uppercase text-[10px] font-black tracking-widest group-hover:bg-[#D4AF37] group-hover:text-[#020617] transition-all">Select Seeker</span>
              </div>
            </div>
          </motion.button>

          <motion.button 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 153, 51, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode('SCHOLAR')}
            className="flex-1 group relative flex flex-col items-center justify-center p-8 sm:p-14 transition-all duration-300 bg-white/10 border-2 border-[#FF9933]/40 rounded-[2rem] sm:rounded-[3rem] shadow-xl overflow-hidden"
          >
            <div className="z-10 text-center space-y-4">
              <span className="text-5xl sm:text-7xl block group-hover:scale-110 transition-transform">📜</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#FF9933] uppercase tracking-wide astrological-font">Scholar</h2>
              <p className="text-xs sm:text-sm text-white font-serif leading-relaxed max-w-[240px] mx-auto opacity-90">
                "Mathematical precision. Longitudes, classical Shlokas, and deep Siddhantic rules."
              </p>
              <div className="pt-2">
                <span className="inline-block px-6 py-3 border-2 border-[#FF9933] text-[#FF9933] rounded-full uppercase text-[10px] font-black tracking-widest group-hover:bg-[#FF9933] group-hover:text-[#020617] transition-all">Select Scholar</span>
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const renderHoroscopeIntake = () => (
    <div className="min-h-screen parchment-bg flex flex-col animate-in slide-in-from-right duration-500 overflow-x-hidden">
      <MandalaBackground />
      <header className="bg-gradient-to-b from-[#431407] to-[#1a0803] p-4 sm:p-6 flex items-center shadow-xl sticky top-0 z-20 border-b border-[#D4AF37]/30">
        <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
           <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="ml-3">
          <h2 className="text-lg sm:text-2xl font-black text-[#D4AF37] tracking-widest uppercase astrological-font leading-tight">Sacred Intake</h2>
          <p className="text-[9px] text-white/50 uppercase font-black tracking-widest">{mode === 'SCHOLAR' ? 'Siddhantic precision' : 'Personal guidance'}</p>
        </div>
      </header>
      <div className="flex-1 p-4 sm:p-8 space-y-8 max-w-3xl mx-auto w-full overflow-y-auto pb-48 z-10">
        <div className="grid gap-6 p-6 sm:p-10 bg-white/80 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-[#D4AF37]/30 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#431407] uppercase tracking-widest ml-1">Name of Soul</label>
            <input value={intake.name} onChange={e => setIntake({...intake, name: e.target.value})} placeholder="Enter Full Name" className="details-input" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#431407] uppercase tracking-widest ml-1">Birth Date</label>
              <input type="date" value={intake.dob} onChange={e => setIntake({...intake, dob: e.target.value})} className="details-input font-bold" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#431407] uppercase tracking-widest ml-1">Birth Time</label>
              <TimePicker time={intake.tob} ampm={intake.ampm || 'AM'} onChange={(t, a) => setIntake({...intake, tob: t, ampm: a})} />
            </div>
          </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#431407] uppercase tracking-widest ml-1">Birth Location</label>
              <CitySearch value={intake.pob} onChange={v => setIntake({...intake, pob: v.name, lat: v.lat, lon: v.lon, tz: v.tz})} />
            </div>
            {intake.lat && (
              <div className="flex gap-4 text-[9px] font-black text-[#7C2D12] uppercase tracking-widest px-2">
                <span>Lat: {intake.lat}</span>
                <span>Lon: {intake.lon}</span>
                <span>TZ: {intake.tz}</span>
              </div>
            )}
        </div>
        
        {savedProfiles.length > 0 && (
          <div className="p-4 sm:p-6 bg-white/50 border border-[#D4AF37]/20 rounded-3xl space-y-3">
            <h3 className="text-[9px] font-black uppercase text-[#431407] tracking-widest text-center opacity-70">Saved Profiles</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {savedProfiles.map((p, i) => (
                <button key={i} onClick={() => setIntake(p as any)} className="px-4 py-2 bg-white rounded-xl text-[11px] font-bold text-[#431407] border border-[#D4AF37]/20 hover:border-[#D4AF37] shadow-sm transition-all active:scale-95">
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="bg-[#431407] fixed bottom-0 left-0 right-0 z-20 flex shadow-[0_-10px_30px_rgba(0,0,0,0.5)] border-t border-[#D4AF37]/50">
        <button onClick={handleSaveProfile} className="flex-1 py-5 sm:py-8 bg-transparent text-[#D4AF37] uppercase text-[10px] font-black tracking-widest border-r border-white/10 active:bg-white/10">💾 Save</button>
        <button onClick={() => setHoroscopeState('MENU')} className="flex-[2] py-5 sm:py-8 bg-gradient-to-r from-yellow-600 to-yellow-500 text-[#431407] uppercase text-[11px] sm:text-xs font-black tracking-[0.2em] active:brightness-90 transition-all">Continue ➔</button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (analysisResult) {
      return (
        <motion.div 
          key="analysis"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
        >
          <MandalaBackground />
          <header className="bg-gradient-to-b from-[#431407] to-[#1a0803] p-4 sm:p-6 flex items-center shadow-2xl sticky top-0 z-30 border-b border-[#D4AF37]/40">
            <button onClick={() => setAnalysisResult(null)} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="ml-3 text-lg sm:text-xl font-black text-[#D4AF37] truncate astrological-font uppercase tracking-widest">{currentSection}</h2>
          </header>
          <div className="flex-1 p-4 sm:p-10 md:p-16 overflow-y-auto max-w-6xl mx-auto w-full pb-48 z-10">
            {chartData && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <h3 className="text-center text-[#431407] font-black uppercase tracking-[0.3em] mb-6 text-sm sm:text-lg">Celestial Map (Rasi)</h3>
                <SouthIndianChart data={chartData} />
              </motion.div>
            )}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`analysis-rich-text detailed-view p-6 sm:p-12 md:p-16 bg-white/95 border-2 border-[#D4AF37]/20 shadow-2xl rounded-[1.5rem] sm:rounded-[3rem] ${mode === 'SCHOLAR' ? 'scholar-view' : 'seeker-view'}`} 
              dangerouslySetInnerHTML={{ __html: analysisResult }} 
            />
          </div>
        </motion.div>
      );
    }
    switch(activeTab) {
      case AppTab.DASHBOARD:
        return (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col parchment-bg overflow-x-hidden relative"
          >
            <MandalaBackground />
            <nav className="w-full px-4 sm:px-8 py-5 sm:py-10 flex justify-between items-center z-20">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setMode(null)}
                  className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-[#431407] to-[#1a0803] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border-2 border-[#D4AF37]/40 rotate-1 transition-all"
                >
                   <span className="text-white text-xl sm:text-3xl">☀️</span>
                </button>
                <div className="flex flex-col -gap-1">
                  <span className="text-xl sm:text-4xl font-black text-[#431407] tracking-tighter uppercase astrological-font leading-none">Astro Logic</span>
                  <span className="text-[8px] sm:text-[11px] font-black text-[#7C2D12] uppercase tracking-[0.3em] ml-0.5">{mode === 'SCHOLAR' ? 'Siddhantic' : 'Seeker Path'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setMode(null)}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 border-2 border-[#431407] bg-[#431407] rounded-full text-[10px] font-black uppercase text-[#D4AF37] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md group"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                  Path
                </button>
                <select value={lang} onChange={(e) => setLang(e.target.value as Language)} className="bg-white border-2 border-[#D4AF37]/40 text-[#431407] text-[11px] font-black rounded-full px-5 py-2 appearance-none cursor-pointer shadow-lg uppercase tracking-wider">
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
              </div>
            </nav>

            <section className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-16 text-center max-w-7xl mx-auto w-full relative z-10">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-8 sm:mb-12 scale-75 sm:scale-100"
              >
                <FantasticLogo />
              </motion.div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-7xl md:text-9xl font-black text-[#431407] mb-4 sm:mb-8 tracking-tighter astrological-font leading-tight drop-shadow-lg"
              >
                Astro Logic
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-2xl md:text-3xl font-serif italic text-[#7C2D12] max-w-4xl mx-auto opacity-95 mb-10 sm:mb-20 leading-relaxed px-4 italic"
              >
                "{t.tagline}"
              </motion.p>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 w-full px-2">
                {[
                  { id: AppTab.HOROSCOPE, label: t.horoscope, icon: '📜', desc: mode === 'SCHOLAR' ? 'Precision' : 'Journey' },
                  { id: AppTab.DAILY_PREDICTION, label: t.daily, icon: '📅', desc: mode === 'SCHOLAR' ? 'Transits' : 'Energy' },
                  { id: AppTab.MATCHING, label: t.matching, icon: '💑', desc: mode === 'SCHOLAR' ? 'Synergy' : 'Love' },
                  { id: AppTab.MUHURTHA, label: t.muhurta, icon: '⏰', desc: mode === 'SCHOLAR' ? 'Kala' : 'Lucky' },
                  { id: AppTab.PRASHNA, label: 'Prashna', icon: '❓', desc: mode === 'SCHOLAR' ? 'Horary' : 'Oracle' }
                ].map((item, idx) => (
                  <motion.button 
                    key={item.id} 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    onClick={() => setActiveTab(item.id)} 
                    className="group relative bg-white/70 border-2 border-[#D4AF37]/20 rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-8 transition-all duration-300 hover:bg-white hover:-translate-y-1.5 hover:shadow-2xl flex flex-col items-center gap-2 sm:gap-4 shadow-xl backdrop-blur-md overflow-hidden"
                  >
                    <span className="text-4xl sm:text-6xl group-hover:scale-110 transition-all drop-shadow-md">{item.icon}</span>
                    <div className="space-y-0.5">
                      <h3 className="text-[10px] sm:text-sm md:text-lg font-black uppercase tracking-wider text-[#431407] whitespace-nowrap">{item.label}</h3>
                      <p className="text-[8px] sm:text-[10px] text-[#7C2D12]/70 uppercase font-black tracking-widest">{item.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>
            
            <footer className="w-full py-8 text-center text-[8px] sm:text-[10px] text-[#431407]/40 font-black uppercase tracking-[0.8em] z-10 px-4">Divine Order • Celestial Alignment • Deep Knowledge</footer>
          </motion.div>
        );
      case AppTab.HOROSCOPE:
        return horoscopeState === 'MENU' ? (
          <motion.div 
            key="horoscope-menu"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
          >
            <MandalaBackground />
            <header className="bg-gradient-to-b from-[#431407] to-[#1a0803] p-4 sm:p-7 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[#D4AF37]/40">
              <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="ml-3 text-lg sm:text-2xl font-black text-[#D4AF37] uppercase astrological-font tracking-widest">Analysis</h2>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 p-6 sm:p-12 flex-1 overflow-y-auto max-w-6xl mx-auto w-full pb-48 z-10">
              {[ 
                { id: 'menu_details', label: mode === 'SCHOLAR' ? 'Birth Analysis' : 'My Character' }, 
                { id: 'menu_timeline', label: mode === 'SCHOLAR' ? 'Timeline' : 'Life Path' },
                { id: 'menu_hora', label: mode === 'SCHOLAR' ? 'Shastriya' : 'Wealth & Health' },
                { id: 'menu_rasi', label: mode === 'SCHOLAR' ? 'Rasi Kundli' : 'The Soul Map' }, 
                { id: 'menu_dasha', label: mode === 'SCHOLAR' ? 'Vimshottari' : 'Life Phase' }, 
                { id: 'menu_ashtaka', label: mode === 'SCHOLAR' ? 'Ashtakavarga' : 'Power Score' } 
              ].map((item, idx) => (
                <motion.button 
                  key={item.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction('HOROSCOPE', item.label)} 
                  className="menu-button-parchment group p-8 sm:p-12 border-2 rounded-[2rem] sm:rounded-[3rem] shadow-xl transition-all"
                >
                  <span className="text-sm sm:text-lg md:text-xl font-black text-[#431407] group-hover:text-[#7C2D12] transition-colors uppercase tracking-widest">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="horoscope-intake"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="min-h-screen"
          >
            {renderHoroscopeIntake()}
          </motion.div>
        );
      case AppTab.DAILY_PREDICTION:
        return (
          <motion.div 
            key="daily"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
          >
             <MandalaBackground />
             <header className="bg-gradient-to-b from-[#431407] to-[#1a0803] p-4 sm:p-7 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[#D4AF37]/40">
                <button onClick={() => setActiveTab(AppTab.DASHBOARD)} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="ml-3 text-lg sm:text-2xl font-black text-[#D4AF37] tracking-tight uppercase astrological-font">{t.daily_title}</h2>
             </header>
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8 p-5 sm:p-12 max-w-6xl mx-auto w-full pb-48 z-10">
                {RASIS.map((rasi, idx) => (
                  <motion.button 
                    key={rasi.name} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction('DAILY', rasi.name)} 
                    className="menu-button-parchment aspect-square flex flex-col items-center justify-center gap-2 sm:gap-5 group rounded-[1.5rem] sm:rounded-[2.5rem] shadow-lg"
                  >
                    <span className="text-4xl sm:text-7xl group-hover:rotate-6 transition-all drop-shadow-lg">{rasi.icon}</span>
                    <span className="text-[10px] sm:text-sm md:text-lg font-black uppercase tracking-widest text-[#431407]">{rasi.name}</span>
                  </motion.button>
                ))}
             </div>
          </motion.div>
        );
      case AppTab.MATCHING:
        return (
          <motion.div 
            key="matching"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
          >
             <MandalaBackground />
             <header className="bg-gradient-to-b from-[#431407] to-[#1a0803] p-4 sm:p-7 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[#D4AF37]/40">
                <button onClick={() => setActiveTab(AppTab.DASHBOARD)} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="ml-3 text-lg sm:text-2xl font-black text-[#D4AF37] tracking-tight uppercase astrological-font">Matching</h2>
             </header>
             <div className="p-4 sm:p-10 md:p-16 max-w-5xl mx-auto w-full space-y-8 sm:space-y-16 pb-48 z-10">
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 sm:p-12 bg-white/80 border-2 border-[#D4AF37]/30 rounded-[2rem] sm:rounded-[3rem] space-y-6 shadow-2xl relative backdrop-blur-md"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-[#431407] text-[#D4AF37] rounded-full text-[9px] sm:text-xs font-black uppercase tracking-widest shadow-xl">Partner One</div>
                  <div className="grid gap-4 sm:gap-6">
                    <input value={matchingIntake.person1.name} onChange={e => setMatchingIntake({...matchingIntake, person1: {...matchingIntake.person1, name: e.target.value}})} placeholder="First Name" className="details-input" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <input type="date" value={matchingIntake.person1.dob} onChange={e => setMatchingIntake({...matchingIntake, person1: {...matchingIntake.person1, dob: e.target.value}})} className="details-input font-bold" />
                      <TimePicker time={matchingIntake.person1.tob} ampm={matchingIntake.person1.ampm || 'AM'} onChange={(t, a) => setMatchingIntake({...matchingIntake, person1: {...matchingIntake.person1, tob: t, ampm: a}})} />
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 sm:p-12 bg-white/80 border-2 border-[#D4AF37]/30 rounded-[2rem] sm:rounded-[3rem] space-y-6 shadow-2xl relative backdrop-blur-md"
                >
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-[#D4AF37] text-[#431407] rounded-full text-[9px] sm:text-xs font-black uppercase tracking-widest shadow-xl">Partner Two</div>
                  <div className="grid gap-4 sm:gap-6">
                    <input value={matchingIntake.person2.name} onChange={e => setMatchingIntake({...matchingIntake, person2: {...matchingIntake.person2, name: e.target.value}})} placeholder="Second Name" className="details-input" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <input type="date" value={matchingIntake.person2.dob} onChange={e => setMatchingIntake({...matchingIntake, person2: {...matchingIntake.person2, dob: e.target.value}})} className="details-input font-bold" />
                      <TimePicker time={matchingIntake.person2.tob} ampm={matchingIntake.person2.ampm || 'AM'} onChange={(t, a) => setMatchingIntake({...matchingIntake, person2: {...matchingIntake.person2, tob: t, ampm: a}})} />
                    </div>
                  </div>
                </motion.div>
                <motion.button 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction('MATCHING')} 
                  className="astro-btn-maroon py-5 sm:py-9 text-lg sm:text-2xl font-black rounded-full shadow-2xl"
                >
                  Get Verdict
                </motion.button>
             </div>
          </motion.div>
        );
      case AppTab.MUHURTHA:
        return (
          <motion.div 
            key="muhurta"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
          >
             <MandalaBackground />
             <header className="bg-gradient-to-b from-[#431407] to-[#1a0803] p-4 sm:p-7 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[#D4AF37]/40">
                <button onClick={() => setActiveTab(AppTab.DASHBOARD)} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="ml-3 text-lg sm:text-2xl font-black text-[#D4AF37] uppercase astrological-font tracking-widest">Muhurta</h2>
             </header>
             <div className="p-4 sm:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto w-full pb-48 z-10">
                {MUHURTA_TYPES.map((m, idx) => (
                  <motion.button 
                    key={m.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(67, 20, 7, 1)", color: "rgba(212, 175, 55, 1)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction('MUHURTA', m.label)} 
                    className="group bg-white/80 border-2 border-[#D4AF37]/20 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] transition-all duration-300 flex flex-col items-center gap-3 sm:gap-5 shadow-xl backdrop-blur-md"
                  >
                    <span className="text-3xl sm:text-5xl group-hover:scale-110 transition-all drop-shadow-md">✨</span>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wide text-[#431407] group-hover:text-[#D4AF37] text-center transition-colors px-2 leading-relaxed">{m.label}</span>
                  </motion.button>
                ))}
             </div>
          </motion.div>
        );
      case AppTab.PRASHNA: 
        return (
          <motion.div 
            key="prashna"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
          >
            <MandalaBackground />
            <header className="bg-gradient-to-b from-[#431407] to-[#1a0803] p-4 sm:p-7 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[#D4AF37]/40">
              <button onClick={() => setActiveTab(AppTab.DASHBOARD)} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="ml-3 text-lg sm:text-2xl font-black text-[#D4AF37] uppercase astrological-font tracking-widest">Oracle</h2>
            </header>
            <div className="p-4 sm:p-10 md:p-16 max-w-4xl mx-auto w-full space-y-10 sm:space-y-16 pb-48 z-10">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-8 sm:p-14 bg-white/85 border-2 border-[#D4AF37]/30 rounded-[2rem] sm:rounded-[3rem] space-y-10 text-center shadow-2xl backdrop-blur-md"
              >
                <span className="text-7xl sm:text-9xl mb-2 block drop-shadow-xl animate-pulse">🕉️</span>
                <h3 className="text-2xl sm:text-4xl font-black text-[#431407] uppercase tracking-widest">Ask Guruji</h3>
                <div className="space-y-8 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#431407] uppercase tracking-widest ml-1 opacity-80">Deep Inquiry</label>
                    <textarea value={prashnaInput.question} onChange={e => setPrashnaInput({...prashnaInput, question: e.target.value})} placeholder="What is your deep question for the stars?" className="details-input min-h-[140px] sm:min-h-[260px] resize-none font-bold text-base sm:text-xl" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#431407] uppercase tracking-widest ml-1 opacity-80">Location</label>
                    <CitySearch value={prashnaInput.pob} onChange={v => setPrashnaInput({...prashnaInput, pob: v.name})} />
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!prashnaInput.question} 
                  onClick={() => handleAction('PRASHNA')} 
                  className="astro-btn-maroon py-5 sm:py-8 text-xl sm:text-3xl font-black rounded-full disabled:opacity-50"
                >
                  Seek Answer
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen text-[#431407] selection:bg-yellow-500/30 font-serif overflow-x-hidden">
      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[60] pointer-events-none">
        <button onClick={() => setIsChatOverlayOpen(!isChatOverlayOpen)} className="pointer-events-auto w-16 h-16 sm:w-24 sm:h-24 bg-[#431407] rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.6)] border-4 sm:border-8 border-[#D4AF37] flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all group">
          <span className="text-2xl sm:text-5xl drop-shadow-lg group-hover:rotate-6 transition-transform">{isChatOverlayOpen ? '✕' : '🙏'}</span>
          {!isChatOverlayOpen && <span className="hidden sm:block text-[9px] font-black uppercase text-[#D4AF37] tracking-widest mt-0.5 text-center">Ask Help for Guruji</span>}
        </button>
        
        {isChatOverlayOpen && (
          <div className="pointer-events-auto absolute bottom-20 right-0 w-[92vw] sm:w-[440px] h-[75vh] sm:max-h-[800px] bg-white rounded-[2rem] sm:rounded-[3.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.7)] border-4 border-[#D4AF37]/50 overflow-hidden animate-in slide-in-from-bottom-8 duration-500 flex flex-col z-[100]">
            <div className="bg-[#431407] p-5 sm:p-8 text-[#D4AF37] flex justify-between items-center shadow-2xl relative">
               <div className="flex items-center gap-3 z-10">
                  <span className="text-2xl sm:text-3xl">🕉️</span>
                  <div className="flex flex-col">
                    <span className="font-black uppercase tracking-widest text-sm sm:text-xl astrological-font leading-tight">Ask Help for Guruji</span>
                    <span className="text-[8px] sm:text-[10px] uppercase tracking-widest opacity-60">Sacred Conversation</span>
                  </div>
               </div>
               <button onClick={() => setIsChatOverlayOpen(false)} className="hover:opacity-70 text-2xl sm:text-3xl font-bold z-10">✕</button>
            </div>
            <div className="flex-1 overflow-hidden p-3 sm:p-6 bg-[#FDF5E6]/60">
               <LiveAstrologer />
            </div>
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
           <div className="relative mb-10">
             <div className="w-24 h-24 sm:w-48 sm:h-48 border-6 sm:border-[14px] border-[#D4AF37]/10 border-t-[#D4AF37] rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-6xl animate-pulse">☀️</div>
           </div>
           <p className="text-[#D4AF37] font-black uppercase tracking-[0.5em] sm:tracking-[1em] animate-pulse text-[11px] sm:text-xl ml-[0.5em] sm:ml-[1em] drop-shadow-lg">Calculating Heavens...</p>
        </div>
      )}
      
      <main>
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </main>

      <style>{`
        .parchment-bg { background: #FDF5E6; background-image: radial-gradient(circle at 50% 50%, #FDF5E6 0%, #F5E6D3 100%); position: relative; }
        .details-input { width: 100%; background: #ffffff !important; border: 2.5px solid #E2D1B3; border-radius: 1.25rem; padding: 1rem 1.5rem; color: #431407 !important; font-family: 'Lora', serif; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-size: 1rem; }
        .details-input:focus { outline: none; border-color: #431407; box-shadow: 0 0 20px rgba(67, 20, 7, 0.1); }
        .menu-button-parchment { background: #ffffff; border: 2.5px solid #E2D1B3; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(67, 20, 7, 0.05); text-align: center; }
        .astro-btn-maroon { width: 100%; font-weight: 900; color: #D4AF37 !important; text-transform: uppercase; letter-spacing: 0.3em; background: #431407 !important; border: 2.5px solid #D4AF37; transition: all 0.4s ease; }
        .astro-btn-maroon:hover:not(:disabled) { background: #5a1c0b !important; border-color: #f3d782; }
        
        .analysis-rich-text h3 { color: #431407; font-size: 1.85rem; sm:font-size: 3rem; font-family: 'Cinzel', serif; margin: 3.5rem 0 2rem; border-bottom: 4px solid #D4AF37; padding-bottom: 1rem; text-align: center; text-transform: uppercase; font-weight: 900; line-height: 1.2; }
        .analysis-rich-text h4 { color: #7C2D12; font-size: 1.4rem; sm:font-size: 2rem; font-family: 'Cinzel', serif; margin: 2.5rem 0 1.25rem; border-left: 10px sm:border-left-[15px] solid #431407; padding: 0.8rem 0 0.8rem 1.25rem; sm:padding: 1.25rem 0 1.25rem 2rem; font-weight: 800; background: linear-gradient(to right, rgba(67, 20, 7, 0.08), transparent); border-radius: 0 1.5rem 1.5rem 0; }
        .analysis-rich-text p { margin-bottom: 2rem; line-height: 1.9; sm:line-height: 2.5; font-size: 1rem; sm:font-size: 1.4rem; text-align: justify; color: #431407; font-weight: 500; }
        .analysis-rich-text li { margin-bottom: 1.75rem; font-size: 1rem; sm:font-size: 1.4rem; color: #431407; padding: 2rem 2.5rem; sm:padding: 3rem 4.5rem; background: #ffffff; border-radius: 1.75rem sm:border-radius: 3rem; border-left: 12px sm:border-left-[20px] solid #D4AF37; box-shadow: 0 12px 30px rgba(0,0,0,0.06); font-weight: 500; }
        
        .shadow-glow { box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }
        
        .scholar-view h3 { border-bottom-color: #431407; color: #431407; }
        .scholar-view li { border-left-color: #431407; background: #fffcf8; }
        .seeker-view h3 { color: #7C2D12; border-bottom-color: #D4AF37; }
        .seeker-view li { border-left-color: #D4AF37; background: #fffcfb; }
      `}</style>
    </div>
  );
};

export default App;
