
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Heart, Sparkles, Users } from 'lucide-react';
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
      title: t.csr_books_title || "Educational Empowerment for Special Children",
      desc: t.csr_books_desc || "ASTRO LOGIC is deeply committed to the holistic development of children with special needs. We provide essential educational kits, specialized learning tools, and infrastructure support to special schools across India. By dedicating nearly 90% of our service revenue, we ensure these brilliant young minds have the resources they need to overcome challenges and achieve their full potential.",
      icon: <BookOpen className="text-amber-400" size={32} />,
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1000",
      color: "from-blue-900/70 to-indigo-900/70"
    },
    {
      title: t.csr_oldage_title || "Dignity in Aging: Holistic Old Age Home Care",
      desc: t.csr_oldage_desc || "Our 'Dignity in Aging' initiative focuses on providing comprehensive support to abandoned and underprivileged elders. We partner with old age homes to provide quality healthcare, nutritious meals, and a supportive community. Almost the entirety of our platform's revenue is channeled into these services, ensuring our elders live their golden years with the respect, comfort, and care they truly deserve.",
      icon: <Users className="text-rose-400" size={32} />,
      image: "https://images.unsplash.com/photo-1532329686034-8e83f215e091?auto=format&fit=crop&q=80&w=1000",
      color: "from-emerald-900/70 to-teal-900/70"
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full mt-12 mb-8 relative p-4 sm:p-8 rounded-lg overflow-hidden">
      {/* Section Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover"
          alt="Background"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6 px-4">
          <div className="p-2 bg-[var(--accent-primary)]/10 rounded-lg border border-[var(--accent-primary)]/20">
            <Heart className="text-[var(--accent-primary)] animate-pulse" size={20} />
          </div>
          <h2 className="text-xl sm:text-2xl font-ancient font-black gold-leaf uppercase tracking-widest">
            {t.csr_title || "ASTRO LOGIC Social Impact"}
          </h2>
        </div>

        <div className="relative h-[400px] sm:h-[500px] w-full rounded-lg overflow-hidden border border-[var(--border-primary)] shadow-2xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img 
                  src={activities[currentIndex].image} 
                  alt={activities[currentIndex].title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80`} />
                <div className={`absolute inset-0 bg-gradient-to-r ${activities[currentIndex].color} opacity-40 backdrop-blur-[1px]`} />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8 sm:p-16 space-y-4">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4"
                >
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-xl">
                    {activities[currentIndex].icon}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent" />
                </motion.div>

                <div className="space-y-2 max-w-3xl">
                  <motion.h3 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-4xl font-ancient font-black text-white uppercase tracking-tight leading-tight"
                  >
                    {activities[currentIndex].title}
                  </motion.h3>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm sm:text-lg text-white/80 font-premium font-bold italic leading-relaxed"
                  >
                    {activities[currentIndex].desc}
                  </motion.p>
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 text-[var(--accent-primary)] text-[10px] font-ancient font-bold uppercase tracking-[0.3em] pt-2"
                >
                  <Sparkles size={12} />
                  <span>Spreading Light & Compassion</span>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {activities.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  idx === currentIndex ? 'w-12 bg-[var(--accent-primary)]' : 'w-3 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
    </div>
  </div>
);
};

export default CSRBanner;
