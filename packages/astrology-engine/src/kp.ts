import { KundliData, KpResult, KpPlanetRow, KpCuspRow, KpSignificatorGrade, RulingPlanets } from '@vedic-astro/types';

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus', 'Sun',
  'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury'
];

const RASHI_NAMES = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka',
  'Simha', 'Kanya', 'Tula', 'Vrishchika',
  'Dhanu', 'Makara', 'Kumbha', 'Meena'
];

const RASHI_LORDS = [
  'Mars', 'Venus', 'Mercury', 'Moon',
  'Sun', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

const VIMSHOTTARI_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const VIMSHOTTARI_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
};

function formatDMS(deg: number): string {
  const norm = ((deg % 30) + 30) % 30;
  const d = Math.floor(norm);
  const m = Math.floor((norm - d) * 60);
  const s = Math.round(((norm - d) * 60 - m) * 60);
  return `${d}° ${m < 10 ? '0' + m : m}' ${s < 10 ? '0' + s : s}"`;
}

/**
 * Given any longitude (0° - 360°), determines:
 * - Rashi Lord
 * - Star Lord (Nakshatra Lord)
 * - Sub Lord
 * - Sub-Sub Lord
 */
export function getKpLordsForLongitude(longitude: number) {
  const normLong = ((longitude % 360) + 360) % 360;

  // 1. Rashi & Rashi Lord
  const rashiIndex = Math.floor(normLong / 30);
  const rashi = RASHI_NAMES[rashiIndex];
  const rashiLord = RASHI_LORDS[rashiIndex];

  // 2. Nakshatra & Star Lord
  const nakshatraSpan = 360 / 27; // 13.33333333 degrees = 800 arcminutes
  const nakshatraIndex = Math.floor(normLong / nakshatraSpan);
  const nakshatra = NAKSHATRA_NAMES[nakshatraIndex];
  const starLord = NAKSHATRA_LORDS[nakshatraIndex];

  // Arcminutes traversed in this Nakshatra (0 to 800)
  const arcMinutesInNakshatra = (normLong - nakshatraIndex * nakshatraSpan) * 60;

  // 3. Sub-Lord
  // Vimshottari cycle of 9 planets starting from the starLord
  const startLordIdx = VIMSHOTTARI_LORDS.indexOf(starLord);
  let accumulatedMinutes = 0;
  let subLord = starLord;
  let subSpanMinutes = 0;
  let minutesIntoSub = 0;

  for (let i = 0; i < 9; i++) {
    const lord = VIMSHOTTARI_LORDS[(startLordIdx + i) % 9];
    const span = 800 * (VIMSHOTTARI_YEARS[lord] / 120); // Span of this sub in arcminutes
    if (arcMinutesInNakshatra >= accumulatedMinutes && arcMinutesInNakshatra < accumulatedMinutes + span + 0.000001) {
      subLord = lord;
      subSpanMinutes = span;
      minutesIntoSub = arcMinutesInNakshatra - accumulatedMinutes;
      break;
    }
    accumulatedMinutes += span;
  }

  // 4. Sub-Sub Lord
  // Subdivide the sub-lord's span in the same proportion starting from subLord
  const startSubLordIdx = VIMSHOTTARI_LORDS.indexOf(subLord);
  let subSubAccum = 0;
  let subSubLord = subLord;

  for (let j = 0; j < 9; j++) {
    const ssLord = VIMSHOTTARI_LORDS[(startSubLordIdx + j) % 9];
    const ssSpan = subSpanMinutes * (VIMSHOTTARI_YEARS[ssLord] / 120);
    if (minutesIntoSub >= subSubAccum && minutesIntoSub < subSubAccum + ssSpan + 0.000001) {
      subSubLord = ssLord;
      break;
    }
    subSubAccum += ssSpan;
  }

  return {
    rashi,
    rashiIndex,
    rashiLord,
    nakshatra,
    nakshatraIndex,
    starLord,
    subLord,
    subSubLord
  };
}

/**
 * Calculates complete KP System:
 * - KP Cusps (1 to 12) with Sign, Star, Sub, and Sub-Sub Lords
 * - KP Planetary positions with Sub-Lords
 * - 4-Fold Significators (A, B, C, D)
 * - Ruling Planets
 */
export function calculateKpSystem(kundli: KundliData, dayLordName: string = 'Friday'): KpResult {
  // KP Ayanamsha offset (approx 0.1° / 6 arcminutes greater than Lahiri)
  const kpAyanamshaOffset = 6 / 60; // 0.1 deg
  const kpAyanamshaValue = kundli.ayanamshaDegree + kpAyanamshaOffset;
  const kpAyanamshaDMS = formatDMS(kpAyanamshaValue);

  // 1. Calculate KP Planets
  const kpPlanets: KpPlanetRow[] = kundli.planets.map((p) => {
    // In KP coordinates (shifting by delta from Lahiri to KP)
    const kpLongitude = ((p.longitude - kpAyanamshaOffset % 360) + 360) % 360;
    const lords = getKpLordsForLongitude(kpLongitude);

    return {
      planet: p.planet,
      planetHindi: p.planetHindi,
      longitude: kpLongitude,
      formattedDegree: formatDMS(p.degreeInSign),
      rashi: lords.rashi,
      rashiLord: lords.rashiLord,
      nakshatra: lords.nakshatra,
      nakshatraLord: lords.starLord,
      subLord: lords.subLord,
      subSubLord: lords.subSubLord,
      house: p.house
    };
  });

  // 2. Calculate KP House Cusps (1 to 12)
  // Using Placidus / Equal Cusps aligned to Ascendant
  const ascDegree = kundli.lagnaDegree;
  const kpCusps: KpCuspRow[] = [];

  for (let h = 1; h <= 12; h++) {
    // Each house cusp (Placidus approximation from Ascendant)
    const cuspLongitude = ((ascDegree + (h - 1) * 30 - kpAyanamshaOffset % 360) + 360) % 360;
    const lords = getKpLordsForLongitude(cuspLongitude);

    kpCusps.push({
      house: h,
      cuspDegree: cuspLongitude,
      formattedDegree: formatDMS(cuspLongitude % 30),
      rashi: lords.rashi,
      rashiLord: lords.rashiLord,
      nakshatra: lords.nakshatra,
      nakshatraLord: lords.starLord,
      subLord: lords.subLord,
      subSubLord: lords.subSubLord
    });
  }

  // 3. 4-Fold Significators
  // Grade A: Planets in star of occupants
  // Grade B: Occupants of the house
  // Grade C: Planets in star of house lord
  // Grade D: House lord itself
  const significators: KpSignificatorGrade[] = [];

  for (let h = 1; h <= 12; h++) {
    const cusp = kpCusps[h - 1];
    const houseLord = cusp.rashiLord;

    // Occupants (Grade B)
    const occupants = kpPlanets.filter((p) => p.house === h).map((p) => p.planet);

    // Planets in star of occupants (Grade A)
    const gradeAPlanets: string[] = [];
    occupants.forEach((occ) => {
      kpPlanets.forEach((p) => {
        if (p.nakshatraLord === occ && !gradeAPlanets.includes(p.planet)) {
          gradeAPlanets.push(p.planet);
        }
      });
    });

    // Planets in star of house lord (Grade C)
    const gradeCPlanets = kpPlanets
      .filter((p) => p.nakshatraLord === houseLord)
      .map((p) => p.planet);

    significators.push({
      house: h,
      planetsGradeA: gradeAPlanets,
      planetsGradeB: occupants,
      planetsGradeC: gradeCPlanets,
      planetsGradeD: [houseLord]
    });
  }

  // 4. Ruling Planets (RP)
  const moonPlanet = kpPlanets.find((p) => p.planet === 'Moon') || kpPlanets[1];
  const ascLords = getKpLordsForLongitude(ascDegree);

  const rulingPlanets: RulingPlanets = {
    dayLord: dayLordName,
    moonSignLord: moonPlanet.rashiLord,
    moonStarLord: moonPlanet.nakshatraLord,
    ascendantSignLord: ascLords.rashiLord,
    ascendantStarLord: ascLords.starLord
  };

  return {
    ayanamshaName: 'KP (Krishnamurti New)',
    ayanamshaValue: kpAyanamshaValue,
    formattedAyanamsha: `${kpAyanamshaDMS} (KP New)`,
    planets: kpPlanets,
    cusps: kpCusps,
    significators,
    rulingPlanets
  };
}
