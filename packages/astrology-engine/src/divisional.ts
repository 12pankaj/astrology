import { KundliData, DivisionalChart } from '@vedic-astro/types';
import { RASHI_NAMES } from '@vedic-astro/config';

function calculateDivisionalRashi(rashiIndex: number, degreeInSign: number, type: string): number {
  if (type === 'D9') {
    const navIdx = Math.min(8, Math.floor(degreeInSign / (30 / 9)));
    if ([0, 4, 8].includes(rashiIndex)) return (0 + navIdx) % 12;
    if ([1, 5, 9].includes(rashiIndex)) return (9 + navIdx) % 12;
    if ([2, 6, 10].includes(rashiIndex)) return (6 + navIdx) % 12;
    return (3 + navIdx) % 12;
  }
  if (type === 'D10') {
    const dashIdx = Math.min(9, Math.floor(degreeInSign / (30 / 10)));
    if (rashiIndex % 2 === 0) return (rashiIndex + dashIdx) % 12;
    return (rashiIndex + 8 + dashIdx) % 12;
  }
  if (type === 'D2') {
    const isOdd = rashiIndex % 2 === 0;
    if (degreeInSign < 15) return isOdd ? 4 : 3;
    return isOdd ? 3 : 4;
  }
  if (type === 'D3') {
    const decan = Math.min(2, Math.floor(degreeInSign / 10));
    return (rashiIndex + decan * 4) % 12;
  }
  if (type === 'D4') {
    const part = Math.min(3, Math.floor(degreeInSign / 7.5));
    return (rashiIndex + part * 3) % 12;
  }
  if (type === 'D7') {
    const part = Math.min(6, Math.floor(degreeInSign / (30 / 7)));
    const start = rashiIndex % 2 === 0 ? rashiIndex : (rashiIndex + 6) % 12;
    return (start + part) % 12;
  }
  if (type === 'D12') {
    const part = Math.min(11, Math.floor(degreeInSign / 2.5));
    return (rashiIndex + part) % 12;
  }
  if (type === 'D16') {
    const part = Math.min(15, Math.floor(degreeInSign / 1.875));
    const start = [0, 3, 6, 9].includes(rashiIndex) ? 0 : [1, 4, 7, 10].includes(rashiIndex) ? 4 : 8;
    return (start + part) % 12;
  }
  if (type === 'D20') {
    const part = Math.min(19, Math.floor(degreeInSign / 1.5));
    const start = [0, 3, 6, 9].includes(rashiIndex) ? 0 : [1, 4, 7, 10].includes(rashiIndex) ? 8 : 4;
    return (start + part) % 12;
  }
  if (type === 'D24') {
    const part = Math.min(23, Math.floor(degreeInSign / 1.25));
    const start = rashiIndex % 2 === 0 ? 4 : 3;
    return (start + part) % 12;
  }
  if (type === 'D27') {
    const part = Math.min(26, Math.floor(degreeInSign / (30 / 27)));
    const start = [0, 4, 8].includes(rashiIndex) ? 0 : [1, 5, 9].includes(rashiIndex) ? 3 : [2, 6, 10].includes(rashiIndex) ? 6 : 9;
    return (start + part) % 12;
  }
  if (type === 'D30') {
    const isOdd = rashiIndex % 2 === 0;
    if (isOdd) {
      if (degreeInSign < 5) return 0;   // Aries (Mars)
      if (degreeInSign < 10) return 10; // Aquarius (Saturn)
      if (degreeInSign < 18) return 8;  // Sagittarius (Jupiter)
      if (degreeInSign < 25) return 2;  // Gemini (Mercury)
      return 6;                         // Libra (Venus)
    } else {
      if (degreeInSign < 5) return 1;   // Taurus (Venus)
      if (degreeInSign < 12) return 5;  // Virgo (Mercury)
      if (degreeInSign < 20) return 11; // Pisces (Jupiter)
      if (degreeInSign < 25) return 9;  // Capricorn (Saturn)
      return 7;                         // Scorpio (Mars)
    }
  }
  if (type === 'D40') {
    const part = Math.min(39, Math.floor(degreeInSign / 0.75));
    const start = rashiIndex % 2 === 0 ? 0 : 6;
    return (start + part) % 12;
  }
  if (type === 'D45') {
    const part = Math.min(44, Math.floor(degreeInSign / (30 / 45)));
    const start = [0, 3, 6, 9].includes(rashiIndex) ? 0 : [1, 4, 7, 10].includes(rashiIndex) ? 4 : 8;
    return (start + part) % 12;
  }
  if (type === 'D60') {
    const part = Math.min(59, Math.floor(degreeInSign / 0.5));
    // Classical Parashari: Odd signs start from sign itself, Even signs from 9th sign
    const start = rashiIndex % 2 === 0 ? rashiIndex : (rashiIndex + 8) % 12;
    return (start + part) % 12;
  }
  return rashiIndex;
}

export function calculateDivisionalCharts(kundli: KundliData): DivisionalChart[] {
  const chartTypes: DivisionalChart['chartType'][] = [
    'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'
  ];

  return chartTypes.map((type) => {
    let name = 'Rashi Chart';
    if (type === 'D9') name = 'Navamsha Chart';
    else if (type === 'D10') name = 'Dashamsha Chart';
    else if (type === 'D60') name = 'Shashtiamsha Chart';
    else name = `${type} Divisional Chart`;

    const lagnaDegInSign = (kundli.lagnaDegree % 30);
    const divLagnaRashiIdx = calculateDivisionalRashi(kundli.lagnaRashiIndex, lagnaDegInSign, type);

    const planetPlacements = kundli.planets.map((p) => {
      const divRashiIdx = calculateDivisionalRashi(p.rashiIndex, p.degreeInSign, type);
      let house = ((divRashiIdx - divLagnaRashiIdx + 12) % 12) + 1;

      return {
        planet: p.planet,
        rashiIndex: divRashiIdx,
        rashiName: RASHI_NAMES[divRashiIdx],
        house
      };
    });

    const placements = [
      {
        planet: 'Lagna',
        rashiIndex: divLagnaRashiIdx,
        rashiName: RASHI_NAMES[divLagnaRashiIdx],
        house: 1
      },
      ...planetPlacements
    ];

    return {
      chartType: type,
      name,
      placements
    };
  });
}
