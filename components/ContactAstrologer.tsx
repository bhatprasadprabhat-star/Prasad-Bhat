import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Calendar, Clock, CreditCard, CheckCircle2, X, ChevronDown, ChevronUp, Sparkles, Heart, MessageSquare } from 'lucide-react';

type Step = 'CLOSED' | 'FORM' | 'REMEDY_SELECTION' | 'PAYMENT' | 'SUCCESS';

const ContactAstrologer = ({ lang, initialStep = 'CLOSED', onClose, onDonate, onFeedback }: { lang: Language, initialStep?: Step, onClose?: () => void, onDonate?: () => void, onFeedback?: () => void }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [step, setStep] = useState<Step>(initialStep);
  const [problem, setProblem] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [expandedTier, setExpandedTier] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'IDLE' | 'SENDING' | 'SENT' | 'FAILED' | 'SIMULATED'>('IDLE');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Current time
  const [now, setNow] = useState(new Date());

  // Update time every minute to keep slots fresh
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const dates = useMemo(() => {
    const options = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'long' });
      options.push({ label, value: dateStr });
    }
    return options;
  }, []);

  const timeSlots = useMemo(() => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 21; // 9 PM
    
    for (let h = startHour; h <= endHour; h++) {
      for (let m of [0, 30]) {
        const hour = h > 12 ? h - 12 : h;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const timeStr = `${hour}:${m === 0 ? '00' : '30'} ${ampm}`;
        
        // If selected date is today, only show future times
        if (selectedDate === now.toISOString().split('T')[0]) {
          const slotDate = new Date(now);
          slotDate.setHours(h, m, 0, 0);
          if (slotDate <= now) continue;
        }
        
        slots.push(timeStr);
      }
    }
    return slots;
  }, [selectedDate]);

  const tiers = [
    {
      id: 1,
      title: t.tier1_title,
      price: t.tier1_price,
      amount: 99,
      meaning: t.tier1_meaning,
      includes: [
        'Brief problem analysis',
        '2–3 simple remedies',
        'Basic planetary reason'
      ]
    },
    {
      id: 2,
      title: t.tier2_title,
      price: t.tier2_price,
      amount: 599,
      meaning: t.tier2_meaning,
      includes: [
        'Detailed planet analysis',
        '5–7 remedies',
        'Timeline for results',
        'Dosha explanation'
      ]
    },
    {
      id: 3,
      title: t.tier3_title,
      price: t.tier3_price,
      amount: 999,
      meaning: t.tier3_meaning,
      includes: [
        'Full birth chart breakdown',
        'Dasha analysis',
        'Marriage, career, finance',
        'Personalized action plan',
        'Complete remedy guide'
      ]
    }
  ];

  const reset = () => {
    if (onClose) {
      onClose();
    } else {
      setStep('CLOSED');
    }
    setProblem('');
    setName('');
    setContact('');
    setSelectedDate('');
    setSelectedTime('');
    setSelectedTier(null);
    setExpandedTier(null);
    setIsProcessing(false);
    setEmailStatus('IDLE');
    setEmailError(null);
  };

  if (step === 'CLOSED') {
    return (
      <motion.button
        whileHover={{ scale: 1.02, y: -8 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setStep('FORM')}
        className="w-full bg-[var(--bg-secondary)] backdrop-blur-2xl border-2 border-[var(--accent-primary)]/50 rounded-lg p-6 sm:p-16 shadow-[0_0_50px_rgba(var(--accent-primary-rgb),0.3)] flex flex-col sm:flex-row items-center justify-between group relative overflow-hidden text-center sm:text-left h-full"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-6 sm:p-12 opacity-10 group-hover:opacity-30 transition-all duration-1000">
          <Sparkles size={100} className="sm:w-[200px] sm:h-[200px] text-[var(--accent-primary)] animate-pulse" />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 z-10">
          <div className="relative">
            <div className="w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-br from-[var(--accent-primary)] via-[var(--color-gold-dark)] to-[var(--accent-primary)] rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.6)] border-2 border-[var(--accent-primary)] group-hover:rotate-12 transition-transform duration-1000 relative z-10">
              <span className="text-3xl sm:text-7xl drop-shadow-2xl">🍃</span>
            </div>
            <div className="absolute -inset-6 border-2 border-dashed border-[var(--accent-primary)]/40 rounded-lg animate-[spin_20s_linear_infinite]" />
            <div className="absolute -inset-10 border border-dotted border-[var(--accent-primary)]/20 rounded-full animate-[spin_40s_linear_reverse_infinite]" />
          </div>
          <div className="space-y-3 sm:space-y-5">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/20 border border-green-500/40 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)]" />
                <span className="text-[10px] sm:text-[12px] font-ancient font-black text-green-500 uppercase tracking-widest">Daivajna Live</span>
              </div>
            </div>
            <h3 className="text-3xl sm:text-7xl font-ancient font-black gold-leaf uppercase tracking-tighter leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              {t.tambula_offering || 'Offer Tambula'}
            </h3>
            <p className="text-[12px] sm:text-2xl font-premium font-bold text-[var(--accent-primary)] uppercase tracking-[0.4em] flex items-center gap-3 justify-center sm:justify-start">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_rgba(var(--accent-primary-rgb),0.8)]" />
              {t.contact_astrologer_desc}
            </p>
          </div>
        </div>
        <div className="mt-8 sm:mt-0 px-12 sm:px-20 py-5 sm:py-8 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--color-gold-dark)] to-[var(--accent-primary)] text-white dark:text-[#020617] rounded-lg font-ancient font-black uppercase tracking-[0.4em] text-[12px] sm:text-xl group-hover:scale-110 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-10 border-2 border-white/20 hover:shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.5)]">
          Offer Tambula →
        </div>
      </motion.button>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[150] bg-[var(--bg-primary)]/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.98, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[var(--bg-secondary)] w-full max-w-2xl rounded-lg border border-[var(--border-primary)] shadow-xl overflow-hidden flex flex-col max-h-[90vh] relative"
      >
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
        {/* Header */}
        <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-6 sm:p-10 text-[var(--accent-primary)] flex justify-between items-center relative overflow-hidden shrink-0 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-4 sm:gap-8 z-10">
            <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)]/50 flex items-center justify-center text-2xl sm:text-5xl shadow-2xl">🍃</div>
            <div>
              <h2 className="text-xl sm:text-4xl font-ancient font-black gold-leaf uppercase tracking-widest leading-none">{t.tambula_offering || 'Tambula Offering'}</h2>
              <p className="text-[9px] sm:text-[12px] uppercase tracking-[0.4em] font-ancient font-bold mt-2 text-[var(--accent-primary)]/80">Sacred Ritual for Divine Clarity</p>
            </div>
          </div>
          <button onClick={reset} className="p-3 bg-[var(--bg-primary)]/50 hover:bg-red-500/20 text-[var(--accent-primary)] hover:text-red-500 rounded-lg transition-all z-10 border border-[var(--border-primary)]">
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-12 overflow-y-auto flex-1 custom-scrollbar relative z-10">
          <AnimatePresence mode="wait">
            {step === 'FORM' && (
              <motion.div 
                key="form"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                className="space-y-10"
              >
                <div className="p-8 bg-[var(--bg-primary)]/50 border border-[var(--border-primary)] rounded-lg flex flex-col sm:flex-row items-center gap-8 mb-10">
                  <div className="w-28 h-28 rounded-lg overflow-hidden border border-[var(--border-primary)] shrink-0 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1524492459413-0296b71d4744?q=80&w=400&auto=format&fit=crop" 
                      alt="Sacred Temple" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h4 className="text-base font-ancient font-black gold-leaf uppercase tracking-widest">{t.tambula_offering || 'Tambula Offering'}</h4>
                    <p className="text-xs sm:text-sm font-premium font-bold text-[var(--accent-primary)]/90 leading-relaxed italic">
                      {t.tambula_desc || 'In Vedic tradition, a seeker offers Tambula (Betel leaf, Areca nut, and Dakshina) to the Daivajna (Astrologer) to invoke divine clarity.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] sm:text-[12px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest flex items-center gap-3">
                    <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-[10px] sm:text-[12px] text-white dark:text-[#020617] font-black">01</span>
                    Your Name
                  </label>
                  <input 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="details-input w-full p-4 text-sm font-premium bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)]"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] sm:text-[12px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest flex items-center gap-3">
                    <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-[10px] sm:text-[12px] text-white dark:text-[#020617] font-black">02</span>
                    Contact Number
                  </label>
                  <input 
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder="Enter your contact number"
                    className="details-input w-full p-4 text-sm font-premium bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)]"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] sm:text-[12px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest flex items-center gap-3">
                    <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-[10px] sm:text-[12px] text-white dark:text-[#020617] font-black">03</span>
                    {t.problem_label}
                  </label>
                  <textarea 
                    value={problem}
                    onChange={e => setProblem(e.target.value)}
                    placeholder={t.problem_placeholder}
                    className="details-input w-full p-4 text-sm font-premium bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)] min-h-[120px] sm:min-h-[150px]"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] sm:text-[12px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest flex items-center gap-3">
                    <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-[10px] sm:text-[12px] text-white dark:text-[#020617] font-black">04</span>
                    {t.appointment_date}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {dates.map(d => (
                      <button
                        key={d.value}
                        onClick={() => {
                          setSelectedDate(d.value);
                          setSelectedTime(''); // Reset time when date changes
                        }}
                        className={`p-3 rounded-lg border font-ancient font-bold text-[10px] sm:text-xs transition-all duration-500 ${
                          selectedDate === d.value 
                            ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white dark:text-[#020617] shadow-xl scale-105' 
                            : 'bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <div className="space-y-4">
                    <label className="text-[10px] sm:text-[12px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest flex items-center gap-3">
                      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-[10px] sm:text-[12px] text-white dark:text-[#020617] font-black">05</span>
                      {t.appointment_time}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {timeSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`p-3 rounded-lg border font-ancient font-bold text-[10px] flex items-center justify-center transition-all duration-500 ${
                            selectedTime === slot 
                              ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white dark:text-[#020617] shadow-xl' 
                              : 'bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-6 bg-[var(--accent-primary)]/5 border border-[var(--border-primary)] rounded-lg">
                  <p className="text-[11px] sm:text-[13px] font-premium font-bold text-[var(--accent-primary)]/80 leading-relaxed italic text-center">
                    "{t.disclaimer}"
                  </p>
                </div>

                <button 
                  onClick={() => setStep('REMEDY_SELECTION')}
                  disabled={!problem || !name || !contact || !selectedDate || !selectedTime}
                  className="w-full py-5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] rounded-lg font-ancient font-black uppercase tracking-[0.4em] text-sm sm:text-base shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {t.tambula_offering || 'Offer Tambula'}
                </button>
              </motion.div>
            )}

            {step === 'REMEDY_SELECTION' && (
              <motion.div 
                key="remedies"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                className="space-y-8"
              >
                <div className="relative w-full h-48 sm:h-80 rounded-lg overflow-hidden border border-[var(--border-primary)] shadow-2xl mb-8 group">
                  <img 
                    src="https://images.unsplash.com/photo-1590004953392-5aba2e72269a?q=80&w=800&auto=format&fit=crop" 
                    alt="Traditional Ritual" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
                  <div className="absolute bottom-6 sm:bottom-10 left-8 sm:left-12">
                    <h3 className="text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.3em] text-xl sm:text-3xl drop-shadow-2xl">{t.remedy_options_title}</h3>
                    <p className="text-[var(--accent-primary)]/80 text-[10px] sm:text-[12px] font-ancient font-bold uppercase tracking-widest mt-2">Sacred Tambula Offering</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {tiers.map(tier => (
                    <div
                      key={tier.id}
                      className={`w-full rounded-lg border transition-all duration-500 overflow-hidden relative group/tier ${
                        selectedTier === tier.id 
                          ? 'border-[var(--accent-primary)] bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--color-gold-dark)]/10 shadow-[0_0_50px_rgba(212,175,55,0.2)] scale-[1.02]' 
                          : 'border-[var(--border-primary)] bg-[var(--bg-primary)]/50 hover:border-[var(--accent-primary)]/40 hover:bg-[var(--bg-primary)]/80'
                      }`}
                    >
                      {selectedTier === tier.id && (
                        <motion.div 
                          layoutId="activeGlow"
                          className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/10 via-transparent to-[var(--accent-primary)]/10 animate-pulse pointer-events-none"
                        />
                      )}
                      <button
                        onClick={() => {
                          setSelectedTier(tier.id);
                          setExpandedTier(expandedTier === tier.id ? null : tier.id);
                        }}
                        className="w-full p-6 sm:p-10 flex justify-between items-center group relative z-10"
                      >
                        <div className="flex items-center gap-6 sm:gap-10">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                            selectedTier === tier.id 
                              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] shadow-[0_0_20px_rgba(212,175,55,0.8)]' 
                              : 'border-[var(--border-primary)] bg-transparent'
                          }`}>
                            {selectedTier === tier.id && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 rounded-full bg-white dark:bg-[#020617] shadow-inner" 
                              />
                            )}
                          </div>
                          <div className="text-left">
                            <h4 className={`font-ancient font-black uppercase tracking-tight text-lg sm:text-2xl transition-colors duration-500 ${
                              selectedTier === tier.id ? 'text-[var(--accent-primary)] drop-shadow-sm' : 'text-[var(--text-primary)]'
                            }`}>{tier.title}</h4>
                            <p className={`text-[10px] sm:text-[14px] font-premium font-bold uppercase tracking-widest transition-colors duration-500 ${
                              selectedTier === tier.id ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]/60'
                            }`}>{tier.meaning}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 sm:gap-10">
                          <div className="text-right">
                            <span className={`text-xl sm:text-3xl font-ancient font-black transition-colors duration-500 ${
                              selectedTier === tier.id ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                            }`}>{tier.price}</span>
                            <p className="text-[8px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)]/60 uppercase tracking-widest">Dakshina</p>
                          </div>
                          <div className={`p-2.5 sm:p-4 rounded-xl transition-all duration-500 ${
                            expandedTier === tier.id 
                              ? 'bg-[var(--accent-primary)] text-white dark:text-[#020617] shadow-lg rotate-180' 
                              : 'bg-[var(--bg-primary)]/50 text-[var(--accent-primary)] border border-[var(--border-primary)] group-hover/tier:border-[var(--accent-primary)]/40'
                          }`}>
                            <ChevronDown size={20} className="sm:w-7 sm:h-7" />
                          </div>
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedTier === tier.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-16 pb-10"
                          >
                            <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/30 to-transparent mb-8" />
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {tier.includes.map((item, i) => (
                                <li key={i} className="text-xs sm:text-sm font-premium font-bold text-[var(--accent-primary)]/80 flex items-center gap-4">
                                  <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-8">
                  <button 
                    onClick={() => setStep('FORM')}
                    className="flex-1 py-5 border border-[var(--border-primary)] text-[var(--accent-primary)] rounded-lg font-ancient font-black uppercase tracking-[0.3em] text-xs sm:text-sm hover:bg-[var(--bg-primary)]/50 transition-all"
                  >
                    {t.back}
                  </button>
                  <button 
                    onClick={() => setStep('PAYMENT')}
                    disabled={!selectedTier}
                    className="flex-[2] py-5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] rounded-lg font-ancient font-black uppercase tracking-[0.3em] text-xs sm:text-sm shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {t.pay_now}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'PAYMENT' && (
              <motion.div 
                key="payment"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-12 py-8"
              >
                <div className="relative mx-auto w-56 h-56 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-[var(--accent-primary)] shadow-xl group">
                  <img 
                    src="https://images.unsplash.com/photo-1590004953392-5aba2e72269a?q=80&w=600&auto=format&fit=crop" 
                    alt="Sacred Offering" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 sm:bottom-12 inset-x-0 text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.4em] text-[12px] sm:text-[14px] drop-shadow-2xl">Sacred Offering</div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-4xl font-ancient font-black gold-leaf uppercase tracking-tight">Complete Your Offering</h3>
                  <p className="text-sm sm:text-lg font-premium font-bold text-[var(--accent-primary)]/90 max-w-md mx-auto">Please complete the payment of <span className="font-black text-[var(--accent-primary)] text-lg sm:text-2xl">{tiers.find(t => t.id === selectedTier)?.price}</span> to confirm your sacred session.</p>
                  <p className="text-[10px] sm:text-[12px] text-[var(--accent-primary)]/70 italic font-premium">Click the button below to pay via your UPI app. Your appointment will be booked automatically upon payment.</p>
                </div>

                <div className="bg-[var(--bg-primary)]/50 border border-dashed border-[var(--border-primary)] rounded-lg p-8 sm:p-12 space-y-6 sm:space-y-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Sparkles size={60} className="sm:w-20 sm:h-20 text-[var(--accent-primary)]" />
                  </div>
                  
                  <div className="space-y-6 sm:space-y-8">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center mx-auto border border-[var(--border-primary)]">
                      <CreditCard className="text-[var(--accent-primary)] sm:w-14 sm:h-14" size={40} />
                    </div>

                    <motion.a 
                      href={`upi://pay?pa=prabhatprasadbhat@oksbi&pn=Prabhat%20Prasad%20Bhat&am=${tiers.find(t => t.id === selectedTier)?.amount || 0}&cu=INR&tn=${encodeURIComponent('TambulaOffering')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setIsProcessing(true);
                        setTimeout(async () => {
                          const appointment = {
                            id: Date.now().toString(),
                            name,
                            contact,
                            problem,
                            date: selectedDate,
                            time: selectedTime,
                            tier: tiers.find(t => t.id === selectedTier)?.title,
                            timestamp: new Date().toISOString()
                          };

                          const existing = JSON.parse(localStorage.getItem('astro_appointments') || '[]');
                          localStorage.setItem('astro_appointments', JSON.stringify([appointment, ...existing]));

                          setEmailStatus('SENDING');
                          setEmailError(null);
                          try {
                            const response = await fetch('/api/send-appointment-email', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                name,
                                contact,
                                date: selectedDate,
                                time: selectedTime,
                                reason: problem,
                                tier: tiers.find(t => t.id === selectedTier)?.title
                              })
                            });
                            const data = await response.json();
                            if (data.success) {
                              setEmailStatus('SENT');
                            } else if (data.error === 'SMTP_NOT_CONFIGURED') {
                              setEmailStatus('SIMULATED');
                            } else {
                              setEmailStatus('FAILED');
                              setEmailError(data.message || 'Server failed to send email');
                            }
                          } catch (e: any) {
                            console.error('Failed to trigger email API', e);
                            setEmailStatus('FAILED');
                            setEmailError(e.message || 'Network error occurred');
                          }

                          setStep('SUCCESS');
                          setIsProcessing(false);
                        }, 4000);
                      }}
                      className={`w-full py-6 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] rounded-lg font-ancient font-black uppercase tracking-[0.3em] text-sm sm:text-base shadow-xl transition-all border border-[var(--accent-primary)]/30 flex items-center justify-center gap-4 no-underline ${isProcessing ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-5 h-5 border-2 border-white dark:border-[#020617] border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        'Pay via UPI App ➔'
                      )}
                    </motion.a>
                    
                    <button 
                      onClick={(e) => {
                        navigator.clipboard.writeText('prabhatprasadbhat@oksbi');
                        const btn = e.currentTarget;
                        const originalText = btn.innerText;
                        btn.innerText = 'Copied!';
                        btn.style.color = 'var(--text-primary)';
                        setTimeout(() => {
                           btn.innerText = originalText;
                           btn.style.color = '';
                        }, 2000);
                      }}
                      className="w-full py-4 bg-[var(--bg-primary)]/50 border border-[var(--border-primary)] text-[var(--accent-primary)]/80 rounded-lg font-ancient font-black uppercase tracking-widest text-[10px] sm:text-[12px] hover:bg-[var(--accent-primary)]/10 transition-all"
                    >
                      Copy UPI ID
                    </button>
                  </div>
                  
                  <p className="text-[10px] sm:text-[12px] font-ancient font-bold text-[var(--accent-primary)]/60 uppercase tracking-[0.3em]">Secure UPI Payment</p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep('REMEDY_SELECTION')}
                    className="w-full py-5 border border-[var(--border-primary)] text-[var(--accent-primary)] rounded-lg font-ancient font-black uppercase tracking-[0.3em] text-xs sm:text-sm hover:bg-[var(--bg-primary)]/50 transition-all"
                  >
                    {t.back}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'SUCCESS' && (
              <motion.div 
                key="success"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12 sm:py-16 space-y-6 sm:space-y-10"
              >
                <div className="w-20 h-20 sm:w-32 sm:h-32 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto text-4xl sm:text-7xl shadow-2xl border border-green-500/40 animate-bounce">✓</div>
                <div className="space-y-2 sm:space-y-4">
                  <h3 className="text-3xl sm:text-5xl font-ancient font-black gold-leaf uppercase tracking-tight">Dhanyavaada!</h3>
                  <p className="text-lg sm:text-2xl font-premium font-bold text-[var(--accent-primary)]">{t.problem_submitted_msg}</p>
                </div>
                <p className="text-sm sm:text-lg font-premium font-bold text-[var(--text-primary)]/90 px-6 sm:px-12 leading-relaxed">Your appointment is scheduled for <span className="text-[var(--accent-primary)] font-black">{selectedDate}</span> at <span className="text-[var(--accent-primary)] font-black">{selectedTime}</span>. Our masters are preparing for your session.</p>
                
                <div className="px-10">
                  {emailStatus === 'SENT' && (
                    <div className="p-5 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-4 text-green-500 text-xs sm:text-sm font-premium font-bold">
                      <CheckCircle2 size={20} />
                      Details sent to bhatprasadprabhat@gmail.com
                    </div>
                  )}
                  {emailStatus === 'SIMULATED' && (
                    <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-lg flex flex-col gap-3 text-amber-500 text-xs sm:text-sm font-premium font-bold text-left">
                      <div className="flex items-center gap-4">
                        <Sparkles size={20} />
                        Email Simulation Active
                      </div>
                      <p className="font-medium opacity-80">To receive real emails, go to Settings and set EMAIL_USER and EMAIL_PASS environment variables.</p>
                    </div>
                  )}
                  {emailStatus === 'FAILED' && (
                    <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg flex flex-col gap-3 text-red-500 text-xs sm:text-sm font-premium font-bold text-left">
                      <div className="flex items-center gap-4">
                        <X size={20} />
                        Email Notification Failed
                      </div>
                      <p className="font-medium opacity-80">{emailError || 'A technical error occurred while sending the email.'}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-8 py-6 border-t border-[var(--border-primary)]">
                  <button 
                    onClick={onDonate}
                    className="flex items-center gap-3 text-[11px] sm:text-[13px] font-ancient font-black uppercase tracking-[0.3em] text-[var(--text-primary)]/80 hover:text-[var(--accent-primary)] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl border border-red-500/30">
                      <Heart size={18} className="text-red-500 fill-current" />
                    </div>
                    {t.donate_support}
                  </button>
                  <button 
                    onClick={onFeedback}
                    className="flex items-center gap-3 text-[11px] sm:text-[13px] font-ancient font-black uppercase tracking-[0.3em] text-[var(--accent-primary)]/80 hover:text-[var(--accent-primary)] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl border border-[var(--border-primary)]">
                      <MessageSquare size={18} className="text-[var(--accent-primary)]" />
                    </div>
                    {t.feedback}
                  </button>
                </div>

                <button 
                  onClick={reset}
                  className="w-full py-6 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] rounded-lg font-ancient font-black uppercase tracking-[0.4em] text-sm sm:text-base shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {t.return_home}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactAstrologer;
