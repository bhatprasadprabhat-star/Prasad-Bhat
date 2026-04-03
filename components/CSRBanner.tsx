
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      desc: t.csr_books_desc || "AstroLogic is deeply committed to the holistic development of children with special needs. We provide essential educational kits, specialized learning tools, and infrastructure support to special schools across India. By dedicating nearly 90% of our service revenue, we ensure these brilliant young minds have the resources they need to overcome challenges and achieve their full potential.",
      icon: <BookOpen className="text-amber-400" size={32} />,
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1000",
      color: "from-blue-900/70 to-indigo-900/70"
    },
    {
      title: t.csr_oldage_title || "Dignity in Aging: Holistic Old Age Home Care",
      desc: t.csr_oldage_desc || "Our 'Dignity in Aging' initiative focuses on providing comprehensive support to abandoned and underprivileged elders. We partner with old age homes to provide quality healthcare, nutritious meals, and a supportive community. Almost the entirety of our platform's revenue is channeled into these services, ensuring our elders live their golden years with the respect, comfort, and care they truly deserve.",
      icon: <Users className="text-rose-400" size={32} />,
      image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=1000",
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
    <div className="w-full mt-12 mb-8">
      <div className="flex items-center gap-3 mb-6 px-4">
        <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <Heart className="text-amber-500 animate-pulse" size={20} />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-amber-500 uppercase tracking-widest astrological-font">
          {t.csr_title || "AstroLogic Social Impact"}
        </h2>
      </div>

      <div className="relative h-[350px] sm:h-[450px] w-full rounded-[2.5rem] overflow-hidden border-2 border-amber-500/20 shadow-2xl group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
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
              <div className={`absolute inset-0 bg-gradient-to-r ${activities[currentIndex].color} backdrop-blur-[2px]`} />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-8 sm:px-16 space-y-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                  {activities[currentIndex].icon}
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent" />
              </motion.div>

              <div className="space-y-2 max-w-2xl">
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none"
                >
                  {activities[currentIndex].title}
                </motion.h3>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm sm:text-lg text-white/80 font-medium italic leading-relaxed"
                >
                  {activities[currentIndex].desc}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2 text-amber-400 text-[10px] font-bold uppercase tracking-[0.3em]"
              >
                <Sparkles size={12} />
                <span>Spreading Light & Compassion</span>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {activities.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-amber-500' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CSRBanner;
