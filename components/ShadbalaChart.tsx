
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
      <div className="w-full h-[450px] bg-[var(--bg-secondary)]/50 backdrop-blur-xl rounded-lg p-8 border border-[var(--border-primary)] shadow-2xl flex flex-col items-center relative overflow-hidden group">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <h3 className="text-2xl font-ancient font-black gold-leaf uppercase tracking-[0.4em] mb-6 drop-shadow-lg">Shadbala Analysis</h3>
        
        <div className="w-full h-full flex items-center justify-center relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="var(--border-primary)" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--accent-primary)', fontSize: 12, fontWeight: '900', letterSpacing: '0.1em', fontFamily: 'Inter' }} />
              <PolarRadiusAxis angle={30} domain={[0, 600]} tick={false} axisLine={false} />
              <Radar
                name="Strength"
                dataKey="A"
                stroke="var(--accent-primary)"
                strokeWidth={2}
                fill="url(#goldGradient)"
                fillOpacity={0.6}
              />
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-gold-dark)" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="absolute bottom-6 flex gap-4 z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_rgba(212,175,55,0.8)] animate-pulse"></div>
            <span className="text-[9px] font-ancient font-bold text-[var(--accent-primary)]/80 uppercase tracking-widest">Planetary Strength (Virupas)</span>
          </div>
        </div>
      </div>

      {shadbalaData && (
        <div className="overflow-x-auto bg-[var(--bg-secondary)]/50 backdrop-blur-xl rounded-lg border border-[var(--border-primary)] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
          <table className="w-full text-left border-collapse relative z-10">
            <thead>
              <tr className="bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-b border-[var(--border-primary)]">
                <th className="p-4 text-[10px] font-ancient font-black uppercase tracking-widest">Planet</th>
                <th className="p-4 text-[10px] font-ancient font-black uppercase tracking-widest">Sthana</th>
                <th className="p-4 text-[10px] font-ancient font-black uppercase tracking-widest">Dig</th>
                <th className="p-4 text-[10px] font-ancient font-black uppercase tracking-widest">Kaala</th>
                <th className="p-4 text-[10px] font-ancient font-black uppercase tracking-widest">Chesta</th>
                <th className="p-4 text-[10px] font-ancient font-black uppercase tracking-widest">Naisargika</th>
                <th className="p-4 text-[10px] font-ancient font-black uppercase tracking-widest">Drig</th>
                <th className="p-4 text-[10px] font-ancient font-black uppercase tracking-widest bg-[var(--accent-primary)]/10">Total</th>
              </tr>
            </thead>
            <tbody>
              {shadbalaData.map((d, i) => (
                <tr key={i} className="border-b border-[var(--border-primary)]/30 hover:bg-[var(--accent-primary)]/5 transition-colors">
                  <td className="p-4 text-xs font-ancient font-black text-[var(--accent-primary)] border-r border-[var(--border-primary)]/30">{d.planet}</td>
                  <td className="p-4 text-xs font-premium font-bold text-[var(--text-primary)]">{d.sthana}</td>
                  <td className="p-4 text-xs font-premium font-bold text-[var(--text-primary)]">{d.dig}</td>
                  <td className="p-4 text-xs font-premium font-bold text-[var(--text-primary)]">{d.kaala}</td>
                  <td className="p-4 text-xs font-premium font-bold text-[var(--text-primary)]">{d.chesta}</td>
                  <td className="p-4 text-xs font-premium font-bold text-[var(--text-primary)]">{d.naisargika}</td>
                  <td className="p-4 text-xs font-premium font-bold text-[var(--text-primary)]">{d.drig}</td>
                  <td className="p-4 text-xs font-ancient font-black text-[var(--accent-primary)] bg-[var(--accent-primary)]/5">{d.total || (d.sthana + d.dig + d.kaala + d.chesta + d.naisargika + d.drig)}</td>
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
