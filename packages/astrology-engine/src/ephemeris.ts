import { AyanamshaType, KundliData, PlanetPosition, HouseCusp, BhavaChalitChart, BhavaChalitCusp, DignityType } from '@vedic-astro/types';
import { RASHI_NAMES, RASHI_LORDS, NAKSHATRA_NAMES, NAKSHATRA_LORDS, PLANET_HINDI_NAMES } from '@vedic-astro/config';

// 1. Julian Day Number Calculation from UTC Date Parts
export function getJulianDay(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const dayFraction = (hour + minute / 60 + second / 3600) / 24;
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + dayFraction + B - 1524.5;
}

// 2. Lahiri Ayanamsha Formula (Standard Chitra-Paksha Lahiri)
export function getLahiriAyanamsha(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0; // Julian Centuries from J2000.0
  const ayanamshaSeconds = 85885.53 + 5029.0966 * t + 1.11 * t * t;
  return ayanamshaSeconds / 3600.0;
}

// Helper to normalize degrees into 0..360 range
export function normalize360(deg: number): number {
  let res = deg % 360;
  if (res < 0) res += 360;
  return res;
}

// Helper to normalize angle difference into -180..180 range
export function normalize180(deg: number): number {
  let res = normalize360(deg);
  if (res > 180) res -= 360;
  return res;
}

// Raw Single-Point Ephemeris Calculation for Velocity / Retrograde Evaluation
function calculateRawPlanetsAtJD(jd: number) {
  const T = (jd - 2451545.0) / 36525.0;
  const rad = Math.PI / 180;

  const sunL0 = 280.46646 + 36000.76983 * T;
  const sunM = (357.52911 + 35999.05029 * T) * rad;
  const sunC = (1.914602 - 0.004817 * T) * Math.sin(sunM) + (0.019993 - 0.000101 * T) * Math.sin(2 * sunM) + 0.000289 * Math.sin(3 * sunM);
  const sunTrop = normalize360(sunL0 + sunC);

  const moonL = 218.3164477 + 481267.88123421 * T;
  const moonM = (134.9634025 + 477198.8675055 * T) * rad;
  const moonD = (297.8501921 + 445267.1114034 * T) * rad;
  const moonF = (93.2720950 + 483202.0175273 * T) * rad;
  const moonDL = 6.288774 * Math.sin(moonM)
    + 1.274027 * Math.sin(2 * moonD - moonM)
    + 0.658314 * Math.sin(2 * moonD)
    + 0.213618 * Math.sin(2 * moonM)
    - 0.185116 * Math.sin(sunM)
    - 0.114332 * Math.sin(2 * moonF)
    + 0.058793 * Math.sin(2 * moonD - 2 * moonM)
    + 0.057066 * Math.sin(2 * moonD - sunM - moonM)
    + 0.053322 * Math.sin(2 * moonD + moonM)
    + 0.046193 * Math.sin(2 * moonD - sunM)
    - 0.034718 * Math.sin(moonD)
    - 0.030465 * Math.sin(sunM + moonM)
    + 0.015327 * Math.sin(2 * moonD - 2 * moonF)
    - 0.012528 * Math.sin(2 * moonM + sunM)
    - 0.010980 * Math.sin(2 * moonM - sunM)
    + 0.005279 * Math.sin(2 * moonD - sunM - 2 * moonF)
    - 0.004928 * Math.sin(moonM - 2 * moonD)
    + 0.003996 * Math.sin(sunM - moonM)
    + 0.003861 * Math.sin(4 * moonD - moonM)
    + 0.003665 * Math.sin(2 * moonD - 2 * moonM - sunM);
  const moonTrop = normalize360(moonL + moonDL);

  const sunDist = 1.000001018 * (1 - 0.0167086 * Math.cos(sunM));
  const earthHelioL = (sunTrop + 180) * rad;
  const Xe = sunDist * Math.cos(earthHelioL);
  const Ye = sunDist * Math.sin(earthHelioL);

  function solveKeplerian(a: number, e: number, L0: number, Ldot: number, p0: number, pdot: number): number {
    const L = (L0 + Ldot * T) % 360;
    const peri = (p0 + pdot * T) % 360;
    let M = (L - peri) % 360;
    if (M < 0) M += 360;
    const Mrad = M * rad;

    let E = Mrad;
    for (let i = 0; i < 10; i++) {
      E = E - (E - e * Math.sin(E) - Mrad) / (1 - e * Math.cos(E));
    }
    const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
    const r = a * (1 - e * Math.cos(E));
    const lHelio = (peri * rad + nu) % (2 * Math.PI);

    const Xp = r * Math.cos(lHelio);
    const Yp = r * Math.sin(lHelio);

    let geoRad = Math.atan2(Yp - Ye, Xp - Xe);
    let geoDeg = (geoRad * 180 / Math.PI) % 360;
    if (geoDeg < 0) geoDeg += 360;
    return geoDeg;
  }

  const mercMeanL = (252.2509 + 149472.6746 * T) * rad;
  const venMeanL = (181.9797 + 58517.8156 * T) * rad;
  const mercPert = 0.035 * Math.sin(2 * mercMeanL - 5 * venMeanL);
  const mercTrop = normalize360(solveKeplerian(0.38709927, 0.20563593 + 0.0000204 * T, 252.25084, 149472.67411, 77.45645, 1.55648) + mercPert);
  const venTrop = solveKeplerian(0.72333566, 0.00677672, 181.97973, 58517.81560, 131.57152, 1.40222);
  const marsTrop = solveKeplerian(1.52366231, 0.09341233, 355.45332, 19140.29930, 336.08032, 1.84105);
  const jupMeanL = (34.35148 + 3034.90567 * T) * rad;
  const satMeanL = (50.07747 + 1222.11379 * T) * rad;
  const satPert = 0.23 * Math.sin(2 * jupMeanL - satMeanL);
  const jupTrop = solveKeplerian(5.202603, 0.048498, 34.35148, 3034.90567, 14.33148, 1.61263);
  const satTrop = normalize360(solveKeplerian(9.554909, 0.055546, 50.07747, 1222.11379, 93.05747, 1.96376) + satPert);

  const rahuTrop = normalize360(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
  const ketuTrop = normalize360(rahuTrop + 180.0);

  const uranusTrop = solveKeplerian(19.2184, 0.0463, 314.055, 428.467, 173.0, 1.48);
  const neptuneTrop = solveKeplerian(30.1104, 0.00946, 304.349, 218.486, 48.1, 1.4);
  const plutoTrop = solveKeplerian(39.482, 0.2488, 238.860, 145.180, 224.0, 1.4);

  return {
    Sun: sunTrop,
    Moon: moonTrop,
    Mars: marsTrop,
    Mercury: mercTrop,
    Jupiter: jupTrop,
    Venus: venTrop,
    Saturn: satTrop,
    Rahu: rahuTrop,
    Ketu: ketuTrop,
    Uranus: uranusTrop,
    Neptune: neptuneTrop,
    Pluto: plutoTrop,
  };
}

// 4. Classical Combustion (अस्त) Thresholds
const COMBUSTION_LIMITS: Record<string, { direct: number; retro: number }> = {
  Moon: { direct: 12.0, retro: 12.0 },
  Mars: { direct: 17.0, retro: 17.0 },
  Mercury: { direct: 14.0, retro: 12.0 },
  Jupiter: { direct: 11.0, retro: 11.0 },
  Venus: { direct: 10.0, retro: 8.0 },
  Saturn: { direct: 15.0, retro: 15.0 }
};

function checkCombustion(planet: string, planetLong: number, isRetrograde: boolean, sunLong: number): { isCombust: boolean; separation: number } {
  const limits = COMBUSTION_LIMITS[planet];
  if (!limits) return { isCombust: false, separation: 180 };

  const separation = Math.abs(normalize180(planetLong - sunLong));
  const limit = isRetrograde ? limits.retro : limits.direct;
  return {
    isCombust: separation <= limit,
    separation: Math.round(separation * 100) / 100
  };
}

// 5. Moolatrikona Check (मूलत्रिकोण विचार)
function checkMoolatrikona(planet: string, rashiIdx: number, degInSign: number): boolean {
  if (planet === 'Sun' && rashiIdx === 4 && degInSign >= 0 && degInSign <= 20) return true;
  if (planet === 'Moon' && rashiIdx === 1 && degInSign >= 3 && degInSign <= 30) return true;
  if (planet === 'Mars' && rashiIdx === 0 && degInSign >= 0 && degInSign <= 12) return true;
  if (planet === 'Mercury' && rashiIdx === 5 && degInSign >= 15 && degInSign <= 20) return true;
  if (planet === 'Jupiter' && rashiIdx === 8 && degInSign >= 0 && degInSign <= 10) return true;
  if (planet === 'Venus' && rashiIdx === 6 && degInSign >= 0 && degInSign <= 15) return true;
  if (planet === 'Saturn' && rashiIdx === 10 && degInSign >= 0 && degInSign <= 20) return true;
  return false;
}

// 6. Classical Natural (Naisargika) Friendship
const NAISARGIKA_RELATIONS: Record<string, { friends: string[]; enemies: string[] }> = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn'] },
  Moon: { friends: ['Sun', 'Mercury'], enemies: [] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury'] },
  Mercury: { friends: ['Sun', 'Venus'], enemies: ['Moon'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'] },
  Venus: { friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'] },
  Saturn: { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'] },
};

// 7. Dynamic Panchadha Maitri (Compound Friendship) Evaluator
function evaluatePanchadhaMaitri(planet: string, dispositor: string, planetRashiIdx: number, dispositorRashiIdx: number): 'Adhi Mitra' | 'Mitra' | 'Sama' | 'Shatru' | 'Adhi Shatru' {
  if (planet === dispositor) return 'Mitra';

  // Naisargika (Natural) score: Friend (+1), Enemy (-1), Neutral (0)
  const rel = NAISARGIKA_RELATIONS[planet];
  let naturalScore = 0;
  if (rel?.friends.includes(dispositor)) naturalScore = 1;
  else if (rel?.enemies.includes(dispositor)) naturalScore = -1;

  // Tatkalika (Temporal) score:
  // Dispositor in 2, 3, 4, 10, 11, 12 from planet -> Friend (+1)
  // in 1, 5, 6, 7, 8, 9 -> Enemy (-1)
  const houseDiff = ((dispositorRashiIdx - planetRashiIdx + 12) % 12) + 1;
  const temporalScore = [2, 3, 4, 10, 11, 12].includes(houseDiff) ? 1 : -1;

  const totalScore = naturalScore + temporalScore;
  if (totalScore >= 2) return 'Adhi Mitra';
  if (totalScore === 1) return 'Mitra';
  if (totalScore === 0) return 'Sama';
  if (totalScore === -1) return 'Shatru';
  return 'Adhi Shatru';
}

// 8. Classical Graha Maitri Dignity Evaluator
function evaluateVedicDignity(planet: string, rashiIdx: number, degInSign: number, panchadha: string): DignityType {
  const exaltMap: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 1, Ketu: 7 };
  const debilMap: Record<string, number> = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0, Rahu: 7, Ketu: 1 };
  
  if (exaltMap[planet] === rashiIdx) return 'Exalted';
  if (debilMap[planet] === rashiIdx) return 'Debilitated';

  if (checkMoolatrikona(planet, rashiIdx, degInSign)) return 'Moolatrikona';

  const ownSignsMap: Record<string, number[]> = {
    Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
    Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10], Rahu: [2, 10], Ketu: [8, 11]
  };
  if (ownSignsMap[planet]?.includes(rashiIdx)) return 'Own Sign';

  if (panchadha === 'Adhi Mitra') return 'Adhi Mitra';
  if (panchadha === 'Mitra') return 'Friendly Sign';
  if (panchadha === 'Shatru') return 'Enemy Sign';
  if (panchadha === 'Adhi Shatru') return 'Adhi Shatru';

  return 'Neutral';
}

// 9. Planetary Ephemeris Calculations with Combustion & Panchadha Maitri
export function calculatePlanetaryPositions(jd: number, ayanamshaDeg: number): PlanetPosition[] {
  const pCurrent = calculateRawPlanetsAtJD(jd);
  const pNext = calculateRawPlanetsAtJD(jd + 0.05);

  const planetsList = Object.keys(pCurrent) as (keyof typeof pCurrent)[];
  const sunSidereal = normalize360(pCurrent.Sun - ayanamshaDeg);

  // First pass: resolve basic longitudes and rashi indexes
  const initialData = planetsList.map((pName) => {
    const tropCurrent = pCurrent[pName];
    const tropNext = pNext[pName];

    let sidereal = normalize360(tropCurrent - ayanamshaDeg);
    const rashiIdx = Math.floor(sidereal / 30);
    const degreeInSign = sidereal % 30;

    const totalArcSec = sidereal * 3600;
    const nakshatraArcSec = (360 * 3600) / 27; // 13°20' = 48000 arcsec
    const nakIdx = Math.floor(totalArcSec / nakshatraArcSec);
    const pada = Math.floor((totalArcSec % nakshatraArcSec) / ((13.333333 / 4) * 3600)) + 1;

    const apparentVelocity = normalize180(tropNext - tropCurrent);
    let isRetrograde = apparentVelocity < 0;
    if (pName === 'Rahu' || pName === 'Ketu') isRetrograde = true;

    return {
      planet: pName,
      sidereal,
      degreeInSign,
      rashiIdx,
      nakIdx,
      pada,
      isRetrograde
    };
  });

  // Map of planet name to rashi index for dispositor lookup
  const rashiMap: Record<string, number> = {};
  initialData.forEach((d) => {
    rashiMap[d.planet] = d.rashiIdx;
  });

  return initialData.map((d) => {
    const pName = d.planet;
    const rLord = RASHI_LORDS[d.rashiIdx];
    const dispositorRashiIdx = rashiMap[rLord] !== undefined ? rashiMap[rLord] : d.rashiIdx;

    // Dynamic Panchadha Maitri
    const panchadha = evaluatePanchadhaMaitri(pName, rLord, d.rashiIdx, dispositorRashiIdx);

    // Moolatrikona check
    const isMoolatrikona = checkMoolatrikona(pName, d.rashiIdx, d.degreeInSign);

    // Dignity evaluation
    const dignity = evaluateVedicDignity(pName, d.rashiIdx, d.degreeInSign, panchadha);

    // Combustion check
    const combustion = checkCombustion(pName, d.sidereal, d.isRetrograde, sunSidereal);

    return {
      planet: pName as any,
      planetHindi: PLANET_HINDI_NAMES[pName] || pName,
      longitude: d.sidereal,
      degreeInSign: d.degreeInSign,
      rashiIndex: d.rashiIdx,
      rashiName: RASHI_NAMES[d.rashiIdx],
      house: 1, // Will be mapped relative to Ascendant Lagna
      nakshatraIndex: d.nakIdx,
      nakshatraName: NAKSHATRA_NAMES[d.nakIdx],
      nakshatraLord: NAKSHATRA_LORDS[d.nakIdx],
      pada: Math.min(Math.max(d.pada, 1), 4),
      rashiLord: rLord,
      isCombust: combustion.isCombust,
      combustionDegrees: combustion.separation,
      isMoolatrikona,
      isRetrograde: d.isRetrograde,
      dignity,
      panchadhaMaitri: panchadha
    };
  });
}

// 10. Dynamic House Cusps & Sidereal Ascendant (Lagna) Math
export function calculateAscendantAndHouses(jd: number, lat: number, lng: number, ayanamshaDeg: number): {
  lagnaDegree: number;
  lagnaRashiIndex: number;
  lagnaRashiName: string;
  midheavenDegree: number;
  houses: HouseCusp[];
} {
  const d = jd - 2451545.0;

  // Greenwich Mean Sidereal Time (GMST)
  const gmst = normalize360(280.46061837 + 360.98564736629 * d);
  const lst = normalize360(gmst + lng);

  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;
  const eps = 23.4392911 * rad; // Obliquity of Ecliptic
  const lstRad = lst * rad;
  const latRad = lat * rad;

  // Ascendant Formula: tan(Lagna_Tropical) = cos(LST) / (-sin(Obliquity)*tan(Lat) - cos(Obliquity)*sin(LST))
  const y = Math.cos(lstRad);
  const x = -Math.sin(eps) * Math.tan(latRad) - Math.cos(eps) * Math.sin(lstRad);
  let lagnaTrop = deg * Math.atan2(y, x);
  lagnaTrop = normalize360(lagnaTrop);

  const lagnaSidereal = normalize360(lagnaTrop - ayanamshaDeg);
  const lagnaRashiIdx = Math.floor(lagnaSidereal / 30);

  // Midheaven (MC / 10th cusp)
  const yMc = Math.sin(lstRad);
  const xMc = Math.cos(lstRad) * Math.cos(eps);
  let mcTrop = deg * Math.atan2(yMc, xMc);
  mcTrop = normalize360(mcTrop);
  const mcSidereal = normalize360(mcTrop - ayanamshaDeg);

  const houses: HouseCusp[] = [];
  for (let h = 1; h <= 12; h++) {
    const cuspSidereal = normalize360(lagnaSidereal + (h - 1) * 30);
    const rIdx = Math.floor(cuspSidereal / 30);
    houses.push({
      houseNumber: h,
      longitude: cuspSidereal,
      rashiIndex: rIdx,
      rashiName: RASHI_NAMES[rIdx],
      rashiLord: RASHI_LORDS[rIdx]
    });
  }

  return {
    lagnaDegree: lagnaSidereal,
    lagnaRashiIndex: lagnaRashiIdx,
    lagnaRashiName: RASHI_NAMES[lagnaRashiIdx],
    midheavenDegree: mcSidereal,
    houses
  };
}

// Helper to format degree into DD° MM' Rashi format
function formatDegreeToRashi(deg: number): string {
  const norm = normalize360(deg);
  const rIdx = Math.floor(norm / 30);
  const rem = norm % 30;
  const d = Math.floor(rem);
  const m = Math.floor((rem - d) * 60);
  return `${d}° ${m < 10 ? '0' + m : m}' ${RASHI_NAMES[rIdx]}`;
}

// 11. Classical Sripati Bhava Chalit Chart Calculator
export function calculateSripatiBhavaChalit(
  lagnaDegree: number,
  mcDegree: number,
  planets: PlanetPosition[]
): BhavaChalitChart {
  const bhavaMadhyas = new Array(12).fill(0);

  // 10th House Madhya = MC
  bhavaMadhyas[9] = mcDegree;
  // 4th House Madhya = MC + 180°
  bhavaMadhyas[3] = normalize360(mcDegree + 180);
  // 1st House Madhya = Lagna
  bhavaMadhyas[0] = lagnaDegree;
  // 7th House Madhya = Lagna + 180°
  bhavaMadhyas[6] = normalize360(lagnaDegree + 180);

  // Quadrant 1: 10th to 1st (Houses 10, 11, 12, 1)
  const span1 = normalize360(lagnaDegree - mcDegree);
  const d1 = span1 / 3;
  bhavaMadhyas[10] = normalize360(mcDegree + d1);      // 11th Madhya
  bhavaMadhyas[11] = normalize360(mcDegree + 2 * d1);  // 12th Madhya

  // Quadrant 2: 1st to 4th (Houses 1, 2, 3, 4)
  const span2 = normalize360(bhavaMadhyas[3] - lagnaDegree);
  const d2 = span2 / 3;
  bhavaMadhyas[1] = normalize360(lagnaDegree + d2);     // 2nd Madhya
  bhavaMadhyas[2] = normalize360(lagnaDegree + 2 * d2); // 3rd Madhya

  // Quadrant 3 & 4 (Opposite halves + 180°)
  bhavaMadhyas[4] = normalize360(bhavaMadhyas[10] + 180); // 5th Madhya
  bhavaMadhyas[5] = normalize360(bhavaMadhyas[11] + 180); // 6th Madhya
  bhavaMadhyas[7] = normalize360(bhavaMadhyas[1] + 180);  // 8th Madhya
  bhavaMadhyas[8] = normalize360(bhavaMadhyas[2] + 180);  // 9th Madhya

  // Compute Bhava Sandhis (Midpoints between consecutive Madhyas)
  const bhavaSandhis = new Array(12).fill(0);
  for (let h = 0; h < 12; h++) {
    const nextH = (h + 1) % 12;
    const diff = normalize360(bhavaMadhyas[nextH] - bhavaMadhyas[h]);
    bhavaSandhis[h] = normalize360(bhavaMadhyas[h] + diff / 2);
  }

  // Determine planet placements in Bhava Chalit
  const houseOccupants: string[][] = Array.from({ length: 12 }, () => []);

  planets.forEach((p) => {
    // Planet is in house H if it falls between Sandhi(H-1) and Sandhi(H)
    for (let h = 0; h < 12; h++) {
      const prevSandhi = bhavaSandhis[(h + 11) % 12];
      const curSandhi = bhavaSandhis[h];
      const span = normalize360(curSandhi - prevSandhi);
      const dist = normalize360(p.longitude - prevSandhi);

      if (dist < span) {
        p.bhavaChalitHouse = h + 1;
        houseOccupants[h].push(p.planet);
        break;
      }
    }
  });

  const cusps: BhavaChalitCusp[] = [];
  for (let h = 0; h < 12; h++) {
    const madhya = bhavaMadhyas[h];
    const sandhi = bhavaSandhis[h];
    const rIdx = Math.floor(madhya / 30);
    cusps.push({
      houseNumber: h + 1,
      bhavaMadhyaDegree: madhya,
      bhavaMadhyaFormatted: formatDegreeToRashi(madhya),
      bhavaSandhiDegree: sandhi,
      bhavaSandhiFormatted: formatDegreeToRashi(sandhi),
      rashiIndex: rIdx,
      rashiName: RASHI_NAMES[rIdx],
      rashiLord: RASHI_LORDS[rIdx],
      occupants: houseOccupants[h]
    });
  }

  return {
    method: 'Sripati',
    midheavenDegree: mcDegree,
    ascendantDegree: lagnaDegree,
    houses: cusps
  };
}

// 12. Complete Kundli Calculation Pipeline
export function calculateKundli(dateIso: string, timeIso: string, lat: number, lng: number, timezone: string = 'Asia/Kolkata', ayanamsha: AyanamshaType = 'LAHIRI'): KundliData {
  const [year, month, day] = dateIso.split('-').map(Number);
  const [hour, minute, second = 0] = timeIso.split(':').map(Number);

  let tzOffsetHours = 5.5; // Default Asia/Kolkata (+05:30)
  if (timezone === 'UTC') tzOffsetHours = 0;

  const utcHour = hour - tzOffsetHours;

  const jd = getJulianDay(year, month, day, utcHour, minute, second);
  const ayanamshaDeg = getLahiriAyanamsha(jd);

  const rawPlanets = calculatePlanetaryPositions(jd, ayanamshaDeg);
  const ascData = calculateAscendantAndHouses(jd, lat, lng, ayanamshaDeg);

  // Map Planets into Houses based on Ascendant Lagna Rashi
  const planets: PlanetPosition[] = rawPlanets.map((p) => {
    let house = ((p.rashiIndex - ascData.lagnaRashiIndex + 12) % 12) + 1;
    return {
      ...p,
      house
    };
  });

  // Calculate Sripati Bhava Chalit Chart and map Chalit houses into planets
  calculateSripatiBhavaChalit(ascData.lagnaDegree, ascData.midheavenDegree, planets);

  const moon = planets.find((p) => p.planet === 'Moon')!;

  return {
    engineVersion: '2.0.0',
    calculatedAt: new Date().toISOString(),
    ayanamsha: 'LAHIRI',
    ayanamshaDegree: ayanamshaDeg,
    lagnaDegree: ascData.lagnaDegree,
    lagnaRashiIndex: ascData.lagnaRashiIndex,
    lagnaRashi: ascData.lagnaRashiName,
    moonRashi: moon.rashiName,
    moonNakshatra: moon.nakshatraName,
    moonPada: moon.pada,
    planets,
    houses: ascData.houses
  };
}
