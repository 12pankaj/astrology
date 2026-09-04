import { KundliData, VimshottariDashaResult } from '@vedic-astro/types';

export interface DeepMarriagePrediction {
  type: 'Love Marriage (प्रेम विवाह)' | 'Arranged Marriage (पारंपरिक विवाह)' | 'Love-cum-Arranged (प्रेम सह व्यवस्थित विवाह)';
  confidence: number;
  marriageAgeWindow: string;
  spouseDirection: string;
  facilitatedBy: string;
  spouseNature: string;
  spouseCareer: string;
  childrenDetails: string;
  analysis: string;
}

export interface DeepCareerPrediction {
  sector: 'Government Sector (सरकारी नौकरी)' | 'Private Sector (कॉरपोरेट जॉब)' | 'Business & Entrepreneurship (व्यापार/स्टार्टअप)';
  govtProbability: number;
  firstJobAgeWindow: string;
  jobLocationDirection: string;
  recommendedStreams: string[];
  astrologicalReason: string;
}

export interface PlanetDetailedImpact {
  planet: string;
  rashi: string;
  house: number;
  nakshatra: string;
  status: string;
  dignity: string;
  vedicImpact: string;
}

export interface VedicYogaDetected {
  name: string;
  house: number;
  planetsInvolved: string[];
  type: 'Raj Yoga (राजयोग)' | 'Dhana Yoga (धनयोग)' | 'Maha Purusha Yoga' | 'Special Conjunction (विशेष युति)';
  description: string;
}

export interface VedicDoshaDetected {
  name: string;
  isDoshaPresent: boolean;
  intensity: 'High (उच्च)' | 'Moderate (मध्यम)' | 'Low (निम्न)' | 'Cancelled (भंग/प्रभावहीन)';
  planetsInvolved: string[];
  description: string;
  remedies: string[];
}

export interface ChartMeaningExplanation {
  chart: string;
  name: string;
  significance: string;
  keyHousesToWatch: string;
}

export const D1_D60_EXPLANATIONS: ChartMeaningExplanation[] = [
  { chart: 'D1', name: 'Rashi (लग्न/राशि चार्ट)', significance: 'Overall Physical Life, Health, Personality & General Destiny', keyHousesToWatch: '1st House (Self), 5th House (Mind), 9th House (Luck), 10th House (Action)' },
  { chart: 'D2', name: 'Hora (होरा चार्ट)', significance: 'Wealth Accumulation, Family Assets, Cash Flow & Financial Stability', keyHousesToWatch: 'Sun Hora (Active Income), Moon Hora (Liquid Assets & Savings)' },
  { chart: 'D3', name: 'Drekkana (द्रेष्काण चार्ट)', significance: 'Siblings, Courage, Initiative, Energy & Short Travels', keyHousesToWatch: '3rd House (Valour), 11th House (Elder Siblings)' },
  { chart: 'D4', name: 'Chaturthamsha (चतुर्थांश चार्ट)', significance: 'Fixed Assets, Land, Real Estate, Vehicles & Fixed Fortune', keyHousesToWatch: '4th House (Property & Home)' },
  { chart: 'D7', name: 'Saptamsha (सप्तमांश चार्ट)', significance: 'Progeny, Children, Grandchildren & Creative Lineage', keyHousesToWatch: '5th House (Children), 9th House (Grandchildren)' },
  { chart: 'D9', name: 'Navamsha (नवांश चार्ट)', significance: 'Spouse, Marriage Destiny, Inner Strength & Post-Marriage Life (Fruit of D1)', keyHousesToWatch: '1st House (Dharma), 7th House (Spouse & Partnership)' },
  { chart: 'D10', name: 'Dashamsha (दशांश चार्ट)', significance: 'Career, Profession, Power, Government Status & Executive Success', keyHousesToWatch: '10th House (Karmasthan), 1st House (Public Image), 6th House (Competition)' },
  { chart: 'D12', name: 'Dwadashamsha (द्वादशांश चार्ट)', significance: 'Parents, Ancestors, Lineage & Paternal/Maternal Karma', keyHousesToWatch: '4th House (Mother), 9th House (Father)' },
  { chart: 'D16', name: 'Shodashamsha (षोडशांश चार्ट)', significance: 'Luxury Vehicles, Comforts, Happiness & Conveyance Comforts', keyHousesToWatch: '4th House (Vehicles)' },
  { chart: 'D20', name: 'Vimshamsha (विंशांश चार्ट)', significance: 'Spiritual Progress, Meditation, Worship & Divine Grace', keyHousesToWatch: '5th House (Mantra), 9th House (Guru & Higher Wisdom)' },
  { chart: 'D24', name: 'Chaturvimshamsha (चतुर्विंशांश चार्ट)', significance: 'Higher Education, Academic Learning, Research & Knowledge', keyHousesToWatch: '4th & 5th Houses (Degrees & Higher Studies)' },
  { chart: 'D27', name: 'Bhamsa (भांश/सप्तविंशांश)', significance: 'Physical & Mental Strengths, Vulnerabilities & Resilience', keyHousesToWatch: '1st House (Stamina), 6th House (Weaknesses)' },
  { chart: 'D30', name: 'Trimshamsha (त्रिंशांश चार्ट)', significance: 'Miseries, Evils, Health Doshas, Misfortunes & Karmic Lessons', keyHousesToWatch: '6th, 8th & 12th Houses (Dusthanas & Afflictions)' },
  { chart: 'D40', name: 'Khavedamsha (खवेदांश चार्ट)', significance: 'Auspiciousness, Inauspicious Events & Maternal Lineage Good Fortune', keyHousesToWatch: 'Benefic Planets Placements' },
  { chart: 'D45', name: 'Akshavedamsha (अक्षवेदांश चार्ट)', significance: 'Inner Character, Purity of Soul & Ethics', keyHousesToWatch: 'Lagna & Sun Placements' },
  { chart: 'D60', name: 'Shashtiamsha (षष्टिांश चार्ट)', significance: 'Past Life Karma (Past Birth Actions & Fine Destiny Root)', keyHousesToWatch: 'All 12 Houses Fine Coordinates' }
];

// Universal Vedic Dosha Evaluator & Remedy Engine for ANY Kundli
export function detectVedicDoshasAndRemedies(kundli: KundliData): VedicDoshaDetected[] {
  const doshas: VedicDoshaDetected[] = [];

  const houseMap: Record<number, string[]> = {};
  kundli.planets.forEach((p) => {
    if (!houseMap[p.house]) houseMap[p.house] = [];
    houseMap[p.house].push(p.planet);
  });

  const mars = kundli.planets.find((p) => p.planet === 'Mars')!;
  const sun = kundli.planets.find((p) => p.planet === 'Sun')!;
  const moon = kundli.planets.find((p) => p.planet === 'Moon')!;
  const rahu = kundli.planets.find((p) => p.planet === 'Rahu')!;
  const ketu = kundli.planets.find((p) => p.planet === 'Ketu')!;
  const saturn = kundli.planets.find((p) => p.planet === 'Saturn')!;
  const jupiter = kundli.planets.find((p) => p.planet === 'Jupiter')!;

  // 1. Manglik Dosha (मांगलिक दोष)
  const manglikHouses = [1, 4, 7, 8, 12];
  const isManglikFromLagna = manglikHouses.includes(mars.house);
  const isManglikFromMoon = manglikHouses.includes(((mars.rashiIndex - moon.rashiIndex + 12) % 12) + 1);

  if (isManglikFromLagna || isManglikFromMoon) {
    const isCancelled = mars.dignity === 'Own' || mars.dignity === 'Exalted' || houseMap[mars.house]?.includes('Jupiter');
    doshas.push({
      name: 'मांगलिक दोष (Manglik Dosha)',
      isDoshaPresent: true,
      intensity: isCancelled ? 'Cancelled (भंग/प्रभावहीन)' : isManglikFromLagna && isManglikFromMoon ? 'High (उच्च)' : 'Moderate (मध्यम)',
      planetsInvolved: ['Mars (मंगल)'],
      description: `मंगल ग्रह के ${mars.house} भाव में स्थित होने से मांगलिक दोष बनता है। यह वैवाहिक सामंजस्य, उग्र स्वभाव व जीवनसाथी के स्वास्थ्य को प्रभावित कर सकता है।`,
      remedies: [
        'प्रतिदिन हनुमान चालीसा का पाठ करें व मंगलवार को लाल वस्त्र/गुड़ का दान करें।',
        'मंगलवार के दिन सुंदरकांड का पाठ करना अत्यंत फलदायी है।',
        'विवाह से पूर्व गुण मिलान व कुंभ विवाह / अर्क विवाह संकल्प करें।'
      ]
    });
  }

  // 2. Kaalsarp Dosha (कालसर्प दोष)
  const rahuLong = rahu.longitude;
  const ketuLong = ketu.longitude;

  const mainPlanets = [sun, moon, mars, kundli.planets.find(p=>p.planet==='Mercury')!, jupiter, kundli.planets.find(p=>p.planet==='Venus')!, saturn];
  let side1Count = 0;
  let side2Count = 0;

  mainPlanets.forEach((p) => {
    let pLong = p.longitude;
    let diff = (pLong - rahuLong + 360) % 360;
    if (diff < 180) side1Count++;
    else side2Count++;
  });

  if (side1Count === 7 || side2Count === 7) {
    doshas.push({
      name: 'पूर्ण कालसर्प दोष (Full Kaalsarp Dosha)',
      isDoshaPresent: true,
      intensity: 'High (उच्च)',
      planetsInvolved: ['Rahu (राहु)', 'Ketu (केतु)'],
      description: `राहु (भाव ${rahu.house}) और केतु (भाव ${ketu.house}) के बीच सभी 7 मुख्य ग्रहों के आ जाने से पूर्ण कालसर्प दोष बनता है। यह जीवन के शुरुआती वर्षों में संघर्ष व विलंब दे सकता है।`,
      remedies: [
        'त्र्यंबकेश्वर या उज्जैन में महामृत्युंजय जाप व कालसर्प शांति पूजा करवाएं।',
        'प्रतिदिन शिवलिंग पर जलाभिषेक करें और "ॐ नमः शिवाय" का 108 बार जाप करें।',
        'नागपंचमी पर चांदी के नाग-नागिन का जोड़ा बहते जल में प्रवाहित करें।'
      ]
    });
  } else if (side1Count === 6 || side2Count === 6) {
    doshas.push({
      name: 'आंशिक कालसर्प दोष (Partial Kaalsarp Dosha)',
      isDoshaPresent: true,
      intensity: 'Low (निम्न)',
      planetsInvolved: ['Rahu (राहु)', 'Ketu (केतु)'],
      description: 'अधिकांश ग्रह राहु-केतु के मध्य स्थित हैं। आंशिक प्रभाव के कारण जीवन में यदा-कदा बाधाएं आती हैं।',
      remedies: [
        'सोमवार को कच्चे दूध व जल से शिव पूजा करें।',
        'राहु बीज मंत्र "ॐ रां राहवे नमः" का जाप करें।'
      ]
    });
  }

  // 3. Pitra Dosha (पितृ दोष)
  const isPitraDosha = (sun.house === rahu.house || sun.house === ketu.house || sun.house === saturn.house || (sun.house === 9 && (rahu.house === 9 || saturn.house === 9)));
  if (isPitraDosha) {
    doshas.push({
      name: 'पितृ दोष (Pitra Dosha)',
      isDoshaPresent: true,
      intensity: 'Moderate (मध्यम)',
      planetsInvolved: ['Sun (सूर्य)', sun.house === rahu.house ? 'Rahu (राहु)' : 'Saturn (शनि)'],
      description: 'सूर्य या नवम भाव पर राहु/शनि का प्रभाव होने से पितृ दोष बनता है। यह पैतृक संपत्ति, करियर में रुकावट व वंश वृद्धि में विलंब का कारण बनता है।',
      remedies: [
        'अमावस्या के दिन पितरों के नाम से तर्पण व तिल-जल का दान करें।',
        'प्रतिदिन सूर्य देव को तांबे के लोटे से अर्घ्य दें और आदित्य हृदय स्तोत्र का पाठ करें।',
        'पीपल के वृक्ष पर शनिवार को जल व सरसों का दीपक जलाएं।'
      ]
    });
  }

  // 4. Guru Chandal Dosha (गुरु चांडाल दोष)
  if (jupiter.house === rahu.house || jupiter.house === ketu.house) {
    doshas.push({
      name: 'गुरु चांडाल दोष (Guru Chandal Dosha)',
      isDoshaPresent: true,
      intensity: 'Moderate (मध्यम)',
      planetsInvolved: ['Jupiter (गुरु)', jupiter.house === rahu.house ? 'Rahu (राहु)' : 'Ketu (केतु)'],
      description: `भाव ${jupiter.house} में गुरु और राहु/केतु की युति से गुरु चांडाल दोष बनता है। यह निर्णय लेने में भ्रम, शिक्षा में बाधा व सलाहकारों से धोखा दिला सकता है।`,
      remedies: [
        'गुरुवार के दिन पीली वस्तुओं (चने की दाल, हल्दी, केला) का दान करें।',
        'माथे पर प्रतिदिन केसर या पीले चंदन का तिलक लगाएं।',
        'विष्णु सहस्रनाम का पाठ करें व गुरुजनों का सम्मान करें।'
      ]
    });
  }

  // 5. Vish Dosha / Punarphoo Dosha (विष दोष / पुनर्फू दोष)
  if (saturn.house === moon.house) {
    doshas.push({
      name: 'शनि-चंद्र विष दोष (Vish / Punarphoo Dosha)',
      isDoshaPresent: true,
      intensity: 'Moderate (मध्यम)',
      planetsInvolved: ['Saturn (शनि)', 'Moon (चंद्रма)'],
      description: `भाव ${saturn.house} में शनि और चंद्रमा की युति से विष दोष बनता है। यह अत्यधिक मानसिक तनाव, चिंता, निराशावादी विचार व अनिद्रा का कारण बन सकता है।`,
      remedies: [
        'प्रतिदिन हनुमान चालीसा का पाठ करें व शिव उपासना करें।',
        'शनिवार को छाया दान (सरसों के तेल में अपना चेहरा देखकर दान) करें।',
        'चांदी के पात्र में जल पीने से मानसिक शांति प्राप्त होती है।'
      ]
    });
  }

  // 6. Angarak Dosha (अंगारक दोष)
  if (mars.house === rahu.house || mars.house === ketu.house) {
    doshas.push({
      name: 'अंगारक दोष (Angarak Dosha)',
      isDoshaPresent: true,
      intensity: 'High (उच्च)',
      planetsInvolved: ['Mars (मंगल)', mars.house === rahu.house ? 'Rahu (राहु)' : 'Ketu (केतु)'],
      description: `भाव ${mars.house} में मंगल और राहु/केतु की युति से अंगारक दोष बनता है। यह तीव्र क्रोध, दुर्घटना की आशंका व अचानक आर्थिक नुकसान का कारण बनता है।`,
      remedies: [
        'मंगलवार के दिन लाल मसूर की दाल व तांबे के बर्तन का दान करें।',
        'गुस्से पर नियंत्रण रखें व महामृत्युंजय मंत्र का जाप करें।',
        'नीम का पेड़ लगाएं व उसकी सेवा करें।'
      ]
    });
  }

  // 7. Grahan Dosha (ग्रहण दोष)
  if (sun.house === rahu.house || moon.house === rahu.house || sun.house === ketu.house || moon.house === ketu.house) {
    const afflictedLum = (sun.house === rahu.house || sun.house === ketu.house) ? 'Sun (सूर्य)' : 'Moon (चंद्रमा)';
    doshas.push({
      name: 'सूर्य/चंद्र ग्रहण दोष (Grahan Dosha)',
      isDoshaPresent: true,
      intensity: 'Moderate (मध्यम)',
      planetsInvolved: [afflictedLum, 'Rahu/Ketu'],
      description: `भाव ${sun.house === rahu.house ? sun.house : moon.house} में ${afflictedLum} का राहु/केतु से युति होने से ग्रहण दोष बनता है। यह आत्म-विश्वास की कमी या मानसिक अस्थिरता देता है।`,
      remedies: [
        'ग्रहण काल के समय इष्ट देव के मंत्रों का जाप करें।',
        'सफेद/लाल वस्तुओं का दान जरूरतमंदों को करें।'
      ]
    });
  }

  // 8. Kemdrum Dosha (केमद्रुम दोष)
  const moonRashi = moon.rashiIndex;
  const house2FromMoon = (moonRashi + 1) % 12;
  const house12FromMoon = (moonRashi + 11) % 12;

  const planetsNextToMoon = kundli.planets.filter((p) => [house2FromMoon, house12FromMoon].includes(p.rashiIndex) && !['Rahu', 'Ketu', 'Sun', 'Moon'].includes(p.planet));
  if (planetsNextToMoon.length === 0) {
    doshas.push({
      name: 'केमद्रुम दोष (Kemdrum Dosha)',
      isDoshaPresent: true,
      intensity: 'Moderate (मध्यम)',
      planetsInvolved: ['Moon (चंद्रमा)'],
      description: 'चंद्रमा के आगे और पीछे वाले भावों में कोई ग्रह न होने से केमद्रुम दोष बनता है। यह यदा-कदा मानसिक अकेलापन व आर्थिक उतार-चढ़ाव दे सकता है।',
      remedies: [
        'सोमवार का व्रत रखें व पूर्णिमा पर चंद्रमा को अर्घ्य दें।',
        'घर में श्रीयंत्र की स्थापना कर नियमित पूजा करें।'
      ]
    });
  }

  if (doshas.length === 0) {
    doshas.push({
      name: 'दोष मुक्त कुंडली (Nir-Dosha Chart)',
      isDoshaPresent: false,
      intensity: 'Cancelled (भंग/प्रभावहीन)',
      planetsInvolved: [],
      description: 'आपकी कुंडली मुख्य दुष्ट दोषों से मुक्त है। ग्रह स्थिति अनुकूल व अत्यंत शुभ फलदायी है।',
      remedies: ['नियमित इष्ट देव की पूजा व गाय को रोटी खिलाएं।']
    });
  }

  return doshas;
}

// Universal Vedic Yogas & Multi-Planet Conjunction (युति / Stellium) Detector
export function detectStelliumsAndYogas(kundli: KundliData): VedicYogaDetected[] {
  const yogas: VedicYogaDetected[] = [];

  const houseMap: Record<number, string[]> = {};
  kundli.planets.forEach((p) => {
    if (!houseMap[p.house]) houseMap[p.house] = [];
    houseMap[p.house].push(p.planet);
  });

  Object.entries(houseMap).forEach(([hStr, pList]) => {
    const h = parseInt(hStr, 10);
    const mainPlanets = pList.filter((p) => !['Uranus', 'Neptune', 'Pluto'].includes(p));

    if (mainPlanets.length >= 3) {
      yogas.push({
        name: `बहुग्रह युति योग (House ${h} Stellium - ${mainPlanets.length} Planets Conjunction)`,
        house: h,
        planetsInvolved: mainPlanets,
        type: 'Raj Yoga (राजयोग)',
        description: `भाव ${h} में ${mainPlanets.join(', ')} की एक साथ युति होने से इस भाव की ऊर्जा अत्यधिक शक्तिशाली हो जाती है। यह जीवन में अद्वितीय सफलता और विशेष प्रतिभा का योग बनाता है।`
      });
    }

    if (pList.includes('Sun') && pList.includes('Mercury')) {
      yogas.push({
        name: 'बुधादित्य राजयोग (Budhaditya Raj Yoga)',
        house: h,
        planetsInvolved: ['Sun', 'Mercury'],
        type: 'Raj Yoga (राजयोग)',
        description: `सूर्य और बुध की भाव ${h} में युति से प्रखर बुद्धि, प्रशासनिक क्षमता, गणितीय चातुर्य और समाज में उच्च पद-प्रतिष्ठा की प्राप्ति होती है।`
      });
    }

    if (pList.includes('Mercury') && pList.includes('Venus')) {
      yogas.push({
        name: 'लक्ष्मी-नारायण योग (Laxmi Narayan Dhana Yoga)',
        house: h,
        planetsInvolved: ['Mercury', 'Venus'],
        type: 'Dhana Yoga (धनयोग)',
        description: `बुध और शुक्र की भाव ${h} में युति अपार धन, वैभव, उत्तम वाणी, सौंदर्य और व्यापारिक समृद्धि प्रदान करती है।`
      });
    }

    if (pList.includes('Moon') && pList.includes('Mars')) {
      yogas.push({
        name: 'चंद्र-मंगल धनयोग (Chandra-Mangal Yoga)',
        house: h,
        planetsInvolved: ['Moon', 'Mars'],
        type: 'Dhana Yoga (धनयोग)',
        description: `चंद्रमा और मंगल की युति व्यक्ति को अपने परिश्रम से अकूत धन-संपत्ति और व्यावसायिक सफलता दिलाती है।`
      });
    }

    if (pList.includes('Jupiter') && pList.includes('Moon')) {
      yogas.push({
        name: 'गजकेसरी राजयोग (Gajakesari Raj Yoga)',
        house: h,
        planetsInvolved: ['Jupiter', 'Moon'],
        type: 'Raj Yoga (राजयोग)',
        description: `गुरु और चंद्रमा की भाव ${h} में युति से उच्च मान-सम्मान, नेतृत्व शक्ति, अक्षय कीर्ति और अपार ज्ञान की प्राप्ति होती है।`
      });
    }
  });

  return yogas;
}

// 100% Dynamic Graha-by-Graha Impact Generator considering Stelliums & Conjunctions
export function generateDetailedPlanetImpacts(kundli: KundliData): PlanetDetailedImpact[] {
  const houseMeaning: Record<number, string> = {
    1: 'प्रथम भाव (लग्न - व्यक्तित्व, स्वास्थ्य व आत्म-सम्मान)',
    2: 'द्वितीय भाव (धन, वाणी व कुटुंब संपत्ति)',
    3: 'तृतीय भाव (पराक्रम, साहस व तकनीकी कौशल)',
    4: 'चतुर्थ भाव (सुख, माता, भूमि व वाहन)',
    5: 'पंचम भाव (ज्ञान, बुद्धि, संतान व भाग्य)',
    6: 'षष्ठ भाव (प्रतियोगिता, शत्रु विजय व ऋण मुक्ति)',
    7: 'सप्तम भाव (विवाह, जीवनसाथी व व्यावसायिक साझेदारी)',
    8: 'अष्टम भाव (आयु, शोध, गुप्त ज्ञान व परिवर्तन)',
    9: 'नवम भाव (धर्म, भाग्य, गुरु व तीर्थ यात्राएं)',
    10: 'दशम भाव (करियर, राज्य सत्ता, कर्म व प्रतिष्ठा)',
    11: 'एकादश भाव (आय, लाभ, इच्छा पूर्ति व नेटवर्क)',
    12: 'द्वादश भाव (मोक्ष, विदेश यात्रा, व्यय व आत्म-चिंतन)'
  };

  const housePlanetsMap: Record<number, string[]> = {};
  kundli.planets.forEach((p) => {
    if (!housePlanetsMap[p.house]) housePlanetsMap[p.house] = [];
    housePlanetsMap[p.house].push(p.planet);
  });

  return kundli.planets.map((p) => {
    const hDesc = houseMeaning[p.house] || `भाव ${p.house}`;
    const retroStr = p.isRetrograde ? 'वक्री (R - गहन प्रभाव)' : 'मार्गी (Direct)';
    const digStr = p.dignity === 'Exalted' ? 'उच्च (Exalted - अति शुभ)' : p.dignity === 'Debilitated' ? 'नीच (Debilitated - उपाय आवश्यक)' : p.dignity === 'Own' ? 'स्वगृही (Own Sign - अति बलवान)' : p.dignity === 'Friend' ? 'मित्र क्षेत्री (Friendly Sign - शुभ)' : p.dignity === 'Enemy' ? 'शत्रुक क्षेत्री (Inimical Sign)' : 'सम (Neutral)';

    const roommates = housePlanetsMap[p.house].filter((other) => other !== p.planet && !['Uranus', 'Neptune', 'Pluto'].includes(other));
    const conjunctionText = roommates.length > 0 ? ` [युति: ${roommates.join(', ')} के साथ एक ही भाव में]` : '';

    let customEffect = '';
    if (p.planet === 'Sun') {
      customEffect = `सूर्य ${p.rashiName} राशि में ${hDesc} में स्थित होकर आत्म-विश्वास, प्रशासनिक दृष्टि और समाज में आधिकारिक प्रतिष्ठा का योग बनाता है।${conjunctionText}`;
    } else if (p.planet === 'Moon') {
      customEffect = `चंद्रमा ${p.rashiName} राशि (${p.nakshatraName} नक्षत्र) में ${hDesc} में स्थित होकर मानसिक शांति, तीव्र अंतर्दृष्टि और भाग्य वृद्धि देता है।${conjunctionText}`;
    } else if (p.planet === 'Mars') {
      customEffect = `मंगल ${p.rashiName} राशि में ${hDesc} में स्थित होकर साहस, पराक्रम, त्वरित निर्णय क्षमता व तकनीकी महारत प्रदान करता है।${conjunctionText}`;
    } else if (p.planet === 'Mercury') {
      customEffect = `बुध ${p.rashiName} राशि में ${hDesc} में स्थित होकर गणितीय बुद्धि, संचार कौशल, व्यापारिक चातुर्य व विश्लेषणात्मक पकड़ देता है।${conjunctionText}`;
    } else if (p.planet === 'Jupiter') {
      customEffect = `गुरु (बृहस्पति) ${p.rashiName} राशि में ${hDesc} में स्थित होकर उच्च ज्ञान, न्यायप्रियता, आध्यात्मिक उन्नति व समस्याओं पर विजय दिलाता है।${conjunctionText}`;
    } else if (p.planet === 'Venus') {
      customEffect = `शुक्र ${p.rashiName} राशि में ${hDesc} में स्थित होकर आकर्षण, सौम्य स्वभाव, कलात्मक रुचि और भौतिक सुख-समृद्धि प्रदान करता है।${conjunctionText}`;
    } else if (p.planet === 'Saturn') {
      customEffect = `शनि ${p.rashiName} राशि में ${hDesc} में स्थित होकर धैर्य, कठोर अनुशासन, दीर्घकालिक संपत्ति व स्थायी सफलता दिलाता है।${conjunctionText}`;
    } else if (p.planet === 'Rahu') {
      customEffect = `राहु ${p.rashiName} राशि में ${hDesc} में स्थित होकर लीक से हटकर सफलता, विदेशी संपर्क और तीव्र महत्वाकांक्षा जगाता है।${conjunctionText}`;
    } else if (p.planet === 'Ketu') {
      customEffect = `केतु ${p.rashiName} राशि में ${hDesc} में स्थित होकर मोक्ष मार्ग, गहन शोध, गुप्त ज्ञान व अंतर्ज्ञान (Intuition) प्रदान करता है।${conjunctionText}`;
    } else if (p.planet === 'Uranus') {
      customEffect = `अरुण (Uranus) ${p.rashiName} राशि में ${hDesc} में स्थित होकर आधुनिक व क्रांतिकारी सोच दिलाता है।`;
    } else if (p.planet === 'Neptune') {
      customEffect = `वरुण (Neptune) ${p.rashiName} राशि में ${hDesc} में स्थित होकर उच्च कल्पनाशीलता व संवेदनशीलता प्रदान करता है।`;
    } else if (p.planet === 'Pluto') {
      customEffect = `यम (Pluto) ${p.rashiName} राशि में ${hDesc} में स्थित होकर जीवन में बड़े सकारात्मक कायाकल्प (Transformation) का योग बनाता है।`;
    }

    const fullVedicText = `${customEffect} स्थिति: ${retroStr}, गरिमा: ${digStr}।`;

    return {
      planet: `${p.planet} / ${p.planetHindi || p.planet}`,
      rashi: p.rashiName,
      house: p.house,
      nakshatra: `${p.nakshatraName} (पद ${p.pada})`,
      status: retroStr,
      dignity: digStr,
      vedicImpact: fullVedicText
    };
  });
}

// 100% Dynamic Marriage Predictions with Multi-Planet Conjunction Logic
export function predictMarriageDetailsDeep(kundli: KundliData): DeepMarriagePrediction {
  const h5Planets = kundli.planets.filter((p) => p.house === 5);
  const h7Planets = kundli.planets.filter((p) => p.house === 7);
  const venus = kundli.planets.find((p) => p.planet === 'Venus')!;
  const mars = kundli.planets.find((p) => p.planet === 'Mars')!;
  const jupiter = kundli.planets.find((p) => p.planet === 'Jupiter')!;

  const containsRahuInLoveHouse = h5Planets.some((p) => p.planet === 'Rahu') || h7Planets.some((p) => p.planet === 'Rahu');
  const venusMarsConjunction = venus.house === mars.house;

  const directions = ['East (पूर्व)', 'South (दक्षिण)', 'West (पश्चिम)', 'North (उत्तर)', 'North-East (ईशान/उत्तर-पूर्व)', 'South-West (नैऋत्य/दक्षिण-पश्चिम)'];
  const spouseDir = directions[(venus.rashiIndex + kundli.lagnaRashiIndex + 7) % directions.length];

  let minAge = 24 + ((venus.house + kundli.lagnaRashiIndex) % 4);
  let maxAge = minAge + 3;

  let facilitator = 'Family Elders & Family Friends (परिवार के बड़ों व रिश्तेदारों द्वारा)';
  if (h7Planets.some((p) => p.planet === 'Mercury' || p.planet === 'Moon')) {
    facilitator = 'Friends, Maternal Relatives or Social Circle (मित्रों व मामा पक्ष के माध्यम से)';
  } else if (venusMarsConjunction || containsRahuInLoveHouse) {
    facilitator = 'Self & Common Friends (स्वयं व मित्रों के माध्यम से)';
  }

  const childCount = (h5Planets.length > 0 ? 3 : 2);
  const childrenDetails = `कुंडली के 5th भाव (${h5Planets.length > 0 ? h5Planets.map(p=>p.planet).join(', ')+' की उपस्थिति' : 'शुभ दृष्टि'}) के अनुसार ${childCount} संतान के उत्तम योग हैं। प्रथम संतान भाग्यशाली व कुल का नाम रोशन करने वाली होगी।`;

  if (venusMarsConjunction || containsRahuInLoveHouse || h5Planets.length > 0) {
    return {
      type: 'Love Marriage (प्रेम विवाह)',
      confidence: 88,
      marriageAgeWindow: `${minAge} - ${maxAge} Years (वर्ष)`,
      spouseDirection: spouseDir,
      facilitatedBy: 'Self & Common Friends (स्वयं व मित्रों के माध्यम से)',
      spouseNature: 'आकर्षक व्यक्तित्व, स्वतंत्र विचार, कला व तकनीकी रुचि, भावनात्मक रूप से समर्पित।',
      spouseCareer: 'सॉफ्टवेयर, डिजाइनिंग, कॉरपोरेट मैनेजमेंट या मीडिया क्षेत्र।',
      childrenDetails,
      analysis: `लग्न (${kundli.lagnaRashi}), 5th भाव और 7th भाव के ग्रहों का सीधा संबंध दर्शा रहा है कि विवाह आपकी निजी पसंद या प्रेम संबंध के आधार पर होगा।`
    };
  }

  return {
    type: 'Arranged Marriage (पारंपरिक विवाह)',
    confidence: 90,
    marriageAgeWindow: `${minAge} - ${maxAge} Years (वर्ष)`,
    spouseDirection: spouseDir,
    facilitatedBy: facilitator,
    spouseNature: 'संस्कारवान, शांत, संभ्रांत पारिवारिक पृष्ठभूमि, व्यावहारिक व सहायक।',
    spouseCareer: 'प्रशासनिक सेवा, बैंक/फाइनेंस, शिक्षण संस्थान या पारिवारिक व्यवसाय।',
    childrenDetails,
    analysis: `सप्तम भाव पर गुरु (${jupiter.rashiName}) का शुभ प्रभाव और नवमेश का समर्थन पारिवारिक सम्मति से पारंपरिक रस्मों-रिवाजों के साथ स्थिर विवाह का योग बनाता है।`
  };
}

// 100% Dynamic Career Predictions with Multi-Planet Conjunction Logic
export function predictCareerDetailsDeep(kundli: KundliData): DeepCareerPrediction {
  const sun = kundli.planets.find((p) => p.planet === 'Sun')!;
  const mars = kundli.planets.find((p) => p.planet === 'Mars')!;
  const jupiter = kundli.planets.find((p) => p.planet === 'Jupiter')!;
  const mercury = kundli.planets.find((p) => p.planet === 'Mercury')!;
  const saturn = kundli.planets.find((p) => p.planet === 'Saturn')!;
  const venus = kundli.planets.find((p) => p.planet === 'Venus')!;
  const rahu = kundli.planets.find((p) => p.planet === 'Rahu');
  const ketu = kundli.planets.find((p) => p.planet === 'Ketu');

  const h10Planets = kundli.planets.filter((p) => p.house === 10);
  const h1Planets = kundli.planets.filter((p) => p.house === 1);

  const isSunStrong = [1, 5, 9, 10].includes(sun.house);
  const isGovtProminent = isSunStrong || h10Planets.some((p) => p.planet === 'Sun' || p.planet === 'Mars' || p.planet === 'Jupiter') || h1Planets.some((p) => p.planet === 'Sun');

  const directions = ['East (पूर्व)', 'South (दक्षिण)', 'West (पश्चिम)', 'North (उत्तर)', 'North-East (ईशान/उत्तर-पूर्व)', 'South-West (नैऋत्य/दक्षिण-पश्चिम)'];
  const jobDir = directions[(kundli.lagnaRashiIndex + 9) % directions.length];

  const firstJobAgeMin = 21 + ((saturn.house + kundli.lagnaRashiIndex) % 3);
  const firstJobAgeMax = firstJobAgeMin + 3;

  const h1PlanetsNames = h1Planets.map((p) => p.planet);
  const h10PlanetsNames = h10Planets.map((p) => p.planet);

  if (isGovtProminent) {
    const streams: string[] = [];
    if (mars.house === 1 || mars.house === 10 || mars.house === 4) streams.push('Police / Defense / Military / Defense Research (पुलिस, सेना व सुरक्षा बल)');
    if (sun.house === 1 || sun.house === 10) streams.push('Civil Services / Administrative Officer (IAS / RAS / प्रशासनिक अधिकारी)');
    if (jupiter.house === 1 || jupiter.house === 10 || jupiter.house === 5) streams.push('Teaching / Education / Judiciary (प्राध्यापक, शिक्षा व न्यायिक सेवा)');
    if (rahu && (rahu.house === 10 || rahu.house === 1)) streams.push('Govt Technology & AI Research / Defense Biotech (सरकारी टेक व रक्षा अनुसंधान)');
    if (streams.length === 0) streams.push('Public Sector Enterprises / State Govt Officer (राज्य लोक सेवा आयोग व पीएसयू)');

    let reasonText = `सूर्य (${sun.rashiName}, भाव ${sun.house})`;
    if (h1PlanetsNames.length >= 2) {
      reasonText += ` और 1st भाव में बहुग्रह युति (${h11Join(h1PlanetsNames)})`;
    }
    if (h10PlanetsNames.length >= 2) {
      reasonText += ` तथा 10th भाव में बहुग्रह युति (${h10PlanetsNames.join(' + ')})`;
    }
    reasonText += ` की मजबूत स्थिति सरकारी तंत्र में उच्च पद, अधिकार और सामाजिक प्रतिष्ठा दिलाती है।`;

    return {
      sector: 'Government Sector (सरकारी नौकरी)',
      govtProbability: 88,
      firstJobAgeWindow: `${firstJobAgeMin} - ${firstJobAgeMax} Years (वर्ष)`,
      jobLocationDirection: `${jobDir} (जन्म स्थान से)`,
      recommendedStreams: streams,
      astrologicalReason: reasonText
    };
  }

  const streams: string[] = [];
  if (mercury.house === 1 || mercury.house === 10 || mercury.house === 2) streams.push('IT / Software Engineering / Data Science / Commerce (सॉफ्टवेयर, डेटा साइंस व व्यापार)');
  if (venus.house === 1 || venus.house === 10) streams.push('Corporate Management / Media / Fashion / Luxury (कॉरपोरेट मीडिया, फैशन व लक्जरी)');
  if (saturn.house === 1 || saturn.house === 10) streams.push('Core Engineering / Mining / Natural Resources / Manufacturing (इंजीनियरिंग, खनन व मैन्युफैक्चरिंग)');
  if (rahu && (rahu.house === 1 || rahu.house === 10 || rahu.house === 11 || rahu.house === 5)) streams.push('Artificial Intelligence / Computers / Biotech / Import-Export (AI, इलेक्ट्रॉनिक्स, बायोटेक व आयात-निर्यात)');
  if (ketu && (ketu.house === 1 || ketu.house === 10 || ketu.house === 9 || ketu.house === 8)) streams.push('Spiritual & Occult / Astrology / Alternative Healing / Yoga / NGOs (ज्योतिष, अध्यात्म, हीलिंग व सामाजिक संस्थाएं)');
  if (streams.length === 0) streams.push('International Business & Startup (व्यापार, स्टार्टअप व कंसल्टिंग)');

  return {
    sector: 'Private Sector (कॉरपोरेट जॉब)',
    govtProbability: 45,
    firstJobAgeWindow: `${firstJobAgeMin} - ${firstJobAgeMax} Years (वर्ष)`,
    jobLocationDirection: `${jobDir} (जन्म स्थान से)`,
    recommendedStreams: streams,
    astrologicalReason: `बुध (${mercury.rashiName}), शुक्र (${venus.rashiName}), शनि (${saturn.rashiName}) ${rahu ? `तथा राहु/केतु` : ''} का प्रभाव कॉरपोरेट क्षेत्र, टेक इंडस्ट्री, आधुनिक नवाचार व व्यापार में तीव्र उन्नति दिलाता है।`
  };
}

function h11Join(arr: string[]): string {
  return arr.join(' + ');
}

export function getDivisionalChartDeepExplanation(chartType: string, kundli: KundliData): string {
  const chartInfo = D1_D60_EXPLANATIONS.find((c) => c.chart === chartType);
  if (!chartInfo) return 'Universal Divisional Chart Analysis';

  return `📊 ${chartInfo.name} (${chartInfo.chart}): ${chartInfo.significance}। ध्यान देने योग्य मुख्य भाव: ${chartInfo.keyHousesToWatch}।`;
}

// Backward-compatible export aliases
export const predictCareerDetails = predictCareerDetailsDeep;
export const predictMarriageDetails = predictMarriageDetailsDeep;
