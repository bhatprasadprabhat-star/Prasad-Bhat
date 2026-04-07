
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
          <tr className="bg-[#FFD700] text-[#312e81]">
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
    duration?: number;
    antardashas?: {
      planet: string;
      start: string;
      end: string;
    }[];
  }[];
}

export const VimshottariTable: React.FC<DashaProps> = ({ dashas }) => {
  const [selectedDashaIndex, setSelectedDashaIndex] = useState<number | null>(null);

  if (!dashas || !Array.isArray(dashas) || dashas.length === 0) {
    return (
      <div className="p-8 text-center bg-white/80 rounded-3xl border-2 border-[#FFD700]/30 shadow-xl mx-4">
        <p className="text-[#FFD700] font-bold opacity-50">Calculating Vimshottari Dasha periods...</p>
      </div>
    );
  }

  // Ensure we only show 9 dashas if more are provided, or all if fewer
  const displayDashas = dashas.slice(0, 9);

  return (
    <div className="my-8 space-y-8 px-2 sm:px-4 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-4">
        {displayDashas.map((d, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedDashaIndex(selectedDashaIndex === idx ? null : idx)}
            className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 shadow-lg ${
              selectedDashaIndex === idx
                ? 'bg-[#312e81] border-[#FFD700] text-[#FFD700] ring-4 ring-[#FFD700]/20'
                : 'bg-white border-[#FFD700]/30 text-[#312e81] hover:border-[#FFD700]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black shadow-inner ${
                selectedDashaIndex === idx ? 'bg-[#FFD700] text-[#312e81]' : 'bg-amber-50 text-[#312e81]'
              }`}>
                {d.planet[0]}
              </div>
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block">Mahadasha</span>
                <span className="text-xl font-black uppercase tracking-tighter">{d.planet}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end text-[11px] font-bold">
                <div className="flex items-center gap-2">
                  <span className="opacity-60 uppercase text-[9px]">From</span>
                  <span className="font-black">{d.start}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="opacity-60 uppercase text-[9px]">To</span>
                  <span className="font-black">{d.end}</span>
                </div>
              </div>
              
              {d.duration && (
                <div className="hidden sm:flex flex-col items-center justify-center bg-[#FFD700]/10 px-4 py-2 rounded-xl border border-[#FFD700]/20">
                  <span className="text-[10px] font-black text-[#FFD700] uppercase">Duration</span>
                  <span className="text-sm font-black">{d.duration} Y</span>
                </div>
              )}

              <div className={`transition-transform duration-300 ${selectedDashaIndex === idx ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedDashaIndex !== null && displayDashas[selectedDashaIndex] && (
          <motion.div
            key={selectedDashaIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/95 rounded-[2.5rem] border-4 border-[#FFD700] shadow-2xl overflow-hidden"
          >
            <div className="bg-[#FFD700] p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#312e81] flex items-center justify-center text-[#FFD700] text-2xl font-black shadow-inner">
                  {displayDashas[selectedDashaIndex].planet[0]}
                </div>
                <div>
                  <h3 className="text-[#312e81] font-black uppercase tracking-widest text-xl">
                    {displayDashas[selectedDashaIndex].planet} Antardasha
                  </h3>
                  <p className="text-[#312e81]/60 text-[10px] font-black uppercase tracking-widest">Sub-periods of {displayDashas[selectedDashaIndex].planet} Mahadasha</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDashaIndex(null)}
                className="p-2 hover:bg-[#451a03]/10 rounded-full transition-all"
              >
                <svg className="w-6 h-6 text-[#312e81]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayDashas[selectedDashaIndex].antardashas?.map((ad, i) => (
                  <div 
                    key={i}
                    className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between group hover:bg-[#fffbeb] hover:border-[#FFD700]/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#451a03] font-black text-sm group-hover:bg-[#FFD700] group-hover:border-[#451a03] transition-all">
                        {ad.planet[0]}
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#451a03] uppercase tracking-widest">{ad.planet}</p>
                        <p className="text-[10px] font-bold text-slate-400 group-hover:text-[#92400e] transition-colors">Antardasha</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-[#451a03]">{ad.start}</p>
                      <p className="text-[9px] font-bold text-slate-400">to</p>
                      <p className="text-[10px] font-black text-[#451a03]">{ad.end}</p>
                    </div>
                  </div>
                ))}
              </div>
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

  const getIcon = (label: string) => {
    const l = (label || "").toLowerCase();
    if (l.includes('name')) return '👤';
    if (l.includes('date')) return '📅';
    if (l.includes('time')) return '⏰';
    if (l.includes('place')) return '📍';
    if (l.includes('latitude')) return '🌐';
    if (l.includes('longitude')) return '🌍';
    if (l.includes('kalidina')) return '🔢';
    if (l.includes('ghati')) return '⏳';
    if (l.includes('tithi')) return '🌒';
    if (l.includes('vara')) return '📅';
    if (l.includes('star') || l.includes('nakshatra')) return '⭐';
    if (l.includes('rashi')) return '🌙';
    if (l.includes('sooryodaya') || l.includes('sunrise')) return '🌅';
    if (l.includes('sooryasta') || l.includes('sunset')) return '🌇';
    if (l.includes('yoga')) return '🧘';
    if (l.includes('karana')) return '⚙️';
    if (l.includes('masa')) return '🌑';
    if (l.includes('paksha')) return '🌗';
    if (l.includes('rutu')) return '🍂';
    if (l.includes('ayana')) return '🧭';
    if (l.includes('samvatsara')) return '📜';
    if (l.includes('year')) return '🗓️';
    if (l.includes('gata')) return '⏮️';
    if (l.includes('shista')) return '⏭️';
    if (l.includes('dasha')) return '☸️';
    return '✨';
  };

  return (
    <div className="my-8 space-y-10 px-2 sm:px-4 max-w-5xl mx-auto">
      {categories.map(cat => (
        <motion.div 
          key={cat} 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white border-[4px] border-[#451a03] rounded-[2.5rem] shadow-[0_30px_60px_rgba(69,26,3,0.2)] overflow-hidden relative"
        >
          {/* Ornate Header with Gold Foil Effect */}
          <div className="bg-[#312e81] p-6 sm:p-10 border-b-[4px] border-[#D4AF37] relative overflow-hidden text-center">
             <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37] via-transparent to-transparent scale-150 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/gold-dust.png')] opacity-30"></div>
             </div>
             
             {/* Decorative Sanskrit-style ornaments */}
             <div className="flex justify-center items-center gap-4 mb-2">
               <div className="h-1 w-12 bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
               <span className="text-[#D4AF37] text-2xl sm:text-3xl">ॐ</span>
               <div className="h-1 w-12 bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
             </div>

             <h4 className="text-[#D4AF37] font-black uppercase tracking-[0.6em] text-base sm:text-2xl relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] astrological-font">
               {cat}
             </h4>
             
             <div className="mt-2 text-[#D4AF37]/60 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold">
               Siddhantic Birth Analysis
             </div>
          </div>

          <div className="divide-y-2 divide-[#D4AF37]/20">
            {details.filter(d => (d.category || 'General') === cat).map((d, i) => (
              <div 
                key={i} 
                className="flex flex-col sm:flex-row items-stretch group hover:bg-[#fffbeb] transition-all duration-300"
              >
                <div className="w-full sm:w-2/5 p-5 sm:p-8 flex items-center gap-6 border-b sm:border-b-0 sm:border-r-2 border-[#D4AF37]/20 bg-[#fdfaf3]/80 sm:bg-transparent">
                  <div className="w-14 h-14 rounded-full bg-[#312e81] flex items-center justify-center text-3xl shadow-lg border-2 border-[#D4AF37] group-hover:rotate-[360deg] transition-transform duration-700">
                    {getIcon(d.label)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs font-black text-[#312e81]/60 uppercase tracking-[0.25em] mb-1">
                      {d.label}
                    </span>
                    <div className="h-0.5 w-8 bg-[#D4AF37]/40 rounded-full"></div>
                  </div>
                </div>
                <div className="w-full sm:w-3/5 p-5 sm:p-8 flex items-center">
                  <span className="text-lg sm:text-2xl font-black text-[#312e81] tracking-tight leading-tight block drop-shadow-sm">
                    {d.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Ornate Corner Accents */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-[#D4AF37] rounded-tl-2xl m-3 opacity-60"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-[#D4AF37] rounded-tr-2xl m-3 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-[#D4AF37] rounded-bl-2xl m-3 opacity-60"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-[#D4AF37] rounded-br-2xl m-3 opacity-60"></div>
        </motion.div>
      ))}
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
          <div className="bg-[#312e81] p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#312e81] flex items-center justify-center text-[#FFD700] text-2xl font-black shadow-inner">
              {activeHouse}
            </div>
            <div>
              <h3 className="text-[#312e81] font-black uppercase tracking-widest text-xl">
                {currentHouse.title}
              </h3>
              <p className="text-[#312e81]/60 text-[10px] font-black uppercase tracking-widest">Bhava Analysis</p>
            </div>
          </div>

          <div className="p-8 sm:p-12 space-y-8">
            {currentHouse.shloka && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[#FFD700] font-black uppercase tracking-widest text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFD700]"></span>
                    House Significations (Karakatwas)
                  </h4>
                  <span className="text-[10px] font-black text-[#FFD700]/40 uppercase tracking-widest">Siddhantic Shloka</span>
                </div>
                <div 
                  className="p-8 bg-[#fffbeb] rounded-[2rem] border-2 border-[#FFD700]/40 italic text-[#451a03] font-serif text-xl sm:text-2xl text-center leading-relaxed shadow-inner whitespace-pre-wrap relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 pointer-events-none"></div>
                  <div dangerouslySetInnerHTML={{ __html: currentHouse.shloka }} />
                </div>
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
          <tr className="bg-[#FFD700] text-[#312e81]">
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

