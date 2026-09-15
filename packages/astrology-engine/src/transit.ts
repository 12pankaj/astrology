import { KundliData, TransitResult, TransitPlanetPosition, SadeSatiResult } from '@vedic-astro/types';
import { getJulianDay, calculatePlanetaryPositions } from './ephemeris.js';

const KAKSHYA_LORDS = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Ascendant'];

const RASHI_NAMES = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
];

function formatDegreeMinutes(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}° ${m < 10 ? '0' + m : m}'`;
}

// Classical transit result from Moon
function getTransitEffectFromMoon(planet: string, houseFromMoon: number): string {
  const favorableHouses: Record<string, number[]> = {
    Sun: [3, 6, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [3, 6, 11],
    Mercury: [2, 4, 6, 8, 10, 11],
    Jupiter: [2, 5, 7, 9, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Saturn: [3, 6, 11],
    Rahu: [3, 6, 11],
    Ketu: [3, 6, 11]
  };

  const isFav = (favorableHouses[planet] || []).includes(houseFromMoon);
  if (isFav) {
    return `शुभ गोचर (${houseFromMoon} भाव): सफलता, स्वास्थ्य सुधार व अनुकूलता का समय।`;
  } else {
    return `सावधानी आवश्यक (${houseFromMoon} भाव): निर्णय सोच-समझकर लें, स्वास्थ्य व व्यय का ध्यान रखें।`;
  }
}

/**
 * Calculates real-time Transit (Gochar) positions against natal chart
 * along with Saturn's Sade Sati and Dhaiya analysis.
 */
export function calculateTransitAndSadeSati(
  kundli: KundliData,
  transitDate: Date = new Date(),
  latitude: number = 27.1983,
  longitude: number = 73.7481
): TransitResult {
  const year = transitDate.getUTCFullYear();
  const month = transitDate.getUTCMonth() + 1;
  const day = transitDate.getUTCDate();
  const hour = transitDate.getUTCHours() + transitDate.getUTCMinutes() / 60;

  const jd = getJulianDay(year, month, day, hour);
  const transitPlanetsRaw = calculatePlanetaryPositions(jd, kundli.ayanamshaDegree);

  // Find Natal Moon Rashi Index
  const natalMoon = kundli.planets.find((p) => p.planet === 'Moon') || kundli.planets[1];
  const natalMoonRashiIdx = natalMoon.rashiIndex;
  const natalLagnaRashiIdx = kundli.lagnaRashiIndex;

  // Map each transit planet
  const transitPlanets: TransitPlanetPosition[] = transitPlanetsRaw.map((tp) => {
    const houseFromLagna = ((tp.rashiIndex - natalLagnaRashiIdx + 12) % 12) + 1;
    const houseFromMoon = ((tp.rashiIndex - natalMoonRashiIdx + 12) % 12) + 1;

    // Kakshya (0 to 7)
    const kakshyaIdx = Math.min(7, Math.floor(tp.degreeInSign / 3.75));
    const kakshyaLord = KAKSHYA_LORDS[kakshyaIdx];

    return {
      planet: tp.planet,
      planetHindi: tp.planetHindi,
      currentRashi: tp.rashiName,
      currentRashiIndex: tp.rashiIndex,
      formattedDegree: formatDegreeMinutes(tp.degreeInSign),
      houseFromLagna,
      houseFromMoon,
      isRetrograde: tp.isRetrograde,
      transitResultHindi: getTransitEffectFromMoon(tp.planet, houseFromMoon),
      kakshyaLord,
      isKakshyaAuspicious: kakshyaIdx % 2 === 0 // Kakshya check
    };
  });

  // Sade Sati & Dhaiya Calculation (Saturn transit from Natal Moon)
  const transitSaturn = transitPlanets.find((p) => p.planet === 'Saturn') || transitPlanets[6];
  const saturnHouseFromMoon = transitSaturn.houseFromMoon;

  let isSadeSatiActive = false;
  let activePhase: 'First Phase (उदयमान/मस्तक)' | 'Peak Phase (शिखर/उदर)' | 'Setting Phase (अस्तगामी/पाद)' | undefined = undefined;
  let dhaiyaStatus: 'Kantaka Shani (4th/अर्ध कंटक)' | 'Ashtama Shani (8th/अष्टम शनि)' | 'None' = 'None';
  let summaryHindi = '';

  if (saturnHouseFromMoon === 12) {
    isSadeSatiActive = true;
    activePhase = 'First Phase (उदयमान/मस्तक)';
    summaryHindi = `शनि देव आपकी जन्म राशि से 12वें भाव (${transitSaturn.currentRashi}) में गोचर कर रहे हैं। यह साढ़े साती का प्रथम चरण (उदयमान/मस्तक) है। इसमें अनावश्यक यात्रा, अनिद्रा व धन व्यय पर नियंत्रण रखना आवश्यक है।`;
  } else if (saturnHouseFromMoon === 1) {
    isSadeSatiActive = true;
    activePhase = 'Peak Phase (शिखर/उदर)';
    summaryHindi = `शनि देव आपकी जन्म राशि (${transitSaturn.currentRashi}) पर सीधे गोचर कर रहे हैं। यह साढ़े साती का द्वितीय (शिखर/उदर) चरण है। इसमें मानसिक धैर्य, अनुशासन और स्वास्थ्य पर विशेष ध्यान देना चाहिए।`;
  } else if (saturnHouseFromMoon === 2) {
    isSadeSatiActive = true;
    activePhase = 'Setting Phase (अस्तगामी/पाद)';
    summaryHindi = `शनि देव आपकी जन्म राशि से द्वितीय भाव (${transitSaturn.currentRashi}) में गोचर कर रहे हैं। यह साढ़े साती का तृतीय (अस्तगामी/पाद) चरण है। वाणी में संयम रखें और पारिवारिक विवादों से बचें, धीरे-धीरे रुकावटें दूर होंगी।`;
  } else if (saturnHouseFromMoon === 4) {
    dhaiyaStatus = 'Kantaka Shani (4th/अर्ध कंटक)';
    summaryHindi = `शनि देव जन्म राशि से चौथे भाव में गोचर कर रहे हैं। यह कंटक शनि ढैय्या है। माता के स्वास्थ्य व घरेलू सुख-सुविधाओं के प्रति सतर्क रहें।`;
  } else if (saturnHouseFromMoon === 8) {
    dhaiyaStatus = 'Ashtama Shani (8th/अष्टम शनि)';
    summaryHindi = `शनि देव जन्म राशि से आठवें भाव में गोचर कर रहे हैं। यह अष्टम शनि ढैय्या है। वाहन सावधानी से चलाएं और जोखिम भरे निवेश से बचें।`;
  } else {
    summaryHindi = `वर्तमान समय में आप पर शनि की साढ़े साती अथवा ढैय्या का प्रभाव नहीं है। शनि का गोचर आपके लिए अनुकूल स्थिति में है।`;
  }

  const remedies = [
    'प्रत्येक शनिवार को पीपल के वृक्ष के नीचे सरसों के तेल का दीपक प्रज्वलित करें।',
    'नित्य या प्रत्येक मंगलवार व शनिवार को श्री हनुमान चालीसा अथवा सुंदरकांड का पाठ करें।',
    'शनिवार को काले तिल, उड़द की दाल अथवा लोहे की वस्तु का दान किसी जरूरतमंद को करें।',
    'माता-पिता, वृद्धों व श्रमिकों का सदैव सम्मान करें और कटु वचनों से बचें।'
  ];

  const sadeSati: SadeSatiResult = {
    isSadeSatiActive,
    activePhase,
    saturnTransitRashi: transitSaturn.currentRashi,
    houseFromMoon: saturnHouseFromMoon,
    dhaiyaStatus,
    summaryHindi,
    remedies
  };

  return {
    transitDate: transitDate.toISOString().split('T')[0],
    natalMoonRashi: RASHI_NAMES[natalMoonRashiIdx],
    natalLagnaRashi: RASHI_NAMES[natalLagnaRashiIdx],
    planets: transitPlanets,
    sadeSati
  };
}
