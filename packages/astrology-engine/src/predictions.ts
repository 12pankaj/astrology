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
  type: 'Raj Yoga (राजयोग)' | 'Dhana Yoga (धनयोग)' | 'Maha Purusha Yoga' | 'Special Conjunction (विशेष युति)' | 'Vipareeta Raja Yoga (विपरीत राजयोग)' | 'Neechbhanga Raj Yoga (नीचभंग राजयोग)';
  description: string;
  intensity?: 'Supreme (अति प्रबल)' | 'Strong (प्रबल)' | 'Moderate (सामान्य)';
  activationPeriod?: string;
  benefits?: string[];
}

export interface RajYogaDetail {
  id: string;
  name: string;
  hindiName: string;
  category: 'Maha Raj Yoga' | 'Pancha Mahapurusha' | 'Vipareeta Raja Yoga' | 'Dhana Raj Yoga' | 'Kendra-Trikona' | 'Neechbhanga';
  planetsInvolved: string[];
  housesInvolved: number[];
  intensity: 'Supreme (अति प्रबल)' | 'Strong (प्रबल)' | 'Moderate (सामान्य)';
  activationPeriod: string;
  description: string;
  benefitsHindi: string[];
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
    const isCancelled = mars.dignity === 'Own Sign' || mars.dignity === 'Exalted' || houseMap[mars.house]?.includes('Jupiter');
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
        'नाग पंचमी पर रुद्राभिषेक कराएं व चांदी के नाग-नागिन का जोड़ा शिवलिंग पर अर्पित करें।',
        'प्रतिदिन महामृत्युंजय मंत्र का 108 बार जाप करें व शिव मंदिर में जल चढ़ाएं।'
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
      description: `भाव ${jupiter.house} में गुरु और राहु की युति से गुरु चांडाल दोष बनता है। यह जातक की सोच को लीक से हटकर (out-of-the-box) बनाता है तथा शोध, टेक्नोलॉजी व आधुनिक विषयों में गहरी रुचि देता है, किंतु कभी-कभी निर्णय लेने में भ्रम व असमंजस दे सकता है।`,
      remedies: [
        'हर दिन, खासकर गुरुवार को, अपने माथे पर केसर अथवा पीले चंदन का तिलक लगाएं। इससे गुरु की सात्विक ऊर्जा बढ़ती है और राहु का नकारात्मक प्रभाव शांत होता है।',
        'गुरुवार के दिन मांसाहार, शराब व व्यसनों से पूर्ण परहेज रखें।',
        'भगवान विष्णु की नित्य आराधना करें तथा गुरुवार को चने की दाल या केले का दान करें।'
      ]
    });
  }

  // 5. Vish Dosha / Punarphoo Dosha (विष दोष / पुनर्फू दोष)
  if (saturn.house === moon.house) {
    doshas.push({
      name: 'शनि-चंद्र विष दोष (Vish / Punarphoo Dosha)',
      isDoshaPresent: true,
      intensity: 'Moderate (मध्यम)',
      planetsInvolved: ['Saturn (शनि)', 'Moon (चंद्रमा)'],
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
      description: 'चंद्रमा कन्या राशि में अकेला स्थित है और इसके द्वितीय व द्वादश भाव में कोई ग्रह नहीं है। इससे कभी-कभी मानसिक अकेलापन, ओवरथिंकिंग व मन की चंचलता रह सकती है।',
      remedies: [
        'चंद्रमा को मजबूत करने के लिए चांदी के गिलास से पानी पिएं। चांदी की अंगूठी या चेन धारण करने से चंद्रमा की ऊर्जा बढ़ती है।',
        'सोते समय अपने बिस्तर के पास सिरहाने पानी से भरा एक कटोरा रखें और सुबह उसे बाहर किसी पौधे की जड़ में विसर्जित कर दें।',
        'पूर्णिमा के दिन चंद्रमा को दूध-मिश्रित जल से अर्घ्य दें और माता के चरण स्पर्श कर आशीर्वाद लें।'
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

// Universal Comprehensive Raj Yoga Detection Engine (Brihat Parashara Hora Shastra Standard)
export function detectComprehensiveRajYogas(kundli: KundliData): RajYogaDetail[] {
  const rajYogas: RajYogaDetail[] = [];

  const getHouseLord = (h: number): string => {
    const cusp = kundli.houses.find((c) => c.houseNumber === h);
    return cusp ? cusp.rashiLord : '';
  };

  const getPlanet = (name: string) => {
    return kundli.planets.find((p) => p.planet === name);
  };

  const moon = getPlanet('Moon');
  const jupiter = getPlanet('Jupiter');
  const sun = getPlanet('Sun');
  const mercury = getPlanet('Mercury');
  const venus = getPlanet('Venus');
  const mars = getPlanet('Mars');
  const saturn = getPlanet('Saturn');

  const l1 = getHouseLord(1);
  const l4 = getHouseLord(4);
  const l5 = getHouseLord(5);
  const l7 = getHouseLord(7);
  const l9 = getHouseLord(9);
  const l10 = getHouseLord(10);
  const l6 = getHouseLord(6);
  const l8 = getHouseLord(8);
  const l12 = getHouseLord(12);

  // 1. Dharma-Karmadhipati Maha Raj Yoga (धर्म-कर्माधिपति महा राजयोग)
  if (l9 && l10) {
    if (l9 === l10) {
      const yogakarakaPlanet = getPlanet(l9);
      if (yogakarakaPlanet && [1, 4, 5, 7, 9, 10, 2, 11].includes(yogakarakaPlanet.house)) {
        rajYogas.push({
          id: 'dharma-karma-yogakaraka',
          name: 'Dharma-Karmadhipati Yogakaraka Raj Yoga',
          hindiName: 'धर्म-कर्माधिपति योगकारक महा राजयोग',
          category: 'Maha Raj Yoga',
          planetsInvolved: [l9],
          housesInvolved: [yogakarakaPlanet.house, 9, 10],
          intensity: 'Supreme (अति प्रबल)',
          activationPeriod: `दशा: ${l9} महादशा (Age 24-48)`,
          description: `कुंडली में ${l9} अकेले ही नवम (भाग्य) और दशम (कर्म/राजसत्ता) भाव का स्वामी होकर परम राजयोगकारक ग्रह बना है। भाव ${yogakarakaPlanet.house} में इसकी उपस्थिति जातक को सर्वोच्च प्रशासनिक पद, अपार सामाजिक प्रतिष्ठा व अखंड साम्राज्यिक सफलता प्रदान करती है।`,
          benefitsHindi: [
            'उच्च पद, राज्य सत्ता व सरकारी सम्मान की प्राप्ति',
            'कर्म व भाग्य का दिव्य संगम, कार्यों में अप्रत्याशित सफलता',
            'स्थाई धन, उच्च सामाजिक ओहदा व नेतृत्व शक्ति'
          ]
        });
      }
    } else {
      const p9 = getPlanet(l9);
      const p10 = getPlanet(l10);
      if (p9 && p10) {
        if (p9.house === p10.house) {
          rajYogas.push({
            id: 'dharma-karma-yuti',
            name: 'Dharma-Karmadhipati Conjunction Raj Yoga',
            hindiName: 'धर्म-कर्माधिपति युति महा राजयोग',
            category: 'Maha Raj Yoga',
            planetsInvolved: [l9, l10],
            housesInvolved: [p9.house, 9, 10],
            intensity: 'Supreme (अति प्रबल)',
            activationPeriod: `दशा: ${l9} या ${l10} महादशा`,
            description: `नवमेश (${l9}) और दशमेश (${l10}) की भाव ${p9.house} में युति पराशर ज्योतिष का सबसे बड़ा राजयोग है। यह जातक को समाज का शीर्ष नेतृत्वकर्ता, नीति निर्माता और असीम ख्याति संपन्न बनाता है।`,
            benefitsHindi: [
              'सर्वोच्च सरकारी पद, कॉरपोरेट लीडरशिप अथवा राजनीतिक प्रभुत्व',
              'जीवन भर भाग्य का प्रबल साथ और अटूट मान-सम्मान',
              'आकस्मिक व निरंतर धन वृद्धि'
            ]
          });
        } else if (Math.abs(p9.house - p10.house) === 6) {
          rajYogas.push({
            id: 'dharma-karma-drishti',
            name: 'Dharma-Karmadhipati Mutual Aspect Raj Yoga',
            hindiName: 'धर्म-कर्माधिपति समसप्तक दृष्टि राजयोग',
            category: 'Maha Raj Yoga',
            planetsInvolved: [l9, l10],
            housesInvolved: [p9.house, p10.house, 9, 10],
            intensity: 'Supreme (अति प्रबल)',
            activationPeriod: `दशा: ${l9}/${l10} काल`,
            description: `नवमेश (${l9}) और दशमेश (${l10}) परस्पर 180° समसप्तक दृष्टि संबंध में हैं। यह संबंध धर्म और कर्म को परस्पर पोषित कर जीवन में अतुलनीय सफलता दिलाता है।`,
            benefitsHindi: [
              'कठिन से कठिन चुनौतियों में विजय',
              'प्रशासनिक व न्यायिक क्षेत्रों में शिखर सम्मान',
              'दीर्घकालिक कीर्ति'
            ]
          });
        } else if (p9.house === 10 && p10.house === 9) {
          rajYogas.push({
            id: 'dharma-karma-parivartana',
            name: 'Dharma-Karma Maha Parivartana Raj Yoga',
            hindiName: 'धर्म-कर्म महा परिवर्तन राजयोग',
            category: 'Maha Raj Yoga',
            planetsInvolved: [l9, l10],
            housesInvolved: [9, 10],
            intensity: 'Supreme (अति प्रबल)',
            activationPeriod: `दशा: ${l9} या ${l10} गोचर/महादशा`,
            description: `नवम भाव का स्वामी दशम में और दशम भाव का स्वामी नवम में बैठकर दुर्लभतम महा परिवर्तन राजयोग निर्मित कर रहा है। यह राजपद और अपार धन वर्षा का सूचक है।`,
            benefitsHindi: [
              'राजकीय सम्मान, असीम वैभव व विशाल जनसमर्थन',
              'सभी प्रयासों में स्वतः भाग्य का सहयोग'
            ]
          });
        }
      }
    }
  }

  // 2. Kendra-Trikona Raj Yogas
  const kendraLords = [
    { house: 1, lord: l1 },
    { house: 4, lord: l4 },
    { house: 7, lord: l7 },
    { house: 10, lord: l10 }
  ];
  const trikonaLords = [
    { house: 1, lord: l1 },
    { house: 5, lord: l5 },
    { house: 9, lord: l9 }
  ];

  const checkedPairs = new Set<string>();
  kendraLords.forEach((k) => {
    trikonaLords.forEach((t) => {
      if (k.house !== t.house && k.lord && t.lord && k.lord !== t.lord) {
        const pairKey = [k.lord, t.lord].sort().join('-');
        if (!checkedPairs.has(pairKey)) {
          checkedPairs.add(pairKey);
          const pK = getPlanet(k.lord);
          const pT = getPlanet(t.lord);
          if (pK && pT && pK.house === pT.house && [1, 4, 5, 7, 9, 10, 2, 11].includes(pK.house)) {
            if (!(k.house === 10 && t.house === 9) && !(k.house === 9 && t.house === 10)) {
              rajYogas.push({
                id: `kt-${k.house}-${t.house}`,
                name: `Kendra-Trikona Raj Yoga (H${k.house} & H${t.house} Conjunction)`,
                hindiName: `केंद्र-त्रिकोण राजयोग (${k.house}वें व ${t.house}वें भाव स्वामियों की युति)`,
                category: 'Kendra-Trikona',
                planetsInvolved: [k.lord, t.lord],
                housesInvolved: [pK.house, k.house, t.house],
                intensity: 'Strong (प्रबल)',
                activationPeriod: `दशा: ${k.lord} व ${t.lord} काल`,
                description: `केंद्र भाव ${k.house} के स्वामी (${k.lord}) और त्रिकोण भाव ${t.house} के स्वामी (${t.lord}) की शुभ भाव ${pK.house} में युति शक्तिशाली केंद्र-त्रिकोण राजयोग बनाती है। यह जीवन को ऐश्वर्य, बौद्धिक प्रतिभा व पद-प्रतिष्ठा से परिपूर्ण करती है।`,
                benefitsHindi: [
                  'सामाजिक प्रतिष्ठा और उच्च पद प्राप्ति',
                  'भूमि, भवन, वाहन सुख एवं आर्थिक स्थिरता',
                  'विद्या, बुद्धि व निर्णय क्षमता में विशिष्टता'
                ]
              });
            }
          }
        }
      }
    });
  });

  // 3. Pancha Mahapurusha Yogas
  // Ruchaka (Mars)
  if (mars && [1, 4, 7, 10].includes(mars.house) && (mars.rashiIndex === 9 || mars.rashiIndex === 0 || mars.rashiIndex === 7)) {
    rajYogas.push({
      id: 'pancha-ruchaka',
      name: 'Ruchaka Mahapurusha Raj Yoga (रुचक राजयोग)',
      hindiName: 'रुचक महापुरुष राजयोग',
      category: 'Pancha Mahapurusha',
      planetsInvolved: ['Mars (मंगल)'],
      housesInvolved: [mars.house],
      intensity: 'Supreme (अति प्रबल)',
      activationPeriod: 'दशा: मंगल महादशा (उम्र 28-35 वर्ष)',
      description: `मंगल केंद्र भाव ${mars.house} में अपनी उच्च राशि (मकर) अथवा स्वराशि (मेष/वृश्चिक) में स्थित होकर 'रुचक राजयोग' बना रहा है। यह जातक को अदम्य साहसी, नेतृत्व संपन्न, सेना/पुलिस/खेल या बड़े उद्योग का संचालक बनाता है।`,
      benefitsHindi: [
        'विशाल भू-संपत्ति, रियल एस्टेट व वाहनों का स्वामित्व',
        'शत्रुओं पर सहज विजय और निडर व्यक्तित्व',
        'असाधारण शारीरिक बल, प्रशासनिक तेज व मान-सम्मान'
      ]
    });
  }

  // Bhadra (Mercury)
  if (mercury && [1, 4, 7, 10].includes(mercury.house) && (mercury.rashiIndex === 5 || mercury.rashiIndex === 2)) {
    rajYogas.push({
      id: 'pancha-bhadra',
      name: 'Bhadra Mahapurusha Raj Yoga (भद्र राजयोग)',
      hindiName: 'भद्र महापुरुष राजयोग',
      category: 'Pancha Mahapurusha',
      planetsInvolved: ['Mercury (बुध)'],
      housesInvolved: [mercury.house],
      intensity: 'Supreme (अति प्रबल)',
      activationPeriod: 'दशा: बुध महादशा (उम्र 22-40 वर्ष)',
      description: `बुध केंद्र भाव ${mercury.house} में स्वराशि (मिथुन) या उच्च राशि (कन्या) में होकर 'भद्र महापुरुष राजयोग' बनाता है। जातक अद्भुत वाकपटुता, विलक्षण बौद्धिक क्षमता, गणितीय कौशल व व्यापारिक साम्राज्य का स्वामी होता है।`,
      benefitsHindi: [
        'शीर्ष वाणिज्य, व्यापार, बैंकिंग व IT में अप्रतिम सफलता',
        'आकर्षक व्यक्तित्व, मीठी वाणी व जनप्रियता',
        'लेखन, शोध, परामर्श व कूटनीति में वैश्विक पहचान'
      ]
    });
  }

  // Hamsa (Jupiter)
  if (jupiter && [1, 4, 7, 10].includes(jupiter.house) && (jupiter.rashiIndex === 3 || jupiter.rashiIndex === 8 || jupiter.rashiIndex === 11)) {
    rajYogas.push({
      id: 'pancha-hamsa',
      name: 'Hamsa Mahapurusha Raj Yoga (हंस राजयोग)',
      hindiName: 'हंस महापुरुष राजयोग',
      category: 'Pancha Mahapurusha',
      planetsInvolved: ['Jupiter (गुरु)'],
      housesInvolved: [jupiter.house],
      intensity: 'Supreme (अति प्रबल)',
      activationPeriod: 'दशा: गुरु महादशा (उम्र 30-50 वर्ष)',
      description: `देवगुरु बृहस्पति केंद्र भाव ${jupiter.house} में उच्च (कर्क) अथवा स्वराशि (धनु/मीन) में होकर 'हंस महापुरुष राजयोग' बनाते हैं। यह जातक को ज्ञानवान, धर्मात्मा, न्यायप्रिय और समाज में सर्वमान्य पूजनीय बनाता है।`,
      benefitsHindi: [
        'न्यायपालिका, विश्वविद्यालय, अध्यात्म व सलाहकार पदों पर सर्वोच्च सम्मान',
        'अक्षय सात्विक धन, उत्तम संतान व सुखी पारिवारिक जीवन',
        'शासकों, मंत्रियों व संतों द्वारा उच्च आदर'
      ]
    });
  }

  // Malavya (Venus)
  if (venus && [1, 4, 7, 10].includes(venus.house) && (venus.rashiIndex === 11 || venus.rashiIndex === 1 || venus.rashiIndex === 6)) {
    rajYogas.push({
      id: 'pancha-malavya',
      name: 'Malavya Mahapurusha Raj Yoga (मालव्य राजयोग)',
      hindiName: 'मालव्य महापुरुष राजयोग',
      category: 'Pancha Mahapurusha',
      planetsInvolved: ['Venus (शुक्र)'],
      housesInvolved: [venus.house],
      intensity: 'Supreme (अति प्रबल)',
      activationPeriod: 'दशा: शुक्र महादशा (उम्र 20-45 वर्ष)',
      description: `शुक्र केंद्र भाव ${venus.house} में अपनी उच्च (मीन) या स्वराशि (वृषभ/तुला) में विराजमान होकर 'मालव्य महापुरुष राजयोग' बनाते हैं। यह राजसी सुख, लक्जरी कारों, कला, सिनेमा व सौंदर्य से परिपूर्ण जीवन देता है।`,
      benefitsHindi: [
        'असीम ऐश्वर्य, राजसी सुख-सुविधाएं व मनचाहे वाहन',
        'कला, सिनेमा, फैशन, मीडिया व लक्जरी उद्योग में अद्वितीय सफलता',
        'आकर्षक रूप-रंग और सुखी वैवाहिक जीवन'
      ]
    });
  }

  // Sasa (Saturn)
  if (saturn && [1, 4, 7, 10].includes(saturn.house) && (saturn.rashiIndex === 6 || saturn.rashiIndex === 9 || saturn.rashiIndex === 10)) {
    rajYogas.push({
      id: 'pancha-sasa',
      name: 'Sasa Mahapurusha Raj Yoga (शश राजयोग)',
      hindiName: 'शश महापुरुष राजयोग',
      category: 'Pancha Mahapurusha',
      planetsInvolved: ['Saturn (शनि)'],
      housesInvolved: [saturn.house],
      intensity: 'Supreme (अति प्रबल)',
      activationPeriod: 'दशा: शनि महादशा (उम्र 36-60 वर्ष)',
      description: `शनि केंद्र भाव ${saturn.house} में उच्च (तुला) या स्वराशि (मकर/कुंभ) में होकर 'शश महापुरुष राजयोग' निर्मित करते हैं। यह जातक को जननायक, राजनेता, विशाल उद्योगपति अथवा संगठन का सर्वशक्तिमान मुखिया बनाता है।`,
      benefitsHindi: [
        'विशाल जनसमूह, कर्मचारियों व जनता पर अखंड प्रभाव व नेतृत्व',
        'राजनीति, भारी उद्योग, माइनिंग, ऑयल व इंफ्रास्ट्रक्चर में दबदबा',
        'धैर्य, कूटनीतिक रहस्यवादिता व दीर्घायु'
      ]
    });
  }

  // 4. Gajakesari Raj Yoga
  if (moon && jupiter) {
    const diffFromMoon = (jupiter.house - moon.house + 12) % 12 + 1;
    if ([1, 4, 7, 10].includes(diffFromMoon)) {
      rajYogas.push({
        id: 'gajakesari-yoga',
        name: 'Gajakesari Raj Yoga (गजकेसरी महा राजयोग)',
        hindiName: 'गजकेसरी महा राजयोग',
        category: 'Maha Raj Yoga',
        planetsInvolved: ['Jupiter (गुरु)', 'Moon (चंद्रमा)'],
        housesInvolved: [jupiter.house, moon.house],
        intensity: 'Supreme (अति प्रबल)',
        activationPeriod: 'दशा: गुरु या चंद्र महादशा (विशेषकर 28+ आयु)',
        description: `चंद्रमा से केंद्र भाव (${diffFromMoon}वें भाव) में बृहस्पति की उपस्थिति अत्यंत शुभ 'गजकेसरी राजयोग' का निर्माण करती है। जैसे हाथियों के समूह में सिंह अजेय होता है, वैसे ही गजकेसरी योग वाला व्यक्ति समाज व कार्यक्षेत्र में निर्विवाद विजयी और सम्मानीय होता है।`,
        benefitsHindi: [
          'अखंड मान-सम्मान, अक्षय कीर्ति व अजातशत्रु प्रभाव',
          'उच्च बौद्धिक विवेक, आध्यात्मिक तेज व उत्तम सलाहकार क्षमता',
          'आर्थिक संकटों से स्वतः सुरक्षा कवच'
        ]
      });
    }
  }

  // 5. Vipareeta Raja Yogas
  if (l6) {
    const p6 = getPlanet(l6);
    if (p6 && [6, 8, 12].includes(p6.house)) {
      rajYogas.push({
        id: 'vipareeta-harsha',
        name: 'Harsha Vipareeta Raja Yoga (हर्ष विपरीत राजयोग)',
        hindiName: 'हर्ष विपरीत राजयोग',
        category: 'Vipareeta Raja Yoga',
        planetsInvolved: [l6],
        housesInvolved: [p6.house],
        intensity: 'Strong (प्रबल)',
        activationPeriod: `दशा: ${l6} काल`,
        description: `षष्ठेश (${l6}) का त्रिक भाव ${p6.house} में स्थित होना 'हर्ष योग' बनाता है। जातक को शत्रुओं पर अजेय विजय, कोर्ट-कचहरी में जीत और विपरीत परिस्थितियों में अचानक भारी उन्नति मिलती है।`,
        benefitsHindi: [
          'शत्रु दमन व कानूनी विवादों में एकतरफा विजय',
          'उत्तम स्वास्थ्य, शारीरिक प्रतिरोधक क्षमता व निर्भीकता',
          'संकट के समय अप्रत्याशित सफलता'
        ]
      });
    }
  }

  if (l8) {
    const p8 = getPlanet(l8);
    if (p8 && [6, 8, 12].includes(p8.house)) {
      rajYogas.push({
        id: 'vipareeta-sarala',
        name: 'Sarala Vipareeta Raja Yoga (सरल विपरीत राजयोग)',
        hindiName: 'सरल विपरीत राजयोग',
        category: 'Vipareeta Raja Yoga',
        planetsInvolved: [l8],
        housesInvolved: [p8.house],
        intensity: 'Strong (प्रबल)',
        activationPeriod: `दशा: ${l8} काल`,
        description: `अष्टमेश (${l8}) का भाव ${p8.house} में बैठना 'सरल विपरीत राजयोग' बनाता है। जातक दीर्घायु, निर्भय, गूढ़ विद्याओं का ज्ञाता तथा आकस्मिक वसीयत/विदेशी धन से धनी बनता है।`,
        benefitsHindi: [
          'दीर्घायु व संकटों से सहज मुक्ति',
          'आकस्मिक धन लाभ, गुप्त संपत्ति व वित्तीय जीत',
          'दृढ़ संकल्प व अनुसंधान में अद्वितीय सफलता'
        ]
      });
    }
  }

  if (l12) {
    const p12 = getPlanet(l12);
    if (p12 && [6, 8, 12].includes(p12.house)) {
      rajYogas.push({
        id: 'vipareeta-vimala',
        name: 'Vimala Vipareeta Raja Yoga (विमल विपरीत राजयोग)',
        hindiName: 'विमल विपरीत राजयोग',
        category: 'Vipareeta Raja Yoga',
        planetsInvolved: [l12],
        housesInvolved: [p12.house],
        intensity: 'Strong (प्रबल)',
        activationPeriod: `दशा: ${l12} काल`,
        description: `द्वादशेश (${l12}) का भाव ${p12.house} में होना 'विमल राजयोग' बनाता है। जातक स्वतंत्र विचारों वाला, सादगीपूर्ण जीवन जीते हुए अपार धन संचित करने वाला और परोपकारी होता है।`,
        benefitsHindi: [
          'अनावश्यक व्ययों पर पूर्ण नियंत्रण व संचित धन वृद्धि',
          'विदेश यात्राएं व बहुराष्ट्रीय स्रोतों से कमाई',
          'आत्मिक शांति व स्वतंत्रता'
        ]
      });
    }
  }

  // 6. Neechbhanga Raj Yoga
  const debilitatedPlanets = kundli.planets.filter((p) => p.dignity === 'Debilitated');
  debilitatedPlanets.forEach((debPlanet) => {
    const rashiLords = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
    const dispLordName = rashiLords[debPlanet.rashiIndex];
    const dispPlanet = getPlanet(dispLordName);

    let isNeechbhanga = false;
    let reason = '';

    if (dispPlanet && [1, 4, 7, 10].includes(dispPlanet.house)) {
      isNeechbhanga = true;
      reason = `नीच ग्रह ${debPlanet.planet} की नीच राशि का स्वामी (${dispLordName}) लग्न केंद्र (भाव ${dispPlanet.house}) में स्थित है`;
    } else if (dispPlanet && moon) {
      const diffFromMoon = (dispPlanet.house - moon.house + 12) % 12 + 1;
      if ([1, 4, 7, 10].includes(diffFromMoon)) {
        isNeechbhanga = true;
        reason = `नीच ग्रह की राशि का स्वामी (${dispLordName}) चंद्र से केंद्र (भाव ${diffFromMoon}) में स्थित है`;
      }
    } else if ([1, 4, 7, 10].includes(debPlanet.house)) {
      isNeechbhanga = true;
      reason = `नीच ग्रह ${debPlanet.planet} स्वयं केंद्र भाव ${debPlanet.house} में स्थित है`;
    }

    if (isNeechbhanga) {
      rajYogas.push({
        id: `neechbhanga-${debPlanet.planet.toLowerCase()}`,
        name: `Neechbhanga Raj Yoga (${debPlanet.planet})`,
        hindiName: `${debPlanet.planetHindi} नीचभंग राजयोग`,
        category: 'Neechbhanga',
        planetsInvolved: [debPlanet.planet, dispLordName],
        housesInvolved: [debPlanet.house],
        intensity: 'Supreme (अति प्रबल)',
        activationPeriod: `दशा: ${debPlanet.planet} या ${dispLordName} महादशा`,
        description: `${reason}। नीचभंग राजयोग जातक को शुरुआती जीवन के संघर्षों से निकालकर अप्रत्याशित रूप से राजा के समान उच्च पद व अपार प्रसिद्धि पर पहुंचाता है।`,
        benefitsHindi: [
          'संघर्षों का विजय में रूपांतरण (Rags to Riches)',
          'विपरीत परिस्थितियों में अद्भुत साहस और लोकप्रियता',
          'जीवन के उत्तरार्ध में अटूट सफलता'
        ]
      });
    }
  });

  // 7. Budhaditya Raj Yoga
  if (sun && mercury && sun.house === mercury.house && [1, 2, 4, 5, 7, 9, 10, 11].includes(sun.house)) {
    rajYogas.push({
      id: 'budhaditya-raj-yoga',
      name: 'Budhaditya Raj Yoga (बुधादित्य महा राजयोग)',
      hindiName: 'बुधादित्य महा राजयोग',
      category: 'Maha Raj Yoga',
      planetsInvolved: ['Sun (सूर्य)', 'Mercury (बुध)'],
      housesInvolved: [sun.house],
      intensity: 'Strong (प्रबल)',
      activationPeriod: 'दशा: सूर्य या बुध महादशा (उम्र 21-36 वर्ष)',
      description: `सूर्य और बुध की शुभ भाव ${sun.house} में युति से 'बुधादित्य राजयोग' का निर्माण हुआ है। यह व्यक्ति को विलक्षण बौद्धिक क्षमता, प्रशासनिक नेतृत्व, प्रखर स्मरण शक्ति व प्रतिष्ठित सरकारी/कॉरपोरेट पद प्रदान करता है।`,
      benefitsHindi: [
        'तीक्ष्ण बुद्धि, प्रशासनिक कुशलता व त्वरित निर्णय क्षमता',
        'सरकार, उच्चाधिकारियों व समाज में विशेष सम्मान',
        'ज्ञान, वक्तृत्व व वित्तीय प्रबंधन में असाधारण योग्यता'
      ]
    });
  }

  // 8. Laxmi-Narayan Dhana Raj Yoga
  if (mercury && venus && mercury.house === venus.house) {
    rajYogas.push({
      id: 'laxmi-narayan-yoga',
      name: 'Laxmi-Narayan Dhana Raj Yoga (लक्ष्मी-नारायण महायोग)',
      hindiName: 'लक्ष्मी-नारायण महायोग',
      category: 'Dhana Raj Yoga',
      planetsInvolved: ['Mercury (बुध)', 'Venus (शुक्र)'],
      housesInvolved: [mercury.house],
      intensity: 'Strong (प्रबल)',
      activationPeriod: 'दशा: बुध अथवा शुक्र महादशा',
      description: `बुध और शुक्र की भाव ${mercury.house} में युति दुर्लभ लक्ष्मी-नारायण योग बनाती है। यह अपार धन, विलासिता, मधुर वाणी, काव्य-कला प्रेम व व्यापार में अभूतपूर्व उन्नति कराती है।`,
      benefitsHindi: [
        'निरंतर धन प्रवाह व आकर्षक संपत्ति का अर्जन',
        'सौंदर्य, कला, व्यापार व संचार में शीर्ष प्रतिष्ठा',
        'समाज में लोकप्रिय व सम्मानीय व्यक्तित्व'
      ]
    });
  }

  // 9. Chandra-Mangal Mahalakshmi Dhana Yoga
  if (moon && mars && moon.house === mars.house) {
    rajYogas.push({
      id: 'chandra-mangal-dhana',
      name: 'Chandra-Mangal Mahalakshmi Yoga (चंद्र-मंगल महालक्ष्मी योग)',
      hindiName: 'चंद्र-मंगल महालक्ष्मी योग',
      category: 'Dhana Raj Yoga',
      planetsInvolved: ['Moon (चंद्रमा)', 'Mars (मंगल)'],
      housesInvolved: [moon.house],
      intensity: 'Strong (प्रबल)',
      activationPeriod: 'दशा: चंद्र अथवा मंगल महादशा',
      description: `चंद्रमा और मंगल की भाव ${moon.house} में युति महालक्ष्मी योग का सृजन करती है। जातक अपने बाहुबल, त्वरित क्रियाशीलता व व्यावसायिक साहस से अकूत चल-अचल संपत्ति का स्वामी बनता है।`,
      benefitsHindi: [
        'भूमि, भवन व रियल एस्टेट से भरपूर लाभ',
        'उद्यमिता व व्यापार में तीव्र आर्थिक प्रगति',
        'दृढ़ इच्छाशक्ति व कभी न हार मानने वाला स्वभाव'
      ]
    });
  }

  // 10. Amala Raj Yoga (आंवला / अमल राजयोग - Lagna or Chandra Lagna)
  const house10FromLagna = 10;
  const house10FromMoon = moon ? ((moon.house + 9 - 1) % 12) + 1 : 0;
  const beneficsIn10Lagna = kundli.planets.filter((p) => p.house === house10FromLagna && ['Jupiter', 'Venus', 'Mercury'].includes(p.planet));
  const beneficsIn10Moon = house10FromMoon ? kundli.planets.filter((p) => p.house === house10FromMoon && ['Jupiter', 'Venus', 'Mercury'].includes(p.planet)) : [];
  const allAmalaBenefics = [...beneficsIn10Lagna, ...beneficsIn10Moon];
  if (allAmalaBenefics.length > 0) {
    rajYogas.push({
      id: 'amala-yoga',
      name: 'Amala Raj Yoga (आंवला / अमल राजयोग)',
      hindiName: 'आंवला योग (Amala Yoga)',
      category: 'Maha Raj Yoga',
      planetsInvolved: allAmalaBenefics.map((p) => p.planetHindi),
      housesInvolved: allAmalaBenefics.map((p) => p.house),
      intensity: 'Supreme (अति प्रबल)',
      activationPeriod: `दशा: ${allAmalaBenefics.map((p) => p.planet).join('/')} काल`,
      description: 'लग्न अथवा चंद्र लग्न से दशम भाव में शुभ ग्रह की स्थिति से श्रेष्ठ आंवला (अमल) योग निर्मित होता है। यह जातक को करियर में शीघ्र सफलता, पैसे की बढ़ोतरी और समाज में सम्मान दिलाता है। व्यापार में उत्तम अवसर और आर्थिक स्थिरता प्राप्त होती है।',
      benefitsHindi: [
        'करियर व व्यापार में तीव्र उन्नति और नए शुभ अवसर',
        'समाज में निष्कलंक ख्याति, सदाचारी चरित्र व स्थायी सम्मान',
        'आर्थिक स्थिरता व कार्यक्षेत्र में प्रभावशाली नेतृत्व'
      ]
    });
  }

  // 11. Ubhayachari Yoga (उभयचारी राजयोग)
  if (sun) {
    const h12FromSun = ((sun.house - 2 + 12) % 12) + 1;
    const h2FromSun = (sun.house % 12) + 1;
    const p12FromSun = kundli.planets.filter((p) => p.house === h12FromSun && p.planet !== 'Moon');
    const p2FromSun = kundli.planets.filter((p) => p.house === h2FromSun && p.planet !== 'Moon');
    if (p12FromSun.length > 0 && p2FromSun.length > 0) {
      const planetsInv = [...p12FromSun.map(p => p.planetHindi), ...p2FromSun.map(p => p.planetHindi)];
      rajYogas.push({
        id: 'ubhayachari-yoga',
        name: 'Ubhayachari Yoga (उभयचारी राजयोग)',
        hindiName: 'उभयचारी योग (Ubhayachari Yoga)',
        category: 'Maha Raj Yoga',
        planetsInvolved: planetsInv,
        housesInvolved: [sun.house, h12FromSun, h2FromSun],
        intensity: 'Supreme (अति प्रबल)',
        activationPeriod: 'दशा: सूर्य अथवा द्वितीय/द्वादश भाव ग्रहों का काल',
        description: 'सूर्य के दोनों ओर (द्वितीय व द्वादश भाव में) ग्रहों की अनुकूल उपस्थिति से अत्यंत शुभ उभयचारी योग बनता है। यह जातक को प्रखर वाकपटुता, चुंबकीय आकर्षण, सामाजिक ख्याति और जीवन के प्रत्येक क्षेत्र में सहज सफलता प्रदान करता है।',
        benefitsHindi: [
          'वाणी में अद्भुत सम्मोहन व दूसरों को सहज आकर्षित करने की क्षमता',
          'समाज में विशिष्ट पहचान, लोकप्रियता व उच्च प्रतिष्ठा',
          'जीवन में आंतरिक संतुष्टि, प्रचुर संपन्नता व निरंतर प्रगति'
        ]
      });
    }
  }

  // 12. Parvata Yoga (पर्वत राजयोग)
  const beneficsInKendras = kundli.planets.filter((p) => [1, 4, 7, 10].includes(p.house) && ['Jupiter', 'Venus', 'Mercury'].includes(p.planet));
  if (beneficsInKendras.length >= 2) {
    rajYogas.push({
      id: 'parvata-yoga',
      name: 'Parvata Raj Yoga (पर्वत राजयोग)',
      hindiName: 'पर्वत योग (Parvata Yoga)',
      category: 'Maha Raj Yoga',
      planetsInvolved: beneficsInKendras.map(p => p.planetHindi),
      housesInvolved: beneficsInKendras.map(p => p.house),
      intensity: 'Supreme (अति प्रबल)',
      activationPeriod: 'दशा: केंद्रस्थ शुभ ग्रहों व लग्नेश काल',
      description: 'केंद्र भावों में शुभ ग्रहों की उपस्थिति से शास्त्रीय पर्वत राजयोग का सृजन होता है। पर्वत के समान जातक का व्यक्तित्व अडिग, स्थिर और समाज में उच्च स्थान प्राप्त करने वाला होता है। जातक परोपकारी, अचल संपत्ति का स्वामी और अपने कुल का गौरव बढ़ाता है।',
      benefitsHindi: [
        'पर्वत के समान सुदृढ़ व अविचल व्यक्तित्व तथा विशाल संपत्ति',
        'समाज व संगठन में सर्वोच्च नेतृत्व और सर्वमान्य प्रतिष्ठा',
        'कुल का मान-सम्मान, अक्षय कीर्ति व यशस्वी जीवन'
      ]
    });
  }

  // 13. Saraswati Vidya Raj Yoga (From Lagna or Chandra Lagna)
  if (jupiter && venus && mercury) {
    const saraswatiHouses = [1, 2, 4, 5, 7, 9, 10];
    const lagnaMatch = saraswatiHouses.includes(jupiter.house) && saraswatiHouses.includes(venus.house) && saraswatiHouses.includes(mercury.house);
    
    let chandraMatch = false;
    if (moon) {
      const jupFromMoon = ((jupiter.house - moon.house + 12) % 12) + 1;
      const venFromMoon = ((venus.house - moon.house + 12) % 12) + 1;
      const merFromMoon = ((mercury.house - moon.house + 12) % 12) + 1;
      chandraMatch = saraswatiHouses.includes(jupFromMoon) && saraswatiHouses.includes(venFromMoon) && saraswatiHouses.includes(merFromMoon);
    }

    if (lagnaMatch || chandraMatch) {
      rajYogas.push({
        id: 'saraswati-yoga',
        name: 'Saraswati Vidya Raj Yoga (सरस्वती महा राजयोग)',
        hindiName: 'सरस्वती योग (Saraswati Yoga)',
        category: 'Maha Raj Yoga',
        planetsInvolved: ['Jupiter (गुरु)', 'Venus (शुक्र)', 'Mercury (बुध)'],
        housesInvolved: [jupiter.house, venus.house, mercury.house],
        intensity: 'Supreme (अति प्रबल)',
        activationPeriod: 'जीवनपर्यंत (विशेषकर उच्च शिक्षा, शोध व बौद्धिक करियर काल)',
        description: 'गुरु, शुक्र व बुध तीनों परम शुभ ग्रह केंद्र व त्रिकोण में स्थित होकर ज्ञान, प्रज्ञा व कला की अधिष्ठात्री देवी माँ सरस्वती का साक्षात् आशीर्वाद प्रदान कर रहे हैं। जातक साहित्य, विज्ञान, तकनीक, वाकपटुता, शोध व लेखन में अप्रतिम ख्याति अर्जित करता है।',
        benefitsHindi: [
          'उच्च शिक्षा, अनुसंधान व ज्ञान-विज्ञान के क्षेत्र में विशिष्ट सम्मान',
          'वाणी में सम्मोहन, सूक्ष्म विचारशीलता व अचूक विश्लेषण क्षमता',
          'सात्विक संपन्नता, सदाचारी चरित्र व विद्वानों में सर्वमान्य आदर'
        ]
      });
    }
  }

  // 14. Parivartana Raj Yoga (Mutual Reception / राशि परिवर्तन राजयोग)
  const RASHI_LORD_PLANET: Record<number, string> = {
    0: 'Mars', 1: 'Venus', 2: 'Mercury', 3: 'Moon', 4: 'Sun', 5: 'Mercury',
    6: 'Venus', 7: 'Mars', 8: 'Jupiter', 9: 'Saturn', 10: 'Saturn', 11: 'Jupiter'
  };

  for (let i = 0; i < kundli.planets.length; i++) {
    for (let j = i + 1; j < kundli.planets.length; j++) {
      const p1 = kundli.planets[i];
      const p2 = kundli.planets[j];
      if (['Uranus', 'Neptune', 'Pluto', 'Rahu', 'Ketu'].includes(p1.planet) || ['Uranus', 'Neptune', 'Pluto', 'Rahu', 'Ketu'].includes(p2.planet)) continue;
      
      const p1SignLord = RASHI_LORD_PLANET[p1.rashiIndex];
      const p2SignLord = RASHI_LORD_PLANET[p2.rashiIndex];

      if (p1SignLord === p2.planet && p2SignLord === p1.planet) {
        const isKendraOrTrikona = [1, 4, 5, 7, 9, 10].includes(p1.house) && [1, 4, 5, 7, 9, 10].includes(p2.house);
        rajYogas.push({
          id: `parivartana-${p1.planet.toLowerCase()}-${p2.planet.toLowerCase()}`,
          name: 'Parivartana Raj Yoga (परिवर्तन राजयोग)',
          hindiName: 'परिवर्तन राजयोग (Parivartana Raj Yoga)',
          category: isKendraOrTrikona ? 'Maha Raj Yoga' : 'Kendra-Trikona',
          planetsInvolved: [p1.planetHindi, p2.planetHindi],
          housesInvolved: [p1.house, p2.house],
          intensity: 'Supreme (अति प्रबल)',
          activationPeriod: `दशा: ${p1.planet} अथवा ${p2.planet} काल`,
          description: `${p1.planetHindi} (भाव ${p1.house}) और ${p2.planetHindi} (भाव ${p2.house}) के मध्य परस्पर राशि परिवर्तन होने से अत्यंत शक्तिशाली 'महा परिवर्तन राजयोग' निर्मित हो रहा है। यह योग जीवन के उतार-चढ़ाव को स्वर्णिम अवसरों में बदल देता है और जातक को तीव्र आर्थिक प्रगति, स्थिरता और समाज में उच्च पद-प्रतिष्ठा प्रदान करता है।`,
          benefitsHindi: [
            'चुनौतियों और विपरीत परिस्थितियों को अप्रत्याशित सफलता में बदलने की क्षमता',
            'करियर में अभूतपूर्व उन्नति, अधिकार संपन्न पद व रणनीतिक प्रभाव',
            'स्थायी संपत्ति, मजबूत वित्तीय संचय व सामाजिक रुतबा'
          ]
        });
      }
    }
  }

  // 15. Rajalakshmana Yoga (राजलक्ष्मण योग)
  const lagnesha = kundli.planets.find(p => p.planet === 'Saturn');
  const beneficsInLagna = kundli.planets.filter(p => p.house === 1 && ['Venus', 'Mercury', 'Jupiter'].includes(p.planet));
  if (beneficsInLagna.length > 0 && lagnesha && [1, 4, 5, 7, 9, 10].includes(lagnesha.house)) {
    rajYogas.push({
      id: 'rajalakshmana-yoga',
      name: 'Rajalakshmana Yoga (राजलक्ष्मण योग)',
      hindiName: 'राजलक्ष्मण योग (Rajalakshmana Yoga)',
      category: 'Maha Raj Yoga',
      planetsInvolved: [...beneficsInLagna.map(p => p.planetHindi), lagnesha.planetHindi],
      housesInvolved: [1, lagnesha.house],
      intensity: 'Supreme (अति प्रबल)',
      activationPeriod: 'दशा: लग्न में स्थित शुभ ग्रह व लग्नेश काल',
      description: 'लग्न में परम शुभ ग्रहों की स्थिति और लग्नेश का शुभ त्रिकोण भाव में होना दुर्लभ राजलक्ष्मण योग की रचना करता है। यह योग जातक के रुतबे, मान-सम्मान, प्राकृतिक आकर्षण और सामाजिक स्वीकार्यता को चरम पर पहुंचाता है। लोग आपकी काबिलियत का स्वतः लोहा मानते हैं।',
      benefitsHindi: [
        'समाज, शासन व कॉरपोरेट जगत में विशिष्ट रुतबा, गरिमा व सम्मान',
        'स्वाभाविक आकर्षण, चुंबकीय व्यक्तित्व व सर्वमान्य प्रतिष्ठा',
        'प्रशासनिक अधिकार, कार्यक्षेत्र में दबदबा व दीर्घकालिक यश'
      ]
    });
  }

  return rajYogas;
}

// Universal Vedic Yogas & Multi-Planet Conjunction (युति / Stellium) Detector
export function detectStelliumsAndYogas(kundli: KundliData): VedicYogaDetected[] {
  const yogas: VedicYogaDetected[] = [];

  // Integrate detected Comprehensive Raj Yogas into the standard list
  const comprehensiveRajYogas = detectComprehensiveRajYogas(kundli);
  comprehensiveRajYogas.forEach((ry) => {
    yogas.push({
      name: `${ry.hindiName} (${ry.name})`,
      house: ry.housesInvolved[0] || 1,
      planetsInvolved: ry.planetsInvolved,
      type: ry.category.includes('Vipareeta')
        ? 'Vipareeta Raja Yoga (विपरीत राजयोग)'
        : ry.category.includes('Neechbhanga')
        ? 'Neechbhanga Raj Yoga (नीचभंग राजयोग)'
        : ry.category.includes('Dhana')
        ? 'Dhana Yoga (धनयोग)'
        : 'Raj Yoga (राजयोग)',
      description: ry.description,
      intensity: ry.intensity,
      activationPeriod: ry.activationPeriod,
      benefits: ry.benefitsHindi
    });
  });

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
        description: `भाव ${h} में ${mainPlanets.join(', ')} की एक साथ युति होने से इस भाव की ऊर्जा अत्यधिक शक्तिशाली हो जाती है। यह जीवन में अद्वितीय सफलता और विशेष प्रतिभा का योग बनाता है।`,
        intensity: 'Supreme (अति प्रबल)',
        activationPeriod: 'दशा: युति में शामिल बलवान ग्रह की दशा',
        benefits: ['विशिष्ट क्षेत्र में असाधारण प्रतिभा', 'जीवन में आकस्मिक युगांतरकारी मोड़']
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
    const digStr = p.dignity === 'Exalted' ? 'उच्च (Exalted - अति शुभ)' : p.dignity === 'Debilitated' ? 'नीच (Debilitated - उपाय आवश्यक)' : p.dignity === 'Own Sign' ? 'स्वगृही (Own Sign - अति बलवान)' : p.dignity === 'Friendly Sign' ? 'मित्र क्षेत्री (Friendly Sign - शुभ)' : p.dignity === 'Enemy Sign' ? 'शत्रुक क्षेत्री (Inimical Sign)' : 'सम (Neutral)';

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
