
import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Image as ImageIcon, Sparkles, ChevronLeft, Info } from 'lucide-react';
import { Language, UserMode } from '../types';
import { TRANSLATIONS } from '../constants';
import { generatePalmReading } from '../services/gemini';
import MandalaBackground from './MandalaBackground';
import { LoadingIndicator } from './LoadingIndicator';

interface PalmReaderProps {
  lang: Language;
  mode: UserMode;
  onBack: () => void;
}

const PalmReader: React.FC<PalmReaderProps> = ({ lang, mode, onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const mimeType = image.split(';')[0].split(':')[1];
      const base64 = image.split(',')[1];
      const result = await generatePalmReading(base64, lang, mode, mimeType);
      
      if (result === "INVALID_PALM_IMAGE") {
        setError(TRANSLATIONS[lang].invalid_palm_error || "The celestial eye cannot see a palm clearly here. Please upload a clear photo of your palm.");
        return;
      }
      
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      alert("Celestial focus was interrupted. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen relative overflow-hidden flex flex-col bg-[#020617]">
      <MandalaBackground />
      
      <header className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-4 sm:p-8 flex items-center shadow-2xl sticky top-0 z-30 border-b border-[var(--accent-primary)]/40">
        <button onClick={onBack} className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-all group">
          <ChevronLeft size={24} />
        </button>
        <div className="ml-4">
          <h2 className="text-xl sm:text-3xl font-ancient font-black gold-leaf uppercase tracking-widest leading-none">
            {t.palm_reading_title || 'Palm Reading'}
          </h2>
          <p className="text-[8px] sm:text-[10px] font-ancient font-bold text-[var(--accent-primary)]/80 uppercase tracking-[0.2em] mt-1">
            {t.palm_reading_desc || 'Ancient science of Hast Rekha Shastra'}
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-10 z-10 w-full max-w-4xl mx-auto space-y-8">
        {!analysis && !loading && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8">
            <div className="modern-card p-6 sm:p-10 rounded-3xl bg-[var(--bg-secondary)]/50 backdrop-blur-3xl border border-[var(--accent-primary)]/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 text-[var(--accent-primary)]">
                <Info size={20} />
                <h3 className="font-ancient font-black uppercase tracking-widest text-sm">How to capture?</h3>
              </div>
              <p className="text-[var(--text-primary)]/80 font-premium leading-relaxed mb-8 italic text-sm sm:text-base">
                {t.palm_instructions}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 rounded-2xl bg-[var(--bg-primary)]/30 border-2 border-dashed border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transition-all flex flex-col items-center justify-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="text-[var(--accent-primary)]" size={32} />
                  </div>
                  <span className="font-ancient font-bold uppercase tracking-widest text-xs">{t.camera_access || 'Open Camera'}</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 rounded-2xl bg-[var(--bg-primary)]/30 border-2 border-dashed border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transition-all flex flex-col items-center justify-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon className="text-[var(--accent-primary)]" size={32} />
                  </div>
                  <span className="font-ancient font-bold uppercase tracking-widest text-xs">{t.gallery_access || 'Choose from Gallery'}</span>
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>

            {image && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modern-card overflow-hidden rounded-3xl border border-[var(--accent-primary)]/30 shadow-2xl max-w-md mx-auto">
                <div className="relative aspect-[4/5]">
                  <img src={image} alt="Palm" className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-4 p-3 bg-red-500/80 backdrop-blur-md rounded-xl flex items-center gap-3 text-white text-xs font-bold shadow-lg"
                      >
                        <Info size={16} className="shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                    <button 
                      onClick={startAnalysis}
                      disabled={loading}
                      className="w-full py-4 bg-[var(--accent-primary)] text-white dark:text-[#020617] rounded-xl font-ancient font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all shadow-xl"
                    >
                      <Sparkles size={18} />
                      {loading ? 'Consulting Stars...' : 'Analyze Palm'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <LoadingIndicator size={64} />
            <div className="space-y-2">
              <h3 className="text-xl font-ancient font-black gold-leaf uppercase tracking-[0.3em] animate-pulse">
                {t.analyzing_palm || 'Reading the lines of destiny...'}
              </h3>
              <p className="text-[10px] font-ancient font-bold text-[var(--accent-primary)]/60 uppercase tracking-widest">
                Consulting Samudrika Shastra
              </p>
            </div>
          </div>
        )}

        {analysis && !loading && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8 pb-10">
            <div className="modern-card p-6 sm:p-12 rounded-3xl bg-[var(--bg-secondary)]/50 backdrop-blur-3xl shadow-2xl border border-[var(--accent-primary)]/20">
              <div className="palm-content text-[var(--text-primary)] font-premium leading-relaxed text-sm sm:text-lg" dangerouslySetInnerHTML={{ __html: analysis }} />
              
              <div className="mt-12 pt-8 border-t border-[var(--border-primary)]/30 flex justify-center">
                <button 
                  onClick={reset}
                  className="px-8 py-4 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] rounded-xl font-ancient font-bold uppercase tracking-widest hover:bg-[var(--accent-primary)]/10 transition-all font-premium"
                >
                  Start New Reading
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <style>{`
        .palm-content h3 { color: var(--accent-primary); font-family: var(--font-ancient); font-weight: 900; text-transform: uppercase; font-size: 1.5rem; margin-top: 3rem; margin-bottom: 1.5rem; letter-spacing: 0.15em; border-left: 4px solid var(--accent-primary); padding-left: 1rem; }
        .palm-content h4 { color: var(--accent-primary); font-family: var(--font-ancient); font-weight: 800; text-transform: uppercase; font-size: 1.1rem; margin-top: 2rem; margin-bottom: 1rem; letter-spacing: 0.1em; }
        .palm-content p { margin-bottom: 1.5rem; opacity: 0.9; }
        .palm-content ul { list-style: none; padding: 0; margin-bottom: 2rem; }
        .palm-content li { position: relative; padding-left: 2rem; margin-bottom: 1rem; background: var(--bg-primary)/30; padding: 1.5rem; padding-left: 3rem; border-radius: 1rem; border: 1px solid var(--border-primary); transition: all 0.3s; }
        .palm-content li:hover { border-color: var(--accent-primary); transform: translateX(5px); }
        .palm-content li::before { content: '✋'; position: absolute; left: 1rem; top: 1.5rem; font-size: 1rem; }
        .palm-content strong { color: var(--accent-primary); font-family: var(--font-ancient); letter-spacing: 0.05em; }
      `}</style>
    </motion.div>
  );
};

export default PalmReader;
