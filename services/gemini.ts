
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { UserIntake, MatchingIntake, SearchSource, Language, UserMode, CityData } from "../types";
import { astroCache } from "./cache";

// Vedic Horoscope generation
export const generateHoroscope = async (intake: UserIntake, section: string, lang: Language, mode: UserMode = 'SEEKER', seed?: number) => {
  const cacheKey = `horoscope_${section}_${lang}_${mode}_${intake.dob}_${intake.tob}_${intake.pob}_${seed || ''}`;
  const cached = astroCache.get<string>(cacheKey);
  if (cached) return cached;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  const now = new Date().toISOString();
  
  const scholarInstructions = `
    1. EXTREME MATHEMATICAL PRECISION: You MUST calculate planetary positions (Sphuta) with absolute accuracy using Lahiri Ayanamsa. Use the provided Latitude, Longitude, and Timezone for exact calculations.
    2. DEEP SHASTRIYA KNOWLEDGE: This section is for professional astrologers. Provide an EXHAUSTIVE and high-density technical analysis. Use terms like "Adhipati", "Uchcha", "Neecha", "Vargottama", "Digbala", "Sthana Bala", "Drishti", etc., with deep explanation of their combined effects.
    3. CLASSICAL TEXTS: Base all analysis EXCLUSIVELY on Brihat Parashara Hora Shastra (BPHS), Brihat Jataka, Prashna Marga, and Phaladeepika. Cite the specific chapter (Adhyaya) and verse (Shloka) numbers for EVERY major observation.
    4. SANSKRIT SHLOKAS: Provide extensive Sanskrit Shlokas (at least 10-12 major ones) in Devanagari script. For each shloka, provide a word-by-word grammatical breakdown (Anvaya), a literal translation, and then a multi-paragraph deep technical interpretation.
    5. STRICT INFORMATION ISOLATION: Each section MUST contain ONLY the information relevant to that specific focus area. DO NOT repeat general birth details (like Rasi, Nakshatra, Lagna) or basic planetary positions in every section. ONLY include them in the "Birth Analysis" or "Basic Details" sections. For other sections, focus EXCLUSIVELY on the technical depth of that specific topic (e.g., only Shadbala in the Shadbala section).
    6. JATAKA BIRTH DETAILS: If the focus area is "Birth Analysis" or "menu_details", you MUST start with a comprehensive "Jataka Birth Details" section.
        You MUST include a JSON script tag with type "birth_details" containing EXACTLY these fields in these categories:
        Category "Personal Details":
        - Name
        - Date
        - Time
        - Birth Place
        - Latitude
        - Longitude
        Category "Panchanga & Time Details":
        - Kalidina
        - Sunrise (Sooryodaya)
        - Sunset (Sooryasta)
        - Udayadi Ghati
        - Tithi
        - Vara
        - Yoga
        - Nakshatra
        - Karana
        - Masa (Chandra)
        - Masa (Soorya)
        - Rutu
        - Ayana
        - Samvatsara
        Category "Dasha & Nakshatra Calculations":
        - Nakshatra Gata
        - Nakshatra Shista
        - Janma Dasha
        - Janma Dasha Shista
        Example: <script type="application/json">{"type": "birth_details", "details": [{"label": "Name", "value": "...", "category": "Personal Details"}, {"label": "Kalidina", "value": "...", "category": "Panchanga & Time Details"}]}</script>
        Additionally, provide a multi-page equivalent of technical data including Kalidina, Ruthu, Masa details, Udayadi Ghati, Nakshatra Gata, and Janma Shista Varsha.
        IMPORTANT: For "Birth Analysis" (menu_details) in Scholar mode, you MUST provide the JSON script tag with type "birth_details" as the ONLY content of your response. DO NOT provide any text analysis, paragraphs, summaries, or descriptions. DO NOT wrap the script tag in markdown code blocks. The response should contain ONLY the <script> tag.
        - "Life Partner" (LIFE_PARTNER): Provide an EXHAUSTIVE technical analysis of the native's marriage and partnership prospects.
            - Analyze the 7th House, its Lord, and the Venus (for men) or Jupiter (for women) placement.
            - Discuss the influence of the Navamsha (D9) chart on marriage stability and the partner's nature.
            - Identify specific Yogas related to marriage (e.g., Vivaha Sukha Yoga, Kuja Dosha impacts).
            - Cite specific Shlokas from BPHS or Phaladeepika regarding the partner's physical traits, character, and family background.
            - Total output should be at least 2500 words.
        - "Character & Personality" (menu_character): Provide an EXHAUSTIVE analysis of the native's character based on Hora Shastra.
            - Identify their "Character Type" (e.g., Satvic, Rajasic, Tamasic) and explain it deeply.
            - Analyze the influence of the Lagna Lord, Moon, and Sun on their personality.
            - Discuss their hidden strengths, weaknesses, and core motivations.
            - Cite specific Shlokas from BPHS or Saravali regarding their physical and mental traits.
            - Total output should be at least 2000 words.
        - "Numerology Analysis" (menu_numerology): Provide an EXHAUSTIVE and technical analysis of the native's numbers.
            - Calculate and explain the Moolank (Birth Number), Bhagyank (Destiny Number), and Namank (Name Number).
            - Analyze the relationship between these numbers and their ruling planets.
            - Discuss the impact of these numbers on their personality, career, and health.
            - Provide a detailed "Loshu Grid" analysis with its implications.
            - Provide the Loshu Grid data in a JSON script tag: <script type="application/json">{"type": "loshu_grid", "grid": [4, 9, 2, 3, 5, 7, 8, 1, 6], "present": [4, 9, 5, 1]}</script> (where "present" are the numbers found in the native's birth date).
            - Total output should be at least 1500 words.
    7. 12 HOUSES (BHAVAS) ANALYSIS: If the focus area is "12 Houses (Bhava) Analysis" or "menu_bhava_analysis", provide an EXHAUSTIVE evaluation of all 12 Houses.
        - The analysis MUST be deeply rooted in the principles of **Brihat Jataka**, **Prashna Marga**, and **Brihat Parashara Hora Shastra (BPHS)**.
        - For EACH house, provide at least 10-12 paragraphs of analysis, citing specific principles and rules from these classical texts.
        - **MANDATORY**: Include the specific **Classical Shloka** (in Devanagari script) that defines the **Significations (Karakatwas)** of that house (i.e., what things are to be considered from that house) from BPHS or Brihat Jataka. This shloka MUST be provided in the JSON data as well.
        - Detailed explanation of the house's significance, its lord's placement, aspects received, and the strength of its occupants based on Shastriya logic.
        - Provide the data in a JSON script tag: <script type="application/json">{"type": "bhavaphala", "planets": [{"name": "Sun", "rasi": 0, "degree": 15.5, "label_key": "planet_sun"}, ...], "houses": [{"number": 1, "title": "...", "description": "...", "shloka": "...", "strength": "..."}]}</script>
        - The "planets" array MUST contain the Bhava Chalit (Bhava Kundli) positions.
        - Total output should be at least 5000-6000 words.
    8. SHADVARGA: If the focus area is "Shadvarga Strengths" or "menu_shadvarga", provide the planetary positions for D1, D2, D3, D9, D12, and D30 charts.
        - Provide a comprehensive "Shadvarga Table" analysis.
        - For EACH chart, provide a deep technical analysis of the Lagna Lord and planetary placements.
        - Discuss the "Varga-Bala" (strength in divisions) and identify if any planet is in "Vargottama" (same sign in D1 and D9).
        - Total word count for Shadvarga analysis should be at least 3000-4000 words.
    9. SHADBALA: If the focus area is "Shadbala Analysis" or "menu_shadbala", provide a detailed breakdown of Shadbala (Sthana, Dig, Kaala, Chesta, Naisargika, and Drig bala).
        - Analyze the total strength (Shadbala Pinda) for all 7 planets with multi-paragraph commentary on each planet's functional capability.
    10. YOGA ANALYSIS: Identify and explain at least 25-30 specific Yogas. For each, provide the classical definition, the shloka, and a detailed analysis of how it manifests in this native's life.
    11. NAVAMSHA ANALYSIS: If the focus area is "Navamsha" or "menu_navamsha", you MUST provide the planetary positions for the D9 chart.
        - IMPORTANT: For "Navamsha" (menu_navamsha) in Scholar mode, you MUST provide the JSON script tag with type "chart" as the ONLY content of your response. DO NOT provide any text analysis, paragraphs, summaries, or descriptions. DO NOT wrap the script tag in markdown code blocks. The response should contain ONLY the <script> tag.
    12. VIMSHOTTARI DASHA: If the focus area is "Vimshottari" or "menu_dasha", provide a detailed calculation of all 9 Mahadashas and their respective Antardashas.
        - You MUST include a JSON script tag with type "dasha_data" containing the full Vimshottari Dasha sequence.
        - Structure: <script type="application/json">{"type": "dasha_data", "dashas": [{"planet": "Ketu", "start": "YYYY-MM-DD", "end": "YYYY-MM-DD", "duration": 7, "antardashas": [{"planet": "Ketu", "start": "...", "end": "..."}, ...]}]}</script>
        - Provide a deep technical analysis of the current Mahadasha and Antardasha, explaining their effects based on the planet's placement, lordship, and strength in the chart.
        - Total output should be at least 3000 words.
    13. UNIQUENESS: Every analysis must be 100% unique to the native's exact degrees. Never provide generic descriptions. The total output should be extremely long and detailed (at least 2000-3000 words if the section allows).
    14. DAILY FORECAST: If the focus area is "Daily Prediction" or "menu_daily", you MUST provide an EXHAUSTIVE technical forecast (at least 2500 words).
        - Analyze the Gochara (transits) of all 9 planets relative to the native's Janma Rasi and Lagna.
        - Discuss Vedha, Latta, and other transit complexities.
        - Provide a technical hourly breakdown based on Hora and Choghadiya.
        - Cite specific Shlokas for the day's planetary configurations.
  `;

  const seekerInstructions = `
    1. EASY TO UNDERSTAND: Use simple, clear language. Avoid difficult astrological terms. Instead of "Malefic", say "Challenging". Instead of "Benefic", say "Helpful".
    2. ACCURATE SOUL MAP: Even for seekers, the Rasi and Nakshatra MUST be mathematically correct.
    3. IMMERSIVE LIFE GUIDANCE: Provide a MASSIVE, multi-page detailed breakdown of their personality and path. It should feel like a deep, 1-on-1 coaching session with a wise mentor.
    4. CELESTIAL SCORES: Give a "Celestial Score" out of 100 for different areas: Career Success, Financial Growth, Love Harmony, and Emotional Peace.
    5. DIVINE THEME: Include at least 3 beautifully explained central Shlokas in Devanagari. Explain them as guiding lights for their soul in very simple, inspiring terms.
    6. RITUALS & HABITS: Provide 5-7 simple, actionable daily rituals (Pariharas).
    7. CATEGORICAL DEPTH: Dedicate LARGE, multi-paragraph sections to: 1. Your Unique Strengths, 2. Overcoming Current Hurdles, 3. The Path to Financial Abundance, 4. Finding True Love, 5. Your Spiritual Purpose.
    8. LIFE PARTNER: If relevant, include a detailed "Life Partner" section with at least 500 words of personalized analysis.
    9. DAILY FORECAST: If the focus area is "Daily Prediction" or "menu_daily", you MUST provide an EXTREMELY long and exhaustive forecast (at least 2000-2500 words).
       - Provide a detailed hourly breakdown of the day's energy.
       - Analyze the impact of current transits of all 9 planets on the native's Rasi.
       - Include specific advice for Career, Finance, Health, Love, and Family.
       - Provide 5-7 personalized remedies and 3-5 "Celestial Life Hacks" for the day.
    10. PANCHANGA: If the focus area is "Panchanga" or "menu_panchanga", provide a clear HTML table followed by a 1000-word detailed explanation.
    11. LIFE TIMELINE: Provide a clear dashboard of life phases with scores and at least 2-3 paragraphs of description for each major phase.
    12. MATCHING: Provide an exhaustive compatibility analysis (at least 1500 words).
    13. PERSONALIZED: Ensure the advice feels deeply personal and specific to their birth chart, not generic.
    14. MANGALA DOSHA: Always include a specific section analyzing Mangala Dosha (Mars Affliction) with at least 300 words of explanation.
    15. STRICT INFORMATION ISOLATION: Each section MUST contain ONLY the information relevant to that specific focus area. DO NOT repeat general birth details (like Rasi, Nakshatra, Lagna) in every section. Focus EXCLUSIVELY on the life guidance related to that specific topic (e.g., only Career in the Career section).
    16. SECTION SPECIFIC GUIDANCE (SEEKER):
        - "Basic Birth Details" (menu_basic_details): Provide a massive, warm summary (at least 600 words) of their birth chart (Rasi, Nakshatra, Lagna) and what it means for their soul's purpose.
          You MUST include a JSON script tag with type "birth_details" containing EXACTLY these fields in these categories:
          Category "Personal Details":
          - Name
          - Date
          - Time
          - Birth Place
          - Birth Star (Nakshatra)
          - Birth Rashi
          Category "Panchanga & Time Details":
          - Sooryodaya (Sunrise)
          - Sooryasta (Sunset)
          - Yoga
          - Karana
          - Masa (Chandra/Soorya)
          - Paksha
          - Ayana
          - Samvatsara
          - Year
          Example: <script type="application/json">{"type": "birth_details", "details": [{"label": "Name", "value": "...", "category": "Personal Details"}, {"label": "Sooryodaya", "value": "...", "category": "Panchanga & Time Details"}]}</script>
        - "Yoga Analysis" (menu_yoga): Identify 5-7 most powerful Yogas. Explain them as "Celestial Blessings" with at least 2 paragraphs each.
        - "Career & Success" (menu_career): Provide a 1000-word deep dive into their professional path.
        - "Health & Vitality" (menu_health): Provide a 1000-word deep dive into their physical and mental well-being.
        - "Wealth & Finance" (menu_money): Provide a 1000-word deep dive into their financial potential.
        - "Planetary Transits" (menu_transit): Provide a 1000-word deep dive into how current transits are affecting them.
        - "Dasha Effects" (menu_dasha_effect): Provide a 1000-word deep dive into their current life period.
        - "Sade Sati Analysis" (menu_sade_sati): Analyze the current position of Saturn relative to their Moon. Explain the 7.5-year cycle, which phase they are in (Rising, Peak, or Setting), and provide specific emotional and practical management strategies.
        - "Gemstones & Rudraksha" (menu_gemstones): Recommend specific gemstones (Ratna) and Rudraksha beads based on their Lagna and planetary strengths. Explain the benefits, how to wear them, and the best day/time for activation.
        - "Nakshatra Secrets" (menu_nakshatra): Deep dive into their Janma Nakshatra. Explain its deity, symbol, animal, and "hidden" personality traits that most people don't know.
        - "Dosha Check" (menu_doshas): Analyze for Kalsarp Dosha, Pitra Dosha, and other major ancestral or karmic blocks. Provide simple, non-scary explanations and practical remedies.
        - "Character & Personality" (menu_character): Provide a deep, warm analysis of their character.
            - Identify their "Soul Archetype" and "Character Type" (Satvic, Rajasic, or Tamasic).
            - Explain how their personality is shaped by the stars and the elements.
            - Provide "Celestial Life Hacks" for their personality type.
            - Total output should be at least 1500 words.
        - "Life Partner" (LIFE_PARTNER): Provide an EXTREMELY long and detailed analysis of the native's marriage and life partner (at least 2000 words).
            - Describe the partner's physical appearance, personality, and family background in simple terms.
            - Discuss the timing of marriage and the overall harmony in the relationship.
            - Provide 5-7 simple rituals for a happy married life.
            - Include a "Soul Connection Score" out of 100.
        - "Numerology Analysis" (menu_numerology): Provide a warm and detailed guide to their numbers.
            - Explain their "Soul Number" (Moolank) and "Destiny Number" (Bhagyank) in simple terms.
            - Provide "Lucky Colors", "Lucky Days", and "Lucky Numbers".
            - Discuss their compatibility with other numbers.
            - Provide practical "Numerology Hacks" for success.
            - Provide the Loshu Grid data in a JSON script tag: <script type="application/json">{"type": "loshu_grid", "grid": [4, 9, 2, 3, 5, 7, 8, 1, 6], "present": [4, 9, 5, 1]}</script> (where "present" are the numbers found in the native's birth date).
            - Total output should be at least 1200 words.
    17. COMPETITIVE EDGE: To compete with top astrology apps, you MUST include:
        - "Celestial Life Hacks": 3-5 unconventional tips based on their chart (e.g., "Best time of day to make big decisions", "Type of food that aligns with your energy").
        - "Soul Archetype": Give them a unique, catchy name for their personality type (e.g., "The Visionary Architect", "The Compassionate Healer").
        - "Hidden Talents": Identify 2-3 skills they might have but haven't fully explored yet.
    18. CONCLUSION: End the entire analysis with a clear, one-line bold conclusion.
    19. LENGTH REQUIREMENT: Every section response MUST be at least 1500-2000 words long to ensure maximum detail.
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
        - For Rasi Chart (menu_rasi): { "type": "chart", "planets": [{"name": "Sun", "rasi": 0, "degree": 15.5, "label_key": "planet_sun"}, ...] }
        - For Navamsha (menu_navamsha): { "type": "navamsha", "planets": [{"name": "Sun", "rasi": 0, "degree": 15.5, "label_key": "planet_sun"}, ...] }
        - CRITICAL: For Rasi Kundli, you MUST include all Navagrahas PLUS "Lagna" and "Mandi" in the planets array.
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
        ? `You are an elite Siddhantic Astronomer and Astrologer. Respond EXCLUSIVELY in ${lang}. You provide maximum technical density and classical citations. Use Lahiri Ayanamsa and precise mathematical calculations for planetary longitudes (Sphuta). You MUST ensure Rasi and Nakshatra calculations are 100% accurate based on the provided coordinates and time. Use HTML only for the analysis. If the focus is a chart, also provide planetary positions in JSON format within a <script type="application/json" id="chart-data"> tag. 
           CRITICAL: DO NOT repeat basic birth details (Name, DOB, TOB, POB, Rasi, Nakshatra, Lagna) in any section EXCEPT "Birth Analysis" or "Basic Details". Focus ONLY on the specific technical topic requested.
           If the section is "Birth Analysis" (menu_details) or "Navamsha" (menu_navamsha), you MUST provide ONLY the relevant JSON script tag and NO other text, paragraphs, or markdown.
           If the section is NOT "Birth Analysis" or "Basic Details", you MUST NOT include the "birth_details" JSON script tag.
           JSON GUIDELINES: Ensure all JSON is strictly valid. Use double quotes for keys and string values. Do not include trailing commas. Do not include comments inside the JSON. Ensure numbers are correctly formatted (no leading zeros, no trailing decimal points).` 
        : `You are a warm, highly informative life-guide. Respond EXCLUSIVELY in ${lang}. You explain the cosmos in simple but extremely detailed, practical coaching styles. You MUST ensure Rasi and Nakshatra calculations are 100% accurate. Use HTML only. If the focus is a chart, also provide planetary positions in JSON format within a <script type="application/json" id="chart-data"> tag.
           CRITICAL: DO NOT repeat basic birth details (Name, DOB, TOB, POB, Rasi, Nakshatra, Lagna) in any section EXCEPT "Basic Birth Details". Focus ONLY on the specific life guidance topic requested.
           If the section is NOT "Basic Birth Details", you MUST NOT include the "birth_details" JSON script tag.
           JSON GUIDELINES: Ensure all JSON is strictly valid. Use double quotes for keys and string values. Do not include trailing commas. Do not include comments inside the JSON. Ensure numbers are correctly formatted (no leading zeros, no trailing decimal points).`,
    }
  });
  const result = response.text || '';
  if (result) astroCache.set(cacheKey, result);
  return result;
};

// Prashna (Horary Astrology) Analysis
export const generatePrashnaAnalysis = async (question: string, pob: string, lang: Language, mode: UserMode = 'SEEKER', lat?: string, lon?: string, tz?: string) => {
  const cacheKey = `prashna_${question}_${pob}_${lang}_${mode}`;
  const cached = astroCache.get<string>(cacheKey);
  if (cached) return cached;

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
  const result = response.text || '';
  if (result) astroCache.set(cacheKey, result);
  return result;
};

// Marriage/Compatibility Matching
export const matchKundali = async (data: MatchingIntake, lang: Language, mode: UserMode = 'SEEKER') => {
  const cacheKey = `matching_${lang}_${mode}_${data.person1.dob}_${data.person1.tob}_${data.person2.dob}_${data.person2.tob}`;
  const cached = astroCache.get<string>(cacheKey);
  if (cached) return cached;

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
  const result = response.text || '';
  if (result) astroCache.set(cacheKey, result);
  return result;
};

// Daily Forecast
export const generateDailyForecastForRasi = async (rasi: string, lang: Language, mode: UserMode = 'SEEKER') => {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `daily_${rasi}_${lang}_${mode}_${today}`;
  const cached = astroCache.get<string>(cacheKey);
  if (cached) return cached;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  const now = new Date().toLocaleString();
  const prompt = `
    Generate a detailed DAILY astrological forecast for the Rasi: ${rasi}.
    Language: ${lang}.
    Mode: ${mode}.
    
    CRITICAL INSTRUCTIONS:
    1. Make the forecast EXTREMELY LONG, EXHAUSTIVE, and HIGHLY DETAILED (at least 2000-2500 words).
    2. Base the analysis on Samhita (Mundane astrology) and Hora (Predictive astrology).
    3. Include sections for:
       - General Outlook (Samhita perspective)
       - Detailed Hourly Energy Breakdown (Morning, Afternoon, Evening, Night)
       - Career & Finance (Hora perspective) - Deep dive into opportunities and risks
       - Health & Wellness - Physical and mental energy levels
       - Relationships & Social Life
       - Impact of Major Transits (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
       - Lucky Colors, Numbers, and Directions for the day
       - Specific Remedies (Upayas) and Mantras
       - "Celestial Life Hacks" for maximum productivity today
    4. Use professional, scholarly, yet accessible tone.
    5. Format with HTML tags (h2, h3, p, strong, ul, li, table).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      systemInstruction: `You are a Vedic Astrology expert providing daily forecasts based on Gochara (transits). Respond EXCLUSIVELY in ${lang}. You MUST use the current date and time for transit calculations. Format: HTML only.`
    }
  });
  const result = response.text || '';
  if (result) astroCache.set(cacheKey, result);
  return result;
};

// Muhurta
export const findMuhurtha = async (event: string, timeframe: string, lang: Language, mode: UserMode = 'SEEKER', pob?: string, lat?: string, lon?: string, tz?: string, performerDetails?: any) => {
  const cacheKey = `muhurta_${event}_${timeframe}_${lang}_${mode}_${pob || ''}_${JSON.stringify(performerDetails || {})}`;
  const cached = astroCache.get<string>(cacheKey);
  if (cached) return cached;

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
    3. If the user mentioned a specific planetary combination (e.g. "Jupiter-Moon Yoga"), prioritize times that align with those configurations.
    4. For outcome-based searches (e.g. "Success in Business"), prioritize Muhurtas that strengthen the relevant significators (e.g. Mercury/Jupiter for business).
    5. Explain WHY these times are auspicious in deep technical detail.
    6. MANDATORY: Include a detailed "Astrological Reasoning" section that breaks down:
       - Panchangam state (Tithi, Nakshatra, Yoga, Karana, Vara) for each suggested time.
       - Technical strengths: Digbala, Sthana-bala, and any Graha-Drushti (Aspects) present.
       - Specific planetary degrees and Rasis for the recommended time.
       - Reference classical Siddhantic texts (e.g. Muhurta Chintamani, Phaladeepika) for the alignment.
    7. Describe how rituals are typically performed for this Muhurtha in ${pob} (local traditions).
    8. Provide a clear recommendation.
    9. Format the narrative response with HTML (h2, h3, p, strong).
    10. CRITICAL: Also include a <script type="application/json" id="muhurta-details"> tag containing a JSON object:
        {
          "type": "muhurta_details",
          "event": "${event}",
          "recommendations": [
            {
              "time": "ISO Date String",
              "reasoning": "Technical summary",
              "panchangam": { "tithi": "...", "nakshatra": "...", "yoga": "...", "karana": "...", "vara": "..." },
              "planets": [ { "name": "...", "rasi": "...", "degree": "...", "reason": "..." } ],
              "references": ["Text 1", "Text 2"]
            }
          ]
        }
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
      systemInstruction: `You are a world-class Muhurta scholar. Respond EXCLUSIVELY in ${lang}. Use classical Sanskrit terminology alongside the requested language. Format: HTML + JSON script tag.`
    }
  });
  const result = response.text || '';
  if (result) astroCache.set(cacheKey, result);
  return result;
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
  const cacheKey = `panchanga_${date}_${time}_${pob}_${lang}_${mode}`;
  const cached = astroCache.get<string>(cacheKey);
  if (cached) return cached;

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
    2. JSON DATA: You MUST include a JSON script tag with type "panchanga_data" containing these fields: tithi, vara, nakshatra, yoga, karana, sunrise, sunset, rahu_kala. Each field should have a "value" and a "description" (short).
       Example: <script type="application/json" id="panchanga-data">{"type": "panchanga_data", "data": {"tithi": {"value": "...", "description": "..."}, ...}}</script>
    3. EXPLANATION: After the table, provide a detailed scholarly explanation of each element.
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
  const result = response.text || '';
  if (result) astroCache.set(cacheKey, result);
  return result;
};

// Life Timeline Dashboard Data
export const generateLifeTimeline = async (intake: UserIntake, lang: Language) => {
  const cacheKey = `timeline_${lang}_${intake.dob}_${intake.tob}_${intake.pob}`;
  const cached = astroCache.get<any>(cacheKey);
  if (cached) return cached;

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
    Generate a highly accurate and detailed Life Timeline (Vimshottari Dasha analysis) for:
    Name: ${intake.name}
    DOB: ${intake.dob}
    TOB: ${intake.tob} ${intake.ampm}
    POB: ${intake.pob}
    Coordinates: ${intake.lat}, ${intake.lon}
    Timezone: ${intake.tz}
    Language: ${lang}

    CRITICAL INSTRUCTIONS:
    1. EXTREME ACCURACY: You MUST calculate the exact Moon longitude at birth to determine the starting Mahadasha and the remaining balance.
    2. CONSISTENCY: The timeline MUST be identical for the same birth details. Use the provided coordinates for precision.
    3. STRUCTURE: Provide a chronological breakdown of major life periods (Mahadashas) and significant Antardashas from birth up to age 80-90.
    4. ANALYSIS: For each significant point (every 5-10 years or major dasha changes), include:
       - year: The age (e.g., 5, 12, 25, 40, etc.).
       - score: A general "luck/strength" score from 0 to 100 based on the dasha lord's placement and strength in the chart.
       - category: One of "Good", "Risk", "Career", "Marriage", "Investment", "Education", "Health".
       - description: A detailed, accurate description in ${lang} explaining the astrological reason for this period's quality (e.g., "Jupiter Mahadasha begins, bringing expansion and wisdom...").
    5. Format: JSON only.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      seed: consistentSeed,
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
    const result = JSON.parse(response.text || '[]');
    if (result && result.length > 0) astroCache.set(cacheKey, result);
    return result;
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

// Vastu Analysis
export const generateVastuAnalysis = async (lang: Language, mode: UserMode = 'SEEKER', structureType: string = 'Residential') => {
  const cacheKey = `vastu_${lang}_${mode}_${structureType}`;
  const cached = astroCache.get<string>(cacheKey);
  if (cached) return cached;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  const prompt = `
    Perform a comprehensive Vastu Shastra analysis for ${structureType} in ${lang}.
    MODE: ${mode}

    CRITICAL INSTRUCTIONS:
    1. Base analysis on Sthapatya Veda and the Vastu Purusha Mandala.
    2. For SEEKER mode: Focus on "Home Harmony", practical tips, color guidelines, and easy-to-implement remedies for modern homes/apartments.
    3. For SCHOLAR mode: Deep dive into the "Vastu Purusha Mandala" (81/64 grids), Dikpalas (Directional Guardians), Ayadi calculations, and complex structural alignments. Include Sanskrit terminology.
    4. STRUCTURE: Provide detailed guidelines for:
       - Entrance (Simha Dwara)
       - Living Room (North/East)
       - Kitchen (Southeast/Agni Zone)
       - Master Bedroom (Southwest/Nairutya)
       - Bathroom (Northwest/Vayu)
       - Space Center (Brahmasthan)
       - Water & Plants (Northeast/Ishanya)
    5. Include "Vastu Dosha" remedies for common modern alignment issues.
    6. Explain the planetary connection to each direction.
    7. Format the response with HTML (h2, h3, p, strong, ul, li).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: mode === 'SCHOLAR' ? ThinkingLevel.MEDIUM : ThinkingLevel.LOW },
      systemInstruction: `You are a Vastu Shastra expert and Sthapatya Veda scholar. Respond EXCLUSIVELY in ${lang}. Format: HTML only.`
    }
  });
  const result = response.text || '';
  if (result) astroCache.set(cacheKey, result);
  return result;
};
