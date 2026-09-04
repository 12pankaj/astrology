import { KundliData, PlanetPosition } from '@vedic-astro/types';

export interface PlanetCareerMapping {
  planet: string;
  planetHindi: string;
  symbol: string;
  domains: string[];
  domainsHindi: string[];
  description: string;
}

export interface ZodiacCareerMapping {
  rashi: string;
  rashiHindi: string;
  symbol: string;
  element: string;
  domains: string[];
  domainsHindi: string[];
}

export const PLANET_CAREER_MAPPINGS: Record<string, PlanetCareerMapping> = {
  Sun: {
    planet: 'Sun',
    planetHindi: 'सूर्य',
    symbol: '☀️',
    domains: [
      'Government and administration',
      'Politics and leadership roles',
      'Defense (Army, Navy, Air Force)',
      'Goldsmiths and jewellery design',
      'Power generation (solar energy, electricity)'
    ],
    domainsHindi: [
      'सरकारी व प्रशासनिक सेवा (Government & Administration)',
      'राजनीति व नेतृत्व पद (Politics & Leadership)',
      'रक्षा बल (सेना, नौसेना, वायुसेना)',
      'स्वर्णकार व आभूषण डिजाइनिंग',
      'ऊर्जा उत्पादन (सौर ऊर्जा, बिजली)'
    ],
    description: 'Sun represents authority, public administration, government status, solar power, and executive leadership.'
  },
  Moon: {
    planet: 'Moon',
    planetHindi: 'चन्द्र',
    symbol: '🌙',
    domains: [
      'Dairy, milk, and food products',
      'Water-related industries (fisheries, beverages, shipping)',
      'Hospitality (hotels, catering, spas)',
      'Art and crafts, including textiles and interior design',
      'Pet related work'
    ],
    domainsHindi: [
      'डेयरी, दुग्ध व खाद्य पदार्थ उद्योग',
      'जल सम्बंधी उद्योग (मत्स्य, पेय पदार्थ, शिपिंग, सिंचाई)',
      'आतिथ्य (होटल, कैटरिंग, स्पा)',
      'कला व क्राफ्ट (टेक्सटाइल, इंटीरियर डिजाइन)',
      'पेट केयर व पशु संबंधित कार्य'
    ],
    description: 'Moon represents public dealing, liquids, hospitality, creative arts, nursing, and emotional connection.'
  },
  Mars: {
    planet: 'Mars',
    planetHindi: 'मंगल',
    symbol: '🔥',
    domains: [
      'Engineering (civil, mechanical, aerospace)',
      'Military and police forces',
      'Real estate and construction',
      'Sports and athletics-related industries',
      'Weapons and defense equipment manufacturing'
    ],
    domainsHindi: [
      'इंजीनियरिंग (सिविल, मैकेनिकल, एयरोस्पेस)',
      'सैन्य व पुलिस बल (Military & Police)',
      'रियल एस्टेट व निर्माण कार्य (Real Estate & Construction)',
      'खेलकूद व एथलेटिक्स उद्योग',
      'हथियार व रक्षा उपकरण निर्माण'
    ],
    description: 'Mars represents physical energy, engineering, defense, land/property, and courage.'
  },
  Mercury: {
    planet: 'Mercury',
    planetHindi: 'बुध',
    symbol: '🟢',
    domains: [
      'Commerce, trade, and business',
      'Information technology, software development',
      'Banking, accounting, and finance',
      'Education and teaching',
      'Marketing, advertising, and sales',
      'Travel and tourism'
    ],
    domainsHindi: [
      'वाणिज्य, व्यापार व बिज़नेस (Commerce & Trade)',
      'सूचना प्रौद्योगिकी व सॉफ्टवेयर डेवलपमेंट (IT & Software)',
      'बैंकिंग, एकाउंटिंग व फाइनेंस',
      'शिक्षा व शिक्षण (Education & Teaching)',
      'मार्केटिंग, विज्ञापन व सेल्स',
      'यात्रा व पर्यटन (Travel & Tourism)'
    ],
    description: 'Mercury represents communication, analytics, coding, commerce, trading, and intellectual acumen.'
  },
  Jupiter: {
    planet: 'Jupiter',
    planetHindi: 'गुरु (बृहस्पति)',
    symbol: '👑',
    domains: [
      'Education and teaching institutions',
      'Religious and spiritual organizations',
      'Legal professions and judiciary',
      'Financial services, Advisory roles',
      'Gold and wealth-related industries'
    ],
    domainsHindi: [
      'शिक्षण संस्थान व उच्च शिक्षा (Universities & Colleges)',
      'धार्मिक व आध्यात्मिक संस्थाएं',
      'कानून व न्यायपालिका (Legal & Judiciary)',
      'वित्तीय सेवाएं व परामर्श (Financial Advisory)',
      'स्वर्ण व धन प्रबंधन उद्योग (Gold & Wealth Management)'
    ],
    description: 'Jupiter represents higher knowledge, law, advisory, banking, spirituality, and ethical guidance.'
  },
  Venus: {
    planet: 'Venus',
    planetHindi: 'शुक्र',
    symbol: '✨',
    domains: [
      'Fashion and beauty',
      'Entertainment',
      'Luxurious Hospitality',
      'Jewellery and precious stones trade',
      'Perfumes and fragrances',
      'Art and design (architecture, interior design)'
    ],
    domainsHindi: [
      'फैशन व सौंदर्य उद्योग (Fashion & Beauty)',
      'मनोरंजन व मीडिया (Entertainment & Cinema)',
      'लक्जरी आतिथ्य (Resorts & Fine Dining)',
      'रत्न व आभूषण व्यापार (Jewellery & Gemstones)',
      'इत्र व सुगंधि (Perfumes & Fragrances)',
      'कला, डिजाइन व आर्किटेक्चर'
    ],
    description: 'Venus represents aesthetics, luxury, entertainment, media, design, and creative elegance.'
  },
  Saturn: {
    planet: 'Saturn',
    planetHindi: 'शनि',
    symbol: '🪐',
    domains: [
      'Labor-intensive Industries',
      'Mining, oil, coal, and natural resources',
      'Iron and steel industries',
      'Manufacturing and production industries',
      'Social work and NGOs',
      'Law enforcement and judiciary'
    ],
    domainsHindi: [
      'श्रम-प्रधान उद्योग (Labor-intensive Industries)',
      'खनन, तेल, कोयला व प्राकृतिक संसाधन (Mining & Oil)',
      'लोहा व इस्पात उद्योग (Iron & Steel)',
      'मैन्युफैक्चरिंग व उत्पादन उद्योग',
      'समाज सेवा व गैर-सरकारी संगठन (NGOs)',
      'कानून प्रवर्तन व न्याय व्यवस्था'
    ],
    description: 'Saturn represents hard labor, heavy machinery, mining, oil/gas, iron/steel, law, and long-term perseverance.'
  },
  Rahu: {
    planet: 'Rahu',
    planetHindi: 'राहु',
    symbol: '⚡',
    domains: [
      'Technology (computers, AI, electronics, aviation)',
      'Pharmaceuticals and biotechnology',
      'Research and innovation',
      'Import-export businesses',
      'Politics (non-conventional or shadow aspects)'
    ],
    domainsHindi: [
      'अत्याधुनिक टेक्नोलॉजी (AI, डेटा साइंस, इलेक्ट्रॉनिक्स, एविएशन)',
      'फार्मास्युटिकल्स व बायोटेक्नोलॉजी',
      'रिसर्च व अन्वेषण (Research & Innovation)',
      'आयात-निर्यात व्यापार (Import-Export)',
      'रणनीतिक व कूटनीतिक राजनीति (Shadow Politics & Diplomacy)'
    ],
    description: 'Rahu represents high-tech innovation, artificial intelligence, biotech, global trade, and disruptive fields.'
  },
  Ketu: {
    planet: 'Ketu',
    planetHindi: 'केतु',
    symbol: '🚩',
    domains: [
      'Spiritual and occult fields (astrology, mysticism)',
      'NGOs and charitable organizations',
      'Healing professions (alternative medicine, yoga)',
      'Archaeology and ancient studies',
      'Work related to Toys'
    ],
    domainsHindi: [
      'आध्यात्म व गूढ़ विद्याएं (ज्योतिष, तंत्र-मंत्र, Mysticism)',
      'दान-पुण्य व चैरिटेबल संस्थाएं (NGOs & Charity)',
      'हीलिंग व वैकल्पिक चिकित्सा (योग, आयुर्वेद, प्राकृतिक चिकित्सा)',
      'पुरातत्व व प्राचीन इतिहास अध्ययन (Archaeology)',
      'खिलौना उद्योग व बाल-कल्याण (Work related to Toys)'
    ],
    description: 'Ketu represents spiritual liberation, occult sciences, holistic healing, ancient history, and research depth.'
  }
};

export const ZODIAC_CAREER_MAPPINGS: Record<string, ZodiacCareerMapping> = {
  Aries: {
    rashi: 'Aries',
    rashiHindi: 'मेष',
    symbol: '♈',
    element: 'Fire (अग्नि)',
    domains: [
      'Military, police, and defense forces',
      'Sports and athletics',
      'Engineering',
      'Firefighters',
      'Entrepreneurs and leaders',
      'Surgeons and doctors',
      'Adventurous professions like pilots, explorers, or mountaineers'
    ],
    domainsHindi: [
      'सैन्य, पुलिस व रक्षा बल (Military & Defense)',
      'खेलकूद व एथलेटिक्स (Sports & Athletics)',
      'इंजीनियरिंग व तकनीकी कार्य',
      'अग्निशमन दल (Firefighters)',
      'उद्यमी व नेतृत्वकर्ता (Entrepreneurs & Leaders)',
      'शल्य चिकित्सक व डॉक्टर (Surgeons & Doctors)',
      'साहसिक पेशे (पायलट, एक्सप्लोरर, पर्वतारोही)'
    ]
  },
  Taurus: {
    rashi: 'Taurus',
    rashiHindi: 'वृषभ',
    symbol: '♉',
    element: 'Earth (पृथ्वी)',
    domains: [
      'Banking, finance, and wealth management',
      'Agriculture, dairy, and farming',
      'Real estate and property development',
      'Fashion and beauty industry',
      'Arts and crafts, including jewelry and pottery'
    ],
    domainsHindi: [
      'बैंकिंग, फाइनेंस व धन प्रबंधन',
      'कृषि, डेयरी व फार्मिंग',
      'रियल एस्टेट व प्रॉपर्टी डेवलपमेंट',
      'फैशन व ब्यूटी इंडस्ट्री',
      'कला व क्राफ्ट (आभूषण व मिट्टी कला)'
    ]
  },
  Gemini: {
    rashi: 'Gemini',
    rashiHindi: 'मिथुन',
    symbol: '♊',
    element: 'Air (वायु)',
    domains: [
      'Writing, journalism, and media',
      'Marketing, advertising, and sales',
      'Teaching and communication-related professions',
      'IT and technology',
      'Translators and linguists',
      'Travel and tourism industries'
    ],
    domainsHindi: [
      'लेखन, पत्रकारिता व मीडिया',
      'मार्केटिंग, विज्ञापन व सेल्स',
      'शिक्षण व संचार संबंधी पेशे',
      'IT व सूचना प्रौद्योगिकी',
      'अनुवादक व भाषाविद (Translators & Linguists)',
      'यात्रा व पर्यटन (Travel & Tourism)'
    ]
  },
  Cancer: {
    rashi: 'Cancer',
    rashiHindi: 'कर्क',
    symbol: '♋',
    element: 'Water (जल)',
    domains: [
      'Hospitality and hotel management',
      'Nursing and caregiving professions',
      'Real estate and property management',
      'Water-related industries',
      'Psychologists and counselors',
      'Home-based businesses'
    ],
    domainsHindi: [
      'आतिथ्य व होटल प्रबंधन (Hospitality & Hotel Management)',
      'नर्सिंग व देखभाल संबंधी पेशे (Nursing & Caregiving)',
      'रियल एस्टेट व संपत्ति प्रबंधन',
      'जल संबंधी उद्योग (Water Industries)',
      'मनोवैज्ञानिक व काउंसलर (Psychologists & Counselors)',
      'गृह आधारित व्यवसाय (Home-based Business)'
    ]
  },
  Leo: {
    rashi: 'Leo',
    rashiHindi: 'सिंह',
    symbol: '♌',
    element: 'Fire (अग्नि)',
    domains: [
      'Government and administrative roles',
      'Acting, theatre, and entertainment',
      'Leadership positions in any industry',
      'Politics and public service',
      'Jewellery and gold-related businesses',
      'Management and executive roles'
    ],
    domainsHindi: [
      'सरकारी व प्रशासनिक भूमिकाएं (Govt & Admin)',
      'अभिनय, थिएटर व मनोरंजन (Acting & Theatre)',
      'उच्च नेतृत्व पद (Leadership Roles)',
      'राजनीति व जनसेवा (Politics & Public Service)',
      'आभूषण व स्वर्ण व्यापार (Jewellery & Gold)',
      'प्रबंधन व कार्यकारी भूमिकाएं (Executive & Management)'
    ]
  },
  Virgo: {
    rashi: 'Virgo',
    rashiHindi: 'कन्या',
    symbol: '♍',
    element: 'Earth (पृथ्वी)',
    domains: [
      'Accountancy, auditing, and bookkeeping',
      'Research and analysis',
      'Teaching and academia',
      'Editing, proofreading, & content creation',
      'Environmental and agricultural science',
      'Secretarial and administrative roles'
    ],
    domainsHindi: [
      'एकाउंटेंसी, ऑडिटिंग व बहीखाता',
      'अनुसंधान व विश्लेषण (Research & Analysis)',
      'शिक्षण व अकादमिक क्षेत्र (Teaching)',
      'संपादन, प्रूफरीडिंग व कंटेंट क्रिएशन',
      'पर्यावरण व कृषि विज्ञान',
      'सचिवालय व प्रशासनिक कार्य'
    ]
  },
  Libra: {
    rashi: 'Libra',
    rashiHindi: 'तुला',
    symbol: '♎',
    element: 'Air (वायु)',
    domains: [
      'Law and judiciary professions',
      'Fashion and design',
      'Art and creative fields',
      'Trade and commerce',
      'Diplomacy and international relations',
      'Beauty and cosmetics industries',
      'Event planning and public relations'
    ],
    domainsHindi: [
      'कानून व न्यायपालिका (Law & Judiciary)',
      'फैशन व डिजाइनिंग',
      'कला व रचनात्मक क्षेत्र (Art & Creative)',
      'व्यापार व वाणिज्य (Trade & Commerce)',
      'कूटनीति व अंतरराष्ट्रीय संबंध (Diplomacy & IR)',
      'सौंदर्य व प्रसाधन उद्योग (Beauty & Cosmetics)',
      'इवेंट प्लानिंग व जनसंपर्क (PR)'
    ]
  },
  Scorpio: {
    rashi: 'Scorpio',
    rashiHindi: 'वृश्चिक',
    symbol: '♏',
    element: 'Water (जल)',
    domains: [
      'Research and investigation',
      'Surgeons and medical professionals',
      'Psychology and psychiatry',
      'Military, espionage, and intelligence agencies',
      'Mining and oil industries',
      'Occult sciences, astrology, and mysticism'
    ],
    domainsHindi: [
      'अनुसंधान व जांच (Research & Investigation)',
      'शल्य चिकित्सक व चिकित्सा पेशेवर (Surgeons)',
      'मनोविज्ञान व मनोरोग विज्ञान (Psychology & Psychiatry)',
      'सैन्य, जासूसी व खुफिया एजेंसियां (Intelligence & Defense)',
      'खनन व तेल उद्योग (Mining & Oil)',
      'गूढ़ विज्ञान, ज्योतिष व रहस्यवाद (Occult & Astrology)'
    ]
  },
  Sagittarius: {
    rashi: 'Sagittarius',
    rashiHindi: 'धनु',
    symbol: '♐',
    element: 'Fire (अग्नि)',
    domains: [
      'Academics, professors, and scholars',
      'Spiritual and religious leaders',
      'Law and judiciary professions',
      'Publishing and writing',
      'Travel and tourism industries',
      'Diplomacy and global relations'
    ],
    domainsHindi: [
      'अकादमिक, प्राध्यापक व विद्वान (Professors & Scholars)',
      'आध्यात्मिक व धार्मिक गुरु',
      'कानून व न्यायिक पेशे (Law & Judiciary)',
      'प्रकाशन व लेखन (Publishing & Writing)',
      'यात्रा व पर्यटन (Travel & Tourism)',
      'कूटनीति व वैश्विक संबंध (Global Relations)'
    ]
  },
  Capricorn: {
    rashi: 'Capricorn',
    rashiHindi: 'मकर',
    symbol: '♑',
    element: 'Earth (पृथ्वी)',
    domains: [
      'Government jobs and administrative roles',
      'Engineering and technical fields',
      'Real estate and construction',
      'Farming and agricultural industries',
      'Accountancy and financial management',
      'Mining and industrial work'
    ],
    domainsHindi: [
      'सरकारी नौकरी व प्रशासनिक पद',
      'इंजीनियरिंग व तकनीकी क्षेत्र',
      'रियल एस्टेट व निर्माण (Construction)',
      'खेती व कृषि उद्योग (Farming & Agriculture)',
      'एकाउंटेंसी व वित्तीय प्रबंधन',
      'खनन व औद्योगिक कार्य (Mining & Industrial)'
    ]
  },
  Aquarius: {
    rashi: 'Aquarius',
    rashiHindi: 'कुंभ',
    symbol: '♒',
    element: 'Air (वायु)',
    domains: [
      'Science and research',
      'Social work and NGOs',
      'Technology and IT',
      'Astronomy and space exploration',
      'Environmental activism and sustainability-related industries',
      'Inventors and innovators'
    ],
    domainsHindi: [
      'विज्ञान व शोध (Science & Research)',
      'समाज सेवा व गैर-सरकारी संगठन (NGOs)',
      'टेक्नोलॉजी व IT',
      'खगोल विज्ञान व अंतरिक्ष खोज (Astronomy & Space)',
      'पर्यावरण व सतत विकास उद्योग (Sustainability)',
      'आविष्कारक व नवाचारकर्ता (Inventors & Innovators)'
    ]
  },
  Pisces: {
    rashi: 'Pisces',
    rashiHindi: 'मीन',
    symbol: '♓',
    element: 'Water (जल)',
    domains: [
      'Spiritual and religious roles',
      'Arts, poetry, and creative writing',
      'Psychology, counseling, and social work',
      'Film and entertainment',
      'Healing professions',
      'Marine industries',
      'Research and Philosophy'
    ],
    domainsHindi: [
      'आध्यात्मिक व धार्मिक भूमिकाएं',
      'कला, कविता व रचनात्मक लेखन',
      'मनोविज्ञान, परामर्श व समाज सेवा',
      'फिल्म व मनोरंजन (Film & Entertainment)',
      'हीलिंग व चिकित्सा पेशे (Healing Professions)',
      'समुद्री उद्योग (Marine Industries)',
      'शोध व दर्शन (Research & Philosophy)'
    ]
  }
};

export function getPlanetCareerDomains(planetName: string): string[] {
  const mapping = PLANET_CAREER_MAPPINGS[planetName];
  return mapping ? mapping.domainsHindi : [];
}

export function getZodiacCareerDomains(rashiName: string): string[] {
  const key = Object.keys(ZODIAC_CAREER_MAPPINGS).find(
    (k) => rashiName.toLowerCase().includes(k.toLowerCase()) || ZODIAC_CAREER_MAPPINGS[k].rashiHindi.includes(rashiName)
  );
  return key ? ZODIAC_CAREER_MAPPINGS[key].domainsHindi : [];
}

export interface DetailedPlanetaryCareerAnalysis {
  tenthHouseLord: string;
  tenthHouseRashi: string;
  tenthHousePlanets: string[];
  primaryDominantPlanet: string;
  recommendedFields: Array<{
    planet: string;
    planetHindi: string;
    symbol: string;
    role: string;
    domains: string[];
  }>;
  zodiacSignFields: {
    rashi: string;
    rashiHindi: string;
    symbol: string;
    element: string;
    domains: string[];
  } | null;
  summary: string;
}

export function analyzeDetailedCareerByPlanets(kundli: KundliData): DetailedPlanetaryCareerAnalysis {
  // Find 10th house cusp & lord & rashi
  const house10 = kundli.houses.find((h) => h.houseNumber === 10);
  const tenthHouseLord = house10 ? house10.rashiLord : 'Mercury';
  const tenthHouseRashi = house10 ? house10.rashiName : kundli.lagnaRashi;

  // Planets residing in 10th house
  const tenthHousePlanets = kundli.planets.filter((p) => p.house === 10).map((p) => p.planet);

  // Planets residing in 1st house (Lagna)
  const lagnaPlanets = kundli.planets.filter((p) => p.house === 1).map((p) => p.planet);

  // Key career planets to evaluate
  const keyPlanetsSet = new Set<string>();
  keyPlanetsSet.add(tenthHouseLord);
  tenthHousePlanets.forEach((p) => keyPlanetsSet.add(p));
  lagnaPlanets.forEach((p) => keyPlanetsSet.add(p));

  // If set is small, add Sun and Saturn
  if (keyPlanetsSet.size < 3) {
    keyPlanetsSet.add('Sun');
    keyPlanetsSet.add('Saturn');
  }

  const recommendedFields: DetailedPlanetaryCareerAnalysis['recommendedFields'] = [];

  keyPlanetsSet.forEach((planetName) => {
    const mapping = PLANET_CAREER_MAPPINGS[planetName];
    if (mapping) {
      let role = 'Planetary Influence';
      if (planetName === tenthHouseLord) role = '10th House Lord (कर्मेश)';
      else if (tenthHousePlanets.includes(planetName as any)) role = '10th House Occupant (कर्म भाव में स्थित)';
      else if (lagnaPlanets.includes(planetName as any)) role = 'Lagna Occupant (प्रथम भाव में स्थित)';

      recommendedFields.push({
        planet: mapping.planet,
        planetHindi: mapping.planetHindi,
        symbol: mapping.symbol,
        role,
        domains: mapping.domainsHindi
      });
    }
  });

  // Find 10th house Zodiac sign mapping
  const zodiacKey = Object.keys(ZODIAC_CAREER_MAPPINGS).find(
    (k) => tenthHouseRashi.toLowerCase().includes(k.toLowerCase()) || ZODIAC_CAREER_MAPPINGS[k].rashiHindi.includes(tenthHouseRashi)
  );

  const zodiacMapping = zodiacKey ? ZODIAC_CAREER_MAPPINGS[zodiacKey] : null;
  const zodiacSignFields = zodiacMapping
    ? {
        rashi: zodiacMapping.rashi,
        rashiHindi: zodiacMapping.rashiHindi,
        symbol: zodiacMapping.symbol,
        element: zodiacMapping.element,
        domains: zodiacMapping.domainsHindi
      }
    : null;

  const primaryDominantPlanet = tenthHousePlanets.length > 0 ? tenthHousePlanets[0] : tenthHouseLord;
  const primaryMapping = PLANET_CAREER_MAPPINGS[primaryDominantPlanet] || PLANET_CAREER_MAPPINGS['Sun'];

  const summary = `आपकी कुंडली में दशम भाव की राशि ${tenthHouseRashi} एवं कर्मेश (${tenthHouseLord}) का प्रभाव दर्शाता है कि आपका मुख्य करियर ग्रह ${primaryMapping.planetHindi} (${primaryMapping.planet}) है। ${zodiacSignFields ? `दशम भाव की राशि (${zodiacSignFields.rashiHindi} - ${zodiacSignFields.symbol}) के प्रभाव से ${zodiacSignFields.domains.slice(0, 3).join(', ')} क्षेत्र अत्यंत अनुकूल हैं।` : ''}`;

  return {
    tenthHouseLord,
    tenthHouseRashi,
    tenthHousePlanets,
    primaryDominantPlanet,
    recommendedFields,
    zodiacSignFields,
    summary
  };
}

export interface PromotionAndIncrementPrediction {
  promotionWindow: string;
  promotionProbability: number;
  salaryIncrementWindow: string;
  expectedHikePercent: string;
  triggeringPlanets: Array<{
    planet: string;
    planetHindi: string;
    role: string;
    impact: string;
  }>;
  keyTransitTriggers: string[];
  astrologicalReason: string;
  remedies: string[];
}

export function predictPromotionAndIncrementTiming(
  kundli: KundliData,
  dasha?: { currentMahadasha: string; currentAntardasha: string }
): PromotionAndIncrementPrediction {
  const house10 = kundli.houses.find((h) => h.houseNumber === 10);
  const house11 = kundli.houses.find((h) => h.houseNumber === 11);
  const house6 = kundli.houses.find((h) => h.houseNumber === 6);

  const lord10 = house10 ? house10.rashiLord : 'Mercury';
  const lord11 = house11 ? house11.rashiLord : 'Moon';
  const lord6 = house6 ? house6.rashiLord : 'Mars';

  const planet10 = kundli.planets.find((p) => p.planet === lord10);
  const planet11 = kundli.planets.find((p) => p.planet === lord11);

  const planetsIn10 = kundli.planets.filter((p) => p.house === 10);
  const planetsIn11 = kundli.planets.filter((p) => p.house === 11);
  const planetsIn6 = kundli.planets.filter((p) => p.house === 6);

  // Calculate Base Promotion Score
  let score = 60;
  if (planet10?.dignity === 'Exalted' || planet10?.dignity === 'Own Sign') score += 20;
  else if (planet10?.dignity === 'Friendly Sign') score += 10;

  if (planetsIn10.length > 0) score += planetsIn10.length * 5;
  if (planetsIn11.length > 0) score += 10;

  const promotionProbability = Math.min(95, Math.max(55, score));

  // Determine Hike Percentage Range
  let hikeMin = 15;
  let hikeMax = 30;

  if (planet11?.dignity === 'Exalted' || planet11?.dignity === 'Own Sign') {
    hikeMin += 10;
    hikeMax += 15;
  }
  if (planetsIn11.some((p) => p.planet === 'Jupiter' || p.planet === 'Venus' || p.planet === 'Mercury')) {
    hikeMin += 5;
    hikeMax += 10;
  }

  // Calculate Timing Windows based on current date & Dasha
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 - 11

  // Promotion Window (6 to 14 months out)
  const promoStartMonth = (currentMonth + 4) % 12;
  const promoStartYear = currentYear + Math.floor((currentMonth + 4) / 12);
  const promoEndMonth = (promoStartMonth + 5) % 12;
  const promoEndYear = promoStartYear + Math.floor((promoStartMonth + 5) / 12);

  const monthNamesHindi = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];

  const promotionWindow = `${monthNamesHindi[promoStartMonth]} ${promoStartYear} - ${monthNamesHindi[promoEndMonth]} ${promoEndYear}`;

  // Increment Window (3 to 8 months out)
  const hikeStartMonth = (currentMonth + 2) % 12;
  const hikeStartYear = currentYear + Math.floor((currentMonth + 2) / 12);
  const hikeEndMonth = (hikeStartMonth + 4) % 12;
  const hikeEndYear = hikeStartYear + Math.floor((hikeStartMonth + 4) / 12);

  const salaryIncrementWindow = `${monthNamesHindi[hikeStartMonth]} ${hikeStartYear} - ${monthNamesHindi[hikeEndMonth]} ${hikeEndYear}`;

  // Triggering Planets Details
  const triggeringPlanets: PromotionAndIncrementPrediction['triggeringPlanets'] = [
    {
      planet: lord10,
      planetHindi: PLANET_CAREER_MAPPINGS[lord10]?.planetHindi || lord10,
      role: '10th House Lord (कर्मेश / पदोन्नति स्वामी)',
      impact: `दशमेश ${lord10} की स्थिति उच्च पद, अधिकारी वर्ग का समर्थन और प्रमोशन का मुख्य द्वार बनाती है।`
    },
    {
      planet: lord11,
      planetHindi: PLANET_CAREER_MAPPINGS[lord11]?.planetHindi || lord11,
      role: '11th House Lord (लाभेश / वेतन वृद्धि स्वामी)',
      impact: `एकादशेश ${lord11} का शुभ प्रभाव सैलेरी इंक्रीमेंट और वित्तीय प्रोत्साहन दिलाता है।`
    }
  ];

  if (planetsIn10.length > 0) {
    const p = planetsIn10[0];
    triggeringPlanets.push({
      planet: p.planet,
      planetHindi: PLANET_CAREER_MAPPINGS[p.planet]?.planetHindi || p.planet,
      role: '10th House Occupant (कर्म भाव का ग्रह)',
      impact: `10वें भाव में स्थित ग्रह ${p.planet} कार्यक्षेत्र में नेतृत्व क्षमता और पदोन्नति के योग को तीव्र करता है।`
    });
  }

  // Key Transit Triggers
  const keyTransitTriggers = [
    `गुरु (Jupiter) का 10वें या 11वें भाव पर दृष्टि संबंध (वर्षीय गोचर)`,
    `शनि (Saturn) का 3रे, 6ठे या 11वें भाव में गोचर भ्रमण, जो स्थायी करियर वृद्धि देता है`,
    dasha ? `${dasha.currentMahadasha} महादशा में ${dasha.currentAntardasha} अंतर्दशा का परिवर्तन काल` : 'दशांश (D10) चार्ट में 10th लॉर्ड का गोचर'
  ];

  const astrologicalReason = `आपकी कुंडली में कर्मेश (${lord10}) और लाभेश (${lord11}) की स्थिति दशमेश गोचर और ${dasha ? `${dasha.currentMahadasha}-${dasha.currentAntardasha} दशा` : 'शुभ दशा'} के मिलाप से इस समयावधि में पदोन्नति व सैलरी हाइक के मजबूत योग बना रही है।`;

  const remedies = [
    'सूर्य देव को प्रतिदिन तांबे के लोटे से अर्घ्य दें (ॐ घृणिः सूर्याय नमः)',
    'गुरुवार को गाय को चने की दाल व गुड़ खिलाएं (पद वृद्धि हेतु)',
    'प्रत्येक शनिवार पीपल के वृक्ष पर सरसों के तेल का दीपक जलाएं (कार्यस्थल की बाधाएं दूर करने हेतु)'
  ];

  return {
    promotionWindow,
    promotionProbability,
    salaryIncrementWindow,
    expectedHikePercent: `${hikeMin}% - ${hikeMax}%`,
    triggeringPlanets,
    keyTransitTriggers,
    astrologicalReason,
    remedies
  };
}

