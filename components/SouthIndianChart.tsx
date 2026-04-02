
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun, Moon, Flame, Zap, Crown, Heart, Anchor, Cloud, Wind, Compass } from 'lucide-react';
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
  "Lagna": Compass
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
  "Lagna": "#8b5cf6"
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
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#f97316] drop-shadow-xl">
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
        className="aspect-square border-2 border-[#5d4037]/80 flex flex-col p-1 relative overflow-hidden group bg-transparent"
      >
        {/* Rasi Name Label - Very subtle */}
        {rIdx !== -1 && (
          <div className="absolute bottom-0.5 right-1 z-0">
            <span className="text-[5px] sm:text-[8px] font-bold text-[#5d4037]/10 uppercase">
              {rasiName}
            </span>
          </div>
        )}

        {/* Planets Container */}
        <div className="flex flex-wrap gap-1 sm:gap-3 justify-start items-start h-full content-start z-10 p-1 sm:p-3">
          {planets.map((p, i) => {
            const planetLabel = t[p.label_key] || p.name;
            
            return (
              <motion.div 
                key={i} 
                initial={{ scale: 0, y: -5 }}
                animate={{ scale: 1, y: 0 }}
                className="flex flex-col items-start"
                title={`${p.name} - ${p.degree}°`}
              >
                <span className="text-[14px] sm:text-[32px] font-black text-black leading-none tracking-tighter drop-shadow-sm">
                  {planetLabel}
                </span>
                <span className="text-[7px] sm:text-[12px] font-black text-[#5d4037] leading-none mt-1">
                  {p.degree}°
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-4 sm:p-12 bg-[#fef3c7] rounded-xl border-[12px] border-[#5d4037] shadow-[0_40px_80px_rgba(0,0,0,0.4)] w-full max-w-[400px] sm:max-w-4xl mx-auto overflow-hidden relative">
      {/* Subtle Parchment Texture */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")' }}></div>
      
      {/* Decorative inner border */}
      <div className="absolute inset-3 border-2 border-[#5d4037]/20 rounded-lg pointer-events-none"></div>
      
      <div className="grid grid-cols-4 grid-rows-4 border-4 border-[#5d4037] relative z-10 bg-transparent shadow-inner">
        {[...Array(16)].map((_, i) => renderCell(i))}
      </div>
      
      <div className="mt-10 text-center space-y-3 relative z-10">
        <h4 className="text-[18px] sm:text-4xl font-black text-[#5d4037] uppercase tracking-[0.5em] drop-shadow-md">{title || t.rasi_kundli || 'Rasi Kundli'}</h4>
        <div className="h-1.5 w-40 bg-gradient-to-r from-transparent via-[#5d4037]/60 to-transparent mx-auto rounded-full"></div>
      </div>
    </div>
  );
;
});

export default SouthIndianChart;
