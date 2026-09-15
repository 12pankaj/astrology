import { MuhuratSystemResult, ChoghadiyaEntry, HoraEntry, ChoghadiyaType } from '@vedic-astro/types';

const CHOGHADIYA_METADATA: Record<string, {
  name: ChoghadiyaType;
  nature: 'Auspicious (शुभ)' | 'Neutral (सामान्य)' | 'Inauspicious (अशुभ)';
  rulingPlanet: string;
  suitableForHindi: string;
}> = {
  Amrit: {
    name: 'Amrit (अमृत)',
    nature: 'Auspicious (शुभ)',
    rulingPlanet: 'Moon',
    suitableForHindi: 'सर्वकार्य सिद्धि, पूजन, शुभ आरंभ व यात्रा हेतु सर्वश्रेष्ठ।'
  },
  Shubh: {
    name: 'Shubh (शुभ)',
    nature: 'Auspicious (शुभ)',
    rulingPlanet: 'Jupiter',
    suitableForHindi: 'विवाह, धार्मिक अनुष्ठान, शिक्षा व मांगलिक कार्यों हेतु उत्तम।'
  },
  Labh: {
    name: 'Labh (लाभ)',
    nature: 'Auspicious (शुभ)',
    rulingPlanet: 'Mercury',
    suitableForHindi: 'व्यापार आरंभ, वित्तीय लेन-देन, क्रय-विक्रय व लाभ प्राप्ति हेतु।'
  },
  Chal: {
    name: 'Chal (चर)',
    nature: 'Neutral (सामान्य)',
    rulingPlanet: 'Venus',
    suitableForHindi: 'यात्रा, वाहन क्रय, स्थानांतरण व गतिमान कार्यों के लिए उपयुक्त।'
  },
  Rog: {
    name: 'Rog (रोग)',
    nature: 'Inauspicious (अशुभ)',
    rulingPlanet: 'Mars',
    suitableForHindi: 'कष्ट व विवाद कारक, नवीन शुभ कार्य प्रारंभ करने से बचें।'
  },
  Kaal: {
    name: 'Kaal (काल)',
    nature: 'Inauspicious (अशुभ)',
    rulingPlanet: 'Saturn',
    suitableForHindi: 'हानि व अवरोध कारक, इस अवधि में महत्वपूर्ण निर्णय न लें।'
  },
  Udveg: {
    name: 'Udveg (उद्वेग)',
    nature: 'Inauspicious (अशुभ)',
    rulingPlanet: 'Sun',
    suitableForHindi: 'चिंता व मानसिक उथल-पुथल, केवल सरकारी व अनिवार्य कार्य करें।'
  }
};

// Day Choghadiya sequence by day of week (0: Sun, 1: Mon, ..., 6: Sat)
const DAY_PATTERNS: Record<number, string[]> = {
  0: ['Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'],
  1: ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Chal', 'Labh', 'Amrit'],
  2: ['Rog', 'Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],
  3: ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Chal', 'Labh'],
  4: ['Shubh', 'Rog', 'Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh'],
  5: ['Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Chal'],
  6: ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal']
};

// Night Choghadiya sequence
const NIGHT_PATTERNS: Record<number, string[]> = {
  0: ['Shubh', 'Amrit', 'Chal', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh'],
  1: ['Chal', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Chal'],
  2: ['Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Chal', 'Rog', 'Kaal'],
  3: ['Udveg', 'Shubh', 'Amrit', 'Chal', 'Rog', 'Kaal', 'Labh', 'Udveg'],
  4: ['Amrit', 'Chal', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit'],
  5: ['Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Chal', 'Rog'],
  6: ['Labh', 'Udveg', 'Shubh', 'Amrit', 'Chal', 'Rog', 'Kaal', 'Labh']
};

const HORA_PLANET_ORDER = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
const HORA_HINDI: Record<string, { hindi: string; significance: string }> = {
  Sun: { hindi: 'सूर्य होरा', significance: 'प्रशासनिक कार्य, उच्चाधिकारियों से भेंट व सरकारी आवेदन।' },
  Venus: { hindi: 'शुक्र होरा', significance: 'कला, वस्त्र-आभूषण, सौंदर्य, प्रेम व नवीन संबंध।' },
  Mercury: { hindi: 'बुध होरा', significance: 'व्यापार, लेखा-जोखा, संवाद, लेखन व दस्तावेजी कार्य।' },
  Moon: { hindi: 'चंद्र होरा', significance: 'जल संबंधी कार्य, यात्रा, मानसिक शांति व पारिवारिक मिलन।' },
  Saturn: { hindi: 'शनि होरा', significance: 'मशीनरी, भूमि, लोहा, निर्माण कार्य व न्यायसंगत कार्य।' },
  Jupiter: { hindi: 'गुरु होरा', significance: 'ज्ञान, धार्मिक कार्य, विवाह चर्चा, उच्च शिक्षा व दान।' },
  Mars: { hindi: 'मंगल होरा', significance: 'साहस, खेल, प्रतिस्पर्धा, वाद-विवाद व भूमि क्रय।' }
};

const DAY_HORA_STARTS: Record<number, string> = {
  0: 'Sun',
  1: 'Moon',
  2: 'Mars',
  3: 'Mercury',
  4: 'Jupiter',
  5: 'Venus',
  6: 'Saturn'
};

function formatMinsToHHMM(totalMinutes: number): string {
  let m = Math.round(totalMinutes) % 1440;
  if (m < 0) m += 1440;
  const hours = Math.floor(m / 60);
  const mins = Math.floor(m % 60);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const mm = mins < 10 ? `0${mins}` : `${mins}`;
  return `${h12 < 10 ? '0' + h12 : h12}:${mm} ${ampm}`;
}

export function calculateChoghadiyaAndHora(
  date: Date = new Date(),
  sunriseMinutes: number = 385, // 06:25 AM default
  sunsetMinutes: number = 1110  // 06:30 PM default
): MuhuratSystemResult {
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon ...
  const daySpan = sunsetMinutes - sunriseMinutes;
  const dayPart = daySpan / 8;

  const nightSpan = 1440 - daySpan;
  const nightPart = nightSpan / 8;

  // 1. Day Choghadiya
  const dayPattern = DAY_PATTERNS[dayOfWeek];
  const dayChoghadiya: ChoghadiyaEntry[] = dayPattern.map((name, idx) => {
    const startM = sunriseMinutes + idx * dayPart;
    const endM = startM + dayPart;
    const meta = CHOGHADIYA_METADATA[name];
    return {
      periodIndex: idx + 1,
      name: meta.name,
      nature: meta.nature,
      rulingPlanet: meta.rulingPlanet,
      startTime: formatMinsToHHMM(startM),
      endTime: formatMinsToHHMM(endM),
      suitableForHindi: meta.suitableForHindi
    };
  });

  // 2. Night Choghadiya
  const nightPattern = NIGHT_PATTERNS[dayOfWeek];
  const nightChoghadiya: ChoghadiyaEntry[] = nightPattern.map((name, idx) => {
    const startM = sunsetMinutes + idx * nightPart;
    const endM = startM + nightPart;
    const meta = CHOGHADIYA_METADATA[name];
    return {
      periodIndex: idx + 1,
      name: meta.name,
      nature: meta.nature,
      rulingPlanet: meta.rulingPlanet,
      startTime: formatMinsToHHMM(startM),
      endTime: formatMinsToHHMM(endM),
      suitableForHindi: meta.suitableForHindi
    };
  });

  // 3. 24 Planetary Horas
  const startLord = DAY_HORA_STARTS[dayOfWeek];
  const startLordIdx = HORA_PLANET_ORDER.indexOf(startLord);
  const horas: HoraEntry[] = [];

  for (let h = 0; h < 24; h++) {
    const planet = HORA_PLANET_ORDER[(startLordIdx + h) % 7];
    const info = HORA_HINDI[planet];
    const horaStartM = (sunriseMinutes + h * 60) % 1440;
    const horaEndM = (horaStartM + 60) % 1440;

    horas.push({
      hourIndex: h + 1,
      startTime: formatMinsToHHMM(horaStartM),
      endTime: formatMinsToHHMM(horaEndM),
      rulingPlanet: planet,
      rulingPlanetHindi: info.hindi,
      significanceHindi: info.significance
    });
  }

  // Determine current active Choghadiya based on local minutes
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let currentChoghadiya: ChoghadiyaEntry | undefined = undefined;

  if (currentMinutes >= sunriseMinutes && currentMinutes < sunsetMinutes) {
    const idx = Math.min(7, Math.floor((currentMinutes - sunriseMinutes) / dayPart));
    currentChoghadiya = dayChoghadiya[idx];
  } else {
    let diff = currentMinutes >= sunsetMinutes ? currentMinutes - sunsetMinutes : currentMinutes + 1440 - sunsetMinutes;
    const idx = Math.min(7, Math.floor(diff / nightPart));
    currentChoghadiya = nightChoghadiya[idx];
  }

  return {
    date: date.toISOString().split('T')[0],
    sunrise: formatMinsToHHMM(sunriseMinutes),
    sunset: formatMinsToHHMM(sunsetMinutes),
    dayChoghadiya,
    nightChoghadiya,
    currentChoghadiya,
    horas
  };
}
