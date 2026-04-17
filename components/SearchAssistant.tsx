
import React, { useState } from 'react';
import { fetchGroundingSearch } from '../services/gemini';
import { SearchSource, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { LoadingIndicator } from './LoadingIndicator';

interface SearchAssistantProps {
  lang: Language;
}

const SearchAssistant: React.FC<SearchAssistantProps> = ({ lang }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, sources: SearchSource[] } | null>(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsLoading(true);
    try {
      const data = await fetchGroundingSearch(`${query} (Respond in ${lang} language)`);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[var(--bg-secondary)]/80 backdrop-blur-xl rounded-2xl border border-[var(--border-primary)] max-w-3xl mx-auto">
      <h3 className="text-xl font-bold text-[var(--accent-primary)] mb-4 astrological-font">{t.celestial_insights_title || 'Current Celestial Insights'}</h3>
      <p className="text-sm text-[var(--text-primary)]/70 mb-6">{t.search_assistant_desc || 'Search for real-time planet transits, upcoming eclipses, or specific astrological events grounded with Google Search.'}</p>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search_assistant_placeholder || "e.g., Jupiter transit in 2024 effects on Mesha Rasi"}
          className="flex-1 bg-[var(--bg-primary)]/50 border border-[var(--border-primary)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)] font-bold"
        />
        <button 
          disabled={isLoading}
          type="submit"
          className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white dark:text-[#020617] px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <LoadingIndicator size={16} label={t.searching || 'Searching...'} /> : (t.ask_stars || 'Ask Stars')}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-4 animate-in fade-in duration-500">
          <div className="p-5 bg-[var(--bg-primary)]/50 rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
            {result.text}
          </div>
          {result.sources.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-2">{t.sources || 'Sources'}</h4>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((s, i) => (
                  <a 
                    key={i} 
                    href={s.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] bg-[var(--bg-secondary)] text-[var(--text-primary)]/70 px-2 py-1 rounded hover:text-[var(--accent-primary)] hover:bg-[var(--bg-primary)] transition-all border border-[var(--border-primary)]"
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAssistant;
