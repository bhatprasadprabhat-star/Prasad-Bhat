
export interface PanchangamData {
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  vara: string;
  sunrise: string;
  sunset: string;
}

export interface UserIntake {
  name: string;
  dob: string;
  tob: string;
  ampm?: string;
  pob: string;
  gender: string;
  lat?: string;
  lon?: string;
  tz?: string;
  pincode?: string;
}

export interface CityData {
  name: string;
  lat: string;
  lon: string;
  tz: string;
  pincode?: string;
}

export interface MatchingIntake {
  person1: UserIntake;
  person2: UserIntake;
}

export interface PlanetPosition {
  name: string;
  rasi: number; // 0-11
  degree: number;
  label_key?: string;
}

export type RasiChartData = PlanetPosition[];

export interface SearchSource {
  title: string;
  uri: string;
}

export type Language = 'en' | 'kn' | 'hi' | 'te' | 'ta' | 'ml' | 'mr' | 'tcy' | 'kok' | 'gu' | 'bn';

export type UserMode = 'SCHOLAR' | 'SEEKER';

export enum OnboardingStep {
  SPLASH = 'splash',
  LANG_SELECT = 'lang_select',
  QUICK_LOGIN = 'quick_login',
  MODE_SELECT = 'mode_select',
  COMPLETED = 'completed'
}

export enum AppTab {
  DASHBOARD = 'Home',
  DAILY_PREDICTION = 'Daily Forecast',
  HOROSCOPE = 'Horoscope',
  PRASHNA = 'Prashna',
  MUHURTHA = 'Muhurta',
  MATCHING = 'Matching',
  LIFE_PARTNER = 'Life Partner',
  PANCHANGA = 'Panchanga',
  TIMELINE = 'Life Timeline',
  BLOG = 'Blog',
  NUMEROLOGY = 'Numerology'
}
