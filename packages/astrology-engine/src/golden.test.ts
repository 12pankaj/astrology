import assert from 'node:assert';
import { test } from 'node:test';
import { calculateKundli, calculateSripatiBhavaChalit } from './ephemeris.js';
import { calculateDailyPanchang } from './panchang.js';
import { calculateVimshottariDasha } from './dasha.js';
import { calculateShadbala } from './shadbala.js';
import { calculateFullAshtakavargaShodhana } from './ashtakavarga.js';
import { calculateJaimini } from './jaimini.js';
import { calculateKpSystem } from './kp.js';
import { calculateTransitAndSadeSati } from './transit.js';
import { calculateChoghadiyaAndHora } from './muhurat.js';
import { calculateLalKitab } from './lalkitab.js';

test('Golden Test Case 001: New Delhi IST Birth Verification', () => {
  const result = calculateKundli('1990-01-15', '10:30:00', 28.6139, 77.2090, 'Asia/Kolkata', 'LAHIRI');

  assert.strictEqual(result.ayanamsha, 'LAHIRI');
  assert.ok(result.lagnaDegree >= 0 && result.lagnaDegree <= 360, 'Lagna degree must be valid angle');
  assert.strictEqual(result.planets.length, 12, 'Must calculate all 12 grahas');

  const sun = result.planets.find((p) => p.planet === 'Sun')!;
  assert.strictEqual(sun.rashiName, 'Makara (Capricorn)', 'Sun in January must be in Makara (Capricorn)');

  const moon = result.planets.find((p) => p.planet === 'Moon')!;
  assert.ok(moon.nakshatraName.length > 0, 'Moon Nakshatra must be resolved');
  assert.ok(moon.pada >= 1 && moon.pada <= 4, 'Pada must be 1 to 4');

  // Verify Combustion field exists and is boolean
  assert.strictEqual(typeof sun.isCombust, 'boolean');
  assert.ok(sun.combustionDegrees !== undefined);

  // Verify Bhava Chalit house mapping
  assert.ok(sun.bhavaChalitHouse >= 1 && sun.bhavaChalitHouse <= 12, 'Sun bhava chalit house must be 1-12');
});

test('Golden Test Case 002: Vimshottari Dasha Birth Balance Continuity', () => {
  const birthDate = '2002-02-01';
  const kundli = calculateKundli(birthDate, '06:55:00', 26.65, 74.03, 'Asia/Kolkata', 'LAHIRI');
  const dasha = calculateVimshottariDasha(kundli, birthDate);

  assert.ok(dasha.dashaBalanceAtBirthYears > 0, 'Balance at birth must be positive');
  assert.strictEqual(dasha.timeline.length, 9, 'Must contain all 9 Mahadashas');

  const firstMaha = dasha.timeline[0];
  assert.strictEqual(firstMaha.startDate, birthDate, 'First Mahadasha must start on birth date');

  // Verify sub-periods inside the first Mahadasha
  assert.ok(firstMaha.subPeriods && firstMaha.subPeriods.length > 0, 'Must have subperiods in 1st Mahadasha');
  assert.strictEqual(firstMaha.subPeriods[0].startDate, birthDate, 'First active Antardasha must start on birth date');

  // Verify sum of Antardashas equals Mahadasha balance duration within 0.05 yrs
  const totalAntarYears = firstMaha.subPeriods.reduce((acc, sub) => acc + sub.durationYears, 0);
  assert.ok(
    Math.abs(totalAntarYears - firstMaha.durationYears) < 0.05,
    `Sum of Antardasha durations (${totalAntarYears}) must match Mahadasha duration (${firstMaha.durationYears})`
  );

  // Verify current running Mahadasha and Antardasha are resolved
  assert.ok(dasha.currentMahadasha.length > 0, 'Current Mahadasha must be resolved');
  assert.ok(dasha.currentAntardasha.length > 0, 'Current Antardasha must be resolved');
  assert.ok(dasha.currentPratyantardasha.length > 0, 'Current Pratyantardasha must be resolved');
});

test('Golden Test Case 003: Daily Panchang 60-Karana, Moonrise, and Muhurats', () => {
  const panchang = calculateDailyPanchang('2026-09-01', 26.4499, 74.6399);

  // Solar times
  assert.strictEqual(panchang.solarTimes.sunrise, '06:12 AM', 'Sunrise in Ajmer must be 06:12 AM');
  assert.strictEqual(panchang.solarTimes.sunset, '06:50 PM', 'Sunset in Ajmer must be 06:50 PM');
  assert.ok(panchang.solarTimes.moonrise.includes('AM') || panchang.solarTimes.moonrise.includes('PM'));
  assert.ok(panchang.solarTimes.moonset.includes('AM') || panchang.solarTimes.moonset.includes('PM'));

  // Muhurats
  assert.strictEqual(panchang.muhurats.rahuKalam.start, '03:41 PM');
  assert.strictEqual(panchang.muhurats.rahuKalam.end, '05:15 PM');
  assert.strictEqual(panchang.muhurats.yamaganda.start, '09:21 AM');
  assert.strictEqual(panchang.muhurats.yamaganda.end, '10:56 AM');

  // Ending Times
  assert.ok(panchang.tithi.endingTime, 'Tithi ending time must be calculated');
  assert.ok(panchang.nakshatra.endingTime, 'Nakshatra ending time must be calculated');
  assert.ok(panchang.karana.endingTime, 'Karana ending time must be calculated');

  // Karana classification
  assert.ok(panchang.karana.type === 'Sthira (स्थिर)' || panchang.karana.type === 'Chara (चर)');
});

test('Golden Test Case 004: Sripati Bhava Chalit Chart Verification', () => {
  const kundli = calculateKundli('2002-02-01', '06:55:00', 26.65, 74.03, 'Asia/Kolkata', 'LAHIRI');
  const ascData = kundli;
  const chalit = calculateSripatiBhavaChalit(ascData.lagnaDegree, 210.0, kundli.planets);

  assert.strictEqual(chalit.method, 'Sripati');
  assert.strictEqual(chalit.houses.length, 12, 'Must have 12 Bhava Chalit houses');

  chalit.houses.forEach((h) => {
    assert.ok(h.bhavaMadhyaDegree >= 0 && h.bhavaMadhyaDegree <= 360);
    assert.ok(h.bhavaSandhiDegree >= 0 && h.bhavaSandhiDegree <= 360);
    assert.ok(h.bhavaMadhyaFormatted.length > 0);
    assert.ok(h.bhavaSandhiFormatted.length > 0);
  });
});

test('Golden Test Case 005: Shadbala 6-Fold Planetary Strength Calculation', () => {
  const kundli = calculateKundli('2002-02-01', '06:55:00', 26.65, 74.03, 'Asia/Kolkata', 'LAHIRI');
  const shadbala = calculateShadbala(kundli, true);

  assert.strictEqual(shadbala.planets.length, 7, 'Must compute Shadbala for 7 classical grahas');
  assert.ok(shadbala.strongestPlanet.length > 0, 'Strongest planet must be identified');
  assert.ok(shadbala.weakestPlanet.length > 0, 'Weakest planet must be identified');

  shadbala.planets.forEach((p) => {
    assert.ok(p.sthanaBala >= 0, `${p.planet} Sthana Bala must be non-negative`);
    assert.ok(p.digBala >= 0, `${p.planet} Dig Bala must be non-negative`);
    assert.ok(p.kalaBala >= 0, `${p.planet} Kala Bala must be non-negative`);
    assert.ok(p.cheshtaBala >= 0, `${p.planet} Cheshta Bala must be non-negative`);
    assert.ok(p.naisargikaBala > 0, `${p.planet} Naisargika Bala must be positive`);
    assert.ok(p.totalRupas > 0, `${p.planet} Total Rupas must be positive`);
    assert.ok(p.rank >= 1 && p.rank <= 7, `${p.planet} Rank must be between 1 and 7`);
  });
});

test('Golden Test Case 006: Ashtakavarga Shodhana & Pinda Verification', () => {
  const kundli = calculateKundli('2002-02-01', '06:55:00', 26.65, 74.03, 'Asia/Kolkata', 'LAHIRI');
  const shodhana = calculateFullAshtakavargaShodhana(kundli);

  assert.strictEqual(shodhana.trikonaShodhana.length, 7, 'Must compute Trikona Shodhana for 7 planets');
  assert.strictEqual(shodhana.ekadhipatyaShodhana.length, 7, 'Must compute Ekadhipatya Shodhana for 7 planets');
  assert.strictEqual(shodhana.pindaShodhana.length, 7, 'Must compute Pinda Shodhana for 7 planets');

  shodhana.pindaShodhana.forEach((p) => {
    assert.ok(p.rashiPinda >= 0, `${p.planet} Rashi Pinda must be non-negative`);
    assert.ok(p.grahaPinda >= 0, `${p.planet} Graha Pinda must be non-negative`);
    assert.strictEqual(p.shodhitaPinda, p.rashiPinda + p.grahaPinda, `${p.planet} Shodhita Pinda must equal Rashi + Graha Pinda`);
  });
});

test('Golden Test Case 007: Classical Ashtakoota Milan Verification', async () => {
  const { calculateAshtakootaMatching } = await import('./matching.js');
  const kundliA = calculateKundli('1990-01-15', '10:30:00', 28.6139, 77.2090, 'Asia/Kolkata', 'LAHIRI');
  const kundliB = calculateKundli('1992-05-20', '14:15:00', 28.6139, 77.2090, 'Asia/Kolkata', 'LAHIRI');

  const match = calculateAshtakootaMatching(kundliA, kundliB);

  assert.strictEqual(match.maxScore, 36);
  assert.ok(match.totalScore >= 0 && match.totalScore <= 36, 'Score must be between 0 and 36');
  assert.strictEqual(match.varna.max, 1);
  assert.strictEqual(match.vashya.max, 2);
  assert.strictEqual(match.tara.max, 3);
  assert.strictEqual(match.yoni.max, 4);
  assert.strictEqual(match.grahaMaitri.max, 5);
  assert.strictEqual(match.gana.max, 6);
  assert.strictEqual(match.bhakoot.max, 7);
  assert.strictEqual(match.nadi.max, 8);
  assert.strictEqual(typeof match.manglikAnalysis.isCancelled, 'boolean');
});

test('Golden Test Case 008: Jaimini Chara Karakas, Arudha Padas & Karakamsha', () => {
  const birthDate = '2002-02-01';
  const kundli = calculateKundli(birthDate, '06:55:00', 27.1983, 73.7481, 'Asia/Kolkata', 'LAHIRI');
  const jaimini = calculateJaimini(kundli);

  // 1. Verify 7 Chara Karakas
  assert.strictEqual(jaimini.charaKarakas.length, 7, 'Must calculate exactly 7 Chara Karakas');
  assert.strictEqual(jaimini.charaKarakas[0].abbreviation, 'AK', 'First must be Atmakaraka');
  assert.strictEqual(jaimini.charaKarakas[6].abbreviation, 'DK', 'Seventh must be Darakaraka');

  // Verify descending degrees
  for (let i = 0; i < 6; i++) {
    assert.ok(
      jaimini.charaKarakas[i].degreeInSign >= jaimini.charaKarakas[i + 1].degreeInSign,
      `Karaka ${i} (${jaimini.charaKarakas[i].abbreviation}) must have >= degree than ${i + 1} (${jaimini.charaKarakas[i + 1].abbreviation})`
    );
  }

  // 2. Verify 12 Arudha Padas
  assert.strictEqual(jaimini.arudhaPadas.length, 12, 'Must calculate all 12 Arudha Padas');
  assert.strictEqual(jaimini.arudhaPadas[0].code, 'AL', 'A1 must be Arudha Lagna (AL)');
  assert.strictEqual(jaimini.arudhaPadas[11].code, 'UL', 'A12 must be Upapada Lagna (UL)');

  // 3. Verify Karakamsha
  assert.ok(jaimini.karakamshaRashi.length > 0, 'Karakamsha Rashi must be resolved');
  assert.ok(jaimini.karakamshaSignificance.includes(jaimini.charaKarakas[0].planetHindi));
});

test('Golden Test Case 009: KP System Sub-Lords, Cusps & 4-Fold Significators', () => {
  const birthDate = '2002-02-01';
  const kundli = calculateKundli(birthDate, '06:55:00', 27.1983, 73.7481, 'Asia/Kolkata', 'LAHIRI');
  const kp = calculateKpSystem(kundli, 'Friday');

  // 1. Verify Cusps
  assert.strictEqual(kp.cusps.length, 12, 'Must calculate 12 KP Cusps');
  kp.cusps.forEach((c) => {
    assert.ok(c.subLord.length > 0, `Cusp ${c.house} must have a Sub-Lord`);
    assert.ok(c.subSubLord.length > 0, `Cusp ${c.house} must have a Sub-Sub Lord`);
    assert.ok(c.rashiLord.length > 0, `Cusp ${c.house} must have a Sign Lord`);
    assert.ok(c.nakshatraLord.length > 0, `Cusp ${c.house} must have a Star Lord`);
  });

  // 2. Verify Planets
  assert.strictEqual(kp.planets.length, kundli.planets.length, 'Must map all planets to KP');
  kp.planets.forEach((p) => {
    assert.ok(p.subLord.length > 0, `Planet ${p.planet} must have a Sub-Lord`);
    assert.ok(p.subSubLord.length > 0, `Planet ${p.planet} must have a Sub-Sub Lord`);
  });

  // 3. Verify 4-Fold Significators
  assert.strictEqual(kp.significators.length, 12, 'Must provide significators for 12 houses');
  kp.significators.forEach((sig) => {
    assert.ok(Array.isArray(sig.planetsGradeA));
    assert.ok(Array.isArray(sig.planetsGradeB));
    assert.ok(Array.isArray(sig.planetsGradeC));
    assert.ok(Array.isArray(sig.planetsGradeD));
  });

  // 4. Verify Ruling Planets
  assert.strictEqual(kp.rulingPlanets.dayLord, 'Friday');
  assert.ok(kp.rulingPlanets.moonSignLord.length > 0);
  assert.ok(kp.rulingPlanets.ascendantSignLord.length > 0);
});

test('Golden Test Case 010: Transit (Gochar), Saturn Sade Sati & Dhaiya Engine', () => {
  const birthDate = '2002-02-01';
  const kundli = calculateKundli(birthDate, '06:55:00', 27.1983, 73.7481, 'Asia/Kolkata', 'LAHIRI');
  const transit = calculateTransitAndSadeSati(kundli, new Date('2026-09-14T12:00:00Z'));

  assert.ok(transit.planets.length >= 7, 'Must have at least 7 physical transiting planets');
  transit.planets.forEach((tp) => {
    assert.ok(tp.houseFromLagna >= 1 && tp.houseFromLagna <= 12, 'Transit house from Lagna must be 1-12');
    assert.ok(tp.houseFromMoon >= 1 && tp.houseFromMoon <= 12, 'Transit house from Moon must be 1-12');
    assert.ok(tp.kakshyaLord.length > 0, 'Must identify Kakshya lord');
    assert.ok(tp.transitResultHindi.length > 0, 'Must have interpretation text in Hindi');
  });

  // Verify Sade Sati result structure
  assert.strictEqual(typeof transit.sadeSati.isSadeSatiActive, 'boolean');
  assert.ok(transit.sadeSati.summaryHindi.length > 0);
  assert.ok(transit.sadeSati.remedies.length > 0);
});

test('Golden Test Case 011: Muhurat Choghadiya & 24 Planetary Horas', () => {
  const muhurat = calculateChoghadiyaAndHora(new Date('2026-09-14'), 385, 1110);

  // 8 Day & 8 Night Choghadiyas
  assert.strictEqual(muhurat.dayChoghadiya.length, 8, 'Must have 8 Day Choghadiyas');
  assert.strictEqual(muhurat.nightChoghadiya.length, 8, 'Must have 8 Night Choghadiyas');

  // Verify each Choghadiya has period, timing, and nature
  muhurat.dayChoghadiya.forEach((c, idx) => {
    assert.strictEqual(c.periodIndex, idx + 1);
    assert.ok(c.startTime.includes('AM') || c.startTime.includes('PM'));
    assert.ok(c.endTime.includes('AM') || c.endTime.includes('PM'));
    assert.ok(['Auspicious (शुभ)', 'Neutral (सामान्य)', 'Inauspicious (अशुभ)'].includes(c.nature));
  });

  // 24 Planetary Horas
  assert.strictEqual(muhurat.horas.length, 24, 'Must have 24 Hourly Horas');
  muhurat.horas.forEach((h, idx) => {
    assert.strictEqual(h.hourIndex, idx + 1);
    assert.ok(h.rulingPlanet.length > 0);
  });
});

test('Golden Test Case 012: Lal Kitab Fixed Houses, Teva & Ancestral Debts (Rin)', () => {
  const birthDate = '2002-02-01';
  const kundli = calculateKundli(birthDate, '06:55:00', 27.1983, 73.7481, 'Asia/Kolkata', 'LAHIRI');
  const lalkitab = calculateLalKitab(kundli);

  // 1. Verify Planets mapped to fixed houses
  assert.strictEqual(lalkitab.planets.length, kundli.planets.length);
  lalkitab.planets.forEach((lp) => {
    assert.ok(lp.lalKitabHouse >= 1 && lp.lalKitabHouse <= 12);
    assert.ok(lp.specificRemedyHindi.length > 0);
  });

  // 2. Verify Teva Type
  assert.ok(['Dharmi Teva (धर्मी तेवा)', 'Andha Teva (अंधा तेवा)', 'Nabaligh Teva (नाबालिग तेवा)', 'Aam Teva (सामान्य तेवा)'].includes(lalkitab.tevaType));
  assert.ok(lalkitab.tevaDescriptionHindi.length > 0);

  // 3. Verify 6 Ancestral Debts (Rin)
  assert.strictEqual(lalkitab.debts.length, 6, 'Must check all 6 major ancestral debts');
  lalkitab.debts.forEach((debt) => {
    assert.strictEqual(typeof debt.isApplicable, 'boolean');
    assert.ok(debt.causeHindi.length > 0);
    assert.ok(debt.indicationsHindi.length > 0);
    assert.ok(debt.remedyHindi.length > 0);
  });
});

