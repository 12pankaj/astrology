import { KundliData, VimshottariDashaResult, DashaPeriod } from '@vedic-astro/types';
import { NAKSHATRA_LORDS } from '@vedic-astro/config';

const MAHADASHA_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
};

const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

export function calculateVimshottariDasha(kundli: KundliData, birthIsoDate: string): VimshottariDashaResult {
  const moon = kundli.planets.find((p) => p.planet === 'Moon')!;
  const moonLord = moon.nakshatraLord;
  const startIdx = DASHA_ORDER.indexOf(moonLord);

  // Fraction of Nakshatra remaining
  const nakshatraSpan = 360 / 27; // 13.3333 degrees
  const moonDegInNak = moon.longitude % nakshatraSpan;
  const fractionElapsed = moonDegInNak / nakshatraSpan;
  const fractionRemaining = 1 - fractionElapsed;

  const birthDate = new Date(birthIsoDate);
  let currentDate = new Date(birthDate);

  const initialDashaYears = MAHADASHA_YEARS[moonLord] * fractionRemaining;
  const timeline: DashaPeriod[] = [];

  for (let i = 0; i < 9; i++) {
    const lordIdx = (startIdx + i) % 9;
    const lord = DASHA_ORDER[lordIdx];
    const duration = i === 0 ? initialDashaYears : MAHADASHA_YEARS[lord];

    const startDate = new Date(currentDate);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + Math.floor(duration));
    endDate.setMonth(endDate.getMonth() + Math.floor((duration % 1) * 12));

    // 2nd Level: Antardasha
    const subPeriods: DashaPeriod[] = [];
    let subCurrentDate = new Date(startDate);

    for (let j = 0; j < 9; j++) {
      const subLordIdx = (lordIdx + j) % 9;
      const subLord = DASHA_ORDER[subLordIdx];
      const subDurationYears = (MAHADASHA_YEARS[lord] * MAHADASHA_YEARS[subLord]) / 120;

      const subStartDate = new Date(subCurrentDate);
      const subEndDate = new Date(subStartDate);
      subEndDate.setDate(subEndDate.getDate() + Math.floor(subDurationYears * 365.25));

      // 3rd Level: Pratyantardasha
      const pratyantarPeriods: DashaPeriod[] = [];
      let pratCurrentDate = new Date(subStartDate);

      for (let k = 0; k < 9; k++) {
        const pratLordIdx = (subLordIdx + k) % 9;
        const pratLord = DASHA_ORDER[pratLordIdx];
        const pratDurationDays = (subDurationYears * 365.25 * MAHADASHA_YEARS[pratLord]) / 120;

        const pratStartDate = new Date(pratCurrentDate);
        const pratEndDate = new Date(pratStartDate);
        pratEndDate.setDate(pratEndDate.getDate() + Math.floor(pratDurationDays));

        // 4th Level: Sukshmadasha
        const sukshmaPeriods: DashaPeriod[] = [];
        let sukCurrentDate = new Date(pratStartDate);

        for (let l = 0; l < 9; l++) {
          const sukLordIdx = (pratLordIdx + l) % 9;
          const sukLord = DASHA_ORDER[sukLordIdx];
          const sukDurationDays = (pratDurationDays * MAHADASHA_YEARS[sukLord]) / 120;

          const sukStartDate = new Date(sukCurrentDate);
          const sukEndDate = new Date(sukStartDate);
          sukEndDate.setHours(sukEndDate.getHours() + Math.floor(sukDurationDays * 24));

          sukshmaPeriods.push({
            planet: sukLord,
            startDate: sukStartDate.toISOString().split('T')[0],
            endDate: sukEndDate.toISOString().split('T')[0],
            durationYears: sukDurationDays / 365.25
          });

          sukCurrentDate = sukEndDate;
        }

        pratyantarPeriods.push({
          planet: pratLord,
          startDate: pratStartDate.toISOString().split('T')[0],
          endDate: pratEndDate.toISOString().split('T')[0],
          durationYears: pratDurationDays / 365.25,
          subPeriods: sukshmaPeriods
        });

        pratCurrentDate = pratEndDate;
      }

      subPeriods.push({
        planet: subLord,
        startDate: subStartDate.toISOString().split('T')[0],
        endDate: subEndDate.toISOString().split('T')[0],
        durationYears: subDurationYears,
        subPeriods: pratyantarPeriods
      });

      subCurrentDate = subEndDate;
    }

    timeline.push({
      planet: lord,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      durationYears: duration,
      subPeriods
    });

    currentDate = endDate;
  }

  const now = new Date();
  const currentMaha = timeline.find((t) => new Date(t.startDate) <= now && now <= new Date(t.endDate)) || timeline[0];
  const currentAntar = currentMaha.subPeriods?.find((s) => new Date(s.startDate) <= now && now <= new Date(s.endDate)) || currentMaha.subPeriods?.[0];
  const currentPrat = currentAntar?.subPeriods?.find((p) => new Date(p.startDate) <= now && now <= new Date(p.endDate)) || currentAntar?.subPeriods?.[0];

  return {
    currentMahadasha: currentMaha.planet,
    currentAntardasha: currentAntar?.planet || currentMaha.planet,
    currentPratyantardasha: currentPrat?.planet || 'Mercury',
    dashaBalanceAtBirthYears: initialDashaYears,
    timeline
  };
}
