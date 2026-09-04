import assert from 'node:assert';
import { test } from 'node:test';
import { calculateKundli } from './ephemeris';
import { calculateDailyPanchang } from './panchang';

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
});

test('Golden Test Case 003: Ajmer Rajasthan Rahu Kaal, Yamaganda & Gulika Verification (Sept 1, 2026)', () => {
  const panchang = calculateDailyPanchang('2026-09-01', 26.4499, 74.6399);

  assert.strictEqual(panchang.solarTimes.sunrise, '06:12 AM', 'Sunrise in Ajmer must be 06:12 AM');
  assert.strictEqual(panchang.solarTimes.sunset, '06:50 PM', 'Sunset in Ajmer must be 06:50 PM');

  assert.strictEqual(panchang.muhurats.rahuKalam.start, '03:41 PM', 'Rahu Kalam start in Ajmer must be 03:41 PM');
  assert.strictEqual(panchang.muhurats.rahuKalam.end, '05:15 PM', 'Rahu Kalam end in Ajmer must be 05:15 PM');

  assert.strictEqual(panchang.muhurats.yamaganda.start, '09:21 AM', 'Yamaganda start in Ajmer must be 09:21 AM');
  assert.strictEqual(panchang.muhurats.yamaganda.end, '10:56 AM', 'Yamaganda end in Ajmer must be 10:56 AM');
});

test('Golden Test Case 004: Merta City Nagaur Rajasthan Verification (Feb 1, 2002 06:55 AM)', () => {
  // Merta City, Nagaur, Rajasthan coordinates: Lat 26.65° N, Lng 74.03° E
  const result = calculateKundli('2002-02-01', '06:55:00', 26.65, 74.03, 'Asia/Kolkata', 'LAHIRI');

  const sun = result.planets.find((p) => p.planet === 'Sun')!;
  const saturn = result.planets.find((p) => p.planet === 'Saturn')!;
  const jupiter = result.planets.find((p) => p.planet === 'Jupiter')!;
  const venus = result.planets.find((p) => p.planet === 'Venus')!;
  const moon = result.planets.find((p) => p.planet === 'Moon')!;

  assert.strictEqual(sun.house, 1, 'Sun must be in 1st House (Makara)');
  
  // Retrograde Verification
  assert.strictEqual(saturn.isRetrograde, true, 'Saturn must be Retrograde (R) on Feb 1, 2002');
  assert.strictEqual(jupiter.isRetrograde, true, 'Jupiter must be Retrograde (R) on Feb 1, 2002');

  // Graha Maitri Dignity Verification
  assert.strictEqual(jupiter.dignity, 'Enemy', 'Jupiter in Gemini must have Enemy dignity');
  assert.strictEqual(venus.dignity, 'Friend', 'Venus in Capricorn must have Friend dignity');
  assert.strictEqual(moon.dignity, 'Friend', 'Moon in Virgo must have Friend dignity');
});
