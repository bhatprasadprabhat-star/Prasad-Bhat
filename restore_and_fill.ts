import fs from 'fs';

const filePath = './constants.tsx';
const content = fs.readFileSync(filePath, 'utf8');

// The partial Tulu and Konkani we saw in previous turns
const tcy_partial: Record<string, string> = {
    donate_support: "ಸಹಾಯ ಬೊಕ್ಕ ಬೆಂಬಲ",
    next_analysis: "ದುಂಬು: ವಿಶ್ಲೇಷಣೆ ಆಯ್ದುಕೊಳೆ",
    sacred_geometry: "ಪವಿತ್ರ ಜ್ಯಾಮಿತಿ • ಪರತ್ ತರ್ಕ",
    birth_analysis: "ಜನ್ಮ ವಿಶ್ಲೇಷಣೆ",
    my_character: "ಎನ್ನ ವ್ಯಕ್ತಿತ್ವ",
    rasi_kundli: "ರಾಶಿ ಕುಂಡಲಿ",
    vimshottari: "ವಿಂಶೋತ್ತರಿ",
    ashtakavarga: "ಅಷ್ಟಕವರ್ಗ",
    siddhantic_precision: "ಸಿದ್ಧಾಂತಿಕ ನಿಖರತೆ",
    personal_guidance: "ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನ",
    planet_sun: "ಸೂರ್ಯ",
    planet_moon: "ಚಂದ್ರ",
    planet_mars: "ಅಂಗಾರಕ",
    planet_mercury: "ಬುಧ",
    planet_jupiter: "ಗುರು",
    planet_venus: "ಶುಕ್ರ",
    planet_saturn: "ಶನಿ",
    planet_rahu: "ರಾಹು",
    planet_ketu: "ಕೇತು",
    planet_lagna: "ಲಗ್ನ",
    planet_mandi: "ಮಾಂದಿ",
    rasi_mesha: "ಮೇಷ",
    rasi_vrishabha: "ವೃಷಭ",
    rasi_mithuna: "ಮಿಥುನ",
    rasi_karka: "ಕರ್ಕ",
    rasi_simha: "ಸಿಂಹ",
    rasi_kanya: "ಕನ್ಯಾ",
    rasi_tula: "ತುಲಾ",
    rasi_vrishchika: "ವೃಶ್ಚಿಕ",
    rasi_dhanu: "ಧನು",
    rasi_makara: "ಮಕರ",
    rasi_kumbha: "ಕುಂಭ",
    rasi_meena: "ಮೀನ",
    seeker: "ಸೀಕರ್",
    scholar: "ಸ್ಕಾಲರ್",
    calculating_heavens: "ಆಕಾಶದ ಲೆಕ್ಕಾಚಾರ ನಡತೊಂದುಂಡು...",
    ask_help_guruji: "ಗುರೂಜಿನ ಸಹಾಯ ಕೇನ್ಲೆ",
    sacred_conversation: "ಒಂಜಿ ಪವಿತ್ರ ಸಂಭಾಷಣೆ",
    shastriya: "ಶಾಸ್ತ್ರೀಯ",
    life_path: "ಜೀವನ ಸಾದಿ",
    timeline: "ಕಾಲಕ್ರಮ",
    siddhantic: "ಸಿದ್ಧಾಂತ",
    today_panchanga: "ಇತ್ತೆದ ಪಂಚಾಂಗ",
    life_phase: "ಜೀವನ ಹಂತ",
    wealth_health: "ಸಂಪತ್ತು ಬೊಕ್ಕ ಆರೋಗ್ಯ",
    soul_map: "ಆತ್ಮದ ನಕ್ಷೆ",
    planetary_power: "ಗ್ರಹಲೆನ ಶಕ್ತಿ",
    energy_strength: "ಶಕ್ತಿದ ಸಾಮರ್ಥ್ಯ",
    power_score: "ಶಕ್ತಿದ ಅಂಕ",
    under_construction: "ಈ ದೈವಿಕ ಸಾದಿ ನಿರ್ಮಾಣ ಹಂತಡುಂಡು.",
    return_home: "ಇಲ್ಲಗ್ ಪಿರ ಪೋಲೆ",
    get_verdict: "ತೀರ್ಪು ಪಡೆಲೆ",
    latitude: "ಅಕ್ಷಾಂಶ",
    longitude: "ರೇಖಾಂಶ",
    timezone: "ಸಮಯ ವಲಯ",
    enter_full_name: "ಪೂರ್ಣ ಪುದರ್ ಬರೆಲೆ",
    birth_date: "ಪುಟ್ಟಿನ ದಿನಾಂಕ",
    birth_time: "ಪುಟ್ಟಿನ ಸಮಯ",
    birth_location: "ಪುಟ್ಟಿನ ಜಾಗೆ",
    suggestion_title: "ಸಲಹೆಲು",
    suggestion_desc: "ನಿಮ್ಮ ಅನುಭವನ್ ಸುಧಾರಿಸಯೆರೆ ಗುರೂಜಿಗ್ ಸಹಾಯ ಮಲ್ಪುಲೆ",
    suggestion_placeholder: "ನಿಮ್ಮ ಅನಿಸಿಕೆಲೆನ್ ಅಥವಾ समस्याಲೆನ್ ಮುಲ್ಪ ಪಟ್ಟೊಳೆ...",
    suggestion_send: "ಸಲಹೆ ಕಡಪುಡ್ಲೆ",
    suggestion_sent: "ಗುರೂಜಿಗ್ ಕಡಪುಡ್ದುಂಡು",
    panchanga_title: "ಪಂಚಾಂಗ",
    custom_panchanga: "ದಿನಾಂಕ ಬೊಕ್ಕ ಜಾಗೆ ಆಯ್ದುಕೊಳೆ",
    timeline_title: "ಜೀವನ ಕಾಲಕ್ರಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    contact_astrologer_title: "ದೈವಜ್ಞೆರೆಗ್ ತಾಂಬೂಲ ಸಮರ್ಪಣೆ",
    contact_astrologer_desc: "ತಾಂಬೂಲ ಸಮರ್ಪಣೆದ ಮುಖಾಂತರ ದೈವಿಕ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯುನ ಪವಿತ್ರ ವಿಧಿ",
    problem_label: "ನಿಮ್ಮ समस्याನ್ ವಿವರಿಸಲೆ",
    problem_placeholder: "ಉದಾ: ಉದ್ಯೋಗದ ಏಳಿಗೆ, ಆರೋಗ್ಯದ ಸಮಸ್ಯೆಲು...",
    contact_time_label: "ಸಂಪರ್ಕ ಮಲ್ಪೆರೆ ಎಡ್ಡೆ ಸಮಯ",
    contact_time_placeholder: "ಉದಾ: ಎಲ್ಲೆ ಕಾಂಡೆ 10 ಗಂಟೆಗ್",
    submit_problem: "ವಿನಂತಿನ್ ಸಲ್ಲಿಸಲೆ",
    problem_submitted_msg: "ನಮ್ಮ ಜ್ಯೋತಿಷಿಲು ಬೇಗನೆ ನಿಮ್ಮನ್ ಸಂಪರ್ಕ ಮಲ್ಪುವೆರ್.",
    mangala_dosha: "ಮಂಗಳ ದೋಷ",
    conclusion_title: "ಒಂಜಿ ಸಾಲಿದ ತೀರ್ಮಾನ",
    remedy_options_title: "ಪರಿಹಾರದ ಸಾದಿನ್ ಆಯ್ದುಕೊಳೆ"
};

const kok_partial: Record<string, string> = {
    tagline: "ಜಂಯ್ ಜ್ಯೋತಿಷ್ಯ ಆನಿ ತರ್ಕ ಮೆಳ್ತಾ",
    horoscope: "ಜಾತಕ",
    matching: "ಗುಣಮೇಲನ",
    daily: "ದಿನಾಚೆಂ ಭವಿಷ್ಯ",
    muhurta: "ಮುಹೂರ್ತ",
    chat: "ಆಸ್ಟ್ರೋ ಚಾಟ್",
    prashna: "ಪ್ರಶ್ನ",
    menu_details: "ಜನ್ಮ ವಿಶ್ಲೇಷಣ",
    menu_timeline: "ಜೀವನ ಕಾಲಕ್ರಮ (ಫಾಟ್ಲೊ, ಆತಾಂಚೊ, ಫುಡಾರಾಂಚೊ)",
    menu_hora: "ಹೋರಾ ವಿಶ್ಲೇಷಣ",
    menu_sphta: "ಗ್ರಹಾಂಚೆ ಅಂಶ",
    menu_rasi: "ರಾಶಿ ಕುಂಡಲಿ",
    menu_navamsha: "ನವಾಂಶ ಕುಂಡಲಿ",
    menu_bhava: "ಭಾವ ಚಲಿತ",
    menu_sandhi: "ಸಂಧಿ ವಿಶ್ಲೇಷಣ",
    menu_panchangam: "ಪಂಚಾಂಗ",
    menu_dasha: "ವಿಂಶೋತ್ತರಿ ದಶಾ",
    menu_shadvarga: "ಷಡ್ವರ್ಗ ಬಲ",
    my_character: "ಮ್ಹಜೆಂ ವ್ಯಕ್ತಿತ್ವ",
    timeline: "ಕಾಲಕ್ರಮ",
    life_path: "ಜೀವನ ವಾಟ್",
    shastriya: "ಶಾಸ್ತ್ರೀಯ",
    wealth_health: "ಸಂಪತ್ತಿ ಆನಿ ಭಲಾಯ್ಕಿ",
    rasi_kundli: "ರಾಶಿ ಕುಂಡಲಿ",
    soul_map: "ಆತ್ಮ್ಯಾಚೊ ನಕಾಶೊ",
    vimshottari: "ವಿಂಶೋತ್ತರಿ",
    life_phase: "ಜೀವನ ಹಂತ",
    ashtakavarga: "ಅಷ್ಟಕವರ್ಗ",
    power_score: "ಶಕ್ತಿ ಸ್ಕೋರ್",
    siddhantic_precision: "ಸಿದ್ಧಾಂತಿಕ ನಿಖರತೆ",
    personal_guidance: "ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನ",
    planet_sun: "ಸೂರ್ಯ",
    planet_moon: "ಚಂದ್ರ",
    planet_mars: "ಮಂಗಳ",
    planet_mercury: "ಬುಧ",
    planet_jupiter: "ಗುರು",
    planet_venus: "ಶುಕ್ರ",
    planet_saturn: "ಶನಿ",
    planet_rahu: "ರಾಹು",
    planet_ketu: "ಕೆತು",
    planet_lagna: "ಲಗ್ನ",
    planet_mandi: "ಮಾಂದಿ",
    rasi_mesha: "ಮೇಷ",
    rasi_vrishabha: "ವೃಷಭ",
    rasi_mithuna: "ಮಿಥುನ",
    rasi_karka: "ಕರ್ಕ",
    rasi_simha: "ಸಿಂಹ",
    rasi_kanya: "ಕನ್ಯಾ",
    rasi_tula: "ತುಲಾ",
    rasi_vrishchika: "ವೃಶ್ಚಿಕ",
    rasi_dhanu: "ಧನು",
    rasi_makara: "ಮಕರ",
    rasi_kumbha: "ಕುಂಭ",
    rasi_meena: "ಮೀನ",
    seeker: "ಸೀಕರ್",
    scholar: "ಸ್ಕಾಲರ್",
    suggestion_title: "ಸೂಚನಾ",
    suggestion_desc: "ತುಜೊ ಅನ್ಭವ್ ಸುಧಾರಂವ್ಕ್ ಗುರೂಜಿಕ್ ಮಜತ್ ಕರ್",
    suggestion_placeholder: "ತುಜೆ ವಿಚಾರಾಂ ವಾಂಟುನ್ ಘೆ ಅಥವಾ ಏಕಾದಿ ಸಮಸ್ಯೆ ವರದಿ ಕರ್...",
    suggestion_send: "ಸೂಚನಾ ಧಾಡ್",
    suggestion_sent: "ಗುರೂಜಿಕ್ ಧಾಡ್ಲಾಂ",
    panchanga_title: "ಪಂಚಾಂಗ",
    today_panchanga: "ಆಜ್ಚೆಂ ಪಂಚಾಂಗ",
    custom_panchanga: "ದಿನಾಂಕ್ ಆನಿ ಜಾಗೊ ವಿಂಚಾ",
    timeline_title: "ಜೀವನ ಕಾಲಕ್ರಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    contact_astrologer_title: "ಜ್ಯೋತಿಷಿಂಕ್ ಸಂಪರ್ಕ್ ಕರ್",
    contact_astrologer_desc: "ಆಮ್ಚ್ಯಾ ತಜ್ಞಾಂಕಡ್ಲ್ಯಾನ್ ವೈಯಕ್ತಿಕ ಪರಿಹಾರ್ ಘೆ",
    problem_label: "ತುಜಿ ಸಮಸ್ಯೆ ವಿವರುನ್ ಸಾಂಗ್",
    problem_placeholder: "ಉದಾ: ವೃತ್ತಿ ವಾಡಾವಳ್, ಭಲಾಯ್ಕಿ ಸಮಸ್ಯೆ...",
    contact_time_label: "ಸಂಪರ್ಕ್ ಕರುಂಕ್ ಬರಿ ವೇಳ್",
    contact_time_placeholder: "ಉದಾ: ಫಾಲ್ಯಾಂ ಸಕಾಳಿಂ 10 ವರಾರ್",
    submit_problem: "ವಿನಂತಿ ಸಾದರ್ ಕರ್",
    problem_submitted_msg: "ಆಮ್ಚೆ ಜ್ಯೋತಿಷಿ ವೆಗಿಂಚ್ ತುಕಾ ಸಂಪರ್ക് ಕರ್ತಲೆ."
};

function extractTranslations(text: string): Record<string, Record<string, string>> {
  const translations: Record<string, Record<string, string>> = {};
  const lines = text.split('\n');
  let currentLang = '';
  let inObject = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const langMatch = line.match(/^([a-z]{2,3}):\s*\{/);
    if (langMatch) {
      currentLang = langMatch[1];
      translations[currentLang] = {};
      inObject = true;
      continue;
    }
    if (inObject && line === '},') {
      inObject = false;
      currentLang = '';
      continue;
    }
    if (inObject && currentLang) {
      const kvMatch = line.match(/^\s*([a-zA-Z0-9_]+):\s*"([^"]*)"/);
      if (kvMatch) {
        translations[currentLang][kvMatch[1]] = kvMatch[2];
      }
    }
  }
  return translations;
}

const translations = extractTranslations(content);

// Merge our partials
translations['tcy'] = { ...translations['tcy'], ...tcy_partial };
translations['kok'] = { ...translations['kok'], ...kok_partial };

const englishKeys = Object.keys(translations['en'] || {});
const languages = ['en', 'kn', 'mr', 'hi', 'sa', 'te', 'ta', 'ml', 'tcy', 'kok', 'gu', 'bn'];

let newTranslationsStr = 'export const TRANSLATIONS: Record<string, any> = {\n';

for (const lang of languages) {
  newTranslationsStr += `  ${lang}: {\n`;
  const langData = translations[lang] || {};
  englishKeys.forEach((key, idx) => {
    const value = langData[key] || translations['en'][key] || "";
    const escapedValue = value.replace(/"/g, '\\"');
    const comma = idx === englishKeys.length - 1 ? '' : ',';
    newTranslationsStr += `    ${key}: "${escapedValue}"${comma}\n`;
  });
  newTranslationsStr += '  },\n';
}
newTranslationsStr += '};';

const startMarker = 'export const TRANSLATIONS: Record<string, any> = {';
const startIndex = content.indexOf(startMarker);
const endIndex = content.lastIndexOf('};');

if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
  const newContent = content.substring(0, startIndex) + newTranslationsStr + content.substring(endIndex + 2);
  fs.writeFileSync(filePath, newContent);
  console.log("Successfully restored and filled TRANSLATIONS.");
} else {
  console.error("Could not find TRANSLATIONS object boundaries.");
}
