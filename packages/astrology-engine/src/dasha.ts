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
const MS_PER_YEAR = 365.2425 * 86400000;

function toIsoDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function calculateVimshottariDasha(kundli: KundliData, birthIsoDate: string): VimshottariDashaResult {
  const moon = kundli.planets.find((p) => p.planet === 'Moon')!;
  const moonLord = moon.nakshatraLord;
  const startIdx = DASHA_ORDER.indexOf(moonLord);

  // Fraction of Nakshatra remaining at birth
  const nakshatraSpan = 360 / 27; // 13°20' = 13.333333°
  const moonDegInNak = moon.longitude % nakshatraSpan;
  const fractionElapsed = moonDegInNak / nakshatraSpan;
  const fractionRemaining = 1 - fractionElapsed;

  const birthDate = new Date(birthIsoDate);
  const birthTimeMs = birthDate.getTime();

  const timeline: DashaPeriod[] = [];

  // Total duration of birth Mahadasha
  const firstMahaLord = moonLord;
  const firstMahaTotalYears = MAHADASHA_YEARS[firstMahaLord];
  const firstMahaElapsedYears = firstMahaTotalYears * fractionElapsed;
  const firstMahaRemainingYears = firstMahaTotalYears * fractionRemaining;

  // True start date of the first Mahadasha before birth
  const firstMahaStartMs = birthTimeMs - firstMahaElapsedYears * MS_PER_YEAR;

  let currentMahaStartMs = firstMahaStartMs;

  for (let i = 0; i < 9; i++) {
    const lordIdx = (startIdx + i) % 9;
    const lord = DASHA_ORDER[lordIdx];
    const fullMahaYears = MAHADASHA_YEARS[lord];
    const fullMahaEndMs = currentMahaStartMs + fullMahaYears * MS_PER_YEAR;

    // For the birth Mahadasha, display starts from birth date
    const displayStartMs = i === 0 ? birthTimeMs : currentMahaStartMs;
    const displayDurationYears = (fullMahaEndMs - displayStartMs) / MS_PER_YEAR;

    // Compute Antardashas (Sub-periods)
    const subPeriods: DashaPeriod[] = [];
    let currentAntarStartMs = currentMahaStartMs;

    for (let j = 0; j < 9; j++) {
      const subLordIdx = (lordIdx + j) % 9;
      const subLord = DASHA_ORDER[subLordIdx];
      const antarDurationYears = (fullMahaYears * MAHADASHA_YEARS[subLord]) / 120;
      const antarEndMs = currentAntarStartMs + antarDurationYears * MS_PER_YEAR;

      // Check if this Antardasha is relevant for the native's lifetime
      if (antarEndMs > birthTimeMs) {
        const displayAntarStartMs = Math.max(currentAntarStartMs, birthTimeMs);
        const displayAntarDurationYears = (antarEndMs - displayAntarStartMs) / MS_PER_YEAR;

        // Compute Pratyantardashas (3rd level)
        const pratyantarPeriods: DashaPeriod[] = [];
        let currentPratStartMs = currentAntarStartMs;

        for (let k = 0; k < 9; k++) {
          const pratLordIdx = (subLordIdx + k) % 9;
          const pratLord = DASHA_ORDER[pratLordIdx];
          const pratDurationYears = (antarDurationYears * MAHADASHA_YEARS[pratLord]) / 120;
          const pratEndMs = currentPratStartMs + pratDurationYears * MS_PER_YEAR;

          if (pratEndMs > birthTimeMs) {
            const displayPratStartMs = Math.max(currentPratStartMs, birthTimeMs);
            const displayPratDurationYears = (pratEndMs - displayPratStartMs) / MS_PER_YEAR;

            // Sukshmadashas (4th level)
            const sukshmaPeriods: DashaPeriod[] = [];
            let currentSukStartMs = currentPratStartMs;

            for (let l = 0; l < 9; l++) {
              const sukLordIdx = (pratLordIdx + l) % 9;
              const sukLord = DASHA_ORDER[sukLordIdx];
              const sukDurationYears = (pratDurationYears * MAHADASHA_YEARS[sukLord]) / 120;
              const sukEndMs = currentSukStartMs + sukDurationYears * MS_PER_YEAR;

              if (sukEndMs > birthTimeMs) {
                const displaySukStartMs = Math.max(currentSukStartMs, birthTimeMs);
                sukshmaPeriods.push({
                  planet: sukLord,
                  startDate: toIsoDate(new Date(displaySukStartMs)),
                  endDate: toIsoDate(new Date(sukEndMs)),
                  durationYears: (sukEndMs - displaySukStartMs) / MS_PER_YEAR
                });
              }
              currentSukStartMs = sukEndMs;
            }

            pratyantarPeriods.push({
              planet: pratLord,
              startDate: toIsoDate(new Date(displayPratStartMs)),
              endDate: toIsoDate(new Date(pratEndMs)),
              durationYears: displayPratDurationYears,
              subPeriods: sukshmaPeriods
            });
          }

          currentPratStartMs = pratEndMs;
        }

        subPeriods.push({
          planet: subLord,
          startDate: toIsoDate(new Date(displayAntarStartMs)),
          endDate: toIsoDate(new Date(antarEndMs)),
          durationYears: displayAntarDurationYears,
          subPeriods: pratyantarPeriods
        });
      }

      currentAntarStartMs = antarEndMs;
    }

    timeline.push({
      planet: lord,
      startDate: toIsoDate(new Date(displayStartMs)),
      endDate: toIsoDate(new Date(fullMahaEndMs)),
      durationYears: displayDurationYears,
      subPeriods
    });

    currentMahaStartMs = fullMahaEndMs;
  }

  const now = new Date();
  const currentMaha = timeline.find((t) => new Date(t.startDate) <= now && now <= new Date(t.endDate)) || timeline[0];
  const currentAntar = currentMaha.subPeriods?.find((s) => new Date(s.startDate) <= now && now <= new Date(s.endDate)) || currentMaha.subPeriods?.[0];
  const currentPrat = currentAntar?.subPeriods?.find((p) => new Date(p.startDate) <= now && now <= new Date(p.endDate)) || currentAntar?.subPeriods?.[0];

  return {
    currentMahadasha: currentMaha.planet,
    currentAntardasha: currentAntar?.planet || currentMaha.planet,
    currentPratyantardasha: currentPrat?.planet || 'Mercury',
    dashaBalanceAtBirthYears: firstMahaRemainingYears,
    timeline
  };
}
