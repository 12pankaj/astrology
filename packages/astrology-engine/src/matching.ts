import { KundliData, AshtakootaMatchingResult } from '@vedic-astro/types';

export function calculateAshtakootaMatching(kundliA: KundliData, kundliB: KundliData): AshtakootaMatchingResult {
  const moonA = kundliA.planets.find((p) => p.planet === 'Moon')!;
  const moonB = kundliB.planets.find((p) => p.planet === 'Moon')!;

  // 1. Varna (Max 1)
  const varnaA = Math.floor(moonA.rashiIndex / 3); // 0: Brahmin, 1: Kshatriya, 2: Vaishya, 3: Shudra
  const varnaB = Math.floor(moonB.rashiIndex / 3);
  const varnaScore = varnaA >= varnaB ? 1 : 0;

  // 2. Vashya (Max 2)
  const vashyaScore = moonA.rashiIndex === moonB.rashiIndex ? 2 : 1;

  // 3. Tara (Max 3)
  const nakDiff = Math.abs(moonA.nakshatraIndex - moonB.nakshatraIndex) % 9;
  const taraScore = [3, 5, 7].includes(nakDiff) ? 1.5 : 3;

  // 4. Yoni (Max 4)
  const yoniA = moonA.nakshatraIndex % 14;
  const yoniB = moonB.nakshatraIndex % 14;
  const yoniScore = yoniA === yoniB ? 4 : 2;

  // 5. Graha Maitri (Max 5)
  const maitriScore = moonA.rashiLord === moonB.rashiLord ? 5 : 3;

  // 6. Gana (Max 6)
  const ganaA = moonA.nakshatraIndex % 3; // 0: Deva, 1: Manushya, 2: Rakshasa
  const ganaB = moonB.nakshatraIndex % 3;
  let ganaScore = 6;
  if (ganaA === 0 && ganaB === 2) ganaScore = 0;
  else if (ganaA !== ganaB) ganaScore = 3;

  // 7. Bhakoot (Max 7)
  const rashiDiff = Math.abs(moonA.rashiIndex - moonB.rashiIndex) + 1;
  const isBhakootDosha = [2, 12, 6, 8, 5, 9].includes(rashiDiff);
  const bhakootScore = isBhakootDosha ? 0 : 7;

  // 8. Nadi (Max 8)
  const nadiA = moonA.nakshatraIndex % 3; // 0: Adi, 1: Madhya, 2: Antya
  const nadiB = moonB.nakshatraIndex % 3;
  const isNadiDosha = nadiA === nadiB;
  const nadiScore = isNadiDosha ? 0 : 8;

  const totalScore = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore;

  // Manglik Analysis
  const marsA = kundliA.planets.find((p) => p.planet === 'Mars')!;
  const marsB = kundliB.planets.find((p) => p.planet === 'Mars')!;
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const isManglikA = manglikHouses.includes(marsA.house);
  const isManglikB = manglikHouses.includes(marsB.house);
  const isCancelled = isManglikA && isManglikB;

  let summary = `Total Compatibility Score: ${totalScore} out of 36. `;
  if (totalScore >= 28) summary += 'Excellent match for marriage!';
  else if (totalScore >= 18) summary += 'Good match. Marriage is recommended.';
  else summary += 'Below average compatibility score. Astrological consultation is advised.';

  return {
    varna: { score: varnaScore, max: 1, name: 'Varna' },
    vashya: { score: vashyaScore, max: 2, name: 'Vashya' },
    tara: { score: taraScore, max: 3, name: 'Tara' },
    yoni: { score: yoniScore, max: 4, name: 'Yoni' },
    grahaMaitri: { score: maitriScore, max: 5, name: 'Graha Maitri' },
    gana: { score: ganaScore, max: 6, name: 'Gana' },
    bhakoot: { score: bhakootScore, max: 7, name: 'Bhakoot' },
    nadi: { score: nadiScore, max: 8, name: 'Nadi' },
    totalScore,
    maxScore: 36,
    isCompatible: totalScore >= 18,
    manglikAnalysis: {
      personAManglik: isManglikA,
      personBManglik: isManglikB,
      isCancelled,
      summary
    }
  };
}
