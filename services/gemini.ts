
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { UserIntake, MatchingIntake, SearchSource, Language, UserMode, CityData } from "../types";

// Vedic Horoscope generation
export const generateHoroscope = async (intake: UserIntake, section: string, lang: Language, mode: UserMode = 'SEEKER', seed?: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  const now = new Date().toISOString();
  
  const scholarInstructions = `
    1. EXTREME MATHEMATICAL PRECISION: You MUST calculate planetary positions (Sphuta) with absolute accuracy using Lahiri Ayanamsa. Use the provided Latitude, Longitude, and Timezone for exact calculations.
    2. STRICT INFORMATION ISOLATION: Each section MUST contain ONLY the information relevant to that specific focus area. DO NOT repeat basic birth details, Shadbala, or Shadvarga in other sections unless it is the specific section for that analysis.
    3. JATAKA BIRTH DETAILS: If the focus area is "Birth Analysis" or "menu_details", you MUST start with a comprehensive "Jataka Birth Details" section containing:
        - Name of the Jataka holder, Date of Birth, Time, Place of Birth.
        - Latitude and Longitude.
        - Kalidina (number of days since Kali Yuga start).
        - Sunrise and Sunset times for the day of birth.
        - Samvatsara, Ayana, Ruthu.
        - Masa (both Soura and Chandra Masa), current day of the month, and days remaining to complete the Masa.
        - Udayadi Ghati.
        - Panchanga: Tithi, Vara, Nakshatra, Yoga, Karana.
        - Nakshatra Gata.
        - Janma Shista Varsha (Balance of Dasha at birth).
        - DO NOT include Bhava analysis, Shadvarga, or Shadbala here.
        - Provide the data in a JSON script tag: <script type="application/json">{"type": "birth_details", "details": [{"label": "Name", "value": "...", "category": "Basic"}, {"label": "Tithi", "value": "...", "category": "Panchanga"}]}</script>
    4. 12 HOUSES (BHAVAS) ANALYSIS: If the focus area is "12 Houses (Bhava) Analysis" or "menu_bhava_analysis", provide an EXHAUSTIVE evaluation of all 12 Houses.
        - For EACH house, explain its power/strength in this specific Jataka.
        - Include a relevant Sanskrit Shloka from classical texts (BPHS, Brihat Jataka, or Phaladeepika).
        - Detailed explanation of the house's significance and its strength based on the house lord, aspects, and occupants.
        - DO NOT include birth details, Shadvarga, or Shadbala tables here.
        - Provide the data in a JSON script tag: <script type="application/json">{"type": "bhavaphala", "houses": [{"number": 1, "title": "...", "description": "...", "shloka": "...", "strength": "..."}]}</script>
    5. SHADVARGA: If the focus area is "Shadvarga Strengths" or "menu_shadvarga", provide the planetary positions for D1, D2, D3, D9, D12, and D30 charts.
        - For EACH chart, identify the "Adhipati" (Lord of the Lagna) and discuss their power/strength in that specific divisional chart.
        - DO NOT include Shadbala tables or birth details here.
        - Provide the data in a JSON script tag: <script type="application/json">{"type": "shadvarga", "vargas": {"D1": [...], "D9": [...]}, "lords": {"D1": {"planet": "...", "power": "..."}, "D9": {"planet": "...", "power": "..."}}}</script>
    6. SHADBALA: If the focus area is "Shadbala Analysis" or "menu_shadbala", provide a detailed breakdown of Shadbala (Sthana, Dig, Kaala, Chesta, Naisargika, and Drig bala) using *Brihat Jataka* as the source.
        - Analyze the total strength (Shadbala Pinda) for all 7 planets.
        - DO NOT include divisional charts (Vargas) or birth details here.
        - Provide the data in a JSON script tag: <script type="application/json">{"type": "shadbala", "shadbala": [{"planet": "Sun", "sthana": 120, "dig": 50, ...}]}</script>
    6. EXACT RASHI & NAKSHATRA: Provide the exact Rasi (sign), Nakshatra (constellation), and Pada (quarter) for each planet, especially the Moon (Janma Rasi/Nakshatra).
    7. CLASSICAL TEXTS: Base all analysis EXCLUSIVELY on Brihat Parashara Hora Shastra (BPHS) as the primary authority, supplemented by Brihat Jataka, Prashna Marga, Phaladeepika, and Jataka Phala Saroddhara.
    8. SHLOKA MATRIX: Provide extensive Sanskrit Shlokas (at least 6-8 major ones) in Devanagari script from the referenced texts, prioritizing BPHS. For each shloka, provide a word-by-word grammatical breakdown (Anvaya) and then a deep philosophical and technical interpretation.
    9. CITATIONS: Explicitly cite Brihat Parashara Hora Shastra (BPHS), Brihat Jataka, Prashna Marga, Phaladeepika, and Jataka Phala Saroddhara. Mention the specific chapter (Adhyaya) and verse (Shloka) numbers.
    9. MATHEMATICAL RIGOR: Discuss the specific longitude (Sphuta) of planets down to seconds of arc. Analyze Varga strengths (Shad-varga, Sapta-varga, Dasha-varga). Discuss Bhava Madhya and Bhava Sandhi impacts on planetary results.
    7. CATEGORICAL DETAIL: Provide exhaustive details for Health (Sharira), Wealth (Dhana), Career (Karma), Spirituality (Moksha), and Longevity (Ayus). Use Jaimini Sutras for cross-verification of longevity and career.
    8. YOGA ANALYSIS: Identify and explain at least 7-10 specific Yogas (e.g., Raja Yoga, Dhana Yoga, Parivartana Yoga) with their classical definitions and expected results in this specific chart.
    9. UNIQUENESS: Every analysis must be 100% unique to the native's exact degrees. Never provide generic descriptions.
  `;

  const seekerInstructions = `
    1. EASY TO UNDERSTAND: Use simple, clear language. Avoid difficult astrological terms. Instead of "Malefic", say "Challenging". Instead of "Benefic", say "Helpful".
    2. ACCURATE SOUL MAP: Even for seekers, the Rasi and Nakshatra MUST be mathematically correct.
    3. IMMERSIVE LIFE GUIDANCE: Provide a massive, detailed breakdown of their personality and path in a way that feels like a friendly conversation.
    4. CELESTIAL SCORES: Give a "Celestial Score" out of 100 for different areas: Career Success, Financial Growth, Love Harmony, and Emotional Peace.
    5. DIVINE THEME: Include ONE beautifully explained central Shloka in Devanagari from Brihat Parashara Hora Shastra (BPHS), Phaladeepika, or Brihat Jataka. Explain it as a guiding light for their soul in very simple terms.
    6. RITUALS & HABITS: Provide 3 simple, actionable daily rituals (Pariharas) like specific prayers, colors to wear, or small acts of kindness to align with their stars.
    7. CATEGORICAL DEPTH: Dedicate large sections to: 1. Your Unique Strengths, 2. Overcoming Current Hurdles, 3. The Path to Financial Abundance, 4. Finding True Love.
    8. LIFE PARTNER: If the focus area is "My Character" or "Life Path" or "Love & Marriage" or "Life Partner", you MUST include a detailed "Life Partner" section.
        - Provide ONLY NECESSARY and HIGHLY PERSONALIZED information.
        - Analysis MUST be specific to this particular Jataka (Kundli).
        - Do NOT show generic information.
        - Focus on:
            - Nature and characteristics of the spouse based on the 7th house and its lord.
            - Navamsha (D9) chart significance for marriage.
            - Timing of marriage.
            - Direction and distance of the partner's birthplace.
            - Potential professions and background of the spouse.
        - Ensure consistency: the same Jataka should always receive the same core analysis.
        - DISCLAIMER: At the end of this section, add this line in a big bold letter: "Astrological predictions are based on planetary calculations and indicate possibilities, not guaranteed outcomes."
    9. DAILY FORECAST: If the focus area is "Daily Prediction" or "menu_daily", you MUST provide a long, detailed forecast based on Samhita and Hora.
        - Include sections for: General Outlook, Career & Finance, Health & Wellness, Relationships, Lucky Colors & Numbers, and a specific "Remedy of the Day".
        - The forecast should be at least 400-500 words long.
    10. PANCHANGA: If the focus area is "Panchanga" or "menu_panchanga", you MUST provide a clear HTML table of the day's elements (Tithi, Vara, Nakshatra, Yoga, Karana, Rahu Kala, Gulika Kala, Yamaganda) first, followed by a detailed scholarly explanation.
    11. LIFE TIMELINE: If the focus area is "Life Timeline" or "menu_timeline", ensure the timeline is mathematically accurate and consistent for the same Kundli. Provide a clear dashboard of life phases with scores.
    12. MATCHING: If the focus area is "Matching Analysis" or "menu_matching", include the names of both individuals. Ensure proper spacing and visibility for location selection. The final conclusion MUST have a distinct background color and professional styling.
    13. PERSONALIZED: Ensure the advice feels deeply personal and specific to their birth chart, not generic.
    14. MANGALA DOSHA: Always include a specific section analyzing Mangala Dosha (Mars Affliction). Explain if it exists, its intensity, and simple remedies if needed.
    15. STRICT INFORMATION ISOLATION: Each section MUST contain ONLY the information relevant to that specific focus area. DO NOT repeat basic birth details in other sections.
    16. CONCLUSION: End the entire analysis with a clear, one-line bold conclusion summarizing the core message of the heavens for the native.
  `;

  const prompt = `Perform an EXHAUSTIVE, high-resolution Vedic analysis in ${lang} for ${intake.name}.
  Current Time (for context): ${now}
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
  
  9. NAVAMSHA (D9): If the section is "Navamsha", provide a deep analysis of the D9 chart, its Vargottama planets, and its impact on the native's strength and marriage.
    10. ASHTAKAVARGA: If the section is "Ashtakavarga", provide a detailed table of points (Bindus) for each of the 7 main planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) plus the total (Sarvashtakavarga) across all 12 Rasis.
    11. SHADBALA: If the section is "menu_shadbala", provide a detailed breakdown of Shadbala (Sthana, Dig, Kaala, Chesta, Naisargika, Drig) for all 7 planets.
    12. SHADVARGA: If the section is "menu_shadvarga", provide the planetary positions for D1, D2, D3, D9, D12, and D30 charts. Identify the Adhipati for each.
    13. YOGA ANALYSIS: If the section is "Yoga Analysis", identify and explain at least 15-20 specific Yogas (e.g., Raja Yoga, Dhana Yoga, Parivartana Yoga, Pancha Mahapurusha Yogas, Gaja Kesari, etc.). For EACH yoga, you MUST provide:
        - The relevant Sanskrit Shloka from classical texts.
        - Its definition and its specific impact.
        - A "Yoga Applicability Percentage" (0-100%) based on the strength of the participating planets and the precision of the alignment in this specific chart.
    14. PANCHADHA GRAHA MAITRI: If the section is "Panchadha Graha Maitri", provide a detailed 7x7 matrix showing the five-fold friendship (Adhi Mitra, Mitra, Sama, Shatru, Adhi Shatru) between the 7 main planets (Sun to Saturn). This must be calculated based on both Natural Friendship (Naisargika) and Temporal Friendship (Tatkalika) for this specific chart.
    15. VIMSHOTTARI DASHA: If the section is "Vimshottari", you MUST calculate the Moon's exact longitude at birth to determine the starting Mahadasha and the remaining balance of that dasha. Provide a full sequence of all 9 Mahadashas (Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury, Ketu, Venus) in their correct order starting from the birth dasha. For EACH Mahadasha, you MUST provide all 9 Antardashas (sub-dashas) with their respective start and end dates. Ensure the dates are mathematically consistent with the standard Vimshottari period lengths.
    16. FORMATTING: Use only standard HTML tags: <h3>, <h4>, <p>, <ul>, <li>, <table>, <thead>, <tbody>, <tr>, <th>, <td>. NEVER use markdown (*, #, _, \`).
    17. JSON DATA: For Navamsha, Ashtakavarga, Vimshottari, Shadvarga, and Graha Maitri, provide structured JSON in the <script type="application/json" id="chart-data"> tag.
        - For Navamsha: { "type": "navamsha", "planets": [{"name": "Sun", "rasi": 0, "label_key": "planet_sun"}, ...] }
        - For Ashtakavarga: { "type": "ashtakavarga", "table": [{"planet": "Sun", "points": [4, 5, 3, ...]}, ...] }
        - For Vimshottari: { "type": "vimshottari", "dashas": [{ "planet": "Jupiter", "start": "1990-01-01", "end": "2006-01-01", "antardashas": [{"planet": "Jupiter", "start": "...", "end": "..."}, ...] }] }
        - For Shadvarga: { "type": "shadvarga", "vargas": {"D1": [...], "D2": [...], "D3": [...], "D9": [...], "D12": [...], "D30": [...]}, "lords": {"D1": {"planet": "...", "power": "..."}, ...}}
        - For Shadbala: { "type": "shadbala", "shadbala": [{"planet": "Sun", "sthana": 60, "dig": 30, ...}]}
        - For Graha Maitri: { "type": "grahamaitri", "matrix": [{"planet": "Sun", "relationships": {"Moon": "Adhi Mitra", "Mars": "Mitra", ...}}, ...] }
  14. Tone: ${mode === 'SCHOLAR' ? 'Academic, Traditional, Highly Technical' : 'Nurturing, Deeply Informative, Empathetic, Clear'}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      seed: seed,
      systemInstruction: mode === 'SCHOLAR' 
        ? `You are an elite Siddhantic Astronomer and Astrologer. Respond EXCLUSIVELY in ${lang}. You provide maximum technical density and classical citations. Use Lahiri Ayanamsa and precise mathematical calculations for planetary longitudes (Sphuta). You MUST ensure Rasi and Nakshatra calculations are 100% accurate based on the provided coordinates and time. Use HTML only for the analysis. If the focus is a chart, also provide planetary positions in JSON format within a <script type="application/json" id="chart-data"> tag.` 
        : `You are a warm, highly informative life-guide. Respond EXCLUSIVELY in ${lang}. You explain the cosmos in simple but extremely detailed, practical coaching styles. You MUST ensure Rasi and Nakshatra calculations are 100% accurate. Use HTML only. If the focus is a chart, also provide planetary positions in JSON format within a <script type="application/json" id="chart-data"> tag.`,
    }
  });
  return response.text || '';
};

// Prashna (Horary Astrology) Analysis
export const generatePrashnaAnalysis = async (question: string, pob: string, lang: Language, mode: UserMode = 'SEEKER', lat?: string, lon?: string, tz?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  const now = new Date();
  const prompt = `Perform a high-precision Vedic Prashna (Horary) Analysis:
  Question: "${question}"
  Time of Query: ${now.toLocaleString()}
  Place: ${pob}
  Coordinates: Lat ${lat || 'Unknown'}, Lon ${lon || 'Unknown'}
  Timezone: ${tz || 'Unknown'}
  Language: ${lang}
  MODE: ${mode}

  Instructions:
  1. MATHEMATICAL PRECISION: Calculate the exact planetary positions for the moment of the query using Lahiri Ayanamsa.
  2. RASHI & NAKSHATRA: Identify the exact Arudha Lagna, Udaya Lagna, and the Moon's Rasi and Nakshatra at the time of the query.
  3. PRASHNA MARGA & BRIHAT JATAKA: Use the principles of Prashna Marga, Brihat Jataka, and Shatpanchasika for the analysis.
  4. VERDICT: Provide a clear "Yes/No/Wait" verdict based on the planetary alignments.
  5. DETAILED EXPLANATION:
     ${mode === 'SCHOLAR' 
       ? `
       - Analyze Arudha, Udaya, and Chatra using Prashna Marga. 
       - Use multiple Sanskrit shlokas from Prashna Marga, Brihat Jataka, or Shatpanchasika to justify the verdict. 
       - Discuss Nimittas (omens) and their impact on the query. 
       - Provide a detailed mathematical analysis of the planetary positions.
       - Analyze the relationship between the Lagna Lord and the Karya Lord.
       ` 
       : `
       - Explain the outcome with deep empathy and extensive detail. 
       - Provide a "Soul Advice" section: How should they approach this situation for the best karma? 
       - Use one single shloka from Brihat Jataka or Prashna Marga to offer spiritual strength.
       - Provide 3 actionable spiritual remedies (Pariharas) to improve the outcome.
       - The analysis should be at least 300-400 words long.
       `}
  
  6. FORMATTING: Use only standard HTML tags: <h3>, <h4>, <p>, <ul>, <li>, <table>, <thead>, <tbody>, <tr>, <th>, <td>. NEVER use markdown (*, #, _, \`).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      systemInstruction: mode === 'SCHOLAR'
        ? `You are an elite Prashna (Horary) expert. Respond EXCLUSIVELY in ${lang}. Use high-resolution mathematical calculations and classical citations from Prashna Marga.`
        : `You are a compassionate Vedic Oracle. Respond EXCLUSIVELY in ${lang}. Provide deep, detailed, and practical guidance based on the cosmic moment of the query.`,
    }
  });
  return response.text || '';
};

// Marriage/Compatibility Matching
export const matchKundali = async (data: MatchingIntake, lang: Language, mode: UserMode = 'SEEKER') => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  const now = new Date().toISOString();
  const prompt = `
    Perform a deep compatibility analysis (Ashta Koota Matching) between:
    Bride: ${data.person1.name}, ${data.person1.dob}, ${data.person1.tob} ${data.person1.ampm}, ${data.person1.pob}
    Groom: ${data.person2.name}, ${data.person2.dob}, ${data.person2.tob} ${data.person2.ampm}, ${data.person2.pob}
    Language: ${lang}
    Mode: ${mode}

    CRITICAL INSTRUCTIONS:
    1. Explicitly mention the names of the Bride (${data.person1.name}) and Groom (${data.person2.name}) throughout the analysis.
    2. Provide a detailed breakdown of all 8 Gunas (Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot, Nadi).
    3. Calculate the total score out of 36.
    4. Include Manglik Dosha analysis for both.
    5. Provide a FINAL CONCLUSION in a clearly marked section.
    6. **MANDATORY**: Wrap the final conclusion in a <div class="conclusion-section"> tag.
    7. Format with HTML (h2, h3, p, strong, table).
  `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      systemInstruction: `You are an expert in Vedic compatibility matching (Ashta-Kuta). Respond EXCLUSIVELY in ${lang}. You MUST calculate Rasi and Nakshatra with 100% precision for both individuals using the provided coordinates. Use Lahiri Ayanamsa. Format: HTML only.`
    }
  });
  return response.text || '';
};

// Daily Forecast
export const generateDailyForecastForRasi = async (rasi: string, lang: Language, mode: UserMode = 'SEEKER') => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  const now = new Date().toLocaleString();
  const prompt = `
    Generate a detailed DAILY astrological forecast for the Rasi: ${rasi}.
    Language: ${lang}.
    Mode: ${mode}.
    
    CRITICAL INSTRUCTIONS:
    1. Make the forecast LONG and HIGHLY DETAILED.
    2. Base the analysis on Samhita (Mundane astrology) and Hora (Predictive astrology).
    3. Include sections for:
       - General Outlook (Samhita perspective)
       - Career & Finance (Hora perspective)
       - Health & Wellness
       - Relationships
       - Lucky Colors & Numbers
       - Specific Remedies (Upayas)
    4. Use professional, scholarly tone.
    5. Format with HTML tags (h2, h3, p, strong, ul, li).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      systemInstruction: `You are a Vedic Astrology expert providing daily forecasts based on Gochara (transits). Respond EXCLUSIVELY in ${lang}. You MUST use the current date and time for transit calculations. Format: HTML only.`
    }
  });
  return response.text || '';
};

// Muhurta
export const findMuhurtha = async (event: string, timeframe: string, lang: Language, mode: UserMode = 'SEEKER', pob?: string, lat?: string, lon?: string, tz?: string, performerDetails?: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  const prompt = `
    Find high-precision Muhurta for ${event} in ${lang}.
    Location: ${pob || 'Global'} (${lat || 'N/A'}, ${lon || 'N/A'}, Timezone: ${tz || 'N/A'})
    Timeframe: ${timeframe || 'Next 30 days'}
    MODE: ${mode}
    ${performerDetails ? `Performer Details: ${JSON.stringify(performerDetails)}` : ''}

    CRITICAL INSTRUCTIONS:
    1. ${performerDetails ? 'MANDATORY: Perform Taranukula (Tarabala) calculation based on the performer\'s Janma Nakshatra.' : ''}
    2. Identify the best dates and times within the range.
    3. Explain WHY these times are auspicious (Tithi, Nakshatra, Yoga, Karana, Vara, Lagna).
    4. Describe how rituals are typically performed for this Muhurtha in ${pob} (local traditions).
    5. Provide a clear recommendation.
    6. Format with HTML (h2, h3, p, strong).
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      systemInstruction: `You are a high-precision Muhurta expert. Respond EXCLUSIVELY in ${lang}. Cite classical texts like Muhurta Chintamani. Format: HTML only.`
    }
  });
  return response.text || '';
};

// City Search
export const searchCities = async (input: string): Promise<CityData[]> => {
  if (input.length < 1) return [];
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `List 5 cities matching "${input}". The input could be a city name or a pincode. For each city, provide its full name, latitude, longitude, timezone offset (e.g., "+5:30"), and its primary postal pincode. JSON format only.`,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { 
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            lat: { type: Type.STRING },
            lon: { type: Type.STRING },
            tz: { type: Type.STRING },
            pincode: { type: Type.STRING }
          },
          required: ["name", "lat", "lon", "tz", "pincode"]
        }
      }
    }
  });
  try {
    const data = JSON.parse(response.text || '[]');
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Failed to parse cities", e);
    return [];
  }
};

// Search grounding service
export const fetchGroundingSearch = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
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

// Panchanga Analysis
export const generatePanchanga = async (date: string, time: string, pob: string, lang: Language, mode: UserMode = 'SEEKER', lat?: string, lon?: string, tz?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  const prompt = `
    Perform a high-precision Vedic Panchanga calculation for:
    Date: ${date}
    Time: ${time}
    Place: ${pob}
    Coordinates: Lat ${lat || 'Unknown'}, Lon ${lon || 'Unknown'}
    Timezone: ${tz || 'Unknown'}
    Language: ${lang}
    MODE: ${mode}
  
    CRITICAL INSTRUCTIONS:
    1. TABLE FIRST: You MUST start the response with a clean, well-formatted HTML table showing the 5 elements (Tithi, Vara, Nakshatra, Yoga, Karana) plus Sunrise, Sunset, and Rahu Kala.
    2. EXPLANATION: After the table, provide a detailed scholarly explanation of each element.
    3. Calculate the exact Tithi, Vara, Nakshatra, Yoga, and Karana for the given time and place using Lahiri Ayanamsa.
    4. Calculate Rahu Kala, Gulika Kala, and Yamaghanda Kala precisely for the given location.
    5. Identify any "Dinavishesha" (special significance of the day, festivals, or auspicious/inauspicious yogas like Amrita Siddhi, etc.).
    6. ${mode === 'SCHOLAR' 
      ? 'Provide technical details including the ending moments of Tithi and Nakshatra. Cite classical texts. Discuss the impact of the current Panchanga elements on mundane and spiritual activities.' 
      : 'Explain each element in simple, practical terms. How does today\'s energy affect the user? Provide one simple ritual for the day.'}
    
    Format: HTML tags only. No markdown.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      systemInstruction: `You are a high-precision Vedic Panchanga expert. Respond EXCLUSIVELY in ${lang}. Format: HTML only.`
    }
  });
  return response.text || '';
};

// Life Timeline Dashboard Data
export const generateLifeTimeline = async (intake: UserIntake, lang: Language) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  
  // Create a consistent seed based on birth details to ensure accuracy and consistency for the same Kundli
  const seedStr = `${intake.dob}${intake.tob}${intake.ampm}${intake.pob}${intake.lat}${intake.lon}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const consistentSeed = Math.abs(hash);

  const prompt = `
    Generate a detailed Life Timeline (Vimshottari Dasha analysis) for:
    Name: ${intake.name}
    DOB: ${intake.dob}
    TOB: ${intake.tob} ${intake.ampm}
    POB: ${intake.pob}
    Coordinates: ${intake.lat}, ${intake.lon}
    Timezone: ${intake.tz}
    Language: ${lang}

    CRITICAL INSTRUCTIONS:
    1. Ensure HIGH ACCURACY in Dasha calculations.
    2. The timeline MUST be consistent for the same Kundli.
    3. Provide a chronological breakdown of major life periods (Mahadashas) and significant Antardashas.
    4. For each point, include:
       - year: The year or age.
       - score: A general "luck/strength" score from 0 to 100.
       - category: One of "Good", "Risk", "Career", "Marriage", "Investment".
       - description: A short description in ${lang}.
    5. Format: JSON only.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      seed: 42,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            year: { type: Type.NUMBER },
            score: { type: Type.NUMBER },
            category: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["year", "score", "category", "description"]
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse timeline data", e);
    return [];
  }
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

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, channels: number) {
  const float32 = new Float32Array(data.buffer);
  const buffer = ctx.createBuffer(channels, float32.length / channels, sampleRate);
  for (let i = 0; i < channels; i++) {
    const channelData = buffer.getChannelData(i);
    for (let j = 0; j < channelData.length; j++) {
      channelData[j] = float32[j * channels + i];
    }
  }
  return buffer;
}

// Generate an eye-catching image for a Muhurta
export const generateMuhurthaImage = async (event: string, description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  const prompt = `A beautiful, eye-catching, high-quality Vedic-themed illustration for a Muhurta (auspicious time) for: ${event}. 
  Description context: ${description}. 
  The image should be spiritual, vibrant, and traditional, featuring elements like mandalas, celestial bodies, or ritualistic items. 
  Style: Traditional Indian Art / Digital Painting.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "1K"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
