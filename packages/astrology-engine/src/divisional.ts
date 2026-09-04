import { KundliData, DivisionalChart } from '@vedic-astro/types';
import { RASHI_NAMES } from '@vedic-astro/config';

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

    const placements = kundli.planets.map((p) => {
      let divRashiIdx = p.rashiIndex;

      if (type === 'D9') {
        // D9 Navamsha calculation algorithm (9 divisions per sign = 3°20' each)
        const navIdx = Math.floor(p.degreeInSign / (30 / 9));
        if ([0, 4, 8].includes(p.rashiIndex)) {
          // Fire signs: start from Aries (0)
          divRashiIdx = (0 + navIdx) % 12;
        } else if ([1, 5, 9].includes(p.rashiIndex)) {
          // Earth signs: start from Capricorn (9)
          divRashiIdx = (9 + navIdx) % 12;
        } else if ([2, 6, 10].includes(p.rashiIndex)) {
          // Air signs: start from Libra (6)
          divRashiIdx = (6 + navIdx) % 12;
        } else {
          // Water signs: start from Cancer (3)
          divRashiIdx = (3 + navIdx) % 12;
        }
      } else if (type === 'D10') {
        // D10 Dashamsha calculation algorithm
        const dashIdx = Math.floor(p.degreeInSign / (30 / 10));
        if (p.rashiIndex % 2 === 0) {
          // Odd signs
          divRashiIdx = (p.rashiIndex + dashIdx) % 12;
        } else {
          // Even signs
          divRashiIdx = ((p.rashiIndex + 8) + dashIdx) % 12;
        }
      }

      let house = divRashiIdx - kundli.lagnaRashiIndex + 1;
      if (house <= 0) house += 12;

      return {
        planet: p.planet,
        rashiIndex: divRashiIdx,
        rashiName: RASHI_NAMES[divRashiIdx],
        house
      };
    });

    return {
      chartType: type,
      name,
      placements
    };
  });
}
