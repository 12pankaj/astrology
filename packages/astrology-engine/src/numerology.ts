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

export interface NumerologyResult {
  mulank: NumerologyNumberProfile;
  bhagyank: NumerologyNumberProfile;
  namank?: NumerologyNumberProfile;
  dob: string;
  name?: string;
  compatibilitySummary: string;
  personalYearNumber: number;
  personalYearForecast: string;
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
    symbol: '🌙',
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

/**
 * Computes complete Numerology Report (Mulank, Bhagyank, Namank, Compatibility, Personal Year)
 */
export function calculateNumerologyDetails(dobString: string, name?: string): NumerologyResult {
  const mulankNum = calculateMulank(dobString);
  const bhagyankNum = calculateBhagyank(dobString);
  const mulankProfile = NUMEROLOGY_PROFILES[mulankNum] || NUMEROLOGY_PROFILES[1];
  const bhagyankProfile = NUMEROLOGY_PROFILES[bhagyankNum] || NUMEROLOGY_PROFILES[1];

  let namankProfile: NumerologyNumberProfile | undefined = undefined;
  if (name && name.trim().length > 0) {
    const namankNum = calculateNamank(name);
    namankProfile = NUMEROLOGY_PROFILES[namankNum];
  }

  // Personal Year Calculation (Day + Month + Current Year)
  const now = new Date();
  const currentYear = now.getFullYear();
  const dobParts = dobString.split('-');
  let personalYearNum = 1;
  if (dobParts.length === 3) {
    const day = dobParts[2];
    const month = dobParts[1];
    personalYearNum = reduceToSingleDigit(`${day}${month}${currentYear}`);
  }

  // Compatibility Summary
  const isCompatible = mulankProfile.compatibleNumbers.includes(bhagyankNum);
  const isEnemy = mulankProfile.enemyNumbers.includes(bhagyankNum);

  let compatibilitySummary = '';
  if (isCompatible) {
    compatibilitySummary = `आपका मूलांक (${mulankNum}) और भाग्यांक (${bhagyankNum}) आपस में मित्र हैं। यह जीवन में तीव्र प्रगति, सफलता और संतुलित निर्णयों का शुभ योग बनाता है।`;
  } else if (isEnemy) {
    compatibilitySummary = `आपका मूलांक (${mulankNum}) और भाग्यांक (${bhagyankNum}) भिन्न ऊर्जा रखते हैं। सफलता प्राप्त करने के लिए नियमित धैर्य, कड़ी मेहनत और अपने लकी रंगों का प्रयोग फलदायी रहेगा।`;
  } else {
    compatibilitySummary = `आपका मूलांक (${mulankNum}) और भाग्यांक (${bhagyankNum}) तटस्थ (Neutral) संबंध रखते हैं। संतुलित प्रयासों से आप सभी क्षेत्रों में उत्तम परिणाम प्राप्त करेंगे।`;
  }

  const yearForecasts: Record<number, string> = {
    1: 'यह वर्ष नई शुरुआत, नए प्रोजेक्ट्स और व्यक्तिगत प्रगति का है। नए विचारों पर कार्य शुरू करें।',
    2: 'यह वर्ष साझेदारी, शांति, कलात्मक विकास और धैर्यपूर्वक संबंध बनाने का है।',
    3: 'यह वर्ष ज्ञान वृद्धि, उच्च शिक्षा, नेटवर्किंग, विवाह व करियर में विस्तार का है।',
    4: 'यह वर्ष अनुशासन, कड़ी मेहनत, तकनीकी कौशल और भविष्य की ठोस नींव रखने का है।',
    5: 'यह वर्ष बदलाव, यात्रा, व्यापार विस्तार, संचार और नए अवसरों का है।',
    6: 'यह वर्ष परिवार, गृह सुख, फैशन, कला, सौंदर्य और व्यक्तिगत संबंधों में मजबूती का है।',
    7: 'यह वर्ष आत्म-निरीक्षण, शोध, अध्ययन, अध्यात्म और मानसिक शांति का है।',
    8: 'यह वर्ष करियर में बड़ी उपलब्धियां, पदोन्नति, वित्तीय लाभ और अथक प्रयास का है।',
    9: 'यह वर्ष पुराने कार्यों के पूरा होने, आध्यात्मिक परिपक्वता और परोपकार का है।'
  };

  return {
    mulank: mulankProfile,
    bhagyank: bhagyankProfile,
    namank: namankProfile,
    dob: dobString,
    name,
    compatibilitySummary,
    personalYearNumber: personalYearNum,
    personalYearForecast: yearForecasts[personalYearNum] || yearForecasts[1]
  };
}
