import { PanchangData } from '@vedic-astro/types';
import { getJulianDay, getLahiriAyanamsha, calculatePlanetaryPositions } from './ephemeris.js';

const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashti', 'Saptami', 'Ashtami',
  'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
];

const VARA_NAMES = ['Ravivara (Sunday)', 'Somavara (Monday)', 'Mangalavara (Tuesday)', 'Budhavara (Wednesday)', 'Guruvara (Thursday)', 'Shukravara (Friday)', 'Shanivara (Saturday)'];
const VARA_LORDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

const YOGA_NAMES = [
  'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shoola',
  'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
  'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
];

const CHARA_KARANAS = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)'];

const HINDU_MASA_NAMES = [
  'Chaitra',     // 0: Mesha
  'Vaishakha',   // 1: Vrishabha
  'Jyeshtha',    // 2: Mithuna
  'Ashadha',     // 3: Karka
  'Shravana',    // 4: Simha
  'Bhadrapada',  // 5: Kanya
  'Ashvina',     // 6: Tula
  'Kartika',     // 7: Vrishchika
  'Margashirsha',// 8: Dhanu
  'Pausha',      // 9: Makara
  'Magha',       // 10: Kumbha
  'Phalguna'     // 11: Meena
];

// Rahu Kalam Segment Index (1 to 8) by Day of Week (0 = Sun, 1 = Mon, ..., 6 = Sat)
const RAHU_SEGMENT: Record<number, number> = {
  0: 8, // Sunday: 8th segment
  1: 2, // Monday: 2nd segment
  2: 7, // Tuesday: 7th segment
  3: 5, // Wednesday: 5th segment
  4: 6, // Thursday: 6th segment
  5: 4, // Friday: 4th segment
  6: 3, // Saturday: 3rd segment
};

// Yamaganda Segment Index (1 to 8)
const YAMAGANDA_SEGMENT: Record<number, number> = {
  0: 5, // Sun: 5th
  1: 4, // Mon: 4th
  2: 3, // Tue: 3rd
  3: 2, // Wed: 2nd
  4: 1, // Thu: 1st
  5: 7, // Fri: 7th
  6: 6, // Sat: 6th
};

// Gulika Kalam Segment Index (1 to 8)
const GULIKA_SEGMENT: Record<number, number> = {
  0: 7, // Sun: 7th
  1: 6, // Mon: 6th
  2: 5, // Tue: 5th
  3: 4, // Wed: 4th
  4: 3, // Thu: 3rd
  5: 2, // Fri: 2nd
  6: 1, // Sat: 1st
};

// Helper to format minutes from midnight to HH:MM AM/PM string
function formatMinutesToTime(totalMinutes: number): string {
  let mins = Math.round(totalMinutes) % 1440;
  if (mins < 0) mins += 1440;
  const hours = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const mmStr = m < 10 ? `0${m}` : `${m}`;
  return `${h12 < 10 ? '0' + h12 : h12}:${mmStr} ${ampm}`;
}

// Astronomical Solar Sunrise & Sunset Calculation (in minutes from midnight)
function calculateSolarTimes(year: number, month: number, day: number, lat: number, lng: number, tzOffsetMinutes: number = 330) {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const currentDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfYear = Math.floor((currentDate.getTime() - startOfYear.getTime()) / 86400000) + 1;

  // Solar Declination delta
  const delta = 23.45 * Math.sin(rad * (360 / 365) * (dayOfYear - 81));

  // Hour Angle H for solar atmospheric refraction -0.833°
  const cosH = (Math.sin(rad * -0.833) - Math.sin(rad * lat) * Math.sin(rad * delta)) / (Math.cos(rad * lat) * Math.cos(rad * delta));
  const clampedCosH = Math.max(-1, Math.min(1, cosH));
  const H = deg * Math.acos(clampedCosH); // Hour Angle in degrees

  // Equation of Time EoT (minutes)
  const B = (360 / 365) * (dayOfYear - 81) * rad;
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  // Solar Noon (minutes from midnight)
  const solarNoonMins = 720 - 4 * lng - eot + tzOffsetMinutes;

  const sunriseMins = solarNoonMins - 4 * H;
  const sunsetMins = solarNoonMins + 4 * H;

  return { sunriseMins, sunsetMins, solarNoonMins };
}

// Astronomical Moonrise and Moonset Calculation
function calculateLunarTimes(year: number, month: number, day: number, lat: number, lng: number, sunLongDeg: number, moonLongDeg: number, sunriseMins: number, tzOffsetMinutes: number = 330) {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  // Moon-Sun elongation angle
  let elongation = (moonLongDeg - sunLongDeg) % 360;
  if (elongation < 0) elongation += 360;

  // Moon transits approx 4 minutes later for each degree of elongation
  const moonTransitMins = (sunriseMins + (elongation / 15) * 60) % 1440;

  // Approximate Moon declination
  const moonDelta = 23.44 * Math.sin(moonLongDeg * rad);
  const cosHm = (Math.sin(rad * -0.583) - Math.sin(rad * lat) * Math.sin(rad * moonDelta)) / (Math.cos(rad * lat) * Math.cos(rad * moonDelta));
  const clampedCosHm = Math.max(-1, Math.min(1, cosHm));
  const Hm = deg * Math.acos(clampedCosHm);

  const moonriseMins = (moonTransitMins - 4 * Hm + 1440) % 1440;
  const moonsetMins = (moonTransitMins + 4 * Hm) % 1440;

  return {
    moonrise: formatMinutesToTime(moonriseMins),
    moonset: formatMinutesToTime(moonsetMins)
  };
}

// Classical 60-Half-Tithi Karana Resolution
function resolveClassicalKarana(angleDiff: number): { name: string; type: 'Sthira (स्थिर)' | 'Chara (चर)'; isVishti: boolean } {
  const halfTithi = Math.floor(angleDiff / 6); // 0 to 59

  // 1. First half of Shukla Pratipada: Kintughna (Sthira)
  if (halfTithi === 0) {
    return { name: 'Kintughna (किंस्तुघ्न)', type: 'Sthira (स्थिर)', isVishti: false };
  }

  // 2. 58th half-tithi (2nd half of Krishna Chaturdashi): Shakuni (Sthira)
  if (halfTithi === 57) {
    return { name: 'Shakuni (शकुनि)', type: 'Sthira (स्थिर)', isVishti: false };
  }

  // 3. 59th half-tithi (1st half of Krishna Amavasya): Chatushpada (Sthira)
  if (halfTithi === 58) {
    return { name: 'Chatushpada (चतुष्पद)', type: 'Sthira (स्थिर)', isVishti: false };
  }

  // 4. 60th half-tithi (2nd half of Krishna Amavasya): Naga (Sthira)
  if (halfTithi === 59) {
    return { name: 'Naga (नाग)', type: 'Sthira (स्थिर)', isVishti: false };
  }

  // 5. Repeating 7 Chara Karanas cycle 8 times from halfTithi 1 to 56
  const charaIdx = (halfTithi - 1) % 7;
  const kName = CHARA_KARANAS[charaIdx];
  return {
    name: kName,
    type: 'Chara (चर)',
    isVishti: charaIdx === 6 // Vishti is Bhadra
  };
}

// Classical Bhadra Vas (Abode of Bhadra) Evaluation
function evaluateBhadraVas(moonRashiIdx: number): { vas: 'Swarga (स्वर्ग)' | 'Patala (पाताल)' | 'Mrityu Loka (पृथ्वी/मृत्युलोक)'; impact: string } {
  // Swarga: Aries (0), Taurus (1), Gemini (2), Scorpio (7)
  if ([0, 1, 2, 7].includes(moonRashiIdx)) {
    return {
      vas: 'Swarga (स्वर्ग)',
      impact: 'भद्रा का वास स्वर्गलोक में है। पृथ्वी पर इसका प्रभाव शुभ व फलदायी माना जाता है (स्वर्गे भद्रा शुभं कुर्यात्)।'
    };
  }
  // Patala: Cancer (3), Leo (4), Sagittarius (8), Pisces (11)
  if ([3, 4, 8, 11].includes(moonRashiIdx)) {
    return {
      vas: 'Patala (पाताल)',
      impact: 'भद्रा का वास पाताललोक में है। यह धन लाभ व कार्यसिद्धि कारक है (पाताले च धनागमः)।'
    };
  }
  // Mrityu Loka: Virgo (5), Libra (6), Capricorn (9), Aquarius (10)
  return {
    vas: 'Mrityu Loka (पृथ्वी/मृत्युलोक)',
    impact: 'भद्रा का वास मृत्युलोक (पृथ्वी) पर है। इस काल में विवाह, गृहप्रवेश, मुंडन, नवीन कार्य व यात्रा पूर्णतः वर्जित हैं (मृत्युलोके यदा भद्रा सर्वकार्य विनाशनी)।'
  };
}

export function calculateDailyPanchang(dateIso: string, lat: number, lng: number): PanchangData {
  const [year, month, day] = dateIso.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day, 6, 0, 0);

  const jd = getJulianDay(year, month, day, 6, 0, 0);
  const ayanamshaDeg = getLahiriAyanamsha(jd);

  const planets = calculatePlanetaryPositions(jd, ayanamshaDeg);
  const sun = planets.find((p: any) => p.planet === 'Sun')!;
  const moon = planets.find((p: any) => p.planet === 'Moon')!;

  // 1. Tithi (Sun-Moon angle difference / 12°)
  let angleDiff = moon.longitude - sun.longitude;
  if (angleDiff < 0) angleDiff += 360;

  const tithiIdx = Math.floor(angleDiff / 12);
  const paksha = tithiIdx < 15 ? 'Shukla' : 'Krishna';
  const tithiNum = (tithiIdx % 15) + 1;
  const tithiName = `${paksha} ${TITHI_NAMES[Math.min(tithiNum - 1, 14)]}`;
  const completionPercent = ((angleDiff % 12) / 12) * 100;

  // 1b. Hindu Masa (Month) Calculation
  const amantaMasaIdx = sun.rashiIndex;
  const amantaMasaName = HINDU_MASA_NAMES[amantaMasaIdx];
  const purnimantaMasaIdx = paksha === 'Krishna' ? (amantaMasaIdx + 1) % 12 : amantaMasaIdx;
  const purnimantaMasaName = HINDU_MASA_NAMES[purnimantaMasaIdx];

  // 2. Vara
  const dayOfWeek = dateObj.getDay();
  const varaName = VARA_NAMES[dayOfWeek];
  const varaLord = VARA_LORDS[dayOfWeek];

  // 3. Nakshatra
  const nakName = moon.nakshatraName;
  const nakLord = moon.nakshatraLord;
  const nakPada = moon.pada;

  // 4. Yoga
  const yogaSum = (sun.longitude + moon.longitude) % 360;
  const yogaIdx = Math.floor(yogaSum / (360 / 27));
  const yogaName = YOGA_NAMES[yogaIdx];

  // 5. Classical 60-Half-Tithi Karana Resolution
  const karanaInfo = resolveClassicalKarana(angleDiff);

  // 6. Precise Astronomical Solar Times (Sunrise & Sunset) for Lat/Lng
  const { sunriseMins, sunsetMins, solarNoonMins } = calculateSolarTimes(year, month, day, lat, lng, 330);

  const daytimeDuration = sunsetMins - sunriseMins;
  const segmentDuration = daytimeDuration / 8; // 8-fold daytime division
  const nightDuration = 1440 - daytimeDuration;

  // Real Astronomical Lunar Times
  const { moonrise, moonset } = calculateLunarTimes(year, month, day, lat, lng, sun.longitude, moon.longitude, sunriseMins, 330);

  // Ending Times Calculations (relative speed Moon-Sun ~ 0.5079°/hr, Moon ~ 0.549°/hr)
  const tithiDegreesLeft = 12 - (angleDiff % 12);
  const tithiMinutesLeft = Math.round((tithiDegreesLeft / 0.5079) * 60);
  const tithiEndingMins = (sunriseMins + tithiMinutesLeft) % 1440;

  const nakDegreesLeft = (13.333333 - (moon.longitude % 13.333333));
  const nakMinutesLeft = Math.round((nakDegreesLeft / 0.549) * 60);
  const nakEndingMins = (sunriseMins + nakMinutesLeft) % 1440;

  const yogaDegreesLeft = (13.333333 - (yogaSum % 13.333333));
  const yogaMinutesLeft = Math.round((yogaDegreesLeft / 0.590) * 60);
  const yogaEndingMins = (sunriseMins + yogaMinutesLeft) % 1440;

  const karanaDegreesLeft = 6 - (angleDiff % 6);
  const karanaMinutesLeft = Math.round((karanaDegreesLeft / 0.5079) * 60);
  const karanaEndingMins = (sunriseMins + karanaMinutesLeft) % 1440;

  // Rahu Kalam
  const rahuSeg = RAHU_SEGMENT[dayOfWeek];
  const rahuStartMins = sunriseMins + (rahuSeg - 1) * segmentDuration;
  const rahuEndMins = sunriseMins + rahuSeg * segmentDuration;

  // Yamaganda
  const yamaSeg = YAMAGANDA_SEGMENT[dayOfWeek];
  const yamaStartMins = sunriseMins + (yamaSeg - 1) * segmentDuration;
  const yamaEndMins = sunriseMins + yamaSeg * segmentDuration;

  // Gulika
  const gulikaSeg = GULIKA_SEGMENT[dayOfWeek];
  const gulikaStartMins = sunriseMins + (gulikaSeg - 1) * segmentDuration;
  const gulikaEndMins = sunriseMins + gulikaSeg * segmentDuration;

  // Abhijit Muhurat (8th Muhurat of daytime = daytimeDuration / 15)
  const muhuratDuration = daytimeDuration / 15;
  const abhijitStartMins = solarNoonMins - (muhuratDuration / 2);
  const abhijitEndMins = solarNoonMins + (muhuratDuration / 2);
  const isWednesday = dayOfWeek === 3;

  // Brahma Muhurta (2 Muhurats = 96 min before sunrise to 48 min before sunrise)
  const brahmaStartMins = sunriseMins - 96;
  const brahmaEndMins = sunriseMins - 48;

  // Amrit Kalam
  const amritStartMins = sunriseMins + 4.2 * (daytimeDuration / 8);
  const amritEndMins = amritStartMins + 90;

  // Bhadra details
  let bhadraObj = undefined;
  if (karanaInfo.isVishti) {
    const bhadraVasInfo = evaluateBhadraVas(moon.rashiIndex);
    bhadraObj = {
      isBhadraActive: true,
      bhadraVas: bhadraVasInfo.vas,
      bhadraImpact: bhadraVasInfo.impact
    };
  }

  return {
    date: dateIso,
    latitude: lat,
    longitude: lng,
    masa: {
      name: purnimantaMasaName,
      amantaName: amantaMasaName,
      purnimantaName: purnimantaMasaName,
      rashiSun: sun.rashiName
    },
    tithi: {
      number: tithiNum,
      name: tithiName,
      paksha,
      completionPercent: Math.round(completionPercent),
      endingTime: formatMinutesToTime(tithiEndingMins)
    },
    vara: {
      name: varaName,
      lord: varaLord
    },
    nakshatra: {
      name: nakName,
      lord: nakLord,
      pada: nakPada,
      endingTime: formatMinutesToTime(nakEndingMins)
    },
    yoga: {
      name: yogaName,
      endingTime: formatMinutesToTime(yogaEndingMins)
    },
    karana: {
      name: karanaInfo.name,
      type: karanaInfo.type,
      endingTime: formatMinutesToTime(karanaEndingMins)
    },
    bhadra: bhadraObj,
    solarTimes: {
      sunrise: formatMinutesToTime(sunriseMins),
      sunset: formatMinutesToTime(sunsetMins),
      moonrise,
      moonset,
      dayDurationMinutes: Math.round(daytimeDuration),
      nightDurationMinutes: Math.round(nightDuration)
    },
    muhurats: {
      rahuKalam: {
        start: formatMinutesToTime(rahuStartMins),
        end: formatMinutesToTime(rahuEndMins)
      },
      yamaganda: {
        start: formatMinutesToTime(yamaStartMins),
        end: formatMinutesToTime(yamaEndMins)
      },
      gulika: {
        start: formatMinutesToTime(gulikaStartMins),
        end: formatMinutesToTime(gulikaEndMins)
      },
      abhijit: {
        start: formatMinutesToTime(abhijitStartMins),
        end: formatMinutesToTime(abhijitEndMins),
        isProhibited: isWednesday,
        prohibitionReason: isWednesday ? 'बुधवार को अभिजीत मुहूर्त वर्जित माना गया है।' : undefined
      },
      brahmaMuhurta: {
        start: formatMinutesToTime(brahmaStartMins),
        end: formatMinutesToTime(brahmaEndMins)
      },
      amritKalam: {
        start: formatMinutesToTime(amritStartMins),
        end: formatMinutesToTime(amritEndMins)
      }
    }
  };
}
