
import React, { useState } from 'react';
import { fetchGroundingSearch } from '../services/gemini';
import { SearchSource } from '../types';

const SearchAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, sources: SearchSource[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsLoading(true);
    try {
      const data = await fetchGroundingSearch(query);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900/80 rounded-2xl border border-yellow-700/30 max-w-3xl mx-auto">
      <h3 className="text-xl font-bold text-yellow-500 mb-4 astrological-font">Current Celestial Insights</h3>
      <p className="text-sm text-slate-400 mb-6">Search for real-time planet transits, upcoming eclipses, or specific astrological events grounded with Google Search.</p>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Jupiter transit in 2024 effects on Mesha Rasi"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-600"
        />
        <button 
          disabled={isLoading}
          type="submit"
          className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Ask Stars'}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-4 animate-in fade-in duration-500">
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap">
            {result.text}
          </div>
          {result.sources.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-2">Sources</h4>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((s, i) => (
                  <a 
                    key={i} 
                    href={s.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded hover:text-yellow-500 hover:bg-slate-700 transition-all border border-slate-700"
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
