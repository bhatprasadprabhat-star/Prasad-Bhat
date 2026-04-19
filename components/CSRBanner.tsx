
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Heart, Sparkles, Users, Compass, Target, ShieldCheck } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface CSRBannerProps {
  lang: Language;
}

const CSRBanner: React.FC<CSRBannerProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const activities = [
    {
      title: t.csr_books_title || "Educational Empowerment",
      subtitle: t.csr_special_children_initiative || "SPECIAL CHILDREN INITIATIVE",
      desc: t.csr_books_desc || "ASTRO LOGIC is deeply committed to the holistic development of children with special needs. We provide essential educational kits, specialized learning tools, and infrastructure support to special schools across India. By dedicating nearly 90% of our service revenue, we ensure these brilliant young minds have the resources they need to achieve their full potential.",
      icon: <BookOpen className="text-amber-400" size={28} />,
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
      color: "from-blue-600/40 via-indigo-900/60 to-black/80",
      impact: t.csr_revenue_committed_90 || "50% REVENUE COMMITTED",
      stats: [
        { label: t.csr_schools_supported || "Schools Supported", value: "15+", icon: <Compass size={14} /> },
        { label: t.csr_kits_distributed || "Kits Distributed", value: "800+", icon: <Sparkles size={14} /> },
        { label: t.csr_volunteer_hours || "Volunteer Hours", value: "400+", icon: <Users size={14} /> }
      ]
    },
    {
      title: t.csr_oldage_title || "Dignity in Aging",
      subtitle: "ELDER CARE PROGRAM",
      desc: t.csr_oldage_desc || "Our 'Dignity in Aging' initiative focuses on providing comprehensive support to abandoned and underprivileged elders. We partner with old age homes to provide quality healthcare, nutritious meals, and a supportive community. Almost the entirety of our platform's revenue is channeled into these services, ensuring our elders live with respect and comfort.",
      icon: <Users className="text-rose-400" size={28} />,
      image: "https://images.unsplash.com/photo-1544027960-ca29cb077d7f?auto=format&fit=crop&q=80&w=1200",
      color: "from-emerald-600/40 via-teal-900/60 to-black/80",
      impact: t.csr_holistic_care_100 || "100% HOLISTIC CARE",
      stats: [
        { label: t.csr_homes_adopted || "Homes Adopted", value: "6", icon: <Heart size={14} /> },
        { label: t.csr_elders_assisted || "Elders Assisted", value: "300+", icon: <Users size={14} /> },
        { label: t.csr_medical_camps || "Medical Camps", value: "12/Year", icon: <Sparkles size={14} /> }
      ]
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full mt-16 mb-12 relative overflow-hidden">
      {/* Dynamic Background Aura */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-primary)]/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/30 to-transparent"></div>
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/30 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--accent-primary)] blur-md opacity-20 animate-pulse"></div>
              <div className="relative p-3 bg-gradient-to-br from-[var(--accent-primary)]/20 to-transparent rounded-2xl border border-[var(--accent-primary)]/30 backdrop-blur-sm shadow-[0_0_20px_var(--accent-primary)]/20">
              <Heart className="text-[var(--accent-primary)] animate-[pulse_2s_ease-in-out_infinite]" size={24} />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] sm:text-xs font-mono font-bold text-[var(--accent-primary)] tracking-[0.4em] uppercase opacity-70 mb-1">{t.csr_tagline || "Dharma & Compassion"}</p>
            <h2 className="text-3xl sm:text-5xl font-ancient font-black gold-leaf uppercase tracking-[0.2em] leading-tight">
              {t.csr_title || "Sacred Impact"}
            </h2>
            <div className="h-0.5 w-full bg-gradient-to-r from-[var(--accent-primary)]/40 via-[var(--accent-primary)] to-transparent mt-2 rounded-full" />
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 border-l border-[var(--accent-primary)]/20 pl-10">
          <div className="text-center group/metric">
            <p className="text-2xl font-ancient font-black gold-leaf group-hover:scale-110 transition-transform">50%+</p>
            <p className="text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-widest font-bold">{t.csr_revenue_committed || "Revenue Committed"}</p>
          </div>
          <div className="text-center group/metric">
            <p className="text-2xl font-ancient font-black gold-leaf group-hover:scale-110 transition-transform">5K+</p>
            <p className="text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-widest font-bold">{t.csr_souls_nourished || "Souls Nourished"}</p>
          </div>
        </div>
        </div>

        <div className="relative min-h-[600px] sm:min-h-[500px] w-full rounded-[2rem] overflow-hidden border border-[var(--accent-primary)]/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 inline-block"
            >
              {/* Artistic Overlay Layers */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={activities[currentIndex].image} 
                  alt={activities[currentIndex].title}
                  className="w-full h-full object-cover brightness-[0.7] group-hover:scale-110 transition-transform duration-[6000ms] ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[3000ms] pointer-events-none" />
                <div className={`absolute inset-0 bg-gradient-to-tr ${activities[currentIndex].color} mix-blend-multiply opacity-50`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>

              {/* Sophisticated Content Layout */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-12 lg:p-20">
                <div className="grid lg:grid-cols-2 gap-8 items-end">
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                    >
                      <Sparkles size={14} className="text-amber-300" />
                      <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">{activities[currentIndex].subtitle}</span>
                    </motion.div>

                    <div className="space-y-1">
                      <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-4xl sm:text-6xl lg:text-7xl font-ancient font-black text-white leading-[0.9] tracking-tight lowercase first-letter:uppercase"
                      >
                        {activities[currentIndex].title}
                      </motion.h3>
                    </div>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-sm sm:text-lg text-white/70 font-premium font-medium leading-relaxed max-w-xl italic"
                    >
                      {activities[currentIndex].desc}
                    </motion.p>

                    {/* New Stats Board */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
                      {activities[currentIndex].stats.map((stat, sIdx) => (
                        <motion.div
                          key={sIdx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + sIdx * 0.1 }}
                          className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex flex-col items-start gap-1 group/stat hover:bg-white/20 transition-all cursor-default"
                        >
                          <div className="text-[var(--accent-primary)] group-hover/stat:scale-110 transition-transform">{stat.icon}</div>
                          <p className="text-lg sm:text-2xl font-ancient font-black text-white leading-none">{stat.value}</p>
                          <p className="text-[8px] sm:text-[10px] font-mono text-white/50 uppercase tracking-tighter">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-6 h-full justify-end">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="p-6 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-transparent backdrop-blur-2xl border border-[var(--accent-primary)]/30 shadow-2xl flex items-center gap-6 group/impact"
                    >
                      <div className="p-4 bg-[var(--accent-primary)]/30 rounded-2xl group-hover/impact:rotate-12 transition-transform">
                        {activities[currentIndex].icon}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <ShieldCheck size={12} className="text-[var(--accent-primary)]" />
                          <p className="text-[10px] font-mono font-black text-[var(--accent-primary)] uppercase tracking-tighter">{t.csr_verified_integrity || "Verified Integrity"}</p>
                        </div>
                        <p className="text-lg sm:text-xl font-ancient font-black text-white uppercase tracking-wider">{activities[currentIndex].impact}</p>
                      </div>
                    </motion.div>
                    
                    <div className="flex gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                       {activities.map((_, idx) => (
                         <button
                           key={idx}
                           onClick={() => setCurrentIndex(idx)}
                           className={`h-1.5 rounded-full transition-all duration-500 ${
                             idx === currentIndex ? 'w-12 bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]' : 'w-4 bg-white/30 hover:bg-white/50'
                           }`}
                         />
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Side Progress Rail */}
          <div className="absolute right-0 top-0 bottom-0 w-1 flex flex-col pointer-events-none">
            <motion.div 
              key={`rail-${currentIndex}`}
              initial={{ height: "0%" }}
              animate={{ height: "100%" }}
              transition={{ duration: 8, ease: "linear" }}
              className="bg-[var(--accent-primary)] shadow-[0_0_15px_var(--accent-primary)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSRBanner;
