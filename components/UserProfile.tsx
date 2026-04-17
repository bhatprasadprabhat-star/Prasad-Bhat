
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Save, History, Calendar, MapPin, Clock, Trash2, 
  ChevronRight, Sparkles, Home, Heart, Orbit, Bookmark, 
  GraduationCap, MessageCircle, Settings, ShieldCheck, 
  CreditCard, Share2, X, Layout, Moon, Camera, Image as ImageIcon, Sun
} from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language, UserIntake } from '../types';
import TimePicker from './TimePicker';
import CitySearch from './CitySearch';

interface PastReading {
  id: string;
  type: string;
  date: string;
  summary: string;
}

const UserProfile = ({ lang, intake, onUpdate, isOpen, onClose, onLogout, onTabChange, theme, onToggleTheme }: { 
  lang: Language, 
  intake: UserIntake, 
  onUpdate: (newIntake: UserIntake) => void,
  isOpen: boolean,
  onClose: () => void,
  onLogout: () => void,
  onTabChange?: (tab: any) => void,
  theme: 'light' | 'dark',
  onToggleTheme: () => void
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [view, setView] = useState<'MENU' | 'EDIT_PROFILE' | 'SETTINGS' | 'HISTORY' | 'APPOINTMENTS'>('MENU');
  const [localIntake, setLocalIntake] = useState(intake);
  const [history, setHistory] = useState<PastReading[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    setLocalIntake(intake);
  }, [intake]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('astro_readings_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const savedAppointments = localStorage.getItem('astro_appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const handleSave = () => {
    onUpdate(localIntake);
    localStorage.setItem('astro_user_intake', JSON.stringify(localIntake));
    setView('MENU');
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Astro Logic',
          text: 'Check out my cosmic insights on Astro Logic!',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Removed alert for better APK compatibility
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalIntake({ ...localIntake, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { id: 'DASHBOARD', icon: <Home size={20} />, label: 'Dashboard' },
    { id: 'HOROSCOPE', icon: <Sparkles size={20} />, label: 'Daily Horoscope' },
    { id: 'KUNDLI', icon: <Layout size={20} />, label: 'Kundli / Birth Chart' },
    { id: 'COMPATIBILITY', icon: <Heart size={20} />, label: 'Compatibility Check' },
    { id: 'PLANETS', icon: <Orbit size={20} />, label: 'Planetary Positions' },
    { id: 'PANCHANG', icon: <Calendar size={20} />, label: 'Panchang / Calendar' },
    { id: 'SAVED', icon: <Bookmark size={20} />, label: 'Saved Reports' },
    { id: 'HISTORY', icon: <History size={20} />, label: 'My History', action: () => setView('HISTORY') },
    { id: 'APPOINTMENTS', icon: <Calendar size={20} />, label: 'My Appointments', action: () => setView('APPOINTMENTS') },
    { id: 'LEARNING', icon: <GraduationCap size={20} />, label: 'Astro Learning', badge: 'NEW' },
    { id: 'CHAT', icon: <MessageCircle size={20} />, label: 'AI Astro Chat', badge: 'NEW' },
  ];

  const accountItems = [
    { id: 'EDIT_PROFILE', icon: <User size={20} />, label: 'Edit Profile', action: () => setView('EDIT_PROFILE') },
    { id: 'SETTINGS', icon: <Settings size={20} />, label: 'Settings', action: () => setView('SETTINGS') },
    { id: 'PRIVACY', icon: <ShieldCheck size={20} />, label: 'Privacy Policy' },
    { id: 'PAYMENTS', icon: <CreditCard size={20} />, label: 'Payments / Premium' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85vw] sm:w-[400px] bg-[#020617] z-[201] shadow-2xl flex flex-col border-l border-[var(--border-primary)]"
          >
            {/* Header */}
            <div className="p-8 pt-[calc(2rem+env(safe-area-inset-top))] flex flex-col items-center text-center relative pt-safe">
              <button 
                onClick={onClose}
                className="absolute top-[calc(1.5rem+env(safe-area-inset-top))] right-6 p-2 text-gray-400 hover:text-white transition-colors pt-safe"
              >
                <X size={24} />
              </button>

              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4c1d95] to-[#1e1b4b] flex items-center justify-center mb-4 border-2 border-[var(--accent-primary)]/30 shadow-[0_0_30px_rgba(139,92,246,0.3)] relative overflow-hidden">
                {localIntake.photo ? (
                  <img 
                    src={localIntake.photo} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
                    <div className="relative flex flex-col items-center">
                       <Moon className="text-[var(--accent-primary)] w-10 h-10 fill-[var(--accent-primary)]/20" />
                       <div className="flex gap-1 mt-1">
                         <Sparkles size={10} className="text-[var(--accent-primary)] animate-pulse" />
                         <Sparkles size={14} className="text-[var(--accent-primary)] animate-pulse delay-75" />
                         <Sparkles size={10} className="text-[var(--accent-primary)] animate-pulse delay-150" />
                       </div>
                    </div>
                  </>
                )}
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{localIntake.name || 'Prasad Bhat'}</h2>
              <p className="text-[var(--accent-primary)] text-[10px] font-bold tracking-widest uppercase">
                Astro ID: {localIntake.id?.toUpperCase() || 'ASTRO-NEW'}
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
              {view === 'MENU' ? (
                <>
                  <div className="space-y-1">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.action) {
                            item.action();
                          } else {
                            if (onTabChange) onTabChange(item.id);
                            onClose();
                          }
                        }}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all group"
                      >
                        <span className="text-gray-400 group-hover:text-[var(--accent-primary)] transition-colors">
                          {item.icon}
                        </span>
                        <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-[#4c1d95] text-[8px] font-black rounded text-white tracking-widest">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-1">
                    {accountItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => item.action ? item.action() : null}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all group"
                      >
                        <span className="text-gray-400 group-hover:text-[var(--accent-primary)] transition-colors">
                          {item.icon}
                        </span>
                        <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : view === 'EDIT_PROFILE' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button 
                    onClick={() => setView('MENU')}
                    className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-4"
                  >
                    <ChevronRight className="rotate-180" size={16} /> Back to Menu
                  </button>

                  <div className="flex flex-col items-center mb-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/10 overflow-hidden flex items-center justify-center">
                        {localIntake.photo ? (
                          <img src={localIntake.photo} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User size={40} className="text-white/20" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 p-2 bg-[var(--accent-primary)] rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-all">
                        <Camera size={16} />
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-3">Tap to change photo</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                      <input 
                        value={localIntake.name} 
                        onChange={e => setLocalIntake({...localIntake, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--accent-primary)] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                      <input 
                        type="date"
                        value={localIntake.dob} 
                        onChange={e => setLocalIntake({...localIntake, dob: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--accent-primary)] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time of Birth</label>
                      <TimePicker 
                        time={localIntake.tob} 
                        ampm={localIntake.ampm || 'AM'}
                        onChange={(t, a) => setLocalIntake({...localIntake, tob: t, ampm: a})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Place of Birth</label>
                      <CitySearch 
                        value={localIntake.pob} 
                        onChange={city => setLocalIntake({...localIntake, pob: city.name, lat: city.lat, lon: city.lon, tz: city.tz})}
                        placeholder="Search City"
                      />
                      {(localIntake.lat && localIntake.lon) && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg overflow-hidden"
                        >
                          <div className="flex items-center gap-1 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                            <span className="text-[var(--accent-primary)]/70">LAT:</span>
                            <span className="text-gray-300">{parseFloat(localIntake.lat).toFixed(2)}°</span>
                          </div>
                          <div className="w-px h-2 bg-white/10" />
                          <div className="flex items-center gap-1 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                            <span className="text-[var(--accent-primary)]/70">LON:</span>
                            <span className="text-gray-300">{parseFloat(localIntake.lon).toFixed(2)}°</span>
                          </div>
                          <div className="w-px h-2 bg-white/10" />
                          <div className="flex items-center gap-1 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                            <span className="text-[var(--accent-primary)]/70">TZ:</span>
                            <span className="text-gray-300">{localIntake.tz}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 space-y-3">
                    <button 
                      onClick={handleSave}
                      className="w-full py-4 bg-[var(--accent-primary)] text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      <Save size={18} /> Save Changes
                    </button>
                    <button 
                      onClick={handleLogoutClick}
                      className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all"
                    >
                      Logout Account
                    </button>
                  </div>
                </div>
              ) : view === 'HISTORY' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button 
                    onClick={() => setView('MENU')}
                    className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-4"
                  >
                    <ChevronRight className="rotate-180" size={16} /> Back to Menu
                  </button>

                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Recent Insights</h3>
                    {history.length > 0 && (
                      <button 
                        onClick={() => {
                          localStorage.removeItem('astro_readings_history');
                          setHistory([]);
                        }}
                        className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2 hover:opacity-70"
                      >
                        <Trash2 size={12} /> Clear All
                      </button>
                    )}
                  </div>

                  {history.length === 0 ? (
                    <div className="py-20 text-center space-y-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
                      <History size={48} className="mx-auto text-white/20" />
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No past readings found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {history.map((item) => (
                        <div 
                          key={item.id}
                          className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:border-[var(--accent-primary)]/40 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)]">
                              <Sparkles size={18} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white text-sm uppercase tracking-tight">{item.type}</h4>
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{item.date}</span>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{item.summary}</p>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : view === 'APPOINTMENTS' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button 
                    onClick={() => setView('MENU')}
                    className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-4"
                  >
                    <ChevronRight className="rotate-180" size={16} /> Back to Menu
                  </button>

                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Upcoming Appointments</h3>
                  
                  {appointments.length === 0 ? (
                    <div className="py-20 text-center space-y-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
                      <Calendar size={48} className="mx-auto text-white/20" />
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No upcoming appointments</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {appointments.map((appt) => (
                        <div 
                          key={appt.id}
                          className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 hover:border-[var(--accent-primary)]/40 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)] text-white flex items-center justify-center">
                              <Clock size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-sm uppercase tracking-tight">{appt.tier}</h4>
                              <div className="flex items-center gap-3 text-[9px] font-black text-gray-500 uppercase tracking-widest mt-0.5">
                                <span className="flex items-center gap-1"><Calendar size={10} /> {appt.date}</span>
                                <span className="flex items-center gap-1"><Clock size={10} /> {appt.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-white/5">
                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Reason</p>
                            <p className="text-[10px] text-gray-300 line-clamp-2">{appt.problem}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : view === 'SETTINGS' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button 
                    onClick={() => setView('MENU')}
                    className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-4"
                  >
                    <ChevronRight className="rotate-180" size={16} /> Back to Menu
                  </button>

                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">App Settings</h3>

                  <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)]">
                          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Appearance</h4>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{theme} Mode Active</p>
                        </div>
                      </div>
                      <button 
                        onClick={onToggleTheme}
                        className="relative w-14 h-7 bg-white/10 rounded-full p-1 transition-all duration-500 border border-white/10"
                      >
                        <motion.div 
                          animate={{ x: theme === 'dark' ? 28 : 0 }}
                          className="w-5 h-5 bg-[var(--accent-primary)] rounded-full shadow-lg flex items-center justify-center"
                        >
                          {theme === 'dark' ? <Moon size={10} className="text-white" /> : <Sun size={10} className="text-white" />}
                        </motion.div>
                      </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between opacity-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center text-gray-500">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Biometric Lock</h4>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Coming Soon</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center space-y-4">
                   <button 
                    onClick={() => setView('MENU')}
                    className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-4 mx-auto"
                  >
                    <ChevronRight className="rotate-180" size={16} /> Back to Menu
                  </button>
                  <p className="text-gray-400 font-medium">This section is coming soon</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5">
              <button 
                onClick={handleShare}
                className="w-full py-4 bg-[#1e1b4b] hover:bg-[#2e2a7a] text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl"
              >
                <Share2 size={20} />
                Share App
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserProfile;
