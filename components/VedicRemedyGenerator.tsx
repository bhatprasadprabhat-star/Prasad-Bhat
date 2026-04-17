
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Heart, Zap, Moon, Sun } from 'lucide-react';
import { Language } from '../types';

interface VedicRemedyGeneratorProps {
  lang: Language;
}

const VedicRemedyGenerator: React.FC<VedicRemedyGeneratorProps> = ({ lang }) => {
  const [activeRemedy, setActiveRemedy] = useState<number | null>(null);

  const remedies = [
    { id: 1, title: 'Surya Arghya', icon: <Sun />, desc: 'Offer water to the rising sun to boost confidence, leadership, and health. Best performed within 1 hour of sunrise.', color: 'from-orange-400 to-red-500' },
    { id: 2, title: 'Chandra Shanti', icon: <Moon />, desc: 'Drink water from a silver glass to calm the mind, improve emotional stability, and enhance intuition.', color: 'from-slate-200 to-slate-400' },
    { id: 3, title: 'Hanuman Chalisa', icon: <Shield />, desc: 'Recite daily to overcome fear, gain inner strength, and protect against negative planetary influences.', color: 'from-red-600 to-orange-700' },
    { id: 4, title: 'Mantra Jaap', icon: <Zap />, desc: 'Chant "Om Namah Shivaya" 108 times for spiritual protection and to dissolve karmic blockages.', color: 'from-amber-600 to-yellow-800' },
    { id: 5, title: 'Daan (Charity)', icon: <Heart />, desc: 'Donate black sesame seeds or food on Saturdays to mitigate Saturnian delays and bring stability.', color: 'from-emerald-400 to-teal-600' },
    { id: 6, title: 'Ganesh Atharvashirsha', icon: <Sparkles />, desc: 'Recite to remove obstacles in career and education. Best for Mercury (Budha) related issues.', color: 'from-yellow-400 to-amber-600' },
    { id: 7, title: 'Tulsi Seva', icon: <Heart />, desc: 'Watering and circumambulating the Tulsi plant daily brings peace to the household and strengthens Venus.', color: 'from-green-400 to-emerald-700' },
    { id: 8, title: 'Gayatri Mantra', icon: <Sun />, desc: 'Chanting at dawn, noon, and dusk purifies the intellect and aligns you with the solar energy.', color: 'from-amber-300 to-orange-500' }
  ];

  return (
    <div className="w-full bg-[var(--bg-secondary)]/50 backdrop-blur-xl rounded-lg p-10 border border-[var(--border-primary)] shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
      <div className="absolute top-0 right-0 p-10 opacity-5">
        <Sparkles size={120} className="text-[var(--accent-primary)]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center shadow-lg">
            <Shield className="text-white dark:text-[#020617]" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-ancient font-black gold-leaf uppercase tracking-widest leading-none">Vedic Remedies</h3>
            <p className="text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-[0.3em] mt-1">Ancient Solutions for Modern Problems</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[var(--border-primary)] shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--accent-primary)]/10 border-b border-[var(--border-primary)]">
                <th className="p-4 sm:p-6 text-[10px] sm:text-xs font-ancient font-black uppercase tracking-[0.2em] text-[var(--accent-primary)]">Remedy</th>
                <th className="p-4 sm:p-6 text-[10px] sm:text-xs font-ancient font-black uppercase tracking-[0.2em] text-[var(--accent-primary)] hidden sm:table-cell">Focus</th>
                <th className="p-4 sm:p-6 text-[10px] sm:text-xs font-ancient font-black uppercase tracking-[0.2em] text-[var(--accent-primary)]">Instructions</th>
              </tr>
            </thead>
            <tbody>
              {remedies.map((r, i) => (
                <tr 
                  key={r.id} 
                  className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-primary)]/50 transition-colors group"
                >
                  <td className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${r.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        {React.cloneElement(r.icon as any, { size: 18 })}
                      </div>
                      <span className="text-[10px] sm:text-sm font-ancient font-black uppercase tracking-widest text-[var(--accent-primary)]">{r.title}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-6 hidden sm:table-cell">
                    <span className="text-[10px] font-ancient font-bold text-[var(--accent-primary)]/80 uppercase tracking-widest">
                      {r.id === 1 ? 'Health & Vitality' : 
                       r.id === 2 ? 'Mental Peace' : 
                       r.id === 3 ? 'Protection' : 
                       r.id === 4 ? 'Karma Dissolution' : 
                       r.id === 5 ? 'Saturn Mitigation' : 
                       r.id === 6 ? 'Career/Obstacles' : 
                       r.id === 7 ? 'Domestic Peace' : 'Intellect'}
                    </span>
                  </td>
                  <td className="p-4 sm:p-6">
                    <p className="text-[10px] sm:text-xs font-premium font-bold text-[var(--text-primary)] leading-relaxed italic max-w-md">
                      {r.desc}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VedicRemedyGenerator;
