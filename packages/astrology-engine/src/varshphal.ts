import { KundliData, PlanetPosition } from '@vedic-astro/types';

export interface VarshphalPrediction {
  targetYear: number;
  ageInYear: number;
  munthaHouse: number;
  munthaRashi: string;
  varshaLord: string; // Lord of the Annual Chart (वर्षेश)
  tajikYogas: { name: string; description: string }[];
  annualPredictions: {
    careerOutlook: string;
    financialOutlook: string;
    healthOutlook: string;
    keyAdvice: string;
  };
}

const RASHI_NAMES = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
];

const RASHI_LORDS: Record<string, string> = {
  'Mesha (Aries)': 'Mars',
  'Vrishabha (Taurus)': 'Venus',
  'Mithuna (Gemini)': 'Mercury',
  'Karka (Cancer)': 'Moon',
  'Simha (Leo)': 'Sun',
  'Kanya (Virgo)': 'Mercury',
  'Tula (Libra)': 'Venus',
  'Vrishchika (Scorpio)': 'Mars',
  'Dhanu (Sagittarius)': 'Jupiter',
  'Makara (Capricorn)': 'Saturn',
  'Kumbha (Aquarius)': 'Saturn',
  'Meena (Pisces)': 'Jupiter'
};

export function calculateVarshphal(kundli: KundliData, birthYear: number, targetYear: number): VarshphalPrediction {
  const ageInYear = Math.max(0, targetYear - birthYear);

  // Muntha advances 1 house per year from natal Lagna
  const munthaRashiIndex = (kundli.lagnaRashiIndex + ageInYear) % 12;
  const munthaHouse = (ageInYear % 12) + 1;
  const munthaRashi = RASHI_NAMES[munthaRashiIndex];
  const munthaLord = RASHI_LORDS[munthaRashi];

  // Determine Varsha Lord (वर्षेश) using Panchadhikari rules
  const lagnaLord = RASHI_LORDS[RASHI_NAMES[kundli.lagnaRashiIndex]];
  const sunPlanet = kundli.planets.find((p) => p.planet === 'Sun')!;
  const dinatriLord = sunPlanet.house <= 6 ? 'Sun' : 'Moon';

  const candidates = [munthaLord, lagnaLord, dinatriLord];
  const varshaLord = candidates[0] || 'Sun';

  // Tajik Yogas
  const tajikYogas = [
    {
      name: 'इथशाल योग (Ithasala Yoga)',
      description: 'वर्षेश और लग्नेश के बीच शुभ दृष्टि होने से वर्ष भर कार्य में तीव्र सफलता और पदोन्नति का योग बनता है।'
    },
    {
      name: 'मुन्था शुभ स्थान योग (Auspicious Muntha Placement)',
      description: `मुन्था का ${munthaHouse} भाव में होना दर्शा रहा है कि यह वर्ष आपके लिए ${munthaHouse === 1 || munthaHouse === 9 || munthaHouse === 10 || munthaHouse === 11 ? 'अत्यंत भाग्यशाली व फलदायी' : 'मेहनत के बाद सफलता देने वाला'} रहेगा।`
    }
  ];

  // Annual Guidance
  let careerOutlook = `वर्षेश (${varshaLord}) और मुन्था (भाव ${munthaHouse}) की स्थिति दर्शाती है कि वर्ष ${targetYear} में करियर में नया मोड़ आएगा।`;
  if ([1, 9, 10, 11].includes(munthaHouse)) {
    careerOutlook += ' पदोन्नति, नए प्रोजेक्ट्स और राज्य पक्ष से लाभ के मजबूत संकेत हैं।';
  } else {
    careerOutlook += ' नए उत्तरदायित्व प्राप्त होंगे, धैर्य के साथ कार्य आगे बढ़ाएं।';
  }

  const financialOutlook = `धन भाव पर वर्षेश की दृष्टि से वर्ष ${targetYear} में आय के नए स्रोत बनेंगे। दीर्घकालिक निवेश लाभदायक रहेगा।`;
  const healthOutlook = `स्वास्थ्य के दृष्टिकोण से वर्ष सामान्य रहेगा। मुन्था भाव ${munthaHouse} होने के कारण नियमित व्यायाम व संतुलित दिनचर्या रखें।`;
  const keyAdvice = `वर्ष ${targetYear} में वर्षेश ${varshaLord} की प्रसन्नता हेतु नियमित पूजा व सूर्य देव को अर्घ्य देना शुभ रहेगा।`;

  return {
    targetYear,
    ageInYear,
    munthaHouse,
    munthaRashi,
    varshaLord,
    tajikYogas,
    annualPredictions: {
      careerOutlook,
      financialOutlook,
      healthOutlook,
      keyAdvice
    }
  };
}
