import { KundliData, AshtakootaMatchingResult } from '@vedic-astro/types';

// 1. Classical Varna (वर्ण - Max 1)
// Water (Brahmin: Karka 3, Vrishchika 7, Meena 11) -> 4
// Fire (Kshatriya: Mesha 0, Simha 4, Dhanu 8) -> 3
// Earth (Vaishya: Vrishabha 1, Kanya 5, Makara 9) -> 2
// Air (Shudra: Mithuna 2, Tula 6, Kumbha 10) -> 1
const RASHI_VARNA: Record<number, number> = {
  3: 4, 7: 4, 11: 4, // Brahmin
  0: 3, 4: 3, 8: 3,  // Kshatriya
  1: 2, 5: 2, 9: 2,  // Vaishya
  2: 1, 6: 1, 10: 1  // Shudra
};

// 2. Classical Vashya (वश्य - Max 2)
// 0: Chatushpada (चतुष्पद), 1: Dwipada/Manava (द्विपद), 2: Jalachara (जलचर), 3: Vanachara (वनचर), 4: Keeta (कीट)
function getVashyaCategory(rashiIdx: number): number {
  if ([0, 1].includes(rashiIdx)) return 0; // Aries, Taurus
  if ([2, 5, 6, 10].includes(rashiIdx)) return 1; // Gemini, Virgo, Libra, Aquarius
  if ([3, 11].includes(rashiIdx)) return 2; // Cancer, Pisces
  if (rashiIdx === 4) return 3; // Leo (Vanachara)
  if (rashiIdx === 7) return 4; // Scorpio (Keeta)
  if (rashiIdx === 8) return 1; // Sagittarius (1st half Manava, 2nd Chatushpada)
  if (rashiIdx === 9) return 0; // Capricorn (1st half Chatushpada, 2nd Jalachara)
  return 1;
}

const VASHYA_MATRIX: number[][] = [
  // Chatushpada, Dwipada, Jalachara, Vanachara, Keeta
  [2.0, 1.0, 1.0, 0.0, 1.0], // Chatushpada
  [1.0, 2.0, 0.5, 0.0, 1.0], // Dwipada
  [1.0, 0.5, 2.0, 0.0, 1.0], // Jalachara
  [0.0, 0.0, 0.0, 2.0, 0.0], // Vanachara
  [1.0, 1.0, 1.0, 0.0, 2.0]  // Keeta
];

// 3. Classical Tara (तारा - Max 3)
// Count from Girl to Boy % 9 and Boy to Girl % 9
function calculateTaraScore(nakBoy: number, nakGirl: number): number {
  const countBoyFromGirl = ((nakBoy - nakGirl + 27) % 9) + 1;
  const countGirlFromBoy = ((nakGirl - nakBoy + 27) % 9) + 1;

  const inauspicious = [3, 5, 7]; // Vipat, Pratyak, Naidhana
  let score = 0;
  if (!inauspicious.includes(countBoyFromGirl)) score += 1.5;
  if (!inauspicious.includes(countGirlFromBoy)) score += 1.5;
  return score;
}

// 4. Classical 14 Yonis (योनि - Max 4)
// 0: Horse, 1: Elephant, 2: Sheep, 3: Serpent, 4: Dog, 5: Cat, 6: Rat,
// 7: Cow, 8: Buffalo, 9: Tiger, 10: Deer, 11: Monkey, 12: Mongoose, 13: Lion
const NAKSHATRA_YONI_MAP = [
  0,  // 0: Ashwini (Horse)
  1,  // 1: Bharani (Elephant)
  2,  // 2: Krittika (Sheep)
  3,  // 3: Rohini (Serpent)
  3,  // 4: Mrigashira (Serpent)
  4,  // 5: Ardra (Dog)
  5,  // 6: Punarvasu (Cat)
  2,  // 7: Pushya (Sheep)
  5,  // 8: Ashlesha (Cat)
  6,  // 9: Magha (Rat)
  6,  // 10: Purva Phalguni (Rat)
  7,  // 11: Uttara Phalguni (Cow)
  8,  // 12: Hasta (Buffalo)
  9,  // 13: Chitra (Tiger)
  8,  // 14: Swati (Buffalo)
  9,  // 15: Vishakha (Tiger)
  10, // 16: Anuradha (Deer)
  10, // 17: Jyeshtha (Deer)
  4,  // 18: Mula (Dog)
  11, // 19: Purva Ashadha (Monkey)
  12, // 20: Uttara Ashadha (Mongoose)
  11, // 21: Shravana (Monkey)
  13, // 22: Dhanishta (Lion)
  0,  // 23: Shatabhisha (Horse)
  13, // 24: Purva Bhadrapada (Lion)
  7,  // 25: Uttara Bhadrapada (Cow)
  1   // 26: Revati (Elephant)
];

// Sworn enemies get 0 (Horse-Buffalo, Elephant-Lion, Sheep-Monkey, Serpent-Mongoose, Dog-Deer, Cat-Rat, Cow-Tiger)
const YONI_ENEMIES: [number, number][] = [
  [0, 8],  // Horse vs Buffalo
  [1, 13], // Elephant vs Lion
  [2, 11], // Sheep vs Monkey
  [3, 12], // Serpent vs Mongoose
  [4, 10], // Dog vs Deer
  [5, 6],  // Cat vs Rat
  [7, 9]   // Cow vs Tiger
];

function calculateYoniScore(nakA: number, nakB: number): number {
  const yoniA = NAKSHATRA_YONI_MAP[nakA];
  const yoniB = NAKSHATRA_YONI_MAP[nakB];

  if (yoniA === yoniB) return 4;
  for (const [e1, e2] of YONI_ENEMIES) {
    if ((yoniA === e1 && yoniB === e2) || (yoniA === e2 && yoniB === e1)) {
      return 0; // Inimical
    }
  }
  return 2; // Neutral / Friendly
}

// 5. Classical Graha Maitri (ग्रह मैत्री - Max 5)
const PLANETARY_FRIENDSHIP: Record<string, { friends: string[]; enemies: string[] }> = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn'] },
  Moon: { friends: ['Sun', 'Mercury'], enemies: [] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury'] },
  Mercury: { friends: ['Sun', 'Venus'], enemies: ['Moon'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'] },
  Venus: { friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'] },
  Saturn: { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'] }
};

function calculateGrahaMaitriScore(lordA: string, lordB: string): number {
  if (lordA === lordB) return 5;
  const aRel = PLANETARY_FRIENDSHIP[lordA];
  const bRel = PLANETARY_FRIENDSHIP[lordB];

  const aLikesB = aRel?.friends.includes(lordB) ? 1 : aRel?.enemies.includes(lordB) ? -1 : 0;
  const bLikesA = bRel?.friends.includes(lordA) ? 1 : bRel?.enemies.includes(lordA) ? -1 : 0;
  const total = aLikesB + bLikesA;

  if (total === 2) return 5;    // Mutual friends
  if (total === 1) return 4;    // One friend, one neutral
  if (total === 0) return 3;    // Mutual neutrals
  if (total === -1) return 1;   // One neutral, one enemy
  return 0.5;                   // Mutual enemies
}

// 6. Classical Gana (गण - Max 6)
// 0: Deva (देव), 1: Manushya (मनुष्य), 2: Rakshasa (राक्षस)
const NAKSHATRA_GANA_MAP = [
  0, // Ashwini (Deva)
  1, // Bharani (Manushya)
  2, // Krittika (Rakshasa)
  1, // Rohini (Manushya)
  0, // Mrigashira (Deva)
  1, // Ardra (Manushya)
  0, // Punarvasu (Deva)
  0, // Pushya (Deva)
  2, // Ashlesha (Rakshasa)
  2, // Magha (Rakshasa)
  1, // Purva Phalguni (Manushya)
  1, // Uttara Phalguni (Manushya)
  0, // Hasta (Deva)
  2, // Chitra (Rakshasa)
  0, // Swati (Deva)
  2, // Vishakha (Rakshasa)
  0, // Anuradha (Deva)
  2, // Jyeshtha (Rakshasa)
  2, // Mula (Rakshasa)
  1, // Purva Ashadha (Manushya)
  1, // Uttara Ashadha (Manushya)
  0, // Shravana (Deva)
  2, // Dhanishta (Rakshasa)
  2, // Shatabhisha (Rakshasa)
  1, // Purva Bhadrapada (Manushya)
  1, // Uttara Bhadrapada (Manushya)
  0  // Revati (Deva)
];

function calculateGanaScore(nakA: number, nakB: number): number {
  const ganaA = NAKSHATRA_GANA_MAP[nakA];
  const ganaB = NAKSHATRA_GANA_MAP[nakB];

  if (ganaA === ganaB) return 6;
  if ((ganaA === 0 && ganaB === 1) || (ganaA === 1 && ganaB === 0)) return 5; // Deva + Manushya
  if ((ganaA === 0 && ganaB === 2) || (ganaA === 2 && ganaB === 0)) return 1; // Deva + Rakshasa
  return 0; // Manushya + Rakshasa
}

// 7. Classical Bhakoot (भकूट - Max 7)
function calculateBhakootScore(rashiA: number, rashiB: number, lordA: string, lordB: string): number {
  const diff = ((rashiB - rashiA + 12) % 12) + 1;
  const isDosha = [2, 12, 6, 8, 5, 9].includes(diff);

  if (!isDosha) return 7;

  // Bhakoot Dosha Cancellations:
  // 1. Same rashi lord (e.g. Aries-Scorpio both Mars, Taurus-Libra both Venus, Cap-Aqua both Saturn)
  if (lordA === lordB) return 7;
  // 2. Mutual friendly lords (e.g. Sun and Jupiter in Leo-Pisces / Aries-Sagittarius)
  const aRel = PLANETARY_FRIENDSHIP[lordA];
  const bRel = PLANETARY_FRIENDSHIP[lordB];
  if (aRel?.friends.includes(lordB) && bRel?.friends.includes(lordA)) return 7;

  return 0;
}

// 8. Classical Nadi (नाड़ी - Max 8)
// 0: Adi (आदि), 1: Madhya (मध्य), 2: Antya (अंत्य)
// Sequence alternates: 0, 1, 2, 2, 1, 0, 0, 1, 2...
const NAKSHATRA_NADI_MAP = [
  0, 1, 2, // 0: Ashwini(Adi), 1: Bharani(Madhya), 2: Krittika(Antya)
  2, 1, 0, // 3: Rohini(Antya), 4: Mrigashira(Madhya), 5: Ardra(Adi)
  0, 1, 2, // 6: Punarvasu(Adi), 7: Pushya(Madhya), 8: Ashlesha(Antya)
  2, 1, 0, // 9: Magha(Antya), 10: P.Phalguni(Madhya), 11: U.Phalguni(Adi)
  0, 1, 2, // 12: Hasta(Adi), 13: Chitra(Madhya), 14: Swati(Antya)
  2, 1, 0, // 15: Vishakha(Antya), 16: Anuradha(Madhya), 17: Jyeshtha(Adi)
  0, 1, 2, // 18: Mula(Adi), 19: P.Ashadha(Madhya), 20: U.Ashadha(Antya)
  2, 1, 0, // 21: Shravana(Antya), 22: Dhanishta(Madhya), 23: Shatabhisha(Adi)
  0, 1, 2  // 24: P.Bhadra(Adi), 25: U.Bhadra(Madhya), 26: Revati(Antya)
];

function calculateNadiScore(nakA: number, padaA: number, nakB: number, padaB: number, rashiA: number, rashiB: number): number {
  const nadiA = NAKSHATRA_NADI_MAP[nakA];
  const nadiB = NAKSHATRA_NADI_MAP[nakB];

  if (nadiA !== nadiB) return 8;

  // Nadi Dosha Exceptions (नाड़ी दोष परिहार):
  // 1. Same Nakshatra but different Padas
  if (nakA === nakB && padaA !== padaB) return 8;
  // 2. Different Nakshatras in the same Rashi
  if (rashiA === rashiB && nakA !== nakB) return 8;

  return 0; // Uncancelled Nadi Dosha
}

export function calculateAshtakootaMatching(kundliA: KundliData, kundliB: KundliData): AshtakootaMatchingResult {
  const moonA = kundliA.planets.find((p) => p.planet === 'Moon')!;
  const moonB = kundliB.planets.find((p) => p.planet === 'Moon')!;

  // 1. Varna
  const varnaA = RASHI_VARNA[moonA.rashiIndex] || 1;
  const varnaB = RASHI_VARNA[moonB.rashiIndex] || 1;
  const varnaScore = varnaA >= varnaB ? 1 : 0;

  // 2. Vashya
  const catA = getVashyaCategory(moonA.rashiIndex);
  const catB = getVashyaCategory(moonB.rashiIndex);
  const vashyaScore = VASHYA_MATRIX[catA]?.[catB] ?? 1.0;

  // 3. Tara
  const taraScore = calculateTaraScore(moonA.nakshatraIndex, moonB.nakshatraIndex);

  // 4. Yoni
  const yoniScore = calculateYoniScore(moonA.nakshatraIndex, moonB.nakshatraIndex);

  // 5. Graha Maitri
  const maitriScore = calculateGrahaMaitriScore(moonA.rashiLord, moonB.rashiLord);

  // 6. Gana
  const ganaScore = calculateGanaScore(moonA.nakshatraIndex, moonB.nakshatraIndex);

  // 7. Bhakoot
  const bhakootScore = calculateBhakootScore(moonA.rashiIndex, moonB.rashiIndex, moonA.rashiLord, moonB.rashiLord);

  // 8. Nadi
  const nadiScore = calculateNadiScore(moonA.nakshatraIndex, moonA.pada, moonB.nakshatraIndex, moonB.pada, moonA.rashiIndex, moonB.rashiIndex);

  const totalScore = Math.round((varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore) * 10) / 10;

  // Manglik Analysis
  const marsA = kundliA.planets.find((p) => p.planet === 'Mars')!;
  const marsB = kundliB.planets.find((p) => p.planet === 'Mars')!;
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const isManglikA = manglikHouses.includes(marsA.house);
  const isManglikB = manglikHouses.includes(marsB.house);
  const isCancelled = isManglikA && isManglikB;

  let summary = `Total Compatibility Score: ${totalScore} out of 36. `;
  if (totalScore >= 28) summary += 'अति उत्तम गुण मिलान (Excellent match for marriage). दांपत्य जीवन सुखमय व समृद्ध रहेगा।';
  else if (totalScore >= 18) summary += 'शुभ व अनुकूल मिलान (Good match). विवाह हेतु अनुशंसित है।';
  else summary += 'मध्यम या न्यून मिलान (Below average compatibility score). ज्योतिषीय परामर्श व शांति उपाय आवश्यक हैं।';

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
