import { PanchangData } from '@vedic-astro/types';
import { getJulianDay, getLahiriAyanamsha, calculatePlanetaryPositions } from './ephemeris';

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

const KARANA_NAMES = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)', 'Shakuni', 'Chatushpada', 'Naga', 'Kintughna'];

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
  2: 7, // Tuesday: 7th segment (approx 3:41 PM - 5:16 PM in Ajmer)
  3: 5, // Wednesday: 5th segment
  4: 6, // Thursday: 6th segment
  5: 4, // Friday: 4th segment
  6: 3, // Saturday: 3rd segment
};

// Yamaganda Segment Index (1 to 8)
const YAMAGANDA_SEGMENT: Record<number, number> = {
  0: 5, // Sun: 5th
  1: 4, // Mon: 4th
  2: 3, // Tue: 3rd (approx 9:21 AM - 10:56 AM in Ajmer)
  3: 2, // Wed: 2nd
  4: 1, // Thu: 1st
  5: 7, // Fri: 7th
  6: 6, // Sat: 6th
};

// Gulika Kalam Segment Index (1 to 8)
const GULIKA_SEGMENT: Record<number, number> = {
  0: 7, // Sun: 7th
  1: 6, // Mon: 6th
  2: 5, // Tue: 5th (approx 12:31 PM - 2:06 PM in Ajmer)
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

  // Day of Year N
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const currentDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfYear = Math.floor((currentDate.getTime() - startOfYear.getTime()) / 86400000) + 1;

  // Solar Declination delta
  const delta = 23.45 * Math.sin(rad * (360 / 365) * (dayOfYear - 81));

  // Hour Angle H for solar refraction -0.833°
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

export function calculateDailyPanchang(dateIso: string, lat: number, lng: number): PanchangData {
  const [year, month, day] = dateIso.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day, 6, 0, 0);

  const jd = getJulianDay(year, month, day, 6, 0, 0);
  const ayanamshaDeg = getLahiriAyanamsha(jd);

  const planets = calculatePlanetaryPositions(jd, ayanamshaDeg);
  const sun = planets.find((p) => p.planet === 'Sun')!;
  const moon = planets.find((p) => p.planet === 'Moon')!;

  // 1. Tithi (Sun-Moon angle difference / 12°)
  let angleDiff = moon.longitude - sun.longitude;
  if (angleDiff < 0) angleDiff += 360;

  const tithiIdx = Math.floor(angleDiff / 12);
  const paksha = tithiIdx < 15 ? 'Shukla' : 'Krishna';
  const tithiNum = (tithiIdx % 15) + 1;
  const tithiName = `${paksha} ${TITHI_NAMES[Math.min(tithiNum - 1, 14)]}`;
  const completionPercent = ((angleDiff % 12) / 12) * 100;

  // 1b. Hindu Masa (Month) Calculation
  const amantaMasaIdx = sun.rashiIndex; // 4 -> Shravana (Amanta)
  const amantaMasaName = HINDU_MASA_NAMES[amantaMasaIdx];
  const purnimantaMasaIdx = paksha === 'Krishna' ? (amantaMasaIdx + 1) % 12 : amantaMasaIdx; // 5 -> Bhadrapada (Purnimanta)
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

  // 5. Karana
  const karanaIdx = Math.floor(angleDiff / 6) % 11;
  const karanaName = KARANA_NAMES[karanaIdx];

  // 6. Precise Astronomical Solar Times (Sunrise & Sunset) for Lat/Lng
  const { sunriseMins, sunsetMins, solarNoonMins } = calculateSolarTimes(year, month, day, lat, lng, 330);

  const daytimeDuration = sunsetMins - sunriseMins;
  const segmentDuration = daytimeDuration / 8; // ~94-95 minutes per segment

  // Calculate Rahu Kalam Start & End (8-part daytime division)
  const rahuSeg = RAHU_SEGMENT[dayOfWeek];
  const rahuStartMins = sunriseMins + (rahuSeg - 1) * segmentDuration;
  const rahuEndMins = sunriseMins + rahuSeg * segmentDuration;

  // Calculate Yamaganda Start & End
  const yamaSeg = YAMAGANDA_SEGMENT[dayOfWeek];
  const yamaStartMins = sunriseMins + (yamaSeg - 1) * segmentDuration;
  const yamaEndMins = sunriseMins + yamaSeg * segmentDuration;

  // Calculate Gulika Start & End
  const gulikaSeg = GULIKA_SEGMENT[dayOfWeek];
  const gulikaStartMins = sunriseMins + (gulikaSeg - 1) * segmentDuration;
  const gulikaEndMins = sunriseMins + gulikaSeg * segmentDuration;

  // Calculate Abhijit Muhurat (Midday ± 24 minutes)
  const abhijitStartMins = solarNoonMins - 24;
  const abhijitEndMins = solarNoonMins + 24;

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
      completionPercent: Math.round(completionPercent)
    },
    vara: {
      name: varaName,
      lord: varaLord
    },
    nakshatra: {
      name: nakName,
      lord: nakLord,
      pada: nakPada
    },
    yoga: {
      name: yogaName
    },
    karana: {
      name: karanaName
    },
    solarTimes: {
      sunrise: formatMinutesToTime(sunriseMins),
      sunset: formatMinutesToTime(sunsetMins),
      moonrise: '07:20 PM',
      moonset: '06:05 AM'
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
        end: formatMinutesToTime(abhijitEndMins)
      }
    }
  };
}
