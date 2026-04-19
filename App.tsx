
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stars, Sparkles, Moon, Sun, Compass, Heart, MessageSquare, HelpCircle, ChevronDown, User, Save, X, Clock, MapPin, Search } from 'lucide-react';
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
import SavedReadings from './components/SavedReadings';
import VastuAnalysis from './components/VastuAnalysis';
import PalmReader from './components/PalmReader';
import ContactAstrologer from './components/ContactAstrologer';
import CSRBanner from './components/CSRBanner';
import FeedbackModal from './components/FeedbackModal';
import DonateSection from './components/DonateSection';
import SuggestionBox from './components/SuggestionBox';
import ScrollToTop from './components/ScrollToTop';
import { LoadingIndicator } from './components/LoadingIndicator';
import GurujiChat from './components/GurujiChat';
import TimePicker from './components/TimePicker';
import { AshtakavargaTable, VimshottariTable, GrahaMaitriTable, BhavaPhala, BirthDetailsTable } from './components/AstroTables';
import MandalaBackground from './components/MandalaBackground';
import { generateHoroscope, findMuhurtha, matchKundali, generateDailyForecastForRasi, generatePrashnaAnalysis, generateMuhurthaImage, generateVastuAnalysis } from './services/gemini';
import CitySearch from './components/CitySearch';
import MuhurtaAnalysis from './components/MuhurtaAnalysis';
import { RASIS, TRANSLATIONS, LANGUAGES, COLORS, HOURS, MINUTES, MUHURTA_TYPES, JYOTISH_QUOTES } from './constants';

const generateUserId = () => `astro-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const LoshuGrid = ({ grid, present }: { grid: number[], present: number[] }) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-[300px] mx-auto p-4 sm:p-6 modern-card rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
      {grid.map((num, idx) => (
        <div 
          key={idx} 
          className={`aspect-square flex items-center justify-center text-xl sm:text-3xl font-ancient font-black rounded-xl border transition-all duration-700 ${
            present.includes(num) 
              ? 'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#1e1b4b] border-[var(--text-primary)] shadow-[0_0_15px_rgba(212,175,55,0.5)] scale-105' 
              : 'bg-[var(--bg-primary)]/50 text-[var(--accent-primary)]/40 border-[var(--accent-primary)]/20'
          }`}
        >
          {num}
        </div>
      ))}
    </div>
  );
};

const FantasticLogo = React.memo(({ className = "" }: { className?: string }) => (
  <div className={`relative group cursor-default perspective-1000 ${className || "w-32 h-32 sm:w-56 md:w-72"}`}>
    <div className="absolute inset-[-15px] sm:inset-[-35px] border border-[var(--accent-primary)]/20 dark:border-[var(--accent-primary)]/30 rounded-full animate-[spin_120s_linear_infinite]"></div>
    <div className="absolute inset-0 animate-[spin_90s_linear_infinite] opacity-60 dark:opacity-60 group-hover:opacity-100 transition-opacity duration-2000">
      <svg viewBox="0 0 100 100" className="w-full h-full fill-[var(--accent-primary)]">
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 6" className="text-[var(--accent-primary)]" />
        {RASIS.map((r, i) => (
          <g key={i} transform={`rotate(${i * 30} 50 50)`}>
            <text x="50" y="6" fontSize="6" textAnchor="middle" className="font-ancient font-black drop-shadow-lg select-none fill-[var(--accent-primary)] opacity-100">{r.icon}</text>
          </g>
        ))}
      </svg>
    </div>
    <div className="absolute inset-10 sm:inset-16 md:inset-20 bg-gradient-to-tr from-[var(--accent-primary)]/20 via-[var(--color-gold-dark)]/10 to-transparent rounded-full blur-[40px] sm:blur-[80px] transition-all duration-2000 animate-pulse"></div>
    <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 md:p-10">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]">
        <g className="animate-[pulse_6s_easeInOut_infinite]">
          {[...Array(64)].map((_, i) => (
            <path key={i} d="M50 2 L51 40 L49 40 Z" fill={i % 2 === 0 ? "var(--accent-primary)" : "var(--color-gold-dark)"} transform={`rotate(${i * 5.625} 50 50)`} className="opacity-70" />
          ))}
        </g>
        <circle cx="50" cy="50" r="24" className="fill-white dark:fill-[#020617] stroke-[var(--accent-primary)] stroke-[1]" />
        <text x="50" y="56" fontSize="16" textAnchor="middle" fill="currentColor" className="font-ancient font-bold gold-leaf text-[var(--accent-primary)]">ॐ</text>
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
    <div className="mb-8 sm:mb-12 text-left space-y-4 p-6 sm:p-8 modern-card rounded-2xl shadow-xl max-w-2xl mx-auto relative overflow-hidden group">
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--accent-primary)]/40"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--accent-primary)]/40"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--accent-primary)]/40"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--accent-primary)]/40"></div>
      
      <div className="flex items-center justify-between border-b border-[var(--accent-primary)]/20 pb-3">
        <span className="text-[10px] sm:text-xs font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-[0.25em]">{t.name}</span>
        <span className="text-lg sm:text-xl font-ancient font-black gold-leaf">{name}</span>
      </div>
      <div className="flex items-center justify-between border-b border-[var(--accent-primary)]/20 pb-3">
        <span className="text-[10px] sm:text-xs font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-[0.25em]">{t.date}</span>
        <span className="text-sm sm:text-base font-premium font-bold text-[var(--text-primary)]">{date} <span className="text-[10px] sm:text-sm opacity-100 font-bold italic ml-2">{time}</span></span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] sm:text-xs font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-[0.25em]">{t.nakshatra}</span>
        <span className="text-lg sm:text-xl font-ancient font-black gold-leaf">{nakshatra}</span>
      </div>
    </div>
  );
};

const ThemeToggle = ({ theme, toggle, lang }: { theme: 'light' | 'dark', toggle: () => void, lang: Language }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return (
    <button 
      onClick={toggle}
      className="p-2.5 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)] transition-all group relative overflow-hidden shadow-sm"
      title={theme === 'light' ? t.switch_to_dark : t.switch_to_light}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : 180, scale: [1, 1.2, 1] }}
        transition={{ 
          rotate: { type: "spring", stiffness: 200, damping: 10 },
          scale: { duration: 0.3 }
        }}
      >
        {theme === 'light' ? <Moon size={18} className="text-[var(--accent-primary)]" /> : <Sun size={18} className="text-[var(--accent-primary)]" />}
      </motion.div>
    </button>
  );
};

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="bg-[var(--bg-secondary)]/80 border border-[var(--accent-primary)]/40 px-4 py-1.5 rounded-xl backdrop-blur-md shadow-sm flex items-center gap-2 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse shadow-[0_0_8px_var(--accent-primary)]"></div>
      <span className="text-[11px] sm:text-sm font-mono font-bold text-[var(--accent-primary)] dark:text-[var(--accent-primary)] tracking-widest">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('astro_logic_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('astro_logic_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('astro_logic_lang');
    return (saved as Language) || 'en';
  });
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(OnboardingStep.MODE_SELECT);
  const [tourStep, setTourStep] = useState(0);
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
  const [vastuHtml, setVastuHtml] = useState<string | null>(null);
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
        if (!parsed.id) {
          parsed.id = generateUserId();
          localStorage.setItem('astro_user_intake', JSON.stringify(parsed));
        }
        lastSavedIntakeRef.current = JSON.stringify(parsed);
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
      id: generateUserId(),
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
  
  const tourSteps = [
    {
      title: t.welcome_tour || "Welcome to Astro Logic",
      description: t.welcome_tour_desc || "Your personal guide to the ancient heavens. Let's explore your sacred journey.",
      icon: "✨"
    },
    {
      title: mode === 'SEEKER' ? (t.seeker_mode_active || "Seeker Path Active") : (t.scholar_mode_active || "Scholar Path Active"),
      description: mode === 'SEEKER' 
        ? (t.seeker_tour_desc || "You are in Seeker mode. We provide simplified guidance, focusing on practical life wisdom and daily insights.")
        : (t.scholar_tour_desc || "You are in Scholar mode. Expect deep technical details, Sanskrit shlokas, and mathematical Siddhantic precision."),
      icon: mode === 'SEEKER' ? "✨" : "📜"
    },
    {
      title: t.sacred_dashboard || "Celestial Dashboard",
      description: t.dashboard_tour_desc || "Your main hub for quick readings, panchang updates, and direct access to various astrological tools.",
      icon: "🏛️"
    },
    {
      title: t.guruji_tour || "Consult Guruji",
      description: t.guruji_tour_desc || "The floating 'Guruji' button at the bottom allows you to ask questions and receive wisdom directly.",
      icon: "🙏"
    },
    {
      title: t.navigation_tour || "Seamless Navigation",
      description: t.nav_tour_desc || "Use the bottom tab bar to switch between birth analysis, daily transits, matching, and more.",
      icon: "🧭"
    }
  ];

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

  const isProfileReady = (p: UserIntake) => !!(p.name && p.dob && p.tob && p.pob);

  const handleSaveProfile = () => {
    if (!intake.name) {
      setError(t.save_profile_error);
      return;
    }
    const updated = [intake, ...savedProfiles.filter(p => p.name !== intake.name)].slice(0, 5);
    setSavedProfiles(updated);
    localStorage.setItem('astro_logic_profiles_v4', JSON.stringify(updated));
    localStorage.setItem('astro_user_intake', JSON.stringify(intake));
    lastSavedIntakeRef.current = JSON.stringify(intake);
    setIsDirty(false);
    setError(t.profile_saved);
    setTimeout(() => setError(null), 3000);
  };

  const handleSaveToProfiles = (p: UserIntake) => {
    if (!p.name) {
      setError(t.save_profile_error);
      return;
    }
    const updated = [p, ...savedProfiles.filter(sp => sp.name !== p.name)].slice(0, 10);
    setSavedProfiles(updated);
    localStorage.setItem('astro_logic_profiles_v4', JSON.stringify(updated));
    setError(t.profile_saved_for?.replace('{name}', p.name));
    setTimeout(() => setError(null), 3000);
  };

  const saveToHistory = (type: string, summary: string, result: string, sData?: any) => {
    const history = JSON.parse(localStorage.getItem('astro_readings_history_v2') || '[]');
    const newEntry = {
      id: Date.now().toString(),
      type,
      date: new Date().toLocaleDateString(),
      summary,
      result,
      sData
    };
    const updatedHistory = [newEntry, ...history].slice(0, 15);
    localStorage.setItem('astro_readings_history_v2', JSON.stringify(updatedHistory));
  };

  const changeTab = (newTab: AppTab) => {
    if (newTab !== activeTab) {
      setTabHistory(prev => [...prev, newTab]);
      setActiveTab(newTab);
      setAnalysisResult(null);
      if (newTab === AppTab.VASTU) {
        handleAction('VASTU');
      }
      const intakeTabs = [AppTab.HOROSCOPE, AppTab.TIMELINE, AppTab.NUMEROLOGY, AppTab.LIFE_PARTNER];
      if (intakeTabs.includes(newTab) && isProfileReady(intake)) {
        setHoroscopeState(newTab === AppTab.HOROSCOPE ? 'MENU' : 'ANALYSIS');
      } else {
        setHoroscopeState('INPUT');
      }
    }
  };

  const handleAction = async (type: string, payload?: any) => {
    if (!mode) return;

    // Validation for place selection
    if (type === 'HOROSCOPE' || type === 'DAILY' || type === 'MUHURTA' || type === 'MATCHING' || type === 'LIFE_PARTNER' || type === 'NUMEROLOGY' || type === 'TIMELINE') {
      const checkIntake = type === 'MATCHING' ? matchingIntake.person1 : intake;
      if (!checkIntake.dob || !checkIntake.tob) {
        setError(t.enter_details_warning || 'Please enter birth date and time for accurate calculations.');
        return;
      }
      if (!checkIntake.lat || !checkIntake.lon) {
        setError(t.select_city_warning || 'Please select a city from the list for accurate calculations.');
        return;
      }
      if (type === 'MATCHING') {
        if (!matchingIntake.person2.dob || !matchingIntake.person2.tob) {
          setError(t.enter_details_warning || 'Please enter birth date and time for both persons.');
          return;
        }
        if (!matchingIntake.person2.lat || !matchingIntake.person2.lon) {
          setError(t.select_city_warning || 'Please select a city from the list for accurate calculations.');
          return;
        }
      }
    }

    // Determine display section name for consistent state
    let sectionName = payload || type;
    if (type === 'LIFE_PARTNER') sectionName = "Life Partner Analysis";
    if (type === 'DAILY') sectionName = payload + " Forecast";
    if (type === 'MATCHING') sectionName = t.matching;
    if (type === 'PRASHNA') sectionName = 'Prashna Analysis';
    if (type === 'VASTU') sectionName = 'Vastu Shastra';
    
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
        if (payload === 'menu_timeline') {
          changeTab(AppTab.TIMELINE);
          return;
        }
        if (payload === 'menu_numerology') {
          changeTab(AppTab.NUMEROLOGY);
          return;
        }

        let focusArea = payload;
        if (mode === 'SCHOLAR') {
          const scholarMapping: Record<string, string> = {
            'menu_details': 'menu_details',
            'menu_rasi': 'menu_rasi',
            'menu_navamsha': 'menu_navamsha',
            'menu_dasha': 'Vimshottari',
            'menu_ashtaka': 'Ashtakavarga',
            'menu_shadbala': 'menu_shadbala',
            'menu_shadvarga': 'menu_shadvarga',
            'menu_yogas': 'Yoga Analysis',
            'menu_maitri': 'Panchadha Graha Maitri',
            'menu_hora': 'Shastriya Analysis',
            'menu_bhava_analysis': 'menu_bhava_analysis',
            'menu_character': 'menu_character'
          };
          focusArea = scholarMapping[payload] || payload;
        } else {
          const seekerMapping: Record<string, string> = {
            'menu_basic_details': 'menu_basic_details',
            'menu_yoga': 'menu_yoga',
            'menu_career': 'menu_career',
            'menu_health': 'menu_health',
            'menu_money': 'menu_money',
            'menu_transit': 'menu_transit',
            'menu_dasha_effect': 'menu_dasha_effect',
            'menu_sade_sati': 'menu_sade_sati',
            'menu_gemstones': 'menu_gemstones',
            'menu_nakshatra': 'menu_nakshatra',
            'menu_doshas': 'menu_doshas',
            'menu_character': 'menu_character'
          };
          focusArea = seekerMapping[payload] || payload;
        }
        res = await generateHoroscope({ ...intake, tob: `${intake.tob} ${intake.ampm}` }, focusArea, lang, mode);
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
      } else if (type === 'VASTU') {
        res = await generateVastuAnalysis(lang, mode!);
        setVastuHtml(res);
      }
      
      if (!res) throw new Error("The stars are silent. Please try again.");
      
      setAnalysisResult(res);
      const summary = `Celestial analysis for ${type === 'MATCHING' ? matchingIntake.person1.name + ' & ' + matchingIntake.person2.name : intake.name}`;
      saveToHistory(type, summary, res, structuredData);
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

  const cleanJson = (str: string) => {
    try {
      // Remove markdown code blocks if present
      let cleaned = str.replace(/```json\s?([\s\S]*?)```/g, '$1');
      cleaned = cleaned.replace(/```\s?([\s\S]*?)```/g, '$1');
      
      // Remove comments (single line and multi-line)
      cleaned = cleaned.replace(/\/\/.*$/gm, '');
      cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Remove trailing commas in objects and arrays
      cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
      
      // Find the first '{' or '[' and the last '}' or ']' to isolate the JSON object
      const firstBrace = cleaned.indexOf('{');
      const firstBracket = cleaned.indexOf('[');
      const lastBrace = cleaned.lastIndexOf('}');
      const lastBracket = cleaned.lastIndexOf(']');
      
      let start = -1;
      let end = -1;
      
      if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        start = firstBrace;
        end = lastBrace;
      } else if (firstBracket !== -1) {
        start = firstBracket;
        end = lastBracket;
      }
      
      if (start !== -1 && end !== -1 && end > start) {
        cleaned = cleaned.substring(start, end + 1);
      }
      
      return cleaned.trim();
    } catch (e) {
      return str;
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
          const rawContent = match[1];
          try {
            const cleaned = cleanJson(rawContent);
            const data = JSON.parse(cleaned);
            console.log("Found structured data:", data.type);
            if (data.type === 'loshu_grid') {
              foundLoshu = data;
            } else {
              foundData = data;
            }
          } catch (e) {
            console.error("Failed to parse JSON from script tag. Raw content:", rawContent.substring(0, 100) + "...");
            console.error(e);
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
          const rawContent = oldMatch[1];
          try {
            const cleaned = cleanJson(rawContent);
            const data = JSON.parse(cleaned);
            setStructuredData(data);
            setChartData(Array.isArray(data) ? data : (data.planets || null));
          } catch (e) {
            console.error("Failed to parse old-style chart data. Raw content:", rawContent.substring(0, 100) + "...");
            console.error(e);
          }
        }
      }
    } catch (e) {
      console.error("Error in extractChartData", e);
    }
  };

  const goBack = () => {
    setError(null);
    if (vastuHtml) { setVastuHtml(null); return; }
    if (analysisResult) { 
      setAnalysisResult(null); 
      setMuhurthaImage(null);
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
      newHistory.pop();
      const prevTab = newHistory[newHistory.length - 1];
      setTabHistory(newHistory);
      setActiveTab(prevTab);
      setHoroscopeState('INPUT');
    } else if (activeTab !== AppTab.DASHBOARD) {
      setActiveTab(AppTab.DASHBOARD);
      setTabHistory([AppTab.DASHBOARD]);
      setHoroscopeState('INPUT');
    } else {
      // If on Dashboard, go back to Mode Selection
      setOnboardingStep(OnboardingStep.MODE_SELECT);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('astro_user_intake');
    localStorage.removeItem('astro_readings_history');
    localStorage.removeItem('astro_appointments');
    const newUid = generateUserId();
    setIntake({ id: newUid, name: '', dob: '', tob: '', pob: '', lat: '0', lon: '0', tz: '5.5', ampm: 'AM', gender: 'Male' });
    setOnboardingStep(OnboardingStep.SPLASH);
    setActiveTab(AppTab.DASHBOARD);
    setIsProfileOpen(false);
  };

  const ProfileButton = () => (
    <div className="fixed top-20 right-4 sm:top-24 sm:right-10 z-[110] flex flex-row-reverse items-center gap-2 pointer-events-none">
      <button 
        onClick={() => setIsProfileOpen(true)}
        className="pointer-events-auto w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-[var(--accent-primary)] via-[var(--color-gold-dark)] to-[var(--accent-primary)] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.5)] border-2 border-[var(--text-primary)] hover:scale-110 active:scale-95 transition-all group overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] opacity-20 mix-blend-overlay"></div>
        {intake.name ? (
          <span className="text-[var(--text-primary)] font-black text-sm sm:text-xl uppercase relative z-10">{intake.name[0]}</span>
        ) : (
          <User className="w-5 h-5 sm:w-7 sm:h-7 text-[var(--text-primary)] relative z-10" />
        )}
        <div className="absolute inset-0 bg-[var(--accent-primary)]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
      
      <AnimatePresence>
        {isDirty && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={handleSaveProfile}
            className="pointer-events-auto bg-[var(--bg-secondary)]/80 backdrop-blur-xl text-[var(--accent-primary)] px-5 py-2.5 rounded-full text-[10px] font-ancient font-black uppercase tracking-[0.2em] shadow-2xl border border-[var(--accent-primary)]/40 flex items-center gap-2 hover:bg-[var(--accent-primary)] hover:text-white dark:hover:text-[#020617] transition-all group"
          >
            <span className="animate-pulse group-hover:animate-none">💾</span> {t.save_info || 'Save Details'}
          </motion.button>
        )}
      </AnimatePresence>

      <button 
        onClick={() => {
          const newMode = mode === 'SEEKER' ? 'SCHOLAR' : 'SEEKER';
          setMode(newMode);
          localStorage.setItem('astro_logic_mode_v1', newMode);
        }}
        className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--bg-secondary)]/80 backdrop-blur-xl hover:bg-[var(--accent-primary)] border border-[var(--accent-primary)]/40 rounded-full transition-all group shadow-2xl"
      >
        <Sparkles size={14} className={`text-[var(--accent-primary)] group-hover:text-white dark:group-hover:text-[#020617] ${mode === 'SCHOLAR' ? 'animate-pulse' : ''}`} />
        <span className="text-[10px] font-ancient font-black text-[var(--accent-primary)] group-hover:text-white dark:group-hover:text-[#020617] uppercase tracking-widest">{mode === 'SCHOLAR' ? (t.scholar || 'Scholar') : (t.seeker || 'Seeker')}</span>
      </button>
    </div>
  );

  const setToNow = () => {
    const now = new Date();
    const dob = now.toISOString().split('T')[0];
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const tob = `${hours.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setIntake(prev => ({ ...prev, dob, tob, ampm }));
  };

  const setMatchingToNow = (person: 'person1' | 'person2') => {
    const now = new Date();
    const dob = now.toISOString().split('T')[0];
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const tob = `${hours.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setMatchingIntake(prev => ({
      ...prev,
      [person]: { ...prev[person], dob, tob, ampm }
    }));
  };

  const renderHoroscopeIntake = (onNext?: () => void) => (
    <div className={`min-h-screen flex flex-col animate-in slide-in-from-right duration-500 overflow-x-hidden ${mode === 'SCHOLAR' ? 'scholar-theme' : 'seeker-theme'}`}>
      <header className="glass-premium p-4 sm:p-8 flex items-center justify-start shadow-2xl sticky top-0 z-20 border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all group">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h2 className="text-lg sm:text-3xl font-ancient font-black gold-leaf uppercase tracking-widest leading-none">ASTRO LOGIC</h2>
            <p className="text-[8px] sm:text-[10px] font-premium uppercase tracking-[0.3em] text-[var(--accent-primary)]/80 mt-1">
              {mode === 'SCHOLAR' ? 'Scholar Mode • Siddhantic Precision' : 'Seeker Mode • Sacred Guidance'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[var(--accent-primary)] rounded-xl flex items-center justify-center text-white dark:text-[#020617] shadow-2xl">
            <Sparkles size={24} className="sm:w-8 sm:h-8" />
          </div>
        </div>
      </header>
      <div className="flex-1 p-3 sm:p-10 space-y-6 max-w-3xl mx-auto w-full overflow-y-auto pb-32 z-10">
        <div className="grid gap-6 p-5 sm:p-16 rounded-lg border border-[var(--border-primary)] shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden bg-[var(--bg-secondary)]/50">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
          
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-[0.3em] ml-1">{t.name_of_soul}</label>
            <input 
              value={intake.name} 
              onChange={e => setIntake({...intake, name: e.target.value})} 
              placeholder={t.enter_full_name} 
              className="details-input p-5 text-sm sm:text-base font-premium font-bold bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-primary)]/80 rounded-lg focus:border-[var(--accent-primary)] transition-all shadow-inner" 
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-[0.3em] ml-1">{t.birth_date}</label>
                <button 
                  onClick={setToNow}
                  className="text-[8px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-widest hover:text-[var(--accent-primary)] transition-colors flex items-center gap-1.5 bg-[var(--bg-primary)]/50 px-3 py-1 rounded-full border border-[var(--border-primary)]"
                >
                  <Clock size={10} /> {t.set_to_now || 'Set to Now'}
                </button>
              </div>
              <input 
                type="date" 
                value={intake.dob} 
                onChange={e => setIntake({...intake, dob: e.target.value})} 
                className="details-input p-5 text-sm sm:text-base font-premium font-bold bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg focus:border-[var(--accent-primary)] transition-all shadow-inner" 
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-[0.3em] ml-1">{t.birth_time}</label>
              <TimePicker time={intake.tob} ampm={intake.ampm || 'AM'} onChange={(t, a) => setIntake({...intake, tob: t, ampm: a})} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-[0.3em] ml-1">{t.birth_location}</label>
            <CitySearch value={intake.pob} onChange={v => setIntake({...intake, pob: v.pincode ? `${v.name} (${v.pincode})` : v.name, lat: v.lat, lon: v.lon, tz: v.tz, pincode: v.pincode})} placeholder={t.search_city_placeholder} />
            {!intake.lat && intake.pob && (
              <p className="text-[9px] text-red-400 font-ancient font-black animate-pulse ml-1 tracking-widest uppercase">{t.select_city_warning}</p>
            )}
          </div>
            {intake.lat && (
              <div className="flex gap-6 text-[9px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-[0.2em] px-2">
                <span className="flex items-center gap-1.5"><MapPin size={10} /> {t.latitude || 'Lat'}: {intake.lat}</span>
                <span>{t.longitude || 'Lon'}: {intake.lon}</span>
                <span>{t.timezone || 'TZ'}: {intake.tz}</span>
              </div>
            )}
          <div className="pt-10">
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                boxShadow: ["0 0 20px rgba(var(--accent-primary-rgb), 0.3)", "0 0 40px rgba(var(--accent-primary-rgb), 0.6)", "0 0 20px rgba(var(--accent-primary-rgb), 0.3)"]
              }}
              transition={{
                opacity: { duration: 0.5 },
                y: { duration: 0.5 },
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext || (() => setHoroscopeState('MENU'))}
              className="w-full py-6 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--color-gold)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] rounded-xl font-ancient font-black uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all border-2 border-[var(--border-primary)] text-sm sm:text-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10 drop-shadow-md">
                {onNext ? (t.continue || 'Continue ➔') : (t.next_choose_analysis || 'Next: Choose Analysis ➔')}
              </span>
            </motion.button>
          </div>
        </div>
        
        {savedProfiles.length > 0 && (
          <div className="p-6 bg-[var(--bg-secondary)]/50 backdrop-blur-md border border-[var(--border-primary)] rounded-lg space-y-4">
            <h3 className="text-[9px] font-ancient font-bold uppercase text-[var(--accent-primary)]/60 tracking-[0.3em] text-center">{t.saved_profiles_title}</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {savedProfiles.map((p, i) => (
                <button key={i} onClick={() => setIntake(p as any)} className="px-4 py-2 bg-[var(--bg-primary)]/50 rounded-lg text-[11px] font-ancient font-bold text-[var(--text-primary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)] shadow-lg transition-all active:scale-95">
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="bg-[var(--bg-primary)] fixed bottom-0 left-0 right-0 z-[60] flex shadow-[0_-15px_50px_rgba(0,0,0,0.9)] border-t-2 border-[var(--border-primary)]">
        <button onClick={handleSaveProfile} className="flex-1 py-7 bg-transparent text-[var(--accent-primary)]/90 hover:text-[var(--accent-primary)] uppercase text-[10px] font-ancient font-bold tracking-[0.2em] border-r border-[var(--border-primary)] active:bg-[var(--bg-secondary)]/10 transition-colors">💾 {t.save_info}</button>
        <button 
          onClick={onNext || (() => setHoroscopeState('MENU'))} 
          className="flex-[2] py-7 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--color-gold)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] uppercase text-xs sm:text-sm font-ancient font-black tracking-[0.4em] active:brightness-110 transition-all shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.5)] hover:brightness-125 relative overflow-hidden group animate-pulse-slow"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative z-10">{(onNext ? t.save_continue : t.next_choose_analysis) || 'Continue'} ➔</span>
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (analysisResult) {
      if (analysisResult.trim() === '') {
        return (
          <div className={`min-h-screen flex items-center justify-center ${mode === 'SCHOLAR' ? 'scholar-theme' : 'seeker-theme'}`}>
            <div className="text-center p-12 bg-[var(--bg-secondary)]/50 backdrop-blur-xl rounded-lg border border-[var(--accent-primary)]/40 shadow-2xl max-w-md mx-auto relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
              <p className="text-[var(--accent-primary)] font-ancient font-bold mb-8 tracking-widest">{t.stars_obscured || 'The stars are obscured by clouds. Please try again.'}</p>
              <button onClick={goBack} className="px-8 py-3 bg-[var(--accent-primary)] text-white dark:text-[#1e1b4b] rounded-lg font-ancient font-black uppercase tracking-widest hover:scale-105 transition-all">{t.go_back || 'Go Back'}</button>
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
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`min-h-screen flex flex-col relative overflow-x-hidden ${mode === 'SCHOLAR' ? 'scholar-theme' : 'seeker-theme'}`}
        >
          <MandalaBackground />
          <header className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-3 sm:p-6 flex items-center justify-start shadow-2xl sticky top-0 z-30 border-b border-[var(--accent-primary)]/40">
            <div className="flex items-center">
              <button onClick={goBack} className="p-1.5 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all group">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="ml-2 text-base sm:text-2xl font-ancient font-black gold-leaf truncate uppercase tracking-[0.15em]">{currentSection}</h2>
            </div>
            <button onClick={() => { changeTab(AppTab.DASHBOARD); }} className="p-1.5 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all mr-12 sm:mr-64">
              <Compass className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </header>
          <div className="flex-1 p-3 sm:p-10 md:p-16 overflow-y-auto max-w-6xl mx-auto w-full pb-32 z-10">
            {error && (
              <div className="mb-10 p-6 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-center font-ancient font-bold shadow-2xl">
                <span className="text-3xl block mb-2">✦</span>
                {error}
                <button onClick={() => setError(null)} className="block mx-auto mt-4 text-xs underline uppercase tracking-widest opacity-90 hover:opacity-100">{t.dismiss || 'Dismiss'}</button>
              </div>
            )}
            {structuredData && structuredData.type === 'birth_details' && structuredData.details && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-16"
              >
                <h3 className="text-center text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.4em] mb-8 text-sm sm:text-xl">
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
                className="mb-16"
              >
                {structuredData && structuredData.type === 'birth_details' && structuredData.details && (currentSection === 'menu_basic_details' || currentSection === 'menu_details') && (!(mode === 'SCHOLAR' && currentSection === 'menu_details')) && (
                  <BirthSummary details={structuredData.details} lang={lang} />
                )}
                {(!(mode === 'SCHOLAR' && (currentSection === 'menu_details' || currentSection === 'menu_navamsha' || currentSection === 'menu_bhava_analysis' || currentSection === 'menu_shadvarga'))) && (
                  <>
                    <h3 className="text-center text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.4em] mb-8 text-sm sm:text-xl">{t.celestial_map}</h3>
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
                className="mb-16"
              >
                <h3 className="text-center text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.4em] mb-8 text-sm sm:text-xl">{t.menu_navamsha || 'Navamsha D9'}</h3>
                <SouthIndianChart data={structuredData.planets} lang={lang} title={t.menu_navamsha || 'Navamsha D9'} />
              </motion.div>
            )}

            {structuredData && structuredData.type === 'ashtakavarga' && structuredData.table && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-16"
              >
                <h3 className="text-center text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.4em] mb-8 text-sm sm:text-xl">{t.ashtakavarga || 'Ashtakavarga'}</h3>
                <AshtakavargaTable data={structuredData.table} planetPositions={chartData || []} />
              </motion.div>
            )}

            {(structuredData && (structuredData.type === 'vimshottari' || structuredData.type === 'dasha_data') && structuredData.dashas) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-16"
              >
                <h3 className="text-center text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.4em] mb-8 text-sm sm:text-xl">{t.vimshottari || 'Vimshottari Dasha'}</h3>
                <VimshottariTable dashas={structuredData.dashas} />
              </motion.div>
            )}

            {structuredData && structuredData.type === 'grahamaitri' && structuredData.matrix && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-16"
              >
                <h3 className="text-center text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.4em] mb-8 text-sm sm:text-xl">{t.menu_maitri || 'Panchadha Graha Maitri'}</h3>
                <GrahaMaitriTable matrix={structuredData.matrix} />
              </motion.div>
            )}

            {structuredData && structuredData.type === 'bhavaphala' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-16 space-y-16"
              >
                {structuredData.planets && (
                  <div className="mb-16">
                    <h3 className="text-center text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.4em] mb-8 text-sm sm:text-xl">{t.menu_bhava || 'Bhava Chalit'}</h3>
                    <SouthIndianChart data={structuredData.planets} lang={lang} title={t.menu_bhava || 'Bhava Chalit'} />
                  </div>
                )}
                {structuredData.houses && (
                  <div className="mb-16">
                    <h3 className="text-center text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.4em] mb-8 text-sm sm:text-xl">{t.menu_bhava_analysis || '12 Houses Analysis'}</h3>
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
                className="mb-16 space-y-16"
              >
                <SadvargaChart vargas={structuredData.vargas} lords={structuredData.lords} lang={lang} />
              </motion.div>
            )}

            {structuredData && structuredData.type === 'shadbala' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-16 space-y-16"
              >
                <ShadbalaChart lang={lang} shadbalaData={structuredData.shadbala} />
              </motion.div>
            )}

            {structuredData && structuredData.type === 'muhurta_details' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-16"
              >
                <MuhurtaAnalysis data={structuredData} lang={lang} />
              </motion.div>
            )}

            {activeTab === AppTab.MUHURTHA && muhurthaImage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-16 overflow-hidden rounded-lg border border-[var(--accent-primary)]/40 shadow-2xl relative"
              >
                <div className="absolute inset-0 border-[12px] border-white/5 pointer-events-none"></div>
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
                className="mb-16"
              >
                <h3 className="text-center text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.4em] mb-8 text-sm sm:text-xl">{t.loshu_grid || 'Loshu Grid'}</h3>
                <LoshuGrid grid={structuredData.grid} present={structuredData.present || []} />
              </motion.div>
            )}


            {(!(mode === 'SCHOLAR' && (currentSection === 'menu_details' || currentSection === 'menu_navamsha'))) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`analysis-rich-text detailed-view p-6 sm:p-16 md:p-24 bg-[var(--bg-secondary)]/50 backdrop-blur-3xl border border-[var(--accent-primary)]/30 shadow-2xl rounded-lg overflow-x-auto break-words relative ${mode === 'SCHOLAR' ? 'scholar-view' : 'seeker-view'}`} 
              >
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
                <div dangerouslySetInnerHTML={{ __html: analysisResult }} />
              </motion.div>
            )}

            {mode === 'SEEKER' && (
              <div className="mt-16 p-10 sm:p-16 bg-[var(--bg-secondary)]/50 backdrop-blur-xl border border-[var(--accent-primary)]/20 rounded-lg text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
                <p className="text-lg sm:text-2xl font-premium italic text-[var(--accent-primary)] leading-relaxed max-w-3xl mx-auto">
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
            transition={{ duration: 0.15 }}
            className={`min-h-screen flex flex-col overflow-x-hidden relative ${mode === 'SCHOLAR' ? 'scholar-theme' : 'seeker-theme'}`}
          >
            <MandalaBackground />
            <div className={`fixed inset-0 pointer-events-none z-0 opacity-20 bg-[var(--bg-primary)]`}></div>
            {error && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[70] w-[90%] max-w-md p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800 text-center font-bold shadow-2xl animate-in slide-in-from-top-4">
                {error}
                <button onClick={() => setError(null)} className="ml-4 text-xs underline">✕</button>
              </div>
            )}
            <header className="glass-premium p-3 sm:p-8 flex items-center justify-start shadow-2xl sticky top-0 z-20 border-b border-[var(--accent-primary)]/30">
              <div className="flex items-center gap-2 sm:gap-6">
                <button onClick={goBack} className="p-1.5 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all group">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div>
                  <h2 className="text-lg sm:text-3xl font-ancient font-black gold-leaf uppercase tracking-widest leading-none">
                  {t.dashboard || 'Dashboard'}
                  {!isOnline && (
                    <span className="ml-3 inline-flex items-center px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-[8px] sm:text-[10px] text-red-400 font-bold uppercase tracking-widest animate-pulse">
                      ● Offline
                    </span>
                  )}
                </h2>
                  <p className="text-[7px] sm:text-[10px] font-premium uppercase tracking-[0.2em] text-[var(--accent-primary)]/80 mt-1">
                    {mode === 'SCHOLAR' ? 'Scholar Mode • Siddhantic Precision' : 'Seeker Mode • Sacred Guidance'}
                  </p>
                </div>
                <div className="relative group hidden sm:block">
                  <select 
                    value={lang} 
                    onChange={(e) => setLang(e.target.value as Language)} 
                    className="bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-[10px] sm:text-[12px] font-ancient font-bold rounded-lg px-4 py-2 appearance-none cursor-pointer shadow-sm tracking-widest hover:border-[var(--accent-primary)] transition-all outline-none"
                  >
                    {LANGUAGES.map(l => (
                      <option key={l.code} value={l.code} className="bg-white dark:bg-[#020617] text-slate-800 dark:text-white">{l.nativeName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:hidden">
                <div className="relative group">
                  <select 
                    value={lang} 
                    onChange={(e) => setLang(e.target.value as Language)} 
                    className="bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-[10px] font-ancient font-bold rounded-lg px-3 py-1.5 appearance-none cursor-pointer shadow-sm tracking-widest hover:border-[var(--accent-primary)] transition-all outline-none"
                  >
                    {LANGUAGES.map(l => (
                      <option key={l.code} value={l.code} className="bg-white dark:bg-[#020617] text-slate-800 dark:text-white">{l.nativeName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <DigitalClock />
                <button 
                  onClick={() => setOnboardingStep(OnboardingStep.MODE_SELECT)}
                  className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-[var(--accent-primary)] text-white dark:text-[#020617] rounded-xl text-[9px] sm:text-[10px] font-ancient font-black uppercase tracking-[0.2em] hover:bg-[var(--color-gold-light)] transition-all shadow-lg"
                >
                  {mode}
                </button>
              </div>
            </header>

            {/* Planetary Transit Ticker */}
            <div className="w-full bg-[var(--bg-secondary)]/20 backdrop-blur-sm border-y border-[var(--accent-primary)]/10 py-2 overflow-hidden mb-8 z-10">
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
                    <span className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-widest">{tr.p}</span>
                    <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-widest">{t.planetary_transit_in || 'in'}</span>
                    <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">{tr.r}</span>
                    <span className="text-[10px] font-bold text-[var(--accent-primary)]">{tr.d}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <section className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-16 text-center max-w-7xl mx-auto w-full relative z-10">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-8 sm:mb-20 scale-[0.65] sm:scale-100"
              >
                <FantasticLogo />
              </motion.div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-7xl md:text-9xl font-ancient font-black gold-leaf mb-3 sm:mb-8 tracking-widest uppercase leading-tight drop-shadow-2xl"
              >
                {t.brand_name || 'Astro Logic'}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs sm:text-2xl md:text-3xl font-premium font-bold uppercase tracking-[0.3em] text-[var(--accent-primary)] max-w-4xl mx-auto mb-8 sm:mb-20 leading-relaxed px-4"
              >
                {t.tagline}
              </motion.p>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 w-full px-1 sm:px-2 mb-12">
                {[
                  { id: AppTab.HOROSCOPE, label: t.horoscope, icon: '📜', desc: mode === 'SCHOLAR' ? (t.shastriya || 'Shastriya') : (t.life_path || 'Life Path') },
                  { id: AppTab.DAILY_PREDICTION, label: t.daily, icon: '📅', desc: mode === 'SCHOLAR' ? t.timeline : t.daily_title },
                  { id: AppTab.PANCHANGA, label: t.panchanga_title, icon: '🕉️', desc: mode === 'SCHOLAR' ? t.siddhantic : t.today_panchanga },
                  { id: AppTab.TIMELINE, label: t.timeline_title, icon: '📈', desc: mode === 'SCHOLAR' ? t.life_phase : t.life_path },
                  { id: AppTab.MATCHING, label: t.matching, icon: '💑', desc: mode === 'SCHOLAR' ? t.matching_title : t.matching },
                  { id: AppTab.PRASHNA, label: t.prashna, icon: '❓', desc: t.oracle },
                  { id: AppTab.LIFE_PARTNER, label: t.life_partner, icon: '💍', desc: t.life_partner_analysis },
                  { id: AppTab.MUHURTHA, label: t.muhurta, icon: '⏰', desc: mode === 'SCHOLAR' ? t.muhurta_title : t.muhurta },
                  { id: AppTab.NUMEROLOGY, label: t.numerology, icon: '🔢', desc: t.menu_numerology },
                  { id: AppTab.SAVED_READINGS, label: t.saved_readings, icon: '📥', desc: t.saved_profiles },
                  { id: AppTab.VASTU, label: t.vastu_title, icon: '🏠', desc: mode === 'SCHOLAR' ? t.vastu_analysis : t.home_harmony },
                  { id: AppTab.PALM_READING, label: t.palm_reading_title, icon: '✋', desc: t.palm_reading_desc },
                  { id: AppTab.BLOG, label: t.blog, icon: '📚', desc: t.blog_desc }
                ].map((item, idx) => (
                  <motion.button 
                    key={item.id} 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    onClick={() => changeTab(item.id)} 
                    className="group relative bg-[var(--bg-secondary)]/50 border border-[var(--accent-primary)]/30 rounded-lg p-3 sm:p-8 transition-all duration-500 hover:bg-[var(--accent-primary)]/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col items-center gap-1 sm:gap-4 shadow-xl backdrop-blur-md overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
                    <span className="text-3xl sm:text-6xl group-hover:scale-110 group-hover:rotate-6 transition-all drop-shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.3)]">{item.icon}</span>
                    <div className="space-y-1 relative z-10">
                      <h3 className="text-[9px] sm:text-sm md:text-lg font-ancient font-black uppercase tracking-widest gold-leaf">{item.label}</h3>
                      <p className="text-[7px] sm:text-[10px] text-[var(--accent-primary)] uppercase font-premium font-bold tracking-[0.2em] leading-tight">{item.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="w-full max-w-6xl mx-auto px-4 space-y-12 mb-20">
                {/* Main Action: Contact Astrologer */}
                <div className="mb-12">
                  <ContactAstrologer 
                    lang={lang} 
                    onDonate={() => setIsDonateOpen(true)} 
                    onFeedback={() => setIsFeedbackOpen(true)} 
                  />
                </div>

                <DailyWisdom lang={lang} />

                {mode === 'SCHOLAR' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 border border-[var(--accent-primary)]/30 rounded-lg bg-[var(--bg-secondary)]/50 backdrop-blur-xl text-center space-y-6 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
                    <h3 className="text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.5em] text-xs sm:text-sm gold-leaf relative z-10">{t.classical_source_authority}</h3>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-10 opacity-90 relative z-10">
                      {['Brihat Parashara Hora Shastra', 'Brihat Jataka', 'Prashna Marga', 'Phaladeepika', 'Jataka Parijata', 'Saravali'].map(book => (
                        <span key={book} className="text-[var(--accent-primary)] text-[10px] sm:text-xs font-premium font-bold italic border-b border-[var(--accent-primary)]/40 pb-1 hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all cursor-default">{book}</span>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <MuhurthaLiveFeed lang={lang} />
                  {mode !== 'SCHOLAR' && <VedicRemedyGenerator lang={lang} />}
                </div>
                
                <CSRBanner lang={lang} />

                {/* Feedback and Suggestions Section */}
                <div className="mt-24 mb-16 space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl sm:text-5xl font-ancient font-black gold-leaf uppercase tracking-[0.3em]">
                      {t.feedback}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent mx-auto rounded-full opacity-50" />
                  </div>

                  <div className="max-w-3xl mx-auto">
                    {/* Suggestion Box */}
                    <SuggestionBox lang={lang} />
                  </div>
                </div>
              </div>

              {/* Support features removed */}
            </section>
            

            
            <footer className="w-full py-12 text-center text-[9px] sm:text-[11px] text-[var(--accent-primary)]/70 font-ancient font-black uppercase tracking-[0.6em] z-10 px-4 border-t border-[var(--accent-primary)]/10">
              <div className="max-w-4xl mx-auto">
                {t.footer_text}
              </div>
            </footer>
          </motion.div>
        );
      case AppTab.HOROSCOPE:
        if (horoscopeState === 'INPUT') {
          return renderHoroscopeIntake(() => setHoroscopeState('MENU'));
        }
        return (
          <motion.div 
            key="horoscope-menu"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`min-h-screen flex flex-col relative overflow-x-hidden ${mode === 'SCHOLAR' ? 'scholar-theme' : 'seeker-theme'}`}
          >
            <header className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-4 sm:p-8 flex items-center justify-start shadow-2xl sticky top-0 z-20 border-b border-[var(--accent-primary)]/30">
              <button onClick={goBack} className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all group">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="ml-3 text-lg sm:text-2xl font-ancient font-black gold-leaf uppercase tracking-widest">{t.analysis_tab_title}</h2>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-8 p-3 sm:p-12 flex-1 overflow-y-auto max-w-6xl mx-auto w-full pb-32 z-10">
              {(mode === 'SEEKER' ? [
                { id: 'menu_basic_details', label: t.menu_basic_details },
                { id: 'menu_yoga', label: t.menu_yoga },
                { id: 'LIFE_PARTNER', label: t.life_partner },
                { id: AppTab.DAILY_PREDICTION, label: t.daily },
                { id: AppTab.MATCHING, label: t.matching },
                { id: AppTab.MUHURTHA, label: t.muhurta },
                { id: AppTab.PRASHNA, label: t.prashna },
                { id: 'menu_career', label: t.menu_career },
                { id: 'menu_health', label: t.menu_health },
                { id: 'menu_money', label: t.menu_money },
                { id: 'menu_transit', label: t.menu_transit },
                { id: 'menu_dasha_effect', label: t.menu_dasha_effect },
                { id: 'menu_sade_sati', label: t.menu_sade_sati },
                { id: 'menu_gemstones', label: t.menu_gemstones },
                { id: 'menu_nakshatra', label: t.menu_nakshatra },
                { id: 'menu_doshas', label: t.menu_doshas },
                { id: 'menu_character', label: t.menu_character },
                { id: 'menu_numerology', label: t.menu_numerology }
              ] : [ 
                { id: 'menu_details', label: t.birth_analysis }, 
                { id: 'menu_character', label: t.menu_character },
                { id: 'menu_numerology', label: t.menu_numerology },
                { id: 'LIFE_PARTNER', label: t.life_partner },
                { id: AppTab.DAILY_PREDICTION, label: t.daily },
                { id: AppTab.MATCHING, label: t.matching },
                { id: AppTab.MUHURTHA, label: t.muhurta },
                { id: AppTab.PRASHNA, label: t.prashna },
                { id: 'menu_timeline', label: t.timeline },
                { id: 'menu_hora', label: t.shastriya },
                { id: 'menu_rasi', label: t.rasi_kundli }, 
                { id: 'menu_navamsha', label: t.menu_navamsha },
                { id: 'menu_bhava_analysis', label: t.menu_bhava_analysis },
                { id: 'menu_yogas', label: t.menu_yogas },
                { id: 'menu_maitri', label: t.menu_maitri },
                { id: 'menu_dasha', label: t.vimshottari }, 
                { id: 'menu_shadvarga', label: t.shadvarga_strengths || 'Shadvarga' },
                { id: 'menu_shadbala', label: t.shadbala_analysis || 'Shadbala' },
                { id: 'menu_ashtaka', label: t.ashtakavarga || 'Ashtakavarga' } 
              ]).map((item, idx) => (
                <motion.button 
                  key={item.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  id={item.id}
                  onClick={() => {
                    if (item.id === 'LIFE_PARTNER') {
                      setHoroscopeState('ANALYSIS');
                      handleAction('LIFE_PARTNER');
                    } else if (item.id === AppTab.DAILY_PREDICTION) {
                      changeTab(AppTab.DAILY_PREDICTION);
                    } else if (item.id === AppTab.MATCHING) {
                      changeTab(AppTab.MATCHING);
                    } else if (item.id === AppTab.MUHURTHA) {
                      changeTab(AppTab.MUHURTHA);
                    } else if (item.id === AppTab.PRASHNA) {
                      changeTab(AppTab.PRASHNA);
                    } else if (item.id === 'menu_timeline') {
                      changeTab(AppTab.TIMELINE);
                    } else if (item.id === 'menu_numerology') {
                      changeTab(AppTab.NUMEROLOGY);
                    } else {
                      setHoroscopeState('ANALYSIS');
                      handleAction('HOROSCOPE', item.id);
                    }
                  }} 
                  className="bg-[var(--bg-secondary)]/50 border border-[var(--accent-primary)]/30 group p-4 sm:p-12 rounded-lg shadow-xl transition-all backdrop-blur-md relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
                  <span className="text-xs sm:text-lg md:text-xl font-ancient font-black text-[var(--accent-primary)] group-hover:gold-leaf transition-colors uppercase tracking-widest leading-tight relative z-10">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );
      case AppTab.DAILY_PREDICTION:
        return (
          <motion.div 
            key="daily"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`min-h-screen flex flex-col relative overflow-x-hidden ${mode === 'SCHOLAR' ? 'scholar-theme' : 'seeker-theme'}`}
          >
             <MandalaBackground />
             <header className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-4 sm:p-8 flex items-center justify-start shadow-2xl sticky top-0 z-20 border-b border-[var(--accent-primary)]/30">
                <button onClick={goBack} className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all group">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="ml-3 text-lg sm:text-2xl font-ancient font-black gold-leaf tracking-tight uppercase tracking-widest">{t.daily_title}</h2>
             </header>
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-8 p-3 sm:p-12 max-w-6xl mx-auto w-full pb-32 z-10">
                {RASIS.map((rasi, idx) => (
                  <motion.button 
                    key={rasi.name} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction('DAILY', rasi.name)} 
                    className="bg-[var(--bg-secondary)]/50 border border-[var(--accent-primary)]/30 aspect-square flex flex-col items-center justify-center gap-2 sm:gap-5 group rounded-lg shadow-xl backdrop-blur-md relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
                    <span className="text-4xl sm:text-7xl group-hover:rotate-6 transition-all drop-shadow-2xl relative z-10">{rasi.icon}</span>
                    <span className="text-[10px] sm:text-sm md:text-lg font-ancient font-black uppercase tracking-widest text-[var(--accent-primary)] group-hover:gold-leaf relative z-10">{t[rasi.label_key] || rasi.name}</span>
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
            transition={{ duration: 0.15 }}
            className={`min-h-screen flex flex-col relative overflow-x-hidden ${mode === 'SCHOLAR' ? 'scholar-theme' : 'seeker-theme'}`}
          >
             <MandalaBackground />
             <header className="bg-[var(--bg-primary)]/80 backdrop-blur-xl p-3 sm:p-8 flex items-center justify-start shadow-2xl sticky top-0 z-20 border-b border-[var(--border-primary)]">
                <button onClick={goBack} className="p-1.5 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all group">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="ml-2 text-base sm:text-2xl font-ancient font-black gold-leaf uppercase tracking-widest">{t.matching_title || 'Matching'}</h2>
             </header>
             <div className="p-3 sm:p-10 md:p-16 max-w-5xl mx-auto w-full space-y-6 sm:space-y-20 pb-32 z-10">
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 sm:p-14 bg-[var(--bg-secondary)]/50 border border-[var(--border-primary)] rounded-lg space-y-6 sm:space-y-8 shadow-2xl relative backdrop-blur-xl overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 sm:px-8 sm:py-2 bg-[var(--accent-primary)] text-white dark:text-[#020617] rounded-lg text-[8px] sm:text-sm font-ancient font-black uppercase tracking-widest shadow-xl border border-[var(--border-primary)] flex items-center gap-2 z-10">
                    {t.partner_one} (Bride)
                    <button 
                      onClick={() => handleSaveToProfiles(matchingIntake.person1)}
                      className="ml-1 sm:ml-2 p-1 bg-[var(--bg-primary)] text-[var(--accent-primary)] rounded-full hover:scale-110 transition-all"
                      title="Save Profile"
                    >
                      <Save size={10} className="sm:w-3 sm:h-3" />
                    </button>
                  </div>
                  <div className="grid gap-4 sm:gap-8 pt-2 sm:pt-4 relative z-10">
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      <label className="text-[9px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">{t.full_name || 'Full Name'}</label>
                      <input value={matchingIntake.person1.name} onChange={e => setMatchingIntake({...matchingIntake, person1: {...matchingIntake.person1, name: e.target.value}})} placeholder={t.first_name} className="details-input p-3 sm:p-4 text-xs sm:text-sm bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-primary)]/60" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                      <div className="flex flex-col gap-1.5 sm:gap-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">{t.birth_date || 'Birth Date'}</label>
                          <button onClick={() => setMatchingToNow('person1')} className="text-[7px] sm:text-[8px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-widest flex items-center gap-1 hover:text-[var(--accent-primary)] transition-colors"><Clock size={8} className="sm:w-2.5 sm:h-2.5" /> Now</button>
                        </div>
                        <input type="date" value={matchingIntake.person1.dob} onChange={e => setMatchingIntake({...matchingIntake, person1: {...matchingIntake.person1, dob: e.target.value}})} className="details-input p-3 sm:p-4 text-xs sm:text-sm font-bold bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)]" />
                      </div>
                      <div className="flex flex-col gap-1.5 sm:gap-2">
                        <label className="text-[9px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">{t.birth_time || 'Birth Time'}</label>
                        <TimePicker time={matchingIntake.person1.tob} ampm={matchingIntake.person1.ampm || 'AM'} onChange={(t, a) => setMatchingIntake({...matchingIntake, person1: {...matchingIntake.person1, tob: t, ampm: a}})} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 sm:gap-2 bg-[var(--bg-primary)]/50 p-3 sm:p-4 rounded-lg border border-[var(--border-primary)]">
                      <label className="text-[10px] sm:text-[11px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-widest ml-1 flex items-center gap-2">
                        <span className="text-base sm:text-lg">📍</span> {t.birth_location}
                      </label>
                      <CitySearch value={matchingIntake.person1.pob} onChange={v => setMatchingIntake({...matchingIntake, person1: {...matchingIntake.person1, pob: v.pincode ? `${v.name} (${v.pincode})` : v.name, lat: v.lat, lon: v.lon, tz: v.tz}})} placeholder={t.search_city_placeholder} />
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 sm:p-14 bg-[var(--bg-secondary)]/50 border border-[var(--border-primary)] rounded-lg space-y-6 sm:space-y-8 shadow-2xl relative backdrop-blur-xl overflow-hidden"
                >
                   <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
                   <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 sm:px-8 sm:py-2 bg-[var(--accent-primary)] text-white dark:text-[#020617] rounded-lg text-[8px] sm:text-sm font-ancient font-black uppercase tracking-widest shadow-xl border border-[var(--border-primary)] flex items-center gap-2 z-10">
                    {t.partner_two} (Groom)
                    <button 
                      onClick={() => handleSaveToProfiles(matchingIntake.person2)}
                      className="ml-1 sm:ml-2 p-1 bg-[var(--bg-primary)] text-[var(--accent-primary)] rounded-full hover:scale-110 transition-all"
                      title="Save Profile"
                    >
                      <Save size={10} className="sm:w-3 sm:h-3" />
                    </button>
                  </div>
                  <div className="grid gap-4 sm:gap-8 pt-2 sm:pt-4 relative z-10">
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      <label className="text-[9px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">{t.full_name || 'Full Name'}</label>
                      <input value={matchingIntake.person2.name} onChange={e => setMatchingIntake({...matchingIntake, person2: {...matchingIntake.person2, name: e.target.value}})} placeholder={t.second_name} className="details-input p-3 sm:p-4 text-xs sm:text-sm bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-primary)]/60" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                      <div className="flex flex-col gap-1.5 sm:gap-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">{t.birth_date || 'Birth Date'}</label>
                          <button onClick={() => setMatchingToNow('person2')} className="text-[7px] sm:text-[8px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-widest flex items-center gap-1 hover:text-[var(--accent-primary)] transition-colors"><Clock size={8} className="sm:w-2.5 sm:h-2.5" /> Now</button>
                        </div>
                        <input type="date" value={matchingIntake.person2.dob} onChange={e => setMatchingIntake({...matchingIntake, person2: {...matchingIntake.person2, dob: e.target.value}})} className="details-input p-3 sm:p-4 text-xs sm:text-sm font-bold bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)]" />
                      </div>
                      <div className="flex flex-col gap-1.5 sm:gap-2">
                        <label className="text-[9px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">{t.birth_time || 'Birth Time'}</label>
                        <TimePicker time={matchingIntake.person2.tob} ampm={matchingIntake.person2.ampm || 'AM'} onChange={(t, a) => setMatchingIntake({...matchingIntake, person2: {...matchingIntake.person2, tob: t, ampm: a}})} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 sm:gap-2 bg-[var(--bg-primary)]/50 p-3 sm:p-4 rounded-lg border border-[var(--border-primary)]">
                      <label className="text-[10px] sm:text-[11px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-widest ml-1 flex items-center gap-2">
                        <span className="text-base sm:text-lg">📍</span> {t.birth_location}
                      </label>
                      <CitySearch value={matchingIntake.person2.pob} onChange={v => setMatchingIntake({...matchingIntake, person2: {...matchingIntake.person2, pob: v.pincode ? `${v.name} (${v.pincode})` : v.name, lat: v.lat, lon: v.lon, tz: v.tz}})} placeholder={t.search_city_placeholder} />
                    </div>
                  </div>
                </motion.div>
                <motion.button 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction('MATCHING')} 
                  className="w-full py-5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] rounded-lg font-ancient font-black uppercase tracking-[0.25em] shadow-2xl transition-all border border-[var(--border-primary)] text-sm sm:text-2xl"
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
            transition={{ duration: 0.15 }}
            className={`min-h-screen flex flex-col relative overflow-x-hidden ${mode === 'SCHOLAR' ? 'scholar-theme' : 'seeker-theme'}`}
          >
             <MandalaBackground />
             <header className="bg-[var(--bg-primary)]/80 backdrop-blur-xl p-3 sm:p-8 flex items-center justify-start shadow-2xl sticky top-0 z-20 border-b border-[var(--border-primary)]">
                <button onClick={goBack} className="p-1.5 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all group">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="ml-2 text-base sm:text-2xl font-ancient font-black gold-leaf uppercase tracking-widest">{t.muhurtha_title || 'Muhurtha'}</h2>
             </header>
             <div className="p-3 sm:p-10 max-w-7xl mx-auto w-full z-10">
                <div className="mb-5 sm:mb-8 space-y-4 sm:space-y-6 bg-[var(--bg-secondary)]/50 p-4 sm:p-10 rounded-lg border border-[var(--border-primary)] backdrop-blur-xl shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
                    <div className="flex flex-col gap-1 sm:gap-1.5">
                      <label className="text-[9px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">{t.location}</label>
                      <CitySearch value={muhurtaInput.pob} onChange={v => setMuhurtaInput({...muhurtaInput, pob: v.pincode ? `${v.name} (${v.pincode})` : v.name, lat: v.lat, lon: v.lon, tz: v.tz})} placeholder={t.search_city_placeholder} />
                    </div>
                    <div className="flex flex-col gap-1 sm:gap-1.5">
                      <label className="text-[9px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">{t.timeframe}</label>
                      <input 
                        type="text" 
                        placeholder={t.timeframe_placeholder} 
                        value={muhurtaInput.timeframe}
                        onChange={(e) => setMuhurtaInput({...muhurtaInput, timeframe: e.target.value})}
                        className="details-input p-3 sm:p-4 text-xs sm:text-sm bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-primary)]/60"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative max-w-4xl mx-auto mb-8 sm:mb-12 space-y-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={muhurtaSearch} 
                      onChange={(e) => setMuhurtaSearch(e.target.value)} 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && muhurtaSearch.trim()) {
                          handleAction('MUHURTA', muhurtaSearch);
                        }
                      }}
                      placeholder={t.search_muhurta || 'Search for a purpose or outcome (e.g. Success in Business)...'} 
                      className="w-full bg-[var(--bg-secondary)]/50 border border-[var(--border-primary)] rounded-lg py-3 sm:py-5 px-6 sm:px-8 pl-12 sm:pl-16 text-[var(--text-primary)] font-ancient font-bold shadow-2xl focus:border-[var(--accent-primary)] outline-none transition-all text-sm sm:text-xl backdrop-blur-md"
                    />
                    <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-[var(--accent-primary)]">
                      <Search size={24} />
                    </div>
                    {muhurtaSearch && (
                      <button 
                         onClick={() => handleAction('MUHURTA', muhurtaSearch)}
                         className="absolute right-3 top-1/2 -translate-y-1/2 bg-[var(--accent-primary)] text-white dark:text-[#020617] px-4 py-2 rounded-md font-ancient font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                      >
                        {t.seek_muhurta || 'Find Alignment'}
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-2 px-2">
                    {[
                      { label: 'Success in Business', icon: '💼' },
                      { label: 'Starting Education', icon: '🎓' },
                      { label: 'Marriage Harmony', icon: '💍' },
                      { label: 'Jupiter-Moon Yoga', icon: '✨' },
                      { label: 'Property Purchase', icon: '🏠' },
                      { label: 'Siddhantic Alignment', icon: '🧘' }
                    ].map((tag) => (
                      <button 
                        key={tag.label}
                        onClick={() => {
                          setMuhurtaSearch(tag.label);
                          handleAction('MUHURTA', tag.label);
                        }}
                        className="px-3 py-1.5 bg-[var(--bg-secondary)]/80 border border-[var(--border-primary)] rounded-full text-[9px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest hover:bg-[var(--accent-primary)] hover:text-white dark:hover:text-[#020617] transition-all flex items-center gap-1.5"
                      >
                        <span>{tag.icon}</span>
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 pb-32">
                  {MUHURTA_TYPES.filter(m => {
                    const label = t[m.label_key] || m.label || "";
                    return label.toLowerCase().includes((muhurtaSearch || "").toLowerCase());
                  }).map((m, idx) => (
                    <motion.button 
                      key={m.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(245, 158, 11, 0.1)", borderColor: "rgba(245, 158, 11, 0.8)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAction('MUHURTA', m.label)} 
                      className="group bg-[var(--bg-secondary)]/50 border border-[var(--border-primary)] p-5 sm:p-10 rounded-lg transition-all duration-300 flex flex-col items-center gap-3 sm:gap-5 shadow-xl backdrop-blur-xl"
                    >
                      <span className="text-2xl sm:text-5xl group-hover:scale-110 transition-all drop-shadow-md">✨</span>
                      <span className="text-[9px] sm:text-xs font-ancient font-black uppercase tracking-wide text-[var(--accent-primary)] group-hover:gold-leaf text-center transition-colors px-1 sm:px-2 leading-relaxed">{t[m.label_key] || m.label}</span>
                    </motion.button>
                  ))}
                </div>
             </div>
          </motion.div>
        );
      case AppTab.NUMEROLOGY:
        return renderHoroscopeIntake(() => handleAction('NUMEROLOGY'));
      case AppTab.PRASHNA: 
        return (
          <motion.div 
            key="prashna"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="min-h-screen parchment-bg flex flex-col relative overflow-x-hidden"
          >
            <MandalaBackground />
             <header className="bg-[var(--bg-primary)]/80 backdrop-blur-xl p-4 sm:p-7 flex items-center shadow-2xl sticky top-0 z-20 border-b border-[var(--border-primary)]">
              <button onClick={goBack} className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all group">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="ml-3 text-lg sm:text-2xl font-black text-[var(--accent-primary)] uppercase tracking-widest gold-leaf font-ancient">{t.oracle}</h2>
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
            transition={{ duration: 0.15 }}
            className="min-h-screen"
          >
            <Panchanga lang={lang} mode={mode!} goBack={goBack} />
          </motion.div>
        );
      case AppTab.VASTU:
        if (vastuHtml) {
          return <VastuAnalysis html={vastuHtml} lang={lang} mode={mode!} onBack={goBack} />;
        }
        return (
          <motion.div
            key="vastu-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`min-h-screen flex items-center justify-center ${mode === 'SCHOLAR' ? 'scholar-theme' : 'seeker-theme'}`}
          >
            <MandalaBackground />
            <LoadingIndicator label="Aligning Space with Cosmic Laws..." />
          </motion.div>
        );
      case AppTab.TIMELINE:
        if (horoscopeState === 'INPUT') {
          return renderHoroscopeIntake(() => setHoroscopeState('RESULT'));
        }
        return <TimelineDashboard intake={intake} lang={lang} goBack={() => setHoroscopeState('INPUT')} />;
      case AppTab.PALM_READING:
        return <PalmReader lang={lang} mode={mode!} onBack={goBack} />;
      case AppTab.SAVED_READINGS:
        return (
          <motion.div
            key="saved-readings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`min-h-screen flex flex-col relative overflow-hidden ${mode === 'SCHOLAR' ? 'scholar-theme' : 'seeker-theme'}`}
          >
            <MandalaBackground />
            <header className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-4 sm:p-8 flex items-center shadow-2xl sticky top-0 z-30 border-b border-[var(--accent-primary)]/40">
              <button onClick={goBack} className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all group">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="ml-3 text-lg sm:text-2xl font-ancient font-black gold-leaf uppercase tracking-widest">Archive</h2>
            </header>
            <div className="flex-1 overflow-y-auto p-4 sm:p-10 z-10 w-full">
              <SavedReadings 
                lang={lang} 
                onView={(entry) => {
                  setAnalysisResult(entry.result);
                  if (entry.sData) setStructuredData(entry.sData);
                  extractChartData(entry.result);
                }} 
              />
            </div>
          </motion.div>
        );
      case AppTab.BLOG:
        return (
          <motion.div 
            key="blog"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="min-h-screen parchment-bg flex flex-col"
          >
            <MandalaBackground />
            <header className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-6 flex items-center shadow-2xl border-b border-[var(--accent-primary)]/40 sticky top-0 z-20">
              <button onClick={goBack} className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="ml-3 text-2xl font-black text-[var(--accent-primary)] uppercase tracking-widest gold-leaf font-ancient">
                {lang === 'kn' ? 'ಜ್ಞಾನ ಭಂಡಾರ' : lang === 'tcy' ? 'ಜ್ಞಾನದ ಬಂಡಾರ' : 'Celestial Wisdom'}
              </h2>
            </header>
            <main className="flex-1">
              <BlogSection lang={lang} />
            </main>
          </motion.div>
        );
      case AppTab.LIFE_PARTNER:
        return renderHoroscopeIntake(() => handleAction('LIFE_PARTNER'));
      default: 
        return (
          <div className="min-h-screen flex items-center justify-center parchment-bg">
            <div className="text-center p-8 bg-[var(--bg-secondary)]/95 rounded-3xl border-2 border-[var(--accent-primary)]/30 shadow-xl">
              <p className="text-[var(--accent-primary)] font-bold mb-4">{t.under_construction || 'This celestial path is under construction.'}</p>
              <button onClick={() => changeTab(AppTab.DASHBOARD)} className="astro-btn-maroon px-6 py-2 rounded-full">{t.return_home || 'Return Home'}</button>
            </div>
          </div>
        );
    }
  };

  const renderBottomNav = () => {
    if (onboardingStep !== OnboardingStep.COMPLETED) return null;
    if (!mode || analysisResult || (activeTab === AppTab.HOROSCOPE && horoscopeState === 'INPUT')) return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 glass-premium z-[50] flex justify-around items-center pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:py-6 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.8)] border-t border-[var(--border-primary)] pb-safe transition-all">
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
            className={`flex flex-col items-center gap-1.5 transition-all duration-500 relative ${activeTab === item.id ? 'text-[var(--accent-primary)] scale-110' : 'text-[var(--text-secondary)] dark:text-[var(--accent-primary)]/40 hover:text-[var(--accent-primary)]'}`}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="nav-glow"
                className="absolute -top-4 w-8 h-1 bg-[var(--accent-primary)] rounded-full shadow-[0_0_15px_var(--accent-primary)]"
              />
            )}
            <div className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-500 ${activeTab === item.id ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-[0.1em] ${activeTab === item.id ? 'text-[var(--accent-primary)]' : ''}`}>{item.label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen-ios text-[var(--text-primary)] selection:bg-[var(--accent-primary)]/30 font-sans overflow-x-hidden break-words ${theme}`}>
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[2000] pointer-events-none pt-safe"
          >
            <LoadingIndicator variant="progress" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">



        {onboardingStep === OnboardingStep.QUICK_LOGIN && (
          <motion.div
            key="quick_login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-[100] bg-[var(--bg-primary)] flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto"
          >
            <div className="w-full max-w-2xl bg-[var(--bg-secondary)]/80 backdrop-blur-2xl rounded-2xl p-6 sm:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.2)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-[var(--border-primary)] relative overflow-hidden my-auto">
              <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
              <button 
                onClick={() => setOnboardingStep(OnboardingStep.MODE_SELECT)}
                className="absolute top-8 left-8 z-20 p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all group"
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent-primary)]/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-5xl font-ancient font-black gold-leaf uppercase tracking-widest text-center mb-4 drop-shadow-sm">
                  {t.quick_profile || 'Sacred Identity'}
                </h2>
                <p className="text-center text-[var(--accent-primary)] font-premium font-bold uppercase tracking-[0.3em] text-[10px] mb-12">
                  {t.enter_details_wisdom || 'Reveal your celestial coordinates'}
                </p>
                
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-[0.2em] ml-1">{t.name_of_soul}</label>
                    <input 
                      type="text" 
                      placeholder={t.enter_full_name || 'Your Name'} 
                      className="details-input bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-primary)]/80"
                      value={intake.name}
                      onChange={e => setIntake(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-[0.2em]">{t.birth_date}</label>
                        <button onClick={setToNow} className="text-[8px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest flex items-center gap-1 hover:text-[var(--accent-primary)] transition-colors"><Clock size={10} /> {t.set_to_now || 'Now'}</button>
                      </div>
                      <input 
                        type="date" 
                        className="details-input bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)]"
                        value={intake.dob}
                        onChange={e => setIntake(prev => ({ ...prev, dob: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-[0.2em] px-1">{t.birth_time}</label>
                      <TimePicker 
                        time={intake.tob} 
                        ampm={intake.ampm || 'AM'} 
                        onChange={(t, a) => setIntake(prev => ({ ...prev, tob: t, ampm: a }))} 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-[0.2em] px-1">{t.birth_location}</label>
                    <CitySearch 
                      value={intake.pob} 
                      onChange={city => setIntake(prev => ({ ...prev, pob: city.name, lat: city.lat, lon: city.lon, tz: city.tz }))} 
                      placeholder={t.birth_location || 'Place of Birth'}
                    />
                  </div>
                  
                  <div className="pt-8 flex flex-col gap-4">
                    <button
                      onClick={() => {
                        localStorage.setItem('astro_user_intake', JSON.stringify(intake));
                        setOnboardingStep(OnboardingStep.TOUR);
                        localStorage.setItem('astro_logic_onboarding_v2', 'true');
                      }}
                      className="w-full py-5 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--color-gold)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] rounded-lg font-ancient font-black uppercase tracking-[0.3em] text-sm shadow-2xl hover:scale-[1.02] transition-all border border-[var(--border-primary)] relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative z-10">{t.continue || 'Continue ➔'}</span>
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem('astro_user_intake_skipped', 'true');
                        setOnboardingStep(OnboardingStep.TOUR);
                        localStorage.setItem('astro_logic_onboarding_v2', 'true');
                      }}
                      className="w-full py-4 text-[var(--accent-primary)] font-ancient font-bold uppercase tracking-[0.3em] text-[10px] hover:text-[var(--accent-primary)] transition-colors"
                    >
                      {t.skip_for_now || 'Skip for now'}
                    </button>
                  </div>

                  <div className="mt-12 pt-8 border-t border-[var(--border-primary)] flex justify-center gap-8">
                    <button 
                      onClick={() => setIsDonateOpen(true)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-primary)]/50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-[var(--border-primary)]">
                        <Heart size={14} className="text-red-500 fill-current" />
                      </div>
                      {t.donate_support}
                    </button>
                    <button 
                      onClick={() => setIsFeedbackOpen(true)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-primary)]/50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-[var(--border-primary)]">
                        <MessageSquare size={14} className="text-[var(--accent-primary)]" />
                      </div>
                      {t.feedback}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {onboardingStep === OnboardingStep.LANG_SELECT && (
          <motion.div 
            key="lang_select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[var(--bg-primary)] flex flex-col items-center justify-start overflow-y-auto"
          >
            <MandalaBackground />
            <div className="w-full max-w-2xl mx-auto px-6 py-12 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-12">
                <button 
                  onClick={() => setOnboardingStep(OnboardingStep.MODE_SELECT)}
                  className="p-2 text-[var(--accent-primary)]/80 hover:text-[var(--accent-primary)] transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-2xl sm:text-4xl font-ancient font-black gold-leaf uppercase tracking-[0.2em]">{t.lang_select || 'Sacred Tongue'}</h1>
                <div className="w-10 h-10 bg-[var(--accent-primary)] rounded-xl flex items-center justify-center text-white dark:text-[#020617] shadow-xl">
                  <Sparkles size={20} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-12">
                {LANGUAGES.map((l: any) => (
                  <motion.button
                    key={l.code}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setLang(l.code as Language);
                      localStorage.setItem('astro_logic_lang', l.code);
                    }}
                    className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-500 shadow-lg ${
                      lang === l.code 
                        ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] shadow-[0_0_40px_rgba(212,175,55,0.3)]' 
                        : 'bg-[var(--bg-secondary)]/50 backdrop-blur-xl border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50'
                    }`}
                  >
                    <span className="text-5xl mb-4 drop-shadow-lg">{l.flag || '🇮🇳'}</span>
                    <span className={`text-lg font-ancient font-bold tracking-widest ${lang === l.code ? 'text-white dark:text-[#020617]' : 'text-[var(--text-primary)]'}`}>{l.nativeName}</span>
                    <span className={`text-[10px] mt-2 font-premium uppercase tracking-[0.2em] ${lang === l.code ? 'text-white/80 dark:text-[#020617]/80' : 'text-[var(--text-secondary)]'}`}>({l.name})</span>
                  </motion.button>
                ))}
              </div>

              <div className="mt-auto pt-12">
                <button 
                  onClick={() => {
                    const onboardingDone = localStorage.getItem('astro_logic_onboarding_v2');
                    if (onboardingDone) {
                      setOnboardingStep(OnboardingStep.COMPLETED);
                    } else {
                      setOnboardingStep(OnboardingStep.QUICK_LOGIN);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] py-5 rounded-lg font-ancient font-black uppercase tracking-[0.4em] text-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition-all active:scale-[0.98]"
                >
                  {t.save_continue || 'Proceed'}
                </button>
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
            className="fixed inset-0 z-[100] bg-[var(--bg-primary)] flex flex-col items-center justify-start p-2 sm:p-6 overflow-y-auto overflow-x-hidden"
          >
            <MandalaBackground />
            
            <div className="absolute top-6 left-6 z-50">
              <button 
                onClick={() => window.location.reload()}
                className="p-2 text-[var(--accent-primary)]/80 hover:text-[var(--accent-primary)] transition-colors"
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
            </div>

            <div className="absolute top-6 right-6 z-50">
              <div className="relative group">
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value as Language)} 
                  className="bg-[var(--bg-secondary)]/50 backdrop-blur-md border border-[var(--border-primary)] text-[var(--accent-primary)] text-[11px] font-ancient font-bold rounded-lg px-6 py-2.5 appearance-none cursor-pointer shadow-xl tracking-[0.2em] hover:border-[var(--accent-primary)] transition-all outline-none"
                >
                  {LANGUAGES.map(l => <option key={l.code} value={l.code} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">{l.nativeName}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]/80">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Header Section */}
            <div className="relative flex flex-col items-center mb-12 sm:mb-20 mt-12 sm:mt-24 z-10 w-full">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2 }}
                className="flex flex-col items-center"
              >
                <h1 className="text-2xl min-[380px]:text-3xl sm:text-6xl md:text-7xl lg:text-9xl font-ancient font-black gold-leaf tracking-tight uppercase drop-shadow-[0_0_50px_rgba(212,175,55,0.4)] flex flex-wrap items-center justify-center gap-4 sm:gap-10 md:gap-12 text-center px-4 dark:drop-shadow-[0_0_50px_rgba(212,175,55,0.4)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                  <span>ASTRO</span>
                  <FantasticLogo className="w-12 h-12 min-[380px]:w-16 min-[380px]:h-16 sm:w-40 sm:h-40 md:w-64 md:h-64" />
                  <span>LOGIC</span>
                </h1>
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-[var(--accent-primary)] font-premium italic text-xs min-[380px]:text-sm sm:text-3xl tracking-[0.3em] mt-4 uppercase text-center px-4 font-bold"
                >
                  Sacred Geometry • Ancient Wisdom
                </motion.p>
              </motion.div>
            </div>

            <div className="flex flex-row flex-nowrap justify-center gap-0 w-full max-w-4xl z-10 pb-10 px-0 sm:px-4">
              <motion.button 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, translateY: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setMode('SEEKER');
                  localStorage.setItem('astro_logic_mode_v2', 'SEEKER');
                  const langSaved = localStorage.getItem('astro_logic_lang');
                  if (!langSaved) {
                    setOnboardingStep(OnboardingStep.LANG_SELECT);
                  } else {
                    const onboardingDone = localStorage.getItem('astro_logic_onboarding_v2');
                    if (onboardingDone) {
                      setOnboardingStep(OnboardingStep.COMPLETED);
                    } else {
                      setOnboardingStep(OnboardingStep.QUICK_LOGIN);
                    }
                  }
                }}
                className="w-[50%] sm:flex-1 group relative flex flex-col items-center justify-center p-0.5 sm:p-8 transition-all duration-700 bg-[var(--bg-secondary)]/50 backdrop-blur-2xl border border-[var(--border-primary)] rounded-xl sm:rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] overflow-hidden hover:border-[var(--accent-primary)] hover:shadow-[0_0_50px_rgba(212,175,55,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute -top-12 -left-12 sm:-top-24 sm:-left-24 w-32 h-32 sm:w-64 sm:h-64 bg-[var(--accent-primary)]/5 rounded-full blur-2xl sm:blur-3xl group-hover:bg-[var(--accent-primary)]/10 transition-all" />
                
                <div className="z-10 text-center space-y-1 sm:space-y-6 w-full">
                  <div className="w-6 h-6 sm:w-24 sm:h-24 flex items-center justify-center mx-auto transition-all relative">
                    <div className="absolute inset-0 bg-[var(--accent-primary)]/10 rounded-full animate-pulse" />
                    <span className="text-lg sm:text-6xl block group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_40px_rgba(212,175,55,0.8)] relative z-10">✨</span>
                  </div>
                  <div className="space-y-0.5 sm:space-y-3 px-0 overflow-visible">
                    <h2 className="text-[10px] sm:text-5xl font-ancient font-black text-[var(--accent-primary)] uppercase tracking-tighter sm:tracking-[0.2em] gold-leaf leading-normal py-0.5 sm:py-1 whitespace-nowrap px-1">{t.seeker || 'Seeker'}</h2>
                    <div className="h-0.5 sm:h-1 w-4 sm:w-16 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent mx-auto opacity-40" />
                  </div>
                  <p className="text-[6px] sm:text-lg text-[var(--text-primary)] dark:text-white/90 font-premium italic leading-tight sm:leading-relaxed max-w-[450px] mx-auto drop-shadow-sm font-bold">
                    "{t.seeker_desc || 'Life guidance.'}"
                  </p>
                  <div className="pt-1 sm:pt-6">
                    <span className="inline-block px-1 sm:px-10 py-0.5 sm:py-4 bg-[var(--bg-primary)]/50 border border-[var(--accent-primary)] text-[var(--accent-primary)] rounded-md sm:rounded-xl uppercase text-[5px] sm:text-xs font-ancient font-black tracking-normal sm:tracking-[0.3em] group-hover:bg-[var(--accent-primary)] group-hover:text-white dark:group-hover:text-[#020617] transition-all duration-500 shadow-[0_5px_15px_rgba(212,175,55,0.2)]">
                      {t.select_seeker || 'Select'}
                    </span>
                  </div>
                </div>
              </motion.button>

              <motion.button 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, translateY: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setMode('SCHOLAR');
                  localStorage.setItem('astro_logic_mode_v2', 'SCHOLAR');
                  const langSaved = localStorage.getItem('astro_logic_lang');
                  if (!langSaved) {
                    setOnboardingStep(OnboardingStep.LANG_SELECT);
                  } else {
                    const onboardingDone = localStorage.getItem('astro_logic_onboarding_v2');
                    if (onboardingDone) {
                      setOnboardingStep(OnboardingStep.COMPLETED);
                    } else {
                      setOnboardingStep(OnboardingStep.QUICK_LOGIN);
                    }
                  }
                }}
                className="w-[50%] sm:flex-1 group relative flex flex-col items-center justify-center p-0.5 sm:p-8 transition-all duration-700 bg-[var(--bg-secondary)]/50 backdrop-blur-2xl border border-[var(--border-primary)] rounded-xl sm:rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] overflow-hidden hover:border-[var(--accent-primary)] hover:shadow-[0_0_50px_rgba(212,175,55,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute -top-12 -right-12 sm:-top-24 sm:-right-24 w-32 h-32 sm:w-64 sm:h-64 bg-[var(--accent-primary)]/5 rounded-full blur-2xl sm:blur-3xl group-hover:bg-[var(--accent-primary)]/10 transition-all" />
                
                <div className="z-10 text-center space-y-1 sm:space-y-6 w-full">
                  <div className="w-6 h-6 sm:w-24 sm:h-24 flex items-center justify-center mx-auto transition-all relative">
                    <div className="absolute inset-0 bg-[var(--accent-primary)]/10 rounded-full animate-pulse" />
                    <span className="text-lg sm:text-6xl block group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_40px_rgba(212,175,55,0.8)] relative z-10">📜</span>
                  </div>
                  <div className="space-y-0.5 sm:space-y-3 px-0 overflow-visible">
                    <h2 className="text-[10px] sm:text-5xl font-ancient font-black text-[var(--accent-primary)] uppercase tracking-tighter sm:tracking-[0.2em] gold-leaf leading-normal py-0.5 sm:py-1 whitespace-nowrap px-1">{t.scholar || 'Scholar'}</h2>
                    <div className="h-0.5 sm:h-1 w-4 sm:w-16 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent mx-auto opacity-40" />
                  </div>
                  <p className="text-[5px] sm:text-lg text-[var(--text-primary)] dark:text-white/90 font-premium italic leading-tight sm:leading-relaxed max-w-[450px] mx-auto drop-shadow-sm font-bold">
                    "{t.scholar_desc || 'Math precision.'}"
                  </p>
                  <div className="pt-1 sm:pt-6">
                    <span className="inline-block px-1 sm:px-10 py-0.5 sm:py-4 bg-[var(--bg-primary)]/50 border border-[var(--accent-primary)] text-[var(--accent-primary)] rounded-md sm:rounded-xl uppercase text-[5px] sm:text-xs font-ancient font-black tracking-normal sm:tracking-[0.3em] group-hover:bg-[var(--accent-primary)] group-hover:text-white dark:group-hover:text-[#020617] transition-all duration-500 shadow-[0_5px_15px_rgba(212,175,55,0.2)]">
                      {t.select_scholar || 'Select'}
                    </span>
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {onboardingStep === OnboardingStep.TOUR && (
          <motion.div
            key="tour"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[var(--bg-primary)]/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <MandalaBackground />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[var(--bg-secondary)]/95 w-full max-w-lg rounded-[2rem] border-2 border-[var(--accent-primary)] shadow-[0_0_100px_rgba(212,175,55,0.3)] overflow-hidden flex flex-col backdrop-blur-2xl relative z-10"
            >
              {/* Tour Content */}
              <div className="p-8 sm:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/10 rounded-full blur-2xl -mr-10 -mt-10" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tourStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--color-gold-dark)] rounded-3xl flex items-center justify-center mx-auto shadow-2xl overflow-hidden relative group">
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-4xl sm:text-6xl drop-shadow-lg">{tourSteps[tourStep].icon}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <h2 className="text-2xl sm:text-4xl font-ancient font-black gold-leaf uppercase tracking-widest leading-tight">
                        {tourSteps[tourStep].title}
                      </h2>
                      <div className="h-0.5 w-16 bg-[var(--accent-primary)]/30 mx-auto rounded-full" />
                      <p className="text-sm sm:text-lg text-[var(--text-primary)] font-premium font-bold italic leading-relaxed opacity-90 px-4">
                        {tourSteps[tourStep].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-col gap-4 mt-12 sm:mt-16">
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => setOnboardingStep(OnboardingStep.COMPLETED)}
                      className="text-[10px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-[0.3em] hover:opacity-70 transition-opacity"
                    >
                      {t.skip_tour || 'Skip Intro'}
                    </button>
                    
                    <div className="flex gap-2">
                      {tourSteps.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full transition-all duration-500 ${tourStep === i ? 'bg-[var(--accent-primary)] w-6' : 'bg-[var(--accent-primary)]/20'}`} 
                        />
                      ))}
                    </div>
                    
                    <button
                      onClick={() => {
                        if (tourStep < tourSteps.length - 1) {
                          setTourStep(tourStep + 1);
                        } else {
                          setOnboardingStep(OnboardingStep.COMPLETED);
                        }
                      }}
                      className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] px-8 py-3.5 rounded-xl font-ancient font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 transition-all active:scale-95"
                    >
                      {tourStep === tourSteps.length - 1 ? (t.get_started || 'Go!') : (t.next || 'Next')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {onboardingStep === OnboardingStep.COMPLETED && (
        <>
          <div className="fixed bottom-24 right-6 sm:bottom-32 sm:right-10 z-[60] pointer-events-none">
            <button onClick={() => setIsHelpOpen(true)} className="pointer-events-auto w-14 h-14 sm:w-20 sm:h-20 bg-[var(--accent-primary)] rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.6)] border-4 sm:border-6 border-[var(--border-primary)] flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all group">
              <span className="text-xl sm:text-3xl drop-shadow-lg group-hover:rotate-6 transition-transform">🙏</span>
              <span className="hidden sm:block text-[8px] font-black uppercase text-white dark:text-[#020617] tracking-widest mt-0.5 text-center">{t.help}</span>
            </button>
            
            <AnimatePresence>
              {isHelpOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-[var(--bg-primary)]/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-[var(--bg-secondary)] w-full max-w-2xl rounded-lg border border-[var(--border-primary)] shadow-[0_0_100px_rgba(212,175,55,0.3)] overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-2xl"
                  >
                    <div className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] p-6 sm:p-10 text-white dark:text-[#020617] flex justify-between items-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                      <div className="flex items-center gap-6 z-10">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg border-2 border-[var(--border-primary)] overflow-hidden shadow-2xl">
                          <img 
                            src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=200&auto=format&fit=crop" 
                            alt="Ancient Guruji" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h2 className="text-2xl sm:text-4xl font-ancient font-black uppercase tracking-widest leading-none">{t.sacred_guide || 'Sacred Guide'}</h2>
                          <p className="text-[10px] sm:text-xs font-premium uppercase tracking-[0.3em] font-bold mt-2 opacity-80">Wisdom from the Ancient Masters</p>
                        </div>
                      </div>
                      <button onClick={() => setIsHelpOpen(false)} className="text-3xl hover:scale-110 transition-transform z-10">✕</button>
                    </div>
                    <div className="p-6 sm:p-12 overflow-y-auto space-y-10 text-[var(--text-primary)] relative">
                      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
                      <section className="relative">
                        <div className="absolute -left-6 top-0 w-1 h-full bg-[var(--accent-primary)]/40 rounded-full"></div>
                        <h3 className="font-ancient font-black uppercase tracking-[0.2em] text-[var(--accent-primary)] text-sm sm:text-base mb-4 flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-white dark:text-[#020617] text-xs font-bold">01</span>
                          Choose Your Path
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed font-premium font-bold opacity-90">{t.seeker_scholar_desc || 'Select Seeker for simple, easy-to-understand life guidance. Select Scholar for deep technical details, Sanskrit shlokas, and mathematical precision based on Brihat Jataka and Phaladeepika.'}</p>
                      </section>
                      <section className="relative">
                        <div className="absolute -left-6 top-0 w-1 h-full bg-[var(--accent-primary)]/40 rounded-full"></div>
                        <h3 className="font-ancient font-black uppercase tracking-[0.2em] text-[var(--accent-primary)] text-sm sm:text-base mb-4 flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-white dark:text-[#020617] text-xs font-bold">02</span>
                          Enter Birth Details
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed font-premium font-bold opacity-90">Provide your exact Date, Time, and Place of birth. For the best accuracy, search for your city and select it from the list to get precise coordinates and timezone data.</p>
                      </section>
                      <section className="relative">
                        <div className="absolute -left-6 top-0 w-1 h-full bg-[var(--accent-primary)]/40 rounded-full"></div>
                        <h3 className="font-ancient font-black uppercase tracking-[0.2em] text-[var(--accent-primary)] text-sm sm:text-base mb-4 flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-white dark:text-[#020617] text-xs font-bold">03</span>
                          Explore Analysis
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed font-premium font-bold opacity-90">Navigate through <b>Horoscope</b> for birth analysis, <b>Daily</b> for your transit forecast, and <b>Matching</b> for relationship compatibility.</p>
                      </section>
                      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                          onClick={() => { setIsHelpOpen(false); setIsChatOverlayOpen(true); }}
                          className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border-primary)] text-[var(--accent-primary)] py-5 rounded-lg font-ancient font-black uppercase tracking-[0.3em] text-sm hover:bg-[var(--accent-primary)] hover:text-white dark:hover:text-[#020617] transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                          <MessageSquare size={20} />
                          Write to Guruji
                        </button>
                        <button 
                          onClick={() => { setIsHelpOpen(false); setIsChatOverlayOpen(true); }}
                          className="w-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] py-5 rounded-lg font-ancient font-black uppercase tracking-[0.3em] text-sm hover:scale-105 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3"
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
              <div className="pointer-events-auto absolute bottom-20 right-0 w-[92vw] sm:w-[440px] h-[75vh] sm:max-h-[800px] bg-[var(--bg-secondary)] rounded-[2rem] sm:rounded-[3.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.7)] border-4 border-[var(--border-primary)] overflow-hidden animate-in slide-in-from-bottom-8 duration-500 flex flex-col z-[100]">
                <div className="bg-[var(--accent-primary)] p-5 sm:p-8 text-white dark:text-[#020617] flex justify-between items-center shadow-2xl relative">
                   <div className="flex items-center gap-4 z-10">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-[var(--border-primary)] overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=100&auto=format&fit=crop" 
                          alt="Guruji" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black uppercase tracking-widest text-sm sm:text-xl astrological-font leading-tight">{t.ask_help_guruji}</span>
                        <span className="text-[8px] sm:text-[10px] uppercase tracking-widest opacity-80">{t.sacred_conversation}</span>
                      </div>
                   </div>
                   <button onClick={() => setIsChatOverlayOpen(false)} className="hover:opacity-70 text-2xl sm:text-3xl font-bold z-10">✕</button>
                </div>
                <div className="flex-1 overflow-hidden bg-[var(--bg-secondary)]">
                  <GurujiChat lang={lang} mode={mode!} intake={intake} />
                </div>
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="fixed inset-0 z-[1000] bg-[var(--bg-primary)]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 overflow-hidden">
               <MandalaBackground />
               <div className="relative mb-14 z-10 transition-all duration-1000">
                 <div className="w-32 h-32 sm:w-64 sm:h-64 border-[1px] border-[var(--accent-primary)]/20 rounded-full flex items-center justify-center relative shadow-[0_0_100px_rgba(212,175,55,0.1)]">
                   <div className="absolute inset-0 border-[3px] sm:border-[5px] border-t-[var(--accent-primary)] rounded-full animate-spin"></div>
                   <div className="absolute inset-4 border-[1px] border-[var(--accent-primary)]/10 rounded-full animate-spin-reverse opacity-50"></div>
                   <div className="text-4xl sm:text-8xl drop-shadow-[0_0_30px_rgba(212,175,55,0.8)] mix-blend-plus-lighter animate-pulse">🌞</div>
                 </div>
               </div>
               
               <div className="max-w-xl w-full space-y-8 z-10">
                 <div className="space-y-4">
                   <p className="text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.5em] sm:tracking-[1em] text-[11px] sm:text-2xl drop-shadow-lg [text-shadow:0_0_20px_rgba(212,175,55,0.4)]">
                     {t.calculating_heavens || 'Calculating Heavens...'}
                   </p>
                   <div className="w-full h-1 bg-[var(--accent-primary)]/10 rounded-full overflow-hidden relative">
                     <motion.div 
                       initial={{ width: "0%" }}
                       animate={{ width: "100%" }}
                       transition={{ duration: 15, ease: "easeInOut" }}
                       className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/20 via-[var(--accent-primary)] to-[var(--accent-primary)]/20"
                     />
                   </div>
                 </div>

                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="relative p-8 sm:p-12 rounded-3xl border border-[var(--accent-primary)]/20 bg-[var(--bg-secondary)]/30 backdrop-blur-md shadow-2xl"
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--accent-primary)] text-white dark:text-[#020617] text-[8px] font-ancient font-black uppercase tracking-widest rounded-full">
                      Vedic Wisdom
                    </div>
                    <p className="text-[var(--text-primary)] font-premium font-bold italic text-sm sm:text-2xl leading-relaxed tracking-wider">
                      "{JYOTISH_QUOTES[Math.floor(Date.now() / 8000) % JYOTISH_QUOTES.length][lang] || JYOTISH_QUOTES[0][lang]}"
                    </p>
                  </motion.div>
               </div>
            </div>
          )}
          
          <main className="pb-32 pb-safe">
            <ProfileButton />
            <UserProfile 
              isOpen={isProfileOpen} 
              onClose={() => setIsProfileOpen(false)} 
              intake={intake} 
              onUpdate={(newIntake) => {
                setIntake(newIntake as any);
                lastSavedIntakeRef.current = JSON.stringify(newIntake);
                setIsDirty(false);
              }} 
              onLogout={handleLogout}
              lang={lang}
              theme={theme}
              onToggleTheme={toggleTheme}
              onTabChange={(tabId) => {
                switch(tabId) {
                  case 'DASHBOARD': setActiveTab(AppTab.DASHBOARD); break;
                  case 'HOROSCOPE': setActiveTab(AppTab.DAILY_PREDICTION); break;
                  case 'KUNDLI': setActiveTab(AppTab.HOROSCOPE); break;
                  case 'COMPATIBILITY': setActiveTab(AppTab.MATCHING); break;
                  case 'PLANETS': setActiveTab(AppTab.HOROSCOPE); break;
                  case 'PANCHANG': setActiveTab(AppTab.PANCHANGA); break;
                  case 'SAVED': setActiveTab(AppTab.BLOG); break;
                  case 'LEARNING': setActiveTab(AppTab.BLOG); break;
                  case 'CHAT': setIsChatOverlayOpen(true); break;
                }
              }}
            />
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </main>

          {activeTab !== AppTab.DASHBOARD && (
            (activeTab === AppTab.HOROSCOPE && horoscopeState === 'INPUT') || 
            (activeTab === AppTab.NUMEROLOGY && !intake.lat) ||
            (activeTab === AppTab.LIFE_PARTNER && !intake.lat)
            ? null : renderBottomNav()
          )}

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
      <ScrollToTop />
      <style>{`
        .parchment-bg { 
          background-color: var(--bg-primary); 
          background-image: radial-gradient(circle at 50% 50%, var(--bg-secondary) 0%, var(--bg-primary) 100%); 
          position: relative; 
          background-attachment: fixed; 
        }
        .parchment-bg::before { content: ""; position: fixed; inset: 0; background: linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.05) 0%, transparent 50%, rgba(var(--text-primary-rgb), 0.05) 100%); pointer-events: none; z-index: 0; }
        .details-input { 
          width: 100%; 
          background: var(--bg-primary) !important; 
          border: 1px solid var(--border-primary); 
          border-radius: 0.5rem; 
          padding: 1rem 1.5rem; 
          color: var(--text-primary) !important; 
          font-family: var(--font-premium); 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          font-size: 1rem; 
          backdrop-filter: blur(12px); 
          font-weight: 600;
        }
        .details-input:focus { 
          outline: none; 
          border-color: var(--accent-primary); 
          box-shadow: 0 0 20px rgba(var(--accent-primary-rgb), 0.2); 
          background: var(--bg-secondary) !important;
        }
        .details-input::placeholder {
          color: var(--text-secondary);
        }
        select.details-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23b45309'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.5em;
          padding-right: 3rem;
        }
        .menu-button-parchment { background: var(--bg-secondary); border: 1px solid var(--border-primary); display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); text-align: center; backdrop-blur: xl; }
        .astro-btn-maroon { width: 100%; font-weight: 900; color: white !important; dark:color: #020617 !important; text-transform: uppercase; letter-spacing: 0.3em; background: linear-gradient(to right, var(--accent-primary), var(--color-gold-dark)) !important; border: 1px solid var(--border-primary); transition: all 0.4s ease; }
        .astro-btn-maroon:hover:not(:disabled) { background: var(--color-gold-dark) !important; border-color: #000; }
        
        .analysis-rich-text h3 { color: var(--accent-primary); font-size: 1.85rem; sm:font-size: 3rem; font-family: 'Cinzel', serif; margin: 3.5rem 0 2rem; border-bottom: 4px solid var(--accent-primary); padding-bottom: 1rem; text-align: center; text-transform: uppercase; font-weight: 900; line-height: 1.2; }
        .analysis-rich-text h4 { color: var(--accent-primary); font-size: 1.4rem; sm:font-size: 2rem; font-family: 'Cinzel', serif; margin: 2.5rem 0 1.25rem; border-left: 10px sm:border-left-[15px] solid var(--accent-primary); padding: 0.8rem 0 0.8rem 1.25rem; sm:padding: 1.25rem 0 1.25rem 2rem; font-weight: 800; background: linear-gradient(to right, rgba(var(--accent-primary-rgb), 0.08), transparent); border-radius: 0 1.5rem 1.5rem 0; }
        .analysis-rich-text p { margin-bottom: 2rem; line-height: 1.9; sm:line-height: 2.5; font-size: 1rem; sm:font-size: 1.4rem; text-align: justify; color: var(--text-primary); font-weight: 500; }
        .analysis-rich-text li { margin-bottom: 1.75rem; font-size: 1rem; sm:font-size: 1.4rem; color: var(--text-primary); padding: 2rem 2.5rem; sm:padding: 3rem 4.5rem; background: var(--bg-secondary); border-radius: 1.75rem sm:border-radius: 3rem; border-left: 12px sm:border-left-[20px] solid var(--accent-primary); box-shadow: 0 12px 30px rgba(0,0,0,0.2); font-weight: 500; }
        
        .shadow-glow { box-shadow: 0 0 25px rgba(var(--accent-primary-rgb), 0.5); }
        
        .scholar-view h3 { border-bottom-color: var(--accent-primary); color: var(--accent-primary); }
        .scholar-view li { border-left-color: var(--accent-primary); background: var(--bg-secondary); }
        .seeker-view h3 { color: var(--accent-primary); border-bottom-color: var(--accent-primary); }
        .seeker-view li { border-left-color: var(--accent-primary); background: var(--bg-secondary); }
      `}</style>
    </div>
  );
};

export default App;
