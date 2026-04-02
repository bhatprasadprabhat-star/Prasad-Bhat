
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AshtakavargaProps {
  data: {
    planet: string;
    points: number[];
  }[];
}

export const AshtakavargaTable: React.FC<AshtakavargaProps> = ({ data }) => {
  const rasis = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-8 text-center bg-white/80 rounded-3xl border-2 border-[#FFD700]/30 shadow-xl mx-4">
        <p className="text-[#FFD700] font-bold opacity-50">Calculating Ashtakavarga points...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto my-8 bg-white/80 rounded-3xl border-2 border-[#FFD700]/30 shadow-xl mx-2 sm:mx-4">
      <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-[800px]">
        <thead>
          <tr className="bg-[#FFD700] text-[#451a03]">
            <th className="p-4 font-black uppercase tracking-widest text-xs sticky left-0 bg-[#FFD700]">Planet</th>
            {rasis.map(r => (
              <th key={r} className="p-4 font-black uppercase tracking-widest text-[10px] text-center">{r.slice(0, 3)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors">
              <td className="p-4 font-bold text-[#FFD700] text-sm sticky left-0 bg-white/90 backdrop-blur-sm shadow-r">{row.planet}</td>
              {row.points.map((p, j) => (
                <td key={j} className="p-4 text-center font-mono font-bold text-[#b45309]">{p}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface DashaProps {
  dashas: {
    planet: string;
    start: string;
    end: string;
    antardashas?: {
      planet: string;
      start: string;
      end: string;
    }[];
  }[];
}

export const VimshottariTable: React.FC<DashaProps> = ({ dashas }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!dashas || !Array.isArray(dashas) || dashas.length === 0) {
    return (
      <div className="p-8 text-center bg-white/80 rounded-3xl border-2 border-[#FFD700]/30 shadow-xl mx-4">
        <p className="text-[#FFD700] font-bold opacity-50">Calculating Dasha timeline...</p>
      </div>
    );
  }

  return (
    <div className="my-8 space-y-8 px-2 sm:px-4">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {/* We show all 9 Mahadashas + 3 placeholders to make it 12 as requested */}
        {Array.from({ length: 12 }).map((_, i) => {
          const dasha = dashas[i];
          if (!dasha) {
            return (
              <div key={`placeholder-${i}`} className="flex p-5 rounded-[2rem] border-4 border-dashed border-[#FFD700]/5 bg-[#FFD700]/[0.02] items-center justify-center opacity-20 min-h-[140px]">
                <span className="text-2xl">✨</span>
              </div>
            );
          }
          return (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className={`cursor-pointer p-5 rounded-[2rem] border-4 transition-all duration-500 relative overflow-hidden group flex flex-col items-center justify-center text-center min-h-[140px] ${
                expandedIndex === i 
                  ? 'bg-[#FFD700] border-[#451a03] shadow-[0_15px_30px_rgba(255,215,0,0.4)] scale-105 z-20' 
                  : 'bg-white border-[#FFD700]/10 hover:border-[#FFD700] hover:shadow-xl'
              }`}
            >
              {/* Background Icon/Pattern */}
              <div className={`absolute inset-0 flex items-center justify-center text-6xl opacity-[0.03] transition-transform group-hover:scale-125 ${expandedIndex === i ? 'text-white' : 'text-[#FFD700]'}`}>
                ☸️
              </div>

              <div className="relative z-10 space-y-2">
                <h4 className={`text-[9px] font-black uppercase tracking-[0.2em] ${expandedIndex === i ? 'text-[#451a03]' : 'text-[#FFD700]/40'}`}>
                  Mahadasha
                </h4>
                <div className={`text-2xl font-black astrological-font tracking-tighter ${expandedIndex === i ? 'text-white' : 'text-[#451a03]'}`}>
                  {dasha.planet}
                </div>
                <div className={`text-[10px] font-black font-mono px-2 py-1 rounded-full ${expandedIndex === i ? 'bg-[#451a03]/20 text-[#451a03]' : 'bg-[#FFD700]/5 text-[#b45309]'}`}>
                  {dasha.start.split('-')[0]} — {dasha.end.split('-')[0]}
                </div>
              </div>

              {expandedIndex === i && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#451a03] shadow-[0_0_10px_#451a03]"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {expandedIndex !== null && dashas[expandedIndex] && (
          <motion.div
            key={expandedIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-[#fffbeb] rounded-[2.5rem] border-4 border-[#FFD700] shadow-2xl overflow-hidden"
          >
            <div className="bg-[#FFD700] p-6 flex items-center justify-between border-b border-[#FFD700]/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#451a03] flex items-center justify-center text-[#FFD700] text-2xl font-black">
                  {dashas[expandedIndex].planet.charAt(0)}
                </div>
                <div>
                  <h3 className="text-[#451a03] font-black uppercase tracking-widest text-lg">
                    {dashas[expandedIndex].planet} Antardasha
                  </h3>
                  <p className="text-[#451a03]/40 text-[10px] font-black uppercase tracking-widest">Sub-period Breakdown</p>
                </div>
              </div>
              <button 
                onClick={() => setExpandedIndex(null)}
                className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-[#451a03] hover:bg-black/20 transition-all"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 sm:p-10 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b-2 border-[#FFD700]/10">
                    <th className="p-4 text-[11px] font-black uppercase tracking-widest text-[#FFD700]/60">Antardasha Planet</th>
                    <th className="p-4 text-[11px] font-black uppercase tracking-widest text-[#FFD700]/60">Start Date</th>
                    <th className="p-4 text-[11px] font-black uppercase tracking-widest text-[#FFD700]/60">End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashas[expandedIndex].antardashas?.map((ad, j) => (
                    <tr key={j} className="border-b border-[#FFD700]/5 hover:bg-[#FFD700]/5 transition-colors group">
                      <td className="p-4 text-sm font-black text-[#FFD700] flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {ad.planet}
                      </td>
                      <td className="p-4 text-xs font-mono font-bold text-[#b45309]">{ad.start}</td>
                      <td className="p-4 text-xs font-mono font-bold text-[#b45309]">{ad.end}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface BirthDetailsProps {
  details: {
    label: string;
    value: string;
    category?: string;
  }[];
}

export const BirthDetailsTable: React.FC<BirthDetailsProps> = ({ details }) => {
  if (!details || !Array.isArray(details) || details.length === 0) {
    return null;
  }

  // Group details by category if available
  const categories = Array.from(new Set(details.map(d => d.category || 'General')));

  return (
    <div className="my-8 space-y-8 px-2 sm:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => (
          <div key={cat} className="bg-white/95 rounded-[2rem] border-2 border-[#FFD700]/30 shadow-xl overflow-hidden">
            <div className="bg-[#FFD700]/10 p-4 border-b border-[#FFD700]/20">
              <h4 className="text-[#451a03] font-black uppercase tracking-widest text-xs text-center">{cat}</h4>
            </div>
            <div className="p-4 space-y-3">
              {details.filter(d => (d.category || 'General') === cat).map((d, i) => (
                <div key={i} className="flex justify-between items-center gap-4 border-b border-slate-50 pb-2 last:border-0">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.label}</span>
                  <span className="text-sm font-bold text-[#451a03] text-right">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BhavaPhalaProps {
  houses: {
    number: number;
    title: string;
    description: string;
    shloka?: string;
    strength?: string;
  }[];
}

export const BhavaPhala: React.FC<BhavaPhalaProps> = ({ houses }) => {
  const [activeHouse, setActiveHouse] = useState<number>(1);

  if (!houses || !Array.isArray(houses) || houses.length === 0) {
    return (
      <div className="p-8 text-center bg-white/80 rounded-3xl border-2 border-[#FFD700]/30 shadow-xl mx-4">
        <p className="text-[#FFD700] font-bold opacity-50">Analyzing 12 Bhavas...</p>
      </div>
    );
  }

  const currentHouse = houses.find(h => h.number === activeHouse) || houses[0];

  return (
    <div className="my-8 space-y-6 px-2 sm:px-4">
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
        {houses.map((h) => (
          <button
            key={h.number}
            onClick={() => setActiveHouse(h.number)}
            className={`h-12 rounded-xl font-black transition-all flex items-center justify-center border-2 ${
              activeHouse === h.number
                ? 'bg-[#FFD700] border-[#451a03] text-[#451a03] shadow-lg scale-110 z-10'
                : 'bg-white border-[#FFD700]/20 text-[#FFD700] hover:border-[#FFD700]'
            }`}
          >
            {h.number}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeHouse}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/95 rounded-[2.5rem] border-4 border-[#FFD700] shadow-2xl overflow-hidden min-h-[400px]"
        >
          <div className="bg-[#FFD700] p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#451a03] flex items-center justify-center text-[#FFD700] text-2xl font-black shadow-inner">
              {activeHouse}
            </div>
            <div>
              <h3 className="text-[#451a03] font-black uppercase tracking-widest text-xl">
                {currentHouse.title}
              </h3>
              <p className="text-[#451a03]/60 text-[10px] font-black uppercase tracking-widest">Bhava Analysis</p>
            </div>
          </div>

          <div className="p-8 sm:p-12 space-y-8">
            {currentHouse.shloka && (
              <div className="p-6 bg-[#fffbeb] rounded-3xl border-2 border-[#FFD700]/30 italic text-[#451a03] font-serif text-lg text-center leading-relaxed shadow-inner">
                "{currentHouse.shloka}"
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[#FFD700] font-black uppercase tracking-widest text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFD700]"></span>
                  Significance & Strength
                </h4>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-[#451a03] font-bold text-sm leading-relaxed">
                  {currentHouse.strength || "Detailed strength analysis based on Lord, Aspects and Occupants."}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[#FFD700] font-black uppercase tracking-widest text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFD700]"></span>
                  Detailed Phala
                </h4>
                <div className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: currentHouse.description }} />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

interface GrahaMaitriProps {
  matrix: {
    planet: string;
    relationships: { [key: string]: string };
  }[];
}

export const GrahaMaitriTable: React.FC<GrahaMaitriProps> = ({ matrix }) => {
  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  
  if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
    return (
      <div className="p-8 text-center bg-white/80 rounded-3xl border-2 border-[#FFD700]/30 shadow-xl mx-4">
        <p className="text-[#FFD700] font-bold opacity-50">Calculating Panchadha Graha Maitri...</p>
      </div>
    );
  }

  const getRelationshipColor = (rel: string) => {
    switch (rel) {
      case 'Adhi Mitra': return 'text-emerald-600 bg-emerald-50';
      case 'Mitra': return 'text-green-600 bg-green-50';
      case 'Sama': return 'text-slate-600 bg-slate-50';
      case 'Shatru': return 'text-orange-600 bg-orange-50';
      case 'Adhi Shatru': return 'text-red-600 bg-red-50';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="overflow-x-auto my-8 bg-white/80 rounded-3xl border-2 border-[#FFD700]/30 shadow-xl mx-2 sm:mx-4">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="bg-[#FFD700] text-[#451a03]">
            <th className="p-4 font-black uppercase tracking-widest text-xs sticky left-0 bg-[#FFD700]">Planet</th>
            {planets.map(p => (
              <th key={p} className="p-4 font-black uppercase tracking-widest text-[10px] text-center">{p}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i} className="border-b border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors">
              <td className="p-4 font-bold text-[#FFD700] text-sm sticky left-0 bg-white/90 backdrop-blur-sm shadow-r">{row.planet}</td>
              {planets.map((p, j) => {
                const rel = row.relationships[p] || '-';
                return (
                  <td key={j} className="p-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter ${getRelationshipColor(rel)}`}>
                      {rel}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
