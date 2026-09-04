import React from 'react';
import { KundliData } from '@vedic-astro/types';
import { PLANET_SYMBOLS_BILINGUAL } from '@vedic-astro/config';

interface NorthIndianChartProps {
  kundli: KundliData;
  width?: number;
  height?: number;
  chartData?: any; // For Divisional Charts (D1 - D60)
}

export const NorthIndianChart: React.FC<NorthIndianChartProps> = ({
  kundli,
  width = 400,
  height = 400,
  chartData
}) => {
  const lagnaRashiIdx = kundli.lagnaRashiIndex;

  // Map planets by house (1 to 12)
  const planetsByHouse: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) planetsByHouse[i] = [];

  const planetList = chartData ? chartData.placements : kundli.planets;

  planetList.forEach((p: any) => {
    const rawName = p.planet || 'Planet';
    const biSymbol = PLANET_SYMBOLS_BILINGUAL[rawName] || rawName.substring(0, 2);
    const isRetro = p.isRetrograde ? '(R)' : '';
    const symbol = `${biSymbol}${isRetro}`;
    const h = p.house || 1;
    if (planetsByHouse[h]) {
      planetsByHouse[h].push(symbol);
    }
  });

  // Coordinates for House Rashi Numbers and Planets for all 12 Houses in North Indian Diamond Chart
  const houseCoords = [
    { house: 1,  numX: 200, numY: 155, textX: 200, textY: 105 }, // Top Center Diamond
    { house: 2,  numX: 110, numY: 75,  textX: 100, textY: 45 },  // Top Left Triangle
    { house: 3,  numX: 75,  numY: 110, textX: 45,  textY: 100 }, // Upper Left Triangle
    { house: 4,  numX: 155, numY: 200, textX: 100, textY: 200 }, // Left Center Diamond
    { house: 5,  numX: 75,  numY: 290, textX: 45,  textY: 300 }, // Lower Left Triangle
    { house: 6,  numX: 110, numY: 325, textX: 100, textY: 355 }, // Bottom Left Triangle
    { house: 7,  numX: 200, numY: 245, textX: 200, textY: 295 }, // Bottom Center Diamond
    { house: 8,  numX: 290, numY: 325, textX: 300, textY: 355 }, // Bottom Right Triangle
    { house: 9,  numX: 325, numY: 290, textX: 355, textY: 300 }, // Lower Right Triangle
    { house: 10, numX: 245, numY: 200, textX: 300, textY: 200 }, // Right Center Diamond
    { house: 11, numX: 325, numY: 110, textX: 355, textY: 100 }, // Upper Right Triangle
    { house: 12, numX: 290, numY: 75,  textX: 300, textY: 45 },  // Top Right Triangle
  ];

  return (
    <div style={{ position: 'relative', width, height, margin: '0 auto' }}>
      <svg width={width} height={height} viewBox="0 0 400 400" style={{ background: '#0D111A', borderRadius: '12px', border: '1px solid #332815' }}>
        {/* Outer Square Border */}
        <rect x="10" y="10" width="380" height="380" fill="none" stroke="#D4AF37" strokeWidth="2" />
        
        {/* Main Diagonals */}
        <line x1="10" y1="10" x2="390" y2="390" stroke="#D4AF37" strokeWidth="1.5" />
        <line x1="390" y1="10" x2="10" y2="390" stroke="#D4AF37" strokeWidth="1.5" />

        {/* Inner Diamond Lines */}
        <line x1="200" y1="10" x2="10" y2="200" stroke="#D4AF37" strokeWidth="1.5" />
        <line x1="10" y1="200" x2="200" y2="390" stroke="#D4AF37" strokeWidth="1.5" />
        <line x1="200" y1="390" x2="390" y2="200" stroke="#D4AF37" strokeWidth="1.5" />
        <line x1="390" y1="200" x2="200" y2="10" stroke="#D4AF37" strokeWidth="1.5" />

        {/* Render House Rashi Numbers and All 9 Grahas for all 12 Houses */}
        {houseCoords.map((hInfo) => {
          const rashiNumber = ((lagnaRashiIdx + hInfo.house - 1) % 12) + 1;
          const planetsInHouse = planetsByHouse[hInfo.house] || [];
          const houseText = hInfo.house === 1 ? `Lag ${planetsInHouse.join(' ')}` : planetsInHouse.join(' ');

          return (
            <g key={hInfo.house}>
              {/* House Rashi Number */}
              <text x={hInfo.numX} y={hInfo.numY} fill="#FFD700" fontSize="12" textAnchor="middle" fontWeight="bold">
                {rashiNumber}
              </text>
              {/* Planets in House */}
              <text x={hInfo.textX} y={hInfo.textY} fill="#E2E8F0" fontSize="11" textAnchor="middle" fontWeight="600">
                {houseText}
              </text>
            </g>
          );
        })}

        <text x="200" y="385" fill="#94A3B8" fontSize="10" textAnchor="middle">
          {chartData ? chartData.name : 'D1 Rashi Kundli'} (North Indian)
        </text>
      </svg>
    </div>
  );
};
