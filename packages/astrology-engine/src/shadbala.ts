import { KundliData, PlanetPosition, PlanetShadbala, ShadbalaResult } from '@vedic-astro/types';
import { normalize360 } from './ephemeris.js';

// Deep Exaltation & Debilitation Degrees in Zodiac
const DEBILITATION_POINTS: Record<string, number> = {
  Sun: 190.0,    // 10° Libra (Exalt: 10° Aries = 10°)
  Moon: 213.0,   // 3° Scorpio (Exalt: 3° Taurus = 33°)
  Mars: 118.0,   // 28° Cancer (Exalt: 28° Cap = 298°)
  Mercury: 345.0,// 15° Pisces (Exalt: 15° Virgo = 165°)
  Jupiter: 275.0,// 5° Capricorn (Exalt: 5° Cancer = 95°)
  Venus: 177.0,  // 27° Virgo (Exalt: 27° Pisces = 357°)
  Saturn: 20.0   // 20° Aries (Exalt: 20° Libra = 200°)
};

// Zero Digbala Points in Zodiac (Ascendant = 1st House, MC = 10th House)
// East (1st): Jup, Merc | South (10th): Sun, Mars | West (7th): Sat | North (4th): Moon, Ven
function getZeroDigbalaPoint(planet: string, lagnaDeg: number): number {
  switch (planet) {
    case 'Jupiter':
    case 'Mercury':
      return normalize360(lagnaDeg + 180); // 7th house is 0 Digbala
    case 'Sun':
    case 'Mars':
      return normalize360(lagnaDeg + 90);  // 4th house is 0 Digbala
    case 'Saturn':
      return normalize360(lagnaDeg);       // 1st house is 0 Digbala
    case 'Moon':
    case 'Venus':
      return normalize360(lagnaDeg + 270); // 10th house is 0 Digbala
    default:
      return 0;
  }
}

// Classical Minimum Requirements in Rupas (60 Virupas = 1 Rupa)
const MIN_RUPAS_REQUIRED: Record<string, number> = {
  Sun: 6.5,     // 390 Virupas
  Moon: 6.0,    // 360 Virupas
  Mars: 5.0,    // 300 Virupas
  Mercury: 7.0, // 420 Virupas
  Jupiter: 6.5, // 390 Virupas
  Venus: 5.5,   // 330 Virupas
  Saturn: 5.0   // 300 Virupas
};

// Classical Fixed Naisargika Bala (Natural Strength) in Virupas
const NAISARGIKA_BALA_VIRUPAS: Record<string, number> = {
  Sun: 60.0,
  Moon: 51.43,
  Venus: 42.86,
  Jupiter: 34.29,
  Mercury: 25.71,
  Mars: 17.14,
  Saturn: 8.57
};

export function calculateShadbala(kundli: KundliData, isDayBirth: boolean = true): ShadbalaResult {
  const classicalPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as const;
  const sun = kundli.planets.find((p) => p.planet === 'Sun')!;
  const moon = kundli.planets.find((p) => p.planet === 'Moon')!;

  const planetResults: PlanetShadbala[] = [];

  classicalPlanets.forEach((pName) => {
    const p = kundli.planets.find((item) => item.planet === pName);
    if (!p) return;

    // 1. STHANA BALA (स्थान बल - Positional Strength)
    // 1a. Uccha Bala (Max 60 Virupas)
    const debilPoint = DEBILITATION_POINTS[pName];
    let distFromDebil = Math.abs(p.longitude - debilPoint);
    if (distFromDebil > 180) distFromDebil = 360 - distFromDebil;
    const ucchaBala = distFromDebil / 3; // 0 to 60 Virupas

    // 1b. Kendradi Bala (Kendra: 60, Panaphara: 30, Apoklima: 15)
    let kendradiBala = 15;
    if ([1, 4, 7, 10].includes(p.house)) kendradiBala = 60;
    else if ([2, 5, 8, 11].includes(p.house)) kendradiBala = 30;

    // 1c. Ojhayugmarashi Bala (15 Virupas in favorable odd/even)
    const isOddSign = p.rashiIndex % 2 === 0; // Aries = 0 (Odd)
    let ojhaBala = 0;
    if (['Sun', 'Mars', 'Jupiter', 'Mercury'].includes(pName) && isOddSign) {
      ojhaBala = 15;
    } else if (['Moon', 'Venus'].includes(pName) && !isOddSign) {
      ojhaBala = 15;
    }

    // 1d. Saptavargiya Dignity Strength (Approx 45 to 135 Virupas)
    let saptaBala = 60;
    if (p.dignity === 'Exalted' || p.isMoolatrikona) saptaBala = 120;
    else if (p.dignity === 'Own Sign') saptaBala = 90;
    else if (p.dignity === 'Adhi Mitra' || p.dignity === 'Friendly Sign') saptaBala = 75;
    else if (p.dignity === 'Neutral') saptaBala = 45;
    else if (p.dignity === 'Enemy Sign' || p.dignity === 'Adhi Shatru') saptaBala = 25;
    else if (p.dignity === 'Debilitated') saptaBala = 10;

    // Total Sthana Bala
    const sthanaBala = Math.round((ucchaBala + kendradiBala + ojhaBala + saptaBala) * 10) / 10;

    // 2. DIG BALA (दिग्बल - Directional Strength)
    const zeroDigPoint = getZeroDigbalaPoint(pName, kundli.lagnaDegree);
    let distFromZeroDig = Math.abs(p.longitude - zeroDigPoint);
    if (distFromZeroDig > 180) distFromZeroDig = 360 - distFromZeroDig;
    const digBala = Math.round((distFromZeroDig / 3) * 10) / 10; // 0 to 60 Virupas

    // 3. KALA BALA (काल बल - Temporal Strength)
    // Natonnata Bala (Day vs Night)
    let natonnataBala = 30;
    if (isDayBirth) {
      if (['Sun', 'Jupiter', 'Venus'].includes(pName)) natonnataBala = 60;
      else if (['Moon', 'Mars', 'Saturn'].includes(pName)) natonnataBala = 15;
    } else {
      if (['Moon', 'Mars', 'Saturn'].includes(pName)) natonnataBala = 60;
      else if (['Sun', 'Jupiter', 'Venus'].includes(pName)) natonnataBala = 15;
    }

    // Paksha Bala (Moon phase strength)
    let moonSunDiff = moon.longitude - sun.longitude;
    if (moonSunDiff < 0) moonSunDiff += 360;
    const pakshaBala = (moonSunDiff / 360) * 60; // 0 to 60 Virupas
    const planetPaksha = ['Moon', 'Venus', 'Jupiter'].includes(pName) ? pakshaBala : (60 - pakshaBala);

    const kalaBala = Math.round((natonnataBala + planetPaksha + 30) * 10) / 10;

    // 4. CHESHTA BALA (चेष्टा बल - Motional Strength)
    let cheshtaBala = 30;
    if (p.isRetrograde) {
      cheshtaBala = 60; // Retrograde planets possess maximum Cheshta Bala
    } else if (pName === 'Sun' || pName === 'Moon') {
      cheshtaBala = Math.round(pakshaBala);
    } else {
      cheshtaBala = 25;
    }

    // 5. NAISARGIKA BALA (नैसर्गिक बल - Natural Inherent Strength)
    const naisargikaBala = NAISARGIKA_BALA_VIRUPAS[pName] || 30.0;

    // 6. DRIK BALA (दृग्बल - Aspectual Strength)
    // Benefics (Jup, Ven) aspecting adds strength, Malefics (Sat, Mars) subtracts
    let drikBala = 15.0;
    kundli.planets.forEach((other) => {
      if (other.planet === p.planet) return;
      let angle = Math.abs(other.longitude - p.longitude);
      if (angle > 180) angle = 360 - angle;

      // 7th house aspect (180°) or special aspects
      if (angle >= 170 && angle <= 190) {
        if (['Jupiter', 'Venus'].includes(other.planet)) drikBala += 15;
        if (['Saturn', 'Mars'].includes(other.planet)) drikBala -= 10;
      }
    });
    drikBala = Math.max(0, Math.round(drikBala * 10) / 10);

    // TOTAL SHADBALA
    const totalVirupas = Math.round((sthanaBala + digBala + kalaBala + cheshtaBala + naisargikaBala + drikBala) * 10) / 10;
    const totalRupas = Math.round((totalVirupas / 60) * 100) / 100;
    const minReqRupas = MIN_RUPAS_REQUIRED[pName];
    const strengthRatio = Math.round((totalRupas / minReqRupas) * 100) / 100;
    const strengthPercentage = Math.round(strengthRatio * 100);

    let status: PlanetShadbala['status'] = 'Madhyama (मध्यम)';
    if (strengthRatio >= 1.25) status = 'Ati Bali (अति बली)';
    else if (strengthRatio >= 1.0) status = 'Bali (बली)';
    else if (strengthRatio >= 0.8) status = 'Madhyama (मध्यम)';
    else status = 'Heena (हीन बली)';

    planetResults.push({
      planet: pName as any,
      planetHindi: p.planetHindi,
      sthanaBala,
      digBala,
      kalaBala,
      cheshtaBala,
      naisargikaBala,
      drikBala,
      totalVirupas,
      totalRupas,
      minimumRequirementRupas: minReqRupas,
      strengthRatio,
      strengthPercentage,
      rank: 1, // calculated after sorting
      status
    });
  });

  // Sort by strengthRatio descending to assign ranks
  planetResults.sort((a, b) => b.strengthRatio - a.strengthRatio);
  planetResults.forEach((p, idx) => {
    p.rank = idx + 1;
  });

  return {
    planets: planetResults,
    strongestPlanet: planetResults[0]?.planet || 'Sun',
    weakestPlanet: planetResults[planetResults.length - 1]?.planet || 'Saturn'
  };
}
