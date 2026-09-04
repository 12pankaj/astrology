// Master TypeScript Type Definitions for vedic-astro

export type AyanamshaType = 'LAHIRI' | 'RAMAN' | 'KP' | 'YUKTESHWAR';

export type UserRole = 'user' | 'astrologer' | 'admin';

export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'unverified';
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  gender?: Gender;
  avatarUrl?: string;
  preferredLanguage: string;
  timezone: string;
}

export interface BirthProfile {
  id: string;
  userId: string;
  name: string;
  gender: Gender;
  dob: string; // YYYY-MM-DD
  tob: string; // HH:mm:ss
  latitude: number;
  longitude: number;
  placeName: string;
  state?: string;
  country: string;
  timezoneId: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface PlanetPosition {
  planet: 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu' | 'Uranus' | 'Neptune' | 'Pluto';
  planetHindi: string; // e.g. 'सूर्य (Sun)'
  longitude: number; // 0 to 360 degrees
  degreeInSign: number; // 0 to 30 degrees
  rashiIndex: number; // 0 to 11 (0: Mesha, 11: Meena)
  rashiName: string; // 'Mesha', 'Vrishabha', etc.
  rashiLord: string;
  nakshatraIndex: number; // 0 to 26
  nakshatraName: string;
  nakshatraLord: string;
  pada: number; // 1 to 4
  house: number; // 1 to 12
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: 'Exalted' | 'Debilitated' | 'Own Sign' | 'Friendly Sign' | 'Enemy Sign' | 'Neutral';
}

export interface HouseCusp {
  houseNumber: number; // 1 to 12
  longitude: number; // 0 to 360 degrees
  rashiIndex: number;
  rashiName: string;
  rashiLord: string;
}

export interface KundliData {
  ayanamsha: AyanamshaType;
  ayanamshaDegree: number;
  engineVersion: string;
  lagnaDegree: number;
  lagnaRashi: string;
  lagnaRashiIndex: number;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  moonRashi: string;
  moonNakshatra: string;
  moonPada: number;
  calculatedAt: string;
}

export interface DivisionalChart {
  chartType: 'D1' | 'D2' | 'D3' | 'D4' | 'D7' | 'D9' | 'D10' | 'D12' | 'D16' | 'D20' | 'D24' | 'D27' | 'D30' | 'D40' | 'D45' | 'D60';
  name: string;
  placements: Array<{
    planet: string;
    rashiIndex: number;
    rashiName: string;
    house: number;
  }>;
}

export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  subPeriods?: DashaPeriod[];
}

export interface VimshottariDashaResult {
  currentMahadasha: string;
  currentAntardasha: string;
  currentPratyantardasha: string;
  dashaBalanceAtBirthYears: number;
  timeline: DashaPeriod[];
}

export interface PanchangData {
  date: string;
  latitude: number;
  longitude: number;
  masa: {
    name: string; // e.g. 'Bhadrapada'
    amantaName: string;
    purnimantaName: string;
    rashiSun: string;
  };
  tithi: {
    number: number;
    name: string;
    paksha: 'Shukla' | 'Krishna';
    completionPercent: number;
  };
  vara: {
    name: string;
    lord: string;
  };
  nakshatra: {
    name: string;
    lord: string;
    pada: number;
  };
  yoga: {
    name: string;
  };
  karana: {
    name: string;
  };
  solarTimes: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
  };
  muhurats: {
    rahuKalam: { start: string; end: string };
    yamaganda: { start: string; end: string };
    gulika: { start: string; end: string };
    abhijit: { start: string; end: string };
  };
}

export interface AshtakootaMatchingResult {
  varna: { score: number; max: 1; name: 'Varna' };
  vashya: { score: number; max: 2; name: 'Vashya' };
  tara: { score: number; max: 3; name: 'Tara' };
  yoni: { score: number; max: 4; name: 'Yoni' };
  grahaMaitri: { score: number; max: 5; name: 'Graha Maitri' };
  gana: { score: number; max: 6; name: 'Gana' };
  bhakoot: { score: number; max: 7; name: 'Bhakoot' };
  nadi: { score: number; max: 8; name: 'Nadi' };
  totalScore: number; // Out of 36
  maxScore: 36;
  isCompatible: boolean;
  manglikAnalysis: {
    personAManglik: boolean;
    personBManglik: boolean;
    isCancelled: boolean;
    summary: string;
  };
}

export interface Astrologer {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  bio: string;
  experienceYears: number;
  perMinuteRate: number;
  rating: number;
  totalConsultations: number;
  isOnline: boolean;
  languages: string[];
  specializations: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}
