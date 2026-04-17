import React from 'react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface MuhurtaDetailsProps {
  data: {
    event: string;
    recommendations: {
      time: string;
      reasoning: string;
      panchangam: {
        tithi: string;
        nakshatra: string;
        yoga: string;
        karana: string;
        vara: string;
      };
      planets: {
        name: string;
        rasi: string;
        degree: string;
        reason: string;
      }[];
      references: string[];
    }[];
  };
  lang: Language;
}

const MuhurtaAnalysis: React.FC<MuhurtaDetailsProps> = ({ data, lang }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  if (!data || !data.recommendations) return null;

  return (
    <div className="space-y-16 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl sm:text-5xl font-ancient font-black gold-leaf uppercase tracking-[0.3em] drop-shadow-2xl">
          {t.muhurta_analysis || 'Siddhantic Alignment'}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent mx-auto rounded-full opacity-50" />
        <p className="text-[var(--accent-primary)] font-ancient font-bold uppercase tracking-widest text-[9px] sm:text-xs">
          Calculating Eternal Flow for: <span className="text-[var(--text-primary)]">{data.event}</span>
        </p>
      </div>

      <div className="grid gap-12 max-w-5xl mx-auto px-2 sm:px-4">
        {data.recommendations.map((rec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-[var(--bg-secondary)]/50 backdrop-blur-3xl rounded-3xl border border-[var(--accent-primary)]/30 shadow-[0_30px_90px_rgba(0,0,0,0.5)] overflow-hidden relative"
          >
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-[var(--accent-primary)]/10 rounded-full blur-3xl"></div>
            
            {/* Header: Time and Main Verdict */}
            <div className="bg-[var(--accent-primary)]/10 p-6 sm:p-12 border-b border-[var(--border-primary)]/30 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] sm:text-[11px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-widest">{t.auspicious_time || 'Auspicious Window'}</span>
                  </div>
                  <div className="text-2xl sm:text-5xl font-premium font-black text-[var(--accent-primary)] gold-leaf tracking-tighter">
                    {rec.time}
                  </div>
                </div>
                <div className="bg-[var(--bg-primary)]/80 p-6 rounded-2xl border border-[var(--accent-primary)]/30 shadow-2xl backdrop-blur-md max-w-md">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-lg">✨</span>
                     <span className="text-[9px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest">{t.verdict || 'Vedic Verdict'}</span>
                  </div>
                  <p className="text-xs sm:text-base font-premium font-bold text-[var(--text-primary)] leading-relaxed italic">"{rec.reasoning}"</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-12 space-y-12 relative z-10">
              {/* Panchanga Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-6">
                {Object.entries(rec.panchangam).map(([key, val]) => (
                  <div key={key} className="bg-[var(--bg-primary)]/40 p-4 sm:p-6 rounded-2xl border border-[var(--border-primary)] group hover:border-[var(--accent-primary)] transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1">
                    <span className="text-[8px] sm:text-[10px] font-ancient font-black text-[var(--accent-primary)] uppercase tracking-widest block mb-2 opacity-100 group-hover:gold-leaf">{key}</span>
                    <span className="text-xs sm:text-base font-premium font-black text-[var(--text-primary)] tracking-wide">{val}</span>
                  </div>
                ))}
              </div>

              {/* Planetary Alignment Table */}
              <div className="space-y-6">
                <h3 className="text-[var(--accent-primary)] font-ancient font-black uppercase tracking-[0.3em] text-[10px] sm:text-sm flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[var(--accent-primary)] shadow-[0_0_15px_var(--accent-primary)] border border-white/20"></span>
                  {t.planetary_positions || 'Astro-Physical Configuration'}
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-[var(--border-primary)] shadow-2xl bg-[var(--bg-primary)]/30 backdrop-blur-md">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-b border-[var(--border-primary)]">
                        <th className="p-6 font-ancient font-black uppercase tracking-widest text-[10px] sm:text-xs">{t.planet || 'Graha'}</th>
                        <th className="p-6 font-ancient font-black uppercase tracking-widest text-[10px] sm:text-xs">{t.rasi || 'Rasi'}</th>
                        <th className="p-6 font-ancient font-black uppercase tracking-widest text-[10px] sm:text-xs">{t.degree || 'Degree'}</th>
                        <th className="p-6 font-ancient font-black uppercase tracking-widest text-[10px] sm:text-xs">{t.reasoning || 'Significance / Phala'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rec.planets && rec.planets.map((p, i) => (
                        <tr key={i} className="border-b border-[var(--border-primary)]/20 hover:bg-[var(--accent-primary)]/5 transition-all duration-300">
                          <td className="p-5 font-premium font-black text-[var(--accent-primary)] text-sm sm:text-lg">{p.name}</td>
                          <td className="p-5 font-premium font-bold text-[var(--text-primary)] text-xs sm:text-sm">{p.rasi}</td>
                          <td className="p-5 font-premium font-bold text-[var(--text-primary)] text-xs sm:text-sm">{p.degree}</td>
                          <td className="p-5 font-premium text-[11px] sm:text-sm text-[var(--text-primary)]/90 leading-relaxed italic border-l border-[var(--border-primary)]/10">{p.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Classical References */}
              {rec.references && rec.references.length > 0 && (
                <div className="space-y-6 pt-10 border-t border-[var(--border-primary)]/30">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📜</span>
                    <h4 className="text-[var(--accent-primary)] font-ancient font-bold uppercase tracking-[0.2em] text-[9px] sm:text-[11px]">{t.classical_references || 'Prashna Marga & Siddhantic Authority'}</h4>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {rec.references.map((ref, i) => (
                      <div key={i} className="px-6 py-3 bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/20 rounded-2xl text-[10px] sm:text-xs font-premium font-bold text-[var(--accent-primary)] italic shadow-sm hover:border-[var(--accent-primary)] transition-all cursor-default">
                        {ref}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MuhurtaAnalysis;
