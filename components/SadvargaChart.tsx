
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SouthIndianChart from './SouthIndianChart';
import { Language, PlanetPosition } from '../types';
import { TRANSLATIONS } from '../constants';

interface SadvargaChartProps {
  vargas: Record<string, PlanetPosition[]>;
  lords?: Record<string, { planet: string; power: string }>;
  lang: Language;
}

const SadvargaChart: React.FC<SadvargaChartProps> = ({ vargas, lords, lang }) => {
  const [activeVarga, setActiveVarga] = useState<string>('D1');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const vargaLabels: Record<string, string> = {
    'D1': 'Rasi (D1)',
    'D2': 'Hora (D2)',
    'D3': 'Drekkana (D3)',
    'D9': 'Navamsha (D9)',
    'D12': 'Dwadashamsha (D12)',
    'D30': 'Trimshamsha (D30)'
  };

  if (!vargas || Object.keys(vargas).length === 0) {
    return (
      <div className="p-8 text-center bg-white/10 rounded-3xl border-2 border-[#D4AF37]/30 shadow-xl">
        <p className="text-[#D4AF37] font-bold opacity-50">Calculating Sadvarga charts...</p>
      </div>
    );
  }

  const activeLord = lords ? lords[activeVarga] : null;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap justify-center gap-2">
        {Object.keys(vargas).map((v) => (
          <button
            key={v}
            onClick={() => setActiveVarga(v)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              activeVarga === v
                ? 'bg-[#D4AF37] text-[#451a03] shadow-lg scale-105'
                : 'bg-white/10 text-[#D4AF37] hover:bg-white/20'
            }`}
          >
            {vargaLabels[v] || v}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeVarga}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <h3 className="text-lg font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-4 astrological-font">
            {vargaLabels[activeVarga]}
          </h3>
          
          <SouthIndianChart data={vargas[activeVarga]} lang={lang} title={vargaLabels[activeVarga]} />

          {activeLord && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gradient-to-r from-[#451a03] to-[#2d0a01] rounded-2xl border border-[#D4AF37]/30 shadow-xl w-full max-w-md text-center"
            >
              <div className="text-[10px] font-black text-[#D4AF37]/60 uppercase tracking-widest mb-1">Adhipati (Lord)</div>
              <div className="text-xl font-black text-white uppercase tracking-widest mb-2">{activeLord.planet}</div>
              <div className="h-px w-12 bg-[#D4AF37]/30 mx-auto mb-2"></div>
              <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">{activeLord.power}</div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SadvargaChart;
