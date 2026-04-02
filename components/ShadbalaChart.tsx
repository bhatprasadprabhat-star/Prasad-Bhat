
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Language } from '../types';

interface ShadbalaData {
  planet: string;
  sthana: number;
  dig: number;
  kaala: number;
  chesta: number;
  naisargika: number;
  drig: number;
  total?: number;
}

interface ShadbalaChartProps {
  lang: Language;
  shadbalaData?: ShadbalaData[];
}

const ShadbalaChart: React.FC<ShadbalaChartProps> = ({ lang, shadbalaData }) => {
  // Use real data if provided, otherwise fallback to mock
  const data = shadbalaData?.map(d => ({
    subject: d.planet,
    A: d.total || (d.sthana + d.dig + d.kaala + d.chesta + d.naisargika + d.drig),
    fullMark: 600 
  })) || [
    { subject: 'Sun', A: 420, fullMark: 600 },
    { subject: 'Moon', A: 398, fullMark: 600 },
    { subject: 'Mars', A: 386, fullMark: 600 },
    { subject: 'Mercury', A: 399, fullMark: 600 },
    { subject: 'Jupiter', A: 485, fullMark: 600 },
    { subject: 'Venus', A: 365, fullMark: 600 },
    { subject: 'Saturn', A: 430, fullMark: 600 },
  ];

  return (
    <div className="w-full space-y-8">
      <div className="w-full h-[450px] bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-[3rem] p-8 border-4 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.2)] flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
        <h3 className="text-2xl font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-6 astrological-font drop-shadow-lg">Shadbala Analysis</h3>
        
        <div className="w-full h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="rgba(212, 175, 55, 0.3)" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#D4AF37', fontSize: 14, fontWeight: '900', letterSpacing: '0.1em' }} />
              <PolarRadiusAxis angle={30} domain={[0, 600]} tick={false} axisLine={false} />
              <Radar
                name="Strength"
                dataKey="A"
                stroke="#D4AF37"
                strokeWidth={3}
                fill="url(#goldGradient)"
                fillOpacity={0.7}
              />
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#92400e" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="absolute bottom-6 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Planetary Strength (Virupas)</span>
          </div>
        </div>
      </div>

      {shadbalaData && (
        <div className="overflow-x-auto bg-[#1a1a1a] rounded-[2rem] border-2 border-[#D4AF37]/30 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#D4AF37] text-[#451a03]">
                <th className="p-4 text-[11px] font-black uppercase tracking-widest border-b-2 border-[#451a03]/10">Planet</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest border-b-2 border-[#451a03]/10">Sthana</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest border-b-2 border-[#451a03]/10">Dig</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest border-b-2 border-[#451a03]/10">Kaala</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest border-b-2 border-[#451a03]/10">Chesta</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest border-b-2 border-[#451a03]/10">Naisargika</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest border-b-2 border-[#451a03]/10">Drig</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest border-b-2 border-[#451a03]/10 bg-[#451a03] text-[#D4AF37]">Total (Virupas)</th>
              </tr>
            </thead>
            <tbody>
              {shadbalaData.map((d, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm font-black text-[#D4AF37] border-r border-white/5">{d.planet}</td>
                  <td className="p-4 text-sm font-bold text-white/80">{d.sthana}</td>
                  <td className="p-4 text-sm font-bold text-white/80">{d.dig}</td>
                  <td className="p-4 text-sm font-bold text-white/80">{d.kaala}</td>
                  <td className="p-4 text-sm font-bold text-white/80">{d.chesta}</td>
                  <td className="p-4 text-sm font-bold text-white/80">{d.naisargika}</td>
                  <td className="p-4 text-sm font-bold text-white/80">{d.drig}</td>
                  <td className="p-4 text-sm font-black text-[#D4AF37] bg-white/5">{d.total || (d.sthana + d.dig + d.kaala + d.chesta + d.naisargika + d.drig)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShadbalaChart;
