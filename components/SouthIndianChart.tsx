
import React from 'react';
import { motion } from 'framer-motion';
import { RasiChartData } from '../types';
import { RASIS } from '../constants.tsx';

interface SouthIndianChartProps {
  data: RasiChartData;
}

const SouthIndianChart: React.FC<SouthIndianChartProps> = React.memo(({ data }) => {
  // Traditional South Indian order (clockwise from top-left offset)
  // Grid layout 4x4
  const gridMap: { [key: number]: number } = {
    11: 0, 0: 1, 1: 2, 2: 3, 3: 7, 4: 11, 5: 15, 6: 14, 7: 13, 8: 12, 9: 8, 10: 4
  };

  const getPlanetsInRasi = (rasiIdx: number) => data.filter(p => p.rasi === rasiIdx);

  const renderCell = (gridIdx: number) => {
    const rasiIdx = Object.keys(gridMap).find(key => gridMap[parseInt(key)] === gridIdx);
    const isCenter = [5, 6, 9, 10].includes(gridIdx);

    if (isCenter) {
      if (gridIdx === 5) return (
        <div key={gridIdx} className="col-span-2 row-span-2 flex items-center justify-center p-2 sm:p-4 border border-[#431407]/20">
          <motion.svg 
            viewBox="0 0 100 100" 
            className="w-16 h-16 sm:w-24 md:w-32 fill-[#7C2D12] opacity-40"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
             <path d="M50 0 L55 20 L45 20 Z M50 100 L45 80 L55 80 Z M0 50 L20 45 L20 55 Z M100 50 L80 55 L80 45 Z" />
             <circle cx="50" cy="50" r="20" className="stroke-[#7C2D12] stroke-[1.5] fill-none" />
             <circle cx="50" cy="50" r="5" fill="currentColor" />
          </motion.svg>
        </div>
      );
      return null;
    }

    const rIdx = rasiIdx !== undefined ? parseInt(rasiIdx) : -1;
    const planets = rIdx !== -1 ? getPlanetsInRasi(rIdx) : [];

    return (
      <motion.div 
        key={gridIdx} 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: gridIdx * 0.02 }}
        className="aspect-square border border-[#431407]/30 flex flex-col p-0.5 sm:p-1 relative overflow-hidden bg-white/5"
      >
        <div className="flex flex-wrap gap-0.5 sm:gap-1 justify-center items-center h-full content-center">
          {planets.map((p, i) => (
            <motion.div 
              key={i} 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
              className="text-[10px] sm:text-xs md:text-sm font-black text-[#431407]"
            >
              {p.name.substring(0, 2)}
            </motion.div>
          ))}
          {planets.length === 0 && rIdx !== -1 && (
             <span className="text-[7px] sm:text-[9px] opacity-10 text-[#431407] font-black uppercase">{RASIS[rIdx].name.substring(0,3)}</span>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[320px] sm:max-w-md mx-auto bg-white/20 border-2 border-[#431407]/60 shadow-xl grid grid-cols-4 grid-rows-4 rounded-xl overflow-hidden backdrop-blur-sm"
    >
      {[...Array(16)].map((_, i) => renderCell(i))}
    </motion.div>
  );
});

export default SouthIndianChart;
