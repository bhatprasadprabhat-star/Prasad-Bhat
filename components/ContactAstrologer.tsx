import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [selectedDate, setSelectedDate] = useState('');
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
        className="w-full bg-gradient-to-br from-amber-50 via-[#fef3c7] to-amber-100/50 backdrop-blur-xl border-4 border-[#D4AF37] rounded-[4rem] p-10 sm:p-16 shadow-[0_30px_60px_rgba(212,175,55,0.25)] flex flex-col sm:flex-row items-center justify-between group relative overflow-hidden text-center sm:text-left h-full"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-15 transition-all duration-700">
          <Sparkles size={160} className="text-[#D4AF37] animate-pulse" />
        </div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-3xl" />
        
        <div className="flex flex-col sm:flex-row items-center gap-10 z-10">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#451a03] to-[#7c2d12] rounded-[2.5rem] flex items-center justify-center shadow-[0_15px_40px_rgba(69,26,3,0.4)] border-2 border-[#D4AF37]/50 group-hover:rotate-12 transition-transform duration-700 relative z-10">
              <span className="text-5xl sm:text-6xl">🍃</span>
            </div>
            <div className="absolute -inset-4 border-2 border-dashed border-[#D4AF37]/30 rounded-[3rem] animate-[spin_20s_linear_infinite]" />
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-white text-xs">✨</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500 rounded-full animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Daivajna Live</span>
              </div>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black text-[#451a03] uppercase tracking-tighter leading-none astrological-font drop-shadow-sm">
              {t.tambula_offering || 'Offer Tambula'}
            </h3>
            <p className="text-xs sm:text-base font-black text-[#7C2D12] uppercase tracking-[0.4em] opacity-80 flex items-center gap-2 justify-center sm:justify-start">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              {t.contact_astrologer_desc}
            </p>
          </div>
        </div>
        <div className="mt-10 sm:mt-0 px-12 py-5 bg-[#451a03] text-[#D4AF37] rounded-full font-black uppercase tracking-[0.2em] text-sm group-hover:bg-[#D4AF37] group-hover:text-[#451a03] group-hover:scale-110 transition-all shadow-2xl z-10 border-2 border-[#D4AF37]/20">
          Offer Tambula →
        </div>
      </motion.button>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#fef3c7] w-full max-w-2xl rounded-[3rem] border-4 border-[#D4AF37] shadow-[0_0_100px_rgba(212,175,55,0.3)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#451a03] to-[#7c2d12] p-8 text-[#D4AF37] flex justify-between items-center relative overflow-hidden shrink-0 border-b-4 border-[#D4AF37]">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="flex items-center gap-6 z-10">
            <div className="w-16 h-16 rounded-2xl border-2 border-[#D4AF37] bg-amber-50 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(212,175,55,0.5)]">🍃</div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest astrological-font leading-none">{t.tambula_offering || 'Tambula Offering'}</h2>
              <p className="text-[11px] uppercase tracking-[0.3em] font-black mt-2 text-white/70">Sacred Ritual for Divine Clarity</p>
            </div>
          </div>
          <button onClick={reset} className="p-3 bg-black/20 hover:bg-black/40 rounded-full transition-all z-10 text-white">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 custom-scrollbar">
          <AnimatePresence mode="wait">
            {step === 'FORM' && (
              <motion.div 
                key="form"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8"
              >
                <div className="p-6 bg-[#451a03]/5 border-2 border-[#D4AF37]/30 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1524492459413-0296b71d4744?q=80&w=400&auto=format&fit=crop" 
                      alt="Sacred Temple" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-sm font-black text-[#451a03] uppercase tracking-widest">{t.tambula_offering || 'Tambula Offering'}</h4>
                    <p className="text-[11px] font-medium text-[#451a03]/70 leading-relaxed italic">
                      {t.tambula_desc || 'In Vedic tradition, a seeker offers Tambula (Betel leaf, Areca nut, and Dakshina) to the Daivajna (Astrologer) to invoke divine clarity.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-[#451a03] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#D4AF37] flex items-center justify-center text-[10px] text-white">01</span>
                    Your Name
                  </label>
                  <input 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-amber-50/50 border-2 border-[#D4AF37]/20 rounded-2xl p-4 text-sm font-bold text-[#451a03] focus:border-[#D4AF37] outline-none shadow-inner"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-[#451a03] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#D4AF37] flex items-center justify-center text-[10px] text-white">02</span>
                    Contact Number
                  </label>
                  <input 
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder="Enter your contact number"
                    className="w-full bg-amber-50/50 border-2 border-[#D4AF37]/20 rounded-2xl p-4 text-sm font-bold text-[#451a03] focus:border-[#D4AF37] outline-none shadow-inner"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-[#451a03] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#D4AF37] flex items-center justify-center text-[10px] text-white">03</span>
                    {t.problem_label}
                  </label>
                  <textarea 
                    value={problem}
                    onChange={e => setProblem(e.target.value)}
                    placeholder={t.problem_placeholder}
                    className="w-full bg-amber-50/50 border-2 border-[#D4AF37]/20 rounded-2xl p-4 text-sm font-bold text-[#451a03] focus:border-[#D4AF37] outline-none min-h-[120px] shadow-inner"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-[#451a03] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#D4AF37] flex items-center justify-center text-[10px] text-white">04</span>
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
                        className={`p-3 rounded-xl border-2 font-bold text-xs transition-all ${
                          selectedDate === d.value 
                            ? 'bg-[#451a03] border-[#451a03] text-[#D4AF37] shadow-lg scale-105' 
                            : 'bg-white border-[#D4AF37]/20 text-[#451a03] hover:border-[#D4AF37]'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <div className="space-y-4">
                    <label className="text-xs font-black text-[#451a03] uppercase tracking-widest flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-[#D4AF37] flex items-center justify-center text-[10px] text-white">05</span>
                      {t.appointment_time}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`p-3 rounded-xl border-2 font-bold text-[10px] flex items-center justify-center transition-all ${
                            selectedTime === slot 
                              ? 'bg-[#451a03] border-[#451a03] text-[#D4AF37] shadow-lg' 
                              : 'bg-amber-50/50 border-[#D4AF37]/20 text-[#451a03] hover:border-[#D4AF37]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <p className="text-[10px] font-bold text-amber-900 leading-relaxed italic">
                    "{t.disclaimer}"
                  </p>
                </div>

                <button 
                  onClick={() => setStep('REMEDY_SELECTION')}
                  disabled={!problem || !name || !contact || !selectedDate || !selectedTime}
                  className="w-full py-5 bg-gradient-to-r from-[#451a03] to-[#7c2d12] text-[#D4AF37] rounded-2xl font-black uppercase tracking-[0.3em] text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {t.tambula_offering || 'Offer Tambula'}
                </button>
              </motion.div>
            )}

            {step === 'REMEDY_SELECTION' && (
              <motion.div 
                key="remedies"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="relative w-full h-72 rounded-[2.5rem] overflow-hidden border-4 border-[#D4AF37] shadow-2xl mb-8 group">
                  <img 
                    src="https://images.unsplash.com/photo-1590004953392-5aba2e72269a?q=80&w=800&auto=format&fit=crop" 
                    alt="Traditional Ritual" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#451a03] via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-8">
                    <h3 className="text-white font-black uppercase tracking-[0.3em] text-2xl drop-shadow-lg">{t.remedy_options_title}</h3>
                    <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mt-1">Sacred Tambula Offering</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {tiers.map(tier => (
                    <div
                      key={tier.id}
                      className={`w-full rounded-[2rem] border-2 transition-all overflow-hidden ${
                        selectedTier === tier.id 
                          ? 'border-[#451a03] bg-white shadow-[0_10px_30px_rgba(69,26,3,0.15)]' 
                          : 'border-[#D4AF37]/20 bg-white/50 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <button
                        onClick={() => {
                          setSelectedTier(tier.id);
                          setExpandedTier(expandedTier === tier.id ? null : tier.id);
                        }}
                        className="w-full p-6 flex justify-between items-center group"
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-4 h-4 rounded-full border-2 border-[#451a03] flex items-center justify-center ${selectedTier === tier.id ? 'bg-[#451a03]' : 'bg-transparent'}`}>
                            {selectedTier === tier.id && <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
                          </div>
                          <div className="text-left">
                            <h4 className="font-black text-[#451a03] uppercase tracking-tight text-base">{tier.title}</h4>
                            <p className="text-[10px] font-bold text-[#7C2D12] opacity-70 uppercase tracking-widest">{tier.meaning}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5">
                          <span className="text-xl font-black text-[#451a03]">{tier.price}</span>
                          <div className={`p-2 rounded-full transition-all ${expandedTier === tier.id ? 'bg-[#451a03] text-[#D4AF37]' : 'bg-[#D4AF37]/10 text-[#451a03]'}`}>
                            {expandedTier === tier.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedTier === tier.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-14 pb-8"
                          >
                            <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mb-6" />
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {tier.includes.map((item, i) => (
                                <li key={i} className="text-xs font-bold text-[#451a03]/80 flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_5px_rgba(212,175,55,1)]" />
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

                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={() => setStep('FORM')}
                    className="flex-1 py-5 border-2 border-[#451a03] text-[#451a03] rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-[#451a03] hover:text-[#D4AF37] transition-all"
                  >
                    {t.back}
                  </button>
                  <button 
                    onClick={() => setStep('PAYMENT')}
                    disabled={!selectedTier}
                    className="flex-[2] py-5 bg-gradient-to-r from-[#451a03] to-[#7c2d12] text-[#D4AF37] rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {t.pay_now}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'PAYMENT' && (
              <motion.div 
                key="payment"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-10 py-6"
              >
                <div className="relative mx-auto w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border-8 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.4)] group">
                  <img 
                    src="https://images.unsplash.com/photo-1590004953392-5aba2e72269a?q=80&w=600&auto=format&fit=crop" 
                    alt="Sacred Offering" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#451a03]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 inset-x-0 text-[#D4AF37] font-black uppercase tracking-[0.4em] text-[12px] drop-shadow-md">Sacred Offering</div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-[#451a03] uppercase tracking-tight astrological-font">Complete Your Offering</h3>
                  <p className="text-sm font-medium text-[#451a03]/70 max-w-md mx-auto">Please complete the payment of <span className="font-black text-[#451a03] text-lg">{tiers.find(t => t.id === selectedTier)?.price}</span> to confirm your sacred session.</p>
                  <p className="text-[10px] text-[#451a03]/50 italic">Click the button below to pay via your UPI app. Your appointment will be booked automatically upon payment.</p>
                </div>

                <div className="bg-amber-50 border-4 border-dashed border-[#D4AF37]/40 rounded-[3rem] p-10 space-y-6 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={64} className="text-[#D4AF37]" />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto">
                      <CreditCard className="text-[#D4AF37]" size={48} />
                    </div>

                    <motion.a 
                      href={`upi://pay?pa=prabhatprasadbhat@oksbi&pn=Prabhat%20Prasad%20Bhat&am=${tiers.find(t => t.id === selectedTier)?.amount || 0}&cu=INR&tn=${encodeURIComponent('TambulaOffering')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setIsProcessing(true);
                        // Automatically proceed to success after a short delay to simulate booking
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

                          // Save to localStorage for ProfileSection
                          const existing = JSON.parse(localStorage.getItem('astro_appointments') || '[]');
                          localStorage.setItem('astro_appointments', JSON.stringify([appointment, ...existing]));

                          // Send email in background
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
                      className={`w-full py-6 bg-gradient-to-r from-[#451a03] to-[#7c2d12] text-[#D4AF37] rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all border-2 border-[#D4AF37]/30 flex items-center justify-center gap-3 no-underline ${isProcessing ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:scale-[1.02] active:scale-95'}`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        'Pay via UPI App ➔'
                      )}
                    </motion.a>
                    
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('prabhatprasadbhat@oksbi');
                        alert('UPI ID Copied to Clipboard');
                      }}
                      className="w-full py-3 bg-white border-2 border-[#451a03]/10 text-[#451a03]/60 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#451a03]/5 transition-all"
                    >
                      Copy UPI ID
                    </button>
                  </div>
                  
                  <p className="text-[10px] font-black text-[#451a03] uppercase tracking-[0.2em]">Secure UPI Payment</p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep('REMEDY_SELECTION')}
                    className="w-full py-5 border-2 border-[#451a03] text-[#451a03] rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-[#451a03] hover:text-[#D4AF37] transition-all"
                  >
                    {t.back}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'SUCCESS' && (
              <motion.div 
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-5xl shadow-inner animate-bounce">✓</div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-[#451a03] uppercase tracking-tight">Dhanyavaada!</h3>
                  <p className="text-lg font-bold text-[#451a03]">{t.problem_submitted_msg}</p>
                </div>
                <p className="text-sm font-medium text-[#451a03]/70 px-8">Your appointment is scheduled for <span className="font-black">{selectedDate}</span> at <span className="font-black">{selectedTime}</span>. Our masters are preparing for your session.</p>
                
                <div className="px-8">
                  {emailStatus === 'SENT' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-800 text-xs font-bold">
                      <CheckCircle2 size={16} />
                      Details sent to bhatprasadprabhat@gmail.com
                    </div>
                  )}
                  {emailStatus === 'SIMULATED' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col gap-2 text-amber-800 text-xs font-bold text-left">
                      <div className="flex items-center gap-3">
                        <Sparkles size={16} />
                        Email Simulation Active
                      </div>
                      <p className="font-medium opacity-80">To receive real emails, go to Settings and set EMAIL_USER and EMAIL_PASS environment variables.</p>
                    </div>
                  )}
                  {emailStatus === 'FAILED' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex flex-col gap-2 text-red-800 text-xs font-bold text-left">
                      <div className="flex items-center gap-3">
                        <X size={16} />
                        Email Notification Failed
                      </div>
                      <p className="font-medium opacity-80">{emailError || 'A technical error occurred while sending the email.'}</p>
                      
                      {emailError?.includes('Application-specific password required') && (
                        <div className="mt-2 p-3 bg-white/50 rounded-xl border border-red-200 space-y-2">
                          <p className="text-[10px] text-red-900 uppercase tracking-wider">How to Fix:</p>
                          <ol className="list-decimal list-inside text-[9px] font-medium space-y-1 opacity-80">
                            <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" className="underline">Google App Passwords</a></li>
                            <li>Select "Other", name it "ASTRO LOGIC"</li>
                            <li>Copy the 16-character code</li>
                            <li>Paste it into <b>EMAIL_PASS</b> in AI Studio Settings</li>
                          </ol>
                        </div>
                      )}
                      
                      {!emailError?.includes('Application-specific password required') && (
                        <p className="text-[9px] opacity-60 mt-1 italic">Tip: Check if your Gmail App Password is correct and EMAIL_USER is your full email address.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-6 py-4 border-t border-[#D4AF37]/20">
                  <button 
                    onClick={onDonate}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#92400e] hover:text-[#451a03] transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Heart size={14} className="text-red-500 fill-current" />
                    </div>
                    {t.donate_support}
                  </button>
                  <button 
                    onClick={onFeedback}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#92400e] hover:text-[#451a03] transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <MessageSquare size={14} className="text-blue-500" />
                    </div>
                    {t.feedback}
                  </button>
                </div>

                <button 
                  onClick={reset}
                  className="w-full py-5 bg-[#451a03] text-[#D4AF37] rounded-2xl font-black uppercase tracking-[0.3em] text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
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
