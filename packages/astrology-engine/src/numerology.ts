export interface NumerologyNumberProfile {
  number: number;
  rulingPlanet: string;
  rulingPlanetHindi: string;
  planetSymbol: string;
  title: string;
  traits: string[];
  traitsHindi: string[];
  luckyColors: string[];
  luckyDays: string[];
  luckyDates: number[];
  luckyGems: string[];
  compatibleNumbers: number[];
  enemyNumbers: number[];
  careerRecommendations: string[];
  careerRecommendationsHindi: string[];
}

export interface LoShuCell {
  number: number;
  count: number;
  display: string;
  rulingPlanet: string;
  element: string;
  direction: string;
}

export interface LoShuPlane {
  name: string;
  hindiName: string;
  numbers: number[];
  presentNumbers: number[];
  missingNumbers: number[];
  percentage: number;
  isComplete: boolean;
  significance: string;
  meaningHindi: string;
}

export interface MissingNumberRemedy {
  number: number;
  rulingPlanet: string;
  rulingPlanetHindi: string;
  missingTraitsHindi: string;
  remedies: string[];
}

export interface RepeatedNumberImpact {
  number: number;
  count: number;
  impactHindi: string;
  guidanceHindi: string;
}

export interface VibrationAnalysisResult {
  input: string;
  compoundSum: number;
  rootNumber: number;
  rulingPlanet: string;
  rulingPlanetHindi: string;
  planetSymbol: string;
  compatibilityWithMulank: 'Highly Auspicious (अत्यंत शुभ)' | 'Auspicious (शुभ)' | 'Neutral (सामान्य)' | 'Incompatible (अशुभ)';
  compatibilityWithBhagyank: 'Highly Auspicious (अत्यंत शुभ)' | 'Auspicious (शुभ)' | 'Neutral (सामान्य)' | 'Incompatible (अशुभ)';
  overallScore: number;
  verdictHindi: string;
  recommendation: string;
}

export interface DriverConductorHarmony {
  relation: 'Friend (मित्र)' | 'Neutral (सम)' | 'Enemy (शत्रु)';
  scorePercentage: number;
  analysisHindi: string;
  synergyAdviceHindi: string;
}

export interface PersonalTimeCycles {
  personalYear: number;
  personalYearTheme: string;
  personalMonth: number;
  personalMonthTheme: string;
  personalDay: number;
  personalDayTheme: string;
}

export interface LuckyCompass {
  luckyNumbers: number[];
  friendlyNumbers: number[];
  neutralNumbers: number[];
  enemyNumbers: number[];
  luckyColors: string[];
  luckyDays: string[];
  luckyGemstones: string[];
  luckyDirections: string[];
  bestProfessionsHindi: string[];
}

export interface NumerologyResult {
  mulank: NumerologyNumberProfile;
  bhagyank: NumerologyNumberProfile;
  namank?: NumerologyNumberProfile;
  dob: string;
  name?: string;
  compatibilitySummary: string;
  personalYearNumber: number;
  personalYearForecast: string;
  // Advanced Lo Shu & Predictive Additions
  loShuGrid: {
    matrix: (LoShuCell | null)[][];
    counts: Record<number, number>;
  };
  loShuPlanes: LoShuPlane[];
  goldenRajYogPresent: boolean;
  silverPropertyPlanePresent: boolean;
  missingNumbers: MissingNumberRemedy[];
  repeatedNumbers: RepeatedNumberImpact[];
  pythagoreanNamank?: number;
  soulUrgeNumber?: number;
  personalityNumber?: number;
  harmony: DriverConductorHarmony;
  timeCycles: PersonalTimeCycles;
  luckyCompass: LuckyCompass;
}

export const NUMEROLOGY_PROFILES: Record<number, NumerologyNumberProfile> = {
  1: {
    number: 1,
    rulingPlanet: 'Sun',
    rulingPlanetHindi: 'सूर्य',
    planetSymbol: '☀️',
    title: 'The Leader & Pioneer (नेतृत्वकर्ता व प्रणेता)',
    traits: ['Independent', 'Ambitious', 'Leadership-driven', 'Creative', 'Self-reliant'],
    traitsHindi: ['स्वतंत्र', 'महत्वाकांक्षी', 'नेतृत्व क्षमता', 'रचनात्मक', 'आत्मनिर्भर'],
    luckyColors: ['Gold', 'Yellow', 'Orange', 'Saffron'],
    luckyDays: ['Sunday', 'Monday'],
    luckyDates: [1, 10, 19, 28],
    luckyGems: ['Ruby (मानिक)', 'Sunstone'],
    compatibleNumbers: [1, 2, 3, 5, 9],
    enemyNumbers: [8],
    careerRecommendations: [
      'Government Services & Administration (IAS/IPS)',
      'CEO & Executive Roles',
      'Politics & Public Leadership',
      'Solar Energy & Defense Sector',
      'Entrepreneurship & Startup Founders'
    ],
    careerRecommendationsHindi: [
      'सरकारी व प्रशासनिक सेवा (IAS/IPS/प्रशासन)',
      'CEO व उच्च कार्यकारी भूमिकाएं (Executive Leader)',
      'राजनीति व सार्वजनिक नेतृत्व',
      'सौर ऊर्जा व रक्षा क्षेत्र (Solar & Defense)',
      'उद्यमिता व स्टार्टअप फाउंडर'
    ]
  },
  2: {
    number: 2,
    rulingPlanet: 'Moon',
    rulingPlanetHindi: 'चन्द्र',
    planetSymbol: '🌙',
    title: 'The Diplomat & Artist (राजनयिक व कलाकार)',
    traits: ['Intuitive', 'Sensitive', 'Cooperative', 'Artistic', 'Diplomatic'],
    traitsHindi: ['सहज ज्ञान युक्त', 'संवेदनशील', 'सहयोगात्मक', 'कलात्मक', 'शांतिप्रिय'],
    luckyColors: ['White', 'Cream', 'Light Blue', 'Silver'],
    luckyDays: ['Monday', 'Sunday'],
    luckyDates: [2, 11, 20, 29],
    luckyGems: ['Pearl (मोती)', 'Moonstone'],
    compatibleNumbers: [1, 2, 3, 7],
    enemyNumbers: [4, 8, 9],
    careerRecommendations: [
      'Arts, Media & Performing Arts',
      'Psychology & Professional Counseling',
      'Dairy, Beverages & Liquid Products',
      'Hospitality & Caregiving',
      'Public Relations & Diplomacy'
    ],
    careerRecommendationsHindi: [
      'कला, मीडिया व ललित कला (Arts & Cinema)',
      'मनोविज्ञान व काउंसलिंग (Counseling & Psychology)',
      'डेयरी, पेय पदार्थ व शिपिंग उद्योग',
      'आतिथ्य (Hospitality) व केयरगिविंग',
      'जनसंपर्क व कूटनीति (PR & Diplomacy)'
    ]
  },
  3: {
    number: 3,
    rulingPlanet: 'Jupiter',
    rulingPlanetHindi: 'गुरु (बृहस्पति)',
    planetSymbol: '👑',
    title: 'The Scholar & Advisor (विद्वान व सलाहकार)',
    traits: ['Knowledgeable', 'Optimistic', 'Spiritual', 'Expressive', 'Philosophical'],
    traitsHindi: ['ज्ञानवान', 'आशावादी', 'आध्यात्मिक', 'रचनात्मक', 'दार्शनिक'],
    luckyColors: ['Bright Yellow', 'Golden', 'Pink'],
    luckyDays: ['Thursday', 'Friday'],
    luckyDates: [3, 12, 21, 30],
    luckyGems: ['Yellow Sapphire (पुखराज)', 'Citrine'],
    compatibleNumbers: [1, 2, 3, 5, 7, 9],
    enemyNumbers: [6],
    careerRecommendations: [
      'Education, Teaching & Universities',
      'Legal Profession & Judiciary',
      'Financial Services & Wealth Management',
      'Religious & Spiritual Organizations',
      'Publishing, Writing & Advisory'
    ],
    careerRecommendationsHindi: [
      'शिक्षा, अध्यापन व विश्वविद्यालय (Teaching & Academia)',
      'कानून व न्यायपालिका (Legal & Judiciary)',
      'वित्तीय सेवाएं व सलाहकार पद (Financial Advisory)',
      'धार्मिक व आध्यात्मिक संस्थाएं',
      'प्रकाशन, लेखन व परामर्श (Publishing & Consulting)'
    ]
  },
  4: {
    number: 4,
    rulingPlanet: 'Rahu',
    rulingPlanetHindi: 'राहु',
    planetSymbol: '⚡',
    title: 'The Innovator & Strategist (नवाचारकर्ता व रणनीतिकार)',
    traits: ['Practical', 'Analytical', 'Unconventional', 'Hardworking', 'Technological'],
    traitsHindi: ['व्यावहारिक', 'विश्लेषणात्मक', 'गैर-पारंपरिक', 'मेहनती', 'तकनीकी दक्ष'],
    luckyColors: ['Electric Blue', 'Grey', 'Patterned/Khaki'],
    luckyDays: ['Saturday', 'Sunday'],
    luckyDates: [4, 13, 22, 31],
    luckyGems: ['Hessonite (गोमेद)', 'Smoky Quartz'],
    compatibleNumbers: [1, 5, 6, 7, 8],
    enemyNumbers: [2, 9],
    careerRecommendations: [
      'Artificial Intelligence & High Tech',
      'Software Engineering & IT Architecture',
      'Aviation, Space & Electronics',
      'Pharmaceuticals & Biotech Research',
      'Import-Export & Strategic Planning'
    ],
    careerRecommendationsHindi: [
      'आर्टिफिशियल इंटेलिजेंस (AI) व टेक रिसर्च',
      'सॉफ्टवेयर इंजीनियरिंग व IT आर्किटेक्चर',
      'एविएशन, इलेक्ट्रॉनिक्स व स्पेस रिसर्च',
      'फार्मास्युटिकल्स व बायोटेक्नोलॉजी',
      'आयात-निर्यात व रणनीतिक योजना (Import-Export)'
    ]
  },
  5: {
    number: 5,
    rulingPlanet: 'Mercury',
    rulingPlanetHindi: 'बुध',
    planetSymbol: '🟢',
    title: 'The Merchant & Communicator (व्यापारी व संचारक)',
    traits: ['Adaptable', 'Versatile', 'Quick-witted', 'Business-minded', 'Charming'],
    traitsHindi: ['अनुकूलनशील', 'बहुमुखी', 'तीक्ष्ण बुद्धि', 'व्यापारिक सोच', 'वाकपटु'],
    luckyColors: ['Green', 'Light Green', 'White'],
    luckyDays: ['Wednesday', 'Friday'],
    luckyDates: [5, 14, 23],
    luckyGems: ['Emerald (पन्ना)', 'Green Tourmaline'],
    compatibleNumbers: [1, 3, 5, 6],
    enemyNumbers: [],
    careerRecommendations: [
      'Commerce, Business & Trading',
      'Marketing, Advertising & PR',
      'Stock Market & Financial Trading',
      'Media, Journalism & Broadcasting',
      'Travel, Tourism & Foreign Trade'
    ],
    careerRecommendationsHindi: [
      'वाणिज्य, व्यापार व बिज़नेस (Commerce & Trade)',
      'मार्केटिंग, विज्ञापन व डिजिटल मीडिया',
      'शेयर बाज़ार व फाइनेंशियल ट्रेडिंग (Stock Trading)',
      'मीडिया, पत्रकारिता व एंकरिंग',
      'टूरिज्म, ट्रेवल व विदेश व्यापार'
    ]
  },
  6: {
    number: 6,
    rulingPlanet: 'Venus',
    rulingPlanetHindi: 'शुक्र',
    planetSymbol: '✨',
    title: 'The Stylist & Entertainer (सौंदर्यप्रेमी व कलाकार)',
    traits: ['Charming', 'Harmonious', 'Luxury-loving', 'Creative', 'Compassionate'],
    traitsHindi: ['आकर्षक', 'सामंजस्यप्रिय', 'लक्जरी प्रेमी', 'रचनात्मक', 'दयालु'],
    luckyColors: ['White', 'Light Blue', 'Silver', 'Pastel Shades'],
    luckyDays: ['Friday', 'Tuesday'],
    luckyDates: [6, 15, 24],
    luckyGems: ['Diamond (हीरा)', 'Zircon', 'Opal'],
    compatibleNumbers: [4, 5, 6, 7, 8],
    enemyNumbers: [3],
    careerRecommendations: [
      'Fashion, Beauty & Luxury Industry',
      'Cinema, Film Production & Entertainment',
      'Gems, Jewelry & Perfumery',
      'Architecture & Interior Design',
      'Luxurious Hospitality & Event Planning'
    ],
    careerRecommendationsHindi: [
      'फैशन, सौंदर्य व लक्जरी ब्रांड्स (Fashion & Beauty)',
      'सिनेमा, फिल्म निर्माण व मनोरंजन जगत',
      'रत्न, आभूषण व इत्र व्यापार (Gems & Perfumes)',
      'आर्किटेक्चर व इंटीरियर डिजाइनिंग',
      'लक्जरी हॉस्पिटैलिटी व इवेंट मैनेजमेंट'
    ]
  },
  7: {
    number: 7,
    rulingPlanet: 'Ketu',
    rulingPlanetHindi: 'केतु',
    planetSymbol: '🚩',
    title: 'The Analyst & Mystic (शोधकर्ता व रहस्यवादी)',
    traits: ['Analytical', 'Philosophical', 'Spiritual', 'Introverted', 'Research-oriented'],
    traitsHindi: ['विश्लेषणात्मक', 'दार्शनिक', 'आध्यात्मिक', 'गंभीर चिंतक', 'अनुसंधानकर्ता'],
    luckyColors: ['Light Green', 'White', 'Light Yellow'],
    luckyDays: ['Sunday', 'Monday'],
    luckyDates: [7, 16, 25],
    luckyGems: ['Cat\'s Eye (लहसुनिया)', 'Chrysoberyl'],
    compatibleNumbers: [2, 3, 5, 7],
    enemyNumbers: [8],
    careerRecommendations: [
      'Astrology, Mysticism & Occult Sciences',
      'Scientific Research & Data Analytics',
      'Yoga, Ayurveda & Alternative Medicine',
      'Archaeology & Historical Studies',
      'NGOs, Charitable Foundations & Healing'
    ],
    careerRecommendationsHindi: [
      'ज्योतिष, अध्यात्म व गूढ़ विद्याएं (Astrology & Occult)',
      'वैज्ञानिक शोध व डेटा एनालिटिक्स (Research & Analytics)',
      'योग, आयुर्वेद व वैकल्पिक चिकित्सा (Alternative Healing)',
      'पुरातत्व व इतिहास अध्ययन (Archaeology)',
      'NGO, परोपकारी संस्थाएं व हीलिंग'
    ]
  },
  8: {
    number: 8,
    rulingPlanet: 'Saturn',
    rulingPlanetHindi: 'शनि',
    planetSymbol: '🪐',
    title: 'The Authority & Industrialist (उद्योगपति व प्रशासक)',
    traits: ['Disciplined', 'Persevering', 'Practical', 'Authoritative', 'Realist'],
    traitsHindi: ['अनुशासित', 'धैर्यवान', 'व्यावहारिक', 'अधिकार संपन्न', 'यथार्थवादी'],
    luckyColors: ['Dark Blue', 'Black', 'Navy Blue'],
    luckyDays: ['Saturday', 'Wednesday'],
    luckyDates: [8, 17, 26],
    luckyGems: ['Blue Sapphire (नीलम)', 'Amethyst'],
    compatibleNumbers: [4, 5, 6, 8],
    enemyNumbers: [1, 2, 9],
    careerRecommendations: [
      'Mining, Oil, Gas & Natural Resources',
      'Iron, Steel & Heavy Manufacturing',
      'Real Estate, Construction & Infrastructure',
      'Law Enforcement, Judiciary & Labor Relations',
      'Logistics, Operations & Supply Chain'
    ],
    careerRecommendationsHindi: [
      'खनन, तेल, गैस व प्राकृतिक संसाधन (Mining & Oil)',
      'लोहा, इस्पात व भारी उद्योग (Iron & Steel)',
      'रियल एस्टेट, निर्माण व इंफ्रास्ट्रक्चर',
      'कानून प्रवर्तन, न्यायपालिका व श्रम संघ (Labor Laws)',
      'लॉजिस्टिक्स, ऑपरेशन्स व सप्लाई चेन'
    ]
  },
  9: {
    number: 9,
    rulingPlanet: 'Mars',
    rulingPlanetHindi: 'मंगल',
    planetSymbol: '🔥',
    title: 'The Warrior & Humanitarian (योद्धा व मानवप्रेमी)',
    traits: ['Courageous', 'Energetic', 'Humanitarian', 'Passionate', 'Dynamic'],
    traitsHindi: ['साहसी', 'ऊर्जावान', 'मानवप्रेमी', 'जुनूनी', 'गतिशील'],
    luckyColors: ['Red', 'Maroon', 'Crimson', 'Pink'],
    luckyDays: ['Tuesday', 'Sunday'],
    luckyDates: [9, 18, 27],
    luckyGems: ['Red Coral (मूंगा)', 'Carnelian'],
    compatibleNumbers: [1, 2, 3, 9],
    enemyNumbers: [2, 4, 8],
    careerRecommendations: [
      'Defense, Army, Police & Security Forces',
      'Surgery & Medical Emergency Services',
      'Civil & Mechanical Engineering',
      'Sports, Athletics & Fitness Industry',
      'Weapons, Construction & Heavy Machinery'
    ],
    careerRecommendationsHindi: [
      'सैन्यबल, पुलिस व सुरक्षा बल (Military & Police)',
      'शल्य चिकित्सा व मेडिकल इमरजेंसी (Surgeons)',
      'सिविल व मैकेनिकल इंजीनियरिंग',
      'खेलकूद, एथलेटिक्स व फिटनेस उद्योग',
      'हथियार निर्माण व कंस्ट्रक्शन मशीनरी'
    ]
  }
};

/**
 * Reduces any string of digits to a single digit (1-9)
 */
export function reduceToSingleDigit(num: number | string): number {
  let str = num.toString().replace(/\D/g, '');
  while (str.length > 1) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += parseInt(str[i], 10);
    }
    str = sum.toString();
  }
  return parseInt(str, 10) || 1;
}

/**
 * Calculates Mulank (Day of birth reduced to 1-9)
 * e.g. DOB: 1998-09-28 -> Day is 28 -> 2+8 = 10 -> 1+0 = 1
 */
export function calculateMulank(dobString: string): number {
  if (!dobString) return 1;
  const parts = dobString.split('-');
  const day = parts.length === 3 ? parseInt(parts[2], 10) : parseInt(dobString, 10);
  return reduceToSingleDigit(day);
}

/**
 * Calculates Bhagyank (Full DOB reduced to 1-9)
 * e.g. DOB: 2002-02-01 -> 2+0+0+2+0+2+0+1 = 7
 */
export function calculateBhagyank(dobString: string): number {
  if (!dobString) return 1;
  const cleanStr = dobString.replace(/\D/g, '');
  return reduceToSingleDigit(cleanStr);
}

/**
 * Calculates Namank (Name Number) using Chaldean / Cheiro Numerology system
 */
export const CHALDEAN_NUMEROLOGY_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

export const PYTHAGOREAN_NUMEROLOGY_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

export function calculateNamank(name: string): number {
  if (!name) return 1;
  const upper = name.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  for (let i = 0; i < upper.length; i++) {
    const char = upper[i];
    sum += CHALDEAN_NUMEROLOGY_MAP[char] || 0;
  }
  return reduceToSingleDigit(sum);
}

export function calculatePythagoreanNamank(name: string): number {
  if (!name) return 1;
  const upper = name.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  for (let i = 0; i < upper.length; i++) {
    sum += PYTHAGOREAN_NUMEROLOGY_MAP[upper[i]] || 0;
  }
  return reduceToSingleDigit(sum);
}

export function calculateSoulUrgeNumber(name: string): number {
  if (!name) return 1;
  const upper = name.toUpperCase().replace(/[^A-Z]/g, '');
  const vowels = new Set(['A', 'E', 'I', 'O', 'U']);
  let sum = 0;
  for (let i = 0; i < upper.length; i++) {
    if (vowels.has(upper[i])) {
      sum += PYTHAGOREAN_NUMEROLOGY_MAP[upper[i]] || 0;
    }
  }
  return sum > 0 ? reduceToSingleDigit(sum) : 1;
}

export function calculatePersonalityNumber(name: string): number {
  if (!name) return 1;
  const upper = name.toUpperCase().replace(/[^A-Z]/g, '');
  const vowels = new Set(['A', 'E', 'I', 'O', 'U']);
  let sum = 0;
  for (let i = 0; i < upper.length; i++) {
    if (!vowels.has(upper[i])) {
      sum += PYTHAGOREAN_NUMEROLOGY_MAP[upper[i]] || 0;
    }
  }
  return sum > 0 ? reduceToSingleDigit(sum) : 1;
}

export function calculateLoShuGrid(dobString: string, mulank: number, bhagyank: number) {
  const cleanStr = dobString.replace(/\D/g, '');
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  for (let i = 0; i < cleanStr.length; i++) {
    const digit = parseInt(cleanStr[i], 10);
    if (digit >= 1 && digit <= 9) {
      counts[digit] = (counts[digit] || 0) + 1;
    }
  }

  if (mulank >= 1 && mulank <= 9) counts[mulank] = (counts[mulank] || 0) + 1;
  if (bhagyank >= 1 && bhagyank <= 9) counts[bhagyank] = (counts[bhagyank] || 0) + 1;

  const cellDetails: Record<number, { planet: string; element: string; direction: string }> = {
    4: { planet: 'Rahu (राहु)', element: 'Wood (काष्ठ)', direction: 'Southeast (आग्नेय)' },
    9: { planet: 'Mars (मंगल)', element: 'Fire (अग्नि)', direction: 'South (दक्षिण)' },
    2: { planet: 'Moon (चंद्र)', element: 'Earth (पृथ्वी)', direction: 'Southwest (नैऋत्य)' },
    3: { planet: 'Jupiter (गुरु)', element: 'Wood (काष्ठ)', direction: 'East (पूर्व)' },
    5: { planet: 'Mercury (बुध)', element: 'Earth (पृथ्वी)', direction: 'Center (ब्रह्मस्थान)' },
    7: { planet: 'Ketu (केतु)', element: 'Metal (धातु)', direction: 'West (पश्चिम)' },
    8: { planet: 'Saturn (शनि)', element: 'Earth (पृथ्वी)', direction: 'Northeast (ईशान)' },
    1: { planet: 'Sun (सूर्य)', element: 'Water (जल)', direction: 'North (उत्तर)' },
    6: { planet: 'Venus (शुक्र)', element: 'Metal (धातु)', direction: 'Northwest (वायव्य)' }
  };

  const createCell = (num: number): LoShuCell => {
    const c = counts[num] || 0;
    const meta = cellDetails[num];
    return {
      number: num,
      count: c,
      display: c > 0 ? Array(c).fill(num.toString()).join(' ') : '-',
      rulingPlanet: meta.planet,
      element: meta.element,
      direction: meta.direction
    };
  };

  const matrix: (LoShuCell | null)[][] = [
    [createCell(4), createCell(9), createCell(2)],
    [createCell(3), createCell(5), createCell(7)],
    [createCell(8), createCell(1), createCell(6)]
  ];

  return { matrix, counts };
}

export function calculateLoShuPlanes(counts: Record<number, number>): LoShuPlane[] {
  const planeDefs = [
    {
      name: 'Mental Plane',
      hindiName: 'मानसिक तल (4 - 9 - 2)',
      numbers: [4, 9, 2],
      significance: 'Intellectual acumen, sharp memory, analytical depth, strategic planning',
      meaningHindi: 'तीक्ष्ण स्मरण शक्ति, तार्किक विश्लेषण क्षमता व गहरी बौद्धिक सोच का प्रतीक।'
    },
    {
      name: 'Emotional / Heart Plane',
      hindiName: 'भावनात्मक तल (3 - 5 - 7)',
      numbers: [3, 5, 7],
      significance: 'Intuitive insight, compassion, feelings, artistic spirituality',
      meaningHindi: 'सहज अंतर्ज्ञान (Intuition), दयालुता, कलात्मक संवेदना व आध्यात्मिक जुड़ाव।'
    },
    {
      name: 'Practical Plane',
      hindiName: 'व्यावहारिक तल (8 - 1 - 6)',
      numbers: [8, 1, 6],
      significance: 'Grounded realism, physical execution, financial stability, hard work',
      meaningHindi: 'धरातलीय व्यावहारिकता, अथक परिश्रम, भौतिक सफलता व वित्तीय सुदृढ़ता।'
    },
    {
      name: 'Thought Plane',
      hindiName: 'विचार / दृष्टि तल (4 - 3 - 8)',
      numbers: [4, 3, 8],
      significance: 'Visionary thinking, organizational foresight, structured planning',
      meaningHindi: 'दीर्घकालिक दृष्टिकोण, योजना निर्माण, संगठन कौशल व अनुशासन।'
    },
    {
      name: 'Will Power Plane',
      hindiName: 'इच्छाशक्ति तल (9 - 5 - 1)',
      numbers: [9, 5, 1],
      significance: 'Unshakable tenacity, determination, perseverance, leader vigor',
      meaningHindi: 'अटूट संकल्प, कभी न झुकने वाला आत्मविश्वास, दृढ़ इच्छाशक्ति व नेतृत्व।'
    },
    {
      name: 'Action Plane',
      hindiName: 'कर्म / क्रिया तल (2 - 7 - 6)',
      numbers: [2, 7, 6],
      significance: 'Prompt decisive action, spontaneous execution, physical agility',
      meaningHindi: 'विचारों को तत्काल धरातल पर उतारने की क्षमता, त्वरित निर्णय व सक्रियता।'
    },
    {
      name: 'Golden Raj Yog Plane',
      hindiName: 'स्वर्ण राजयोग तल (4 - 5 - 6)',
      numbers: [4, 5, 6],
      significance: 'The ultimate royal wealth & prosperity diagonal plane: luxury, authority, empire',
      meaningHindi: 'अंकशास्त्र का सबसे शक्तिशाली राजयोग! यह व्यक्ति को अपार धन, भव्य वाहन, राजसी वैभव व विशाल सफलता दिलाता है।'
    },
    {
      name: 'Silver Property / Earth Plane',
      hindiName: 'रजत संपत्ति व भूमि योग तल (2 - 5 - 8)',
      numbers: [2, 5, 8],
      significance: 'Real estate, land ownership, deep patience, grounded stability',
      meaningHindi: 'अचल संपत्ति, भूमि, भवन, रियल एस्टेट व स्थाई संपत्ति संचय का दुर्लभ योग।'
    }
  ];

  return planeDefs.map((p) => {
    const present = p.numbers.filter((n) => (counts[n] || 0) > 0);
    const missing = p.numbers.filter((n) => (counts[n] || 0) === 0);
    const percentage = Math.round((present.length / p.numbers.length) * 100);
    const isComplete = present.length === p.numbers.length;
    return {
      name: p.name,
      hindiName: p.hindiName,
      numbers: p.numbers,
      presentNumbers: present,
      missingNumbers: missing,
      percentage,
      isComplete,
      significance: p.significance,
      meaningHindi: p.meaningHindi
    };
  });
}

export function getMissingNumbersRemedies(counts: Record<number, number>): MissingNumberRemedy[] {
  const allRemedies: Record<number, { planet: string; planetHindi: string; traits: string; remedies: string[] }> = {
    1: {
      planet: 'Sun',
      planetHindi: 'सूर्य',
      traits: 'आत्मविश्वास की कमी, अपनी बात रखने में संकोच, नेतृत्व क्षमता में झिझक।',
      remedies: [
        'नित्य प्रातः तांबे के लोटे से भगवान सूर्य को कुमकुम युक्त जल अर्पित करें।',
        'दाएं हाथ की कलाई पर लाल मौली (कलावा) धारण करें।',
        'पिता का आदर करें व रविवार को नमक का त्याग करें।'
      ]
    },
    2: {
      planet: 'Moon',
      planetHindi: 'चंद्रमा',
      traits: 'धैर्य की कमी, अति-संवेदनशीलता, दूसरों की भावनाओं को समझने में कठिनाई।',
      remedies: [
        'चांदी के गिलास में पानी पीने का नियम बनाएं।',
        'सोमवार को भगवान शिव का दूध व जल से रुद्राभिषेक करें।',
        'माता का चरण स्पर्श कर आशीर्वाद लें व मोती अथवा मूनस्टोन रत्न पहनें।'
      ]
    },
    3: {
      planet: 'Jupiter',
      planetHindi: 'बृहस्पति (गुरु)',
      traits: 'ज्ञान के क्रियान्वयन में रुकावट, एकाग्रता की कमी, वाणी में मार्गदर्शन का अभाव।',
      remedies: [
        'माथे पर नियमित केसर या हल्दी का तिलक लगाएं।',
        'गुरुवार को चने की दाल व केले का दान करें।',
        'गुरुओं, शिक्षकों व संतों का सत्कार करें एवं गायत्री मंत्र का जप करें।'
      ]
    },
    4: {
      planet: 'Rahu',
      planetHindi: 'राहु',
      traits: 'अनुशासनहीनता, समय प्रबंधन में परेशानी, भविष्य की ठोस योजना न बना पाना।',
      remedies: [
        'अपने पास हमेशा एक लकड़ी का पेन (Wooden Pen) रखें।',
        'घर के दक्षिण-पश्चिम (नैऋत्य) कोने को भारी व पूर्णतः स्वच्छ रखें।',
        'रुद्राक्ष की माला पहनें व किसी सफाईकर्मी को समय-समय पर दान दें।'
      ]
    },
    5: {
      planet: 'Mercury',
      planetHindi: 'बुध',
      traits: 'जीवन में संतुलन की कमी, व्यापार में उतार-चढ़ाव, निर्णय लेने में भ्रम।',
      remedies: [
        'घर के केंद्र (ब्रह्मस्थान) या पूर्व दिशा में हरा बांस (Green Bamboo) का पौधा रखें।',
        'बुधवार के दिन गाय को हरा चारा अथवा हरी पालक खिलाएं।',
        'हरे रंग के वस्त्र, पन्ना अथवा ग्रीन एवेंच्यूरिन ब्रेसलेट धारण करें।'
      ]
    },
    6: {
      planet: 'Venus',
      planetHindi: 'शुक्र',
      traits: 'लक्जरी व भौतिक सुखों में कमी, संबंधों में आकर्षण की कमी, पारिवारिक असंतोष।',
      remedies: [
        'नियमित सुगंधित इत्र (Attar) अथवा परफ्यूम का प्रयोग करें।',
        'दाएं हाथ में चांदी का कड़ा अथवा स्फटिक की माला धारण करें।',
        'महिलाओं का सम्मान करें और शुक्रवार को सफेद मिष्ठान का दान करें।'
      ]
    },
    7: {
      planet: 'Ketu',
      planetHindi: 'केतु',
      traits: 'आध्यात्मिक शांति की कमी, बार-बार निराशा, लोगों पर अति-विश्वास से धोखा।',
      remedies: [
        'काले-सफेद कुत्ते (Street Dog) को नित्य रोटी खिलाएं।',
        'धार्मिक पुस्तकों का अध्ययन व नियमित 15 मिनट ध्यान (Meditation) करें।',
        'लहसुनिया (Cat’s Eye) अथवा भूरे/मटमैले रंग का ब्रेसलेट धारण करें।'
      ]
    },
    8: {
      planet: 'Saturn',
      planetHindi: 'शनि',
      traits: 'वित्तीय प्रबंधन में कठिनाई, धैर्य की कमी, कानूनी या संपत्ति विवाद।',
      remedies: [
        'शनिवार को पीपल के वृक्ष के नीचे सरसों के तेल का दीपक प्रज्वलित करें।',
        'श्रमिकों, असहायों व दिव्यांगों की यथासंभव आर्थिक मदद करें।',
        'काले रंग का जूता दान करें व मध्यमा अंगुली में लोहे का छल्ला पहनें।'
      ]
    },
    9: {
      planet: 'Mars',
      planetHindi: 'मंगल',
      traits: 'ऊर्जा व उत्साह में कमी, क्रोध प्रबंधन में दिक्कत, साहसिक निर्णयों में भय।',
      remedies: [
        'नियमित हनुमान चालीसा का पाठ करें व मंगलवार को सिंदूर चढ़ाएं।',
        'समय-समय पर रक्तदान (Blood Donation) करें।',
        'तांबे का कड़ा धारण करें व लाल मसूर की दाल का दान करें।'
      ]
    }
  };

  const missingList: MissingNumberRemedy[] = [];
  for (let n = 1; n <= 9; n++) {
    if ((counts[n] || 0) === 0) {
      const item = allRemedies[n];
      missingList.push({
        number: n,
        rulingPlanet: item.planet,
        rulingPlanetHindi: item.planetHindi,
        missingTraitsHindi: item.traits,
        remedies: item.remedies
      });
    }
  }
  return missingList;
}

export function getRepeatedNumbersImpacts(counts: Record<number, number>): RepeatedNumberImpact[] {
  const impactMap: Record<number, Record<number, { impact: string; guidance: string }>> = {
    1: {
      2: { impact: 'उत्कृष्ट संचारक, आत्मविश्वासी व स्वाभाविक नेता।', guidance: 'अपनी बात विनम्रता से कहें, अहंकार से बचें।' },
      3: { impact: 'अति-वाकपटु, केंद्र में रहने की तीव्र लालसा, संवेदनशील अहंकार।', guidance: 'दूसरों की बातें सुनने का अभ्यास करें।' },
      4: { impact: 'अत्यधिक प्रभुत्वशाली, क्रोध की अधिकता व एकांतप्रिय।', guidance: 'प्रतिदिन ध्यान व मौन व्रत का अभ्यास हितकर है।' }
    },
    2: {
      2: { impact: 'गहरी संवेदनशीलता, अंतर्ज्ञान, कलात्मक व शांतिप्रिय स्वभाव।', guidance: 'भावनात्मक संतुलन बनाए रखें, अति-चिंता से बचें।' },
      3: { impact: 'अति-संवेदनशील, मूड स्विंग्स व छोटी बातों से आहत होना।', guidance: 'प्राणायाम करें व चांदी का छल्ला पहनें।' },
      4: { impact: 'मानसिक अस्थिरता व अत्यधिक भय।', guidance: 'प्रतिदिन शिव उपासना करें।' }
    },
    3: {
      2: { impact: 'उच्च बौद्धिक रचनात्मकता, प्रखर लेखक व वक्ता।', guidance: 'ज्ञान का सही दिशा में सदुपयोग करें।' },
      3: { impact: 'अति-कल्पनाशीलता, यथार्थ से दूर ख्याली पुलाव बनाना।', guidance: 'विचारों को तुरंत कार्यरूप में बदलें।' }
    },
    4: {
      2: { impact: 'कठोर परिश्रमी, व्यवस्थित योजनाकार व व्यावहारिक।', guidance: 'थोड़ा लचीलापन अपनाएं, कठोरता से बचें।' },
      3: { impact: 'अति-हठी व अचानक क्रोधित होने की प्रवृत्ति।', guidance: 'तनाव कम करने के लिए योग का सहारा लें।' }
    },
    5: {
      2: { impact: 'अद्भुत व्यापारिक समझ, यात्रा प्रेमी व बहुमुखी प्रतिभा।', guidance: 'एक समय में एक ही लक्ष्य पर ध्यान केंद्रित रखें।' },
      3: { impact: 'अधीरता, जोखिम उठाने की अत्यधिक लत व चंचलता।', guidance: 'जोखिम भरे वित्तीय फैसलों में विशेषज्ञ सलाह लें।' }
    },
    6: {
      2: { impact: 'सौंदर्य व कला प्रेमी, पारिवारिक जिम्मेदारियों में तत्पर।', guidance: 'दूसरों पर अत्यधिक निर्भर न रहें।' },
      3: { impact: 'भौतिक सुखों व दिखावे में अत्यधिक व्यय।', guidance: 'बजट बनाकर खर्च करें।' }
    },
    7: {
      2: { impact: 'गहन शोधकर्ता, दार्शनिक, अध्यात्म व विज्ञान में रुचि।', guidance: 'सकारात्मक सोच रखें, अकारण संदेह से बचें।' },
      3: { impact: 'एकांतप्रियता, समाज से दूरी व वैराग्य भावना।', guidance: 'परिवार व समाज के साथ सक्रिय संवाद रखें।' }
    },
    8: {
      2: { impact: 'अनुशासनबद्ध, विशाल संपत्ति निर्माता व धैर्यवान।', guidance: 'कार्य और विश्राम में संतुलन बनाएं।' },
      3: { impact: 'कठोरता, भौतिकता के पीछे अंधी दौड़ व मानसिक तनाव।', guidance: 'दान-पुण्य व सेवा कार्यों में समय बिताएं।' }
    },
    9: {
      2: { impact: 'अदम्य साहसी, परोपकारी व क्रांतिकारी नेतृत्व क्षमता।', guidance: 'उतावलेपन से बचें, सोच-समझकर निर्णय लें।' },
      3: { impact: 'अत्यधिक क्रोध, अधीरता व झगड़े में उलझना।', guidance: 'शीतलता बनाए रखने के लिए चंदन का तिलक लगाएं।' }
    }
  };

  const results: RepeatedNumberImpact[] = [];
  for (let n = 1; n <= 9; n++) {
    const c = counts[n] || 0;
    if (c >= 2) {
      const numMap = impactMap[n];
      const tier = c >= 4 ? 4 : c === 3 ? 3 : 2;
      const data = numMap?.[tier] || numMap?.[2] || {
        impact: `अंक ${n} कुंडली में ${c} बार दोहराया गया है, जिससे इस ग्रह की ऊर्जा अत्यधिक तीव्र हो गई है।`,
        guidance: 'इस ऊर्जा को संतुलित करने के लिए संबंधित ग्रह का दान व ध्यान करें।'
      };
      results.push({
        number: n,
        count: c,
        impactHindi: data.impact,
        guidanceHindi: data.guidance
      });
    }
  }
  return results;
}

export function calculateDriverConductorHarmony(mulank: number, bhagyank: number): DriverConductorHarmony {
  const mProf = NUMEROLOGY_PROFILES[mulank] || NUMEROLOGY_PROFILES[1];
  const isComp = mProf.compatibleNumbers.includes(bhagyank);
  const isEnem = mProf.enemyNumbers.includes(bhagyank);

  if (isComp) {
    return {
      relation: 'Friend (मित्र)',
      scorePercentage: 92,
      analysisHindi: `मूलांक ${mulank} (${mProf.rulingPlanetHindi}) और भाग्यांक ${bhagyank} आपस में परम मित्र हैं। आपका अंतर्मन और आपका जीवन पथ एक ही दिशा में अग्रसर हैं, जिससे कार्य बिना किसी बड़े अंतर्द्वंद्व के सफल होते हैं।`,
      synergyAdviceHindi: 'अपने लकी रंगों और लकी दिशाओं का उपयोग कर बड़े प्रोजेक्ट्स शुरू करें।'
    };
  } else if (isEnem) {
    return {
      relation: 'Enemy (शत्रु)',
      scorePercentage: 45,
      analysisHindi: `मूलांक ${mulank} और भाग्यांक ${bhagyank} परस्पर विरोधी ऊर्जा रखते हैं। आपका मन कुछ और चाहेगा परंतु जीवन के हालात आपको दूसरी दिशा में ले जा सकते हैं। इस आंतरिक द्वंद्व को साधना ही आपकी सबसे बड़ी सिद्धि है।`,
      synergyAdviceHindi: 'धैर्य रखें, मध्यस्थ मित्र अंकों (Neutral/Friendly Numbers) का प्रयोग कर निर्णयों में संतुलन लाएं।'
    };
  } else {
    return {
      relation: 'Neutral (सम)',
      scorePercentage: 74,
      analysisHindi: `मूलांक ${mulank} और भाग्यांक ${bhagyank} के बीच सम (Neutral) संबंध है। आपके प्रयासों के अनुरूप आपको यथोचित फल प्राप्त होंगे।`,
      synergyAdviceHindi: 'अनुशासित दिनचर्या और योजनाबद्ध प्रयासों से आप उच्चतम सफलता पा सकते हैं।'
    };
  }
}

export function calculatePersonalTimeCycles(dobString: string): PersonalTimeCycles {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const parts = dobString.split('-');
  let bDay = 1;
  let bMonth = 1;
  if (parts.length === 3) {
    bDay = parseInt(parts[2], 10) || 1;
    bMonth = parseInt(parts[1], 10) || 1;
  }

  const personalYear = reduceToSingleDigit(`${bDay}${bMonth}${currentYear}`);
  const personalMonth = reduceToSingleDigit(personalYear + currentMonth);
  const personalDay = reduceToSingleDigit(personalMonth + currentDay);

  const yearThemes: Record<number, string> = {
    1: 'वर्ष 1 (नई शुरुआत): नए उपक्रम, स्वावलंबन और दूरगामी फैसलों का शुभ वर्ष।',
    2: 'वर्ष 2 (शांति व सहयोग): साझेदारी, धैर्य, संबंध सुधार व कलात्मक विस्तार।',
    3: 'वर्ष 3 (प्रसार व ज्ञान): रचनात्मकता, सामाजिक दायरा, शिक्षा व आनंद का वर्ष।',
    4: 'वर्ष 4 (ठोस नींव व श्रम): अनुशासन, कठिन परिश्रम, वित्तीय व संपत्ति प्रबंधन।',
    5: 'वर्ष 5 (परिवर्तन व रोमांच): यात्रा, नए अवसर, स्वतंत्रता व व्यापारिक विस्तार।',
    6: 'वर्ष 6 (परिवार व प्रेम): पारिवारिक सुख, विवाह, गृह निर्माण व उत्तरदायित्व।',
    7: 'वर्ष 7 (आत्म-मंथन व शोध): अध्यात्म, शोध, बौद्धिक एकाग्रता व मानसिक शांति।',
    8: 'वर्ष 8 (उपलब्धि व अधिकार): व्यावसायिक शिखर, आर्थिक उन्नति, शक्ति व मान-सम्मान।',
    9: 'वर्ष 9 (पूर्णता व परोपकार): पुराने कार्यों का समापन, क्षमा, दान व अगले चक्र की तैयारी।'
  };

  const monthThemes: Record<number, string> = {
    1: 'नई पहल व स्वतंत्र निर्णय का माह।',
    2: 'धैर्य व आपसी सहयोग से कार्य साधने का माह।',
    3: 'सामाजिक संपर्क व रचनात्मक अभिव्यक्ति का माह।',
    4: 'कड़ी मेहनत व नियमों के पालन का माह।',
    5: 'रोचक यात्राओं व नए संपर्कों का माह।',
    6: 'पारिवारिक सौहार्द व सुख-सुविधाओं का माह।',
    7: 'आंतरिक चिंतन व अध्ययन का माह।',
    8: 'वित्तीय लाभ व बड़े निर्णयों का माह।',
    9: 'अपूर्ण कार्यों को पूर्ण कर नया रास्ता बनाने का माह।'
  };

  const dayThemes: Record<number, string> = {
    1: 'नेतृत्व लें, किसी नए कार्य का शुभारंभ करें।',
    2: 'शांति रखें, दूसरों की सुनें और सहयोग करें।',
    3: 'सृजनात्मक चर्चाओं व बैठकों के लिए उत्तम।',
    4: 'रूटीन कार्य पूरे करें, अनुशासन बनाए रखें।',
    5: 'संचार, मार्केटिंग व त्वरित गति से काम करें।',
    6: 'परिवार, मित्रों व सौंदर्यपरक कार्यों को समय दें।',
    7: 'शोध, एकाग्रता व गहन अध्ययन के लिए श्रेष्ठ।',
    8: 'वित्तीय सौदे व महत्वपूर्ण व्यावसायिक फैसले लें।',
    9: 'परोपकार करें, पुराने विवादों को सुलझाएं।'
  };

  return {
    personalYear,
    personalYearTheme: yearThemes[personalYear] || yearThemes[1],
    personalMonth,
    personalMonthTheme: monthThemes[personalMonth] || monthThemes[1],
    personalDay,
    personalDayTheme: dayThemes[personalDay] || dayThemes[1]
  };
}

export function calculateLuckyCompass(mulank: number, bhagyank: number): LuckyCompass {
  const mProf = NUMEROLOGY_PROFILES[mulank] || NUMEROLOGY_PROFILES[1];
  const bProf = NUMEROLOGY_PROFILES[bhagyank] || NUMEROLOGY_PROFILES[1];

  const luckyNums = Array.from(new Set([mulank, bhagyank, ...mProf.luckyDates.map((d) => reduceToSingleDigit(d))]));
  const friendly = Array.from(new Set([...mProf.compatibleNumbers, ...bProf.compatibleNumbers]));
  const enemy = Array.from(new Set([...mProf.enemyNumbers, ...bProf.enemyNumbers]));
  const neutral = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !friendly.includes(n) && !enemy.includes(n) && n !== mulank && n !== bhagyank);

  const colors = Array.from(new Set([...mProf.luckyColors, ...bProf.luckyColors]));
  const days = Array.from(new Set([...mProf.luckyDays, ...bProf.luckyDays]));
  const gems = Array.from(new Set([...mProf.luckyGems, ...bProf.luckyGems]));

  const directionsMap: Record<number, string> = {
    1: 'North / East (उत्तर / पूर्व दिशा)',
    2: 'Northwest / North (वायव्य / उत्तर)',
    3: 'Northeast / East (ईशान / पूर्व)',
    4: 'Southwest / South (नैऋत्य / दक्षिण)',
    5: 'North / Center (उत्तर / ब्रह्मस्थान)',
    6: 'Southeast / Northwest (आग्नेय / वायव्य)',
    7: 'Northeast / West (ईशान / पश्चिम)',
    8: 'West / South (पश्चिम / दक्षिण)',
    9: 'South / East (दक्षिण / पूर्व)'
  };

  const directions = Array.from(new Set([directionsMap[mulank], directionsMap[bhagyank]]));
  const professions = Array.from(new Set([...mProf.careerRecommendationsHindi, ...bProf.careerRecommendationsHindi]));

  return {
    luckyNumbers: luckyNums,
    friendlyNumbers: friendly,
    neutralNumbers: neutral,
    enemyNumbers: enemy,
    luckyColors: colors,
    luckyDays: days,
    luckyGemstones: gems,
    luckyDirections: directions,
    bestProfessionsHindi: professions
  };
}

export function analyzeVibrationNumber(inputStr: string, mulank: number, bhagyank: number): VibrationAnalysisResult {
  if (!inputStr || inputStr.trim().length === 0) {
    inputStr = '1';
  }

  const clean = inputStr.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let compoundSum = 0;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (/[0-9]/.test(ch)) {
      compoundSum += parseInt(ch, 10);
    } else if (/[A-Z]/.test(ch)) {
      compoundSum += CHALDEAN_NUMEROLOGY_MAP[ch] || 0;
    }
  }

  const root = reduceToSingleDigit(compoundSum || 1);
  const rootProfile = NUMEROLOGY_PROFILES[root] || NUMEROLOGY_PROFILES[1];
  const mProf = NUMEROLOGY_PROFILES[mulank] || NUMEROLOGY_PROFILES[1];
  const bProf = NUMEROLOGY_PROFILES[bhagyank] || NUMEROLOGY_PROFILES[1];

  const isMulankFriend = mProf.compatibleNumbers.includes(root) || root === mulank;
  const isMulankEnemy = mProf.enemyNumbers.includes(root);
  const isBhagyankFriend = bProf.compatibleNumbers.includes(root) || root === bhagyank;
  const isBhagyankEnemy = bProf.enemyNumbers.includes(root);

  let compMulank: VibrationAnalysisResult['compatibilityWithMulank'] = 'Neutral (सामान्य)';
  if (isMulankFriend) compMulank = 'Highly Auspicious (अत्यंत शुभ)';
  else if (isMulankEnemy) compMulank = 'Incompatible (अशुभ)';
  else compMulank = 'Auspicious (शुभ)';

  let compBhagyank: VibrationAnalysisResult['compatibilityWithBhagyank'] = 'Neutral (सामान्य)';
  if (isBhagyankFriend) compBhagyank = 'Highly Auspicious (अत्यंत शुभ)';
  else if (isBhagyankEnemy) compBhagyank = 'Incompatible (अशुभ)';
  else compBhagyank = 'Auspicious (शुभ)';

  let score = 70;
  if (isMulankFriend && isBhagyankFriend) score = 96;
  else if (isMulankFriend || isBhagyankFriend) score = 82;
  else if (isMulankEnemy && isBhagyankEnemy) score = 38;
  else if (isMulankEnemy || isBhagyankEnemy) score = 55;

  let verdictHindi = '';
  let recommendation = '';

  if (score >= 85) {
    verdictHindi = `यह संख्या (${clean} ➔ योग ${compoundSum} ➔ एकल अंक ${root} - ${rootProfile.rulingPlanetHindi}) आपके लिए अत्यंत भाग्यशाली और सर्वतोमुखी उन्नतिदायक है!`;
    recommendation = `यह संख्या मोबाइल नंबर, गाड़ी नंबर, फ्लैट नंबर या बैंक अकाउंट के लिए बिल्कुल आदर्श है। यह आपके कार्यों में सकारात्मक ऊर्जा और सफलता को आकर्षित करेगी।`;
  } else if (score >= 65) {
    verdictHindi = `यह संख्या (${clean} ➔ योग ${compoundSum} ➔ एकल अंक ${root} - ${rootProfile.rulingPlanetHindi}) आपके लिए अनुकूल व सम फलदायी है।`;
    recommendation = `इस संख्या का उपयोग सामान्य व दैनिक कार्यों में सुरक्षित रूप से किया जा सकता है।`;
  } else {
    verdictHindi = `यह संख्या (${clean} ➔ योग ${compoundSum} ➔ एकल अंक ${root} - ${rootProfile.rulingPlanetHindi}) आपके मूलांक/भाग्यांक के साथ ऊर्जा असंतुलन बना रही है।`;
    recommendation = `यदि संभव हो तो इस संख्या को अपने लकी अंक (${mProf.compatibleNumbers.join(', ')} अथवा ${mulank}) पर समाप्त होने वाली संख्या से बदलें।`;
  }

  return {
    input: inputStr,
    compoundSum,
    rootNumber: root,
    rulingPlanet: rootProfile.rulingPlanet,
    rulingPlanetHindi: rootProfile.rulingPlanetHindi,
    planetSymbol: rootProfile.planetSymbol,
    compatibilityWithMulank: compMulank,
    compatibilityWithBhagyank: compBhagyank,
    overallScore: score,
    verdictHindi,
    recommendation
  };
}

/**
 * Computes complete Advanced Numerology Report (Mulank, Bhagyank, Namank, Lo Shu Grid, 8 Planes, Remedies, Time Cycles, Compass)
 */
export function calculateNumerologyDetails(dobString: string, name?: string): NumerologyResult {
  const mulankNum = calculateMulank(dobString);
  const bhagyankNum = calculateBhagyank(dobString);
  const mulankProfile = NUMEROLOGY_PROFILES[mulankNum] || NUMEROLOGY_PROFILES[1];
  const bhagyankProfile = NUMEROLOGY_PROFILES[bhagyankNum] || NUMEROLOGY_PROFILES[1];

  let namankProfile: NumerologyNumberProfile | undefined = undefined;
  let pythagoreanNum: number | undefined = undefined;
  let soulUrgeNum: number | undefined = undefined;
  let personalityNum: number | undefined = undefined;

  if (name && name.trim().length > 0) {
    const namankNum = calculateNamank(name);
    namankProfile = NUMEROLOGY_PROFILES[namankNum];
    pythagoreanNum = calculatePythagoreanNamank(name);
    soulUrgeNum = calculateSoulUrgeNumber(name);
    personalityNum = calculatePersonalityNumber(name);
  }

  // 1. Lo Shu Grid & Planes
  const loShu = calculateLoShuGrid(dobString, mulankNum, bhagyankNum);
  const planes = calculateLoShuPlanes(loShu.counts);
  const goldenRajYog = planes.find((p) => p.name === 'Golden Raj Yog Plane')?.isComplete || false;
  const silverProperty = planes.find((p) => p.name === 'Silver Property / Earth Plane')?.isComplete || false;

  // 2. Missing & Repeated Numbers
  const missing = getMissingNumbersRemedies(loShu.counts);
  const repeated = getRepeatedNumbersImpacts(loShu.counts);

  // 3. Harmony, Time Cycles & Lucky Compass
  const harmony = calculateDriverConductorHarmony(mulankNum, bhagyankNum);
  const timeCycles = calculatePersonalTimeCycles(dobString);
  const luckyCompass = calculateLuckyCompass(mulankNum, bhagyankNum);

  return {
    mulank: mulankProfile,
    bhagyank: bhagyankProfile,
    namank: namankProfile,
    dob: dobString,
    name,
    compatibilitySummary: harmony.analysisHindi,
    personalYearNumber: timeCycles.personalYear,
    personalYearForecast: timeCycles.personalYearTheme,
    loShuGrid: {
      matrix: loShu.matrix,
      counts: loShu.counts
    },
    loShuPlanes: planes,
    goldenRajYogPresent: goldenRajYog,
    silverPropertyPlanePresent: silverProperty,
    missingNumbers: missing,
    repeatedNumbers: repeated,
    pythagoreanNamank: pythagoreanNum,
    soulUrgeNumber: soulUrgeNum,
    personalityNumber: personalityNum,
    harmony,
    timeCycles,
    luckyCompass
  };
}

export const calculateAdvancedNumerology = calculateNumerologyDetails;

