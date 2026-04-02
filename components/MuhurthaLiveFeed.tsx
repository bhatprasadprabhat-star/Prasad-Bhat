
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
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
    <div className="w-full bg-gradient-to-br from-[#451a03] to-[#7c2d12] rounded-[2.5rem] p-8 border-4 border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <Sparkles size={64} className="text-[#D4AF37]" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-[#D4AF37]" size={24} />
          <h3 className="text-xl font-black text-[#D4AF37] uppercase tracking-widest astrological-font">Live Muhurtha Feed</h3>
        </div>

        <div className="space-y-4">
          {liveMuhurthas.map((m, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/5 hover:bg-white/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  m.type === 'GOOD' || m.type === 'EXCELLENT' ? 'bg-green-500/20 text-green-400' : 
                  m.type === 'BAD' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {m.type === 'GOOD' || m.type === 'EXCELLENT' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">{m.name}</h4>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{m.time}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  m.type === 'GOOD' || m.type === 'EXCELLENT' ? 'bg-green-500 text-white' : 
                  m.type === 'BAD' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
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
