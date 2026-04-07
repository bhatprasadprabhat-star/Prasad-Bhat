
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun, Moon, Flame, Zap, Crown, Heart, Anchor, Cloud, Wind, Compass, Skull } from 'lucide-react';
import { RasiChartData } from '../types';
import { RASIS, TRANSLATIONS } from '../constants.tsx';
import { Language } from '../types';

const PLANET_ICONS: Record<string, any> = {
  "Sun": Sun,
  "Moon": Moon,
  "Mars": Flame,
  "Mercury": Zap,
  "Jupiter": Crown,
  "Venus": Heart,
  "Saturn": Anchor,
  "Rahu": Cloud,
  "Ketu": Wind,
  "Lagna": Compass,
  "Mandi": Skull
};

const PLANET_COLORS: Record<string, string> = {
  "Sun": "#f59e0b",
  "Moon": "#94a3b8",
  "Mars": "#ef4444",
  "Mercury": "#10b981",
  "Jupiter": "#eab308",
  "Venus": "#ec4899",
  "Saturn": "#475569",
  "Rahu": "#1e293b",
  "Ketu": "#64748b",
  "Lagna": "#8b5cf6",
  "Mandi": "#4a044e"
};

interface SouthIndianChartProps {
  data: RasiChartData;
  lang: Language;
  title?: string;
}

const SouthIndianChart: React.FC<SouthIndianChartProps> = React.memo(({ data, lang, title }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  // Traditional South Indian order (clockwise from top-left offset)
  // Grid layout 4x4
  const gridMap: { [key: number]: number } = {
    11: 0, 0: 1, 1: 2, 2: 3, 3: 7, 4: 11, 5: 15, 6: 14, 7: 13, 8: 12, 9: 8, 10: 4
  };

  const getPlanetsInRasi = (rasiIdx: number) => {
    if (!Array.isArray(data)) return [];
    return data.filter(p => p.rasi === rasiIdx);
  };

  const renderCell = (gridIdx: number) => {
    const rasiIdx = Object.keys(gridMap).find(key => gridMap[parseInt(key)] === gridIdx);
    const isCenter = [5, 6, 9, 10].includes(gridIdx);

    if (isCenter) {
      if (gridIdx === 5) return (
        <div key={gridIdx} className="col-span-2 row-span-2 flex items-center justify-center p-2 overflow-hidden relative">
          {/* Traditional Wavy Sun Icon matching the image exactly */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-full h-full max-w-[90%] max-h-[90%] flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#f97316] drop-shadow-2xl">
              {/* Sun Core */}
              <circle cx="50" cy="50" r="18" fill="currentColor" />
              <circle cx="50" cy="50" r="14" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
              
              {/* Wavy Tribal Rays */}
              {[...Array(12)].map((_, i) => (
                <path
                  key={i}
                  d="M50 35 C60 22, 40 10, 50 0 C60 10, 40 22, 50 35"
                  fill="currentColor"
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}
              
              {/* Inner Detail */}
              <circle cx="50" cy="50" r="10" fill="white" opacity="0.15" />
            </svg>
          </motion.div>
        </div>
      );
      return null;
    }

    const rIdx = rasiIdx !== undefined ? parseInt(rasiIdx) : -1;
    const planets = rIdx !== -1 ? getPlanetsInRasi(rIdx) : [];
    const rasiName = rIdx !== -1 ? (t[RASIS[rIdx].label_key] || RASIS[rIdx].name) : "";

    return (
      <motion.div 
        key={gridIdx} 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: gridIdx * 0.005 }}
        className="aspect-square border-[1px] sm:border-2 border-[#5d4037]/80 flex flex-col p-0.5 sm:p-1 relative overflow-hidden group bg-white/30"
      >
        {/* Rasi Name Label - Very subtle */}
        {rIdx !== -1 && (
          <div className="absolute bottom-0.5 right-1 z-0">
            <span className="text-[6px] sm:text-[10px] font-black text-[#5d4037]/20 uppercase tracking-tighter">
              {rasiName}
            </span>
          </div>
        )}

        {/* Planets Container */}
        <div className="flex flex-wrap gap-0.5 sm:gap-2 justify-center items-center h-full content-center z-10 p-0.5 sm:p-2">
          {planets.map((p, i) => {
            const planetLabel = t[p.label_key] || p.name;
            const Icon = PLANET_ICONS[p.name] || Sparkles;
            const color = PLANET_COLORS[p.name] || '#000';
            
            return (
              <motion.div 
                key={i} 
                initial={{ scale: 0, y: -5 }}
                animate={{ scale: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-0.5 sm:p-1 rounded-md bg-white/40 border border-[#5d4037]/10 shadow-sm min-w-[30px] sm:min-w-[60px]"
                title={`${p.name} - ${p.degree}°`}
              >
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Icon size={10} className="sm:w-4 sm:h-4" style={{ color }} />
                  <span className="text-[10px] sm:text-[18px] font-black text-black leading-none tracking-tighter drop-shadow-sm">
                    {planetLabel}
                  </span>
                </div>
                <span className="text-[6px] sm:text-[10px] font-bold text-[#5d4037]/80 leading-none mt-0.5">
                  {p.degree.toFixed(1)}°
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-2 sm:p-8 bg-[#fef3c7] rounded-3xl border-[6px] sm:border-[16px] border-[#5d4037] shadow-[0_50px_100px_rgba(69,26,3,0.3)] w-full max-w-[380px] sm:max-w-5xl mx-auto overflow-hidden relative">
      {/* Subtle Parchment Texture */}
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")' }}></div>
      
      {/* Decorative inner border */}
      <div className="absolute inset-2 sm:inset-4 border-2 border-[#5d4037]/30 rounded-2xl pointer-events-none"></div>
      
      <div className="grid grid-cols-4 grid-rows-4 border-[3px] sm:border-[6px] border-[#5d4037] relative z-10 bg-transparent shadow-2xl">
        {[...Array(16)].map((_, i) => renderCell(i))}
      </div>
      
      <div className="mt-6 sm:mt-12 text-center space-y-2 sm:space-y-4 relative z-10">
        <h4 className="text-[16px] sm:text-5xl font-black text-[#5d4037] uppercase tracking-[0.4em] drop-shadow-lg astrological-font">{title || t.rasi_kundli || 'Rasi Kundli'}</h4>
        <div className="h-1 sm:h-2 w-32 sm:w-64 bg-gradient-to-r from-transparent via-[#5d4037]/80 to-transparent mx-auto rounded-full"></div>
        <p className="text-[8px] sm:text-sm font-bold text-[#5d4037]/60 uppercase tracking-[0.2em]">Siddhantic High-Resolution Chart</p>
      </div>
    </div>
  );
});

export default SouthIndianChart;
