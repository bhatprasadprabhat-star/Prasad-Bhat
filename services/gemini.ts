
import { GoogleGenAI, Type } from "@google/genai";
import { UserIntake, MatchingIntake, SearchSource, Language, UserMode } from "../types";

// Vedic Horoscope generation
export const generateHoroscope = async (intake: UserIntake, section: string, lang: Language, mode: UserMode = 'SEEKER') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const scholarInstructions = `
    1. EXTREME SCHOLARLY DENSITY: Base all analysis on Ketaki Grahaganitam and Siddhanta Shiromani.
    2. SHLOKA MATRIX: Provide extensive Sanskrit Shlokas (at least 3-4 major ones) in Devanagari. Explain their technical nuances, including exceptions (Apavada) and specific planetary strengths (Shadbala/Vimshopaka).
    3. CITATIONS: Reference Brihat Jataka, Phaladeepika, Saravali, and Hora Ratnam.
    4. MATHEMATICAL RIGOR: Discuss the specific longitude (Sphuta) of planets and how they interact with house cusps (Bhava Madhya/Sandhi).
    5. CATEGORICAL DETAIL: Provide exhaustive details for Health (Sharira), Wealth (Dhana), Career (Karma), and Spirituality (Moksha).
  `;

  const seekerInstructions = `
    1. IMMERSIVE LIFE GUIDANCE: Provide a massive, detailed breakdown of their personality and path.
    2. CELESTIAL SCORES: Give a "Celestial Score" out of 100 for different areas: Career Success, Financial Growth, Love Harmony, and Emotional Peace.
    3. DIVINE THEME: Include ONE beautifully explained central Shloka in Devanagari. Explain it as a guiding light for their soul.
    4. RITUALS & HABITS: Provide 3 simple, actionable daily rituals (Pariharas) like specific prayers, colors to wear, or small acts of kindness to align with their stars.
    5. CATEGORICAL DEPTH: Dedicate large sections to: 1. Your Unique Strengths, 2. Overcoming Current Hurdles, 3. The Path to Financial Abundance, 4. Finding True Love.
  `;

  const prompt = `Perform an EXHAUSTIVE, high-resolution Vedic analysis in ${lang} for ${intake.name}.
  Birth Details:
  Date: ${intake.dob}
  Time: ${intake.tob}
  Location: ${intake.pob}
  Coordinates: Lat ${intake.lat || 'Unknown'}, Lon ${intake.lon || 'Unknown'}
  Timezone: ${intake.tz || 'Unknown'}
  
  Focus Area: "${section}".
  
  PATH TYPE: ${mode === 'SCHOLAR' ? 'ASTROLOGER / SIDDHANTIC SCHOLAR' : 'NORMAL USER / SPIRITUAL SEEKER'}
  
  Core Instructions:
  ${mode === 'SCHOLAR' ? scholarInstructions : seekerInstructions}
  
  6. FORMATTING: Use only standard HTML tags: <h3>, <h4>, <p>, <ul>, <li>. NEVER use markdown (*, #, _, \`).
  7. Tone: ${mode === 'SCHOLAR' ? 'Academic, Traditional, Highly Technical' : 'Nurturing, Deeply Informative, Empathetic, Clear'}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: mode === 'SCHOLAR' 
        ? `You are an elite Siddhantic Astronomer and Astrologer. You provide maximum technical density and classical citations. Use Lahiri Ayanamsa and precise mathematical calculations for planetary longitudes (Sphuta). Use HTML only for the analysis. If the focus is a chart, also provide planetary positions in JSON format within a <script type="application/json" id="chart-data"> tag.` 
        : `You are a warm, highly informative life-guide. You explain the cosmos in simple but extremely detailed, practical coaching styles. Use HTML only. If the focus is a chart, also provide planetary positions in JSON format within a <script type="application/json" id="chart-data"> tag.`,
    }
  });
  return response.text || '';
};

// Prashna (Horary Astrology) Analysis
export const generatePrashnaAnalysis = async (question: string, pob: string, lang: Language, mode: UserMode = 'SEEKER') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const now = new Date();
  const prompt = `Perform a high-precision Vedic Prashna Analysis:
  Question: "${question}"
  Time: ${now.toLocaleString()}, Place: ${pob}, Language: ${lang}
  MODE: ${mode}

  Instructions:
  ${mode === 'SCHOLAR' 
    ? 'Analyze Arudha, Udaya, and Chatra using Prashna Marga. Use multiple shlokas to justify the verdict. Discuss Nimittas (omens) if relevant.' 
    : 'Explain the outcome with deep empathy and extensive detail. Provide a "Soul Advice" section. How should they approach this situation for the best karma? Use one single shloka to offer spiritual strength.'}
  
  Format: HTML tags only. No markdown.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: `You are a high-precision Vedic Prashna expert. Use Lahiri Ayanamsa. Format: HTML only.`
    }
  });
  return response.text || '';
};

// Marriage/Compatibility Matching
export const matchKundali = async (data: MatchingIntake, lang: Language, mode: UserMode = 'SEEKER') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Comprehensive, high-detail Ashta-Kuta Match for ${data.person1.name} & ${data.person2.name} in ${lang}.
  MODE: ${mode}
  
  ${mode === 'SCHOLAR' 
    ? 'Provide a deep technical matrix of all 8 Kutas with individual shlokas for Nadi, Bhakoot, and Gana. Analyze Kuja Dosha with classical exceptions and cancellations.' 
    : 'Detailed Harmony Analysis: Explain the "Divine Vibe" between these two. Categorize compatibility by: 1. Financial Growth Together, 2. Emotional Connection, 3. Conflict Resolution Style, 4. Spiritual Alignment. Use one single shloka about sacred union.'}
  
  Format: HTML only. No markdown.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: `You are an expert in Vedic compatibility matching (Ashta-Kuta). Use Lahiri Ayanamsa. Format: HTML only.`
    }
  });
  return response.text || '';
};

// Daily Forecast
export const generateDailyForecastForRasi = async (rasi: string, lang: Language, mode: UserMode = 'SEEKER') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate an EXTREMELY INFORMATIVE daily forecast for ${rasi} in ${lang}.
  MODE: ${mode}
  
  ${mode === 'SCHOLAR' 
    ? 'Detail the Gochara positions of Rahu, Saturn, and Jupiter with specific Shlokas from Phaladeepika regarding transits. Discuss Vedhas and Latta effects.' 
    : 'In-Depth Energy Report: 1. Overall Vibe (1-10), 2. Career & Money Focus, 3. Relationships & Communication, 4. Health & Energy levels. Provide 3 specific tasks to "Win the Day". Include only one simple Shloka for peace.'}
  
  Format: HTML only.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: `You are a Vedic Astrology expert providing daily forecasts based on Gochara (transits). Format: HTML only.`
    }
  });
  return response.text || '';
};

// Muhurta
export const findMuhurtha = async (event: string, timeframe: string, lang: Language, mode: UserMode = 'SEEKER') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Find high-precision Muhurta for ${event} in ${lang}.
  MODE: ${mode}
  ${mode === 'SCHOLAR' 
    ? 'Check for Tithi, Vara, Nakshatra, Yoga, Karana, Tara Bala, and Chandra Bala. Cite Muhurta Chintamani with multiple shlokas.' 
    : 'Provide a very clear "Lucky Window" list. Rank timings as "Auspicious", "Good", and "Neutral". Explain why these times work for ${event} in very friendly, descriptive terms. Use one shloka for success.'}
  Format: HTML.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: `You are a high-precision Muhurta expert. Cite classical texts like Muhurta Chintamani. Format: HTML only.`
    }
  });
  return response.text || '';
};

// City Search
export const searchCities = async (input: string): Promise<CityData[]> => {
  if (input.length < 3) return [];
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `List 5 cities matching "${input}". For each city, provide its full name, latitude, longitude, and timezone offset (e.g., "+5:30"). JSON format only.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { 
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            lat: { type: Type.STRING },
            lon: { type: Type.STRING },
            tz: { type: Type.STRING }
          },
          required: ["name", "lat", "lon", "tz"]
        }
      }
    }
  });
  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};

// Search grounding service
export const fetchGroundingSearch = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: { tools: [{ googleSearch: {} }] },
  });
  
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources: SearchSource[] = chunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title || 'Source',
      uri: chunk.web.uri || '',
    })).filter((s: SearchSource) => s.uri);

  return { text: response.text || '', sources };
};

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
