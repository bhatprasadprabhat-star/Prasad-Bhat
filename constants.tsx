
export const COLORS = {
  GOLD: '#D4AF37',
  SAFFRON: '#FF9933',
  DEEP_RED: '#8B0000',
  NAVY: '#0B1120',
  CELESTIAL_BLUE: '#4F46E5',
  PARCHMENT: '#FDF5E6',
  MAROON_DARK: '#431407',
  MAROON_LIGHT: '#7C2D12'
};

export const RASIS = [
  { name: "Mesha", icon: "♈" },
  { name: "Rishaba", icon: "♉" },
  { name: "Mithuna", icon: "♊" },
  { name: "Kataka", icon: "♋" },
  { name: "Simha", icon: "♌" },
  { name: "Kanya", icon: "♍" },
  { name: "Thula", icon: "♎" },
  { name: "Vrischika", icon: "♏" },
  { name: "Dhanus", icon: "♐" },
  { name: "Makara", icon: "♑" },
  { name: "Kumbha", icon: "♒" },
  { name: "Meena", icon: "♓" }
];

export const MUHURTA_TYPES = [
  { id: 'vivaha', label: 'Vivaha (Marriage Ceremony)' },
  { id: 'grihapravesha', label: 'Griha Pravesha (House Warming)' },
  { id: 'bhoomi_pooja', label: 'Bhoomi Pooja (Ground Breaking)' },
  { id: 'upanayana', label: 'Upanayana (Thread Ceremony)' },
  { id: 'namakarana', label: 'Namakarana (Naming Ceremony)' },
  { id: 'annaprashana', label: 'Annaprashana (First Feeding)' },
  { id: 'aksharabhyasa', label: 'Akshara Abhyasa (Education Start)' },
  { id: 'vidyarambha', label: 'Vidya Arambha (Starting School)' },
  { id: 'karnavedha', label: 'Karnavedha (Ear Piercing)' },
  { id: 'choodakarana', label: 'Choodakarana (Mundan/Hair Cut)' },
  { id: 'seemantham', label: 'Seemantham (Baby Shower)' },
  { id: 'vahana', label: 'Vahana Kharidi (Vehicle Purchase)' },
  { id: 'vyapaara', label: 'Vyapaara Arambha (New Business)' },
  { id: 'shop_opening', label: 'Nootana Vyapaara (Shop Opening)' },
  { id: 'udyoga', label: 'Udyoga Pravesha (Joining Job)' },
  { id: 'swarna', label: 'Swarna Kharidi (Buying Gold/Jewels)' },
  { id: 'investments', label: 'Dhana Nivesha (Investments)' },
  { id: 'yaatra', label: 'Yaatra (Significant Travel)' },
  { id: 'videsha', label: 'Videsha Gamana (Foreign Travel)' },
  { id: 'shastra_kriya', label: 'Shastra Kriya (Surgery)' },
  { id: 'medical_start', label: 'Chikitsa Arambha (Start Treatment)' },
  { id: 'abhijit', label: 'Abhijit Muhurta (Daily Auspicious)' },
  { id: 'brahma', label: 'Brahma Muhurta (Spiritual Window)' },
  { id: 'shilaanyasa', label: 'Shilaanyasa (Foundation Stone)' },
  { id: 'renting', label: 'New Rental/Moving Home' },
  { id: 'contracts', label: 'Signing Agreements' },
  { id: 'legal', label: 'Legal/Court Initiations' },
  { id: 'agriculture', label: 'Krishi Karya (Farming/Sowing)' }
];

export const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
export const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

export const PLANETS = [
  "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"
];

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'mr', name: 'ಮರಾಠಿ' }
];

export const TRANSLATIONS: Record<string, any> = {
  en: {
    tagline: "Where Astrology Meets Reason",
    horoscope: "Horoscope",
    matching: "Matching",
    daily: "Daily Forecast",
    muhurta: "Muhurta",
    chat: "Astro Chat",
    prashna: "Prashna",
    menu_details: "Birth Analysis",
    menu_timeline: "Life Timeline (Past, Present, Future)",
    menu_hora: "Classical Hora Analysis",
    menu_sphta: "Planetary Degrees",
    menu_rasi: "Rasi Kundli",
    menu_navamsha: "Navamsha D9",
    menu_bhava: "Bhava Chalit",
    menu_sandhi: "Sandhi Analysis",
    menu_panchangam: "Panchangam",
    menu_dasha: "Vimshottari Dasha",
    menu_shadvarga: "Shadvarga Strengths",
    menu_ashtaka: "Ashtakavarga Points",
    menu_trisputa: "Trisputadi Analysis",
    menu_dhumadi: "Dhumadi Group",
    back: "Back",
    submit: "Create Horoscope",
    lang_select: "Language",
    save_profile: "Save Profile",
    saved_profiles: "Recent Charts",
    matching_title: "Divine Relationship Synergy",
    conclusion: "Divine Verdict",
    select_rasi: "Select Rasi",
    daily_title: "Celestial Flow for Today",
    muhurta_title: "Auspicious Muhurta Windows",
    muhurta_select: "Select Purpose"
  },
  kn: {
    tagline: "ಜ್ಯೋತಿಷ್ಯ ಮತ್ತು ವೈಚಾರಿಕತೆಯ ಸಂಗಮ",
    horoscope: "ಜಾತಕ",
    matching: "ಹೊಂದಾಣಿಕೆ",
    daily: "ದಿನ ಭವಿಷ್ಯ",
    muhurta: "ಮುಹೂರ್ತ",
    chat: "ಚರ್ಚೆ",
    prashna: "ಪ್ರಶ್ನೆ",
    menu_details: "ಜಾತಕ ವಿವರ",
    menu_timeline: "ಕಾಲಾನುಕ್ರಮ ವಿಶ್ಲೇಷಣೆ (ಹಿಂದಿನ, ಈಗಿನ, ಭವಿಷ್ಯ)",
    menu_hora: "ಶಾಸ್ತ್ರೀಯ ಹೋರಾ ವಿಶ್ಲೇಷಣೆ",
    menu_sphta: "ಗ್ರಹಸ್ಫುಟ",
    menu_rasi: "ರಾಶಿ ಕುಂಡಲಿ",
    menu_navamsha: "ನವಾಂಶ ಕುಂಡಲಿ",
    menu_bhava: "ಭಾವ ಕುಂಡಲಿ",
    menu_sandhi: "ಭಾವ-ಸಂಧಿ",
    menu_panchangam: "Panchangam",
    menu_dasha: "ದಶಾ-ಭುಕ್ತಿ",
    menu_shadvarga: "ಷಡ್ವರ್ಗ",
    menu_ashtaka: "ಅಷ್ಟಕವರ್ಗ",
    menu_trisputa: "ತ್ರಿಸ್ಫುಟಾದಿ",
    menu_dhumadi: "ಧೂಮಾದಿ",
    back: "ಹಿಂದಕ್ಕೆ",
    submit: "ಜಾತಕ ರಚಿಸಿ",
    lang_select: "ಭಾಷೆ",
    save_profile: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ",
    saved_profiles: "ಇತ್ತೀಚಿನ ಜಾತಕಗಳು",
    matching_title: "ಜಾತಕ ಹೊಂದಾಣಿಕೆ",
    conclusion: "ದೈವಿಕ ತೀರ್ಪು",
    select_rasi: "ನಿಮ್ಮ ರಾಶಿಯನ್ನು ಆರಿಸಿ",
    daily_title: "ಇಂದಿನ ಮುಹೂರ್ತ ಮತ್ತು ಭವಿಷ್ಯ",
    muhurta_title: "ಶುಭ ಮುಹೂರ್ತಗಳು",
    muhurta_select: "ಉದ್ದೇಶವನ್ನು ಆರಿಸಿ"
  }
};
