
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Sparkles, Send, Clock, MapPin } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language, UserMode, CityData } from '../types';
import { generatePrashnaAnalysis } from '../services/gemini';
import { LoadingIndicator } from './LoadingIndicator';
import CitySearch from './CitySearch';

interface PrashnaEngineProps {
  lang: Language;
  mode: UserMode;
}

const PrashnaEngine: React.FC<PrashnaEngineProps> = ({ lang, mode }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [question, setQuestion] = useState('');
  const [prashnaNumber, setPrashnaNumber] = useState('');
  const [location, setLocation] = useState<CityData>({ name: 'Current Location', lat: '', lon: '', tz: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const analysis = await generatePrashnaAnalysis(
        question + (prashnaNumber ? ` (Prashna Number: ${prashnaNumber})` : ''),
        location.name,
        lang,
        mode,
        location.lat,
        location.lon,
        location.tz
      );
      setResult(analysis);
    } catch (error) {
      console.error("Prashna error:", error);
      setResult("The cosmic energies are currently turbulent. Please try again in a few moments.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full bg-[var(--bg-secondary)]/50 backdrop-blur-xl rounded-lg p-6 sm:p-12 border border-[var(--border-primary)] shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent-primary)]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[var(--bg-primary)]/50 rounded-lg flex items-center justify-center text-[var(--accent-primary)] shadow-xl border border-[var(--border-primary)]">
            <HelpCircle size={28} className="sm:w-8 sm:h-8" />
          </div>
          <div>
            <h3 className="text-lg sm:text-3xl font-ancient font-black gold-leaf uppercase tracking-widest leading-none">
              {lang === 'kn' ? 'ಪ್ರಶ್ನ ಶಾಸ್ತ್ರ' : lang === 'hi' ? 'प्रश्न शास्त्र' : 'Prashna (Horary) Oracle'}
            </h3>
            <p className="text-[8px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)]/80 uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1.5 sm:mt-2">
              Instant Answers from the Current Moment
            </p>
          </div>
        </div>

        {!result ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1 opacity-80">
                  {lang === 'kn' ? 'ಪ್ರಶ್ನ ಸಂಖ್ಯೆ (1-108)' : 'Prashna Number (1-108)'}
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="108"
                  value={prashnaNumber}
                  onChange={(e) => setPrashnaNumber(e.target.value)}
                  placeholder="e.g. 42"
                  className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border-primary)] rounded-lg p-4 text-lg font-ancient font-black text-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none shadow-inner placeholder-[var(--accent-primary)]/20 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-ancient font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1 opacity-80">
                  {lang === 'kn' ? 'ಪ್ರಶ್ನ ಸ್ಥಳ' : 'Query Location'}
                </label>
                <CitySearch 
                  value={location.name} 
                  onChange={setLocation} 
                  placeholder={lang === 'kn' ? 'ನಗರವನ್ನು ಹುಡುಕಿ...' : 'Search City...'} 
                />
              </div>
            </div>

            <div className="relative group">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಕೇಳಿ...' : 'Ask your question here...'}
                className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border-primary)] rounded-lg p-5 sm:p-10 text-sm sm:text-xl font-premium font-bold text-[var(--text-primary)] focus:border-[var(--accent-primary)] outline-none min-h-[150px] sm:min-h-[200px] shadow-inner transition-all placeholder:text-[var(--accent-primary)]/20 leading-relaxed"
              />
              <div className="absolute bottom-6 right-6 flex items-center gap-3 text-[var(--accent-primary)]/70">
                <Clock size={14} className="sm:w-5 sm:h-5" />
                <span className="text-[9px] sm:text-[11px] font-ancient font-black uppercase tracking-[0.2em]">Moment: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <button
              onClick={handleAsk}
              disabled={isAnalyzing || !question.trim()}
              className="w-full py-4 sm:py-6 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--color-gold-dark)] text-white dark:text-[#020617] rounded-lg font-ancient font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-xs sm:text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 sm:gap-4 group border border-[var(--accent-primary)]/20"
            >
              {isAnalyzing ? (
                <LoadingIndicator size={20} label="Consulting the Stars..." />
              ) : (
                <>
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>{lang === 'kn' ? 'ಉತ್ತರ ಪಡೆಯಿರಿ' : 'Get Answer'}</span>
                </>
              )}
            </button>
            
            <p className="text-center text-[10px] font-ancient font-bold text-[var(--accent-primary)]/70 uppercase tracking-widest italic">
              "The moment you ask is the moment the universe answers."
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="bg-[var(--bg-secondary)]/50 backdrop-blur-xl border border-[var(--border-primary)] rounded-lg p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] pointer-events-none"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-4">
                  <h3 className="text-xl sm:text-2xl font-ancient font-black gold-leaf uppercase tracking-widest">Oracle Insight</h3>
                  <div className="text-[10px] font-ancient font-bold text-[var(--text-primary)]/70 uppercase tracking-widest">
                    {location.name} • {new Date().toLocaleDateString()}
                  </div>
                </div>
                
                <div className="prose max-w-none dark:prose-invert">
                  <div 
                    className={`analysis-rich-text ${mode === 'SCHOLAR' ? 'scholar-view' : 'seeker-view'} text-[var(--text-primary)] font-premium leading-relaxed whitespace-pre-wrap`}
                    dangerouslySetInnerHTML={{ __html: result }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setQuestion('');
              }}
              className="w-full py-5 border border-[var(--border-primary)] text-[var(--accent-primary)] rounded-lg font-ancient font-black uppercase tracking-[0.3em] text-xs hover:bg-[var(--accent-primary)]/10 transition-all"
            >
              Ask Another Question
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PrashnaEngine;
