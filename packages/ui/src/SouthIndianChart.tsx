import React from 'react';
import { KundliData } from '@vedic-astro/types';
import { RASHI_NAMES } from '@vedic-astro/config';

interface SouthIndianChartProps {
  kundli: KundliData;
  width?: number;
  height?: number;
}

export const SouthIndianChart: React.FC<SouthIndianChartProps> = ({
  kundli,
  width = 400,
  height = 400
}) => {
  // Grid layout mapping for South Indian Chart (Fixed Signs)
  // 12 Boxes around a 4x4 outer grid
  const gridCells = [
    { rashiIdx: 11, x: 0, y: 0 },   // Meena
    { rashiIdx: 0,  x: 1, y: 0 },   // Mesha
    { rashiIdx: 1,  x: 2, y: 0 },   // Vrishabha
    { rashiIdx: 2,  x: 3, y: 0 },   // Mithuna
    { rashiIdx: 10, x: 0, y: 1 },   // Kumbha
    { rashiIdx: 3,  x: 3, y: 1 },   // Karka
    { rashiIdx: 9,  x: 0, y: 2 },   // Makara
    { rashiIdx: 4,  x: 3, y: 2 },   // Simha
    { rashiIdx: 8,  x: 0, y: 3 },   // Dhanu
    { rashiIdx: 7,  x: 1, y: 3 },   // Vrishchika
    { rashiIdx: 6,  x: 2, y: 3 },   // Tula
    { rashiIdx: 5,  x: 3, y: 3 },   // Kanya
  ];

  const cellWidth = width / 4;
  const cellHeight = height / 4;

  const planetsByRashi: Record<number, string[]> = {};
  for (let i = 0; i < 12; i++) planetsByRashi[i] = [];

  kundli.planets.forEach((p) => {
    planetsByRashi[p.rashiIndex].push(p.planet.substring(0, 2));
  });

  return (
    <div style={{ position: 'relative', width, height, margin: '0 auto' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ background: '#0D111A', borderRadius: '12px', border: '1px solid #332815' }}>
        {/* Grid Box Lines */}
        {gridCells.map((cell, idx) => {
          const cx = cell.x * cellWidth;
          const cy = cell.y * cellHeight;
          const isLagna = cell.rashiIdx === kundli.lagnaRashiIndex;

          return (
            <g key={idx}>
              <rect
                x={cx}
                y={cy}
                width={cellWidth}
                height={cellHeight}
                fill={isLagna ? '#1E1B0E' : 'none'}
                stroke="#D4AF37"
                strokeWidth="1"
              />
              <text x={cx + 6} y={cy + 16} fill="#FFD700" fontSize="10" fontWeight="bold">
                {RASHI_NAMES[cell.rashiIdx]} {isLagna ? '(Asc)' : ''}
              </text>
              <text x={cx + 6} y={cy + 36} fill="#E2E8F0" fontSize="11">
                {planetsByRashi[cell.rashiIdx]?.join(' ')}
              </text>
            </g>
          );
        })}

        {/* Center Title Box */}
        <rect x={cellWidth} y={cellHeight} width={cellWidth * 2} height={cellHeight * 2} fill="#06090F" stroke="#D4AF37" strokeWidth="1" />
        <text x={width / 2} y={height / 2} fill="#D4AF37" fontSize="14" fontWeight="bold" textAnchor="middle">
          South Indian Chart
        </text>
      </svg>
    </div>
  );
};
