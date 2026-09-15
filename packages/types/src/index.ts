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

export type DignityType = 'Exalted' | 'Debilitated' | 'Moolatrikona' | 'Own Sign' | 'Friendly Sign' | 'Enemy Sign' | 'Neutral' | 'Adhi Mitra' | 'Mitra' | 'Sama' | 'Shatru' | 'Adhi Shatru';

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
  house: number; // 1 to 12 (Rashi Lagna based)
  bhavaChalitHouse?: number; // 1 to 12 (Sripati Bhava Chalit based)
  isRetrograde: boolean;
  isCombust: boolean;
  combustionDegrees?: number; // angular separation from Sun
  isMoolatrikona?: boolean;
  dignity: DignityType;
  panchadhaMaitri?: 'Adhi Mitra' | 'Mitra' | 'Sama' | 'Shatru' | 'Adhi Shatru';
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

export interface BhavaChalitCusp {
  houseNumber: number; // 1 to 12
  bhavaMadhyaDegree: number; // Center of house (0-360)
  bhavaMadhyaFormatted: string; // e.g. "14° 32' Makara"
  bhavaSandhiDegree: number; // Junction ending the house
  bhavaSandhiFormatted: string;
  rashiIndex: number;
  rashiName: string;
  rashiLord: string;
  occupants: string[]; // Planets residing in this Bhava Chalit house
}

export interface BhavaChalitChart {
  method: 'Sripati';
  midheavenDegree: number; // MC
  ascendantDegree: number; // Lagna
  houses: BhavaChalitCusp[];
}

export interface PlanetShadbala {
  planet: 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';
  planetHindi: string;
  sthanaBala: number; // Positional (Virupas)
  digBala: number;    // Directional (Virupas)
  kalaBala: number;   // Temporal (Virupas)
  cheshtaBala: number;// Motional (Virupas)
  naisargikaBala: number; // Natural (Virupas)
  drikBala: number;   // Aspectual (Virupas)
  totalVirupas: number; // Total points
  totalRupas: number;   // Virupas / 60
  minimumRequirementRupas: number; // Classical threshold
  strengthRatio: number; // totalRupas / minimumRequirementRupas
  strengthPercentage: number; // Ratio * 100%
  rank: number; // 1 to 7
  status: 'Ati Bali (अति बली)' | 'Bali (बली)' | 'Madhyama (मध्यम)' | 'Heena (हीन बली)';
}

export interface ShadbalaResult {
  planets: PlanetShadbala[];
  strongestPlanet: string;
  weakestPlanet: string;
}

export interface TrikonaShodhanaResult {
  planet: string;
  pointsBefore: number[];
  pointsAfter: number[];
}

export interface EkadhipatyaShodhanaResult {
  planet: string;
  pointsBefore: number[];
  pointsAfter: number[];
}

export interface PindaShodhanaResult {
  planet: string;
  rashiPinda: number;
  grahaPinda: number;
  shodhitaPinda: number; // Rashi Pinda + Graha Pinda
}

export interface AshtakavargaShodhanaResult {
  trikonaShodhana: TrikonaShodhanaResult[];
  ekadhipatyaShodhana: EkadhipatyaShodhanaResult[];
  pindaShodhana: PindaShodhanaResult[];
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
    endingTime?: string; // HH:MM AM/PM IST
  };
  vara: {
    name: string;
    lord: string;
  };
  nakshatra: {
    name: string;
    lord: string;
    pada: number;
    endingTime?: string; // HH:MM AM/PM IST
  };
  yoga: {
    name: string;
    endingTime?: string; // HH:MM AM/PM IST
  };
  karana: {
    name: string;
    type: 'Sthira (स्थिर)' | 'Chara (चर)';
    endingTime?: string; // HH:MM AM/PM IST
  };
  bhadra?: {
    isBhadraActive: boolean;
    bhadraVas: 'Swarga (स्वर्ग)' | 'Patala (पाताल)' | 'Mrityu Loka (पृथ्वी/मृत्युलोक)';
    bhadraImpact: string;
  };
  solarTimes: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    dayDurationMinutes: number;
    nightDurationMinutes: number;
  };
  muhurats: {
    rahuKalam: { start: string; end: string };
    yamaganda: { start: string; end: string };
    gulika: { start: string; end: string };
    abhijit: { start: string; end: string; isProhibited?: boolean; prohibitionReason?: string };
    brahmaMuhurta?: { start: string; end: string };
    amritKalam?: { start: string; end: string };
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

// ==========================================
// 1. JAIMINI ASTROLOGY TYPES
// ==========================================
export type CharaKarakaRole = 'Atmakaraka (AK)' | 'Amatyakaraka (AmK)' | 'Bhratrukaraka (BK)' | 'Matrukaraka (MK)' | 'Putrakaraka (PK)' | 'Gnatikaraka (GK)' | 'Darakaraka (DK)';

export interface CharaKaraka {
  role: CharaKarakaRole;
  abbreviation: 'AK' | 'AmK' | 'BK' | 'MK' | 'PK' | 'GK' | 'DK';
  significanceHindi: string; // e.g. 'आत्मा, स्वयं का स्वरूप'
  planet: string;
  planetHindi: string;
  degreeInSign: number;
  formattedDegree: string;
  rashi: string;
}

export interface ArudhaPada {
  houseNumber: number; // 1 to 12
  code: string; // 'AL' (A1), 'A2', ..., 'A7' (Dara Pada), ..., 'UL' (A12)
  nameHindi: string; // e.g. 'आरूढ़ लग्न (AL)', 'उपपद लग्न (UL)'
  rashiIndex: number; // 0 to 11
  rashiName: string;
  significance: string;
}

export interface JaiminiResult {
  charaKarakas: CharaKaraka[];
  arudhaPadas: ArudhaPada[];
  karakamshaRashi: string;
  karakamshaRashiIndex: number;
  karakamshaSignificance: string;
}

// ==========================================
// 2. KP ASTROLOGY (KRISHNAMURTI PADDHATI) TYPES
// ==========================================
export interface KpPlanetRow {
  planet: string;
  planetHindi: string;
  longitude: number;
  formattedDegree: string;
  rashi: string;
  rashiLord: string;
  nakshatra: string;
  nakshatraLord: string;
  subLord: string;
  subSubLord: string;
  house: number;
}

export interface KpCuspRow {
  house: number; // 1 to 12
  cuspDegree: number;
  formattedDegree: string;
  rashi: string;
  rashiLord: string;
  nakshatra: string;
  nakshatraLord: string;
  subLord: string;
  subSubLord: string;
}

export interface KpSignificatorGrade {
  house: number;
  planetsGradeA: string[]; // Planets in star of occupants
  planetsGradeB: string[]; // Occupants of the house
  planetsGradeC: string[]; // Planets in star of house lord
  planetsGradeD: string[]; // House lord
}

export interface RulingPlanets {
  dayLord: string;
  moonSignLord: string;
  moonStarLord: string;
  ascendantSignLord: string;
  ascendantStarLord: string;
}

export interface KpResult {
  ayanamshaName: 'KP (Krishnamurti New)';
  ayanamshaValue: number;
  formattedAyanamsha: string;
  planets: KpPlanetRow[];
  cusps: KpCuspRow[];
  significators: KpSignificatorGrade[];
  rulingPlanets: RulingPlanets;
}

// ==========================================
// 3. GOCHAR (TRANSIT) & SADE SATI TYPES
// ==========================================
export interface TransitPlanetPosition {
  planet: string;
  planetHindi: string;
  currentRashi: string;
  currentRashiIndex: number;
  formattedDegree: string;
  houseFromLagna: number;
  houseFromMoon: number;
  isRetrograde: boolean;
  transitResultHindi: string;
  kakshyaLord: string;
  isKakshyaAuspicious: boolean; // Contributed bindu in natal Ashtakavarga
}

export interface SadeSatiPhase {
  phaseName: 'First Phase (उदयमान/मस्तक)' | 'Peak Phase (शिखर/उदर)' | 'Setting Phase (अस्तगामी/पाद)';
  saturnRashi: string;
  houseFromMoon: number; // 12, 1, or 2
  status: 'Past' | 'Active Now' | 'Upcoming';
  approximateYears: string;
  impactHindi: string;
}

export interface SadeSatiResult {
  isSadeSatiActive: boolean;
  activePhase?: 'First Phase (उदयमान/मस्तक)' | 'Peak Phase (शिखर/उदर)' | 'Setting Phase (अस्तगामी/पाद)';
  saturnTransitRashi: string;
  houseFromMoon: number;
  dhaiyaStatus: 'Kantaka Shani (4th/अर्ध कंटक)' | 'Ashtama Shani (8th/अष्टम शनि)' | 'None';
  summaryHindi: string;
  remedies: string[];
}

export interface TransitResult {
  transitDate: string;
  natalMoonRashi: string;
  natalLagnaRashi: string;
  planets: TransitPlanetPosition[];
  sadeSati: SadeSatiResult;
}

// ==========================================
// 4. CHOGHADIYA & HORA MUHURAT TYPES
// ==========================================
export type ChoghadiyaType = 'Amrit (अमृत)' | 'Shubh (शुभ)' | 'Labh (लाभ)' | 'Chal (चर)' | 'Rog (रोग)' | 'Kaal (काल)' | 'Udveg (उद्वेग)';

export interface ChoghadiyaEntry {
  periodIndex: number; // 1 to 8
  name: ChoghadiyaType;
  nature: 'Auspicious (शुभ)' | 'Neutral (सामान्य)' | 'Inauspicious (अशुभ)';
  rulingPlanet: string;
  startTime: string; // HH:MM AM/PM
  endTime: string;   // HH:MM AM/PM
  suitableForHindi: string;
}

export interface HoraEntry {
  hourIndex: number; // 1 to 24
  startTime: string;
  endTime: string;
  rulingPlanet: string;
  rulingPlanetHindi: string;
  significanceHindi: string;
}

export interface MuhuratSystemResult {
  date: string;
  sunrise: string;
  sunset: string;
  dayChoghadiya: ChoghadiyaEntry[];
  nightChoghadiya: ChoghadiyaEntry[];
  currentChoghadiya?: ChoghadiyaEntry;
  horas: HoraEntry[];
}

// ==========================================
// 5. LAL KITAB ASTROLOGY TYPES
// ==========================================
export interface LalKitabPlanetPosition {
  planet: string;
  planetHindi: string;
  lalKitabHouse: number; // 1 to 12 (Fixed Aries as 1st house)
  rashiLagnaHouse: number;
  isSleeping: boolean; // Soya Hua Grah
  nature: 'Kayam (नेकी)' | 'Soya (सुप्त)' | 'Mandha (मंदा)' | 'Acha (उत्तम)';
  specificRemedyHindi: string;
}

export interface LalKitabHouseState {
  houseNumber: number;
  isSleeping: boolean; // Soya Ghar (no planets and no aspects)
  occupants: string[];
}

export interface LalKitabDebt {
  debtName: 'Pitru Rin (पितृ ऋण)' | 'Matru Rin (मातृ ऋण)' | 'Stri Rin (स्त्री ऋण)' | 'Bhratri Rin (भ्रातृ ऋण)' | 'Svayam Rin (स्व-ऋण)' | 'Kudarati Rin (कुदरती ऋण)';
  isApplicable: boolean;
  causeHindi: string;
  indicationsHindi: string;
  remedyHindi: string;
}

export interface LalKitabResult {
  tevaType: 'Dharmi Teva (धर्मी तेवा)' | 'Andha Teva (अंधा तेवा)' | 'Nabaligh Teva (नाबालिग तेवा)' | 'Aam Teva (सामान्य तेवा)';
  tevaDescriptionHindi: string;
  planets: LalKitabPlanetPosition[];
  sleepingHouses: number[];
  debts: LalKitabDebt[];
}
