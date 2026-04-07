
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Language, UserMode, UserIntake } from '../types';
import { TRANSLATIONS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GurujiChatProps {
  lang: Language;
  mode: UserMode;
  intake?: UserIntake;
}

const GurujiChat: React.FC<GurujiChatProps> = ({ lang, mode, intake }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
      
      const systemInstruction = mode === 'SCHOLAR' 
        ? `You are a world-class Vedic Astrologer and Siddhantic Scholar named "Guruji". 
           Your knowledge is based on Brihat Parashara Hora Shastra, Brihat Jataka, and Phaladeepika.
           You provide highly technical, accurate, and scholarly answers in ${lang}.
           Use Sanskrit terms frequently but explain them. Be authoritative yet humble.
           ${intake?.name ? `The user's name is ${intake.name}, born on ${intake.dob} at ${intake.tob} in ${intake.pob}. Use this data for all personalized calculations. Current Location: ${intake.pob}.` : 'If asked about a specific chart, ask for birth details if not provided.'}
           Always provide the most accurate and traditional Vedic perspective.
           If the user asks for their horoscope or specific planetary positions, perform the calculations based on their birth data if available.
           Use the googleSearch tool to get current planetary transits or any real-time astrological data if needed for accuracy.
           CRITICAL: DO NOT repeat basic birth details in every response unless specifically asked. Focus on answering the user's specific query.`
        : `You are a wise, compassionate, and highly accurate Vedic Life Guide named "Guruji".
           You provide simple, clear, and deeply insightful life guidance in ${lang}.
           Your tone is warm, encouraging, and spiritual. Avoid overly technical jargon.
           ${intake?.name ? `The user's name is ${intake.name}, born on ${intake.dob} at ${intake.tob} in ${intake.pob}. Use this data to provide personalized life guidance. Current Location: ${intake.pob}.` : ''}
           Focus on practical life advice, emotional well-being, and spiritual growth.
           Always provide accurate answers based on Vedic wisdom.
           If the user asks about their future or personality, use their birth data to provide specific insights.
           Use the googleSearch tool to get current planetary transits or any real-time astrological data if needed for accuracy.
           CRITICAL: DO NOT repeat basic birth details in every response unless specifically asked. Focus on answering the user's specific query.`;

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        },
        history: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }))
      });

      const response = await chat.sendMessage({ message: input });

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.text || (t.error_guruji || "I am reflecting on the heavens, please try again.") 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Guruji Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: t.error_guruji || "The cosmic connection is weak. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fffbeb]">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
            <Sparkles size={48} className="text-[#D4AF37] animate-pulse" />
            <p className="text-[#451a03] font-serif italic max-w-xs">
              {t.guruji_welcome || "Ask Guruji about your life path, planetary transits, or any spiritual guidance."}
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-md ${
              m.role === 'user' 
                ? 'bg-[#451a03] text-[#D4AF37] rounded-tr-none' 
                : 'bg-white text-[#451a03] border border-[#D4AF37]/20 rounded-tl-none'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-60 text-[10px] font-black uppercase tracking-widest">
                {m.role === 'user' ? <User size={12} /> : <Sparkles size={12} />}
                {m.role === 'user' ? (t.you || 'You') : (t.guruji || 'Guruji')}
              </div>
              <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-1 text-inherit">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-md border border-[#D4AF37]/20 rounded-tl-none flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
              <span className="text-xs font-bold text-[#451a03]/60 uppercase tracking-widest animate-pulse">
                {t.guruji_thinking || "Guruji is consulting the stars..."}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-[#D4AF37]/20">
        <div className="relative flex items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.ask_guruji_placeholder || "Ask your question..."}
            className="w-full bg-amber-50/50 border-2 border-[#D4AF37]/30 rounded-full py-3 px-6 pr-14 text-[#451a03] font-medium focus:border-[#D4AF37] outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-[#451a03] text-[#D4AF37] rounded-full hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GurujiChat;
