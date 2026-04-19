
import { GoogleGenAI, Type } from "@google/genai";
import fs from 'fs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is required");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const NEW_KEYS: Record<string, string> = {
  daily_vedic_wisdom: "Daily Vedic Wisdom",
  celestial_cycle_continues: "Celestial Cycle Continues",
  live_muhurtha_feed: "Live Muhurtha Feed",
  prashna_moment_subtitle: "Instant Answers from the Current Moment",
  prashna_number_label: "Prashna Number (1-108)",
  prashna_location_label: "Query Location",
  ask_question_placeholder: "Ask your question here...",
  get_answer: "Get Answer",
  oracle_insight: "Oracle Insight",
  ask_another_question: "Ask Another Question",
  universal_quote_prashna: "\"The moment you ask is the moment the universe answers.\"",
  cosmic_turbulence_error: "The cosmic energies are currently turbulent. Please try again in a few moments.",
  moment_label: "Moment",
  searching_city_placeholder: "Search City...",
  ancient_solutions_subtitle: "Ancient Solutions for Modern Problems",
  remedy_label: "Remedy",
  focus_label: "Focus",
  instructions_label: "Instructions",
  focus_health: "Health & Vitality",
  focus_mental_peace: "Mental Peace",
  focus_protection: "Protection",
  focus_karma: "Karma Dissolution",
  focus_saturn: "Saturn Mitigation",
  focus_career_obstacles: "Career/Obstacles",
  focus_domestic_peace: "Domestic Peace",
  focus_intellect: "Intellect",
  surya_arghya_title: "Surya Arghya",
  surya_arghya_desc: "Offer water to the rising sun to boost confidence, leadership, and health. Best performed within 1 hour of sunrise.",
  chandra_shanti_title: "Chandra Shanti",
  chandra_shanti_desc: "Drink water from a silver glass to calm the mind, improve emotional stability, and enhance intuition.",
  hanuman_chalisa_title: "Hanuman Chalisa",
  hanuman_chalisa_desc: "Recite daily to overcome fear, gain inner strength, and protect against negative planetary influences.",
  mantra_jaap_title: "Mantra Jaap",
  mantra_jaap_desc: "Chant \"Om Namah Shivaya\" 108 times for spiritual protection and to dissolve karmic blockages.",
  daan_charity_title: "Daan (Charity)",
  daan_charity_desc: "Donate black sesame seeds or food on Saturdays to mitigate Saturnian delays and bring stability.",
  ganesh_atharvashirsha_title: "Ganesh Atharvashirsha",
  ganesh_atharvashirsha_desc: "Recite to remove obstacles in career and education. Best for Mercury (Budha) related issues.",
  tulsi_seva_title: "Tulsi Seva",
  tulsi_seva_desc: "Watering and circumambulating the Tulsi plant daily brings peace to the household and strengthens Venus.",
  gayatri_mantra_title: "Gayatri Mantra",
  gayatri_mantra_desc: "Chanting at dawn, noon, and dusk purifies the intellect and aligns you with the solar energy.",
  quote_1: "The stars do not compel us, they only impel us. Your Karma is the ink, and the planets are the pen.",
  quote_2: "Time is the greatest healer and the greatest teacher. Align with the cosmic rhythm to find peace.",
  quote_3: "Every planetary transit is an opportunity for growth. Challenges are merely lessons in disguise.",
  quote_4: "The universe speaks in the language of geometry and light. Astrology is the translation of that divine speech.",
  quote_5: "Each planet is a mirror reflecting a part of your own soul. To know the stars is to know yourself.",
  quote_6: "Your birth chart is the blueprint of your destiny, but your actions are the construction workers.",
  quote_7: "The Moon rules the mind, and the Sun rules the soul. Balance both to find true enlightenment.",
  daivajna_live: "Daivajna Live",
  sacred_ritual_clarity: "Sacred Ritual for Divine Clarity",
  your_name_label: "Your Name",
  enter_full_name_placeholder: "Enter your full name",
  contact_number_label: "Contact Number",
  enter_contact_number_placeholder: "Enter your contact number",
  complete_your_offering: "Complete Your Offering",
  payment_desc_text: "Please complete the payment to confirm your sacred session.",
  payment_upi_instruction: "Click the button below to pay via your UPI app. Your appointment will be booked automatically upon payment.",
  pay_via_upi: "Pay via UPI App ➔",
  copy_upi_id: "Copy UPI ID",
  details_sent_to: "Details sent to",
  email_simulation_active: "Email Simulation Active",
  email_setup_instruction: "To receive real emails, go to Settings and set EMAIL_USER and EMAIL_PASS environment variables.",
  email_failed_title: "Email Notification Failed",
  email_failed_msg: "A technical error occurred while sending the email.",
  processing: "Processing...",
  dakshina: "Dakshina",
  brief_problem_analysis: "Brief problem analysis",
  simple_remedies_2_3: "2–3 simple remedies",
  basic_planetary_reason: "Basic planetary reason",
  detailed_planet_analysis: "Detailed planet analysis",
  remedies_5_7: "5–7 remedies",
  timeline_for_results: "Timeline for results",
  dosha_explanation: "Dosha explanation",
  full_birth_chart_breakdown: "Full birth chart breakdown",
  dasha_analysis_full: "Dasha analysis",
  marriage_career_finance: "Marriage, career, finance",
  personalized_action_plan: "Personalized action plan",
  complete_remedy_guide: "Complete remedy guide",
  today: "Today",
  tomorrow: "Tomorrow",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
  year_age: "Age/Year",
  good_period: "Good Period",
  risk_period: "Risk Period",
  career_marriage: "Career/Marriage",
  status_auspicious: "Auspicious",
  status_inauspicious: "Inauspicious",
  status_neutral: "Neutral",
  status_highly_auspicious: "Highly Auspicious",
  elder_care_program: "Elder Care Program",
  special_children_initiative: "Special Children Initiative"
};

const LANGUAGES = ['kn', 'mr', 'hi', 'sa', 'te', 'ta', 'ml', 'tcy', 'kok', 'gu', 'bn'];

async function translateKeys(targetLang: string, keys: Record<string, string>) {
  const prompt = `Translate the following English astrological and UI terms into ${targetLang}. 
  Return ONLY a valid JSON object where keys match the input and values are the translations.
  
  Terms:
  ${JSON.stringify(keys, null, 2)}`;

  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  try {
    return JSON.parse(result.text || "{}");
  } catch (e) {
    console.error(`Failed to parse translation for ${targetLang}`);
    return {};
  }
}

async function run() {
  let content = fs.readFileSync('constants.tsx', 'utf-8');

  // First, update 'en' block
  console.log("Updating 'en' block...");
  const enMatch = content.match(/en: \{([\s\S]*?)\},/);
  if (enMatch) {
    let enBlock = enMatch[1];
    for (const [key, val] of Object.entries(NEW_KEYS)) {
      if (!enBlock.includes(`${key}:`)) {
        enBlock += `    ${key}: "${val}",\n`;
      } else {
         // Update existing if needed
         enBlock = enBlock.replace(new RegExp(`${key}: ".*?",`), `${key}: "${val}",`);
      }
    }
    content = content.replace(/en: \{[\s\S]*?\},/, `en: {\n${enBlock}  },`);
  }

  for (const lang of LANGUAGES) {
    console.log(`Translating for ${lang}...`);
    const translations = await translateKeys(lang, NEW_KEYS);
    
    // Find the language block
    const langMatch = new RegExp(`  ${lang}: \\{([\\s\\S]*?)\\},`).exec(content);
    if (langMatch) {
      let langBlock = langMatch[1];
      // Add missing keys
      for (const [key, val] of Object.entries(translations)) {
        if (!langBlock.includes(`${key}:`)) {
          langBlock += `    ${key}: "${val}",\n`;
        } else {
          // Update existing if needed (e.g. if it's currently English)
          langBlock = langBlock.replace(new RegExp(`${key}: ".*?",`), `${key}: "${val}",`);
        }
      }
      // Replace the block
      content = content.replace(new RegExp(`  ${lang}: \\{[\\s\\S]*?\\},`), `  ${lang}: {\n${langBlock}  },`);
    } else {
        console.warn(`Language block for ${lang} not found.`);
    }
  }

  fs.writeFileSync('constants.tsx', content);
  console.log("Translations updated in constants.tsx");
}

run();
