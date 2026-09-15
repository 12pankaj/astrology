import { KundliData, PlanetPosition } from '@vedic-astro/types';

export interface BhinnaAshtakavarga {
  planet: string;
  pointsPerRashi: number[]; // 12 values (0-8) for Rashis 1..12
  totalPoints: number;
}

export interface AshtakavargaResult {
  bhinnaAshtakavarga: BhinnaAshtakavarga[];
  sarvashtakavarga: number[]; // 12 values for Rashis 1..12 (sum of 7 BAVs)
  totalSarvashtakavargaPoints: number; // 337 points total
  houseStrengths: {
    house: number;
    rashiName: string;
    points: number;
    status: 'Strong (अति शुभ - 28+)' | 'Average (मध्यम - 25-27)' | 'Challenging (संघर्ष कारक - <25)';
    guidance: string;
  }[];
}

// Canonical Parashari BPHS Ashtakavarga Rules Matrix
// Exact point distribution per planet totaling 337 points across Sarvashtakavarga:
// Sun (48) + Moon (49) + Mars (39) + Mercury (54) + Jupiter (56) + Venus (52) + Saturn (40) = 337 Pts
const ASHTAKAVARGA_RULES: Record<string, Record<string, number[]>> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],       // 8
    Moon: [3, 6, 10, 11],                  // 4
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],       // 8
    Mercury: [3, 5, 6, 9, 10, 11, 12],      // 7
    Jupiter: [5, 6, 9, 11],                // 4
    Venus: [6, 7, 12],                     // 3
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],      // 8
    Lagna: [3, 4, 6, 10, 11, 12]           // 6 (Total: 48)
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],             // 6
    Moon: [1, 3, 6, 7, 10, 11],            // 6
    Mars: [2, 3, 5, 6, 9, 10, 11],         // 7
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],   // 8
    Jupiter: [1, 4, 7, 8, 10, 11, 12],     // 7
    Venus: [3, 4, 5, 7, 9, 10, 11],        // 7
    Saturn: [3, 5, 6, 11],                 // 4
    Lagna: [3, 6, 10, 11]                  // 4 (Total: 49)
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11],                // 5
    Moon: [3, 6, 11],                      // 3
    Mars: [1, 2, 4, 7, 8, 10, 11],         // 7
    Mercury: [3, 5, 6, 11],                // 4
    Jupiter: [6, 10, 11, 12],              // 4
    Venus: [6, 8, 11, 12],                 // 4
    Saturn: [1, 4, 7, 8, 9, 10, 11],       // 7
    Lagna: [1, 3, 6, 10, 11]               // 5 (Total: 39)
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12],                // 5
    Moon: [2, 4, 6, 8, 10, 11],            // 6
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],       // 8
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],  // 8
    Jupiter: [6, 8, 11, 12],               // 4
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],      // 8
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],      // 8
    Lagna: [1, 2, 4, 6, 8, 10, 11]          // 7 (Total: 54)
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],    // 9
    Moon: [2, 5, 7, 9, 11],                // 5
    Mars: [1, 2, 4, 7, 8, 10, 11],         // 7
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],   // 8
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],   // 8
    Venus: [2, 5, 6, 9, 10, 11],           // 6
    Saturn: [3, 5, 6, 12],                 // 4
    Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11]   // 9 (Total: 56)
  },
  Venus: {
    Sun: [8, 11, 12],                      // 3
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],   // 9
    Mars: [3, 5, 6, 9, 11, 12],            // 6
    Mercury: [3, 5, 6, 9, 11],             // 5
    Jupiter: [5, 8, 9, 10, 11],            // 5
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],   // 9
    Saturn: [3, 4, 5, 8, 9, 10, 11],       // 7
    Lagna: [1, 2, 3, 4, 5, 8, 9, 11]       // 8 (Total: 52)
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],          // 7
    Moon: [3, 6, 11],                      // 3
    Mars: [3, 5, 6, 10, 11, 12],           // 6
    Mercury: [6, 8, 9, 10, 11, 12],        // 6
    Jupiter: [5, 6, 11, 12],               // 4
    Venus: [6, 11, 12],                    // 3
    Saturn: [3, 5, 6, 11],                 // 4
    Lagna: [1, 3, 4, 6, 10, 11]            // 7 (Total: 40)
  }
};

const RASHI_NAMES = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
];

export function calculateAshtakavarga(kundli: KundliData): AshtakavargaResult {
  const classicalPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const bhinnaList: BhinnaAshtakavarga[] = [];
  const sarvashtakavarga = new Array(12).fill(0);

  // Map position of each contributor
  const planetPositions: Record<string, number> = {};
  kundli.planets.forEach((p) => {
    planetPositions[p.planet] = p.rashiIndex;
  });
  planetPositions['Lagna'] = kundli.lagnaRashiIndex;

  classicalPlanets.forEach((targetPlanet) => {
    const pointsPerRashi = new Array(12).fill(0);
    const rules = ASHTAKAVARGA_RULES[targetPlanet];

    if (rules) {
      Object.entries(rules).forEach(([contributor, offsets]) => {
        const baseRashiIndex = planetPositions[contributor];
        if (baseRashiIndex !== undefined) {
          offsets.forEach((off) => {
            const targetRashiIdx = (baseRashiIndex + off - 1) % 12;
            pointsPerRashi[targetRashiIdx] += 1;
          });
        }
      });
    }

    const totalPts = pointsPerRashi.reduce((sum, p) => sum + p, 0);
    bhinnaList.push({
      planet: targetPlanet,
      pointsPerRashi,
      totalPoints: totalPts
    });

    for (let i = 0; i < 12; i++) {
      sarvashtakavarga[i] += pointsPerRashi[i];
    }
  });

  const totalSarvashtakavargaPoints = sarvashtakavarga.reduce((a, b) => a + b, 0);

  // House Strengths
  const houseStrengths = new Array(12).fill(0).map((_, idx) => {
    const rashiIdx = (kundli.lagnaRashiIndex + idx) % 12;
    const pts = sarvashtakavarga[rashiIdx];
    let status: 'Strong (अति शुभ - 28+)' | 'Average (मध्यम - 25-27)' | 'Challenging (संघर्ष कारक - <25)' = 'Average (मध्यम - 25-27)';
    let guidance = '';

    if (pts >= 28) {
      status = 'Strong (अति शुभ - 28+)';
      guidance = `भाव ${idx + 1} (${RASHI_NAMES[rashiIdx]}) अत्यधिक बलवान है (${pts} अंक)। इस भाव से संबंधित प्रयास अत्यधिक सफल व लाभदायक होंगे।`;
    } else if (pts >= 25) {
      status = 'Average (मध्यम - 25-27)';
      guidance = `भाव ${idx + 1} (${RASHI_NAMES[rashiIdx]}) संतुलित है (${pts} अंक)। सामान्य परिश्रम से अनुकूल फल प्राप्त होंगे।`;
    } else {
      status = 'Challenging (संघर्ष कारक - <25)';
      guidance = `भाव ${idx + 1} (${RASHI_NAMES[rashiIdx]}) कमजोर स्थिति में है (${pts} अंक)। इस भाव से संबंधित कार्यों में अतिरिक्त सतर्कता की आवश्यकता है।`;
    }

    return {
      house: idx + 1,
      rashiName: RASHI_NAMES[rashiIdx],
      points: pts,
      status,
      guidance
    };
  });

  return {
    bhinnaAshtakavarga: bhinnaList,
    sarvashtakavarga,
    totalSarvashtakavargaPoints,
    houseStrengths
  };
}

// -------------------------------------------------------------
// Classical Parashari Ashtakavarga Shodhana (अष्टकवर्ग शोधन)
// -------------------------------------------------------------

// 1. Trikona Shodhana (त्रिकोण शोधन - Reduction of Trines)
// Trines: (1, 5, 9) -> [0, 4, 8], (2, 6, 10) -> [1, 5, 9], (3, 7, 11) -> [2, 6, 10], (4, 8, 12) -> [3, 7, 11]
export function performTrikonaShodhana(points: number[]): number[] {
  const result = [...points];
  const trines = [
    [0, 4, 8],  // Fire
    [1, 5, 9],  // Earth
    [2, 6, 10], // Air
    [3, 7, 11]  // Water
  ];

  trines.forEach(([r1, r2, r3]) => {
    const minVal = Math.min(result[r1], result[r2], result[r3]);
    result[r1] -= minVal;
    result[r2] -= minVal;
    result[r3] -= minVal;
  });

  return result;
}

// 2. Ekadhipatya Shodhana (एकाधिपत्य शोधन - Dual Sign Ownership Reduction)
// Mars: 0 & 7, Venus: 1 & 6, Mercury: 2 & 5, Jupiter: 8 & 11, Saturn: 9 & 10 (Sun: 4, Moon: 3 exempt)
export function performEkadhipatyaShodhana(points: number[], planetsInRashi: number[][]): number[] {
  const result = [...points];
  const dualPairs = [
    [0, 7],   // Mars (Mesha & Vrishchika)
    [1, 6],   // Venus (Vrishabha & Tula)
    [2, 5],   // Mercury (Mithuna & Kanya)
    [8, 11],  // Jupiter (Dhanu & Meena)
    [9, 10]   // Saturn (Makara & Kumbha)
  ];

  dualPairs.forEach(([s1, s2]) => {
    const occ1 = planetsInRashi[s1].length > 0;
    const occ2 = planetsInRashi[s2].length > 0;
    const p1 = result[s1];
    const p2 = result[s2];

    // Case 1: Planets in both signs -> No reduction
    if (occ1 && occ2) return;

    // Case 2: One sign occupied, one unoccupied
    if (occ1 && !occ2) {
      if (p2 > p1) result[s2] = p1;
      else result[s2] = 0;
      return;
    }
    if (!occ1 && occ2) {
      if (p1 > p2) result[s1] = p2;
      else result[s1] = 0;
      return;
    }

    // Case 3: Both signs unoccupied by planets
    if (!occ1 && !occ2) {
      if (p1 === p2) {
        result[s1] = 0;
        result[s2] = 0;
      } else {
        const minVal = Math.min(p1, p2);
        result[s1] = minVal;
        result[s2] = minVal;
      }
    }
  });

  return result;
}

// 3. Shodhita Pinda (शोध्य पिण्ड - Rashi Pinda + Graha Pinda)
// Classical Rashi Multipliers (राशि मान):
const RASHI_MULTIPLIERS = [7, 10, 8, 4, 10, 5, 7, 8, 9, 5, 11, 12];
// Classical Graha Multipliers (ग्रह मान):
const GRAHA_MULTIPLIERS: Record<string, number> = {
  Sun: 5, Moon: 5, Mars: 8, Mercury: 5, Jupiter: 10, Venus: 7, Saturn: 5
};

export function calculatePindaShodhana(
  shodhitaPoints: number[],
  planetPlacements: Record<string, number>
): { rashiPinda: number; grahaPinda: number; shodhitaPinda: number } {
  // Rashi Pinda = Sum of (reduced point * rashi multiplier)
  let rashiPinda = 0;
  for (let i = 0; i < 12; i++) {
    rashiPinda += shodhitaPoints[i] * RASHI_MULTIPLIERS[i];
  }

  // Graha Pinda = Sum of (reduced point of planet's sign * planet multiplier)
  let grahaPinda = 0;
  Object.entries(GRAHA_MULTIPLIERS).forEach(([planet, mult]) => {
    const rIdx = planetPlacements[planet];
    if (rIdx !== undefined) {
      grahaPinda += shodhitaPoints[rIdx] * mult;
    }
  });

  return {
    rashiPinda,
    grahaPinda,
    shodhitaPinda: rashiPinda + grahaPinda
  };
}

export function calculateFullAshtakavargaShodhana(kundli: KundliData) {
  const av = calculateAshtakavarga(kundli);

  // Map planets in each rashi
  const planetsInRashi: number[][] = Array.from({ length: 12 }, () => []);
  const planetPlacements: Record<string, number> = {};

  kundli.planets.forEach((p) => {
    planetsInRashi[p.rashiIndex].push(p.rashiIndex);
    planetPlacements[p.planet] = p.rashiIndex;
  });

  const trikonaResults = av.bhinnaAshtakavarga.map((bav) => {
    const after = performTrikonaShodhana(bav.pointsPerRashi);
    return {
      planet: bav.planet,
      pointsBefore: bav.pointsPerRashi,
      pointsAfter: after
    };
  });

  const ekadhipatyaResults = trikonaResults.map((tr) => {
    const after = performEkadhipatyaShodhana(tr.pointsAfter, planetsInRashi);
    return {
      planet: tr.planet,
      pointsBefore: tr.pointsAfter,
      pointsAfter: after
    };
  });

  const pindaResults = ekadhipatyaResults.map((er) => {
    const pinda = calculatePindaShodhana(er.pointsAfter, planetPlacements);
    return {
      planet: er.planet,
      ...pinda
    };
  });

  return {
    rawAshtakavarga: av,
    trikonaShodhana: trikonaResults,
    ekadhipatyaShodhana: ekadhipatyaResults,
    pindaShodhana: pindaResults
  };
}

