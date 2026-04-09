
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Save, History, Calendar, MapPin, Clock, Trash2, ChevronRight, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language, UserIntake } from '../types';
import TimePicker from './TimePicker';

interface PastReading {
  id: string;
  type: string;
  date: string;
  summary: string;
}

const UserProfile = ({ lang, intake, onUpdateIntake }: { 
  lang: Language, 
  intake: UserIntake, 
  onUpdateIntake: (newIntake: UserIntake) => void 
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'HISTORY' | 'APPOINTMENTS'>('DETAILS');
  const [localIntake, setLocalIntake] = useState(intake);
  const [history, setHistory] = useState<PastReading[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

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
    onUpdateIntake(localIntake);
    localStorage.setItem('astro_user_intake', JSON.stringify(localIntake));
    // Show success toast or something
  };

  const handleLangChange = (newLang: Language) => {
    localStorage.setItem('astro_logic_lang', newLang);
    window.location.reload(); // Reload to apply language changes globally
  };

  const clearHistory = () => {
    localStorage.removeItem('astro_readings_history');
    setHistory([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 bg-amber-50/95 backdrop-blur-xl border-4 border-[#D4AF37]/30 rounded-[3rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <User size={120} className="text-[#D4AF37]" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#451a03] to-[#7c2d12] rounded-3xl flex items-center justify-center text-[#D4AF37] shadow-xl border-2 border-[#D4AF37]/50">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#451a03] uppercase tracking-widest astrological-font">{t.user_profile || 'Soul Profile'}</h2>
              <p className="text-xs font-black text-[#7C2D12] uppercase tracking-[0.3em] opacity-60">Manage your cosmic identity</p>
            </div>
          </div>

          <div className="flex bg-[#451a03]/10 p-1.5 rounded-2xl border border-[#D4AF37]/20">
            <button 
              onClick={() => setActiveTab('DETAILS')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'DETAILS' ? 'bg-[#D4AF37] text-[#451a03] shadow-lg' : 'text-[#451a03]/60 hover:text-[#451a03]'}`}
            >
              Details
            </button>
            <button 
              onClick={() => setActiveTab('HISTORY')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'HISTORY' ? 'bg-[#D4AF37] text-[#451a03] shadow-lg' : 'text-[#451a03]/60 hover:text-[#451a03]'}`}
            >
              History
            </button>
            <button 
              onClick={() => setActiveTab('APPOINTMENTS')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'APPOINTMENTS' ? 'bg-[#D4AF37] text-[#451a03] shadow-lg' : 'text-[#451a03]/60 hover:text-[#451a03]'}`}
            >
              Appointments
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'DETAILS' ? (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#451a03] uppercase tracking-widest ml-1 flex items-center gap-2">
                    <User size={12} /> {t.name_of_soul || 'Name'}
                  </label>
                  <input 
                    value={localIntake.name} 
                    onChange={e => setLocalIntake({...localIntake, name: e.target.value})}
                    className="w-full bg-amber-50/30 border-2 border-[#D4AF37]/20 rounded-2xl px-6 py-4 font-bold text-[#451a03] focus:border-[#D4AF37] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#451a03] uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Calendar size={12} /> {t.dob || 'Date of Birth'}
                  </label>
                  <input 
                    type="date"
                    value={localIntake.dob} 
                    onChange={e => setLocalIntake({...localIntake, dob: e.target.value})}
                    className="w-full bg-amber-50/30 border-2 border-[#D4AF37]/20 rounded-2xl px-6 py-4 font-bold text-[#451a03] focus:border-[#D4AF37] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#451a03] uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Clock size={12} /> {t.tob || 'Time of Birth'}
                  </label>
                  <TimePicker 
                    time={localIntake.tob} 
                    ampm={localIntake.ampm || 'AM'}
                    onChange={(t, a) => setLocalIntake({...localIntake, tob: t, ampm: a})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#451a03] uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin size={12} /> {t.pob || 'Place of Birth'}
                  </label>
                  <input 
                    value={localIntake.pob} 
                    onChange={e => setLocalIntake({...localIntake, pob: e.target.value})}
                    className="w-full bg-amber-50/30 border-2 border-[#D4AF37]/20 rounded-2xl px-6 py-4 font-bold text-[#451a03] focus:border-[#D4AF37] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleSave}
                  className="w-full sm:w-auto px-12 py-4 bg-[#451a03] text-[#D4AF37] rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={18} />
                  Save Cosmic Details
                </button>
              </div>
            </motion.div>
          ) : activeTab === 'HISTORY' ? (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-[#451a03] uppercase tracking-widest">Recent Insights</h3>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2 hover:opacity-70"
                  >
                    <Trash2 size={12} /> Clear All
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="py-20 text-center space-y-4 bg-[#451a03]/5 rounded-[2rem] border-2 border-dashed border-[#D4AF37]/20">
                  <History size={48} className="mx-auto text-[#D4AF37]/30" />
                  <p className="text-sm font-bold text-[#451a03]/40 uppercase tracking-widest">No past readings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-amber-50/40 border-2 border-[#D4AF37]/10 rounded-3xl p-6 flex items-center justify-between group hover:border-[#D4AF37]/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-black text-[#451a03] uppercase tracking-tight">{item.type}</h4>
                            <span className="text-[9px] font-black text-[#451a03]/40 uppercase tracking-widest">{item.date}</span>
                          </div>
                          <p className="text-xs font-medium text-[#451a03]/60 mt-1">{item.summary}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-[#D4AF37] group-hover:translate-x-2 transition-transform" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="appointments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#451a03] uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={16} className="text-[#D4AF37]" /> Upcoming Appointments
                  </h3>
                  <button 
                    onClick={async () => {
                      const btn = document.activeElement as HTMLButtonElement;
                      const originalText = btn.innerText;
                      btn.innerText = 'Testing...';
                      btn.disabled = true;
                      try {
                        const res = await fetch('/api/send-appointment-email', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: 'Test User',
                            contact: '1234567890',
                            date: '2026-03-18',
                            time: '10:00 AM',
                            reason: 'Testing email configuration'
                          })
                        });
                        const data = await res.json();
                        if (data.success) {
                          alert('✅ Test email sent successfully!');
                        } else if (data.message?.includes('Application-specific password required')) {
                          alert('❌ Gmail Error: Application-specific password required.\n\nHow to Fix:\n1. Go to https://myaccount.google.com/apppasswords\n2. Create an "App Password" for "ASTRO LOGIC"\n3. Use the 16-character code in EMAIL_PASS in Settings.');
                        } else {
                          alert(`❌ Error: ${data.message || 'Failed to send'}`);
                        }
                      } catch (e: any) {
                        alert(`❌ Network Error: ${e.message}`);
                      } finally {
                        btn.innerText = originalText;
                        btn.disabled = false;
                      }
                    }}
                    className="text-[9px] font-black text-[#451a03]/40 uppercase tracking-widest border border-[#451a03]/10 px-3 py-1 rounded-lg hover:bg-[#451a03]/5 transition-all"
                  >
                    Test Email Config
                  </button>
                </div>
                
                {appointments.length === 0 ? (
                  <div className="py-12 text-center space-y-4 bg-[#451a03]/5 rounded-[2rem] border-2 border-dashed border-[#D4AF37]/20">
                    <p className="text-xs font-bold text-[#451a03]/40 uppercase tracking-widest">No upcoming appointments</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {appointments.map((appt) => (
                      <div 
                        key={appt.id}
                        className="bg-amber-50/40 border-2 border-[#D4AF37]/20 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#D4AF37] transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#451a03] text-[#D4AF37] flex items-center justify-center">
                            <Clock size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-[#451a03] uppercase tracking-tight">{appt.tier}</h4>
                            <div className="flex items-center gap-3 text-[10px] font-black text-[#451a03]/60 uppercase tracking-widest mt-1">
                              <span className="flex items-center gap-1"><Calendar size={10} /> {appt.date}</span>
                              <span className="flex items-center gap-1"><Clock size={10} /> {appt.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-[#451a03]/40 uppercase tracking-widest mb-1">Reason</p>
                          <p className="text-xs font-bold text-[#451a03] truncate max-w-[200px]">{appt.problem}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black text-[#451a03] uppercase tracking-widest flex items-center gap-2">
                  <History size={16} className="text-[#D4AF37]" /> Past History
                </h3>
                <div className="py-12 text-center space-y-4 bg-[#451a03]/5 rounded-[2rem] border-2 border-dashed border-[#D4AF37]/20">
                  <p className="text-xs font-bold text-[#451a03]/40 uppercase tracking-widest">No past history available</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;
