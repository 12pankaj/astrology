// App Constants, Ayanamsha Configuration & Feature Flag Defaults

export const DEFAULT_AYANAMSHA = 'LAHIRI';

export const ENGINE_VERSION = '1.0.0';

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

export const FEATURE_FLAGS_DEFAULTS = {
  kundli: true,
  matching: true,
  panchang: true,
  astrologer_chat: true,
  ai_astrologer: true,
  premium_reports: true
};

export const RASHI_NAMES = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
] as const;

export const RASHI_LORDS = [
  'Mars/Mangal', 'Venus/Shukra', 'Mercury/Budha', 'Moon/Chandra',
  'Sun/Surya', 'Mercury/Budha', 'Venus/Shukra', 'Mars/Mangal',
  'Jupiter/Guru', 'Saturn/Shani', 'Saturn/Shani', 'Jupiter/Guru'
] as const;

export const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
] as const;

export const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
] as const;

export const PLANET_NAMES = [
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu', 'Uranus', 'Neptune', 'Pluto'
] as const;

export const PLANET_HINDI_NAMES: Record<string, string> = {
  Sun: 'सूर्य (Surya)',
  Moon: 'चंद्र (Chandra)',
  Mars: 'मंगल (Mangal)',
  Mercury: 'बुध (Budha)',
  Jupiter: 'गुरु (Guru)',
  Venus: 'शुक्र (Shukra)',
  Saturn: 'शनि (Shani)',
  Rahu: 'राहु (Rahu)',
  Ketu: 'केतु (Ketu)',
  Uranus: 'प्रजापति/अरुण (Uranus)',
  Neptune: 'वरुण (Neptune)',
  Pluto: 'यम/कुबेर (Pluto)'
};

export const PLANET_SYMBOLS_BILINGUAL: Record<string, string> = {
  Sun: 'सू/Su',
  Moon: 'चं/Mo',
  Mars: 'मं/Ma',
  Mercury: 'बु/Me',
  Jupiter: 'गु/Ju',
  Venus: 'शु/Ve',
  Saturn: 'श/Sa',
  Rahu: 'रा/Ra',
  Ketu: 'के/Ke',
  Uranus: 'अरु/Ur',
  Neptune: 'वरु/Ne',
  Pluto: 'यम/Pl'
};
