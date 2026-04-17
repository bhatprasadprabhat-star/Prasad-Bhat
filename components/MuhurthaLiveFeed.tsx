
import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface MuhurthaLiveFeedProps {
  lang: Language;
}

const MuhurthaLiveFeed: React.FC<MuhurthaLiveFeedProps> = ({ lang }) => {
  // Mock data for live auspicious times
  const liveMuhurthas = useMemo(() => [
    { name: 'Abhijit Muhurtha', time: '11:58 AM - 12:46 PM', status: 'Auspicious', type: 'GOOD' },
    { name: 'Rahu Kaala', time: '10:30 AM - 12:00 PM', status: 'Inauspicious', type: 'BAD' },
    { name: 'Gulika Kaala', time: '07:30 AM - 09:00 AM', status: 'Neutral', type: 'NEUTRAL' },
    { name: 'Brahma Muhurtha', time: '04:30 AM - 05:18 AM', status: 'Highly Auspicious', type: 'EXCELLENT' }
  ], []);

  return (
    <div className="w-full bg-[var(--bg-secondary)]/50 backdrop-blur-xl rounded-lg p-8 border border-[var(--border-primary)] shadow-2xl relative overflow-hidden group h-full">
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles size={64} className="text-[var(--accent-primary)]" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-[var(--accent-primary)]" size={24} />
          <h3 className="text-xl font-ancient font-black gold-leaf uppercase tracking-widest leading-none">Live Muhurtha Feed</h3>
        </div>

        <div className="space-y-4">
          {liveMuhurthas.map((m, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 bg-[var(--bg-primary)]/50 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--accent-primary)]/5 hover:border-[var(--accent-primary)]/30 transition-all group/item"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${
                  m.type === 'GOOD' || m.type === 'EXCELLENT' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                  m.type === 'BAD' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {m.type === 'GOOD' || m.type === 'EXCELLENT' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <h4 className="text-sm font-ancient font-black text-[var(--accent-primary)] uppercase tracking-wider group-hover/item:gold-leaf transition-colors">{m.name}</h4>
                  <p className="text-[10px] font-premium font-bold text-[var(--accent-primary)] uppercase tracking-widest">{m.time}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[9px] font-ancient font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-lg ${
                  m.type === 'GOOD' || m.type === 'EXCELLENT' ? 'bg-green-600 text-white' : 
                  m.type === 'BAD' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {m.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MuhurthaLiveFeed;
