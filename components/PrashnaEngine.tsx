
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Sparkles, Send, Clock, MapPin } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language, UserMode, CityData } from '../types';
import { generatePrashnaAnalysis } from '../services/gemini';
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
    <div className="w-full bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 sm:p-12 border-4 border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#312e81]/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#312e81] to-[#1e1b4b] rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-xl">
            <HelpCircle size={32} />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#312e81] uppercase tracking-widest astrological-font leading-none">
              {lang === 'kn' ? 'ಪ್ರಶ್ನ ಶಾಸ್ತ್ರ' : lang === 'hi' ? 'प्रश्न शास्त्र' : 'Prashna (Horary) Oracle'}
            </h3>
            <p className="text-[10px] font-black text-[#312e81]/60 uppercase tracking-[0.3em] mt-2">
              Instant Answers from the Current Moment
            </p>
          </div>
        </div>

        {!result ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#312e81] uppercase tracking-widest ml-1">
                  {lang === 'kn' ? 'ಪ್ರಶ್ನ ಸಂಖ್ಯೆ (1-108)' : 'Prashna Number (1-108)'}
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="108"
                  value={prashnaNumber}
                  onChange={(e) => setPrashnaNumber(e.target.value)}
                  placeholder="e.g. 42"
                  className="w-full bg-amber-50/95 border-2 border-[#D4AF37]/20 rounded-2xl p-4 text-lg font-bold text-[#312e81] focus:border-[#D4AF37] outline-none shadow-inner"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#312e81] uppercase tracking-widest ml-1">
                  {lang === 'kn' ? 'ಪ್ರಶ್ನ ಸ್ಥಳ' : 'Query Location'}
                </label>
                <CitySearch 
                  value={location.name} 
                  onChange={setLocation} 
                  placeholder={lang === 'kn' ? 'ನಗರವನ್ನು ಹುಡುಕಿ...' : 'Search City...'} 
                />
              </div>
            </div>

            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಕೇಳಿ...' : 'Ask your question here...'}
                className="w-full bg-amber-50/95 border-2 border-[#D4AF37]/20 rounded-[2rem] p-6 sm:p-8 text-lg font-bold text-[#312e81] focus:border-[#D4AF37] outline-none min-h-[150px] shadow-inner transition-all placeholder:text-[#312e81]/30"
              />
              <div className="absolute bottom-6 right-6 flex items-center gap-3 text-[#312e81]/40">
                <Clock size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Moment: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <button
              onClick={handleAsk}
              disabled={isAnalyzing || !question.trim()}
              className="w-full py-6 bg-gradient-to-r from-[#312e81] to-[#1e1b4b] text-[#D4AF37] rounded-[2rem] font-black uppercase tracking-[0.4em] text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                  <span>Consulting the Stars...</span>
                </>
              ) : (
                <>
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>{lang === 'kn' ? 'ಉತ್ತರ ಪಡೆಯಿರಿ' : 'Get Answer'}</span>
                </>
              )}
            </button>
            
            <p className="text-center text-[10px] font-bold text-[#451a03]/40 uppercase tracking-widest italic">
              "The moment you ask is the moment the universe answers."
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="bg-amber-50/80 border-2 border-[#D4AF37]/30 rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Sparkles size={48} className="text-[#D4AF37]" />
              </div>
              
              <div className="prose prose-amber max-w-none">
                <div 
                  className={`analysis-rich-text ${mode === 'SCHOLAR' ? 'scholar-view' : 'seeker-view'} text-[#451a03] font-serif leading-relaxed whitespace-pre-wrap`}
                  dangerouslySetInnerHTML={{ __html: result }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setQuestion('');
              }}
              className="w-full py-5 border-2 border-[#451a03] text-[#451a03] rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-[#451a03] hover:text-[#D4AF37] transition-all"
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
