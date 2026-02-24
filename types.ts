
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
}

export interface CityData {
  name: string;
  lat: string;
  lon: string;
  tz: string;
}

export interface MatchingIntake {
  person1: UserIntake;
  person2: UserIntake;
}

export interface PlanetPosition {
  name: string;
  rasi: number; // 0-11
  degree: number;
}

export type RasiChartData = PlanetPosition[];

export interface SearchSource {
  title: string;
  uri: string;
}

export type Language = 'en' | 'kn' | 'hi' | 'te' | 'ta' | 'ml' | 'mr' | 'tcy' | 'kok' | 'gu' | 'bn';

export type UserMode = 'SCHOLAR' | 'SEEKER';

export enum AppTab {
  DASHBOARD = 'Home',
  DAILY_PREDICTION = 'Daily Forecast',
  HOROSCOPE = 'Horoscope',
  PRASHNA = 'Prashna',
  MUHURTHA = 'Muhurta',
  MATCHING = 'Matching',
  CHAT = 'Astro Chat'
}
