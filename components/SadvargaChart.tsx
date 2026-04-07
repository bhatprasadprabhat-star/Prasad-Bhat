
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SouthIndianChart from './SouthIndianChart';
import { Language, PlanetPosition } from '../types';
import { TRANSLATIONS, RASIS } from '../constants';

interface SadvargaChartProps {
  vargas: Record<string, PlanetPosition[]>;
  lords?: Record<string, { planet: string; power: string }>;
  lang: Language;
}

const SadvargaChart: React.FC<SadvargaChartProps> = ({ vargas, lords, lang }) => {
  const [activeVarga, setActiveVarga] = useState<string>('D1');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const vargaLabels: Record<string, string> = {
    'D3': lang === 'kn' ? 'ದ್ರೇಕ್ಕಾಣ' : 'Drekkana',
    'D2': lang === 'kn' ? 'ಹೋರಾ' : 'Hora',
    'D9': lang === 'kn' ? 'ನವಾಂಶ' : 'Navamsha',
    'D30': lang === 'kn' ? 'ತ್ರಿಂಶಾಂಶ' : 'Trimshamsha',
    'D12': lang === 'kn' ? 'ದ್ವಾದಶಾಂಶ' : 'Dvadashamsha',
    'D1': lang === 'kn' ? 'ಕ್ಷೇತ್ರ' : 'Kshetra'
  };

  const vargaOrder = ['D3', 'D2', 'D9', 'D30', 'D12', 'D1'];

  const NAVAGRAHA_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu', 'Lagna', 'Mandi'];

  const rasiLords: Record<number, string> = {
    0: 'Mars', 1: 'Venus', 2: 'Mercury', 3: 'Moon', 4: 'Sun', 
    5: 'Mercury', 6: 'Venus', 7: 'Mars', 8: 'Jupiter', 9: 'Saturn', 
    10: 'Saturn', 11: 'Jupiter'
  };

  const getPlanetAbbreviation = (planetName: string) => {
    if (!planetName) return '-';
    if (lang === 'kn') {
      const mapping: Record<string, string> = {
        'Sun': 'ರ', 'Moon': 'ಚ', 'Mars': 'ಕು', 'Mercury': 'ಬು', 
        'Jupiter': 'ಗು', 'Venus': 'ಶು', 'Saturn': 'ಶ', 'Rahu': 'ರಾ', 
        'Ketu': 'ಕೇ', 'Lagna': 'ಲ', 'Mandi': 'ಮಾ'
      };
      return mapping[planetName] || planetName[0] || '-';
    }
    const mapping: Record<string, string> = {
      'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me', 
      'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 
      'Ketu': 'Ke', 'Lagna': 'La', 'Mandi': 'Mn'
    };
    return mapping[planetName] || planetName.substring(0, 2) || '-';
  };

  if (!vargas || Object.keys(vargas).length === 0) {
    return (
      <div className="p-8 text-center bg-white/10 rounded-3xl border-2 border-[#D4AF37]/30 shadow-xl">
        <p className="text-[#D4AF37] font-bold opacity-50">Calculating Sadvarga charts...</p>
      </div>
    );
  }

  const planets = [...(vargas['D1']?.map(p => p.name) || [])].sort((a, b) => {
    const idxA = NAVAGRAHA_ORDER.indexOf(a);
    const idxB = NAVAGRAHA_ORDER.indexOf(b);
    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div className="w-full space-y-12">
      {/* Shadvarga Parchment Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[1rem] border-[6px] border-[#451a03] shadow-[0_20px_50px_rgba(0,0,0,0.3)] mx-2 sm:mx-4"
        style={{
          background: 'radial-gradient(circle, #fdf2d0 0%, #f3e5ab 100%)',
          boxShadow: 'inset 0 0 100px rgba(69, 26, 3, 0.1), 0 20px 50px rgba(0,0,0,0.3)'
        }}
      >
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/papyros.png")' }}></div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-center border-collapse min-w-[600px] astrological-font">
            <thead>
              <tr className="border-b-4 border-[#451a03]">
                <th className="p-6 font-black text-[#451a03] uppercase tracking-widest text-2xl text-left bg-[#451a03]/5">
                  {lang === 'kn' ? 'ಗ್ರಹ' : 'Graha'}
                </th>
                {vargaOrder.map(v => (
                  <th key={v} className="p-6 font-black text-[#451a03] uppercase tracking-widest text-xl bg-[#451a03]/5">
                    {vargaLabels[v]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planets.map((planetName, i) => (
                <tr key={i} className="border-b border-[#451a03]/10 hover:bg-[#451a03]/5 transition-colors">
                  <td className="p-5 font-black text-[#8b0000] text-2xl text-left pl-8 border-r-2 border-[#451a03]/10">
                    {lang === 'kn' ? getPlanetAbbreviation(planetName) : (planetName ? (t[`planet_${planetName.toLowerCase()}`] || planetName) : '-')}
                  </td>
                  {vargaOrder.map(v => {
                    const planetInVarga = vargas[v]?.find(p => p.name === planetName);
                    const rasiIndex = planetInVarga?.rasi;
                    const lordName = rasiIndex !== undefined ? rasiLords[rasiIndex] : '-';
                    const lordDisplayName = lordName !== '-' ? (lang === 'kn' ? (t[`planet_${lordName.toLowerCase()}`] || lordName) : lordName) : '-';
                    const lordAbbr = lordName !== '-' ? getPlanetAbbreviation(lordName) : '-';
                    
                    return (
                      <td key={v} className="p-5 border-r border-[#451a03]/5 last:border-r-0">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-2xl font-black text-[#000080] drop-shadow-sm">
                            {lordAbbr}
                          </span>
                          <span className="text-[10px] font-bold text-[#451a03]/60 uppercase tracking-tighter">
                            {lordDisplayName}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="flex items-center gap-4 px-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#451a03]/30 to-transparent"></div>
        <span className="text-[#451a03]/40 text-[10px] font-black uppercase tracking-[0.5em]">Varga Visuals</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#451a03]/30 to-transparent"></div>
      </div>

      {/* Grid of Charts (Secondary View) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2 sm:px-4">
        {[...vargaOrder].reverse().map((v) => (
          <motion.div 
            key={v}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#f3e5ab]/30 rounded-[2rem] p-6 border-2 border-[#451a03]/10 shadow-xl flex flex-col items-center backdrop-blur-sm"
          >
            <h4 className="text-xs font-black text-[#451a03] uppercase tracking-[0.3em] mb-4 border-b-2 border-[#451a03]/20 pb-1">
              {vargaLabels[v] || v}
            </h4>
            <div className="w-full scale-90 origin-top">
              <SouthIndianChart data={vargas[v]} lang={lang} title={vargaLabels[v]} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SadvargaChart;
