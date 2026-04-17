
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, FileDown, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PlanetPosition } from '../types';

const RASI_LORDS: { [key: number]: string } = {
  0: "Mars",      // Mesha
  1: "Venus",     // Vrishabha
  2: "Mercury",   // Mithuna
  3: "Moon",      // Karka
  4: "Sun",       // Simha
  5: "Mercury",   // Kanya
  6: "Venus",     // Tula
  7: "Mars",      // Vrishchika
  8: "Jupiter",   // Dhanu
  9: "Saturn",    // Makara
  10: "Saturn",   // Kumbha
  11: "Jupiter"   // Meena
};

const PLANET_RELATIONSHIPS: { [key: string]: { friends: string[], enemies: string[] } } = {
  "Sun": { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"] },
  "Moon": { friends: ["Sun", "Mercury"], enemies: [] },
  "Mars": { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"] },
  "Mercury": { friends: ["Sun", "Venus"], enemies: ["Moon"] },
  "Jupiter": { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"] },
  "Venus": { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"] },
  "Saturn": { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"] },
  "Lagna": { friends: [], enemies: [] },
  "Ascendant": { friends: [], enemies: [] }
};

interface AshtakavargaProps {
  data: {
    planet: string;
    points: number[];
  }[];
  planetPositions?: PlanetPosition[];
}

export const AshtakavargaTable: React.FC<AshtakavargaProps> = ({ data, planetPositions }) => {
  const rasis = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];
  
  const getRelationshipColor = (planetName: string, rasiIdx: number) => {
    const lord = RASI_LORDS[rasiIdx];
    if (!lord) return '';
    
    // Normalize names for comparison
    const p = planetName.trim();
    if (p === lord) return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30'; // Own Sign
    
    const rels = PLANET_RELATIONSHIPS[p];
    if (!rels) return '';
    
    if (rels.friends.includes(lord)) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (rels.enemies.includes(lord)) return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    return 'bg-amber-500/5 text-amber-600/80 dark:text-amber-400/80 border-amber-500/10'; // Neutral
  };

  const isPlanetInRasi = (planetName: string, rasiIdx: number) => {
    if (!planetPositions) return false;
    const p = planetName.trim().toLowerCase();
    return planetPositions.some(pos => {
      const posName = pos.name.toLowerCase();
      return (posName === p || posName.includes(p) || p.includes(posName)) && pos.rasi === rasiIdx;
    });
  };

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-8 text-center bg-[var(--bg-secondary)] backdrop-blur-xl rounded-lg border border-[var(--border-primary)] shadow-2xl mx-4">
        <p className="text-[var(--accent-primary)] font-ancient font-bold uppercase tracking-widest opacity-90">Calculating Ashtakavarga points...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto my-6 sm:my-8 bg-[var(--bg-secondary)] backdrop-blur-xl rounded-lg border border-[var(--border-primary)] shadow-2xl mx-2 sm:mx-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
      <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-[800px] relative z-10">
        <thead>
          <tr className="bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-b border-[var(--border-primary)]">
            <th className="p-3 sm:p-4 font-ancient font-black uppercase tracking-widest text-[10px] sm:text-xs sticky left-0 bg-[var(--bg-secondary)] backdrop-blur-md z-10 border-r border-[var(--border-primary)]">Planet</th>
            {rasis.map((r, idx) => (
              <th key={r} className="p-2 sm:p-3 font-ancient font-black uppercase tracking-tighter text-center border-r border-[var(--border-primary)] last:border-r-0">
                <div className="text-[9px] sm:text-[10px] whitespace-nowrap">{r.slice(0, 3)}</div>
                <div className="text-[7px] sm:text-[8px] opacity-70 font-premium mt-0.5">{RASI_LORDS[idx].slice(0, 2)}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-[var(--border-primary)] hover:bg-[var(--accent-primary)]/5 transition-colors">
              <td className="p-3 sm:p-4 font-ancient font-bold text-[var(--accent-primary)] text-xs sm:text-sm sticky left-0 bg-[var(--bg-secondary)] backdrop-blur-md shadow-r z-10 border-r border-[var(--border-primary)]">{row.planet}</td>
              {row.points.map((p, j) => {
                const relationshipClasses = getRelationshipColor(row.planet, j);
                const isActive = isPlanetInRasi(row.planet, j);
                
                return (
                  <td 
                    key={j} 
                    className={`p-2 sm:p-4 text-center border-r border-[var(--border-primary)] last:border-r-0 transition-all ${relationshipClasses} ${
                      isActive ? 'ring-2 ring-inset ring-[var(--accent-primary)] bg-[var(--accent-primary)]/20 z-10 relative scale-105 shadow-inner' : ''
                    }`}
                  >
                    <div className="relative">
                      <span className={`text-xs sm:text-base font-premium font-black ${isActive ? 'text-[var(--accent-primary)] scale-110 inline-block drop-shadow-lg' : 'text-[var(--text-primary)]'}`}>
                        {p}
                      </span>
                      {isActive && (
                        <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 animate-pulse">
                          <span className="text-[10px] sm:text-lg">📍</span>
                        </div>
                      )}
                    </div>
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
      <div className="p-8 text-center bg-[var(--bg-secondary)] backdrop-blur-xl rounded-lg border border-[var(--border-primary)] shadow-2xl mx-4">
        <p className="text-[var(--accent-primary)] font-ancient font-bold uppercase tracking-widest opacity-90">Calculating Vimshottari Dasha periods...</p>
      </div>
    );
  }

  // Ensure we only show 9 dashas if more are provided, or all if fewer
  const displayDashas = dashas.slice(0, 9);

  return (
    <div className="my-6 sm:my-8 space-y-4 sm:space-y-8 px-2 sm:px-4 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {displayDashas.map((d, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedDashaIndex(selectedDashaIndex === idx ? null : idx)}
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-3 sm:gap-4 shadow-lg relative overflow-hidden ${
              selectedDashaIndex === idx
                ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] text-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/30'
                : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50'
            }`}
          >
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-base sm:text-xl font-ancient font-black shadow-lg border ${
                selectedDashaIndex === idx ? 'bg-[var(--accent-primary)] text-white dark:text-[#020617] border-[var(--accent-primary)]' : 'bg-[var(--bg-primary)]/50 text-[var(--accent-primary)] border-[var(--border-primary)]'
              }`}>
                {d.planet[0]}
              </div>
              <div className="text-left">
                <span className="text-[8px] sm:text-[10px] font-ancient font-bold uppercase tracking-[0.2em] opacity-100 block">Mahadasha</span>
                <span className="text-base sm:text-xl font-ancient font-black uppercase tracking-widest gold-leaf">{d.planet}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6 relative z-10">
              <div className="flex flex-col items-end text-[9px] sm:text-[11px] font-premium font-bold">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="opacity-100 uppercase text-[7px] sm:text-[9px] font-ancient">From</span>
                  <span className="font-black tracking-wider text-[var(--text-primary)]">{d.start}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="opacity-100 uppercase text-[7px] sm:text-[9px] font-ancient">To</span>
                  <span className="font-black tracking-wider text-[var(--text-primary)]">{d.end}</span>
                </div>
              </div>
              
              {d.duration && (
                <div className="hidden sm:flex flex-col items-center justify-center bg-[var(--accent-primary)]/5 px-4 py-2 rounded-xl border border-[var(--border-primary)]">
                  <span className="text-[10px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-widest">Duration</span>
                  <span className="text-sm font-premium font-black text-[var(--text-primary)]">{d.duration} Y</span>
                </div>
              )}

              <div className={`transition-transform duration-500 ${selectedDashaIndex === idx ? 'rotate-180' : ''}`}>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-primary)] opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="bg-[var(--bg-secondary)] backdrop-blur-2xl rounded-lg border border-[var(--border-primary)] shadow-2xl overflow-hidden relative"
          >
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
            <div className="bg-[var(--accent-primary)]/10 p-4 sm:p-6 flex items-center justify-between border-b border-[var(--border-primary)] relative z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-white dark:text-[#020617] text-lg sm:text-2xl font-ancient font-black shadow-2xl">
                  {displayDashas[selectedDashaIndex].planet[0]}
                </div>
                <div>
                  <h3 className="text-[var(--accent-primary)] font-ancient font-black uppercase tracking-widest text-sm sm:text-xl gold-leaf">
                    {displayDashas[selectedDashaIndex].planet} Antardasha
                  </h3>
                  <p className="text-[var(--accent-primary)]/90 text-[8px] sm:text-[10px] font-ancient font-bold uppercase tracking-[0.2em]">Sub-periods of {displayDashas[selectedDashaIndex].planet} Mahadasha</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDashaIndex(null)}
                className="p-1.5 sm:p-2 hover:bg-[var(--accent-primary)]/10 rounded-full transition-all text-[var(--accent-primary)]"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 sm:p-10 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {displayDashas[selectedDashaIndex].antardashas?.map((ad, i) => (
                  <div 
                    key={i}
                    className="p-4 sm:p-5 bg-[var(--bg-primary)]/50 rounded-lg border border-[var(--border-primary)] flex items-center justify-between group hover:bg-[var(--accent-primary)]/5 hover:border-[var(--accent-primary)]/40 transition-all duration-500"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--accent-primary)] font-ancient font-black text-[10px] sm:text-sm group-hover:bg-[var(--accent-primary)] group-hover:text-white dark:group-hover:text-[#020617] transition-all duration-500">
                        {ad.planet[0]}
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs font-ancient font-black text-[var(--accent-primary)] uppercase tracking-widest">{ad.planet}</p>
                        <p className="text-[8px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)]/80 group-hover:text-[var(--accent-primary)]/90 transition-colors">Antardasha</p>
                      </div>
                    </div>
                    <div className="text-right font-premium font-bold">
                      <p className="text-[9px] sm:text-[10px] text-[var(--accent-primary)] tracking-wider">{ad.start}</p>
                      <p className="text-[8px] sm:text-[9px] text-[var(--accent-primary)]/80 uppercase font-ancient">to</p>
                      <p className="text-[9px] sm:text-[10px] text-[var(--accent-primary)] tracking-wider">{ad.end}</p>
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
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!details || !Array.isArray(details) || details.length === 0) {
    return null;
  }

  const downloadPDF = async () => {
    if (!containerRef.current) return;
    setIsDownloading(true);
    
    try {
      // Hide buttons temporarily or capture specific element
      const element = containerRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null, // Transparent to keep the gradient/styling
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Add a header to the PDF
      pdf.setFontSize(18);
      pdf.setTextColor(184, 134, 11); // Vedic Gold
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('AstroLogic_Birth_Details.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

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
    <div className="my-6 sm:my-8 space-y-8 sm:space-y-10 px-2 sm:px-4 max-w-5xl mx-auto">
      <div className="flex justify-end mb-4 no-pdf">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] rounded-full font-ancient font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isDownloading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileDown size={14} />
              Export Basic Info PDF
            </>
          )}
        </motion.button>
      </div>

      <div ref={containerRef} className="space-y-8 sm:space-y-10">
        {categories.map(cat => (
          <motion.div 
            key={cat} 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[var(--bg-secondary)] backdrop-blur-xl rounded-2xl shadow-xl border border-[var(--border-primary)] overflow-hidden relative"
          >
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
            
            {/* Ornate Header with Gold Foil Effect */}
            <div className="bg-[var(--accent-primary)]/10 p-5 sm:p-10 border-b border-[var(--border-primary)] relative overflow-hidden text-center">
               <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[var(--accent-primary)] via-transparent to-transparent scale-150 animate-pulse"></div>
               </div>
               
               {/* Decorative Sanskrit-style ornaments */}
               <div className="flex justify-center items-center gap-3 sm:gap-4 mb-1.5 sm:mb-2 relative z-10">
                 <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[var(--accent-primary)]"></div>
                 <span className="text-[var(--accent-primary)] text-xl sm:text-3xl">ॐ</span>
                 <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[var(--accent-primary)]"></div>
               </div>

               <h4 className="text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-sm sm:text-2xl relative z-10 drop-shadow-2xl gold-leaf">
                 {cat}
               </h4>
               
               <div className="mt-1.5 sm:mt-2 text-[var(--accent-primary)]/70 text-[8px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase font-ancient font-bold">
                 Siddhantic Birth Analysis
               </div>
            </div>

            <div className="divide-y divide-[var(--border-primary)] relative z-10">
              {details.filter(d => (d.category || 'General') === cat).map((d, i) => (
                <div 
                  key={i} 
                  className="flex flex-col sm:flex-row items-stretch group hover:bg-[var(--accent-primary)]/5 transition-all duration-500"
                >
                  <div className="w-full sm:w-2/5 p-4 sm:p-8 flex items-center gap-4 sm:gap-6 border-b sm:border-b-0 sm:border-r border-[var(--border-primary)] bg-[var(--bg-primary)]/50 sm:bg-transparent">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center text-white dark:text-[#020617] text-xl sm:text-3xl shadow-lg border border-[var(--accent-primary)]/50 group-hover:rotate-[360deg] transition-transform duration-1000">
                      {getIcon(d.label)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] sm:text-xs font-ancient font-bold text-[var(--accent-primary)]/90 uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-0.5 sm:mb-1">
                        {d.label}
                      </span>
                      <div className="h-[1px] w-6 sm:w-8 bg-[var(--accent-primary)]/40 rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-full sm:w-3/5 p-4 sm:p-8 flex items-center">
                    {d.label.toLowerCase().includes('time') ? (
                      <div className="bg-[var(--accent-primary)]/10 border-2 border-[var(--accent-primary)] rounded-xl px-6 py-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                        <span className="text-base sm:text-2xl font-premium font-bold text-[var(--accent-primary)] tracking-widest leading-tight block drop-shadow-2xl">
                          {d.value}
                        </span>
                      </div>
                    ) : (
                      <span className="text-base sm:text-2xl font-premium font-bold text-[var(--text-primary)] tracking-widest leading-tight block drop-shadow-2xl">
                        {d.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Ornate Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--accent-primary)]/40 m-2 opacity-80"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--accent-primary)]/40 m-2 opacity-80"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--accent-primary)]/40 m-2 opacity-80"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--accent-primary)]/40 m-2 opacity-80"></div>
          </motion.div>
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
      <div className="p-8 text-center bg-[var(--bg-secondary)] backdrop-blur-xl rounded-lg border border-[var(--border-primary)] shadow-2xl mx-4">
        <p className="text-[var(--accent-primary)] font-ancient font-bold uppercase tracking-widest opacity-90">Analyzing 12 Bhavas...</p>
      </div>
    );
  }

  const currentHouse = houses.find(h => h.number === activeHouse) || houses[0];

  return (
    <div className="my-6 sm:my-8 space-y-4 sm:space-y-6 px-2 sm:px-4">
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5 sm:gap-2">
        {houses.map((h) => (
          <button
            key={h.number}
            onClick={() => setActiveHouse(h.number)}
            className={`h-10 sm:h-12 rounded-lg font-ancient font-black transition-all flex items-center justify-center border ${
              activeHouse === h.number
                ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white dark:text-[#020617] shadow-2xl scale-105 sm:scale-110 z-10'
                : 'bg-[var(--bg-primary)]/50 border-[var(--border-primary)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)]'
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
          className="bg-[var(--bg-secondary)]/50 backdrop-blur-2xl rounded-lg border border-[var(--border-primary)] shadow-2xl overflow-hidden min-h-[350px] sm:min-h-[400px] relative"
        >
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
          <div className="bg-[var(--accent-primary)]/10 p-4 sm:p-6 flex items-center gap-3 sm:gap-4 border-b border-[var(--border-primary)] relative z-10">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-white dark:text-[#020617] text-lg sm:text-2xl font-ancient font-black shadow-2xl">
              {activeHouse}
            </div>
            <div>
              <h3 className="text-[var(--accent-primary)] font-ancient font-black uppercase tracking-widest text-sm sm:text-xl gold-leaf">
                {currentHouse.title}
              </h3>
              <p className="text-[var(--accent-primary)]/90 text-[8px] sm:text-[10px] font-ancient font-bold uppercase tracking-[0.2em]">Bhava Analysis</p>
            </div>
          </div>

          <div className="p-5 sm:p-12 space-y-6 sm:space-y-8 relative z-10">
            {currentHouse.shloka && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[var(--accent-primary)] font-ancient font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--accent-primary)]"></span>
                    House Significations
                  </h4>
                  <span className="text-[8px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)]/80 uppercase tracking-widest">Siddhantic Shloka</span>
                </div>
                <div 
                  className="p-5 sm:p-8 bg-[var(--bg-primary)]/50 rounded-lg border border-[var(--accent-primary)]/30 italic text-[var(--accent-primary)] font-premium font-bold text-base sm:text-2xl text-center leading-relaxed shadow-2xl whitespace-pre-wrap relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
                  <div dangerouslySetInnerHTML={{ __html: currentHouse.shloka }} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-[var(--accent-primary)] font-ancient font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--accent-primary)]"></span>
                  Significance & Strength
                </h4>
                <div className="p-4 sm:p-6 bg-[var(--bg-primary)]/50 rounded-lg border border-[var(--accent-primary)]/20 text-[var(--text-primary)] font-premium font-bold text-xs sm:text-lg leading-relaxed">
                  {currentHouse.strength || "Detailed strength analysis based on Lord, Aspects and Occupants."}
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-[var(--accent-primary)] font-ancient font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--accent-primary)]"></span>
                  Detailed Phala
                </h4>
                <div className="text-[var(--text-primary)] font-premium text-xs sm:text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: currentHouse.description }} />
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
      <div className="p-8 text-center bg-[var(--bg-secondary)] backdrop-blur-xl rounded-lg border border-[var(--border-primary)] shadow-2xl mx-4">
        <p className="text-[var(--accent-primary)] font-ancient font-bold uppercase tracking-widest opacity-90">Calculating Panchadha Graha Maitri...</p>
      </div>
    );
  }

  const getRelationshipColor = (rel: string) => {
    switch (rel) {
      case 'Adhi Mitra': return 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/20 border-emerald-500/40';
      case 'Mitra': return 'text-green-700 dark:text-green-300 bg-green-500/20 border-green-500/40';
      case 'Sama': return 'text-amber-700 dark:text-amber-200 bg-amber-500/10 border-amber-500/30';
      case 'Shatru': return 'text-orange-700 dark:text-orange-300 bg-orange-500/20 border-orange-500/40';
      case 'Adhi Shatru': return 'text-red-700 dark:text-red-300 bg-red-500/20 border-red-500/40';
      default: return 'text-[var(--accent-primary)]/80';
    }
  };

  return (
    <div className="overflow-x-auto my-6 sm:my-8 bg-[var(--bg-secondary)] backdrop-blur-xl rounded-lg border border-[var(--border-primary)] shadow-2xl mx-2 sm:mx-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
      <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-[700px] relative z-10">
        <thead>
          <tr className="bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-b border-[var(--border-primary)]">
            <th className="p-3 sm:p-4 font-ancient font-black uppercase tracking-widest text-[10px] sm:text-xs sticky left-0 bg-[var(--bg-secondary)] backdrop-blur-md z-10">Planet</th>
            {planets.map(p => (
              <th key={p} className="p-3 sm:p-4 font-ancient font-black uppercase tracking-widest text-[9px] sm:text-[10px] text-center">{p}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i} className="border-b border-[var(--border-primary)] hover:bg-[var(--accent-primary)]/5 transition-colors">
              <td className="p-3 sm:p-4 font-ancient font-bold text-[var(--accent-primary)] text-xs sm:text-sm sticky left-0 bg-[var(--bg-secondary)] backdrop-blur-md shadow-r z-10">{row.planet}</td>
              {planets.map((p, j) => {
                const rel = row.relationships[p] || '-';
                return (
                  <td key={j} className="p-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded-lg text-[9px] sm:text-[10px] font-ancient font-black uppercase tracking-tighter border ${getRelationshipColor(rel)}`}>
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

