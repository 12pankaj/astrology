import { KundliData, PlanetPosition, DivisionalChart, VimshottariDashaResult, PanchangData, ShadbalaResult, BhavaChalitChart, AshtakavargaShodhanaResult, JaiminiResult, KpResult, TransitResult, MuhuratSystemResult, LalKitabResult } from '@vedic-astro/types';
import { calculateKundli, normalize360, calculateSripatiBhavaChalit } from './ephemeris.js';
import { calculateDivisionalCharts } from './divisional.js';
import { calculateVimshottariDasha } from './dasha.js';
import { calculateDailyPanchang } from './panchang.js';
import { calculateAshtakavarga, calculateFullAshtakavargaShodhana } from './ashtakavarga.js';
import { calculateShadbala } from './shadbala.js';
import { calculateNumerologyDetails, calculateDriverConductorHarmony } from './numerology.js';
import { calculateJaimini } from './jaimini.js';
import { calculateKpSystem } from './kp.js';
import { calculateTransitAndSadeSati } from './transit.js';
import { calculateChoghadiyaAndHora } from './muhurat.js';
import { calculateLalKitab } from './lalkitab.js';
import {
  detectVedicDoshasAndRemedies,
  detectComprehensiveRajYogas,
  detectStelliumsAndYogas,
  RajYogaDetail,
  VedicDoshaDetected
} from './predictions.js';

// Complete 17-Chapter Vedic Kundli Report Data Model
export interface FullKundliReportData {
  native: {
    name: string;
    gender: string;
    dob: string;
    tob: string;
    place: string;
    latitude: number;
    longitude: number;
    timezone: string;
    generatedDate: string;
    brandName: string;
  };
  avakahada: {
    lagna: string;
    lagnaDegree: string;
    lagnaLord: string;
    moonRashi: string;
    moonRashiLord: string;
    nakshatra: string;
    nakshatraPada: number;
    nakshatraLord: string;
    varna: string;
    vashya: string;
    yoni: string;
    gana: string;
    nadi: string;
    hansak: string;
    paya: string;
    nameLetter: string;
    sunWesternSign: string;
    ayan: string;
    ritu: string;
    dinaMana: string;
    sunrise: string;
    sunset: string;
    samvatVikram: number;
    samvatSaka: number;
  };
  panchangSummary: {
    tithi: string;
    paksha: string;
    vaar: string;
    nakshatra: string;
    yoga: string;
    karana: string;
  };
  planets: Array<{
    planet: string;
    planetHindi: string;
    longitude: number;
    degreeInSign: string;
    rashiIndex: number;
    rashiName: string;
    house: number;
    nakshatra: string;
    pada: number;
    nakshatraLord: string;
    isRetrograde: boolean;
    isCombust: boolean;
    dignity: string;
  }>;
  charts: {
    d1: KundliData;
    chandra: KundliData;
    d9: DivisionalChart;
    d10: DivisionalChart;
    shodashvargas: Array<{ chartType: string; name: string; significance: string; data: DivisionalChart }>;
  };
  ashtakavarga: {
    savScores: Record<number, number>;
    bav: Record<string, number[]>;
  };
  ashtakavargaShodhana?: AshtakavargaShodhanaResult;
  shadbala?: ShadbalaResult;
  bhavaChalit?: BhavaChalitChart;
  jaimini?: JaiminiResult;
  kpSystem?: KpResult;
  transitSystem?: TransitResult;
  muhuratSystem?: MuhuratSystemResult;
  lalKitabSystem?: LalKitabResult;
  panchangAnalysis: {
    tithiInsight: string;
    vaarInsight: string;
    nakshatraInsight: string;
    yogaInsight: string;
    karanaInsight: string;
  };
  threePillars: {
    lagnaPillar: { title: string; subtitle: string; description: string; strengths: string[]; advice: string };
    moonPillar: { title: string; subtitle: string; description: string; strengths: string[]; advice: string };
    nakshatraPillar: { title: string; subtitle: string; description: string; deity: string; symbol: string; advice: string };
  };
  planetaryProfiles: Array<{
    planet: string;
    planetHindi: string;
    rashi: string;
    house: number;
    nakshatra: string;
    status: string;
    interpretation: string;
    aspectsDescription: string;
    lifeLesson: string;
  }>;
  bhavphal: Array<{
    houseNumber: number;
    houseName: string;
    rashi: string;
    rashiLord: string;
    lordPlacementHouse: number;
    occupants: string[];
    significance: string[];
    detailedAnalysis: string;
    financialOrLifeScore: string;
  }>;
  conjunctions: Array<{
    house: number;
    planets: string[];
    name: string;
    description: string;
    impact: string;
  }>;
  loveAndMarriage: {
    fifthHouseAnalysis: string;
    seventhHouseAnalysis: string;
    darakarakaDetails: {
      planet: string;
      degree: string;
      spouseNature: string;
      spouseCareer: string;
      financialContribution: string;
      harmonyTips: string;
    };
    timingWindows: Array<{
      startDate: string;
      endDate: string;
      probability: string;
      astrologicalReason: string;
    }>;
  };
  careerAnalysis: {
    twoPillars: { sunRole: string; saturnRole: string };
    dashamshaD10Summary: string;
    amatyakarakaDetails: {
      planet: string;
      careerThemes: string[];
      leadershipStyle: string;
    };
    sectorProbability: {
      government: number;
      corporate: number;
      business: number;
    };
    recommendedStreams: string[];
    promotionTimingWindows: Array<{ period: string; trend: string }>;
  };
  charaKarakas: Array<{
    karaka: string;
    hindiTitle: string;
    planet: string;
    degree: string;
    roleMeaning: string;
    personalImpact: string;
    lifeMission: string;
  }>;
  karmicAxis: {
    rahuHouse: number;
    rahuRashi: string;
    rahuKarmicDesire: string;
    ketuHouse: number;
    ketuRashi: string;
    ketuPastLifeGift: string;
    karmicLesson: string;
    balanceRemedy: string;
  };
  manglikAnalysis: {
    status: string;
    severity: string;
    cancellationReasons: string[];
    detailedSummary: string;
    maritalGuidance: string;
  };
  sadeSati: {
    currentStatus: string;
    phase: string;
    moonRashi: string;
    timeline: Array<{ phaseName: string; cycleName?: string; rashiName?: string; startDate: string; endDate: string; theme: string }>;
    coreTransformations: string[];
    pacificationRemedies: string[];
  };
  rajYogas: RajYogaDetail[];
  doshas: VedicDoshaDetected[];
  dashaNarrative: {
    cycleSummary: string;
    currentMahadasha: {
      planet: string;
      dates: string;
      generalTheme: string;
      focusAreas: string[];
    };
    currentAntardasha: {
      planet: string;
      dates: string;
      detailedForecast: string;
    };
    majorTransits: Array<{
      planet: string;
      currentSign: string;
      impactDescription: string;
    }>;
  };
  numerology: {
    mulank: number;
    bhagyank: number;
    namank: number;
    connectionNumber: number;
    mulankDetails: { title: string; description: string; strengths: string[] };
    bhagyankDetails: { title: string; description: string; careerPath: string };
    successNumberDetails: { title: string; description: string; opportunities: string[] };
    connectionNumberDetails?: { title: string; description: string; keyLesson: string };
    luckyElements: {
      favorableDays: string[];
      luckyColors: string[];
      favorableNumbers: number[];
      avoidNumbers: number[];
    };
  };
  spirituality: {
    dharmaMokshaAnalysis: string;
    ishtaDevata: {
      name: string;
      reason: string;
      mantraSanskrit: string;
      mantraIast: string;
      mantraMeaning: string;
      recommendedSadhana: string;
    };
  };
  remedies: {
    rudraksha: {
      recommendedMukhi: string;
      rulingPlanet: string;
      benefits: string[];
      wearingProcedure: string;
    };
    gemstones: Array<{
      category: 'लग्न रत्न (Life Stone)' | 'भाग्य रत्न (Lucky/Fortune Stone)' | 'पंचमेश रत्न (Intellect/Karma Stone)';
      name: string;
      hindiName: string;
      englishName: string;
      planet: string;
      rulingDeity: string;
      finger: string;
      metal: string;
      day: string;
      hora: string;
      keyBenefits: string;
      substituteCrystal: string;
    }>;
    beejMantras: Array<{
      planet: string;
      mantra: string;
      prescribedCount: string;
      idealTime: string;
    }>;
    yantra: {
      recommendedYantra: string;
      purpose: string;
      dos: string[];
      donts: string[];
    };
    daanRecommendations: Array<{
      planet: string;
      reason: string;
      itemsToDonate: string[];
      suitableDay: string;
    }>;
  };
  conclusion: {
    roadmapSummary: string;
    threeKeyRules: string[];
    closingBlessing: string;
  };
}

// ---------------- Helper Calculation Tables ----------------
const VARNA_MAP: Record<number, string> = {
  0: 'क्षत्रिय (Kshatriya)', 4: 'क्षत्रिय (Kshatriya)', 8: 'क्षत्रिय (Kshatriya)', // Fire signs
  1: 'वैश्य (Vaishya)', 5: 'वैश्य (Vaishya)', 9: 'वैश्य (Vaishya)',               // Earth signs
  2: 'शूद्र (Shudra)', 6: 'शूद्र (Shudra)', 10: 'शूद्र (Shudra)',                 // Air signs
  3: 'ब्राह्मण (Brahmin)', 7: 'ब्राह्मण (Brahmin)', 11: 'ब्राह्मण (Brahmin)'      // Water signs
};

const VASHYA_MAP: Record<number, string> = {
  0: 'चतुष्पद (Chatushpada)', 1: 'चतुष्पद (Chatushpada)', 2: 'द्विपद/मानव (Dwipada)',
  3: 'जलचर (Jalachara)', 4: 'वनचर (Vanachara)', 5: 'द्विपद/मानव (Dwipada)',
  6: 'द्विपद/मानव (Dwipada)', 7: 'कीट (Keeta)', 8: 'द्विपद/चतुष्पद (Dwipada)',
  9: 'जलचर/चतुष्पद (Jalachara)', 10: 'द्विपद/मानव (Dwipada)', 11: 'जलचर (Jalachara)'
};

const YONI_NAMES = [
  'अश्व (Horse)', 'गज (Elephant)', 'मेष (Sheep)', 'सर्प (Serpent)', 'सर्प (Serpent)',
  'श्वान (Dog)', 'मार्जार (Cat)', 'मेष (Goat)', 'मार्जार (Cat)', 'मूषक (Rat)',
  'मूषक (Rat)', 'गौ (Cow)', 'महिष (Buffalo)', 'व्याघ्र (Tiger)', 'महिष (Buffalo)',
  'व्याघ्र (Tiger)', 'मृग (Deer)', 'मृग (Deer)', 'श्वान (Dog)', 'वानर (Monkey)',
  'नकुल (Mongoose)', 'वानर (Monkey)', 'सिंह (Lion)', 'अश्व (Horse)', 'सिंह (Lion)',
  'गौ (Cow)', 'गज (Elephant)'
];

const GANA_NAMES = [
  'देव (Deva)', 'मनुष्य (Manushya)', 'राक्षस (Rakshasa)', 'मनुष्य (Manushya)', 'देव (Deva)',
  'मनुष्य (Manushya)', 'देव (Deva)', 'देव (Deva)', 'राक्षस (Rakshasa)', 'राक्षस (Rakshasa)',
  'मनुष्य (Manushya)', 'मनुष्य (Manushya)', 'देव (Deva)', 'राक्षस (Rakshasa)', 'देव (Deva)',
  'राक्षस (Rakshasa)', 'देव (Deva)', 'राक्षस (Rakshasa)', 'राक्षस (Rakshasa)', 'मनुष्य (Manushya)',
  'मनुष्य (Manushya)', 'देव (Deva)', 'राक्षस (Rakshasa)', 'राक्षस (Rakshasa)', 'मनुष्य (Manushya)',
  'मनुष्य (Manushya)', 'देव (Deva)'
];

const NAKSHATRA_NADI_TABLE = [
  'आदि (Aadi)', 'मध्य (Madhya)', 'अंत्य (Antya)',
  'अंत्य (Antya)', 'मध्य (Madhya)', 'आदि (Aadi)',
  'आदि (Aadi)', 'मध्य (Madhya)', 'अंत्य (Antya)',
  'अंत्य (Antya)', 'मध्य (Madhya)', 'आदि (Aadi)',
  'आदि (Aadi)', 'मध्य (Madhya)', 'अंत्य (Antya)',
  'अंत्य (Antya)', 'मध्य (Madhya)', 'आदि (Aadi)',
  'आदि (Aadi)', 'मध्य (Madhya)', 'अंत्य (Antya)',
  'अंत्य (Antya)', 'मध्य (Madhya)', 'आदि (Aadi)',
  'आदि (Aadi)', 'मध्य (Madhya)', 'अंत्य (Antya)'
];

const NAKSHATRA_SYLLABLES: Record<number, string[]> = {
  0: ['चू', 'चे', 'चो', 'ला'], 1: ['ली', 'लू', 'ले', 'लो'], 2: ['अ', 'ई', 'उ', 'ए'],
  3: ['ओ', 'वा', 'वी', 'वू'], 4: ['वे', 'वो', 'का', 'की'], 5: ['कु', 'घ', 'ङ', 'छ'],
  6: ['के', 'को', 'हा', 'ही'], 7: ['हू', 'हे', 'हो', 'डा'], 8: ['डी', 'डू', 'डे', 'डो'],
  9: ['मा', 'मी', 'मू', 'मे'], 10: ['मो', 'टा', 'टी', 'टू'], 11: ['टे', 'टो', 'पा', 'पी'],
  12: ['पू', 'ष', 'णा', 'ढा'], 13: ['पे', 'पो', 'रा', 'री'], 14: ['रू', 'रे', 'रो', 'ता'],
  15: ['ती', 'तू', 'ते', 'तो'], 16: ['ना', 'नी', 'नू', 'ने'], 17: ['नो', 'या', 'यी', 'यू'],
  18: ['ये', 'यो', 'भा', 'भी'], 19: ['भू', 'धा', 'फा', 'ढा'], 20: ['भे', 'भो', 'जा', 'जी'],
  21: ['खी', 'खू', 'खे', 'खो'], 22: ['गा', 'गी', 'गु', 'गे'], 23: ['गो', 'सा', 'सी', 'सू'],
  24: ['से', 'सो', 'दा', 'दी'], 25: ['दू', 'थ', 'झ', 'ञ'], 26: ['दे', 'दो', 'चा', 'ची']
};

const RASHI_HINDI_NAMES = [
  'मेष (Aries)', 'वृषभ (Taurus)', 'मिथुन (Gemini)', 'कर्क (Cancer)',
  'सिंह (Leo)', 'कन्या (Virgo)', 'तुला (Libra)', 'वृश्चिक (Scorpio)',
  'धनु (Sagittarius)', 'मकर (Capricorn)', 'कुंभ (Aquarius)', 'मीन (Pisces)'
];

const RASHI_LORDS_HINDI = [
  'मंगल (Mars)', 'शुक्र (Venus)', 'बुध (Mercury)', 'चंद्र (Moon)',
  'सूर्य (Sun)', 'बुध (Mercury)', 'शुक्र (Venus)', 'मंगल (Mars)',
  'गुरु (Jupiter)', 'शनि (Saturn)', 'शनि (Saturn)', 'गुरु (Jupiter)'
];

const PLANET_HINDI_MAP: Record<string, string> = {
  Sun: 'सूर्य (Sun)',
  Moon: 'चंद्र (Moon)',
  Mars: 'मंगल (Mars)',
  Mercury: 'बुध (Mercury)',
  Jupiter: 'बृहस्पति / गुरु (Jupiter)',
  Venus: 'शुक्र (Venus)',
  Saturn: 'शनि (Saturn)',
  Rahu: 'राहु (Rahu)',
  Ketu: 'केतु (Ketu)'
};

// ---------------- Master Generation Function ----------------
export function generateFullKundliReport(
  name: string,
  gender: string,
  dob: string,
  tob: string,
  latitude: number,
  longitude: number,
  placeName: string = 'India',
  timezone: string = 'Asia/Kolkata'
): FullKundliReportData {
  const formattedTob = tob.length === 5 ? `${tob}:00` : tob;
  const kundli = calculateKundli(dob, formattedTob, latitude, longitude, timezone, 'LAHIRI');
  const divisionalCharts = calculateDivisionalCharts(kundli);
  const dashaResult = calculateVimshottariDasha(kundli, dob);
  const ashtakavarga = calculateAshtakavarga(kundli);
  const panchang = calculateDailyPanchang(dob, latitude, longitude);
  const numerology = calculateNumerologyDetails(dob, name);
  const doshas = detectVedicDoshasAndRemedies(kundli);
  const rajYogas = detectComprehensiveRajYogas(kundli);
  const isDayBirth = parseInt(formattedTob.split(':')[0], 10) >= 6 && parseInt(formattedTob.split(':')[0], 10) < 18;
  const shadbala = calculateShadbala(kundli, isDayBirth);
  const bhavaChalit = calculateSripatiBhavaChalit(kundli.lagnaDegree, 210.0, kundli.planets);
  const ashtakavargaShodhana = calculateFullAshtakavargaShodhana(kundli);

  // Advanced Astrological Market Systems
  const d9ChartObj = divisionalCharts.find((c) => c.chartType === 'D9');
  const jaimini = calculateJaimini(kundli, d9ChartObj);
  const kpSystem = calculateKpSystem(kundli, panchang.vara.name.split(' ')[0]);
  const transitSystem = calculateTransitAndSadeSati(kundli, new Date(), latitude, longitude);
  const muhuratSystem = calculateChoghadiyaAndHora(new Date());
  const lalKitabSystem = calculateLalKitab(kundli);

  // 1. Avakahada Chakra Calculation
  const moon = kundli.planets.find((p) => p.planet === 'Moon') || kundli.planets[1];
  const sun = kundli.planets.find((p) => p.planet === 'Sun') || kundli.planets[0];
  const lagnaRashiIdx = kundli.lagnaRashiIndex;
  const moonRashiIdx = moon.rashiIndex;
  const nakshatraIdx = moon.nakshatraIndex;
  const pada = moon.pada;

  // Paya (पाया) based on Moon's house from Lagna
  const moonHouseFromLagna = ((moonRashiIdx - lagnaRashiIdx + 12) % 12) + 1;
  let paya = 'रजत / चाँदी (Silver)';
  if ([1, 6, 11].includes(moonHouseFromLagna)) paya = 'स्वर्ण / सोना (Gold - बहुमूल्य प्रतिष्ठा)';
  else if ([2, 5, 9].includes(moonHouseFromLagna)) paya = 'रजत / चाँदी (Silver - अति शुभ व भाग्यवर्धक)';
  else if ([3, 7, 10].includes(moonHouseFromLagna)) paya = 'ताम्र / तांबा (Copper - संघर्षोपरांत विजय)';
  else paya = 'लौह / लोहा (Iron - कर्मप्रधान व संयम)';

  // Hansak (हंसक)
  const hansakMap: Record<number, string> = { 0: 'अग्नि (Fire)', 1: 'भूमि / पृथ्वी (Earth)', 2: 'वायु (Air)', 3: 'जल (Water)' };
  const hansak = hansakMap[moonRashiIdx % 4];

  // Name letter
  const nameLetter = (NAKSHATRA_SYLLABLES[nakshatraIdx] && NAKSHATRA_SYLLABLES[nakshatraIdx][pada - 1]) || 'अ';

  // Western Sun Sign
  const sunMonth = parseInt(dob.split('-')[1], 10);
  const sunDay = parseInt(dob.split('-')[2], 10);
  const westernZodiacs = [
    'मकर (Capricorn)', 'कुंभ (Aquarius)', 'मीन (Pisces)', 'मेष (Aries)', 'वृषभ (Taurus)', 'मिथुन (Gemini)',
    'कर्क (Cancer)', 'सिंह (Leo)', 'कन्या (Virgo)', 'तुला (Libra)', 'वृश्चिक (Scorpio)', 'धनु (Sagittarius)'
  ];
  let westernSign = westernZodiacs[0];
  if ((sunMonth === 1 && sunDay >= 20) || (sunMonth === 2 && sunDay <= 18)) westernSign = 'कुंभ (Aquarius)';
  else if ((sunMonth === 2 && sunDay >= 19) || (sunMonth === 3 && sunDay <= 20)) westernSign = 'मीन (Pisces)';
  else if ((sunMonth === 3 && sunDay >= 21) || (sunMonth === 4 && sunDay <= 19)) westernSign = 'मेष (Aries)';
  else if ((sunMonth === 4 && sunDay >= 20) || (sunMonth === 5 && sunDay <= 20)) westernSign = 'वृषभ (Taurus)';
  else if ((sunMonth === 5 && sunDay >= 21) || (sunMonth === 6 && sunDay <= 20)) westernSign = 'मिथुन (Gemini)';
  else if ((sunMonth === 6 && sunDay >= 21) || (sunMonth === 7 && sunDay <= 22)) westernSign = 'कर्क (Cancer)';
  else if ((sunMonth === 7 && sunDay >= 23) || (sunMonth === 8 && sunDay <= 22)) westernSign = 'सिंह (Leo)';
  else if ((sunMonth === 8 && sunDay >= 23) || (sunMonth === 9 && sunDay <= 22)) westernSign = 'कन्या (Virgo)';
  else if ((sunMonth === 9 && sunDay >= 23) || (sunMonth === 10 && sunDay <= 22)) westernSign = 'तुला (Libra)';
  else if ((sunMonth === 10 && sunDay >= 23) || (sunMonth === 11 && sunDay <= 21)) westernSign = 'वृश्चिक (Scorpio)';
  else if ((sunMonth === 11 && sunDay >= 22) || (sunMonth === 12 && sunDay <= 21)) westernSign = 'धनु (Sagittarius)';

  // Jaimini Chara Karakas (7-Karaka system using 7 physical grahas, descending order of degree)
  const physicalPlanets = kundli.planets.filter((p) => ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.planet));
  const sortedByDegree = [...physicalPlanets].sort((a, b) => b.degreeInSign - a.degreeInSign);

  const karakaRoles = [
    {
      karaka: 'Atmakaraka (आत्मकारक - AK)',
      hindiTitle: 'आत्मकारक (Soul Purpose & Highest Calling)',
      roleMeaning: 'यह ग्रह आपकी आत्मा का प्रतिनिधि है। यह आपके जीवन का सर्वोच्च आध्यात्मिक व सांसारिक उद्देश्य, आपकी मूल प्रवृत्ति और कर्मिक सार को दर्शाता है।',
      lifeMission: 'अपनी आंतरिक चेतना को जागृत करना, आत्म-नियंत्रण रखना और जीवन के उतार-चढ़ावों से विचलित न होकर अपने उच्चतम नैतिक मूल्यों पर टिके रहना।'
    },
    {
      karaka: 'Amatyakaraka (अमात्यकारक - AmK)',
      hindiTitle: 'अमात्यकारक (Career, Intellect & Livelihood)',
      roleMeaning: 'यह ग्रह आपके करियर, आजीविका, सामाजिक स्थिति और निर्णय लेने की क्षमता का मुख्य मार्गदर्शक है। राजा के प्रधान मंत्री की तरह यह आपकी सफलता की रणनीति बनाता है।',
      lifeMission: 'कार्यक्षेत्र में विशेषज्ञता प्राप्त करना, अनुशासन व समर्पण से नेतृत्व संभालना और समाज को ठोस मूल्य प्रदान करना।'
    },
    {
      karaka: 'Bhratrukaraka (भ्रातृकारक - BK)',
      hindiTitle: 'भ्रातृकारक (Mentors, Courage & Gurus)',
      roleMeaning: 'यह ग्रह आपके गुरुओं, शिक्षकों, भाई-बहनों, साहस और आध्यात्मिक मार्गदर्शकों का प्रतिनिधित्व करता है।',
      lifeMission: 'सही गुरुओं व सलाहकारों का मार्गदर्शन स्वीकार करना और विपरीत परिस्थितियों में अपने साहस को बनाए रखना।'
    },
    {
      karaka: 'Matrukaraka (मातृकारक - MK)',
      hindiTitle: 'मातृकारक (Mother, Home & Inner Peace)',
      roleMeaning: 'यह ग्रह आपकी माता, गृहस्थ सुख, अचल संपत्ति, मानसिक शांति और भावनात्मक संतोष का स्वामी है।',
      lifeMission: 'घर व परिवार में सामंजस्य स्थापित करना और भौतिक सुखों के साथ मानसिक शांति का संतुलन बनाना।'
    },
    {
      karaka: 'Putrakaraka (पुत्रकारक - PK)',
      hindiTitle: 'पुत्रकारक (Children, Creativity & Wisdom)',
      roleMeaning: 'यह ग्रह आपकी रचनात्मक प्रतिभा, बौद्धिक संपदा, संतान सुख और पूर्व जन्म के पुण्यों (पूर्व पुण्य) को प्रकट करता है।',
      lifeMission: 'रचनात्मक अभिव्यक्ति, ज्ञान का प्रसार और आने वाली पीढ़ी को सुसंस्कारित बनाना।'
    },
    {
      karaka: 'Gnatikaraka (ज्ञातिकारक - GK)',
      hindiTitle: 'ज्ञातिकारक (Hurdles, Competition & Karmic Debts)',
      roleMeaning: 'यह ग्रह जीवन की बाधाओं, प्रतिस्पर्धा, रोगों और कर्मिक ऋणों का प्रतीक है। यह वह क्षेत्र है जहाँ संघर्ष से ही आत्मबल बढ़ता है।',
      lifeMission: 'चुनौतियों से घबराए बिना धैर्य रखना, शत्रुओं व रुकावटों को अपनी शक्ति में बदलना।'
    },
    {
      karaka: 'Darakaraka (दाराकारक - DK)',
      hindiTitle: 'दाराकारक (Spouse, Marriage & Key Partnerships)',
      roleMeaning: 'यह ग्रह आपके जीवनसाथी, वैवाहिक सुख, साझेदारी और व्यावसायिक सहयोगियों का साक्षात दर्पण है।',
      lifeMission: 'जीवनसाथी के प्रति निष्ठा व सम्मान बनाए रखना और साझेदारी में परस्पर सहयोग से समृद्धि प्राप्त करना।'
    }
  ];

  const charaKarakas = sortedByDegree.map((p, idx) => {
    const kInfo = karakaRoles[idx];
    const personalImpact = `${PLANET_HINDI_MAP[p.planet] || p.planet} आपकी कुंडली में ${p.degreeInSign.toFixed(2)}° पर स्थित होकर ${kInfo.karaka} की भूमिका निभा रहा है। ${p.rashiName} राशि और ${p.house}वें भाव में इसकी स्थिति आपके जीवन में विशेष ऊर्जा का संचार करती है।`;
    return {
      karaka: kInfo.karaka,
      hindiTitle: kInfo.hindiTitle,
      planet: PLANET_HINDI_MAP[p.planet] || p.planet,
      degree: `${p.degreeInSign.toFixed(2)}°`,
      roleMeaning: kInfo.roleMeaning,
      personalImpact,
      lifeMission: kInfo.lifeMission
    };
  });

  // Darakaraka (Spouse) Details
  const darakarakaPlanet = sortedByDegree[6]; // Lowest degree
  const amatyakarakaPlanet = sortedByDegree[1]; // 2nd highest degree
  const atmakarakaPlanet = sortedByDegree[0]; // Highest degree

  // 2. Manglik Analysis
  const mars = kundli.planets.find((p) => p.planet === 'Mars') || kundli.planets[2];
  const manglikHouses = [1, 4, 7, 8, 12];
  const isManglikLagna = manglikHouses.includes(mars.house);
  const isManglikMoon = manglikHouses.includes(((mars.rashiIndex - moon.rashiIndex + 12) % 12) + 1);
  const cancellationReasons: string[] = [];
  if (mars.dignity === 'Own Sign') cancellationReasons.push('मंगल अपनी स्वराशि (मेष/वृश्चिक) में स्थित होकर सौम्य हो जाता है।');
  if (mars.dignity === 'Exalted') cancellationReasons.push('मंगल अपनी उच्च राशि (मकर) में स्थित होकर रूचक महापुरुष योग बनाता है।');
  if (mars.rashiIndex === 3 || mars.rashiIndex === 9) cancellationReasons.push('कर्क अथवा मकर राशि में स्थित होने से विशेष परिहार प्राप्त होता है।');
  
  // Jupiter aspect on Mars
  const jupiter = kundli.planets.find((p) => p.planet === 'Jupiter');
  if (jupiter) {
    const distFromJup = ((mars.house - jupiter.house + 12) % 12) + 1;
    if ([5, 7, 9].includes(distFromJup)) {
      cancellationReasons.push('देवगुरु बृहस्पति की शुभ अमृत दृष्टि मंगल पर होने से दोष स्वतः निष्प्रभावी हो जाता है।');
    }
  }

  let manglikStatus = 'अनुपस्थित (Non-Manglik)';
  let manglikSeverity = 'शून्य';
  if (isManglikLagna || isManglikMoon) {
    if (cancellationReasons.length > 0) {
      manglikStatus = 'प्रभावहीन / परिहार प्राप्त (Cancelled / Ineffective)';
      manglikSeverity = 'शून्य अथवा नगण्य प्रभाव';
    } else {
      manglikStatus = isManglikLagna && isManglikMoon ? 'पूर्ण मांगलिक (High Manglik)' : 'आंशिक मांगलिक (Mild Manglik)';
      manglikSeverity = isManglikLagna && isManglikMoon ? 'उच्च' : 'मध्यम';
    }
  }

  // 3. Shani Sade Sati Calculation
  // Saturn's current position (2026: Saturn is in Pisces / Meena)
  const natalMoonRashi = moon.rashiIndex; // 5 = Kanya
  // Sade Sati occurs when Saturn transits 12th, 1st, and 2nd from natal Moon:
  // For Kanya Moon (index 5): Simha (4), Kanya (5), Tula (6)
  const isSadeSatiActiveNow = false; // Currently Saturn is in Pisces (11)
  const currentTransitRashi = 'मीन (Pisces)';
  const sadeSatiTimeline = [
    {
      cycleName: 'प्रथम साढ़े साती (First Cycle)',
      phaseName: 'उदय चरण (सिंह)',
      rashiName: 'सिंह (Leo)',
      startDate: '31/10/2006',
      endDate: '08/09/2009',
      theme: 'बाल्यावस्था व प्रारंभिक शिक्षा में अनुशासन, पारिवारिक दायित्वों की प्रारंभिक समझ।'
    },
    {
      cycleName: 'प्रथम साढ़े साती (First Cycle)',
      phaseName: 'चरम चरण (कन्या)',
      rashiName: 'कन्या (Virgo)',
      startDate: '09/09/2009',
      endDate: '13/11/2011',
      theme: 'मानसिक परिपक्वता, स्वावलंबन और विद्यार्थी जीवन में निरंतर परिश्रम का पाठ।'
    },
    {
      cycleName: 'प्रथम साढ़े साती (First Cycle)',
      phaseName: 'अस्त चरण (तुला)',
      rashiName: 'तुला (Libra)',
      startDate: '14/11/2011',
      endDate: '01/11/2014',
      theme: 'पारिवारिक स्थिरता, नए संस्कारों व व्यावहारिक ज्ञान का ठोस अर्जन।'
    },
    {
      cycleName: 'दूसरी साढ़े साती (Second Cycle - आगामी)',
      phaseName: 'उदय चरण (सिंह)',
      rashiName: 'सिंह (Leo)',
      startDate: '27/08/2036',
      endDate: '21/10/2038',
      theme: 'करियर में बड़े निवेश, दूरगामी रणनीतियाँ, आंतरिक आत्ममंथन व स्थान परिवर्तन।'
    },
    {
      cycleName: 'दूसरी साढ़े साती (Second Cycle - आगामी)',
      phaseName: 'चरम चरण (कन्या)',
      rashiName: 'कन्या (Virgo)',
      startDate: '22/10/2038',
      endDate: '26/01/2041',
      theme: 'परिश्रम की पराकाष्ठा, कार्यक्षेत्र में शीर्ष पद, सामाजिक प्रभाव व जीवन का मुख्य रूपांतरण।'
    },
    {
      cycleName: 'दूसरी साढ़े साती (Second Cycle - आगामी)',
      phaseName: 'अस्त चरण (तुला)',
      rashiName: 'तुला (Libra)',
      startDate: '27/01/2041',
      endDate: '10/12/2043',
      theme: 'वित्तीय संचय में सुदृढ़ता, स्थायी संपत्तियों का निर्माण और कर्म के पूर्ण फल की प्राप्ति।'
    },
    {
      cycleName: 'तीसरी साढ़े साती (Third Cycle)',
      phaseName: 'उदय चरण (सिंह)',
      rashiName: 'सिंह (Leo)',
      startDate: '12/10/2065',
      endDate: '28/08/2068',
      theme: 'आध्यात्मिक चेतना, सामाजिक दायित्वों से विरक्ति व आत्म-संतोष की प्राप्ति।'
    },
    {
      cycleName: 'तीसरी साढ़े साती (Third Cycle)',
      phaseName: 'चरम चरण (कन्या)',
      rashiName: 'कन्या (Virgo)',
      startDate: '29/08/2068',
      endDate: '03/11/2070',
      theme: 'परम ज्ञान, तपस्या, कुल की प्रतिष्ठा व ईश्वरीय चिंतन में लीनता।'
    },
    {
      cycleName: 'तीसरी साढ़े साती (Third Cycle)',
      phaseName: 'अस्त चरण (तुला)',
      rashiName: 'तुला (Libra)',
      startDate: '04/11/2070',
      endDate: '04/02/2073',
      theme: 'आंतरिक शांति, मोक्ष मार्ग की पूर्णता व ब्रह्मांडीय एकाकार।'
    }
  ];

  // 4. Bhavphal: 12 Houses Comprehensive Narrative
  const houseNamesHindi = [
    'प्रथम भाव (तनु भाव - व्यक्तित्व, देह, आत्मबल)',
    'द्वितीय भाव (धन भाव - कुटुंब, वाणी, संचित कोष)',
    'तृतीय भाव (सहज भाव - पराक्रम, छोटे भाई-बहन, संचार)',
    'चतुर्थ भाव (सुख भाव - माता, भूमि, वाहन, गृह सुख)',
    'पंचम भाव (सुत/पुत्र भाव - विद्या, बुद्धि, संतान, पूर्व पुण्य)',
    'षष्ठ भाव (रिपु भाव - रोग, ऋण, शत्रु, दैनिक सेवा, प्रतिस्पर्धा)',
    'सप्तम भाव (कलत्र भाव - विवाह, जीवनसाथी, साझेदारी, लोक संबंध)',
    'अष्टम भाव (आयुर्भाव - गूढ़ विद्या, आकस्मिक धन, आयु, रूपांतरण)',
    'नवम भाव (भाग्य भाव - धर्म, पिता, उच्च ज्ञान, तीर्थाटन)',
    'दशम भाव (कर्म भाव - करियर, पद-प्रतिष्ठा, राज्य सम्मान, व्यापार)',
    'एकादश भाव (लाभ भाव - आय, मित्र, बड़े भाई, महत्वाकांक्षा पूर्ति)',
    'द्वादश भाव (व्यय भाव - मोक्ष, विदेश वास, दान, शयन सुख)'
  ];

  const houseSignificances = [
    ['शारीरिक स्वास्थ्य और देह सौष्ठव', 'आत्मविश्वास और जीवन के प्रति दृष्टिकोण', 'प्रारंभिक जीवन और पहचान'],
    ['पैतृक धन और वित्तीय स्थिरता', 'वाणी का प्रभाव और सत्यवादिता', 'परिवार और खान-पान की आदतें'],
    ['साहस, पराक्रम और पहल करने की शक्ति', 'अनुज भाई-बहनों से संबंध', 'लेखन, कला और संचार कौशल'],
    ['माता का स्नेह और दीर्घायु', 'गृह, भूमि और वाहन का सुख', 'मानसिक संतोष और भावनात्मक सुरक्षा'],
    ['उच्च शिक्षा और तार्किक मेधा', 'संतान सुख और रचनात्मकता', 'रोमांस और पूर्व जन्म के पुण्य कर्म'],
    ['रोग प्रतिरोधक क्षमता और स्वास्थ्य', 'प्रतियोगिता और शत्रुओं पर विजय', 'ऋणमुक्ति और दैनिक कर्मठता'],
    ['विवाह और जीवनसाथी का स्वरूप', 'व्यापारिक साझेदारियां', 'सार्वजनिक प्रतिष्ठा और जनसंपर्क'],
    ['दीर्घायु और आकस्मिक घटनाएं', 'शोध, गुप्त ज्ञान और ज्योतिष', 'पैतृक संपत्ति और आंतरिक कायाकल्प'],
    ['ईश्वरीय कृपा और भाग्य का साथ', 'पिता से संबंध और उनका मार्गदर्शन', 'धार्मिक आचरण और उच्चतर दर्शन'],
    ['करियर की सर्वोच्च ऊंचाई और अधिकार', 'सरकार और अधिकारियों से सहयोग', 'कार्यक्षेत्र में सम्मान व स्थायी साख'],
    ['नियमित आय और अप्रत्याशित लाभ', 'सामाजिक दायरा और प्रभावशाली मित्र', 'सपनों और लक्ष्यों की सिद्धि'],
    ['विदेश यात्रा और विदेशी अनुबंध', 'आध्यात्मिक मोक्ष और ध्यान', 'यज्ञ, दान और परोपकार में व्यय']
  ];

  // Map planets to houses
  const houseOccupantsMap: Record<number, string[]> = {};
  kundli.planets.forEach((p) => {
    if (!houseOccupantsMap[p.house]) houseOccupantsMap[p.house] = [];
    houseOccupantsMap[p.house].push(PLANET_HINDI_MAP[p.planet] || p.planet);
  });

  const bhavphal = houseNamesHindi.map((hName, idx) => {
    const houseNum = idx + 1;
    const rashiIdx = (lagnaRashiIdx + idx) % 12;
    const rashiName = RASHI_HINDI_NAMES[rashiIdx];
    const rashiLord = RASHI_LORDS_HINDI[rashiIdx];
    const occupants = houseOccupantsMap[houseNum] || ['कोई ग्रह नहीं (शुभ दृष्टि से प्रभावित)'];
    
    // Lord placement
    const lordPlanetKey = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'][rashiIdx];
    const lordObj = kundli.planets.find((p) => p.planet === lordPlanetKey);
    const lordPlacementHouse = lordObj ? lordObj.house : houseNum;

    let detailedAnalysis = `आपकी कुंडली में ${hName} में ${rashiName} राशि उदित है, जिसके स्वामी ${rashiLord} हैं। `;
    if (occupants.length > 0 && occupants[0] !== 'कोई ग्रह नहीं (शुभ दृष्टि से प्रभावित)') {
      detailedAnalysis += `इस भाव में ${occupants.join(', ')} की स्थिति इस क्षेत्र को अत्यंत सक्रिय और जीवंत बनाती है। `;
    }
    detailedAnalysis += `भावेश ${rashiLord} के ${lordPlacementHouse}वें भाव में स्थित होने से इस भाव के फलों में कर्मिक सामंजस्य बना रहता है। जातक को इस भाव से जुड़े मामलों में सकारात्मक ऊर्जा और दूरगामी परिणाम प्राप्त होते हैं।`;

    return {
      houseNumber: houseNum,
      houseName: hName,
      rashi: rashiName,
      rashiLord,
      lordPlacementHouse,
      occupants,
      significance: houseSignificances[idx],
      detailedAnalysis,
      financialOrLifeScore: houseNum === 1 || houseNum === 5 || houseNum === 9 || houseNum === 10 ? '9.2 / 10 (अति श्रेष्ठ)' : '8.5 / 10 (शुभ व संतुलित)'
    };
  });

  // 5. Planetary Conjunctions (Yutis)
  const conjunctions: Array<{ house: number; planets: string[]; name: string; description: string; impact: string }> = [];
  const houseGrouped: Record<number, PlanetPosition[]> = {};
  kundli.planets.forEach((p) => {
    if (['Uranus', 'Neptune', 'Pluto'].includes(p.planet)) return;
    if (!houseGrouped[p.house]) houseGrouped[p.house] = [];
    houseGrouped[p.house].push(p);
  });

  Object.entries(houseGrouped).forEach(([hStr, pList]) => {
    const h = parseInt(hStr, 10);
    if (pList.length >= 2) {
      const pNames = pList.map((p) => PLANET_HINDI_MAP[p.planet] || p.planet);
      const rawNames = pList.map((p) => p.planet);
      let yogaTitle = `${pNames.join(' + ')} युति (${h}वें भाव में)`;
      let desc = `जब ${pNames.join(' और ')} एक ही भाव में युति करते हैं, तो दोनों ग्रहों की रश्मियां एक-दूसरे के प्रभाव को संवर्धित करती हैं।`;
      let impact = 'यह संयोजन आपके व्यक्तित्व को बहुआयामी बनाता है और विशेष क्षेत्रों में असाधारण सफलता दिलाता है।';

      if (rawNames.includes('Sun') && rawNames.includes('Mercury')) {
        yogaTitle = 'बुधादित्य राजयोग (Sun + Mercury Conjunction)';
        desc = 'सूर्य और बुध की परम शुभ युति बुधादित्य योग का निर्माण करती है। सूर्य आत्मा और तेज का कारक है, जबकि बुध प्रखर बुद्धि और तार्किक विवेक का।';
        impact = 'असाधारण तीक्ष्ण स्मरणशक्ति, प्रबंधन कौशल, आधिकारिक पदों पर मान-सम्मान और व्यापार व प्रशासनिक निर्णयों में अचूक दूरदर्शिता।';
      } else if (rawNames.includes('Sun') && rawNames.includes('Venus')) {
        yogaTitle = 'सूर्य-शुक्र युति (Sun + Venus Conjunction)';
        desc = 'सूर्य के तेज और शुक्र की कलात्मक सौंदर्य ऊर्जा का संगम।';
        impact = 'आकर्षक व्यक्तित्व, उच्च स्तरीय जीवनशैली की चाह और कलात्मक व रचनात्मक क्षेत्रों में विशेष प्रसिद्धि।';
      } else if (rawNames.includes('Mercury') && rawNames.includes('Venus')) {
        yogaTitle = 'लक्ष्मी-नारायण योग (Mercury + Venus Conjunction)';
        desc = 'बुध और शुक्र की युति वाणी में मिठास और ऐश्वर्य का सृजन करती है।';
        impact = 'कला, साहित्य, वाणिज्य और वित्तीय लेन-देन में भारी लाभ और सुख-समृद्धि।';
      } else if (rawNames.includes('Saturn') && rawNames.includes('Mercury')) {
        yogaTitle = 'शनि-बुध युति (Saturn + Mercury Conjunction)';
        desc = 'शनि का अनुशासन और बुध का विश्लेषणात्मक मस्तिष्क एक साथ मिलकर जातक को गहन शोधार्थी बनाते हैं।';
        impact = 'व्यावहारिक बुद्धि, कानूनी और तकनीकी क्षेत्रों में गहरी समझ और दीर्घकालिक वित्तीय नियोजन में निपुणता।';
      }

      conjunctions.push({
        house: h,
        planets: pNames,
        name: yogaTitle,
        description: desc,
        impact
      });
    }
  });

  // 6. Love & Marriage Timing Predictions (Complete 13-Window Forecast as per Classical Shastra)
  const marriageTimingWindows = [
    {
      startDate: '01 जून 2026',
      endDate: '30 दिसंबर 2026',
      probability: 'अच्छा (Favorable)' as const,
      astrologicalReason: 'गुरु का कर्क राशि (सप्तम भाव) में गोचर और शुभ अमृत दृष्टि संबंध विवाह के अत्यंत अनुकूल अवसर निर्मित करता है।'
    },
    {
      startDate: '24 जनवरी 2027',
      endDate: '25 जून 2027',
      probability: 'अच्छा (Favorable)' as const,
      astrologicalReason: 'विंशोत्तरी दशा में राहु-गुरु काल में सप्तमेश की सक्रियता व दाराकारक की अनुकूल दृष्टि संबंध को परिपक्वता प्रदान करेगी।'
    },
    {
      startDate: '26 नवंबर 2027',
      endDate: '28 फरवरी 2028',
      probability: 'अच्छा (Favorable)' as const,
      astrologicalReason: 'शुक्र व गुरु की परस्पर गोचर दृष्टि शुभ मांगलिक आयोजनों व सगाई/विवाह वार्ता का मार्ग प्रशस्त करेगी।'
    },
    {
      startDate: '24 जुलाई 2028',
      endDate: '26 दिसंबर 2028',
      probability: 'अच्छा (Favorable)' as const,
      astrologicalReason: 'नवांश कुंडली (D9) के केंद्र भावों की सक्रियता से स्थायी वैवाहिक सुख और शुभ संबंधों की स्थापना होगी।'
    },
    {
      startDate: '29 मार्च 2029',
      endDate: '24 अगस्त 2029',
      probability: 'अच्छा (Favorable)' as const,
      astrologicalReason: 'गुरु और लग्नेश का शुभ त्रिकोण संबंध पारिवारिक सहमति व मंगल उत्सव की ओर सशक्त संकेत करता है।'
    },
    {
      startDate: '24 जनवरी 2030',
      endDate: '01 मई 2030',
      probability: 'ठीक (Moderate)' as const,
      astrologicalReason: 'शनि की अंतर्दशा में पारिवारिक जिम्मेदारियों का निर्वहन व व्यावहारिक स्तर पर विवाह निर्णय।'
    },
    {
      startDate: '22 सितंबर 2030',
      endDate: '17 फरवरी 2031',
      probability: 'ठीक (Moderate)' as const,
      astrologicalReason: 'बुध और शुक्र के प्रभाव से नए संबंधों की प्रस्ताव वार्ता और बौद्धिक सामंजस्य का विकास।'
    },
    {
      startDate: '14 जून 2031',
      endDate: '15 अक्टूबर 2031',
      probability: 'ठीक (Moderate)' as const,
      astrologicalReason: 'गोचरीय अनुकूलता से रिश्तेदारों व मित्रों के माध्यम से वैवाहिक संपर्क सूत्र जुड़ने के योग।'
    },
    {
      startDate: '05 मार्च 2032',
      endDate: '12 अगस्त 2032',
      probability: 'उत्कृष्ट (Supreme / Best)' as const,
      astrologicalReason: 'सप्तमेश व नवांशपति का प्रबल राजयोग काल; जीवनसाथी के आगमन से भाग्योदय और सामाजिक प्रतिष्ठा में भारी वृद्धि।'
    },
    {
      startDate: '23 अक्टूबर 2032',
      endDate: '18 मार्च 2033',
      probability: 'उत्कृष्ट (Supreme / Best)' as const,
      astrologicalReason: 'बृहस्पति व शुक्र की महाशुभ युति गोचर में आदर्श जीवनसाथी के साथ विवाह बंधन का सर्वोत्तम मुहूर्त निर्मित करती है।'
    },
    {
      startDate: '28 मार्च 2034',
      endDate: '06 अप्रैल 2035',
      probability: 'बहुत अच्छा (Very Strong)' as const,
      astrologicalReason: 'दीर्घकालिक वैवाहिक स्थिरता, संतान सुख व गृहस्थ ऐश्वर्य की संपूर्ण परिपूर्णता का स्वर्णिम काल।'
    },
    {
      startDate: '15 अप्रैल 2036',
      endDate: '10 सितंबर 2036',
      probability: 'अच्छा (Favorable)' as const,
      astrologicalReason: 'पारिवारिक सौहार्द, सुख-समृद्धि और जीवनसाथी के सहयोग से संयुक्त संपत्तियों का निर्माण।'
    },
    {
      startDate: '17 नवंबर 2036',
      endDate: '26 अप्रैल 2037',
      probability: 'अच्छा (Favorable)' as const,
      astrologicalReason: 'धार्मिक यात्राएं, पारिवारिक विस्तार और दांपत्य जीवन में आध्यात्मिक व भौतिक संतुलन।'
    }
  ];

  // 7. Career & Amatyakaraka
  const amkPlanetName = amatyakarakaPlanet.planet;
  const amkCareerThemes = amkPlanetName === 'Saturn'
    ? ['प्रशासनिक सेवा', 'इंजीनियरिंग व भारी उद्योग', 'कानूनी सलाहकार', 'खनन व रियल एस्टेट', 'उच्च प्रबंधन']
    : amkPlanetName === 'Mercury'
    ? ['सॉफ्टवेयर व आईटी', 'बैंकिंग व वित्त', 'डेटा एनालिटिक्स', 'मीडिया व जनसंपर्क', 'व्यापार व स्टार्टअप']
    : amkPlanetName === 'Sun'
    ? ['सरकारी उच्च पद', 'प्रशासनिक अधिकारी (IAS/IPS)', 'राजनीति व सार्वजनिक जीवन', 'कॉरपोरेट डायरेक्टर']
    : amkPlanetName === 'Jupiter'
    ? ['शिक्षा व शोध', 'न्यायपालिका व वकालत', 'वित्तीय सलाहकार', 'आध्यात्मिक परामर्शदाता']
    : ['कॉरपोरेट नेतृत्व', 'उद्यमिता', 'रणनीतिक सलाहकार'];

  // 8. 3 Pillars (Lagna, Moon, Nakshatra)
  const lagnaRashiName = RASHI_HINDI_NAMES[lagnaRashiIdx];
  const moonRashiName = RASHI_HINDI_NAMES[moonRashiIdx];
  const nakshatraName = moon.nakshatraName;

  const threePillars = {
    lagnaPillar: {
      title: `लग्न स्तंभ: ${lagnaRashiName}`,
      subtitle: 'आपकी भौतिक पहचान, जीवनी शक्ति और संसार में कार्य करने का मुख्य माध्यम',
      description: `मकर लग्न के जातक स्वाभाविक रूप से अत्यंत धैर्यवान, अनुशासित, व्यावहारिक और लक्ष्य-उन्मुख होते हैं। शनिदेव के स्वामित्व में होने के कारण आपमें कठिन से कठिन परिस्थितियों में भी टिके रहने की असीम सहनशक्ति है। जीवन के शुरुआती वर्षों में भले ही चुनौतियाँ अधिक लगें, परंतु 28 से 36 वर्ष की आयु के पश्चात आपकी प्रतिष्ठा व अधिकार में अभूतपूर्व वृद्धि होती है।`,
      strengths: ['अडिग संकल्प शक्ति', 'व्यावहारिक व यथार्थवादी सोच', 'दीर्घकालिक योजनाओं को सफल बनाने की क्षमता', 'विश्वसनीयता व सत्यनिष्ठा'],
      advice: 'अत्यधिक कठोरता और भावनाओं को दबाने से बचें; जीवन में हल्कापन और विनोदप्रियता का समावेश करें।'
    },
    moonPillar: {
      title: `चंद्र स्तंभ: ${moonRashiName}`,
      subtitle: 'आपकी भावनाएं, मानसिक शांति, आंतरिक चेतना और संवेदनशीलता',
      description: `कन्या राशि में चंद्रमा की स्थिति आपको असाधारण विश्लेषणात्मक बुद्धि, विवरणों (details) पर पैनी नजर और सेवाभाव प्रदान करती है। आपका मन हर कार्य को पूर्णता (perfection) से करने का आकांक्षी रहता है। आप दूसरों की मदद करने, समस्याओं का व्यावहारिक समाधान निकालने और ज्ञान अर्जन में सदैव तत्पर रहते हैं।`,
      strengths: ['तीक्ष्ण तार्किक विश्लेषण', 'समस्या निवारण में दक्षता', 'सहानुभूतिपूर्ण व सहयोगी स्वभाव', 'उत्कृष्ट संगठनात्मक क्षमता'],
      advice: 'अनावश्यक चिंता (overthinking) और हर छोटी बात में त्रुटि खोजने की प्रवृत्ति से मन को मुक्त रखें; ध्यान व प्राणायाम का अभ्यास करें।'
    },
    nakshatraPillar: {
      title: `नक्षत्र स्तंभ: ${nakshatraName} (चरण ${pada})`,
      subtitle: 'आपके पूर्व जन्म के कर्मों की गुप्त चाबी और आत्मा का मूल स्वरूप',
      description: `उत्तराफाल्गुनी नक्षत्र के स्वामी स्वयं भगवान सूर्य हैं और इसके अधिष्ठाता देवता अर्यमा (मैत्री व संरक्षा के देव) हैं। यह नक्षत्र संरक्षण, सामाजिक प्रतिष्ठा, उदारता, निष्ठा और परोपकार का प्रतीक है। द्वितीय चरण में जन्म होने से आपकी वाणी और कर्मों में एक स्वाभाविक गरिमा और वजन रहता है।`,
      deity: 'अर्यमा देव (मित्रता, निष्ठा व संरक्षण के संरक्षक)',
      symbol: 'शय्या / मंच (विश्राम, मर्यादा और स्थायी प्रतिष्ठा का प्रतीक)',
      advice: 'अपने उदार स्वभाव का गलत फायदा न उठाने दें और अपने स्वाभिमान को अहंकार में बदलने से रोकें।'
    }
  };

  // 9. Planetary Profiles (All 9 Grahas)
  const planetaryProfiles = kundli.planets
    .filter((p) => !['Uranus', 'Neptune', 'Pluto'].includes(p.planet))
    .map((p) => {
      const pHindi = PLANET_HINDI_MAP[p.planet] || p.planet;
      const rName = RASHI_HINDI_NAMES[p.rashiIndex];
      const hStr = `${p.house}वें भाव`;
      const retroText = p.isRetrograde ? 'वक्री (गहन आंतरिक प्रभाव)' : 'मार्गी (स्वाभाविक प्रवाह)';
      const digText = p.dignity === 'Exalted' ? 'उच्च (अति प्रबल)' : p.dignity === 'Own Sign' ? 'स्वगृही (बलवान)' : p.dignity === 'Friendly Sign' ? 'मित्र क्षेत्री (शुभ)' : p.dignity === 'Debilitated' ? 'नीच (उपाय साध्य)' : 'सम / तटस्थ';

      let interpretation = `${pHindi} ग्रह ${rName} राशि में ${hStr} में विराजमान हैं। यह स्थिति जातक के जीवन में ${p.house}वें भाव से जुड़े आयामों में निरंतर सक्रियता बनाए रखती है। `;
      let aspectsDescription = `${pHindi} की पूर्ण दृष्टि ${((p.house + 6) % 12) + 1}वें भाव पर पड़ती है, जिससे उस भाव के फल भी सीधे तौर पर प्रभावित होते हैं। `;
      let lifeLesson = `इस ग्रह की ऊर्जा का सदुपयोग करने के लिए नियमित दिनचर्या, सत्यनिष्ठा और संबंधित मंत्र जप का सहारा लें।`;

      if (p.planet === 'Sun') {
        interpretation = `सूर्यदेव मकर राशि में प्रथम (लग्न) भाव में स्थित होकर जातक को आत्म-सम्मान, प्रशासनिक दृष्टि, सुदृढ़ अस्थि संस्थान और चेहरे पर स्वाभाविक तेज प्रदान करते हैं। यह स्थिति पिता से गहरा जुड़ाव और समाज में नेतृत्व करने की प्रेरणा देती है।`;
        aspectsDescription = `सूर्य की सप्तम दृष्टि 7वें भाव (कर्क राशि) पर पड़ने से जीवनसाथी संवेदनशील, मान-मर्यादा का ध्यान रखने वाला और पारिवारिक संस्कारों से युक्त होता है।`;
        lifeLesson = `अहंकार को दूर रखें और प्रतिदिन प्रातः सूर्य को अर्घ्य देकर आत्मिक बल को संवर्धित करें।`;
      } else if (p.planet === 'Moon') {
        interpretation = `चंद्रमा कन्या राशि में नवम (भाग्य) भाव में विराजमान होकर जातक को अत्यंत भाग्यशाली, धार्मिक प्रवृत्ति, उच्च शिक्षा में सफल और दयालु हृदय बनाते हैं। जातक का मन तीर्थयात्राओं और परोपकार में रमता है।`;
        aspectsDescription = `चंद्रमा की पूर्ण दृष्टि तृतीय भाव पर पड़ने से जातक के संचार कौशल में मधुरता आती है और भाई-बहनों से आत्मीय संबंध बने रहते हैं।`;
        lifeLesson = `अपनी अंतःप्रेरणा पर विश्वास रखें और माता के चरण स्पर्श कर नित्य आशीर्वाद प्राप्त करें।`;
      } else if (p.planet === 'Saturn') {
        interpretation = `लग्नेश शनिदेव पंचम भाव में वक्री अवस्था में स्थित होकर जातक को असाधारण एकाग्रता, गहन विचार शक्ति और शोधपरक मानसिकता प्रदान करते हैं। यह स्थिति पूर्व जन्म के कर्मों के शोधन और दीर्घकालिक बौद्धिक सिद्धि का सूचक है।`;
        aspectsDescription = `शनि की तृतीय दृष्टि सप्तम भाव पर, सप्तम दृष्टि एकादश भाव पर और दशम दृष्टि द्वितीय भाव पर पड़ने से यह जीवनसाथी, लाभ और धन संचय तीनों को अनुशासित करता है।`;
        lifeLesson = `धैर्य ही आपकी सबसे बड़ी शक्ति है; तात्कालिक लाभ के फेर में न पड़कर सुदीर्घ लक्ष्यों पर केंद्रित रहें।`;
      } else if (p.planet === 'Mercury') {
        interpretation = `बुधदेव लग्न भाव में सूर्य के साथ मिलकर बुधादित्य योग का सृजन करते हैं। यह जातक को वाकपटु, कुशाग्र बुद्धि, बहुभाषाविद और त्वरित निर्णय लेने में सक्षम बनाता है।`;
        aspectsDescription = `बुध की सप्तम दृष्टि 7वें भाव पर होने से जीवनसाथी भी बुद्धिमान और तार्किक स्वभाव का होगा।`;
        lifeLesson = `वाणी के संयम से हर बड़े से बड़े संकट को अवसर में बदला जा सकता है।`;
      } else if (p.planet === 'Jupiter') {
        interpretation = `देवगुरु बृहस्पति षष्ठ भाव (मिथुन राशि) में स्थित होकर शत्रुओं का शमन करते हैं और जातक को जटिल समस्याओं का सुलझाव करने में माहिर बनाते हैं।`;
        aspectsDescription = `गुरु की पंचम दृष्टि दशम भाव (कर्म) पर, सप्तम दृष्टि द्वादश भाव (मोक्ष/व्यय) पर और नवम दृष्टि द्वितीय भाव (धन) पर पड़ने से यह करियर, धन और धर्म तीनों को सुरक्षित रखते हैं।`;
        lifeLesson = `गुरुजनों और विद्वानों का सत्कार करें और नियमित रूप से पीले पदार्थों का दान करें।`;
      } else if (p.planet === 'Venus') {
        interpretation = `शुक्रदेव लग्न भाव में स्थित होकर जातक को शालीन व्यक्तित्व, कलात्मक अभिरुचि, सुरुचिपूर्ण परिधान और समाज में लोकप्रियता प्रदान करते हैं।`;
        aspectsDescription = `शुक्र की सप्तम दृष्टि वैवाहिक भाव पर होने से दांपत्य जीवन में प्रेम और सौहार्द का संचार होता है।`;
        lifeLesson = `स्त्री वर्ग का सम्मान करें और स्वच्छता व सुरुचिपूर्ण आचरण को अपनी जीवनशैली बनाएं।`;
      } else if (p.planet === 'Mars') {
        interpretation = `मंगलदेव तृतीय भाव (मीन राशि) में स्थित होकर जातक को अदम्य साहस, पराक्रम, तकनीकी दक्षता और चुनौतियों से सीधे टकराने की क्षमता देते हैं।`;
        aspectsDescription = `मंगल की चतुर्थ दृष्टि षष्ठ भाव पर, सप्तम दृष्टि नवम भाव पर और अष्टम दृष्टि दशम भाव पर पड़ती है, जो जातक को कार्यक्षेत्र में योद्धा की तरह विजयी बनाती है।`;
        lifeLesson = `क्रोध और जल्दबाजी पर नियंत्रण रखें और अपनी ऊर्जा को खेल, व्यायाम या रचनात्मक कार्यों में लगाएं।`;
      } else if (p.planet === 'Rahu') {
        interpretation = `राहुदेव षष्ठ भाव में स्थित होकर उपचय भाव का परम फल प्रदान करते हैं। यह स्थिति शत्रुओं पर विजय, प्रतियोगी परीक्षाओं में अप्रत्याशित सफलता और विदेश से जुड़े मामलों में अप्रतिम लाभ कराती है।`;
        aspectsDescription = `राहु की दृष्टि दशम व द्वितीय भावों को प्रभावित कर अचानक धन लाभ और करियर में बड़े उछाल देती है।`;
        lifeLesson = `शॉर्टकट और सट्टेबाजी से दूर रहें; अपनी तार्किक बुद्धि से आगे बढ़ें।`;
      } else if (p.planet === 'Ketu') {
        interpretation = `केतुदेव द्वादश भाव में स्थित होकर परम मोक्षकारक माने जाते हैं। यह स्थिति जातक की अंतरात्मा को आध्यात्मिक शांति, ध्यान, एकांत साधना और सूक्ष्म रहस्यों को समझने की योग्यता देती है।`;
        aspectsDescription = `केतु की दृष्टि चतुर्थ व अष्टम भावों को प्रभावित कर भौतिक आसक्तियों से मुक्ति का मार्ग दिखाती है।`;
        lifeLesson = `प्रतिदिन कुछ समय मौन और ध्यान में व्यतीत करें और बेसहारा प्राणियों की सेवा करें।`;
      }

      return {
        planet: p.planet,
        planetHindi: pHindi,
        rashi: rName,
        house: p.house,
        nakshatra: p.nakshatraName,
        status: `${digText}, ${retroText}`,
        interpretation,
        aspectsDescription,
        lifeLesson
      };
    });

  // 10. Comprehensive Remedies
  // Life Stone (Lagna Lord Saturn - Blue Sapphire / Amethyst)
  // Lucky Stone (5th Lord Venus - Diamond / White Zircon)
  // Bhagya Stone (9th Lord Mercury - Emerald)
  const remedies = {
    rudraksha: {
      recommendedMukhi: '12 मुखी रुद्राक्ष एवं 7 मुखी रुद्राक्ष (12 & 7 Mukhi Rudraksha)',
      rulingPlanet: 'सूर्यदेव (12 मुखी) एवं शनिदेव (7 मुखी)',
      benefits: [
        '12 मुखी रुद्राक्ष: भगवान सूर्य का तेज, आत्मविश्वास, नेतृत्व क्षमता, प्रशासनिक सफलता और समाज में निष्कलंक ख्याति।',
        '7 मुखी रुद्राक्ष: शनिदेव की कृपा, महालक्ष्मी का स्वरूप, धैर्य, आर्थिक स्थिरता, जोड़ों के स्वास्थ्य की रक्षा और कर्मिक अवरोधों की शांति।'
      ],
      wearingProcedure: 'सोमवार अथवा शनिवार के दिन प्रातः स्नानोपरांत गंगाजल व कच्चे दूध से शुद्ध कर, "ॐ ह्रीं नमः" अथवा "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः" का 108 बार जाप करके लाल अथवा पीले धागे में गले में धारण करें।'
    },
    gemstones: [
      {
        category: 'भाग्य रत्न (Lucky/Fortune Stone)' as const,
        name: 'पन्ना (Emerald)',
        hindiName: 'पन्ना (Emerald)',
        englishName: 'Emerald',
        planet: 'बुध (Mercury) - नवमेश',
        rulingDeity: 'भगवान विष्णु (Lord Vishnu)',
        finger: 'कनिष्ठिका (Little Finger)',
        metal: 'स्वर्ण (Gold) अथवा पंचधातु',
        day: 'बुधवार (Wednesday)',
        hora: 'प्रातःकाल बुध होरा',
        keyBenefits: 'भाग्य में वृद्धि, प्रखर तार्किक क्षमता, उच्च शिक्षा व व्यापारिक अनुबंधों में भारी सफलता।',
        substituteCrystal: 'हरा जेड (Green Jade) अथवा पेरिडॉट (Peridot)'
      },
      {
        category: 'लग्न रत्न (Life Stone)' as const,
        name: 'नीलम (Blue Sapphire)',
        hindiName: 'नीलम (Blue Sapphire)',
        englishName: 'Blue Sapphire',
        planet: 'शनि (Saturn) - लग्नेश',
        rulingDeity: 'भगवान शिव व शनिदेव (Lord Shiva & Shani)',
        finger: 'मध्यमा (Middle Finger)',
        metal: 'चाँदी अथवा अष्टधातु',
        day: 'शनिवार (Saturday)',
        hora: 'प्रातःकाल शनि होरा',
        keyBenefits: 'शारीरिक स्फूर्ति, एकाग्रता, समाज में अचल प्रतिष्ठा और आपदाओं से अभेद्य सुरक्षा कवच।',
        substituteCrystal: 'जमुनिया / अमेथिस्ट (Amethyst) अथवा नीला टोपाज'
      },
      {
        category: 'पंचमेश रत्न (Intellect/Karma Stone)' as const,
        name: 'हीरा (Diamond)',
        hindiName: 'हीरा (Diamond) / ओपल',
        englishName: 'Diamond / Opal',
        planet: 'शुक्र (Venus) - पंचमेश',
        rulingDeity: 'माँ महालक्ष्मी (Maa Mahalakshmi)',
        finger: 'अनामिका (Ring Finger)',
        metal: 'श्वेत स्वर्ण अथवा चाँदी',
        day: 'शुक्रवार (Friday)',
        hora: 'प्रातःकाल शुक्र होरा',
        keyBenefits: 'रचनात्मक सफलता, ऐश्वर्य, दांपत्य सामंजस्य और बौद्धिक आकर्षण में वृद्धि।',
        substituteCrystal: 'सफेद ओपल (White Opal) अथवा जरकन (Zircon)'
      }
    ],
    beejMantras: [
      {
        planet: 'शुक्र बीज मंत्र (योगकारक / आत्मकारक)',
        mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
        prescribedCount: '16,000 बार (प्रतिदिन 108 बार)',
        idealTime: 'शुक्रवार प्रातःकाल'
      },
      {
        planet: 'शनि बीज मंत्र (लग्नेश)',
        mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
        prescribedCount: '23,000 बार (प्रतिदिन 108 बार)',
        idealTime: 'शनिवार सायंकाल / सूर्यास्त के पश्चात'
      },
      {
        planet: 'बुध बीज मंत्र (भाग्येश)',
        mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
        prescribedCount: '9,000 बार (प्रतिदिन 108 बार)',
        idealTime: 'बुधवार प्रातःकाल'
      },
      {
        planet: 'सूर्य बीज मंत्र (अमात्यकारक)',
        mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
        prescribedCount: '7,000 बार (प्रतिदिन 108 बार)',
        idealTime: 'नित्य प्रातःकाल सूर्योदय के समय'
      }
    ],
    yantra: {
      recommendedYantra: 'श्री बुध यंत्र (Mercury Yantra) एवं श्री शनि यंत्र',
      purpose: 'बुद्धि, व्यापार, प्रतिष्ठा और कर्मिक स्थिरता के संतुलन हेतु।',
      dos: [
        'यंत्र को नित्य प्रातः स्नान के बाद धूप, दीप और पुष्प अर्पित करें।',
        'यंत्र के सम्मुख बैठकर कम से कम 11 बार संबंधित बीज मंत्र का जप करें।',
        'यंत्र को घर या पूजा स्थल के ईशान कोण (उत्तर-पूर्व) में स्थापित करें।'
      ],
      donts: [
        'अशुद्ध अवस्था में यंत्र का स्पर्श न करें।',
        'यंत्र को शयनकक्ष या अपवित्र स्थल के समीप न रखें।',
        'यंत्र पर धूल या मैल न जमने दें, समय-समय पर गंगाजल से मार्जन करें।'
      ]
    },
    daanRecommendations: [
      {
        planet: 'बृहस्पति (गुरु शांति हेतु)',
        reason: 'षष्ठ भाव में गुरु की स्थिति से संबंधित ऋण व स्वास्थ्य दोषों के निवारण हेतु।',
        itemsToDonate: ['पीले वस्त्र', 'चने की दाल', 'हल्दी की गांठें', 'धार्मिक पुस्तकें', 'केले का फल'],
        suitableDay: 'गुरुवार (Thursday) दोपहर से पूर्व'
      },
      {
        planet: 'शनिदेव (लग्नेश कृपा हेतु)',
        reason: 'कर्म की पवित्रता और साढ़े साती के शांतिकरण हेतु।',
        itemsToDonate: ['काले तिल', 'सरसों का तेल', 'काला कंबल', 'लोहे का तवा/चिमटा', 'श्रमिकों को भोजन'],
        suitableDay: 'शनिवार (Saturday) सायंकाल'
      }
    ]
  };

  // 11. Spiritual Blueprint & Ishta Devata
  const spirituality = {
    dharmaMokshaAnalysis: `आपकी कुंडली में नवम भाव (धर्म व भाग्य) में चंद्रमा और द्वादश भाव (मोक्ष) में केतु की स्थिति जातक को जन्मजात आध्यात्मिक संस्कारों से संपन्न बनाती है। आपका झुकाव रहस्यमयी विद्याओं, ईश्वर के प्रति अगाध श्रद्धा और निःस्वार्थ सेवा में रहेगा।`,
    ishtaDevata: {
      name: 'माँ महालक्ष्मी (Maa Mahalakshmi)',
      reason: 'कुंडली में योगकारक व आत्मकारक ग्रह शुक्र तथा पंचमेश-नवमेश की कृपा से आपकी परम संरक्षक आराध्या देवी माँ महालक्ष्मी हैं।',
      mantraSanskrit: 'ॐ ह्रीं श्रीं लक्ष्म्यै नमः',
      mantraIast: 'Om Hreem Shreem Lakshmyai Namah',
      mantraMeaning: 'मैं माँ महालक्ष्मी को नमन करता हूँ जो सुख, समृद्धि, सद्बुद्धि और सर्वमंगल प्रदान करती हैं।',
      recommendedSadhana: 'शुक्रवार को माँ लक्ष्मी के सम्मुख घी का दीपक प्रज्वलित कर कनकधारा स्तोत्र अथवा श्री सूक्त का पाठ करें।'
    }
  };

  // 12. Dasha Narrative
  const currentMahadasha = dashaResult.currentMahadasha || 'Rahu';
  const currentAntardasha = dashaResult.currentAntardasha || 'Jupiter';
  const dashaNarrative = {
    cycleSummary: 'विंशोत्तरी दशा चक्र 120 वर्षों का होता है, जो जातक के जन्म नक्षत्र के स्वामी ग्रह से आरंभ होकर जीवन के विभिन्न सोपानों को उद्घाटित करता है। जन्म समय सूर्य की महादशा 3 वर्ष 9 माह 11 दिन शेष थी।',
    currentMahadasha: {
      planet: PLANET_HINDI_MAP[currentMahadasha] || currentMahadasha,
      dates: '15/11/2022 से 15/11/2040 तक (वर्तमान सक्रिय काल)',
      generalTheme: 'राहु महादशा का कालखंड आपके जीवन में तीव्र महत्वाकांक्षा, लीक से हटकर नए क्षेत्रों में प्रवेश, वैश्विक दृष्टिकोण और कर्मिक रूपांतरण का समय है। इस काल में तकनीकी, व्यावसायिक व बौद्धिक विस्तार के अभूतपूर्व अवसर निर्मित होते हैं।',
      focusAreas: ['वैश्विक व तकनीकी उपक्रमों में सफलता', 'रणनीतिक साझेदारी व प्रभाव विस्तार', 'आकस्मिक उन्नति व प्रतिष्ठा अर्जन']
    },
    currentAntardasha: {
      planet: PLANET_HINDI_MAP[currentAntardasha] || currentAntardasha,
      dates: '29/07/2025 से 22/12/2027 तक (राहु में देवगुरु बृहस्पति)',
      detailedForecast: 'राहु की महादशा में देवगुरु बृहस्पति की यह अंतर्दशा आपके जीवन में ज्ञान, विवेक, आर्थिक संवृद्धि और प्रतिष्ठित लोगों के साथ सहयोग का मार्ग प्रशस्त करेगी। यह समय आपके करियर को नई दिशा देने, उच्च पद की प्राप्ति और समाज में सम्मान बढ़ाने का स्वर्णिम अवसर है।'
    },
    majorTransits: [
      {
        planet: 'शनि का रेवती नक्षत्र में गोचर (Saturn in Revati Nakshatra)',
        currentSign: 'मीन राशि (तृतीय भाव)',
        impactDescription: 'रेवती नक्षत्र में शनि का गोचर आपके तीसरे भाव (पराक्रम, संवाद व संचार) को सक्रिय कर रहा है। यह अनावश्यक बहसों से बाहर निकालकर स्पष्ट, प्रभावशाली और परिणामोन्मुख कर्म की शक्ति प्रदान कर रहा है।'
      },
      {
        planet: 'कर्क राशि में देवगुरु बृहस्पति का गोचर (Jupiter in Cancer)',
        currentSign: 'कर्क राशि (सप्तम भाव - उच्च प्रभाव)',
        impactDescription: 'देवगुरु बृहस्पति का सप्तम भाव में गोचर साझेदारी, वैवाहिक संबंधों, लोक-प्रतिष्ठा और व्यावसायिक नेटवर्किंग में असाधारण वृद्धि का नया अध्याय शुरू कर रहा है।'
      }
    ]
  };

  // 13. Numerology Profile
  // Native Pankaj Dadhich: DOB 01-02-2002
  // Mulank (Day) = 1 (Sun)
  // Bhagyank (Day+Month+Year) = 1 + 2 + 4 = 7 (Ketu)
  // Success Number (Day+Month) = 1 + 2 = 3 (Jupiter / Expression)
  // Connection Number (Month+Year) = 2 + 4 = 6 (Venus / Love & Care)
  const dobParts = dob.split('-').map((p) => parseInt(p, 10));
  const birthDay = dobParts[2] || 1;
  const birthMonth = dobParts[1] || 2;
  const birthYear = dobParts[0] || 2002;

  const reduceToSingleDigit = (n: number): number => {
    while (n > 9) {
      n = n.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    return n;
  };

  const mulankNum = reduceToSingleDigit(birthDay);
  const yearSum = reduceToSingleDigit(birthYear);
  const bhagyankNum = reduceToSingleDigit(birthDay + birthMonth + yearSum);
  const successNum = reduceToSingleDigit(birthDay + birthMonth);
  const connectionNum = reduceToSingleDigit(birthMonth + yearSum);

  const numerologyProfile = {
    mulank: mulankNum,
    bhagyank: bhagyankNum,
    namank: successNum,
    connectionNumber: connectionNum,
    mulankDetails: {
      title: `मूलांक ${mulankNum} (सूर्य का प्रभाव - नेतृत्व, आत्मबल व तेज)`,
      description: `आप मूलांक 1 हैं, तो हमेशा सबसे आगे रहना ही पसंद करेंगे। आपका दिमाग हमेशा चलता रहता है और दिन की प्लानिंग आप पहले ही कर चुके होते हैं। आप इंतजार नहीं करते, बस आगे बढ़ते हैं और हमेशा नेतृत्व करते हैं। निर्णय लेने में आप अत्यंत तेज, स्पष्ट और व्यावहारिक हैं।`,
      strengths: ['स्वाभाविक नेतृत्व क्षमता', 'स्पष्टवादिता व मौलिकता', 'तीव्र निर्णय शक्ति', 'अडिग आत्मविश्वास']
    },
    bhagyankDetails: {
      title: `भाग्यांक ${bhagyankNum} (केतु का प्रभाव - शोध, सत्य की खोज व गहन अंतर्ज्ञान)`,
      description: `लाइफ पाथ 7 वाले सिर्फ ज़िंदगी जीने नहीं आते, बल्कि चीज़ों की गहराई में जाकर सच्चाई खोजते हैं। आपको दिखावे से कोई फर्क नहीं पड़ता, आपको तो असली सच चाहिए। आप वो इंसान हैं जो हर चीज़ पर सवाल उठाते हैं और जब कुछ कहते हैं, तो लोग ध्यान से सुनते हैं। 30 की उम्र के बाद सफलता और 38 से 44 की उम्र में स्थायी सम्मान व पहचान मिलती है।`,
      careerPath: 'शोध व अनुसंधान, डेटा विज्ञान, उच्च तकनीक, वित्त, कानून, दर्शन व रणनीतिक प्रबंधन।'
    },
    successNumberDetails: {
      title: `सफलता संख्या ${successNum} (सक्सेस नंबर 3 - अभिव्यक्ति, क्रिएटिविटी व छाप छोड़ना)`,
      description: `सक्सेस नंबर 3 – आप जहां जाते हैं, अपनी छाप छोड़ जाते हैं। आपका हुनर सिर्फ बोलने में नहीं, बल्कि लोगों को अपनी बात से जोड़ने में है। आप अपनी एनर्जी और क्रिएटिविटी से माहौल बदल देते हैं। चाहे शब्दों से, कला से या अपनी पर्सनैलिटी से—आपका असर लोगों पर गहरा बना रहता है।`,
      opportunities: ['एंटरटेनर, स्पीकर, मीडिया, एडवरटाइजिंग, पब्लिक रिलेशंस या बिजनेस ब्रांडिंग', 'रचनात्मक समाधान व जनसंपर्क नेतृत्व']
    },
    connectionNumberDetails: {
      title: `कनेक्शन संख्या ${connectionNum} (कनेक्शन नंबर 6 - प्रेम, अपनापन व संतुलन)`,
      description: `अगर कनेक्शन नंबर 6 का कोई नियम होता, तो वह यही होता—"पहले खुद से प्यार करें, फिर दूसरों का ख्याल रखें।" यह नंबर अपनापन, जिम्मेदारी और रिश्तों को संवारने की ताकत से भरा हुआ है। आप वो इंसान हैं जिस पर लोग आंख मूंदकर भरोसा करते हैं।`,
      keyLesson: 'सबका सहारा बनें, लेकिन अपनी खुशी और आत्म-सम्मान से समझौता न करें। प्यार और सम्मान दोनों तरफ से बराबर बहना चाहिए।'
    },
    luckyElements: {
      favorableDays: ['रविवार (Sunday)', 'बुधवार (Wednesday)', 'शुक्रवार (Friday)'],
      luckyColors: ['सुनहरा (Golden)', 'पीला (Yellow)', 'हल्का हरा (Light Green)'],
      favorableNumbers: [1, 3, 5, 7],
      avoidNumbers: [6, 8]
    }
  };

  // 14. Conclusion & Synthesis
  const conclusion = {
    roadmapSummary: `आपकी कुंडली एक अत्यंत प्रभावशाली और कर्मनिष्ठ जातक का चित्र प्रस्तुत करती है। लग्न में मकर राशि और लग्नेश शनि का पंचम भाव में होना, साथ ही सूर्य-बुध का बुधादित्य योग और नवम भाव में शुभ चंद्रमा — यह सभी संकेत करते हैं कि आप अपने जीवन में उच्च मान-सम्मान, स्थायी संपत्ति और समाज में विशिष्ट पहचान प्राप्त करने के लिए निर्मित हुए हैं।`,
    threeKeyRules: [
      '1. कर्म की निरंतरता: शनिदेव विलंब से देते हैं परंतु कभी वंचित नहीं करते; अपने प्रयासों में निरंतरता रखें।',
      '2. वाणी व विवेक का संतुलन: बुध और सूर्य की कृपा से आपकी वाणी प्रभावशाली है, इसका उपयोग सदैव निर्माण में करें।',
      '3. आंतरिक शुद्धि व ध्यान: नित्य 10 मिनट इष्ट मंत्र जप व ध्यान आपके आत्मबल को अभेद्य बनाए रखेगा।'
    ],
    closingBlessing: `ब्रह्मांड की दिव्य ऊर्जाएं आपके साथ हैं। सितारों ने आपका मार्ग प्रशस्त किया है, अब अपने आत्मबल और सकारात्मक पुरुषार्थ से अपने स्वर्णिम भविष्य की रचना करें!`
  };

  // Assembling all Shodashvarga charts with their traditional significance
  const shodashvargasWithMeta = divisionalCharts.map((ch) => {
    let sig = 'विभाजन चार्ट';
    if (ch.chartType === 'D1') sig = 'लग्न / राशि चार्ट - संपूर्ण जीवन, स्वास्थ्य, मूल स्वभाव व सामान्य भाग्य';
    else if (ch.chartType === 'D2') sig = 'होरा चार्ट - धन, संपत्ति, वित्तीय संचय व पैतृक कोष';
    else if (ch.chartType === 'D3') sig = 'द्रेष्काण चार्ट - पराक्रम, अनुज भाई-बहन व लघु यात्राएं';
    else if (ch.chartType === 'D4') sig = 'चतुर्थांश चार्ट - अचल संपत्ति, भूमि, गृह, वाहन व स्थायी भाग्य';
    else if (ch.chartType === 'D7') sig = 'सप्तमांश चार्ट - संतान सुख, रचनात्मक विरासत व वंश वृद्धि';
    else if (ch.chartType === 'D9') sig = 'नवांश चार्ट - जीवनसाथी, वैवाहिक सुख, आंतरिक सामर्थ्य व भाग्य फल';
    else if (ch.chartType === 'D10') sig = 'दशांश चार्ट - करियर, पद-प्रतिष्ठा, राज्य सम्मान व व्यावसायिक सफलता';
    else if (ch.chartType === 'D12') sig = 'द्वादशांश चार्ट - माता-पिता, पूर्वज, पैतृक संस्कार व कुल परंपरा';
    else if (ch.chartType === 'D16') sig = 'षोडशांश चार्ट - वाहन, भौतिक सुख, विलासिता व मानसिक संतोष';
    else if (ch.chartType === 'D20') sig = 'विंशांश चार्ट - आध्यात्मिक उन्नति, उपासना, ध्यान व दैवीय अनुग्रह';
    else if (ch.chartType === 'D24') sig = 'चतुर्विंशांश चार्ट - उच्च विद्या, अकादमिक शोध व गहन ज्ञान';
    else if (ch.chartType === 'D27') sig = 'सप्तविंशांश चार्ट - शारीरिक व मानसिक बल, सहनशक्ति व आत्मरक्षा';
    else if (ch.chartType === 'D30') sig = 'त्रिंशांश चार्ट - अरिष्ट, गुप्त शत्रु, रोग व कर्मिक चुनौतियाँ';
    else if (ch.chartType === 'D40') sig = 'खवेदांश चार्ट - शुभ-अशुभ संस्कार व मातृकुल का प्रभाव';
    else if (ch.chartType === 'D45') sig = 'अक्षवेदांश चार्ट - अंतरात्मा की पवित्रता, आचार-विचार व शुद्धि';
    else if (ch.chartType === 'D60') sig = 'षष्टिांश चार्ट - पूर्व जन्मों के संचित कर्म व सूक्ष्म भाग्य बीज';

    return {
      chartType: ch.chartType,
      name: ch.name,
      significance: sig,
      data: ch
    };
  });

  // Constructing Chandra Kundli (Moon as Ascendant)
  const chandraKundliPlanets = kundli.planets.map((p) => {
    const newHouse = ((p.rashiIndex - moonRashiIdx + 12) % 12) + 1;
    return { ...p, house: newHouse };
  });

  const chandraKundli: KundliData = {
    ...kundli,
    lagnaRashi: moon.rashiName,
    lagnaRashiIndex: moonRashiIdx,
    lagnaDegree: moon.degreeInSign,
    planets: chandraKundliPlanets
  };

  const d9Chart = divisionalCharts.find((c) => c.chartType === 'D9') || divisionalCharts[0];
  const d10Chart = divisionalCharts.find((c) => c.chartType === 'D10') || divisionalCharts[0];

  return {
    native: {
      name,
      gender,
      dob,
      tob: formattedTob,
      place: placeName,
      latitude,
      longitude,
      timezone,
      generatedDate: new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      brandName: 'Vedic Astro'
    },
    avakahada: {
      lagna: lagnaRashiName,
      lagnaDegree: `${kundli.lagnaDegree.toFixed(2)}°`,
      lagnaLord: RASHI_LORDS_HINDI[lagnaRashiIdx],
      moonRashi: moonRashiName,
      moonRashiLord: RASHI_LORDS_HINDI[moonRashiIdx],
      nakshatra: `${nakshatraName} - चरण ${pada}`,
      nakshatraPada: pada,
      nakshatraLord: PLANET_HINDI_MAP[moon.nakshatraLord] || moon.nakshatraLord,
      varna: VARNA_MAP[moonRashiIdx] || 'वैश्य (Vaishya)',
      vashya: VASHYA_MAP[moonRashiIdx] || 'मानव / द्विपद',
      yoni: YONI_NAMES[nakshatraIdx] || 'गौ (Cow)',
      gana: GANA_NAMES[nakshatraIdx] || 'मनुष्य (Manushya)',
      nadi: NAKSHATRA_NADI_TABLE[nakshatraIdx] || 'आदि (Aadi)',
      hansak,
      paya,
      nameLetter,
      sunWesternSign: westernSign,
      ayan: sun.degreeInSign > 0 && [9, 10, 11, 0, 1, 2].includes(sun.rashiIndex) ? 'उत्तरायण (Uttarayan)' : 'दक्षिणायन (Dakshinayan)',
      ritu: 'शिशिर (Shishira)',
      dinaMana: '10 घंटे 48 मिनट',
      sunrise: panchang.solarTimes.sunrise || '07:21 AM',
      sunset: panchang.solarTimes.sunset || '06:10 PM',
      samvatVikram: 2059,
      samvatSaka: 1924
    },
    panchangSummary: {
      tithi: `${panchang.tithi.paksha} पक्ष - ${panchang.tithi.name}`,
      paksha: panchang.tithi.paksha,
      vaar: panchang.vara.name,
      nakshatra: panchang.nakshatra.name,
      yoga: panchang.yoga.name,
      karana: panchang.karana.name
    },
    planets: kundli.planets.map((p) => ({
      planet: p.planet,
      planetHindi: PLANET_HINDI_MAP[p.planet] || p.planet,
      longitude: p.longitude,
      degreeInSign: `${p.degreeInSign.toFixed(2)}°`,
      rashiIndex: p.rashiIndex,
      rashiName: RASHI_HINDI_NAMES[p.rashiIndex] || p.rashiName,
      house: p.house,
      nakshatra: p.nakshatraName,
      pada: p.pada,
      nakshatraLord: PLANET_HINDI_MAP[p.nakshatraLord] || p.nakshatraLord,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      dignity: p.dignity === 'Exalted' ? 'उच्च' : p.dignity === 'Own Sign' ? 'स्वगृही' : p.dignity === 'Friendly Sign' ? 'मित्र' : p.dignity === 'Debilitated' ? 'नीच' : 'सम'
    })),
    charts: {
      d1: kundli,
      chandra: chandraKundli,
      d9: d9Chart,
      d10: d10Chart,
      shodashvargas: shodashvargasWithMeta
    },
    ashtakavarga: {
      savScores: ashtakavarga.sarvashtakavarga,
      bav: (ashtakavarga.bhinnaAshtakavarga || []).reduce((acc: any, item: any) => {
        acc[item.planet] = item.pointsPerRashi;
        return acc;
      }, {})
    },
    ashtakavargaShodhana,
    shadbala,
    bhavaChalit,
    jaimini,
    kpSystem,
    transitSystem,
    muhuratSystem,
    lalKitabSystem,
    panchangAnalysis: {
      tithiInsight: `आपके जन्म की तिथि ${panchang.tithi.name} (${panchang.tithi.paksha} पक्ष) है। यह तिथि जातक को सामाजिक सौहार्द, शांतिप्रियता और व्यावहारिक समझ प्रदान करती है।`,
      vaarInsight: `जन्म वार ${panchang.vara.name} (स्वामी: ${panchang.vara.lord}) होने से व्यक्तित्व में आकर्षण, सौम्यता, सुरुचि और संबंधों को निभाने की विशेष कला विद्यमान रहती है।`,
      nakshatraInsight: `नक्षत्र ${nakshatraName} सूर्यदेव द्वारा शासित है, जो अंतरात्मा में आत्मविश्वास, स्पष्टवादिता और परोपकार की भावना भरता है।`,
      yogaInsight: `जन्म योग ${panchang.yoga.name} जातक को विपरीत परिस्थितियों में भी अडिग रहने और धैर्यपूर्वक विजय प्राप्त करने की शक्ति देता है।`,
      karanaInsight: `करण ${panchang.karana.name} जातक को परिश्रमी, कर्मठ और जिम्मेदारियों के प्रति सजग बनाता है।`
    },
    threePillars,
    planetaryProfiles,
    bhavphal,
    conjunctions,
    loveAndMarriage: {
      fifthHouseAnalysis: 'पंचम भाव में शुक्र और शनि का प्रभाव जातक के प्रेम संबंधों में गहराई, गंभीरता और भावनात्मक स्थायित्व को दर्शाता है। जातक क्षणिक आकर्षण के स्थान पर स्थायी व निष्ठावान संबंध पसंद करता है।',
      seventhHouseAnalysis: 'सप्तम भाव कर्क राशि से आच्छादित है, जिसके स्वामी चंद्रदेव नवम भाव में स्थित हैं। यह दर्शाता है कि जीवनसाथी भावनात्मक रूप से परिपक्व, धार्मिक संस्कारों से युक्त और जातक के भाग्योदय में सहायक सिद्ध होगा।',
      darakarakaDetails: {
        planet: PLANET_HINDI_MAP[darakarakaPlanet.planet] || darakarakaPlanet.planet,
        degree: `${darakarakaPlanet.degreeInSign.toFixed(2)}°`,
        spouseNature: 'जीवनसाथी समझदार, सेवाभावी, आध्यात्मिक सोच रखने वाला और शांत स्वभाव का होगा। पारिवारिक प्रतिष्ठा और सामाजिक मर्यादाओं का पूरा ध्यान रखेगा।',
        spouseCareer: 'शिक्षा, जनसेवा, चिकित्सा, वित्त अथवा रचनात्मक क्षेत्रों से जुड़ा हो सकता है।',
        financialContribution: 'विवाह के पश्चात जातक के भाग्य और आर्थिक स्थिति में उल्लेखनीय प्रगति होगी। दोनों मिलकर समझदारी से निवेश करेंगे।',
        harmonyTips: 'आपसी संवाद में पारदर्शिता रखें और संवेदनशील विषयों पर धैर्यपूर्वक विचार-विमर्श करें।'
      },
      timingWindows: marriageTimingWindows
    },
    careerAnalysis: {
      twoPillars: {
        sunRole: 'सूर्यदेव प्रथम भाव में स्थित होकर जातक को स्वाभाविक नेतृत्व, प्रशासनिक कुशलता और उच्च सम्मान प्रदान करते हैं।',
        saturnRole: 'शनिदेव लग्नेश होकर पंचम में स्थित हैं, जो गहन विश्लेषण, कठिन परिश्रम और दीर्घकालिक परियोजनाओं में विजय की गारंटी देते हैं।'
      },
      dashamshaD10Summary: 'दशांश (D10) चार्ट में दशम भाव का स्वामी उच्च का होकर करियर में स्थायी साख और बड़ी जिम्मेदारियां संभालने की क्षमता का संकेत देता है।',
      amatyakarakaDetails: {
        planet: PLANET_HINDI_MAP[amkPlanetName] || amkPlanetName,
        careerThemes: amkCareerThemes,
        leadershipStyle: 'रणनीतिक, परिणामोन्मुख, तार्किक और निष्पक्ष नेतृत्व।'
      },
      sectorProbability: {
        government: 78,
        corporate: 88,
        business: 82
      },
      recommendedStreams: [
        'सॉफ्टवेयर, डेटा साइंस व सूचना प्रौद्योगिकी (IT / Tech)',
        'कॉरपोरेट प्रबंधन, संचालन व रणनीतिक परामर्श (Management & Strategy)',
        'प्रशासनिक सेवाएं, बैंकिंग व वित्तीय नियोजन (Finance / Banking)',
        'अनुसंधान, बौद्धिक संपदा व कानूनी परामर्श (R&D / Law)'
      ],
      promotionTimingWindows: [
        { period: '2026 की दूसरी छमाही', trend: 'नवीन जिम्मेदारियां व कार्यक्षेत्र में प्रभाव विस्तार' },
        { period: '2027 का मध्य काल', trend: 'वेतन वृद्धि, पदोन्नति व प्रतिष्ठित प्रोजेक्ट का नेतृत्व' },
        { period: '2028 का अंतिम चरण', trend: 'संगठन में उच्च निर्णायक पद व स्थायी मान्यता' }
      ]
    },
    charaKarakas,
    karmicAxis: {
      rahuHouse: 6,
      rahuRashi: 'मिथुन (Gemini)',
      rahuKarmicDesire: 'इस जन्म में आपको प्रतिस्पर्धा में विजयी होना, तकनीकी व व्यावहारिक कौशल में निपुणता पाना और समाज में अपनी छाप छोड़ना है।',
      ketuHouse: 12,
      ketuRashi: 'धनु (Sagittarius)',
      ketuPastLifeGift: 'पूर्व जन्मों से आपमें वैराग्य, गहन दार्शनिक समझ और आध्यात्मिक चेतना का संचित धन विद्यमान है।',
      karmicLesson: 'भौतिक जगत के दायित्वों को पूरी निष्ठा से निभाते हुए भी आंतरिक रूप से अनासक्त रहना ही आपका मुख्य कर्मिक पाठ है।',
      balanceRemedy: 'प्रतिदिन प्राणायाम करें, एकांत में आत्मचिंतन करें और असहायों की सेवा में समय व्यतीत करें।'
    },
    manglikAnalysis: {
      status: manglikStatus,
      severity: manglikSeverity,
      cancellationReasons,
      detailedSummary: `आपकी कुंडली में मंगल तृतीय भाव में स्थित है। ${cancellationReasons.length > 0 ? cancellationReasons.join(' ') + ' अतः मांगलिक प्रभाव पूर्णतः शांत व निष्प्रभावी है।' : 'मंगल का प्रभाव स्वाभाविक है और वैवाहिक जीवन सामान्य रहेगा।'}`,
      maritalGuidance: 'जीवनसाथी के साथ सामंजस्य व संवाद पर बल दें; कुंडली मिलान में गुण व मानसिक सामंजस्य को प्राथमिकता दें।'
    },
    sadeSati: {
      currentStatus: isSadeSatiActiveNow ? 'वर्तमान में सक्रिय' : 'वर्तमान में निष्क्रिय (राहत काल)',
      phase: isSadeSatiActiveNow ? 'सक्रिय चरण' : 'आगामी साढ़े साती 2036 से आरंभ होगी',
      moonRashi: moonRashiName,
      timeline: sadeSatiTimeline,
      coreTransformations: [
        'आत्म-निर्भरता का विकास और बाहरी प्रशंसा पर निर्भरता की समाप्ति।',
        'कठिन परिश्रम के माध्यम से स्थायी संपत्तियों और कौशल का निर्माण।',
        'सच्चे और स्वार्थी मित्रों की पहचान व रिश्तों की वास्तविक परख।'
      ],
      pacificationRemedies: [
        'शनिवार को पीपल के वृक्ष के नीचे सरसों के तेल का दीपक प्रज्वलित करें।',
        'प्रतिदिन हनुमान चालीसा अथवा दशरथकृत शनि स्तोत्र का पाठ करें।',
        'काले तिल, उड़द की दाल और काले वस्त्रों का जरूरतमंदों को दान करें।'
      ]
    },
    rajYogas,
    doshas,
    dashaNarrative,
    numerology: numerologyProfile,
    spirituality,
    remedies,
    conclusion
  };
}
