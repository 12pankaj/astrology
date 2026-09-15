import { KundliData, DivisionalChart, JaiminiResult, CharaKaraka, ArudhaPada, CharaKarakaRole } from '@vedic-astro/types';

const KARAKA_ROLES: Array<{
  role: CharaKarakaRole;
  abbreviation: 'AK' | 'AmK' | 'BK' | 'MK' | 'PK' | 'GK' | 'DK';
  significanceHindi: string;
}> = [
  { role: 'Atmakaraka (AK)', abbreviation: 'AK', significanceHindi: 'आत्मा, आत्मबल, जीवन का मुख्य उद्देश्य व स्वरूप' },
  { role: 'Amatyakaraka (AmK)', abbreviation: 'AmK', significanceHindi: 'आजीविका, कर्मक्षेत्र, बुद्धि और निर्णय क्षमता' },
  { role: 'Bhratrukaraka (BK)', abbreviation: 'BK', significanceHindi: 'भाई-बहन, पराक्रम, गुरु और मार्गदर्शक' },
  { role: 'Matrukaraka (MK)', abbreviation: 'MK', significanceHindi: 'माता, मन की शांति, सुख, वाहन और संपत्ति' },
  { role: 'Putrakaraka (PK)', abbreviation: 'PK', significanceHindi: 'संतान, उच्च विद्या, विवेक, रचनात्मकता' },
  { role: 'Gnatikaraka (GK)', abbreviation: 'GK', significanceHindi: 'शत्रु, रोग, संघर्ष, ऋण और जीवन की चुनौतियाँ' },
  { role: 'Darakaraka (DK)', abbreviation: 'DK', significanceHindi: 'जीवनसाथी, वैवाहिक सुख, साझेदारी और संबंध' },
];

const RASHI_NAMES = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
];

const RASHI_LORDS: Record<number, string> = {
  0: 'Mars',    // Mesha
  1: 'Venus',   // Vrishabha
  2: 'Mercury', // Mithuna
  3: 'Moon',    // Karka
  4: 'Sun',     // Simha
  5: 'Mercury', // Kanya
  6: 'Venus',   // Tula
  7: 'Mars',    // Vrishchika
  8: 'Jupiter', // Dhanu
  9: 'Saturn',  // Makara
  10: 'Saturn', // Kumbha
  11: 'Jupiter' // Meena
};

const ARUDHA_NAMES: Record<number, { code: string; nameHindi: string; significance: string }> = {
  1: { code: 'AL', nameHindi: 'आरूढ़ लग्न (AL / पद लग्न)', significance: 'समाज में छवि, मान-सम्मान, बाह्य व्यक्तित्व और प्रतिष्ठा' },
  2: { code: 'A2', nameHindi: 'कोश पद (A2)', significance: 'धन संचय, वाणी, कुटुंब और वित्तीय स्थिति का बाह्य प्रकटीकरण' },
  3: { code: 'A3', nameHindi: 'भ्रातृ पद (A3)', significance: 'साहस, छोटे भाई-बहन, पराक्रम और संचार कौशल' },
  4: { code: 'A4', nameHindi: 'मातृ/सुख पद (A4)', significance: 'गृह सुख, वाहन, भौतिक संपत्ति और माता से संबंध' },
  5: { code: 'A5', nameHindi: 'मंत्र/पुत्र पद (A5)', significance: 'संतान, पूर्व पुण्य, प्रतिभा, विद्या और निवेश' },
  6: { code: 'A6', nameHindi: 'शत्रु/रोग पद (A6)', significance: 'प्रतिस्पर्धा, ऋण, कोर्ट-कचहरी और रोग की स्थिति' },
  7: { code: 'A7', nameHindi: 'दारा पद (A7)', significance: 'व्यापारिक साझीदार, जीवनसाथी और सांसारिक संबंध' },
  8: { code: 'A8', nameHindi: 'मृत्यु पद (A8)', significance: 'आयु, छिपे हुए संकट, आकस्मिक परिवर्तन और शोध' },
  9: { code: 'A9', nameHindi: 'भाग्य पद (A9)', significance: 'धर्म, गुरु कृपा, उच्च शिक्षा और भाग्य का उदय' },
  10: { code: 'A10', nameHindi: 'राज्य पद (A10)', significance: 'करियर, सत्ता, सामाजिक प्रभाव और उच्च पद' },
  11: { code: 'A11', nameHindi: 'लाभ पद (A11)', significance: 'आय के स्रोत, मित्र मंडली, आकांक्षाओं की पूर्ति' },
  12: { code: 'UL', nameHindi: 'उपपद लग्न (UL / गौण पद)', significance: 'वैवाहिक स्थिरता, जीवनसाथी का स्वभाव व परिवार' },
};

function formatDegreeMinutes(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.round(((deg - d) * 60 - m) * 60);
  return `${d}° ${m < 10 ? '0' + m : m}' ${s < 10 ? '0' + s : s}"`;
}

/**
 * Calculates Jaimini 7 Chara Karakas, 12 Arudha Padas, and Karakamsha
 */
export function calculateJaimini(kundli: KundliData, d9Chart?: DivisionalChart): JaiminiResult {
  // 1. Calculate 7 Chara Karakas (Exclude Rahu & Ketu in 7-Karaka Parashara system)
  const physicalPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const eligible = kundli.planets
    .filter((p) => physicalPlanets.includes(p.planet))
    .map((p) => ({
      planet: p.planet,
      planetHindi: p.planetHindi,
      degreeInSign: p.degreeInSign,
      formattedDegree: formatDegreeMinutes(p.degreeInSign),
      rashi: p.rashiName
    }))
    .sort((a, b) => b.degreeInSign - a.degreeInSign);

  const charaKarakas: CharaKaraka[] = eligible.slice(0, 7).map((p, idx) => ({
    role: KARAKA_ROLES[idx].role,
    abbreviation: KARAKA_ROLES[idx].abbreviation,
    significanceHindi: KARAKA_ROLES[idx].significanceHindi,
    planet: p.planet,
    planetHindi: p.planetHindi,
    degreeInSign: p.degreeInSign,
    formattedDegree: p.formattedDegree,
    rashi: p.rashi
  }));

  // 2. Calculate 12 Arudha Padas with Parashara/Jaimini Exceptions
  const arudhaPadas: ArudhaPada[] = [];
  const lagnaRashiIdx = kundli.lagnaRashiIndex;

  for (let h = 1; h <= 12; h++) {
    const houseRashiIdx = (lagnaRashiIdx + h - 1) % 12;
    const houseLord = RASHI_LORDS[houseRashiIdx];

    // Find the planet representing house lord
    const lordPlanet = kundli.planets.find((p) => p.planet === houseLord);
    const lordHouse = lordPlanet ? lordPlanet.house : h;

    // Count signs from house h to lordHouse (inclusive)
    const dist = ((lordHouse - h + 12) % 12) + 1;

    // Calculate preliminary Arudha house
    let arudhaHouse = ((lordHouse + (dist - 1) - 1) % 12) + 1;

    // Classical BPHS / Jaimini Exception:
    // If Arudha falls in the same house (h) or the 7th from it, shift +10 signs (jump to 10th from computed house)
    const diffFromHouse = (arudhaHouse - h + 12) % 12;
    if (diffFromHouse === 0 || diffFromHouse === 6) {
      arudhaHouse = ((arudhaHouse + 9 - 1) % 12) + 1;
    }

    const arudhaRashiIdx = (lagnaRashiIdx + arudhaHouse - 1) % 12;
    const meta = ARUDHA_NAMES[h];

    arudhaPadas.push({
      houseNumber: h,
      code: meta.code,
      nameHindi: meta.nameHindi,
      rashiIndex: arudhaRashiIdx,
      rashiName: RASHI_NAMES[arudhaRashiIdx],
      significance: meta.significance
    });
  }

  // 3. Determine Karakamsha (Navamsha placement of Atmakaraka)
  const atmakaraka = charaKarakas[0];
  let karakamshaRashi = 'Mesha (Aries)';
  let karakamshaRashiIndex = 0;

  if (d9Chart) {
    const akNavamsha = d9Chart.placements.find((p) => p.planet === atmakaraka.planet);
    if (akNavamsha) {
      karakamshaRashi = akNavamsha.rashiName;
      karakamshaRashiIndex = akNavamsha.rashiIndex;
    }
  } else {
    // Calculate D9 Navamsha sign directly from AK longitude
    const akPlanet = kundli.planets.find((p) => p.planet === atmakaraka.planet);
    if (akPlanet) {
      const navamshaPart = Math.floor((akPlanet.degreeInSign / (30 / 9)));
      let startSign = 0;
      if ([0, 4, 8].includes(akPlanet.rashiIndex)) startSign = 0; // Mesha
      else if ([1, 5, 9].includes(akPlanet.rashiIndex)) startSign = 9; // Makara
      else if ([2, 6, 10].includes(akPlanet.rashiIndex)) startSign = 6; // Tula
      else startSign = 3; // Karka
      karakamshaRashiIndex = (startSign + navamshaPart) % 12;
      karakamshaRashi = RASHI_NAMES[karakamshaRashiIndex];
    }
  }

  const karakamshaSignificance = `आत्मकारक (${atmakaraka.planetHindi}) नवमांश में ${karakamshaRashi} में स्थित है। कारकांश लग्न जातक की आध्यात्मिक यात्रा, अंतर्निहित प्रतिभा और इष्ट देव का मुख्य संकेतक है।`;

  return {
    charaKarakas,
    arudhaPadas,
    karakamshaRashi,
    karakamshaRashiIndex,
    karakamshaSignificance
  };
}
