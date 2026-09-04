import { AyanamshaType, KundliData, PlanetPosition, HouseCusp } from '@vedic-astro/types';
import { RASHI_NAMES, RASHI_LORDS, NAKSHATRA_NAMES, NAKSHATRA_LORDS, PLANET_HINDI_NAMES, ENGINE_VERSION } from '@vedic-astro/config';

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
  const ayanamshaSeconds = 86291.134 + 5028.796195 * t + 1.1054348 * t * t;
  return ayanamshaSeconds / 3600.0;
}

// Helper to normalize degrees into 0..360 range
export function normalize360(deg: number): number {
  let res = deg % 360;
  if (res < 0) res += 360;
  return res;
}

// Helper to normalize angle difference into -180..180 range
function normalize180(deg: number): number {
  let res = normalize360(deg);
  if (res > 180) res -= 360;
  return res;
}

// 3. Universal Geocentric Transformation Helper (Heliocentric to Geocentric dynamic vector math)
function helioToGeo(helioLongDeg: number, helioDistAU: number, earthLongDeg: number, earthDistAU: number = 1.0): number {
  const rad = Math.PI / 180;
  const hp = helioLongDeg * rad;
  const he = earthLongDeg * rad;

  const xp = helioDistAU * Math.cos(hp) - earthDistAU * Math.cos(he);
  const yp = helioDistAU * Math.sin(hp) - earthDistAU * Math.sin(he);

  let geoRad = Math.atan2(yp, xp);
  let geoDeg = (geoRad * 180 / Math.PI) % 360;
  if (geoDeg < 0) geoDeg += 360;
  return geoDeg;
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
  const moonDL = 6.288774 * Math.sin(moonM) + 1.274027 * Math.sin(2 * moonD - moonM) + 0.658314 * Math.sin(2 * moonD) + 0.213618 * Math.sin(2 * moonM) - 0.185116 * Math.sin(sunM) - 0.114332 * Math.sin(2 * moonF);
  const moonTrop = normalize360(moonL + moonDL);

  const mercL = 252.25084 + 149472.67411 * T;
  const mercM = (174.79472 + 149472.67411 * T - 77.45645) * rad;
  const mercHelio = mercL + 23.440 * Math.sin(mercM) + 2.981 * Math.sin(2 * mercM) + 0.526 * Math.sin(3 * mercM);
  const mercTrop = helioToGeo(mercHelio, 0.387, sunTrop + 180, 1.0);

  const venL = 181.97973 + 58517.81560 * T;
  const venM = (50.40821 + 58517.81560 * T - 131.57152) * rad;
  const venHelio = venL + 0.776 * Math.sin(venM) + 0.003 * Math.sin(2 * venM);
  const venTrop = helioToGeo(venHelio, 0.723, sunTrop + 180, 1.0);

  const marsL = 355.45332 + 19140.29930 * T;
  const marsM = (19.37300 + 19140.29930 * T - 336.08032) * rad;
  const marsHelio = marsL + 10.691 * Math.sin(marsM) + 0.623 * Math.sin(2 * marsM) + 0.050 * Math.sin(3 * marsM);
  const marsTrop = helioToGeo(marsHelio, 1.524, sunTrop + 180, 1.0);

  const jupL = 34.35148 + 3034.90567 * T;
  const jupM = (19.98800 + 3034.90567 * T - 14.33148) * rad;
  const jupHelio = jupL + 5.555 * Math.sin(jupM) + 0.168 * Math.sin(2 * jupM);
  const jupTrop = helioToGeo(jupHelio, 5.203, sunTrop + 180, 1.0);

  const satL = 50.07747 + 1222.11379 * T;
  const satM = (317.02000 + 1222.11379 * T - 93.05747) * rad;
  const satHelio = satL + 6.358 * Math.sin(satM) + 0.220 * Math.sin(2 * satM);
  const satTrop = helioToGeo(satHelio, 9.537, sunTrop + 180, 1.0);

  const rahuTrop = normalize360(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
  const ketuTrop = normalize360(rahuTrop + 180.0);

  const uranusTrop = normalize360(314.055 + 428.486 * T);
  const neptuneTrop = normalize360(304.349 + 218.486 * T);
  const plutoTrop = normalize360(238.860 + 145.180 * T);

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

// 4. Traditional Classical Graha Maitri Dignity Evaluator
function evaluateVedicDignity(planet: string, rashiIdx: number): 'Exalted' | 'Debilitated' | 'Own' | 'Friend' | 'Neutral' | 'Enemy' {
  // Exaltation (उच्च) and Debilitation (नीच) Signs
  const exaltMap: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 1, Ketu: 7 };
  const debilMap: Record<string, number> = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0, Rahu: 7, Ketu: 1 };
  
  if (exaltMap[planet] === rashiIdx) return 'Exalted';
  if (debilMap[planet] === rashiIdx) return 'Debilitated';

  // Own Signs (स्वगृही)
  const ownSignsMap: Record<string, number[]> = {
    Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
    Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10], Rahu: [2, 10], Ketu: [8, 11]
  };
  if (ownSignsMap[planet]?.includes(rashiIdx)) return 'Own';

  // Friendly Signs (मित्र राशि)
  const friendSignsMap: Record<string, number[]> = {
    Sun: [0, 3, 8, 11], // Aries, Cancer, Sag, Pisces
    Moon: [0, 2, 4, 5], // Aries, Gemini, Leo, Virgo
    Mars: [3, 4, 8, 11], // Cancer, Leo, Sag, Pisces
    Mercury: [1, 4, 6, 9, 10], // Taurus, Leo, Libra, Cap, Aqua
    Jupiter: [0, 3, 4, 7], // Aries, Cancer, Leo, Scorpio
    Venus: [2, 5, 9, 10], // Gemini, Virgo, Capricorn, Aquarius
    Saturn: [1, 2, 5, 6], // Taurus, Gemini, Virgo, Libra
    Rahu: [1, 5, 6, 9], Ketu: [0, 3, 4, 9]
  };
  if (friendSignsMap[planet]?.includes(rashiIdx)) return 'Friend';

  // Enemy Signs (शत्रु राशि)
  const enemySignsMap: Record<string, number[]> = {
    Sun: [1, 2, 5, 6, 9, 10], // Venus/Saturn signs
    Moon: [9, 10],
    Mars: [2, 5, 6, 9, 10],
    Mercury: [3],
    Jupiter: [2, 5, 6], // Gemini/Virgo (Mercury's signs)
    Venus: [3, 4],
    Saturn: [3, 4], // Cancer, Leo (Moon, Sun signs)
    Rahu: [3, 4], Ketu: [1, 6]
  };
  if (enemySignsMap[planet]?.includes(rashiIdx)) return 'Enemy';

  return 'Neutral';
}

// 5. Universal Planetary Ephemeris Calculations with Dynamic Retrograde Velocity Check
export function calculatePlanetaryPositions(jd: number, ayanamshaDeg: number): PlanetPosition[] {
  const pCurrent = calculateRawPlanetsAtJD(jd);
  const pNext = calculateRawPlanetsAtJD(jd + 0.05); // 0.05 days delta for apparent orbital velocity

  const planetsList = Object.keys(pCurrent) as (keyof typeof pCurrent)[];

  return planetsList.map((pName) => {
    const tropCurrent = pCurrent[pName];
    const tropNext = pNext[pName];

    let sidereal = normalize360(tropCurrent - ayanamshaDeg);
    const rashiIdx = Math.floor(sidereal / 30);
    const degreeInSign = sidereal % 30;

    const totalArcSec = sidereal * 3600;
    const nakshatraArcSec = (360 * 3600) / 27; // 13°20' = 48000 arcsec
    const nakIdx = Math.floor(totalArcSec / nakshatraArcSec);
    const pada = Math.floor((totalArcSec % nakshatraArcSec) / ((13.333333 / 4) * 3600)) + 1;

    // Dynamic Velocity-Based Retrograde Check
    const apparentVelocity = normalize180(tropNext - tropCurrent);
    let isRetrograde = apparentVelocity < 0;
    if (pName === 'Rahu' || pName === 'Ketu') isRetrograde = true;

    // Traditional Graha Maitri Dignity Evaluation
    const dignity = evaluateVedicDignity(pName, rashiIdx);

    return {
      planet: pName as any,
      planetHindi: PLANET_HINDI_NAMES[pName] || pName,
      longitude: sidereal,
      degreeInSign,
      rashiIndex: rashiIdx,
      rashiName: RASHI_NAMES[rashiIdx],
      house: 1, // Will be mapped relative to Ascendant Lagna
      nakshatraIndex: nakIdx,
      nakshatraName: NAKSHATRA_NAMES[nakIdx],
      nakshatraLord: NAKSHATRA_LORDS[nakIdx],
      pada: Math.min(Math.max(pada, 1), 4),
      isRetrograde,
      dignity
    };
  });
}

// 6. Dynamic House Cusps & Sidereal Ascendant (Lagna) Math
export function calculateAscendantAndHouses(jd: number, lat: number, lng: number, ayanamshaDeg: number): { lagnaDegree: number; lagnaRashiIndex: number; lagnaRashiName: string; houses: HouseCusp[] } {
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

  const houses: HouseCusp[] = [];
  for (let h = 1; h <= 12; h++) {
    const cuspSidereal = normalize360(lagnaSidereal + (h - 1) * 30);
    const rIdx = Math.floor(cuspSidereal / 30);
    houses.push({
      houseNumber: h,
      degree: cuspSidereal,
      rashiIndex: rIdx,
      rashiName: RASHI_NAMES[rIdx]
    });
  }

  return {
    lagnaDegree: lagnaSidereal,
    lagnaRashiIndex: lagnaRashiIdx,
    lagnaRashiName: RASHI_NAMES[lagnaRashiIdx],
    houses
  };
}

// 7. Complete Kundli Calculation Pipeline
export function calculateKundli(dateIso: string, timeIso: string, lat: number, lng: number, timezone: string = 'Asia/Kolkata', ayanamsha: AyanamshaType = 'LAHIRI'): KundliData {
  const [year, month, day] = dateIso.split('-').map(Number);
  const [hour, minute, second = 0] = timeIso.split(':').map(Number);

  // Timezone Offset Calculation in Hours
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

  const moon = planets.find((p) => p.planet === 'Moon')!;

  return {
    julianDay: jd,
    ayanamsha: 'LAHIRI',
    ayanamshaDegree: ayanamshaDeg,
    lagnaDegree: ascData.lagnaDegree,
    lagnaRashiIndex: ascData.lagnaRashiIndex,
    lagnaRashi: ascData.lagnaRashiName,
    moonRashi: moon.rashiName,
    planets,
    houses: ascData.houses
  };
}
