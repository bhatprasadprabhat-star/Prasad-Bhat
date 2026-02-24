
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenAI, Modality, Blob, LiveServerMessage } from '@google/genai';
import { encode, decode, decodeAudioData } from '../services/gemini';

const LiveAstrologer: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Pranama');
  const [transcription, setTranscription] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  const currentTranscriptionRef = useRef('');

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outAudioContextRef.current) {
      outAudioContextRef.current.close();
      outAudioContextRef.current = null;
    }
    setIsActive(false);
    setStatus('Dhanyavaada');
  };

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inCtx;
      outAudioContextRef.current = outCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('Guruji is listening...');
            const source = inCtx.createMediaStreamSource(stream);
            const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              currentTranscriptionRef.current += text;
            }

            if (message.serverContent?.turnComplete) {
              setTranscription(prev => [...prev, "Guruji: " + currentTranscriptionRef.current]);
              currentTranscriptionRef.current = '';
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outAudioContextRef.current) {
              const ctx = outAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const src = ctx.createBufferSource();
              src.buffer = buffer;
              src.connect(ctx.destination);
              src.addEventListener('ended', () => sourcesRef.current.delete(src));
              src.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(src);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Session Error', e);
            setStatus('Error occurred');
          },
          onclose: () => {
            setStatus('Disconnected');
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: 'You are Guruji, a wise and warm Vedic astrologer. You offer simple but deep guidance. Talk to the user as if you are in a sacred space. Keep answers concise and spiritual.'
        }
      });

      sessionRef.current = await sessionPromise;
      setIsActive(true);
    } catch (err) {
      console.error(err);
      setStatus('Failed to Connect');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 p-4 sm:p-10 h-full overflow-y-auto">
      <div className="relative">
        <div className={`w-20 h-20 sm:w-36 sm:h-36 rounded-full border-4 sm:border-8 flex items-center justify-center transition-all duration-500 shadow-2xl overflow-hidden ${isActive ? 'border-[#431407] scale-105' : 'border-slate-300'}`}>
          <img 
            src="https://picsum.photos/seed/sanyasi/200/200" 
            alt="Ancient Sanyasi" 
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-60 grayscale'}`}
          />
        </div>
        {isActive && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-2 border-4 border-[#D4AF37] rounded-full pointer-events-none"
          />
        )}
      </div>
      
      <div className="text-center">
        <h3 className="text-xl sm:text-3xl font-black text-[#431407] uppercase tracking-[0.1em] astrological-font leading-tight">Ask Help for Guruji</h3>
        <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#431407] text-[#D4AF37] text-[10px] sm:text-[11px] font-black uppercase tracking-widest shadow-md">
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`}></span>
          {status}
        </div>
      </div>

      <div className="w-full">
        {!isActive ? (
          <button onClick={startSession} className="w-full py-4.5 bg-[#431407] text-[#D4AF37] font-black rounded-3xl shadow-2xl uppercase tracking-[0.15em] text-xs sm:text-sm active:brightness-125 transition-all">Invoke Guruji</button>
        ) : (
          <button onClick={stopSession} className="w-full py-4.5 bg-white border-2 border-[#431407] text-[#431407] font-black rounded-3xl shadow-md uppercase tracking-[0.15em] text-xs sm:text-sm active:bg-slate-50 transition-all">Pranama (End)</button>
        )}
      </div>

      <div className="w-full flex flex-wrap gap-2 justify-center">
        {['Career Guidance', 'Love & Marriage', 'Health & Energy', 'Spiritual Path'].map((topic) => (
          <button 
            key={topic}
            onClick={() => {
              if (isActive && sessionRef.current) {
                // In a real scenario, we might send this as text if the API supports it, 
                // or just encourage the user to speak it.
                // For now, we'll just show a toast or a hint.
                setTranscription(prev => [...prev, "You (Hint): I want help with " + topic]);
              } else if (!isActive) {
                startSession();
              }
            }}
            className="px-3 py-1.5 bg-white/50 border border-[#431407]/20 rounded-full text-[10px] sm:text-xs font-bold text-[#431407] hover:bg-[#431407] hover:text-[#D4AF37] transition-all shadow-sm"
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="w-full flex-1 min-h-[160px] overflow-y-auto bg-white/70 border-2 border-[#431407]/10 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-inner flex flex-col gap-4">
        {transcription.length === 0 && (
          <div className="h-full flex items-center justify-center opacity-60 italic text-sm sm:text-lg text-[#431407] px-4 text-center leading-relaxed font-serif">
            "Seek wisdom and the stars shall answer through Guruji."
          </div>
        )}
        {transcription.map((t, i) => (
          <div key={i} className="text-xs sm:text-base border-l-4 border-[#D4AF37] pl-4 py-3 font-serif text-[#431407] bg-white border border-[#431407]/5 rounded-r-xl shadow-md leading-relaxed font-bold">
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveAstrologer;
