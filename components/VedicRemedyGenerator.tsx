
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, Heart, Zap, Moon, Sun } from 'lucide-react';
import { Language } from '../types';

interface VedicRemedyGeneratorProps {
  lang: Language;
}

const VedicRemedyGenerator: React.FC<VedicRemedyGeneratorProps> = ({ lang }) => {
  const [activeRemedy, setActiveRemedy] = useState<number | null>(null);

  const remedies = [
    { id: 1, title: 'Surya Arghya', icon: <Sun />, desc: 'Offer water to the rising sun to boost confidence and health.', color: 'from-orange-400 to-red-500' },
    { id: 2, title: 'Chandra Shanti', icon: <Moon />, desc: 'Drink water from a silver glass to calm the mind and emotions.', color: 'from-blue-200 to-indigo-300' },
    { id: 3, title: 'Hanuman Chalisa', icon: <Shield />, desc: 'Recite daily to overcome fear and gain inner strength.', color: 'from-red-600 to-orange-700' },
    { id: 4, title: 'Mantra Jaap', icon: <Zap />, desc: 'Chant "Om Namah Shivaya" 108 times for spiritual protection.', color: 'from-purple-500 to-indigo-600' },
    { id: 5, title: 'Daan (Charity)', icon: <Heart />, desc: 'Donate food on Saturdays to mitigate Saturnian delays.', color: 'from-emerald-400 to-teal-600' }
  ];

  return (
    <div className="w-full bg-white/10 backdrop-blur-xl rounded-[3rem] p-10 border-4 border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-5">
        <Sparkles size={120} className="text-[#D4AF37]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="text-[#451a03]" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#D4AF37] uppercase tracking-widest astrological-font leading-none">Vedic Remedies</h3>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em] mt-1">Ancient Solutions for Modern Problems</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {remedies.map((r, i) => (
            <motion.button
              key={r.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveRemedy(activeRemedy === r.id ? null : r.id)}
              className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${
                activeRemedy === r.id ? 'bg-white border-[#D4AF37] shadow-2xl' : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${r.color} text-white shadow-lg group-hover:rotate-12 transition-transform`}>
                {r.icon}
              </div>
              <h4 className={`text-sm font-black uppercase tracking-widest mb-2 ${activeRemedy === r.id ? 'text-[#451a03]' : 'text-white'}`}>{r.title}</h4>
              
              <AnimatePresence>
                {activeRemedy === r.id && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="text-[11px] font-medium text-[#451a03]/70 leading-relaxed italic"
                  >
                    {r.desc}
                  </motion.p>
                )}
              </AnimatePresence>
              
              {!activeRemedy && (
                <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Sparkles size={16} className="text-[#D4AF37]" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VedicRemedyGenerator;
