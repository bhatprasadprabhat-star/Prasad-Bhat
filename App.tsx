
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stars, Sparkles, Moon, Sun, Compass, Heart, MessageSquare, HelpCircle, ChevronDown, User, Save, X } from 'lucide-react';
import { AppTab, Language, UserIntake, MatchingIntake, UserMode, PlanetPosition, CityData, OnboardingStep } from './types';
import SearchAssistant from './components/SearchAssistant';
import SouthIndianChart from './components/SouthIndianChart';
import Panchanga from './components/Panchanga';
import TimelineDashboard from './components/TimelineDashboard';
import DailyPanchangaWidget from './components/DailyPanchangaWidget';
import PrashnaEngine from './components/PrashnaEngine';
import MuhurthaLiveFeed from './components/MuhurthaLiveFeed';
import ShadbalaChart from './components/ShadbalaChart';
import SadvargaChart from './components/SadvargaChart';
import VedicRemedyGenerator from './components/VedicRemedyGenerator';
import BlogSection from './components/BlogSection';
import DailyWisdom from './components/DailyWisdom';
import UserProfile from './components/UserProfile';
import ContactAstrologer from './components/ContactAstrologer';
import CSRBanner from './components/CSRBanner';
import FeedbackModal from './components/FeedbackModal';
import DonateSection from './components/DonateSection';
import SuggestionBox from './components/SuggestionBox';
import GurujiChat from './components/GurujiChat';
import TimePicker from './components/TimePicker';
import { AshtakavargaTable, VimshottariTable, GrahaMaitriTable, BhavaPhala, BirthDetailsTable } from './components/AstroTables';
import { generateHoroscope, findMuhurtha, matchKundali, generateDailyForecastForRasi, generatePrashnaAnalysis, generateMuhurthaImage } from './services/gemini';
import CitySearch from './components/CitySearch';
import { RASIS, TRANSLATIONS, LANGUAGES, COLORS, HOURS, MINUTES, MUHURTA_TYPES, JYOTISH_QUOTES } from './constants';

const LoshuGrid = ({ grid, present }: { grid: number[], present: number[] }) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-[300px] mx-auto p-4 sm:p-6 bg-amber-50/50 rounded-3xl border-2 border-[#D4AF37]/30 shadow-xl">
      {grid.map((num, idx) => (
        <div 
          key={idx} 
          className={`aspect-square flex items-center justify-center text-xl sm:text-3xl font-black rounded-xl sm:rounded-2xl border-2 transition-all duration-500 ${
            present.includes(num) 
              ? 'bg-[#D4AF37] text-[#451a03] border-[#451a03] shadow-lg scale-105' 
              : 'bg-white/40 text-[#451a03]/20 border-[#D4AF37]/10'
          }`}
        >
          {num}
        </div>
      ))}
    </div>
  );
};

const MandalaBackground = React.memo(() => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {/* Deep Space Gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]"></div>
    
    {/* Nebula Glows */}
    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
    
    {/* Animated Stars */}
    <div className="absolute inset-0 opacity-30">
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{ 
            left: Math.random() * 100 + '%', 
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 5 + 's',
            opacity: Math.random() * 0.6 + 0.2,
            scale: Math.random() * 0.5 + 0.5
          }}
        />
      ))}
    </div>

    {/* Rotating Mandala */}
    <div className="absolute inset-0 flex items-center justify-center opacity-[0.08]">
      <motion.svg 
        viewBox="0 0 200 200" 
        className="w-[150vmax] sm:w-[180vmax] h-[150vmax] sm:h-[180vmax] text-[#D4AF37]"
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

      <div className="absolute inset-0 opacity-20 mix-blend-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#1e1b4b] blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#312e81] blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
  </div>
));

const FantasticLogo = React.memo(({ className = "" }: { className?: string }) => (
  <div className={`relative group cursor-default perspective-1000 ${className || "w-28 h-28 sm:w-48 md:w-64"}`}>
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
    <div className="absolute inset-8 sm:inset-12 md:inset-16 bg-gradient-to-tr from-[#D4AF37]/40 via-[#B8860B]/30 to-transparent rounded-full blur-[30px] sm:blur-[70px] transition-all duration-1000 animate-pulse"></div>
    <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 md:p-8">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_50px_rgba(212,175,55,0.7)]">
        <g className="animate-[pulse_4s_easeInOut_infinite]">
          {[...Array(48)].map((_, i) => (
            <path key={i} d="M50 5 L51.5 35 L48.5 35 Z" fill={i % 2 === 0 ? "#D4AF37" : "#B8860B"} transform={`rotate(${i * 7.5} 50 50)`} />
          ))}
        </g>
        <circle cx="50" cy="50" r="22" fill="#451a03" className="stroke-[#D4AF37] stroke-[1.5]" />
        <text x="50" y="55" fontSize="14" textAnchor="middle" fill="#D4AF37" className="astrological-font font-bold">ॐ</text>
      </svg>
    </div>
  </div>
));


const BirthSummary = ({ details, lang }: { details: any[], lang: Language }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const name = details.find(d => d.label?.toLowerCase()?.includes('name'))?.value || '';
  const date = details.find(d => d.label?.toLowerCase()?.includes('date'))?.value || '';
  const time = details.find(d => d.label?.toLowerCase()?.includes('time'))?.value || '';
  const nakshatra = details.find(d => d.label?.toLowerCase()?.includes('nakshatra'))?.value || '';

  return (
    <div className="mb-8 text-left space-y-3 p-6 bg-[#fdf2d0]/60 backdrop-blur-sm rounded-3xl border-2 border-[#5d4037]/20 shadow-inner max-w-2xl mx-auto">
      <div className="flex items-center justify-between border-b border-[#5d4037]/10 pb-2">
        <span className="text-xs font-black text-[#5d4037]/60 uppercase tracking-[0.2em]">{t.name || 'Name'} :</span>
        <span className="text-lg font-black text-[#5d4037]">{name}</span>
      </div>
      <div className="flex items-center justify-between border-b border-[#5d4037]/10 pb-2">
        <span className="text-xs font-black text-[#5d4037]/60 uppercase tracking-[0.2em]">{t.date || 'Date'} :</span>
        <span className="text-base font-bold text-[#5d4037]">{date} <span className="text-sm opacity-60 ml-2">{time}</span></span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-[#5d4037]/60 uppercase tracking-[0.2em]">{t.nakshatra || 'Nakshatra'} :</span>
        <span className="text-lg font-black text-[#5d4037]">{nakshatra}</span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('astro_logic_lang');
    return (saved as Language) || 'en';
  });
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(OnboardingStep.MODE_SELECT);
  const [mode, setMode] = useState<UserMode | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [tabHistory, setTabHistory] = useState<AppTab[]>([AppTab.DASHBOARD]);
  const [horoscopeState, setHoroscopeState] = useState<'INPUT' | 'MENU' | 'ANALYSIS' | 'RESULT'>('INPUT');
  const [currentSection, setCurrentSection] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [muhurthaImage, setMuhurthaImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<PlanetPosition[] | null>(null);
  const [structuredData, setStructuredData] = useState<any>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isChatOverlayOpen, setIsChatOverlayOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const lastSavedIntakeRef = useRef<string>(JSON.stringify({ 
    name: '', dob: '', tob: '', ampm: 'AM', pob: 'UDUPI,KAR,IND', gender: 'Male', lat: "13° 20' N", lon: "74° 45' E", tz: "+ 5:30"
  }));

  const [cache, setCache] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('astro_logic_cache_v2');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  
  useEffect(() => {
    try {
      // Limit cache size to avoid localStorage quota issues
      const keys = Object.keys(cache);
      if (keys.length > 20) {
        const limitedCache = Object.fromEntries(
          Object.entries(cache).slice(-20)
        );
        localStorage.setItem('astro_logic_cache_v2', JSON.stringify(limitedCache));
      } else {
        localStorage.setItem('astro_logic_cache_v2', JSON.stringify(cache));
      }
    } catch (e) {
      console.warn("Cache persistence failed", e);
    }
  }, [cache]);
  
  const [intake, setIntake] = useState<UserIntake & { lat: string, lon: string, tz: string }>(() => {
    const saved = localStorage.getItem('astro_user_intake');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        lastSavedIntakeRef.current = saved;
        return parsed;
      } catch (e) {
        console.error("Failed to parse saved intake", e);
      }
    }
    const now = new Date();
    const dob = now.toISOString().split('T')[0];
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const tob = `${hours.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const defaultIntake = { 
      name: '', dob, tob, ampm, pob: 'UDUPI,KAR,IND', gender: 'Male', lat: "13° 20' N", lon: "74° 45' E", tz: "+ 5:30"
    };
    lastSavedIntakeRef.current = JSON.stringify(defaultIntake);
    return defaultIntake;
  });

  useEffect(() => {
    const currentIntakeStr = JSON.stringify(intake);
    if (currentIntakeStr !== lastSavedIntakeRef.current) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [intake]);

  const [savedProfiles, setSavedProfiles] = useState<UserIntake[]>([]);
  const [prashnaInput, setPrashnaInput] = useState({ question: '', pob: 'UDUPI,KAR,IND', lat: '', lon: '', tz: '' });
  const [muhurtaInput, setMuhurtaInput] = useState(() => {
    const now = new Date();
    const dob = now.toISOString().split('T')[0];
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const tob = `${hours.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return { 
      event: '', 
      timeframe: '', 
      pob: 'UDUPI,KAR,IND', 
      lat: "13° 20' N", 
      lon: "74° 45' E", 
      tz: "+ 5:30",
      performerName: '',
      performerDob: dob,
      performerTob: tob,
      performerAmpm: ampm,
      performerPob: 'UDUPI,KAR,IND',
      performerLat: "13° 20' N",
      performerLon: "74° 45' E",
      performerTz: "+ 5:30"
    };
  });
  const [muhurtaSearch, setMuhurtaSearch] = useState('');

  const [matchingIntake, setMatchingIntake] = useState<MatchingIntake>(() => {
    const now = new Date();
    const dob = now.toISOString().split('T')[0];
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const tob = `${hours.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return {
      person1: { name: '', dob, tob, ampm, pob: '', gender: 'Male' },
      person2: { name: '', dob, tob, ampm, pob: '', gender: 'Female' }
    };
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  
  // Ensure seeker/scholar keys exist with defaults
  if (!t.seeker) t.seeker = lang === 'kn' ? 'ಸೀಕರ್' : lang === 'hi' ? 'सीकर' : 'Seeker';
  if (!t.scholar) t.scholar = lang === 'kn' ? 'ಸ್ಕಾಲರ್' : lang === 'hi' ? 'स्कॉलर' : 'Scholar';
  if (!t.seeker_desc) t.seeker_desc = TRANSLATIONS.en.seeker_desc;
  if (!t.scholar_desc) t.scholar_desc = TRANSLATIONS.en.scholar_desc;

  useEffect(() => {
    const saved = localStorage.getItem('astro_logic_profiles_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setSavedProfiles(parsed);
      } catch (e) {
        console.error("Failed to parse saved profiles", e);
      }
    }
  }, []);

  const handleSaveProfile = () => {
    if (!intake.name) {
      alert("Please enter a name to save.");
      return;
    }
    const updated = [intake, ...savedProfiles.filter(p => p.name !== intake.name)].slice(0, 5);
    setSavedProfiles(updated);
    localStorage.setItem('astro_logic_profiles_v4', JSON.stringify(updated));
    localStorage.setItem('astro_user_intake', JSON.stringify(intake));
    lastSavedIntakeRef.current = JSON.stringify(intake);
    setIsDirty(false);
    alert("Profile Saved.");
  };

  const handleSaveToProfiles = (p: UserIntake) => {
    if (!p.name) {
      alert("Please enter a name to save.");
      return;
    }
    const updated = [p, ...savedProfiles.filter(sp => sp.name !== p.name)].slice(0, 10);
    setSavedProfiles(updated);
    localStorage.setItem('astro_logic_profiles_v4', JSON.stringify(updated));
    alert(`Profile for ${p.name} saved.`);
  };

  const saveToHistory = (type: string, summary: string) => {
    const history = JSON.parse(localStorage.getItem('astro_readings_history') || '[]');
    const newEntry = {
      id: Date.now().toString(),
      type,
      date: new Date().toLocaleDateString(),
      summary
    };
    const updatedHistory = [newEntry, ...history].slice(0, 10);
    localStorage.setItem('astro_readings_history', JSON.stringify(updatedHistory));
  };

  const changeTab = (newTab: AppTab) => {
    if (newTab !== activeTab) {
      setTabHistory(prev => [...prev, newTab]);
      setActiveTab(newTab);
      setAnalysisResult(null);
      setHoroscopeState('INPUT');
    }
  };

  const handleAction = async (type: string, payload?: any) => {
    if (!mode) return;

    // Validation for place selection
    if (type === 'HOROSCOPE' || type === 'DAILY' || type === 'MUHURTA' || type === 'MATCHING' || type === 'LIFE_PARTNER' || type === 'NUMEROLOGY') {
      const checkIntake = type === 'MATCHING' ? matchingIntake.person1 : intake;
      if (!checkIntake.lat || !checkIntake.lon) {
        setError(t.select_city_warning || 'Please select a city from the list for accurate calculations.');
        return;
      }
      if (type === 'MATCHING' && (!matchingIntake.person2.lat || !matchingIntake.person2.lon)) {
        setError(t.select_city_warning || 'Please select a city from the list for accurate calculations.');
        return;
      }
    }

    // Determine display section name for consistent state
    let sectionName = payload || type;
    if (type === 'LIFE_PARTNER') sectionName = "Life Partner Analysis";
    if (type === 'DAILY') sectionName = payload + " Forecast";
    if (type === 'MATCHING') sectionName = t.matching;
    if (type === 'PRASHNA') sectionName = 'Prashna Analysis';
    
    const cacheKey = `${type}_${payload}_${lang}_${mode}_${JSON.stringify(intake)}_${JSON.stringify(matchingIntake)}_${JSON.stringify(prashnaInput)}`;
    
    if (cache[cacheKey]) {
      console.log(`%c [Cache Hit] Retrieving ${type} analysis from celestial memory...`, 'color: #D4AF37; font-weight: bold;');
      const res = cache[cacheKey];
      setAnalysisResult(res);
      extractChartData(res);
      if (type === 'HOROSCOPE' || type === 'DAILY' || type === 'MUHURTA' || type === 'LIFE_PARTNER') {
        setHoroscopeState('ANALYSIS');
      }
      setCurrentSection(sectionName);
      return;
    }

    setIsProcessing(true);
    setAnalysisResult(null);
    setStructuredData(null);
    setMuhurthaImage(null);
    setError(null);
    setChartData(null);
    try {
      let res = '';
      setCurrentSection(sectionName);

      if (type === 'HOROSCOPE') {
        res = await generateHoroscope({ ...intake, tob: `${intake.tob} ${intake.ampm}` }, payload, lang, mode);
        setHoroscopeState('ANALYSIS');
      } else if (type === 'NUMEROLOGY') {
        res = await generateHoroscope({ ...intake, tob: `${intake.tob} ${intake.ampm}` }, "Numerology Analysis", lang, mode);
        setHoroscopeState('ANALYSIS');
      } else if (type === 'LIFE_PARTNER') {
        const seedStr = `${intake.dob}${intake.tob}${intake.ampm}${intake.pob}`;
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
          hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
          hash |= 0;
        }
        res = await generateHoroscope({ ...intake, tob: `${intake.tob} ${intake.ampm}` }, "Life Partner", lang, mode, Math.abs(hash));
        setHoroscopeState('ANALYSIS');
      } else if (type === 'DAILY') {
        res = await generateDailyForecastForRasi(payload, lang, mode);
        setHoroscopeState('ANALYSIS');
      } else if (type === 'MATCHING') {
        res = await matchKundali(matchingIntake, lang, mode);
      } else if (type === 'MUHURTA') {
        const performerDetails = muhurtaInput.performerName ? {
          name: muhurtaInput.performerName,
          dob: muhurtaInput.performerDob,
          tob: `${muhurtaInput.performerTob} ${muhurtaInput.performerAmpm}`,
          pob: muhurtaInput.performerPob,
          lat: muhurtaInput.performerLat,
          lon: muhurtaInput.performerLon,
          tz: muhurtaInput.performerTz
        } : undefined;
        res = await findMuhurtha(payload, muhurtaInput.timeframe, lang, mode, muhurtaInput.pob, muhurtaInput.lat, muhurtaInput.lon, muhurtaInput.tz, performerDetails);
        setHoroscopeState('ANALYSIS');
        
        // Generate image for Muhurta
        try {
          const img = await generateMuhurthaImage(payload, muhurtaInput.pob);
          if (img) setMuhurthaImage(img);
        } catch (err) {
          console.error("Failed to generate muhurtha image", err);
        }
      } else if (type === 'PRASHNA') {
        res = await generatePrashnaAnalysis(prashnaInput.question, prashnaInput.pob, lang, mode, prashnaInput.lat, prashnaInput.lon, prashnaInput.tz);
      }
      
      if (!res) throw new Error("The stars are silent. Please try again.");
      
      setAnalysisResult(res);
      saveToHistory(type, `Celestial analysis for ${type === 'MATCHING' ? matchingIntake.person1.name + ' & ' + matchingIntake.person2.name : intake.name}`);
      extractChartData(res);
      setCache(prev => ({ ...prev, [cacheKey]: res }));
    } catch (err: any) { 
      console.error(err); 
      setError(err.message || "Celestial connection failed.");
      setHoroscopeState('INPUT');
    } finally { 
      setIsProcessing(false); 
    }
  };

  const extractChartData = (html: string) => {
    if (!html) return;
    try {
      // Find all application/json script tags, with or without ID
      const regex = /<script type="application\/json"(?: id=".*?")?>([\s\S]*?)<\/script>/g;
      let match;
      let foundData = null;
      let foundLoshu = null;

      while ((match = regex.exec(html)) !== null) {
        if (match[1]) {
          try {
            const data = JSON.parse(match[1]);
            console.log("Found structured data:", data.type);
            if (data.type === 'loshu_grid') {
              foundLoshu = data;
            } else {
              foundData = data;
            }
          } catch (e) {
            console.error("Failed to parse JSON from script tag", e);
          }
        }
      }

      const dataToUse = foundLoshu || foundData;
      if (dataToUse) {
        setStructuredData(dataToUse);
        let finalChartData = null;
        if (Array.isArray(dataToUse)) {
          finalChartData = dataToUse;
        } else if (dataToUse && typeof dataToUse === 'object') {
          finalChartData = dataToUse.planets || dataToUse.data || dataToUse.chart || null;
        }
        setChartData(Array.isArray(finalChartData) ? finalChartData : null);
      } else {
        // Fallback to old id-based method if regex failed
        const oldMatch = html.match(/<script type="application\/json" id="chart-data">([\s\S]*?)<\/script>/);
        if (oldMatch && oldMatch[1]) {
          try {
            const data = JSON.parse(oldMatch[1]);
            setStructuredData(data);
            setChartData(Array.isArray(data) ? data : (data.planets || null));
          } catch (e) {
            console.error("Failed to parse old-style chart data", e);
          }
        }
      }
    } catch (e) {
      console.error("Error in extractChartData", e);
    }
  };

  const goBack = () => {
    setError(null);
    if (analysisResult) { 
      setAnalysisResult(null); 
      setMuhurthaImage(null);
      // Ensure we go back to the correct state within the tab
      if (activeTab === AppTab.HOROSCOPE) {
        setHoroscopeState('MENU');
      } else {
        setHoroscopeState('INPUT');
      }
      return; 
    }
    if (horoscopeState === 'MENU') { setHoroscopeState('INPUT'); return; }
    
    if (tabHistory.length > 1) {
      const newHistory = [...tabHistory];
      newHistory.pop(); // remove current
      const prevTab = newHistory[newHistory.length - 1];
      setTabHistory(newHistory);
      setActiveTab(prevTab);
      setHoroscopeState('INPUT');
    } else {
      setActiveTab(AppTab.DASHBOARD);
      setHoroscopeState('INPUT');
    }
  };

  const ProfileButton = () => (
    <div className="fixed top-4 left-4 z-[100] flex items-center gap-2">
      <button 
        onClick={() => setIsProfileOpen(true)}
        className="w-10 h-10 sm:w-14 sm:h-14 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] border-2 border-[#451a03] hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      >
        {intake.name ? (
          <span className="text-[#451a03] font-black text-sm sm:text-xl uppercase">{intake.name[0]}</span>
        ) : (
          <User className="w-5 h-5 sm:w-7 sm:h-7 text-[#451a03]" />
        )}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
      
      <AnimatePresence>
        {isDirty && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={handleSaveProfile}
            className="bg-[#451a03] text-[#D4AF37] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border border-[#D4AF37]/30 flex items-center gap-2 hover:bg-[#5d4037] transition-all"
          >
            <span className="animate-pulse">💾</span> {t.save_info || 'Save Details'}
          </motion.button>
        )}
      </AnimatePresence>

      <button 
        onClick={() => {
          const newMode = mode === 'SEEKER' ? 'SCHOLAR' : 'SEEKER';
          setMode(newMode);
          localStorage.setItem('astro_logic_mode_v1', newMode);
        }}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#312e81]/80 backdrop-blur-md hover:bg-[#312e81] border border-[#D4AF37]/30 rounded-full transition-all group shadow-lg"
      >
        <Sparkles size={12} className={`text-[#D4AF37] ${mode === 'SCHOLAR' ? 'animate-pulse' : ''}`} />
        <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">{mode === 'SCHOLAR' ? (t.scholar || 'Scholar') : (t.seeker || 'Seeker')}</span>
      </button>
    </div>
  );

  const renderHoroscopeIntake = () => (
    <div className="min-h-screen parchment-bg flex flex-col animate-in slide-in-from-right duration-500 overflow-x-hidden">
      <MandalaBackground />
      <header className="bg-gradient-to-b from-[#312e81] to-[#1e1b4b] p-4 sm:p-6 flex items-center shadow-xl sticky top-0 z-20 border-b border-[#D4AF37]/30">
        <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
           <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="ml-3">
          <h2 className="text-lg sm:text-2xl font-black text-[#D4AF37] tracking-widest uppercase astrological-font leading-tight">{t.sacred_intake}</h2>
          <p className="text-[9px] text-white/50 uppercase font-black tracking-widest">{mode === 'SCHOLAR' ? (t.siddhantic_precision || 'Siddhantic precision') : (t.personal_guidance || 'Personal guidance')}</p>
        </div>
      </header>
      <div className="flex-1 p-4 sm:p-8 space-y-8 max-w-3xl mx-auto w-full overflow-y-auto pb-48 z-10">
        <div className="grid gap-6 p-6 sm:p-10 bg-amber-50/60 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-[#D4AF37]/30 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#312e81] uppercase tracking-widest ml-1">{t.name_of_soul}</label>
            <input value={intake.name} onChange={e => setIntake({...intake, name: e.target.value})} placeholder={t.enter_full_name} className="details-input" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#312e81] uppercase tracking-widest ml-1">{t.birth_date}</label>
              <input type="date" value={intake.dob} onChange={e => setIntake({...intake, dob: e.target.value})} className="details-input font-bold" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#312e81] uppercase tracking-widest ml-1">{t.birth_time}</label>
              <TimePicker time={intake.tob} ampm={intake.ampm || 'AM'} onChange={(t, a) => setIntake({...intake, tob: t, ampm: a})} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#312e81] uppercase tracking-widest ml-1">{t.birth_location}</label>
            <CitySearch value={intake.pob} onChange={v => setIntake({...intake, pob: v.pincode ? `${v.name} (${v.pincode})` : v.name, lat: v.lat, lon: v.lon, tz: v.tz, pincode: v.pincode})} placeholder={t.search_city_placeholder} />
            {!intake.lat && intake.pob && (
              <p className="text-[9px] text-red-600 font-bold animate-pulse ml-1">{t.select_city_warning}</p>
            )}
          </div>
            {intake.lat && (
              <div className="flex gap-4 text-[9px] font-black text-[#4338ca] uppercase tracking-widest px-2">
                <span>{t.latitude || 'Lat'}: {intake.lat}</span>
                <span>{t.longitude || 'Lon'}: {intake.lon}</span>
                <span>{t.timezone || 'TZ'}: {intake.tz}</span>
              </div>
            )}
          <div className="pt-6">
            <button 
              onClick={() => setHoroscopeState('MENU')}
              className="w-full py-6 bg-gradient-to-r from-[#312e81] to-[#1e1b4b] text-[#D4AF37] rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all border-2 border-[#D4AF37]/30"
            >
              Next: Choose Analysis ➔
            </button>
          </div>
        </div>
        
        {savedProfiles.length > 0 && (
          <div className="p-4 sm:p-6 bg-white/50 border border-[#D4AF37]/20 rounded-3xl space-y-3">
            <h3 className="text-[9px] font-black uppercase text-[#312e81] tracking-widest text-center opacity-70">{t.saved_profiles_title}</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {savedProfiles.map((p, i) => (
                <button key={i} onClick={() => setIntake(p as any)} className="px-4 py-2 bg-white rounded-xl text-[11px] font-bold text-[#312e81] border border-[#D4AF37]/20 hover:border-[#D4AF37] shadow-sm transition-all active:scale-95">
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="bg-[#312e81] fixed bottom-0 left-0 right-0 z-[60] flex shadow-[0_-10px_30px_rgba(0,0,0,0.5)] border-t border-[#D4AF37]/50">
        <button onClick={handleSaveProfile} className="flex-1 py-5 sm:py-8 bg-transparent text-[#D4AF37] uppercase text-[10px] font-black tracking-widest border-r border-white/10 active:bg-white/10">💾 {t.save_info}</button>
        <button onClick={() => setHoroscopeState('MENU')} className="flex-[2] py-5 sm:py-8 bg-gradient-to-r from-amber-600 to-amber-500 text-[#312e81] uppercase text-[11px] sm:text-xs font-black tracking-[0.2em] active:brightness-90 transition-all">{t.next_page} ➔</button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (analysisResult) {
      if (analysisResult.trim() === '') {
        return (
          <div className="min-h-screen flex items-center justify-center parchment-bg">
            <div className="text-center p-8 bg-amber-50/60 rounded-3xl border-2 border-[#D4AF37]/30 shadow-xl">
              <p className="text-[#312e81] font-bold mb-4">{t.stars_obscured || 'The stars are obscured by clouds. Please try again.'}</p>
              <button onClick={goBack} className="astro-btn-maroon px-6 py-2 rounded-full">{t.go_back || 'Go Back'}</button>
            </div>
          </div>
        );
      }
      return (
        <motion.div 
          key="analysis"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
        >
          <MandalaBackground />
          <header className="bg-gradient-to-b from-[#312e81] to-[#1e1b4b] p-4 sm:p-6 flex items-center justify-between shadow-2xl sticky top-0 z-30 border-b border-[#D4AF37]/40">
            <div className="flex items-center">
              <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="ml-3 text-lg sm:text-xl font-black text-[#D4AF37] truncate astrological-font uppercase tracking-widest">{currentSection}</h2>
            </div>
            <button onClick={() => { setAnalysisResult(null); setActiveTab(AppTab.DASHBOARD); }} className="p-2 text-[#D4AF37] hover:bg-white/10 rounded-full transition-all">
              <Compass className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </header>
          <div className="flex-1 p-4 sm:p-10 md:p-16 overflow-y-auto max-w-6xl mx-auto w-full pb-48 z-10">
            {error && (
              <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl text-red-800 text-center font-bold">
                <span className="text-2xl block mb-2">⚠️</span>
                {error}
                <button onClick={() => setError(null)} className="block mx-auto mt-4 text-sm underline">{t.dismiss || 'Dismiss'}</button>
              </div>
            )}
            {structuredData && structuredData.type === 'birth_details' && structuredData.details && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <h3 className="text-center text-[#92400e] font-black uppercase tracking-[0.3em] mb-6 text-sm sm:text-lg">
                  {currentSection === 'menu_basic_details' ? (t.menu_basic_details || 'Basic Birth Details') : (t.menu_details || 'Jataka Birth Details')}
                </h3>
                <BirthDetailsTable details={structuredData.details} />
              </motion.div>
            )}

            {chartData && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                {structuredData && structuredData.type === 'birth_details' && structuredData.details && (currentSection === 'menu_basic_details' || currentSection === 'menu_details') && (!(mode === 'SCHOLAR' && currentSection === 'menu_details')) && (
                  <BirthSummary details={structuredData.details} lang={lang} />
                )}
                {(!(mode === 'SCHOLAR' && (currentSection === 'menu_details' || currentSection === 'menu_navamsha' || currentSection === 'menu_bhava_analysis' || currentSection === 'menu_shadvarga'))) && (
                  <>
                    <h3 className="text-center text-[#92400e] font-black uppercase tracking-[0.3em] mb-6 text-sm sm:text-lg">{t.celestial_map}</h3>
                    <SouthIndianChart data={chartData} lang={lang} title={t.menu_rasi || 'Rasi Kundli'} />
                  </>
                )}
              </motion.div>
            )}

            {structuredData && structuredData.type === 'navamsha' && structuredData.planets && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <h3 className="text-center text-[#92400e] font-black uppercase tracking-[0.3em] mb-6 text-sm sm:text-lg">{t.menu_navamsha || 'Navamsha D9'}</h3>
                <SouthIndianChart data={structuredData.planets} lang={lang} title={t.menu_navamsha || 'Navamsha D9'} />
              </motion.div>
            )}

            {structuredData && structuredData.type === 'ashtakavarga' && structuredData.table && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <h3 className="text-center text-[#312e81] font-black uppercase tracking-[0.3em] mb-6 text-sm sm:text-lg">{t.ashtakavarga || 'Ashtakavarga'}</h3>
                <AshtakavargaTable data={structuredData.table} />
              </motion.div>
            )}

            {(structuredData && (structuredData.type === 'vimshottari' || structuredData.type === 'dasha_data') && structuredData.dashas) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <h3 className="text-center text-[#92400e] font-black uppercase tracking-[0.3em] mb-6 text-sm sm:text-lg">{t.vimshottari || 'Vimshottari Dasha'}</h3>
                <VimshottariTable dashas={structuredData.dashas} />
              </motion.div>
            )}

            {structuredData && structuredData.type === 'grahamaitri' && structuredData.matrix && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <h3 className="text-center text-[#92400e] font-black uppercase tracking-[0.3em] mb-6 text-sm sm:text-lg">{t.menu_maitri || 'Panchadha Graha Maitri'}</h3>
                <GrahaMaitriTable matrix={structuredData.matrix} />
              </motion.div>
            )}

            {structuredData && structuredData.type === 'bhavaphala' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10 space-y-10"
              >
                {structuredData.planets && (
                  <div className="mb-10">
                    <h3 className="text-center text-[#92400e] font-black uppercase tracking-[0.3em] mb-6 text-sm sm:text-lg">{t.menu_bhava || 'Bhava Chalit'}</h3>
                    <SouthIndianChart data={structuredData.planets} lang={lang} title={t.menu_bhava || 'Bhava Chalit'} />
                  </div>
                )}
                {structuredData.houses && (
                  <div className="mb-10">
                    <h3 className="text-center text-[#92400e] font-black uppercase tracking-[0.3em] mb-6 text-sm sm:text-lg">{t.menu_bhava_analysis || '12 Houses Analysis'}</h3>
                    <BhavaPhala houses={structuredData.houses} />
                  </div>
                )}
              </motion.div>
            )}

            {structuredData && structuredData.type === 'shadvarga' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10 space-y-12"
              >
                <SadvargaChart vargas={structuredData.vargas} lords={structuredData.lords} lang={lang} />
              </motion.div>
            )}

            {structuredData && structuredData.type === 'shadbala' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10 space-y-12"
              >
                <ShadbalaChart lang={lang} shadbalaData={structuredData.shadbala} />
              </motion.div>
            )}

            {activeTab === AppTab.MUHURTHA && muhurthaImage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-10 overflow-hidden rounded-[2rem] sm:rounded-[3rem] border-4 border-[#D4AF37]/30 shadow-2xl"
              >
                <img 
                  src={muhurthaImage} 
                  alt="Muhurtha Ritual" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            )}

            {structuredData && structuredData.type === 'loshu_grid' && structuredData.grid && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <h3 className="text-center text-[#92400e] font-black uppercase tracking-[0.3em] mb-6 text-sm sm:text-lg">Loshu Grid</h3>
                <LoshuGrid grid={structuredData.grid} present={structuredData.present || []} />
              </motion.div>
            )}


            {(!(mode === 'SCHOLAR' && (currentSection === 'menu_details' || currentSection === 'menu_navamsha'))) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`analysis-rich-text detailed-view p-4 sm:p-12 md:p-16 bg-white/95 border-2 border-[#D4AF37]/20 shadow-2xl rounded-[1.5rem] sm:rounded-[3rem] overflow-x-auto ${mode === 'SCHOLAR' ? 'scholar-view' : 'seeker-view'}`} 
                dangerouslySetInnerHTML={{ __html: analysisResult }} 
              />
            )}

            {mode === 'SEEKER' && (
              <div className="mt-12 p-8 sm:p-12 bg-white/40 border-4 border-[#D4AF37]/20 rounded-[2rem] sm:rounded-[3rem] text-center">
                <p className="text-xl sm:text-4xl font-black text-[#312e81] uppercase tracking-tighter leading-tight drop-shadow-sm">
                  {t.disclaimer || 'Astrological predictions are based on planetary calculations and indicate possibilities, not guaranteed outcomes.'}
                </p>
              </div>
            )}

            <div className="mt-12 text-center space-y-8">
              {/* Support features removed */}
            </div>
          </div>
        </motion.div>
      );
    }
    switch(activeTab) {
      case AppTab.DASHBOARD:
        return (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`min-h-screen flex flex-col overflow-x-hidden relative ${mode === 'SCHOLAR' ? 'scholar-theme' : 'seeker-theme'}`}
          >
            <MandalaBackground />
            <div className={`fixed inset-0 pointer-events-none z-0 opacity-20 ${mode === 'SCHOLAR' ? 'bg-[#0f172a]' : 'bg-[#fff7ed]'}`}></div>
            {error && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[70] w-[90%] max-w-md p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800 text-center font-bold shadow-2xl animate-in slide-in-from-top-4">
                {error}
                <button onClick={() => setError(null)} className="ml-4 text-xs underline">✕</button>
              </div>
            )}
            <nav className="w-full px-4 sm:px-8 py-5 sm:py-10 flex justify-between items-center z-20">
              <div className="flex items-center gap-3">
                <div className="flex flex-col -gap-1">
                  <span className="text-lg sm:text-4xl font-black text-[#312e81] tracking-tighter uppercase astrological-font leading-none">{t.brand_name || 'ASTRO LOGIC'}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] sm:text-[11px] font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded-full ${mode === 'SCHOLAR' ? 'bg-[#D4AF37] text-[#312e81]' : 'bg-[#312e81] text-[#D4AF37]'}`}>
                      {mode === 'SCHOLAR' ? (t.siddhantic_precision || 'Scholar Section') : (t.personal_guidance || 'Seeker Section')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <select 
                    value={lang} 
                    onChange={(e) => setLang(e.target.value as Language)} 
                    className="bg-white/50 backdrop-blur-md border-2 border-[#D4AF37]/40 text-[#312e81] text-[10px] sm:text-[12px] font-black rounded-full px-4 py-2 appearance-none cursor-pointer shadow-md tracking-widest hover:border-[#D4AF37] transition-all outline-none"
                  >
                    {LANGUAGES.map(l => (
                      <option key={l.code} value={l.code} className="bg-white text-[#312e81] font-bold">{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </nav>

            {/* Planetary Transit Ticker */}
            <div className="w-full bg-black/5 backdrop-blur-sm border-y border-[#D4AF37]/10 py-2 overflow-hidden mb-8 z-10">
              <motion.div 
                animate={{ x: ["100%", "-100%"] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-12 whitespace-nowrap"
              >
                {[
                  { p: t.planet_sun || 'Sun', r: t.rasi_kumbha || 'Kumbha', d: '18°' },
                  { p: t.planet_moon || 'Moon', r: t.rasi_kanya || 'Kanya', d: '04°' },
                  { p: t.planet_mars || 'Mars', r: t.rasi_mithuna || 'Mithuna', d: '22°' },
                  { p: t.planet_jupiter || 'Jupiter', r: t.rasi_mesha || 'Mesha', d: '12°' },
                  { p: t.planet_saturn || 'Saturn', r: t.rasi_kumbha || 'Kumbha', d: '09°' },
                  { p: t.planet_venus || 'Venus', r: t.rasi_meena || 'Meena', d: '27°' }
                ].map((tr, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">{tr.p}</span>
                    <span className="text-[10px] font-bold text-[#312e81]/60 uppercase tracking-widest">{t.planetary_transit_in || 'in'}</span>
                    <span className="text-[10px] font-black text-[#312e81] uppercase tracking-widest">{tr.r}</span>
                    <span className="text-[10px] font-bold text-[#D4AF37]">{tr.d}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <section className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-16 text-center max-w-7xl mx-auto w-full relative z-10">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-12 sm:mb-20 scale-75 sm:scale-100"
              >
                <FantasticLogo />
              </motion.div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-7xl md:text-9xl font-black text-[#D4AF37] mb-4 sm:mb-8 tracking-tighter astrological-font leading-tight drop-shadow-lg"
              >
                {t.brand_name || 'Astro Logic'}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-2xl md:text-3xl font-serif italic text-[#4338ca] max-w-4xl mx-auto opacity-95 mb-10 sm:mb-20 leading-relaxed px-4 italic"
              >
                "{t.tagline}"
              </motion.p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full px-2 mb-12">
                {[
                  { id: AppTab.HOROSCOPE, label: t.horoscope, icon: '📜', desc: mode === 'SCHOLAR' ? (t.shastriya || 'Shastriya') : (t.life_path || 'Life Path') },
                  { id: AppTab.DAILY_PREDICTION, label: t.daily, icon: '📅', desc: mode === 'SCHOLAR' ? (t.timeline || 'Timeline') : (t.daily_title || 'Daily') },
                  { id: AppTab.PANCHANGA, label: t.panchanga_title, icon: '🕉️', desc: mode === 'SCHOLAR' ? (t.siddhantic || 'Siddhantic') : (t.today_panchanga || 'Today') },
                  { id: AppTab.TIMELINE, label: t.timeline_title, icon: '📈', desc: mode === 'SCHOLAR' ? (t.life_phase || 'Life Phase') : (t.life_path || 'Progress') },
                  { id: AppTab.MATCHING, label: t.matching, icon: '💑', desc: mode === 'SCHOLAR' ? (t.matching_title || 'Matching') : (t.matching || 'Love') },
                  { id: AppTab.PRASHNA, label: lang === 'kn' ? 'ಪ್ರಶ್ನ ಶಾಸ್ತ್ರ' : 'Prashna', icon: '❓', desc: 'Instant Oracle' },
                  { id: AppTab.LIFE_PARTNER, label: t.life_partner || 'Life Partner', icon: '💍', desc: 'Possible Traits' },
                  { id: AppTab.MUHURTHA, label: t.muhurta, icon: '⏰', desc: mode === 'SCHOLAR' ? (t.muhurta_title || 'Muhurta') : (t.muhurta || 'Auspicious') },
                  { id: AppTab.NUMEROLOGY, label: t.numerology || 'Numerology', icon: '🔢', desc: 'Power of Numbers' },
                  { id: AppTab.BLOG, label: lang === 'kn' ? 'ಜ್ಞಾನ ಭಂಡಾರ' : lang === 'tcy' ? 'ಜ್ಞಾನದ ಬಂಡಾರ' : 'Blog', icon: '📚', desc: 'Siddhanta & Hora' }
                ].map((item, idx) => (
                  <motion.button 
                    key={item.id} 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    onClick={() => changeTab(item.id)} 
                    className="group relative bg-amber-50/40 border-2 border-[#D4AF37]/30 rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-8 transition-all duration-300 hover:bg-amber-50/60 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col items-center gap-2 sm:gap-4 shadow-xl backdrop-blur-md overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-4xl sm:text-6xl group-hover:scale-110 group-hover:rotate-6 transition-all drop-shadow-md">{item.icon}</span>
                    <div className="space-y-0.5">
                      <h3 className="text-[10px] sm:text-sm md:text-lg font-black uppercase tracking-wider text-[#312e81]">{item.label}</h3>
                      <p className="text-[8px] sm:text-[10px] text-[#312e81]/50 uppercase font-black tracking-widest">{item.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="w-full max-w-6xl mx-auto px-4 space-y-12 mb-20">
                <DailyWisdom lang={lang} />

                {mode === 'SCHOLAR' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 border-2 border-[#D4AF37]/30 rounded-[2rem] bg-black/20 backdrop-blur-md text-center space-y-4"
                  >
                    <h3 className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-sm">Classical Source Authority</h3>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-8 opacity-70">
                      {['Brihat Parashara Hora Shastra', 'Brihat Jataka', 'Prashna Marga', 'Phaladeepika', 'Jataka Parijata', 'Saravali'].map(book => (
                        <span key={book} className="text-[#D4AF37] text-[10px] sm:text-xs font-serif italic border-b border-[#D4AF37]/20 pb-1">{book}</span>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <MuhurthaLiveFeed lang={lang} />
                  {mode !== 'SCHOLAR' && <VedicRemedyGenerator lang={lang} />}
                </div>
                
                <CSRBanner lang={lang} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-full">
                    <ContactAstrologer 
                      lang={lang} 
                      onDonate={() => setIsDonateOpen(true)} 
                      onFeedback={() => setIsFeedbackOpen(true)} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                    {/* Small Eye-Catching Donate Option */}
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsDonateOpen(true)}
                      className="bg-gradient-to-br from-[#312e81] to-[#1e1b4b] border-4 border-[#D4AF37]/30 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xl relative overflow-hidden group h-full"
                    >
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl group-hover:bg-[#D4AF37]/20 transition-all" />
                      <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center border border-[#D4AF37]/30 group-hover:rotate-12 transition-transform">
                        <Heart className="text-[#D4AF37] fill-current animate-pulse" size={32} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-[#D4AF37] uppercase tracking-tight astrological-font leading-none">
                          {t.donate_support || 'Support'}
                        </h3>
                        <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">
                          {t.scan_to_donate || 'Tap to Offer ➔'}
                        </p>
                      </div>
                    </motion.button>

                    {/* Small Eye-Catching Feedback Option */}
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsFeedbackOpen(true)}
                      className="bg-gradient-to-br from-[#451a03] to-[#7c2d12] border-4 border-[#D4AF37]/30 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xl relative overflow-hidden group h-full"
                    >
                      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl group-hover:bg-[#D4AF37]/20 transition-all" />
                      <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center border border-[#D4AF37]/30 group-hover:-rotate-12 transition-transform">
                        <MessageSquare className="text-[#D4AF37]" size={32} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-[#D4AF37] uppercase tracking-tight astrological-font leading-none">
                          {t.feedback || 'Feedback'}
                        </h3>
                        <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">
                          Share Wisdom ➔
                        </p>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Feedback and Suggestions Section */}
                <div className="mt-24 mb-16 space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-black text-[#451a03] uppercase tracking-[0.3em] astrological-font drop-shadow-sm">
                      {t.feedback || "Feedback and Suggestions"}
                    </h2>
                    <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full opacity-50" />
                  </div>

                  <div className="max-w-2xl mx-auto">
                    {/* Suggestion Box */}
                    <SuggestionBox lang={lang} />
                  </div>
                </div>
              </div>

              {/* Support features removed */}
            </section>
            
            <div className="flex justify-center gap-8 mb-8 z-10">
              <button 
                onClick={() => setIsDonateOpen(true)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#312e81]/60 hover:text-[#312e81] transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Heart size={14} className="text-red-500 fill-current" />
                </div>
                {t.donate_support}
              </button>
              <button 
                onClick={() => setIsFeedbackOpen(true)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#312e81]/60 hover:text-[#312e81] transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <MessageSquare size={14} className="text-blue-500" />
                </div>
                {t.feedback}
              </button>
            </div>
            
            <footer className="w-full py-8 text-center text-[8px] sm:text-[10px] text-[#312e81]/40 font-black uppercase tracking-[0.8em] z-10 px-4">{t.footer_text}</footer>
          </motion.div>
        );
      case AppTab.HOROSCOPE:
        return horoscopeState === 'MENU' ? (
          <motion.div 
            key="horoscope-menu"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
          >
            <MandalaBackground />
            <header className="bg-gradient-to-b from-[#312e81] to-[#1e1b4b] p-4 sm:p-7 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[#D4AF37]/40">
              <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="ml-3 text-lg sm:text-2xl font-black text-[#D4AF37] uppercase astrological-font tracking-widest">{t.analysis_tab_title || 'Analysis'}</h2>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 p-6 sm:p-12 flex-1 overflow-y-auto max-w-6xl mx-auto w-full pb-48 z-10">
              {(mode === 'SEEKER' ? [
                { id: 'menu_basic_details', label: t.menu_basic_details || 'Basic Birth Details' },
                { id: 'menu_yoga', label: t.menu_yoga || 'Yoga Analysis' },
                { id: 'menu_career', label: t.menu_career || 'Career' },
                { id: 'menu_health', label: t.menu_health || 'Health' },
                { id: 'menu_money', label: t.menu_money || 'Money' },
                { id: 'menu_transit', label: t.menu_transit || 'Transit' },
                { id: 'menu_dasha_effect', label: t.menu_dasha_effect || 'Dasha Effect' },
                { id: 'menu_sade_sati', label: t.menu_sade_sati || 'Sade Sati' },
                { id: 'menu_gemstones', label: t.menu_gemstones || 'Gemstones' },
                { id: 'menu_nakshatra', label: t.menu_nakshatra || 'Nakshatra' },
                { id: 'menu_doshas', label: t.menu_doshas || 'Dosha Check' },
                { id: 'menu_character', label: t.menu_character || 'Character' },
                { id: 'menu_numerology', label: t.menu_numerology || 'Numerology' }
              ] : [ 
                { id: 'menu_details', label: t.birth_analysis || 'Birth Analysis' }, 
                { id: 'menu_character', label: t.menu_character || 'Character' },
                { id: 'menu_numerology', label: t.menu_numerology || 'Numerology' },
                { id: 'menu_timeline', label: t.timeline || 'Timeline' },
                { id: 'menu_hora', label: t.shastriya || 'Shastriya' },
                { id: 'menu_rasi', label: t.rasi_kundli || 'Rasi Kundli' }, 
                { id: 'menu_navamsha', label: t.menu_navamsha || 'Navamsha D9' },
                { id: 'menu_bhava_analysis', label: t.menu_bhava_analysis || '12 Houses Analysis' },
                { id: 'menu_yogas', label: t.menu_yogas || 'Yoga Analysis' },
                { id: 'menu_maitri', label: t.menu_maitri || 'Panchadha Graha Maitri' },
                { id: 'menu_dasha', label: t.vimshottari || 'Vimshottari' }, 
                { id: 'menu_shadvarga', label: t.shadvarga_strengths || 'Shadvarga' },
                { id: 'menu_shadbala', label: t.shadbala_analysis || 'Shadbala' },
                { id: 'menu_ashtaka', label: t.ashtakavarga || 'Ashtakavarga' } 
              ]).map((item, idx) => (
                <motion.button 
                  key={item.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction('HOROSCOPE', item.id)} 
                  className="menu-button-parchment group p-8 sm:p-12 border-2 rounded-[2rem] sm:rounded-[3rem] shadow-xl transition-all"
                >
                  <span className="text-sm sm:text-lg md:text-xl font-black text-[#92400e] group-hover:text-[#ea580c] transition-colors uppercase tracking-widest">{item.label}</span>
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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
          >
             <MandalaBackground />
             <header className="bg-gradient-to-b from-[#312e81] to-[#1e1b4b] p-4 sm:p-7 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[#D4AF37]/40">
                <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
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
                    <span className="text-[10px] sm:text-sm md:text-lg font-black uppercase tracking-widest text-[#92400e]">{t[rasi.label_key] || rasi.name}</span>
                  </motion.button>
                ))}
             </div>
          </motion.div>
        );
      case AppTab.MATCHING:
        return (
          <motion.div 
            key="matching"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
          >
             <MandalaBackground />
             <header className="bg-gradient-to-b from-[#312e81] to-[#1e1b4b] p-4 sm:p-7 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[#D4AF37]/40">
                <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="ml-3 text-lg sm:text-2xl font-black text-[#D4AF37] tracking-tight uppercase astrological-font">{t.matching_tab_title || 'Matching'}</h2>
             </header>
             <div className="p-4 sm:p-10 md:p-16 max-w-5xl mx-auto w-full space-y-12 sm:space-y-20 pb-48 z-10">
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-8 sm:p-14 bg-amber-50/60 border-2 border-[#D4AF37]/30 rounded-[2.5rem] sm:rounded-[3.5rem] space-y-8 shadow-2xl relative backdrop-blur-md"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-8 py-2 bg-[#92400e] text-[#D4AF37] rounded-full text-[10px] sm:text-sm font-black uppercase tracking-widest shadow-xl border border-[#D4AF37]/30 flex items-center gap-2">
                    {t.partner_one} (Bride)
                    <button 
                      onClick={() => handleSaveToProfiles(matchingIntake.person1)}
                      className="ml-2 p-1 bg-[#D4AF37] text-[#92400e] rounded-full hover:scale-110 transition-all"
                      title="Save Profile"
                    >
                      <Save size={12} />
                    </button>
                  </div>
                  <div className="grid gap-6 sm:gap-8 pt-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1 opacity-80">Full Name</label>
                      <input value={matchingIntake.person1.name} onChange={e => setMatchingIntake({...matchingIntake, person1: {...matchingIntake.person1, name: e.target.value}})} placeholder={t.first_name} className="details-input" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1 opacity-80">Birth Date</label>
                        <input type="date" value={matchingIntake.person1.dob} onChange={e => setMatchingIntake({...matchingIntake, person1: {...matchingIntake.person1, dob: e.target.value}})} className="details-input font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1 opacity-80">Birth Time</label>
                        <TimePicker time={matchingIntake.person1.tob} ampm={matchingIntake.person1.ampm || 'AM'} onChange={(t, a) => setMatchingIntake({...matchingIntake, person1: {...matchingIntake.person1, tob: t, ampm: a}})} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/50">
                      <label className="text-[11px] font-black text-[#92400e] uppercase tracking-widest ml-1 flex items-center gap-2">
                        <span className="text-lg">📍</span> {t.birth_location}
                      </label>
                      <CitySearch value={matchingIntake.person1.pob} onChange={v => setMatchingIntake({...matchingIntake, person1: {...matchingIntake.person1, pob: v.pincode ? `${v.name} (${v.pincode})` : v.name, lat: v.lat, lon: v.lon, tz: v.tz}})} placeholder={t.search_city_placeholder} />
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-8 sm:p-14 bg-amber-50/60 border-2 border-[#D4AF37]/30 rounded-[2.5rem] sm:rounded-[3.5rem] space-y-8 shadow-2xl relative backdrop-blur-md"
                >
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-8 py-2 bg-[#D4AF37] text-[#312e81] rounded-full text-[10px] sm:text-sm font-black uppercase tracking-widest shadow-xl border border-[#312e81]/30 flex items-center gap-2">
                    {t.partner_two} (Groom)
                    <button 
                      onClick={() => handleSaveToProfiles(matchingIntake.person2)}
                      className="ml-2 p-1 bg-[#312e81] text-[#D4AF37] rounded-full hover:scale-110 transition-all"
                      title="Save Profile"
                    >
                      <Save size={12} />
                    </button>
                  </div>
                  <div className="grid gap-6 sm:gap-8 pt-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1 opacity-80">Full Name</label>
                      <input value={matchingIntake.person2.name} onChange={e => setMatchingIntake({...matchingIntake, person2: {...matchingIntake.person2, name: e.target.value}})} placeholder={t.second_name} className="details-input" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1 opacity-80">Birth Date</label>
                        <input type="date" value={matchingIntake.person2.dob} onChange={e => setMatchingIntake({...matchingIntake, person2: {...matchingIntake.person2, dob: e.target.value}})} className="details-input font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1 opacity-80">Birth Time</label>
                        <TimePicker time={matchingIntake.person2.tob} ampm={matchingIntake.person2.ampm || 'AM'} onChange={(t, a) => setMatchingIntake({...matchingIntake, person2: {...matchingIntake.person2, tob: t, ampm: a}})} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/50">
                      <label className="text-[11px] font-black text-[#92400e] uppercase tracking-widest ml-1 flex items-center gap-2">
                        <span className="text-lg">📍</span> {t.birth_location}
                      </label>
                      <CitySearch value={matchingIntake.person2.pob} onChange={v => setMatchingIntake({...matchingIntake, person2: {...matchingIntake.person2, pob: v.pincode ? `${v.name} (${v.pincode})` : v.name, lat: v.lat, lon: v.lon, tz: v.tz}})} placeholder={t.search_city_placeholder} />
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
                  {t.get_verdict || 'Get Verdict'}
                </motion.button>
             </div>
          </motion.div>
        );
      case AppTab.MUHURTHA:
        return (
          <motion.div 
            key="muhurta"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
          >
             <MandalaBackground />
             <header className="bg-gradient-to-b from-[#312e81] to-[#1e1b4b] p-4 sm:p-7 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[#D4AF37]/40">
                <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="ml-3 text-lg sm:text-2xl font-black text-[#D4AF37] tracking-tight uppercase astrological-font">{t.muhurta_tab_title || 'Muhurta'}</h2>
             </header>
             <div className="p-4 sm:p-10 max-w-7xl mx-auto w-full z-10">
                <div className="mb-8 space-y-6 bg-white/60 p-6 sm:p-10 rounded-3xl border border-[#D4AF37]/20 backdrop-blur-sm shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#312e81] uppercase tracking-widest ml-1 opacity-80">{t.location}</label>
                      <CitySearch value={muhurtaInput.pob} onChange={v => setMuhurtaInput({...muhurtaInput, pob: v.pincode ? `${v.name} (${v.pincode})` : v.name, lat: v.lat, lon: v.lon, tz: v.tz})} placeholder={t.search_city_placeholder} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#312e81] uppercase tracking-widest ml-1 opacity-80">{t.timeframe}</label>
                      <input 
                        type="text" 
                        placeholder={t.timeframe_placeholder} 
                        value={muhurtaInput.timeframe}
                        onChange={(e) => setMuhurtaInput({...muhurtaInput, timeframe: e.target.value})}
                        className="details-input"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#312e81] uppercase tracking-widest ml-1 opacity-80">{t.quick_search}</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder={t.muhurta_search_placeholder} 
                          value={muhurtaSearch}
                          onChange={(e) => setMuhurtaSearch(e.target.value)}
                          className="details-input pl-10"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#312e81]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="relative max-w-2xl mx-auto mb-12">
                  <input 
                    type="text" 
                    value={muhurtaSearch} 
                    onChange={(e) => setMuhurtaSearch(e.target.value)} 
                    placeholder={t.search_muhurta || 'Search Muhurta...'} 
                    className="w-full bg-amber-50/60 border-2 border-[#D4AF37]/30 rounded-full py-4 px-8 pl-14 text-[#312e81] font-bold shadow-xl focus:border-[#D4AF37] outline-none transition-all"
                  />
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-48">
                  {MUHURTA_TYPES.filter(m => {
                    const label = t[m.label_key] || m.label || "";
                    return label.toLowerCase().includes((muhurtaSearch || "").toLowerCase());
                  }).map((m, idx) => (
                    <motion.button 
                      key={m.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(67, 20, 7, 1)", color: "rgba(212, 175, 55, 1)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAction('MUHURTA', m.label)} 
                      className="group bg-amber-50/60 border-2 border-[#D4AF37]/20 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] transition-all duration-300 flex flex-col items-center gap-3 sm:gap-5 shadow-xl backdrop-blur-md"
                    >
                      <span className="text-3xl sm:text-5xl group-hover:scale-110 transition-all drop-shadow-md">✨</span>
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wide text-[#312e81] group-hover:text-[#D4AF37] text-center transition-colors px-2 leading-relaxed">{t[m.label_key] || m.label}</span>
                    </motion.button>
                  ))}
                </div>
             </div>
          </motion.div>
        );
      case AppTab.NUMEROLOGY:
        return horoscopeState === 'ANALYSIS' ? null : (
          <motion.div 
            key="numerology-intake"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
          >
            <MandalaBackground />
            <header className="bg-gradient-to-b from-[#312e81] to-[#1e1b4b] p-4 sm:p-6 flex items-center shadow-xl sticky top-0 z-20 border-b border-[#D4AF37]/30">
              <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="ml-3">
                <h2 className="text-lg sm:text-2xl font-black text-[#D4AF37] tracking-widest uppercase astrological-font leading-tight">{t.numerology || 'Numerology'}</h2>
                <p className="text-[9px] text-white/50 uppercase font-black tracking-widest">Power of Numbers</p>
              </div>
            </header>
            <div className="flex-1 p-4 sm:p-8 space-y-8 max-w-3xl mx-auto w-full overflow-y-auto pb-48 z-10">
              <div className="grid gap-6 p-6 sm:p-10 bg-amber-50/60 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-[#D4AF37]/30 shadow-2xl backdrop-blur-md">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1">{t.name_of_soul}</label>
                  <input value={intake.name} onChange={e => setIntake({...intake, name: e.target.value})} placeholder={t.enter_full_name} className="details-input" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1">{t.birth_date}</label>
                    <input type="date" value={intake.dob} onChange={e => setIntake({...intake, dob: e.target.value})} className="details-input font-bold" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1">{t.birth_time}</label>
                    <TimePicker time={intake.tob} ampm={intake.ampm || 'AM'} onChange={(t, a) => setIntake({...intake, tob: t, ampm: a})} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1">{t.birth_location}</label>
                  <CitySearch value={intake.pob} onChange={v => setIntake({...intake, pob: v.pincode ? `${v.name} (${v.pincode})` : v.name, lat: v.lat, lon: v.lon, tz: v.tz, pincode: v.pincode})} placeholder={t.search_city_placeholder} />
                </div>
                <div className="pt-6">
                  <button 
                    onClick={() => handleAction('NUMEROLOGY')}
                    className="w-full py-6 bg-gradient-to-r from-[#312e81] to-[#1e1b4b] text-[#D4AF37] rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all border-2 border-[#D4AF37]/30"
                  >
                    Analyze Numerology ➔
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case AppTab.PRASHNA: 
        return (
          <motion.div 
            key="prashna"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
          >
            <MandalaBackground />
             <header className="bg-gradient-to-b from-[#312e81] to-[#1e1b4b] p-4 sm:p-7 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[#D4AF37]/40">
              <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="ml-3 text-lg sm:text-2xl font-black text-[#D4AF37] uppercase astrological-font tracking-widest">{t.oracle}</h2>
            </header>
            <div className="p-4 sm:p-10 md:p-16 max-w-5xl mx-auto w-full z-10 pb-48">
              <PrashnaEngine lang={lang} mode={mode} />
            </div>
          </motion.div>
        );
      case AppTab.PANCHANGA:
        return (
          <motion.div 
            key="panchanga"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen"
          >
            <Panchanga lang={lang} mode={mode!} goBack={goBack} />
          </motion.div>
        );
      case AppTab.TIMELINE:
        if (horoscopeState === 'INPUT') {
          return (
            <motion.div 
              key="timeline-input"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="min-h-screen parchment-bg flex flex-col"
            >
              <header className="bg-gradient-to-b from-[#312e81] to-[#1e1b4b] p-6 flex items-center shadow-2xl border-b border-[#D4AF37]/40">
                <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="ml-3 text-2xl font-black text-[#D4AF37] uppercase astrological-font tracking-widest">{t.timeline_title}</h2>
              </header>
              <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full">
                <div className="bg-amber-50/60 backdrop-blur-xl border-4 border-[#D4AF37]/30 rounded-[3rem] p-8 shadow-2xl">
                  <h3 className="text-xl font-black text-[#312e81] uppercase tracking-widest text-center mb-8">{t.sacred_intake}</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#312e81] uppercase tracking-widest ml-1">{t.name_of_soul}</label>
                      <input value={intake.name} onChange={e => setIntake({...intake, name: e.target.value})} placeholder={t.enter_full_name} className="details-input w-full px-4 font-bold text-[#312e81]" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#312e81] uppercase tracking-widest ml-1">{t.birth_date}</label>
                        <input type="date" value={intake.dob} onChange={e => setIntake({...intake, dob: e.target.value})} className="details-input w-full px-4 font-bold text-[#312e81]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#451a03] uppercase tracking-widest ml-1">{t.birth_time}</label>
                        <TimePicker time={intake.tob} ampm={intake.ampm || 'AM'} onChange={(t, a) => setIntake({...intake, tob: t, ampm: a})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#451a03] uppercase tracking-widest ml-1">{t.birth_location}</label>
                      <CitySearch value={intake.pob} onChange={city => setIntake({...intake, pob: city.name, lat: city.lat, lon: city.lon, tz: city.tz})} placeholder={t.search_city_placeholder} />
                    </div>
                    <button 
                      onClick={() => setHoroscopeState('RESULT')}
                      disabled={!intake.name || !intake.dob || !intake.lat}
                      className="w-full py-5 bg-gradient-to-r from-[#451a03] to-[#7c2d12] text-[#D4AF37] rounded-2xl font-black uppercase tracking-[0.3em] text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {t.submit}
                    </button>
                  </div>
                </div>
              </main>
            </motion.div>
          );
        }
        return <TimelineDashboard intake={intake} lang={lang} goBack={() => setHoroscopeState('INPUT')} />;
      case AppTab.BLOG:
        return (
          <motion.div 
            key="blog"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen parchment-bg flex flex-col"
          >
            <header className="bg-gradient-to-b from-[#451a03] to-[#7c2d12] p-6 flex items-center shadow-2xl border-b border-[#D4AF37]/40">
              <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="ml-3 text-2xl font-black text-[#D4AF37] uppercase astrological-font tracking-widest">
                {lang === 'kn' ? 'ಜ್ಞಾನ ಭಂಡಾರ' : lang === 'tcy' ? 'ಜ್ಞಾನದ ಬಂಡಾರ' : 'Celestial Wisdom'}
              </h2>
            </header>
            <main className="flex-1">
              <BlogSection lang={lang} />
            </main>
          </motion.div>
        );
      case AppTab.LIFE_PARTNER:
        return horoscopeState === 'ANALYSIS' ? null : (
          <motion.div 
            key="life-partner-intake"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
          >
            <MandalaBackground />
            <header className="bg-gradient-to-b from-[#451a03] to-[#7c2d12] p-4 sm:p-6 flex items-center shadow-xl sticky top-0 z-20 border-b border-[#D4AF37]/30">
              <button onClick={goBack} className="p-2 text-white hover:bg-white/20 rounded-full transition-all group">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="ml-3">
                <h2 className="text-lg sm:text-2xl font-black text-[#D4AF37] tracking-widest uppercase astrological-font leading-tight">Life Partner Analysis</h2>
                <p className="text-[9px] text-white/50 uppercase font-black tracking-widest">Classical Predictions</p>
              </div>
            </header>
            <div className="flex-1 p-4 sm:p-8 space-y-8 max-w-3xl mx-auto w-full overflow-y-auto pb-48 z-10">
              <div className="grid gap-6 p-6 sm:p-10 bg-amber-50/60 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-[#D4AF37]/30 shadow-2xl backdrop-blur-md">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1">{t.name_of_soul}</label>
                  <input value={intake.name} onChange={e => setIntake({...intake, name: e.target.value})} placeholder={t.enter_full_name} className="details-input" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1">{t.birth_date}</label>
                    <input type="date" value={intake.dob} onChange={e => setIntake({...intake, dob: e.target.value})} className="details-input font-bold" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1">{t.birth_time}</label>
                    <TimePicker time={intake.tob} ampm={intake.ampm || 'AM'} onChange={(t, a) => setIntake({...intake, tob: t, ampm: a})} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#92400e] uppercase tracking-widest ml-1">{t.birth_location}</label>
                  <CitySearch value={intake.pob} onChange={v => setIntake({...intake, pob: v.pincode ? `${v.name} (${v.pincode})` : v.name, lat: v.lat, lon: v.lon, tz: v.tz, pincode: v.pincode})} placeholder={t.search_city_placeholder} />
                </div>
                <div className="pt-6">
                  <button 
                    onClick={() => handleAction('LIFE_PARTNER')}
                    className="w-full py-6 bg-gradient-to-r from-[#92400e] to-[#7c2d12] text-[#D4AF37] rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all border-2 border-[#D4AF37]/30"
                  >
                    Analyze Life Partner ➔
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      default: 
        return (
          <div className="min-h-screen flex items-center justify-center parchment-bg">
            <div className="text-center p-8 bg-amber-50/60 rounded-3xl border-2 border-[#D4AF37]/30 shadow-xl">
              <p className="text-[#92400e] font-bold mb-4">{t.under_construction || 'This celestial path is under construction.'}</p>
              <button onClick={() => setActiveTab(AppTab.DASHBOARD)} className="astro-btn-maroon px-6 py-2 rounded-full">{t.return_home || 'Return Home'}</button>
            </div>
          </div>
        );
    }
  };

  const renderBottomNav = () => {
    if (onboardingStep !== OnboardingStep.COMPLETED) return null;
    if (!mode || analysisResult || (activeTab === AppTab.HOROSCOPE && horoscopeState === 'INPUT')) return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-[#f59e0b] border-t border-[#451a03]/30 z-[50] flex justify-around items-center py-2 sm:py-4 px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {[
          { id: AppTab.DASHBOARD, icon: <Compass />, label: t.home || 'Home' },
          { id: AppTab.HOROSCOPE, icon: <Stars />, label: t.horoscope || 'Horoscope' },
          { id: AppTab.DAILY_PREDICTION, icon: <Sun />, label: t.daily_nav || 'Daily' },
          { id: AppTab.MATCHING, icon: <Sparkles />, label: t.matching || 'Matching' },
          { id: AppTab.LIFE_PARTNER, icon: <Heart />, label: t.life_partner || 'Partner' },
          { id: AppTab.MUHURTHA, icon: <Moon />, label: t.muhurta || 'Muhurta' },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => {
              changeTab(item.id);
            }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-[#451a03] scale-110' : 'text-[#451a03]/60 hover:text-[#451a03]'}`}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8">
              {item.icon}
            </div>
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen text-[#451a03] selection:bg-amber-500/30 font-serif overflow-x-hidden break-words">
      <AnimatePresence mode="wait">



        {onboardingStep === OnboardingStep.QUICK_LOGIN && (
          <motion.div
            key="quick_login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] bg-[#fffbeb] flex items-center justify-center p-6"
          >
            <div className="w-full max-w-2xl bg-amber-50/90 rounded-[3.5rem] p-8 sm:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-4 border-[#D4AF37]/20 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-5xl font-black text-[#451a03] uppercase tracking-widest astrological-font text-center mb-4">
                  {t.quick_profile || 'Quick Profile'}
                </h2>
                <p className="text-center text-[#92400e] font-bold uppercase tracking-widest text-xs mb-12 opacity-60">
                  {t.enter_details_wisdom || 'Enter details for personalized wisdom'}
                </p>
                
                <div className="space-y-6">
                  <input 
                    type="text" 
                    placeholder={t.name_of_soul || 'Your Name'} 
                    className="details-input"
                    value={intake.name}
                    onChange={e => setIntake(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      type="date" 
                      className="details-input"
                      value={intake.dob}
                      onChange={e => setIntake(prev => ({ ...prev, dob: e.target.value }))}
                    />
                    <TimePicker 
                      time={intake.tob} 
                      ampm={intake.ampm || 'AM'} 
                      onChange={(t, a) => setIntake(prev => ({ ...prev, tob: t, ampm: a }))} 
                    />
                  </div>
                  <CitySearch 
                    value={intake.pob} 
                    onChange={city => setIntake(prev => ({ ...prev, pob: city.name, lat: city.lat, lon: city.lon, tz: city.tz }))} 
                    placeholder={t.birth_location || 'Place of Birth'}
                  />
                  
                  <div className="pt-8 flex flex-col gap-4">
                    <button
                      onClick={() => {
                        localStorage.setItem('astro_user_intake', JSON.stringify(intake));
                        setOnboardingStep(OnboardingStep.COMPLETED);
                        localStorage.setItem('astro_logic_onboarding_v1', 'true');
                      }}
                      className="w-full py-6 bg-[#451a03] text-[#D4AF37] rounded-[2rem] font-black uppercase tracking-[0.4em] text-sm shadow-xl hover:bg-black transition-all"
                    >
                      {t.save_continue || 'Save & Continue'}
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem('astro_user_intake_skipped', 'true');
                        setOnboardingStep(OnboardingStep.COMPLETED);
                        localStorage.setItem('astro_logic_onboarding_v1', 'true');
                      }}
                      className="w-full py-4 text-[#451a03]/40 font-black uppercase tracking-[0.3em] text-xs hover:text-[#451a03] transition-colors"
                    >
                      {t.skip_for_now || 'Skip for now'}
                    </button>
                  </div>

                  <div className="mt-12 pt-8 border-t border-[#D4AF37]/20 flex justify-center gap-8">
                    <button 
                      onClick={() => setIsDonateOpen(true)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#92400e] hover:text-[#451a03] transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Heart size={14} className="text-red-500 fill-current" />
                      </div>
                      {t.donate_support}
                    </button>
                    <button 
                      onClick={() => setIsFeedbackOpen(true)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#92400e] hover:text-[#451a03] transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <MessageSquare size={14} className="text-blue-500" />
                      </div>
                      {t.feedback}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {onboardingStep === OnboardingStep.MODE_SELECT && (
          <motion.div
            key="mode_select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-start p-6 overflow-y-auto"
          >
            <MandalaBackground />
            
            <div className="absolute top-6 right-6 z-50">
              <div className="relative group">
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value as Language)} 
                  className="bg-white/10 backdrop-blur-md border-2 border-[#D4AF37]/40 text-[#D4AF37] text-[13px] font-black rounded-full px-6 py-2.5 appearance-none cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.2)] tracking-widest hover:border-[#D4AF37] transition-all outline-none"
                >
                  {LANGUAGES.map(l => <option key={l.code} value={l.code} className="bg-[#020617] text-white">{l.name}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37]/60">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Header Section */}
            <div className="relative flex flex-col items-center mb-8 sm:mb-12 mt-16 sm:mt-24 z-10 w-full">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative flex items-center justify-center w-full max-w-4xl"
              >
                <FantasticLogo className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none w-full">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#D4AF37] astrological-font tracking-[0.2em] uppercase drop-shadow-[0_0_30px_rgba(212,175,55,0.8)] flex items-center gap-3 sm:gap-6 whitespace-nowrap">
                    <span>ASTRO</span>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" /> {/* Spacer for the central sun */}
                    <span>LOGIC</span>
                  </h1>
                </div>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-white/80 font-serif italic text-xs sm:text-xl tracking-[0.3em] mt-4 uppercase text-center px-4"
              >
                Sacred Geometry • Ancient Logic
              </motion.p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 w-full max-w-6xl z-10 pb-12">
              <motion.button 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMode('SEEKER');
                  localStorage.setItem('astro_logic_mode_v1', 'SEEKER');
                  const onboardingDone = localStorage.getItem('astro_logic_onboarding_v1');
                  if (onboardingDone) {
                    setOnboardingStep(OnboardingStep.COMPLETED);
                  } else {
                    setOnboardingStep(OnboardingStep.QUICK_LOGIN);
                  }
                }}
                className="flex-1 group relative flex flex-col items-center justify-center p-10 sm:p-16 transition-all duration-500 bg-[#1e293b]/80 backdrop-blur-md border-4 border-[#D4AF37]/30 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="z-10 text-center space-y-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mx-auto transition-all">
                    <span className="text-7xl sm:text-9xl block group-hover:scale-110 transition-transform drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">⭐</span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-4xl sm:text-6xl font-black text-[#D4AF37] uppercase tracking-[0.2em] astrological-font">{t.seeker || 'Seeker'}</h2>
                  </div>
                  <p className="text-sm sm:text-lg text-white/90 font-serif leading-relaxed max-w-[320px] mx-auto italic">
                    "{t.seeker_desc || 'Simple life guidance, career flow, and daily energy in clear, accessible language.'}"
                  </p>
                  <div className="pt-6">
                    <span className="inline-block px-12 py-4 border-2 border-[#D4AF37] text-[#D4AF37] rounded-full uppercase text-sm font-black tracking-[0.3em] group-hover:bg-[#D4AF37] group-hover:text-[#020617] transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)]">{t.select_seeker}</span>
                  </div>
                </div>
              </motion.button>

              <motion.button 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMode('SCHOLAR');
                  localStorage.setItem('astro_logic_mode_v1', 'SCHOLAR');
                  const onboardingDone = localStorage.getItem('astro_logic_onboarding_v1');
                  if (onboardingDone) {
                    setOnboardingStep(OnboardingStep.COMPLETED);
                  } else {
                    setOnboardingStep(OnboardingStep.QUICK_LOGIN);
                  }
                }}
                className="flex-1 group relative flex flex-col items-center justify-center p-10 sm:p-16 transition-all duration-500 bg-[#1e293b]/80 backdrop-blur-md border-4 border-[#D4AF37]/30 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="z-10 text-center space-y-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mx-auto transition-all">
                    <span className="text-7xl sm:text-9xl block group-hover:scale-110 transition-transform drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">📜</span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-4xl sm:text-6xl font-black text-[#D4AF37] uppercase tracking-[0.2em] astrological-font">{t.scholar || 'Scholar'}</h2>
                  </div>
                  <p className="text-sm sm:text-lg text-white/90 font-serif leading-relaxed max-w-[320px] mx-auto italic">
                    "{t.scholar_desc || 'Mathematical precision. Longitudes, classical Shlokas, and deep Siddhantic rules.'}"
                  </p>
                  <div className="pt-6">
                    <span className="inline-block px-12 py-4 border-2 border-[#D4AF37] text-[#D4AF37] rounded-full uppercase text-sm font-black tracking-[0.3em] group-hover:bg-[#D4AF37] group-hover:text-[#020617] transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)]">{t.select_scholar}</span>
                  </div>
                </div>
              </motion.button>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-12 pb-12 flex justify-center gap-10 z-10"
            >
              <button 
                onClick={() => setIsDonateOpen(true)}
                className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#D4AF37] hover:text-white transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-[#D4AF37]/30 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-all">
                  <Heart size={16} className="text-red-400 fill-current" />
                </div>
                {t.donate_support}
              </button>
              <button 
                onClick={() => setIsFeedbackOpen(true)}
                className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#D4AF37] hover:text-white transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-[#D4AF37]/30 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-all">
                  <MessageSquare size={16} className="text-blue-400" />
                </div>
                {t.feedback}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {onboardingStep === OnboardingStep.COMPLETED && (
        <div className="fixed bottom-24 left-6 sm:bottom-28 sm:left-10 z-[60] flex flex-col gap-3 pointer-events-none">
          <motion.button 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDonateOpen(true)}
            className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-rose-700 rounded-full shadow-[0_10px_25px_rgba(244,63,94,0.4)] border-2 border-white/50 flex items-center justify-center group relative overflow-hidden"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-white/20"
            />
            <Heart className="text-white w-4 h-4 sm:w-5 sm:h-5 fill-current relative z-10" />
            <div className="absolute left-full ml-3 px-3 py-1 bg-black/80 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {t.donate_support}
            </div>
          </motion.button>

          <motion.button 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFeedbackOpen(true)}
            className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full shadow-[0_10px_25px_rgba(59,130,246,0.4)] border-2 border-white/50 flex items-center justify-center group relative"
          >
            <MessageSquare className="text-white w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
            <div className="absolute left-full ml-3 px-3 py-1 bg-black/80 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {t.feedback}
            </div>
          </motion.button>
        </div>
      )}

      {onboardingStep === OnboardingStep.COMPLETED && (
        <>
          <div className="fixed bottom-20 right-6 sm:bottom-24 sm:right-10 z-[60] pointer-events-none">
            <button onClick={() => setIsHelpOpen(true)} className="pointer-events-auto w-14 h-14 sm:w-20 sm:h-20 bg-[#D4AF37] rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.6)] border-4 sm:border-6 border-[#451a03] flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all group">
              <span className="text-xl sm:text-3xl drop-shadow-lg group-hover:rotate-6 transition-transform">🙏</span>
              <span className="hidden sm:block text-[8px] font-black uppercase text-[#451a03] tracking-widest mt-0.5 text-center">{t.help}</span>
            </button>
            
            <AnimatePresence>
              {isHelpOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-[#fffbeb] w-full max-w-2xl rounded-[3rem] border-4 border-[#D4AF37] shadow-[0_0_100px_rgba(212,175,55,0.3)] overflow-hidden flex flex-col max-h-[90vh]"
                  >
                    <div className="bg-[#D4AF37] p-6 sm:p-10 text-[#451a03] flex justify-between items-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                      <div className="flex items-center gap-6 z-10">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-[#451a03] overflow-hidden shadow-2xl">
                          <img 
                            src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=200&auto=format&fit=crop" 
                            alt="Ancient Guruji" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-widest astrological-font leading-none">Sacred Guide</h2>
                          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold mt-2 opacity-80">Wisdom from the Ancient Masters</p>
                        </div>
                      </div>
                      <button onClick={() => setIsHelpOpen(false)} className="text-3xl hover:scale-110 transition-transform z-10">✕</button>
                    </div>
                    <div className="p-6 sm:p-12 overflow-y-auto space-y-10 text-[#451a03]">
                      <section className="relative">
                        <div className="absolute -left-6 top-0 w-1 h-full bg-[#D4AF37] rounded-full"></div>
                        <h3 className="font-black uppercase tracking-[0.2em] text-sm sm:text-base mb-4 flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-xs">01</span>
                          Choose Your Path
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed font-medium opacity-90">Select <b>Seeker</b> for simple, easy-to-understand life guidance. Select <b>Scholar</b> for deep technical details, Sanskrit shlokas, and mathematical precision based on <i>Brihat Jataka</i> and <i>Phaladeepika</i>.</p>
                      </section>
                      <section className="relative">
                        <div className="absolute -left-6 top-0 w-1 h-full bg-[#D4AF37] rounded-full"></div>
                        <h3 className="font-black uppercase tracking-[0.2em] text-sm sm:text-base mb-4 flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-xs">02</span>
                          Enter Birth Details
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed font-medium opacity-90">Provide your exact Date, Time, and Place of birth. For the best accuracy, search for your city and select it from the list to get precise coordinates and timezone data.</p>
                      </section>
                      <section className="relative">
                        <div className="absolute -left-6 top-0 w-1 h-full bg-[#D4AF37] rounded-full"></div>
                        <h3 className="font-black uppercase tracking-[0.2em] text-sm sm:text-base mb-4 flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-xs">03</span>
                          Explore Analysis
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed font-medium opacity-90">Navigate through <b>Horoscope</b> for birth analysis, <b>Daily</b> for your transit forecast, and <b>Matching</b> for relationship compatibility.</p>
                      </section>
                      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                          onClick={() => { setIsHelpOpen(false); setIsChatOverlayOpen(true); }}
                          className="w-full bg-[#451a03] text-[#D4AF37] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-sm hover:bg-black transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)] active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                          <MessageSquare size={20} />
                          Write to Guruji
                        </button>
                        <button 
                          onClick={() => { setIsHelpOpen(false); setIsChatOverlayOpen(true); }}
                          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#451a03] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-sm hover:scale-105 transition-all shadow-[0_20px_40px_rgba(212,175,55,0.3)] active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                          <Sparkles size={20} className="animate-pulse" />
                          Speak to Guruji
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {isChatOverlayOpen && (
              <div className="pointer-events-auto absolute bottom-20 right-0 w-[92vw] sm:w-[440px] h-[75vh] sm:max-h-[800px] bg-white rounded-[2rem] sm:rounded-[3.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.7)] border-4 border-[#D4AF37]/50 overflow-hidden animate-in slide-in-from-bottom-8 duration-500 flex flex-col z-[100]">
                <div className="bg-[#D4AF37] p-5 sm:p-8 text-[#451a03] flex justify-between items-center shadow-2xl relative">
                   <div className="flex items-center gap-4 z-10">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-[#451a03] overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=100&auto=format&fit=crop" 
                          alt="Guruji" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black uppercase tracking-widest text-sm sm:text-xl astrological-font leading-tight">{t.ask_help_guruji}</span>
                        <span className="text-[8px] sm:text-[10px] uppercase tracking-widest opacity-60">{t.sacred_conversation}</span>
                      </div>
                   </div>
                   <button onClick={() => setIsChatOverlayOpen(false)} className="hover:opacity-70 text-2xl sm:text-3xl font-bold z-10">✕</button>
                </div>
                <div className="flex-1 overflow-hidden bg-[#fffbeb]">
                  <GurujiChat lang={lang} mode={mode!} intake={intake} />
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
               <p className="text-[#D4AF37] font-black uppercase tracking-[0.5em] sm:tracking-[1em] animate-pulse text-[11px] sm:text-xl ml-[0.5em] sm:ml-[1em] drop-shadow-lg mb-8">{t.calculating_heavens || 'Calculating Heavens...'}</p>
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl"
                >
                  <p className="text-white/80 font-serif italic text-sm sm:text-xl leading-relaxed">
                    {JYOTISH_QUOTES[Math.floor(Date.now() / 5000) % JYOTISH_QUOTES.length][lang] || JYOTISH_QUOTES[0][lang]}
                  </p>
                </motion.div>
            </div>
          )}
          
          <main className="pb-24">
            <ProfileButton />
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8 backdrop-blur-md bg-black/40"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                  >
                    <button 
                      onClick={() => setIsProfileOpen(false)}
                      className="absolute top-6 right-6 z-20 p-2 bg-[#451a03] text-[#D4AF37] rounded-full hover:scale-110 transition-all shadow-xl border border-[#D4AF37]/30"
                    >
                      <X size={24} />
                    </button>
                    <UserProfile 
                      lang={lang} 
                      intake={intake} 
                      onUpdateIntake={(newIntake) => {
                        setIntake(newIntake as any);
                        lastSavedIntakeRef.current = JSON.stringify(newIntake);
                        setIsDirty(false);
                      }} 
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </main>

          {renderBottomNav()}

          {/* DonateSection removed */}
        </>
      )}

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        lang={lang} 
      />
      <DonateSection 
        isOpen={isDonateOpen} 
        onClose={() => setIsDonateOpen(false)} 
        lang={lang} 
      />
      <style>{`
        .parchment-bg { 
          background-color: #0f172a; 
          background-image: radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%); 
          position: relative; 
          background-attachment: fixed; 
        }
        .parchment-bg::before { content: ""; position: fixed; inset: 0; background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, transparent 50%, rgba(30, 27, 75, 0.05) 100%); pointer-events: none; z-index: 0; }
        .details-input { width: 100%; background: #ffffff !important; border: 2.5px solid #fde68a; border-radius: 1.25rem; padding: 1rem 1.5rem; color: #451a03 !important; font-family: 'Lora', serif; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-size: 1rem; }
        .details-input:focus { outline: none; border-color: #D4AF37; box-shadow: 0 0 20px rgba(212, 175, 55, 0.1); }
        .menu-button-parchment { background: #ffffff; border: 2.5px solid #fde68a; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(212, 175, 55, 0.05); text-align: center; }
        .astro-btn-maroon { width: 100%; font-weight: 900; color: #451a03 !important; text-transform: uppercase; letter-spacing: 0.3em; background: #D4AF37 !important; border: 2.5px solid #451a03; transition: all 0.4s ease; }
        .astro-btn-maroon:hover:not(:disabled) { background: #B8860B !important; border-color: #000; }
        
        .analysis-rich-text h3 { color: #451a03; font-size: 1.85rem; sm:font-size: 3rem; font-family: 'Cinzel', serif; margin: 3.5rem 0 2rem; border-bottom: 4px solid #D4AF37; padding-bottom: 1rem; text-align: center; text-transform: uppercase; font-weight: 900; line-height: 1.2; }
        .analysis-rich-text h4 { color: #b45309; font-size: 1.4rem; sm:font-size: 2rem; font-family: 'Cinzel', serif; margin: 2.5rem 0 1.25rem; border-left: 10px sm:border-left-[15px] solid #D4AF37; padding: 0.8rem 0 0.8rem 1.25rem; sm:padding: 1.25rem 0 1.25rem 2rem; font-weight: 800; background: linear-gradient(to right, rgba(212, 175, 55, 0.08), transparent); border-radius: 0 1.5rem 1.5rem 0; }
        .analysis-rich-text p { margin-bottom: 2rem; line-height: 1.9; sm:line-height: 2.5; font-size: 1rem; sm:font-size: 1.4rem; text-align: justify; color: #451a03; font-weight: 500; }
        .analysis-rich-text li { margin-bottom: 1.75rem; font-size: 1rem; sm:font-size: 1.4rem; color: #451a03; padding: 2rem 2.5rem; sm:padding: 3rem 4.5rem; background: #ffffff; border-radius: 1.75rem sm:border-radius: 3rem; border-left: 12px sm:border-left-[20px] solid #D4AF37; box-shadow: 0 12px 30px rgba(0,0,0,0.06); font-weight: 500; }
        
        .shadow-glow { box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }
        
        .scholar-view h3 { border-bottom-color: #D4AF37; color: #451a03; }
        .scholar-view li { border-left-color: #D4AF37; background: #fffbeb; }
        .seeker-view h3 { color: #b45309; border-bottom-color: #D4AF37; }
        .seeker-view li { border-left-color: #D4AF37; background: #fffcfb; }
      `}</style>
    </div>
  );
};

export default App;
