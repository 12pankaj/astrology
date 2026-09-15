import { FullKundliReportData } from './reportGenerator.js';
import { PLANET_SYMBOLS_BILINGUAL } from '@vedic-astro/config';

// Helper to generate self-contained SVG North Indian Diamond Kundli Chart
export function renderNorthIndianSvg(
  lagnaRashiIdx: number,
  planets: Array<{ planet: string; house: number; isRetrograde?: boolean }>,
  title: string = 'D1 लग्न कुंडली',
  size: number = 360
): string {
  const planetsByHouse: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) planetsByHouse[i] = [];

  planets.forEach((p) => {
    const rawName = p.planet;
    let biSymbol = PLANET_SYMBOLS_BILINGUAL[rawName] || rawName.substring(0, 2);
    if (rawName === 'Lagna') biSymbol = 'ल./Asc';
    if (rawName === 'Uranus') biSymbol = 'यू/Ur';
    if (rawName === 'Neptune') biSymbol = 'ने/Ne';
    if (rawName === 'Pluto') biSymbol = 'प्ल/Pl';
    const retro = p.isRetrograde ? '(R)' : '';
    const h = p.house || 1;
    if (planetsByHouse[h]) {
      planetsByHouse[h].push(`${biSymbol}${retro}`);
    }
  });

  const houseCoords = [
    { house: 1,  numX: 180, numY: 140, textX: 180, textY: 95 },  // Top Center Diamond
    { house: 2,  numX: 100, numY: 65,  textX: 90,  textY: 40 },  // Top Left Triangle
    { house: 3,  numX: 65,  numY: 100, textX: 40,  textY: 90 },  // Upper Left Triangle
    { house: 4,  numX: 140, numY: 180, textX: 90,  textY: 180 }, // Left Center Diamond
    { house: 5,  numX: 65,  numY: 260, textX: 40,  textY: 270 }, // Lower Left Triangle
    { house: 6,  numX: 100, numY: 295, textX: 90,  textY: 320 }, // Bottom Left Triangle
    { house: 7,  numX: 180, numY: 220, textX: 180, textY: 265 }, // Bottom Center Diamond
    { house: 8,  numX: 260, numY: 295, textX: 270, textY: 320 }, // Bottom Right Triangle
    { house: 9,  numX: 295, numY: 260, textX: 320, textY: 270 }, // Lower Right Triangle
    { house: 10, numX: 220, numY: 180, textX: 270, textY: 180 }, // Right Center Diamond
    { house: 11, numX: 295, numY: 100, textX: 320, textY: 90 },  // Upper Right Triangle
    { house: 12, numX: 260, numY: 65,  textX: 270, textY: 40 },  // Top Right Triangle
  ];

  const houseElements = houseCoords
    .map((hInfo) => {
      const rashiNumber = ((lagnaRashiIdx + hInfo.house - 1) % 12) + 1;
      const pList = planetsByHouse[hInfo.house] || [];
      const houseText = hInfo.house === 1 && pList.length === 0 ? 'लग्न (Lagna)' : pList.join(' ');
      return `
      <g>
        <text x="${hInfo.numX}" y="${hInfo.numY}" fill="#D4AF37" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">${rashiNumber}</text>
        <text x="${hInfo.textX}" y="${hInfo.textY}" fill="#F1F5F9" font-size="10" font-family="sans-serif" font-weight="600" text-anchor="middle">${houseText}</text>
      </g>`;
    })
    .join('\n');

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg" style="background:#0F172A; border-radius:12px; border:2px solid #D4AF37; box-shadow:0 4px 15px rgba(0,0,0,0.3); margin:0 auto; display:block;">
    <!-- Outer Border -->
    <rect x="8" y="8" width="344" height="344" fill="none" stroke="#D4AF37" stroke-width="2.5"/>
    <!-- Main Diagonals -->
    <line x1="8" y1="8" x2="352" y2="352" stroke="#D4AF37" stroke-width="1.5"/>
    <line x1="352" y1="8" x2="8" y2="352" stroke="#D4AF37" stroke-width="1.5"/>
    <!-- Inner Diamond -->
    <line x1="180" y1="8" x2="8" y2="180" stroke="#D4AF37" stroke-width="1.5"/>
    <line x1="8" y1="180" x2="180" y2="352" stroke="#D4AF37" stroke-width="1.5"/>
    <line x1="180" y1="352" x2="352" y2="180" stroke="#D4AF37" stroke-width="1.5"/>
    <line x1="352" y1="180" x2="180" y2="8" stroke="#D4AF37" stroke-width="1.5"/>
    ${houseElements}
    <text x="180" y="345" fill="#94A3B8" font-size="10" font-family="sans-serif" text-anchor="middle">${title}</text>
  </svg>`;
}

// Master HTML & CSS Report Document Generator
export function generateKundliReportHtml(data: FullKundliReportData): string {
  const d1Svg = renderNorthIndianSvg(data.charts.d1.lagnaRashiIndex, data.charts.d1.planets, 'D1 लग्न कुंडली (Rashi Chart)', 340);
  const chandraSvg = renderNorthIndianSvg(data.charts.chandra.lagnaRashiIndex, data.charts.chandra.planets, 'चंद्र कुंडली (Chandra Chart)', 340);
  
  // D9 placements
  const d9Placements = data.charts.d9.placements || [];
  const d9LagnaRashi = d9Placements.find((p) => p.planet === 'Lagna')?.rashiIndex || data.charts.d1.lagnaRashiIndex;
  const d9Svg = renderNorthIndianSvg(d9LagnaRashi, d9Placements, 'D9 नवांश कुंडली (Navamsha)', 340);

  // D10 placements
  const d10Placements = data.charts.d10.placements || [];
  const d10LagnaRashi = d10Placements.find((p) => p.planet === 'Lagna')?.rashiIndex || data.charts.d1.lagnaRashiIndex;
  const d10Svg = renderNorthIndianSvg(d10LagnaRashi, d10Placements, 'D10 दशांश कुंडली (Dashamsha)', 340);

  // Planetary Table rows
  const planetRows = data.planets
    .map(
      (p) => `
    <tr>
      <td style="font-weight:bold; color:#F8FAFC;">${p.planetHindi}</td>
      <td style="color:#F59E0B;">${p.degreeInSign}</td>
      <td>${p.rashiName}</td>
      <td style="text-align:center; font-weight:bold; color:#60A5FA;">${p.house}</td>
      <td>${p.nakshatra} (पाद ${p.pada})</td>
      <td>${p.nakshatraLord}</td>
      <td style="text-align:center;">${p.isRetrograde ? '<span class="badge badge-warn">वक्री (R)</span>' : '<span class="badge badge-succ">मार्गी</span>'}</td>
      <td style="text-align:center;">${p.isCombust ? '<span class="badge badge-danger">अस्त</span>' : 'उदित'}</td>
      <td><span class="badge badge-gold">${p.dignity}</span></td>
    </tr>`
    )
    .join('');

  // Sripati Bhava Chalit Table rows
  const bhavaChalitRows = (data.bhavaChalit?.houses || [])
    .map(
      (h) => `
    <tr>
      <td style="text-align:center; font-weight:bold; color:#60A5FA;">भाव ${h.houseNumber}</td>
      <td style="font-weight:bold; color:#FCD34D;">${h.bhavaMadhyaFormatted}</td>
      <td style="color:#CBD5E1;">${h.bhavaSandhiFormatted}</td>
      <td style="font-weight:bold; color:#F8FAFC;">${h.rashiLord}</td>
      <td style="color:#38BDF8; font-weight:bold;">${h.occupants.length > 0 ? h.occupants.join(', ') : '—'}</td>
    </tr>`
    )
    .join('');

  // Shadbala Table rows
  const shadbalaRows = (data.shadbala?.planets || [])
    .map(
      (s) => `
    <tr>
      <td style="font-weight:bold; color:#F8FAFC;">${s.planetHindi}</td>
      <td style="text-align:center;">${s.sthanaBala}</td>
      <td style="text-align:center;">${s.digBala}</td>
      <td style="text-align:center;">${s.kalaBala}</td>
      <td style="text-align:center;">${s.cheshtaBala}</td>
      <td style="text-align:center;">${s.naisargikaBala}</td>
      <td style="text-align:center;">${s.drikBala}</td>
      <td style="text-align:center; font-weight:bold; color:#FCD34D;">${s.totalRupas}</td>
      <td style="text-align:center; color:#94A3B8;">${s.minimumRequirementRupas}</td>
      <td style="text-align:center; font-weight:bold; color:${s.strengthPercentage >= 100 ? '#10B981' : '#EF4444'};">${s.strengthPercentage}%</td>
      <td style="text-align:center;"><span class="badge ${s.status.includes('अति') || s.status.includes('बली') ? 'badge-succ' : 'badge-gold'}">${s.status}</span></td>
    </tr>`
    )
    .join('');

  // Shodhana Table rows
  const shodhanaRows = (data.ashtakavargaShodhana?.pindaShodhana || [])
    .map(
      (p) => `
    <tr>
      <td style="font-weight:bold; color:#F8FAFC;">${p.planet}</td>
      <td style="text-align:center; color:#67E8F9;">${p.rashiPinda}</td>
      <td style="text-align:center; color:#FBBF24;">${p.grahaPinda}</td>
      <td style="text-align:center; font-weight:bold; color:#34D399;">${p.shodhitaPinda}</td>
    </tr>`
    )
    .join('');

  // KP Cusps Table rows
  const kpCuspRows = (data.kpSystem?.cusps || [])
    .map(
      (c) => `
    <tr>
      <td style="text-align:center; font-weight:bold; color:#FCD34D;">भाव ${c.house}</td>
      <td style="color:#F8FAFC;">${c.rashi} (${c.formattedDegree})</td>
      <td style="color:#CBD5E1;">${c.rashiLord}</td>
      <td style="color:#67E8F9;">${c.nakshatra} (${c.nakshatraLord})</td>
      <td style="font-weight:bold; color:#34D399;">${c.subLord}</td>
      <td style="color:#FBBF24;">${c.subSubLord}</td>
    </tr>`
    )
    .join('');

  // KP Planets Table rows
  const kpPlanetRows = (data.kpSystem?.planets || [])
    .map(
      (p) => `
    <tr>
      <td style="font-weight:bold; color:#F8FAFC;">${p.planetHindi}</td>
      <td style="color:#CBD5E1;">${p.rashi} (${p.formattedDegree})</td>
      <td style="text-align:center; color:#FCD34D;">${p.house}</td>
      <td style="color:#67E8F9;">${p.nakshatra} (${p.nakshatraLord})</td>
      <td style="font-weight:bold; color:#34D399;">${p.subLord}</td>
      <td style="color:#FBBF24;">${p.subSubLord}</td>
    </tr>`
    )
    .join('');

  // Jaimini Arudha Padas rows
  const arudhaRows = (data.jaimini?.arudhaPadas || [])
    .map(
      (a) => `
    <tr>
      <td style="font-weight:bold; color:#FCD34D; text-align:center;">${a.code}</td>
      <td style="font-weight:bold; color:#F8FAFC;">${a.nameHindi}</td>
      <td style="color:#38BDF8;">${a.rashiName}</td>
      <td style="font-size:0.75rem; color:#CBD5E1;">${a.significance}</td>
    </tr>`
    )
    .join('');

  // Live Transit Gochar rows
  const transitRows = (data.transitSystem?.planets || [])
    .map(
      (t) => `
    <tr>
      <td style="font-weight:bold; color:#F8FAFC;">${t.planetHindi}</td>
      <td style="color:#38BDF8;">${t.currentRashi} (${t.formattedDegree})</td>
      <td style="text-align:center; font-weight:bold; color:#FCD34D;">भाव ${t.houseFromLagna}</td>
      <td style="text-align:center; font-weight:bold; color:#34D399;">भाव ${t.houseFromMoon}</td>
      <td style="color:#CBD5E1; font-size:0.74rem;">${t.transitResultHindi}</td>
      <td style="color:#FBBF24; text-align:center;">${t.kakshyaLord}</td>
    </tr>`
    )
    .join('');

  // Choghadiya rows (Day)
  const choghadiyaDayRows = (data.muhuratSystem?.dayChoghadiya || [])
    .map(
      (c) => `
    <tr>
      <td style="font-weight:bold; color:${c.nature.includes('शुभ') ? '#34D399' : c.nature.includes('सामान्य') ? '#FBBF24' : '#F87171'};">${c.name}</td>
      <td style="text-align:center;"><span class="badge ${c.nature.includes('शुभ') ? 'badge-succ' : c.nature.includes('सामान्य') ? 'badge-gold' : 'badge-danger'}" style="font-size:0.68rem;">${c.nature}</span></td>
      <td style="color:#CBD5E1; font-size:0.75rem;">${c.startTime} - ${c.endTime}</td>
      <td style="color:#67E8F9;">${c.rulingPlanet}</td>
      <td style="font-size:0.72rem; color:#94A3B8;">${c.suitableForHindi}</td>
    </tr>`
    )
    .join('');

  // Lal Kitab Debts rows
  const lalKitabDebtRows = (data.lalKitabSystem?.debts || [])
    .map(
      (d) => `
    <tr>
      <td style="font-weight:bold; color:#FCD34D;">${d.debtName}</td>
      <td style="text-align:center;"><span class="badge ${d.isApplicable ? 'badge-danger' : 'badge-succ'}" style="font-size:0.68rem;">${d.isApplicable ? 'सक्रिय (ऋण है)' : 'दोषमुक्त'}</span></td>
      <td style="font-size:0.74rem; color:#CBD5E1;">${d.indicationsHindi}</td>
      <td style="font-size:0.74rem; color:#A7F3D0;">${d.remedyHindi}</td>
    </tr>`
    )
    .join('');


  // Ashtakavarga SAV columns
  const savHeaders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    .map((h) => `<th style="text-align:center;">भाव ${h}</th>`)
    .join('');
  const savScores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    .map((h) => {
      const score = data.ashtakavarga.savScores[h] || 28;
      const col = score >= 30 ? '#10B981' : score >= 25 ? '#F59E0B' : '#EF4444';
      return `<td style="text-align:center; font-weight:bold; color:${col};">${score}</td>`;
    })
    .join('');

  // 12 Bhavphal cards
  const bhavphalCards = data.bhavphal
    .map(
      (b) => `
    <div class="card mb-4">
      <div class="card-header">
        <h3 style="margin:0; font-size:1.1rem; color:#FCD34D;">${b.houseName}</h3>
        <span class="badge badge-gold">${b.financialOrLifeScore}</span>
      </div>
      <div style="padding:14px;">
        <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px; font-size:0.85rem;">
          <span style="background:#1E293B; padding:4px 10px; border-radius:6px; color:#94A3B8;">राशि: <strong style="color:#F8FAFC;">${b.rashi}</strong></span>
          <span style="background:#1E293B; padding:4px 10px; border-radius:6px; color:#94A3B8;">भावेश: <strong style="color:#F8FAFC;">${b.rashiLord} (${b.lordPlacementHouse}वें भाव में)</strong></span>
          <span style="background:#1E293B; padding:4px 10px; border-radius:6px; color:#94A3B8;">विराजमान ग्रह: <strong style="color:#38BDF8;">${b.occupants.join(', ')}</strong></span>
        </div>
        <p style="color:#CBD5E1; font-size:0.92rem; line-height:1.6; margin-bottom:8px;">${b.detailedAnalysis}</p>
        <div style="font-size:0.82rem; color:#A7F3D0;"><strong>मुख्य प्रभाव क्षेत्र:</strong> ${b.significance.join(' • ')}</div>
      </div>
    </div>`
    )
    .join('');

  // Conjunction cards
  const conjunctionCards = data.conjunctions
    .map(
      (c) => `
    <div class="card mb-3" style="border-left: 4px solid #F59E0B;">
      <div style="padding:14px;">
        <h4 style="margin:0 0 6px 0; color:#FCD34D;">${c.name}</h4>
        <p style="color:#E2E8F0; font-size:0.9rem; line-height:1.5; margin:0 0 8px 0;">${c.description}</p>
        <div style="background:#1E293B; padding:8px 12px; border-radius:6px; font-size:0.85rem; color:#67E8F9;">
          <strong>जीवन पर प्रभाव:</strong> ${c.impact}
        </div>
      </div>
    </div>`
    )
    .join('');

  // Jaimini Chara Karakas rows
  const charaKarakaRows = data.charaKarakas
    .map(
      (k) => `
    <tr>
      <td style="font-weight:bold; color:#FCD34D;">${k.hindiTitle}</td>
      <td style="font-weight:bold; color:#FFFFFF;">${k.planet}</td>
      <td style="color:#F59E0B;">${k.degree}</td>
      <td style="font-size:0.85rem; color:#CBD5E1;">${k.roleMeaning}</td>
      <td style="font-size:0.85rem; color:#A7F3D0;">${k.lifeMission}</td>
    </tr>`
    )
    .join('');

  // Marriage Timing Windows rows
  const marriageTimingRows = data.loveAndMarriage.timingWindows
    .map(
      (w) => `
    <tr>
      <td style="font-weight:bold; color:#FFFFFF; white-space:nowrap; padding:4px 8px; font-size:0.8rem;">${w.startDate} से ${w.endDate}</td>
      <td style="padding:4px 8px;"><span class="badge ${w.probability.includes('उत्कृष्ट') || w.probability.includes('बहुत') ? 'badge-succ' : w.probability.includes('अच्छा') ? 'badge-gold' : 'badge-warn'}" style="font-size:0.72rem;">${w.probability}</span></td>
      <td style="font-size:0.8rem; color:#CBD5E1; padding:4px 8px;">${w.astrologicalReason}</td>
    </tr>`
    )
    .join('');

  // Raj Yogas cards
  const rajYogaCards = data.rajYogas
    .map(
      (y) => `
    <div class="card" style="padding:8px 10px; border-left: 3px solid #10B981; background:rgba(30, 41, 59, 0.7); display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:3px;">
          <h4 style="margin:0; color:#34D399; font-size:0.79rem; font-weight:bold; line-height:1.2;">${y.hindiName || y.name}</h4>
          <span class="badge badge-succ" style="font-size:0.62rem; padding:1px 5px; white-space:nowrap; margin-left:4px;">${y.intensity || 'प्रबल'}</span>
        </div>
        <p style="color:#CBD5E1; font-size:0.71rem; line-height:1.35; margin:0 0 4px 0;">${y.description.length > 135 ? y.description.substring(0, 135) + '...' : y.description}</p>
      </div>
      <div style="font-size:0.68rem; color:#94A3B8; border-top:1px solid rgba(255,255,255,0.06); padding-top:3px; display:flex; justify-content:space-between;">
        <span>ग्रह: <strong style="color:#FDE68A;">${y.planetsInvolved?.slice(0, 2).join(', ')}</strong></span>
        <span style="color:#60A5FA;">${y.activationPeriod ? y.activationPeriod.substring(0, 22) : 'दशा-गोचर'}</span>
      </div>
    </div>`
    )
    .join('');

  // Doshas cards
  const doshasCards = data.doshas
    .map(
      (d) => `
    <div class="card" style="padding:8px 12px; border-left: 3px solid ${d.intensity.includes('Cancelled') || d.intensity.includes('भंग') ? '#3B82F6' : '#EF4444'}; background:rgba(30, 41, 59, 0.7);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
        <h4 style="margin:0; color:#F87171; font-size:0.83rem;">${d.name}</h4>
        <span class="badge ${d.intensity.includes('Cancelled') || d.intensity.includes('भंग') ? 'badge-succ' : 'badge-danger'}" style="font-size:0.66rem; padding:2px 6px;">${d.intensity}</span>
      </div>
      <p style="color:#CBD5E1; font-size:0.73rem; line-height:1.36; margin:0 0 3px 0;">${d.description}</p>
      <div style="font-size:0.7rem; color:#FEF08A;"><strong>निवारण उपाय:</strong> ${d.remedies?.join(' • ')}</div>
    </div>`
    )
    .join('');

  // Gemstones Table rows
  const gemstoneRows = data.remedies.gemstones
    .map(
      (g) => `
    <tr>
      <td style="font-weight:bold; color:#FCD34D;">${g.category}</td>
      <td style="font-weight:bold; color:#FFFFFF;">${g.hindiName}</td>
      <td>${g.planet}</td>
      <td>${g.metal}</td>
      <td>${g.finger}</td>
      <td>${g.day} (${g.hora})</td>
      <td style="font-size:0.82rem; color:#A7F3D0;">${g.keyBenefits}</td>
      <td style="font-size:0.82rem; color:#CBD5E1;">${g.substituteCrystal}</td>
    </tr>`
    )
    .join('');

  // Beej Mantras Table rows
  const beejMantraRows = data.remedies.beejMantras
    .map(
      (m) => `
    <tr>
      <td style="font-weight:bold; color:#FCD34D;">${m.planet}</td>
      <td style="font-size:1.05rem; font-weight:bold; color:#67E8F9; font-family:'Noto Serif Devanagari', serif;">${m.mantra}</td>
      <td style="color:#F59E0B;">${m.prescribedCount}</td>
      <td style="font-size:0.85rem; color:#CBD5E1;">${m.idealTime}</td>
    </tr>`
    )
    .join('');

  // Shodashvarga Table rows
  const shodashvargaRows = data.charts.shodashvargas
    .map(
      (v) => `
    <tr>
      <td style="font-weight:bold; color:#FCD34D;">${v.chartType}</td>
      <td style="font-weight:bold; color:#FFFFFF;">${v.name}</td>
      <td style="font-size:0.85rem; color:#CBD5E1;">${v.significance}</td>
    </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>प्रीमियम पर्सनलाइज़्ड कुंडली रिपोर्ट - ${data.native.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Noto+Serif+Devanagari:wght@400;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');

    :root {
      --bg-dark: #0A0F1D;
      --card-bg: #131B2E;
      --card-border: #1E293B;
      --gold-primary: #D4AF37;
      --gold-bright: #F59E0B;
      --gold-light: #FDE68A;
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --text-secondary: #CBD5E1;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Poppins', 'Noto Serif Devanagari', sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .report-page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 16mm 18mm;
      background: var(--bg-dark);
      position: relative;
      page-break-after: always;
      overflow: hidden;
    }

    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #334155;
      padding-bottom: 10px;
      margin-bottom: 18px;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .header-logo {
      font-family: 'Cinzel', serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--gold-primary);
      letter-spacing: 1px;
    }

    .footer-bar {
      position: absolute;
      bottom: 10mm;
      left: 18mm;
      right: 18mm;
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #64748B;
      border-top: 1px solid #1E293B;
      padding-top: 6px;
    }

    h1, h2, h3, h4 {
      font-family: 'Cinzel', 'Noto Serif Devanagari', serif;
      color: var(--gold-primary);
    }

    .chapter-title {
      font-size: 1.6rem;
      color: var(--gold-light);
      border-left: 4px solid var(--gold-primary);
      padding-left: 12px;
      margin-top: 0;
      margin-bottom: 14px;
      letter-spacing: 0.5px;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      margin-bottom: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
    .card-header {
      background: #1A243B;
      padding: 10px 14px;
      border-bottom: 1px solid #28354D;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top-left-radius: 9px;
      border-top-right-radius: 9px;
    }

    .table-custom {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
      margin-bottom: 12px;
    }
    .table-custom th {
      background: #1E293B;
      color: var(--gold-primary);
      text-align: left;
      padding: 8px 10px;
      border: 1px solid #334155;
    }
    .table-custom td {
      padding: 8px 10px;
      border: 1px solid #1E293B;
      color: var(--text-secondary);
    }
    .table-custom tr:nth-child(even) td {
      background: rgba(30, 41, 59, 0.4);
    }

    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-gold { background: rgba(212, 175, 55, 0.15); color: #FCD34D; border: 1px solid #D4AF37; }
    .badge-succ { background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid #10B981; }
    .badge-warn { background: rgba(245, 158, 11, 0.15); color: #FBBF24; border: 1px solid #F59E0B; }
    .badge-danger { background: rgba(239, 68, 68, 0.15); color: #F87171; border: 1px solid #EF4444; }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }

    /* Print Setup */
    @media print {
      body { background: #0A0F1D; }
      .report-page {
        margin: 0;
        box-shadow: none;
        page-break-after: always;
      }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1: COVER PAGE ==================== -->
  <div class="report-page" style="display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; border:3px solid #D4AF37; outline: 1px solid #F59E0B; outline-offset: -12px;">
    <div style="font-family:'Cinzel', serif; font-size:1rem; color:var(--gold-bright); letter-spacing:4px; margin-bottom:15px;">
      VEDIC ASTRO • सम्पूर्ण वैदिक ज्योतिष दर्शन
    </div>
    <div style="font-family:'Noto Serif Devanagari', serif; font-size:1.1rem; color:#94A3B8; margin-bottom:25px; font-style:italic;">
      ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥
    </div>

    <div style="width:120px; height:120px; border-radius:50%; border:2px solid #D4AF37; margin:0 auto 20px auto; display:flex; justify-content:center; align-items:center; background: radial-gradient(circle, rgba(212,175,55,0.2) 0%, rgba(10,15,29,0.8) 70%); box-shadow:0 0 35px rgba(212,175,55,0.35);">
      <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="2" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <circle cx="12" cy="12" r="4" fill="#D4AF37"/>
      </svg>
    </div>

    <h1 style="font-size:2.4rem; margin:0 0 10px 0; color:#FDE68A; text-shadow:0 0 15px rgba(212,175,55,0.4);">
      प्रीमियम पर्सनलाइज़्ड कुंडली
    </h1>
    <h2 style="font-size:1.1rem; font-weight:400; color:#CBD5E1; margin:0 0 35px 0; max-width:550px;">
      जीवन दर्पण • भविष्यफल • षोडशवर्ग चार्ट्स • दशा काल • संपूर्ण वैदिक उपाय
    </h2>

    <div style="background:var(--card-bg); border:1px solid #334155; border-radius:12px; padding:22px 35px; width:85%; max-width:500px; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
      <div style="border-bottom:1px solid #1E293B; padding-bottom:8px; margin-bottom:10px; color:var(--gold-bright); font-weight:bold; font-size:0.9rem; text-transform:uppercase; letter-spacing:1px;">
        जातक विवरण (Native Details)
      </div>
      <table style="width:100%; font-size:0.9rem; color:#E2E8F0;">
        <tr><td style="color:#94A3B8; padding:4px 0;">नाम (Name):</td><td style="font-weight:bold; color:#FDE68A;">${data.native.name}</td></tr>
        <tr><td style="color:#94A3B8; padding:4px 0;">लिंग (Gender):</td><td>${data.native.gender}</td></tr>
        <tr><td style="color:#94A3B8; padding:4px 0;">जन्म तिथि (DOB):</td><td>${data.native.dob}</td></tr>
        <tr><td style="color:#94A3B8; padding:4px 0;">जन्म समय (TOB):</td><td>${data.native.tob}</td></tr>
        <tr><td style="color:#94A3B8; padding:4px 0;">जन्म स्थान (Place):</td><td>${data.native.place}</td></tr>
        <tr><td style="color:#94A3B8; padding:4px 0;">अक्षांश/देशांतर:</td><td>${data.native.latitude.toFixed(4)}° N, ${data.native.longitude.toFixed(4)}° E</td></tr>
        <tr><td style="color:#94A3B8; padding:4px 0;">गणना पद्धति:</td><td>वैदिक पराशरी (लाहिड़ी अयनांश 2026.1)</td></tr>
      </table>
    </div>

    <div style="margin-top:40px; font-size:0.8rem; color:#64748B;">
      वैदिक ज्योतिष अनुसंधान केंद्र • सर्वाधिकार सुरक्षित
    </div>
  </div>

  <!-- ==================== PAGE 2: PREFACE & TABLE OF CONTENTS ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>प्रीमियम पर्सनलाइज़्ड कुंडली रिपोर्ट • ${data.native.name}</span>
    </div>

    <div class="card mb-4" style="background:#0F172A; border-left:4px solid var(--gold-bright);">
      <div style="padding:14px 18px;">
        <h3 style="margin:0 0 6px 0; color:#FCD34D; font-size:1.05rem;">अस्वीकरण एवं लेखक का संदेश</h3>
        <p style="font-size:0.85rem; color:#CBD5E1; line-height:1.6; margin:0;">
          यह रिपोर्ट प्राचीन वैदिक ज्योतिष, गणितीय खगोलीय सिद्धांतों एवं पराशरीय सूत्रों पर आधारित है। इसका उद्देश्य आपको अपनी जन्मजात ऊर्जा, कर्मिक प्रवृत्तियों एवं जीवन के अवसरों को पहचानने का मार्गदर्शन देना है। ब्रह्मांड हमेशा आपका साथ देता है, किंतु अपने पुरुषार्थ और सत्कर्मों से अपने भाग्य को संवारने की शक्ति आपके अपने हाथों में है।
        </p>
      </div>
    </div>

    <h2 class="chapter-title" style="font-size:1.3rem;">विषयसूची (Table of Contents)</h2>
    <div class="grid-2" style="font-size:0.84rem; gap:12px;">
      <div class="card" style="padding:12px;">
        <div style="color:#FCD34D; font-weight:bold; margin-bottom:4px;">01 आपकी ग्रह रूपरेखा को समझना</div>
        <div style="color:#94A3B8; line-height:1.5;">मूलभूत विवरण, अवकहड़ा चक्र, पंचांग सार, लग्न, चंद्र व नवांश कुंडली, ग्रह स्थिति, षोडशवर्ग, दशा व अष्टकवर्ग</div>
      </div>
      <div class="card" style="padding:12px;">
        <div style="color:#FCD34D; font-weight:bold; margin-bottom:4px;">02 जन्म कुंडली का प्रभाव</div>
        <div style="color:#94A3B8; line-height:1.5;">पंचांग विश्लेषण, तीन आधार स्तंभ (चंद्र, लग्न, नक्षत्र), 9 ग्रहों की विस्तृत प्रोफ़ाइल व दृष्टियां</div>
      </div>
      <div class="card" style="padding:12px;">
        <div style="color:#FCD34D; font-weight:bold; margin-bottom:4px;">03 भावफल: 12 भावों से जीवन की झलक</div>
        <div style="color:#94A3B8; line-height:1.5;">तनु से व्यय भाव तक प्रत्येक भाव का विस्तार से विश्लेषण, भावेश स्थिति व फल</div>
      </div>
      <div class="card" style="padding:12px;">
        <div style="color:#FCD34D; font-weight:bold; margin-bottom:4px;">04 ग्रह संयोग (Planetary Conjunctions)</div>
        <div style="color:#94A3B8; line-height:1.5;">कुंडली में बनने वाली महत्वपूर्ण युतियों का मनोवैज्ञानिक व व्यावहारिक प्रभाव</div>
      </div>
      <div class="card" style="padding:12px;">
        <div style="color:#FCD34D; font-weight:bold; margin-bottom:4px;">05 ज्योतिषीय दृष्टिकोण: प्रेम और विवाह</div>
        <div style="color:#94A3B8; line-height:1.5;">पंचम व सप्तम भाव, दाराकारक विश्लेषण, वैवाहिक सुख एवं विवाह समय पूर्वानुमान तालिका</div>
      </div>
      <div class="card" style="padding:12px;">
        <div style="color:#FCD34D; font-weight:bold; margin-bottom:4px;">06 आपका करियर पथ: सितारों में लिखा</div>
        <div style="color:#94A3B8; line-height:1.5;">सूर्य व शनि की भूमिका, दशांश (D10) चार्ट, अमात्यकारक, उपयुक्त कार्यक्षेत्र व पदोन्नति समय</div>
      </div>
      <div class="card" style="padding:12px;">
        <div style="color:#FCD34D; font-weight:bold; margin-bottom:4px;">07 चर कारक: आत्मा व उद्देश्य के ग्रह</div>
        <div style="color:#94A3B8; line-height:1.5;">जैमिनी पद्धति अनुसार 7 चर कारक (आत्मकारक से दाराकारक तक) व जीवन का मूल उद्देश्य</div>
      </div>
      <div class="card" style="padding:12px;">
        <div style="color:#FCD34D; font-weight:bold; margin-bottom:4px;">08 राहु-केतु विश्लेषण: कर्मिक अक्ष</div>
        <div style="color:#94A3B8; line-height:1.5;">वर्तमान जीवन की महत्वाकांक्षाएं, पूर्व जन्म के संस्कार व कर्मिक संतुलन के उपाय</div>
      </div>
      <div class="card" style="padding:12px;">
        <div style="color:#FCD34D; font-weight:bold; margin-bottom:4px;">09 मांगलिक प्रभाव व 10 साढ़े साती यात्रा</div>
        <div style="color:#94A3B8; line-height:1.5;">मंगल दोष परिहार विश्लेषण एवं शनि साढ़े साती के तीन चरण, तारीखें व शांति उपाय</div>
      </div>
      <div class="card" style="padding:12px;">
        <div style="color:#FCD34D; font-weight:bold; margin-bottom:4px;">11 राजयोग, 12 वैदिक दोष व 13 महादशा फल</div>
        <div style="color:#94A3B8; line-height:1.5;">सक्रिय राजयोग, कालसर्प आदि दोष तथा 120 वर्षीय विंशोत्तरी महादशा-अंतरदशा फल</div>
      </div>
      <div class="card" style="padding:12px;">
        <div style="color:#FCD34D; font-weight:bold; margin-bottom:4px;">14 अंक ज्योतिष एवं 15 आध्यात्मिक क्षमता</div>
        <div style="color:#94A3B8; line-height:1.5;">मूलांक, भाग्यांक, सफलता संख्या, शुभ तत्व एवं इष्ट देव व आध्यात्मिक उन्नति मार्ग</div>
      </div>
      <div class="card" style="padding:12px;">
        <div style="color:#FCD34D; font-weight:bold; margin-bottom:4px;">16 संपूर्ण उपाय एवं 17 जीवन का समापन रोडमैप</div>
        <div style="color:#94A3B8; line-height:1.5;">रुद्राक्ष, रत्न धारण विधि, नवग्रह बीज मंत्र, यंत्र पूजा नियम, दान व स्वर्णिम संकल्प</div>
      </div>
    </div>

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 2</span>
    </div>
  </div>

  <!-- ==================== PAGE 3: CHAPTER 01 - AVAKAHADA & PANCHANG ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 01: आपकी ग्रह रूपरेखा को समझना</span>
    </div>

    <h2 class="chapter-title">01 आपकी ग्रह रूपरेखा को समझना (मूलभूत विवरण व अवकहड़ा चक्र)</h2>

    <div class="grid-2 mb-3">
      <!-- Avakahada Chakra Table -->
      <div class="card">
        <div class="card-header"><h3 style="margin:0; font-size:0.95rem; color:#FCD34D;">अवकहड़ा चक्र (Avakahada Chakra)</h3></div>
        <div style="padding:10px;">
          <table class="table-custom" style="margin:0;">
            <tr><td>लग्न (Ascendant):</td><td style="font-weight:bold; color:#FCD34D;">${data.avakahada.lagna} (${data.avakahada.lagnaDegree})</td></tr>
            <tr><td>लग्न स्वामी:</td><td>${data.avakahada.lagnaLord}</td></tr>
            <tr><td>चंद्र राशि (Moon Sign):</td><td style="font-weight:bold; color:#38BDF8;">${data.avakahada.moonRashi}</td></tr>
            <tr><td>राशि स्वामी:</td><td>${data.avakahada.moonRashiLord}</td></tr>
            <tr><td>नक्षत्र व चरण:</td><td>${data.avakahada.nakshatra}</td></tr>
            <tr><td>नक्षत्र स्वामी:</td><td>${data.avakahada.nakshatraLord}</td></tr>
            <tr><td>वर्ण (Varna):</td><td>${data.avakahada.varna}</td></tr>
            <tr><td>वश्य (Vashya):</td><td>${data.avakahada.vashya}</td></tr>
            <tr><td>योनि (Yoni):</td><td>${data.avakahada.yoni}</td></tr>
            <tr><td>गण (Gana):</td><td>${data.avakahada.gana}</td></tr>
            <tr><td>नाड़ी (Nadi):</td><td>${data.avakahada.nadi}</td></tr>
            <tr><td>पाया (Paya):</td><td style="color:#A7F3D0; font-weight:bold;">${data.avakahada.paya}</td></tr>
            <tr><td>नामाक्षर (Name Syllable):</td><td style="color:#F59E0B; font-weight:bold;">${data.avakahada.nameLetter}</td></tr>
            <tr><td>हंसक / तत्व:</td><td>${data.avakahada.hansak}</td></tr>
          </table>
        </div>
      </div>

      <!-- Panchang Table -->
      <div class="card">
        <div class="card-header"><h3 style="margin:0; font-size:0.95rem; color:#FCD34D;">जन्म पंचांग एवं काल गणना</h3></div>
        <div style="padding:10px;">
          <table class="table-custom" style="margin:0;">
            <tr><td>जन्म तिथि:</td><td style="font-weight:bold; color:#F8FAFC;">${data.panchangSummary.tithi}</td></tr>
            <tr><td>वार (Day):</td><td>${data.panchangSummary.vaar}</td></tr>
            <tr><td>नक्षत्र:</td><td>${data.panchangSummary.nakshatra}</td></tr>
            <tr><td>योग (Yoga):</td><td>${data.panchangSummary.yoga}</td></tr>
            <tr><td>करण (Karana):</td><td>${data.panchangSummary.karana}</td></tr>
            <tr><td>सूर्योदय:</td><td>${data.avakahada.sunrise}</td></tr>
            <tr><td>सूर्यास्त:</td><td>${data.avakahada.sunset}</td></tr>
            <tr><td>दिनमान (Day Length):</td><td>${data.avakahada.dinaMana}</td></tr>
            <tr><td>सूर्य स्थिति (अयन):</td><td>${data.avakahada.ayan}</td></tr>
            <tr><td>ऋतु (Season):</td><td>${data.avakahada.ritu}</td></tr>
            <tr><td>विक्रम संवत:</td><td>${data.avakahada.samvatVikram}</td></tr>
            <tr><td>राष्ट्रीय शक संवत:</td><td>${data.avakahada.samvatSaka}</td></tr>
            <tr><td>सूर्य राशि (पाश्चात्य):</td><td>${data.avakahada.sunWesternSign}</td></tr>
            <tr><td>अयनांश:</td><td>लाहिड़ी (23° 53' 08")</td></tr>
          </table>
        </div>
      </div>
    </div>

    <!-- Core Kundli SVG Charts -->
    <h3 style="margin:16px 0 10px 0; font-size:1.1rem; color:#FCD34D; text-align:center;">प्रमुख वैदिक कुंडलियां (Core Vedic Charts)</h3>
    <div class="grid-2" style="gap:16px; margin-bottom:12px;">
      <div>${d1Svg}</div>
      <div>${chandraSvg}</div>
    </div>

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 3</span>
    </div>
  </div>

  <!-- ==================== PAGE 4: PLANETARY POSITIONS & NAVAMSHA ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 01: ग्रह स्थिति एवं नवांश कुंडली</span>
    </div>

    <h2 class="chapter-title">ग्रहों की स्पष्ट स्थिति, डिग्री व नवांश (D9) विश्लेषण</h2>

    <table class="table-custom mb-4">
      <thead>
        <tr>
          <th>ग्रह (Planet)</th>
          <th>डिग्री (Degree)</th>
          <th>राशि (Rashi)</th>
          <th>भाव</th>
          <th>नक्षत्र (Nakshatra)</th>
          <th>नक्षत्रेश</th>
          <th>गति</th>
          <th>अस्त</th>
          <th>गरिमा (Dignity)</th>
        </tr>
      </thead>
      <tbody>
        ${planetRows}
      </tbody>
    </table>

    <div class="grid-2" style="align-items:center; gap:16px;">
      <div>${d9Svg}</div>
      <div>${d10Svg}</div>
    </div>

    <div class="card mt-3" style="background:#0F172A; padding:12px;">
      <h4 style="margin:0 0 6px 0; color:#FCD34D;">नवांश (D9) एवं दशांश (D10) का महत्व:</h4>
      <p style="font-size:0.83rem; color:#CBD5E1; line-height:1.5; margin:0 0 10px 0;">
        नवांश कुंडली लग्न कुंडली के फलों का सूक्ष्म फलित है, जो जीवन के उत्तरार्ध, वैवाहिक सुख और आंतरिक शक्ति का प्रकटीकरण करता है। दशांश कुंडली आपके कर्म, आधिकारिक शक्ति, समाज में प्रतिष्ठा और आजीविका की स्थायी साख को दर्शाती है।
      </p>

      <!-- Sripati Bhava Chalit Table -->
      <h4 style="margin:10px 0 6px 0; color:#FCD34D; border-top:1px solid #334155; padding-top:8px;">श्रीपति भाव चलित स्पष्ट (Sripati Bhava Chalit Cusps & Sandhi)</h4>
      <table class="table-custom" style="margin:0; font-size:0.78rem;">
        <thead>
          <tr>
            <th style="text-align:center;">भाव</th>
            <th>भाव मध्य (Cusp Center)</th>
            <th>भाव संधि (Boundary)</th>
            <th>भावेश</th>
            <th>चलित में ग्रह</th>
          </tr>
        </thead>
        <tbody>
          ${bhavaChalitRows}
        </tbody>
      </table>
    </div>

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 4</span>
    </div>
  </div>

  <!-- ==================== PAGE 5: ASHTAKAVARGA & SHODASHVARGA ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 01: अष्टकवर्ग, षड्बल एवं षोडशवर्ग चार्ट्स</span>
    </div>

    <h2 class="chapter-title">सर्वाष्टकवर्ग (SAV), षड्बल एवं शोध्य पिण्ड सारणी</h2>

    <div class="card mb-3">
      <div class="card-header"><h3 style="margin:0; font-size:1rem; color:#FCD34D;">सर्वाष्टकवर्ग (Sarvashtakavarga - SAV) बिंदु</h3></div>
      <div style="padding:10px; overflow-x:auto;">
        <table class="table-custom" style="margin:0;">
          <thead><tr>${savHeaders}</tr></thead>
          <tbody><tr>${savScores}</tr></tbody>
        </table>
        <p style="font-size:0.8rem; color:#94A3B8; margin:6px 0 0 0;">
          * 28 बिंदु से अधिक वाले भाव बलवान माने जाते हैं और जीवन में उन भावों से संबंधित शुभ फल अनायास प्राप्त होते हैं।
        </p>
      </div>
    </div>

    <!-- Shadbala Table -->
    <div class="card mb-3" style="background:#0F172A; padding:10px;">
      <div class="card-header" style="padding:4px 0 6px 0;"><h3 style="margin:0; font-size:0.95rem; color:#FCD34D;">ग्रहों का षड्बल विश्लेषण (Shadbala 6-Fold Strengths in Rupas)</h3></div>
      <table class="table-custom" style="margin:0; font-size:0.74rem;">
        <thead>
          <tr>
            <th>ग्रह</th>
            <th style="text-align:center;">स्थान</th>
            <th style="text-align:center;">दिग</th>
            <th style="text-align:center;">काल</th>
            <th style="text-align:center;">चेष्टा</th>
            <th style="text-align:center;">नैसर्गिक</th>
            <th style="text-align:center;">दृग</th>
            <th style="text-align:center;">कुल रूपा</th>
            <th style="text-align:center;">न्यूनतम</th>
            <th style="text-align:center;">सामर्थ्य %</th>
            <th style="text-align:center;">स्थिति</th>
          </tr>
        </thead>
        <tbody>
          ${shadbalaRows}
        </tbody>
      </table>
    </div>

    <!-- Shodhita Pinda Table -->
    <div class="card mb-3" style="background:#0F172A; padding:10px;">
      <div class="card-header" style="padding:4px 0 6px 0;"><h3 style="margin:0; font-size:0.9rem; color:#FCD34D;">अष्टकवर्ग शोधन एवं शोध्य पिण्ड (Trikona & Ekadhipatya Shodhana Pinda)</h3></div>
      <table class="table-custom" style="margin:0; font-size:0.78rem;">
        <thead>
          <tr>
            <th>ग्रह</th>
            <th style="text-align:center;">राशि पिण्ड</th>
            <th style="text-align:center;">ग्रह पिण्ड</th>
            <th style="text-align:center;">शोध्य पिण्ड (योग पिण्ड)</th>
          </tr>
        </thead>
        <tbody>
          ${shodhanaRows}
        </tbody>
      </table>
    </div>

    <h3 style="font-size:1rem; color:#FCD34D; margin:10px 0 6px 0;">षोडशवर्ग चार्ट्स का उद्देश्य व महत्व (Shodashvarga Significance)</h3>
    <table class="table-custom" style="font-size:0.8rem;">
      <thead>
        <tr>
          <th style="width:15%;">चार्ट</th>
          <th style="width:30%;">नाम</th>
          <th>वैदिक महत्व एवं प्रतिपादित जीवन क्षेत्र</th>
        </tr>
      </thead>
      <tbody>
        ${shodashvargaRows}
      </tbody>
    </table>

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 5</span>
    </div>
  </div>

  <!-- ==================== PAGE 5B: KP ASTROLOGY & JAIMINI SYSTEMS ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 01: कृष्णमूर्ति पद्धति (KP) एवं जैमिनी आरूढ़ पद</span>
    </div>

    <h2 class="chapter-title">कृष्णमूर्ति पद्धति (KP Cusps & Sub-Lords) एवं जैमिनी ज्योतिष</h2>

    <!-- KP Cusps Table -->
    <div class="card mb-3" style="background:#0F172A; padding:10px;">
      <div class="card-header" style="padding:4px 0 6px 0;">
        <h3 style="margin:0; font-size:0.95rem; color:#FCD34D;">के.पी. भाव कस्प एवं उप-नक्षत्र स्वामी (KP House Cusps & Sub-Lords)</h3>
        <span style="font-size:0.75rem; color:#94A3B8;">अयनांश: ${data.kpSystem?.formattedAyanamsha || 'KP New'}</span>
      </div>
      <table class="table-custom" style="margin:0; font-size:0.75rem;">
        <thead>
          <tr>
            <th style="text-align:center;">भाव</th>
            <th>कस्प डिग्री</th>
            <th>राशि स्वामी</th>
            <th>नक्षत्र स्वामी</th>
            <th>उप-स्वामी (Sub-Lord)</th>
            <th>उप-उप स्वामी (Sub-Sub)</th>
          </tr>
        </thead>
        <tbody>
          ${kpCuspRows}
        </tbody>
      </table>
    </div>

    <!-- KP Planets Table -->
    <div class="card mb-3" style="background:#0F172A; padding:10px;">
      <div class="card-header" style="padding:4px 0 6px 0;">
        <h3 style="margin:0; font-size:0.92rem; color:#FCD34D;">ग्रहों के के.पी. उप-स्वामी (KP Planetary Sub-Lords)</h3>
      </div>
      <table class="table-custom" style="margin:0; font-size:0.74rem;">
        <thead>
          <tr>
            <th>ग्रह</th>
            <th>राशि व डिग्री</th>
            <th style="text-align:center;">भाव</th>
            <th>नक्षत्र स्वामी</th>
            <th>उप-स्वामी (Sub-Lord)</th>
            <th>उप-उप स्वामी</th>
          </tr>
        </thead>
        <tbody>
          ${kpPlanetRows}
        </tbody>
      </table>
    </div>

    <!-- Jaimini Arudha Padas Table -->
    <div class="card mb-3" style="background:#0F172A; padding:10px;">
      <div class="card-header" style="padding:4px 0 6px 0;">
        <h3 style="margin:0; font-size:0.92rem; color:#FCD34D;">जैमिनी 12 आरूढ़ पद सारणी (Jaimini Arudha Padas - AL, UL & A1-A12)</h3>
      </div>
      <table class="table-custom" style="margin:0; font-size:0.75rem;">
        <thead>
          <tr>
            <th style="text-align:center; width:55px;">पद कोड</th>
            <th style="width:170px;">पद का नाम</th>
            <th style="width:130px;">स्थित राशि</th>
            <th>महत्व व फलित</th>
          </tr>
        </thead>
        <tbody>
          ${arudhaRows}
        </tbody>
      </table>
      <div style="font-size:0.76rem; color:#A7F3D0; margin-top:6px; line-height:1.4;">
        * ${data.jaimini?.karakamshaSignificance || ''}
      </div>
    </div>

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 5B</span>
    </div>
  </div>

  <!-- ==================== PAGE 5C: TRANSIT GOCHAR, CHOGHADIYA & LAL KITAB ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 01: दैनिक गोचर, चौघड़िया मुहूर्त व लाल किताब ऋण</span>
    </div>

    <h2 class="chapter-title">दैनिक गोचर (Transit), साढ़े साती, चौघड़िया व लाल किताब</h2>

    <!-- Sade Sati Status Card -->
    <div class="card mb-3" style="background:#0F172A; border-left:4px solid #38BDF8; padding:10px 14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <h3 style="margin:0; font-size:0.95rem; color:#38BDF8;">शनि साढ़े साती एवं ढैय्या लाइव स्थिति</h3>
        <span class="badge ${data.transitSystem?.sadeSati.isSadeSatiActive ? 'badge-warn' : 'badge-succ'}" style="font-size:0.72rem;">
          ${data.transitSystem?.sadeSati.isSadeSatiActive ? data.transitSystem?.sadeSati.activePhase : 'वर्तमान में साढ़े साती मुक्त'}
        </span>
      </div>
      <p style="font-size:0.8rem; color:#E2E8F0; line-height:1.5; margin:0 0 6px 0;">
        ${data.transitSystem?.sadeSati.summaryHindi}
      </p>
      <div style="font-size:0.75rem; color:#A7F3D0;">
        <strong>विशेष शांति उपाय:</strong> ${data.transitSystem?.sadeSati.remedies.slice(0, 2).join(' • ')}
      </div>
    </div>

    <!-- Real-time Transit Table -->
    <div class="card mb-3" style="background:#0F172A; padding:10px;">
      <div class="card-header" style="padding:4px 0 6px 0;">
        <h3 style="margin:0; font-size:0.92rem; color:#FCD34D;">वर्तमान गोचर ग्रह स्थिति (Live Planetary Transits vs Natal Chart)</h3>
      </div>
      <table class="table-custom" style="margin:0; font-size:0.74rem;">
        <thead>
          <tr>
            <th>ग्रह</th>
            <th>गोचर राशि</th>
            <th style="text-align:center;">लग्न से भाव</th>
            <th style="text-align:center;">चंद्र से भाव</th>
            <th>गोचर प्रभाव</th>
            <th style="text-align:center;">कक्षा स्वामी</th>
          </tr>
        </thead>
        <tbody>
          ${transitRows}
        </tbody>
      </table>
    </div>

    <!-- Day Choghadiya Table -->
    <div class="card mb-3" style="background:#0F172A; padding:10px;">
      <div class="card-header" style="padding:4px 0 6px 0;">
        <h3 style="margin:0; font-size:0.92rem; color:#FCD34D;">आज का दिन का चौघड़िया मुहूर्त (Day Choghadiya Muhurat)</h3>
      </div>
      <table class="table-custom" style="margin:0; font-size:0.74rem;">
        <thead>
          <tr>
            <th>चौघड़िया</th>
            <th style="text-align:center;">प्रकृति</th>
            <th>समय सीमा</th>
            <th>स्वामी ग्रह</th>
            <th>उपयुक्त कार्य</th>
          </tr>
        </thead>
        <tbody>
          ${choghadiyaDayRows}
        </tbody>
      </table>
    </div>

    <!-- Lal Kitab Debts Table -->
    <div class="card mb-3" style="background:#0F172A; padding:10px;">
      <div class="card-header" style="padding:4px 0 6px 0;">
        <h3 style="margin:0; font-size:0.92rem; color:#FCD34D;">लाल किताब तेवा व पूर्व जन्म ऋण विश्लेषण (Lal Kitab Debts & Remedies)</h3>
        <span style="font-size:0.75rem; color:#FBBF24;">${data.lalKitabSystem?.tevaType || 'Aam Teva'}</span>
      </div>
      <table class="table-custom" style="margin:0; font-size:0.74rem;">
        <thead>
          <tr>
            <th style="width:130px;">ऋण का नाम</th>
            <th style="text-align:center; width:80px;">स्थिति</th>
            <th>लक्षण व प्रभाव</th>
            <th>लाल किताब अचूक उपाय</th>
          </tr>
        </thead>
        <tbody>
          ${lalKitabDebtRows}
        </tbody>
      </table>
    </div>

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 5C</span>
    </div>
  </div>

  <!-- ==================== PAGE 6: CHAPTER 02 - THREE PILLARS ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 02: जन्म कुंडली के तीन आधार स्तंभ</span>
    </div>

    <h2 class="chapter-title">02 जन्म कुंडली का प्रभाव: तीन आधार स्तंभ (लग्न, चंद्रमा, नक्षत्र)</h2>

    <!-- Lagna Pillar -->
    <div class="card mb-3" style="border-left: 4px solid #D4AF37;">
      <div class="card-header"><h3 style="margin:0; font-size:1.05rem; color:#FCD34D;">${data.threePillars.lagnaPillar.title}</h3></div>
      <div style="padding:12px;">
        <div style="font-size:0.82rem; color:#38BDF8; margin-bottom:6px;"><strong>${data.threePillars.lagnaPillar.subtitle}</strong></div>
        <p style="font-size:0.88rem; color:#E2E8F0; line-height:1.55; margin:0 0 8px 0;">${data.threePillars.lagnaPillar.description}</p>
        <div style="font-size:0.82rem; color:#A7F3D0; margin-bottom:4px;"><strong>प्रमुख शक्तियां:</strong> ${data.threePillars.lagnaPillar.strengths.join(' • ')}</div>
        <div style="font-size:0.82rem; color:#FEF08A;"><strong>सुझाव:</strong> ${data.threePillars.lagnaPillar.advice}</div>
      </div>
    </div>

    <!-- Moon Pillar -->
    <div class="card mb-3" style="border-left: 4px solid #38BDF8;">
      <div class="card-header"><h3 style="margin:0; font-size:1.05rem; color:#38BDF8;">${data.threePillars.moonPillar.title}</h3></div>
      <div style="padding:12px;">
        <div style="font-size:0.82rem; color:#FCD34D; margin-bottom:6px;"><strong>${data.threePillars.moonPillar.subtitle}</strong></div>
        <p style="font-size:0.88rem; color:#E2E8F0; line-height:1.55; margin:0 0 8px 0;">${data.threePillars.moonPillar.description}</p>
        <div style="font-size:0.82rem; color:#A7F3D0; margin-bottom:4px;"><strong>प्रमुख शक्तियां:</strong> ${data.threePillars.moonPillar.strengths.join(' • ')}</div>
        <div style="font-size:0.82rem; color:#FEF08A;"><strong>सुझाव:</strong> ${data.threePillars.moonPillar.advice}</div>
      </div>
    </div>

    <!-- Nakshatra Pillar -->
    <div class="card mb-3" style="border-left: 4px solid #F59E0B;">
      <div class="card-header"><h3 style="margin:0; font-size:1.05rem; color:#FCD34D;">${data.threePillars.nakshatraPillar.title}</h3></div>
      <div style="padding:12px;">
        <div style="font-size:0.82rem; color:#38BDF8; margin-bottom:6px;"><strong>${data.threePillars.nakshatraPillar.subtitle}</strong></div>
        <p style="font-size:0.88rem; color:#E2E8F0; line-height:1.55; margin:0 0 8px 0;">${data.threePillars.nakshatraPillar.description}</p>
        <div style="font-size:0.82rem; color:#CBD5E1; margin-bottom:4px;"><strong>अधिष्ठाता देवता:</strong> ${data.threePillars.nakshatraPillar.deity} | <strong>प्रतीक:</strong> ${data.threePillars.nakshatraPillar.symbol}</div>
        <div style="font-size:0.82rem; color:#FEF08A;"><strong>सुझाव:</strong> ${data.threePillars.nakshatraPillar.advice}</div>
      </div>
    </div>

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 6</span>
    </div>
  </div>

  <!-- ==================== PAGE 7: CHAPTER 02 - PLANETARY PROFILES ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 02: 9 ग्रहों का विस्तृत प्रभाव</span>
    </div>

    <h2 class="chapter-title">आपकी व्यक्तिगत ग्रह प्रोफ़ाइल एवं दृष्टियां</h2>

    ${data.planetaryProfiles
      .slice(0, 5)
      .map(
        (p) => `
      <div class="card mb-3">
        <div class="card-header">
          <h4 style="margin:0; color:#FCD34D;">${p.planetHindi} (${p.rashi} • भाव ${p.house})</h4>
          <span class="badge badge-gold">${p.status}</span>
        </div>
        <div style="padding:10px 14px;">
          <p style="font-size:0.86rem; color:#E2E8F0; line-height:1.5; margin:0 0 6px 0;">${p.interpretation}</p>
          <div style="font-size:0.8rem; color:#38BDF8; margin-bottom:4px;"><strong>दृष्टि प्रभाव:</strong> ${p.aspectsDescription}</div>
          <div style="font-size:0.8rem; color:#A7F3D0;"><strong>जीवन का पाठ:</strong> ${p.lifeLesson}</div>
        </div>
      </div>`
      )
      .join('')}

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 7</span>
    </div>
  </div>

  <!-- ==================== PAGE 8: CHAPTER 02 - PLANETARY PROFILES PART 2 ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 02: 9 ग्रहों का विस्तृत प्रभाव (भाग 2)</span>
    </div>

    <h2 class="chapter-title">ग्रह प्रोफ़ाइल (शुक्र, शनि, राहु, केतु)</h2>

    ${data.planetaryProfiles
      .slice(5)
      .map(
        (p) => `
      <div class="card mb-3">
        <div class="card-header">
          <h4 style="margin:0; color:#FCD34D;">${p.planetHindi} (${p.rashi} • भाव ${p.house})</h4>
          <span class="badge badge-gold">${p.status}</span>
        </div>
        <div style="padding:10px 14px;">
          <p style="font-size:0.86rem; color:#E2E8F0; line-height:1.5; margin:0 0 6px 0;">${p.interpretation}</p>
          <div style="font-size:0.8rem; color:#38BDF8; margin-bottom:4px;"><strong>दृष्टि प्रभाव:</strong> ${p.aspectsDescription}</div>
          <div style="font-size:0.8rem; color:#A7F3D0;"><strong>जीवन का पाठ:</strong> ${p.lifeLesson}</div>
        </div>
      </div>`
      )
      .join('')}

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 8</span>
    </div>
  </div>

  <!-- ==================== PAGE 9: CHAPTER 03 - BHAVPHAL 1-6 ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 03: भावफल (प्रथम से षष्ठ भाव)</span>
    </div>

    <h2 class="chapter-title">03 भावफल: 12 भावों से जीवन की झलक (भाव 1 से 6)</h2>

    ${bhavphalCards.split('</div>\n    <div class="card mb-4">').slice(0, 6).join('</div>\n    <div class="card mb-4">') + '</div>'}

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 9</span>
    </div>
  </div>

  <!-- ==================== PAGE 10: CHAPTER 03 - BHAVPHAL 7-12 ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 03: भावफल (सप्तम से द्वादश भाव)</span>
    </div>

    <h2 class="chapter-title">भावफल: 12 भावों से जीवन की झलक (भाव 7 से 12)</h2>

    ${'<div class="card mb-4">' + bhavphalCards.split('</div>\n    <div class="card mb-4">').slice(6).join('</div>\n    <div class="card mb-4">')}

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 10</span>
    </div>
  </div>

  <!-- ==================== PAGE 11: CHAPTER 04 & 05 - CONJUNCTIONS & MARRIAGE ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 04 व 05: ग्रह संयोग एवं प्रेम व विवाह</span>
    </div>

    <h2 class="chapter-title">04 जब ऊर्जाएं मिलती हैं: कुंडली के ग्रह संयोग (Yutis)</h2>
    ${conjunctionCards}

    <h2 class="chapter-title mt-4">05 ज्योतिषीय दृष्टिकोण: प्रेम और विवाह</h2>
    <div class="card mb-3" style="background:#0F172A;">
      <div style="padding:14px;">
        <h4 style="margin:0 0 6px 0; color:#FCD34D;">दाराकारक (Darakaraka) विश्लेषण: जीवनसाथी का स्वरूप</h4>
        <div style="display:flex; gap:14px; margin-bottom:8px; font-size:0.85rem;">
          <span>दाराकारक ग्रह: <strong style="color:#FFFFFF;">${data.loveAndMarriage.darakarakaDetails.planet}</strong></span>
          <span>डिग्री: <strong style="color:#F59E0B;">${data.loveAndMarriage.darakarakaDetails.degree}</strong></span>
        </div>
        <p style="font-size:0.86rem; color:#E2E8F0; line-height:1.5; margin:0 0 6px 0;">${data.loveAndMarriage.darakarakaDetails.spouseNature}</p>
        <div style="font-size:0.82rem; color:#A7F3D0; margin-bottom:4px;"><strong>करियर व आर्थिक योगदान:</strong> ${data.loveAndMarriage.darakarakaDetails.spouseCareer} • ${data.loveAndMarriage.darakarakaDetails.financialContribution}</div>
        <div style="font-size:0.82rem; color:#FEF08A;"><strong>दांपत्य सद्भाव सूत्र:</strong> ${data.loveAndMarriage.darakarakaDetails.harmonyTips}</div>
      </div>
    </div>

    <h3 style="font-size:1rem; color:#FCD34D; margin:12px 0 6px 0;">विवाह का समय (विवाह काल पूर्वानुमान तालिका)</h3>
    <table class="table-custom">
      <thead>
        <tr>
          <th>अवधि (Period)</th>
          <th>संभावना</th>
          <th>ज्योतिषीय कारण</th>
        </tr>
      </thead>
      <tbody>
        ${marriageTimingRows}
      </tbody>
    </table>

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 11</span>
    </div>
  </div>

  <!-- ==================== PAGE 12: CHAPTER 06 & 07 - CAREER & CHARA KARAKAS ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 06 व 07: करियर एवं जैमिनी चर कारक</span>
    </div>

    <h2 class="chapter-title">06 आपका करियर पथ: सितारों में लिखा</h2>
    <div class="grid-2 mb-3">
      <div class="card" style="padding:12px;">
        <h4 style="margin:0 0 6px 0; color:#FCD34D;">कार्य के दो स्तंभ: सूर्य व शनि</h4>
        <p style="font-size:0.84rem; color:#CBD5E1; line-height:1.5; margin:0 0 6px 0;"><strong>सूर्य की स्थिति:</strong> ${data.careerAnalysis.twoPillars.sunRole}</p>
        <p style="font-size:0.84rem; color:#CBD5E1; line-height:1.5; margin:0;"><strong>शनि का प्रभाव:</strong> ${data.careerAnalysis.twoPillars.saturnRole}</p>
      </div>
      <div class="card" style="padding:12px;">
        <h4 style="margin:0 0 6px 0; color:#38BDF8;">अमात्यकारक एवं क्षेत्र संभावना</h4>
        <p style="font-size:0.84rem; color:#E2E8F0; margin:0 0 8px 0;">अमात्यकारक: <strong style="color:#FCD34D;">${data.careerAnalysis.amatyakarakaDetails.planet}</strong></p>
        <div style="font-size:0.82rem; color:#CBD5E1; margin-bottom:4px;">कॉरपोरेट जॉब: <strong>${data.careerAnalysis.sectorProbability.corporate}%</strong> | बिज़नेस: <strong>${data.careerAnalysis.sectorProbability.business}%</strong> | सरकारी सेवा: <strong>${data.careerAnalysis.sectorProbability.government}%</strong></div>
        <div style="font-size:0.8rem; color:#A7F3D0;"><strong>अनुशंसित क्षेत्र:</strong> ${data.careerAnalysis.recommendedStreams.join(' • ')}</div>
      </div>
    </div>

    <h2 class="chapter-title mt-3">07 चर कारक: आपके उद्देश्य के पीछे के ग्रह</h2>
    <table class="table-custom">
      <thead>
        <tr>
          <th style="width:22%;">चर कारक</th>
          <th style="width:18%;">प्रतिनिधि ग्रह</th>
          <th style="width:12%;">डिग्री</th>
          <th style="width:24%;">भूमिका व अर्थ</th>
          <th>व्यक्तिगत प्रभाव व लक्ष्य</th>
        </tr>
      </thead>
      <tbody>
        ${charaKarakaRows}
      </tbody>
    </table>

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 12</span>
    </div>
  </div>

  <!-- ==================== PAGE 13: CHAPTER 08, 09, 10 - RAHU-KETU, MANGLIK, SADE SATI ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 08, 09 व 10: राहु-केतु, मांगलिक व साढ़े साती</span>
    </div>

    <h2 class="chapter-title">08 राहु-केतु विश्लेषण: कर्म का खिंचाव और धक्का</h2>
    <div class="card mb-3" style="padding:12px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.85rem;">
        <span style="color:#38BDF8;">राहु: <strong>${data.karmicAxis.rahuHouse}वें भाव (${data.karmicAxis.rahuRashi})</strong></span>
        <span style="color:#FCD34D;">केतु: <strong>${data.karmicAxis.ketuHouse}वें भाव (${data.karmicAxis.ketuRashi})</strong></span>
      </div>
      <p style="font-size:0.85rem; color:#E2E8F0; line-height:1.5; margin:0 0 6px 0;"><strong>राहु की कर्मिक चाह:</strong> ${data.karmicAxis.rahuKarmicDesire}</p>
      <p style="font-size:0.85rem; color:#CBD5E1; line-height:1.5; margin:0 0 6px 0;"><strong>केतु की पूर्व जन्म देन:</strong> ${data.karmicAxis.ketuPastLifeGift}</p>
      <div style="font-size:0.82rem; color:#A7F3D0;"><strong>कर्मिक संतुलन सूत्र:</strong> ${data.karmicAxis.karmicLesson}</div>
    </div>

    <h2 class="chapter-title">09 जन्मजात अग्नि: मांगलिक प्रभाव को समझना</h2>
    <div class="card mb-3" style="padding:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <h4 style="margin:0; color:#FCD34D;">मांगलिक स्थिति का वैज्ञानिक मूल्यांकन</h4>
        <span class="badge badge-succ">${data.manglikAnalysis.status}</span>
      </div>
      <p style="font-size:0.86rem; color:#E2E8F0; line-height:1.5; margin:0 0 6px 0;">${data.manglikAnalysis.detailedSummary}</p>
      <div style="font-size:0.82rem; color:#FEF08A;"><strong>वैवाहिक मार्गदर्शन:</strong> ${data.manglikAnalysis.maritalGuidance}</div>
    </div>

    <h2 class="chapter-title">10 साढ़े साती यात्रा: चुनौती से रूपांतरण तक</h2>
    <div class="card" style="padding:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <div>वर्तमान स्थिति: <strong style="color:#34D399;">${data.sadeSati.currentStatus}</strong> (${data.sadeSati.phase})</div>
        <span class="badge badge-gold">चंद्र राशि: कन्या</span>
      </div>
      <table class="table-custom" style="margin-bottom:8px; font-size:0.77rem;">
        <thead>
          <tr>
            <th style="padding:4px 6px;">साढ़े साती चक्र व चरण</th>
            <th style="padding:4px 6px;">शनि राशि</th>
            <th style="padding:4px 6px;">समय सीमा</th>
            <th style="padding:4px 6px;">प्रमुख थीम व प्रभाव</th>
          </tr>
        </thead>
        <tbody>
          ${data.sadeSati.timeline.map((t) => `
          <tr>
            <td style="font-weight:bold; color:#FCD34D; padding:3px 6px; white-space:nowrap;">${t.cycleName ? `<span style="color:#94A3B8; font-size:0.7rem; display:block;">${t.cycleName}</span>` : ''}${t.phaseName}</td>
            <td style="color:#38BDF8; padding:3px 6px; white-space:nowrap;">${t.rashiName || ''}</td>
            <td style="padding:3px 6px; white-space:nowrap; font-family:monospace;">${t.startDate} से ${t.endDate}</td>
            <td style="font-size:0.75rem; color:#E2E8F0; padding:3px 6px;">${t.theme}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div style="font-size:0.8rem; color:#A7F3D0;"><strong>साढ़े साती शांति उपाय:</strong> ${data.sadeSati.pacificationRemedies.join(' • ')}</div>
    </div>

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 13</span>
    </div>
  </div>

  <!-- ==================== PAGE 14: CHAPTER 11 & 12 - RAJ YOGAS & DOSHAS ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 11 व 12: राजयोग एवं ज्योतिषीय दोष</span>
    </div>

    <h2 class="chapter-title" style="margin-bottom:8px;">11 राज योग: प्रसिद्धि और समृद्धि के संयोजन</h2>
    <div class="grid-3 mb-3" style="gap:8px;">
      ${rajYogaCards}
    </div>

    <h2 class="chapter-title mt-2" style="margin-bottom:8px;">12 ज्योतिषीय दोष: कर्मिक अवरोध और ग्रहों के पाठ</h2>
    <div class="grid-2" style="gap:8px;">
      ${doshasCards}
    </div>

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 14</span>
    </div>
  </div>

  <!-- ==================== PAGE 15: CHAPTER 13 & 14 - DASHAS & NUMEROLOGY ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 13 व 14: महादशा फल एवं अंक ज्योतिष</span>
    </div>

    <h2 class="chapter-title">13 जब ग्रह नेतृत्व करें: विंशोत्तरी महादशाओं की यात्रा</h2>
    <div class="card mb-3" style="padding:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <h4 style="margin:0; color:#FCD34D; font-size:0.95rem;">वर्तमान महादशा: ${data.dashaNarrative.currentMahadasha.planet}</h4>
        <span class="badge badge-gold" style="font-size:0.75rem;">${data.dashaNarrative.currentMahadasha.dates}</span>
      </div>
      <p style="font-size:0.84rem; color:#E2E8F0; line-height:1.5; margin:0 0 6px 0;">${data.dashaNarrative.currentMahadasha.generalTheme}</p>
      <div style="background:#0F172A; padding:8px 10px; border-radius:6px; margin-bottom:6px;">
        <strong style="color:#38BDF8; font-size:0.82rem;">सक्रिय अंतरदशा: ${data.dashaNarrative.currentAntardasha.planet} (${data.dashaNarrative.currentAntardasha.dates})</strong>
        <p style="font-size:0.81rem; color:#CBD5E1; margin:3px 0 0 0; line-height:1.42;">${data.dashaNarrative.currentAntardasha.detailedForecast}</p>
      </div>
      <div style="font-size:0.79rem; color:#A7F3D0;"><strong>प्रमुख गोचर:</strong> ${data.dashaNarrative.majorTransits.map((t) => `${t.planet}: ${t.impactDescription}`).join(' • ')}</div>
    </div>

    <h2 class="chapter-title mt-3">14 अंक ज्योतिष: दिव्यता के चार प्रमुख अंक</h2>
    <div class="grid-2 mb-2" style="gap:8px;">
      <div class="card" style="padding:9px 12px; background:rgba(30, 41, 59, 0.7); border:1px solid rgba(251, 191, 36, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <h4 style="margin:0; font-size:0.86rem; color:#FCD34D;">${data.numerology.mulankDetails.title}</h4>
          <span class="badge badge-gold" style="font-size:0.72rem; padding:2px 6px;">अंक ${data.numerology.mulank}</span>
        </div>
        <p style="font-size:0.78rem; color:#E2E8F0; margin:0 0 4px 0; line-height:1.42;">${data.numerology.mulankDetails.description}</p>
        <div style="font-size:0.74rem; color:#A7F3D0;"><strong>ताकत:</strong> ${data.numerology.mulankDetails.strengths.join(' • ')}</div>
      </div>

      <div class="card" style="padding:9px 12px; background:rgba(30, 41, 59, 0.7); border:1px solid rgba(56, 189, 248, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <h4 style="margin:0; font-size:0.86rem; color:#38BDF8;">${data.numerology.bhagyankDetails.title}</h4>
          <span class="badge" style="background:rgba(56, 189, 248, 0.2); color:#38BDF8; font-size:0.72rem; padding:2px 6px; border-radius:4px;">अंक ${data.numerology.bhagyank}</span>
        </div>
        <p style="font-size:0.78rem; color:#E2E8F0; margin:0 0 4px 0; line-height:1.42;">${data.numerology.bhagyankDetails.description}</p>
        <div style="font-size:0.74rem; color:#FDE68A;"><strong>करियर पथ:</strong> ${data.numerology.bhagyankDetails.careerPath}</div>
      </div>

      <div class="card" style="padding:9px 12px; background:rgba(30, 41, 59, 0.7); border:1px solid rgba(192, 132, 252, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <h4 style="margin:0; font-size:0.86rem; color:#C084FC;">${data.numerology.successNumberDetails.title}</h4>
          <span class="badge" style="background:rgba(192, 132, 252, 0.2); color:#C084FC; font-size:0.72rem; padding:2px 6px; border-radius:4px;">सफलता ${data.numerology.namank}</span>
        </div>
        <p style="font-size:0.78rem; color:#E2E8F0; margin:0 0 4px 0; line-height:1.42;">${data.numerology.successNumberDetails.description}</p>
        <div style="font-size:0.74rem; color:#E9D5FF;"><strong>अवसर:</strong> ${data.numerology.successNumberDetails.opportunities.join(' • ')}</div>
      </div>

      <div class="card" style="padding:9px 12px; background:rgba(30, 41, 59, 0.7); border:1px solid rgba(52, 211, 153, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <h4 style="margin:0; font-size:0.86rem; color:#34D399;">${data.numerology.connectionNumberDetails?.title || 'कनेक्शन संख्या'}</h4>
          <span class="badge" style="background:rgba(52, 211, 153, 0.2); color:#34D399; font-size:0.72rem; padding:2px 6px; border-radius:4px;">कनेक्शन ${data.numerology.connectionNumber}</span>
        </div>
        <p style="font-size:0.78rem; color:#E2E8F0; margin:0 0 4px 0; line-height:1.42;">${data.numerology.connectionNumberDetails?.description || ''}</p>
        <div style="font-size:0.74rem; color:#A7F3D0;"><strong>मुख्य सीख:</strong> ${data.numerology.connectionNumberDetails?.keyLesson || ''}</div>
      </div>
    </div>

    <div class="card" style="padding:8px 12px;">
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between; font-size:0.8rem;">
        <span>शुभ वार: <strong style="color:#FCD34D;">${data.numerology.luckyElements.favorableDays.join(', ')}</strong></span>
        <span>शुभ रंग: <strong style="color:#34D399;">${data.numerology.luckyElements.luckyColors.join(', ')}</strong></span>
        <span>मित्र अंक: <strong style="color:#38BDF8;">${data.numerology.luckyElements.favorableNumbers.join(', ')}</strong></span>
        <span>शत्रु अंक: <strong style="color:#F87171;">${data.numerology.luckyElements.avoidNumbers.join(', ')}</strong></span>
      </div>
    </div>

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 15</span>
    </div>
  </div>

  <!-- ==================== PAGE 16: CHAPTER 15 & 16 - SPIRITUALITY & REMEDIES ==================== -->
  <div class="report-page">
    <div class="header-bar">
      <span class="header-logo">VEDIC ASTRO</span>
      <span>अध्याय 15 व 16: आध्यात्मिक क्षमता एवं संपूर्ण वैदिक उपाय</span>
    </div>

    <h2 class="chapter-title">15 आध्यात्मिक क्षमता एवं इष्ट देव साधना</h2>
    <div class="card mb-3" style="padding:12px;">
      <h4 style="margin:0 0 4px 0; color:#FCD34D;">इष्ट देव: ${data.spirituality.ishtaDevata.name}</h4>
      <p style="font-size:0.84rem; color:#CBD5E1; margin:0 0 6px 0;">${data.spirituality.ishtaDevata.reason}</p>
      <div style="background:#0F172A; padding:8px 12px; border-radius:6px; margin-bottom:6px;">
        <div style="font-size:1.1rem; color:#FCD34D; font-family:'Noto Serif Devanagari', serif; font-weight:bold;">${data.spirituality.ishtaDevata.mantraSanskrit}</div>
        <div style="font-size:0.8rem; color:#94A3B8;">${data.spirituality.ishtaDevata.mantraIast}</div>
      </div>
      <div style="font-size:0.82rem; color:#A7F3D0;"><strong>अनुशंसित साधना:</strong> ${data.spirituality.ishtaDevata.recommendedSadhana}</div>
    </div>

    <h2 class="chapter-title">16 कुंडली को सशक्त बनाने के उपाय</h2>

    <!-- Rudraksha Card -->
    <div class="card mb-3" style="padding:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <h4 style="margin:0; color:#FCD34D;">पवित्र रुद्राक्ष: ${data.remedies.rudraksha.recommendedMukhi}</h4>
        <span class="badge badge-gold">${data.remedies.rudraksha.rulingPlanet}</span>
      </div>
      <div style="font-size:0.82rem; color:#E2E8F0; margin-bottom:4px;"><strong>दिव्य लाभ:</strong> ${data.remedies.rudraksha.benefits.join(' • ')}</div>
      <div style="font-size:0.8rem; color:#A7F3D0;"><strong>धारण विधि:</strong> ${data.remedies.rudraksha.wearingProcedure}</div>
    </div>

    <!-- Gemstones Table -->
    <h3 style="font-size:0.95rem; color:#FCD34D; margin:10px 0 6px 0;">रत्न धारण परामर्श (Gemstone Recommendations)</h3>
    <table class="table-custom">
      <thead>
        <tr>
          <th>श्रेणी</th>
          <th>रत्न</th>
          <th>ग्रह</th>
          <th>धातु</th>
          <th>उंगली</th>
          <th>दिन (होरा)</th>
          <th>प्रमुख लाभ</th>
          <th>उपरत्न</th>
        </tr>
      </thead>
      <tbody>
        ${gemstoneRows}
      </tbody>
    </table>

    <!-- Beej Mantras Table -->
    <h3 style="font-size:0.95rem; color:#FCD34D; margin:10px 0 6px 0;">ग्रह शांति बीज मंत्र (Beej Mantras)</h3>
    <table class="table-custom">
      <thead><tr><th>ग्रह</th><th>बीज मंत्र</th><th>जप संख्या</th><th>समय</th></tr></thead>
      <tbody>${beejMantraRows}</tbody>
    </table>

    <!-- Yantra & Daan -->
    <div class="grid-2">
      <div class="card" style="padding:10px;">
        <h4 style="margin:0 0 4px 0; color:#FCD34D;">यंत्र पूजा नियम (Do's & Don'ts)</h4>
        <div style="font-size:0.78rem; color:#A7F3D0; margin-bottom:4px;"><strong>क्या करें:</strong> ${data.remedies.yantra.dos.join(' • ')}</div>
        <div style="font-size:0.78rem; color:#F87171;"><strong>क्या न करें:</strong> ${data.remedies.yantra.donts.join(' • ')}</div>
      </div>
      <div class="card" style="padding:10px;">
        <h4 style="margin:0 0 4px 0; color:#38BDF8;">ग्रह शांति दान (Charity Guidelines)</h4>
        ${data.remedies.daanRecommendations.map((d) => `<div style="font-size:0.78rem; color:#E2E8F0; margin-bottom:4px;"><strong style="color:#FCD34D;">${d.planet}:</strong> ${d.itemsToDonate.join(', ')} (${d.suitableDay})</div>`).join('')}
      </div>
    </div>

    <div class="footer-bar">
      <span>Vedic Astro Platform</span>
      <span>पृष्ठ 16</span>
    </div>
  </div>

  <!-- ==================== PAGE 17: CHAPTER 17 - CONCLUSION & ROADMAP ==================== -->
  <div class="report-page" style="display:flex; flex-direction:column; justify-content:space-between;">
    <div>
      <div class="header-bar">
        <span class="header-logo">VEDIC ASTRO</span>
        <span>अध्याय 17: सितारों से निर्देशित, आपसे संचालित!</span>
      </div>

      <h2 class="chapter-title">17 सितारों से निर्देशित, आपसे संचालित! (निष्कर्ष एवं स्वर्णिम रोडमैप)</h2>

      <div class="card mb-4" style="background:#0F172A; border-left:4px solid var(--gold-primary); padding:18px;">
        <h3 style="margin:0 0 10px 0; color:#FCD34D; font-size:1.15rem;">जीवन का सार संक्षेप</h3>
        <p style="font-size:0.92rem; color:#E2E8F0; line-height:1.65; margin:0;">
          ${data.conclusion.roadmapSummary}
        </p>
      </div>

      <h3 style="font-size:1.1rem; color:#FCD34D; margin:16px 0 10px 0;">दैनिक जीवन के तीन स्वर्णिम नियम:</h3>
      <div class="card mb-4" style="padding:16px;">
        ${data.conclusion.threeKeyRules.map((r) => `<p style="font-size:0.9rem; color:#A7F3D0; line-height:1.6; margin:0 0 10px 0;">${r}</p>`).join('')}
      </div>

      <div class="card" style="background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(19,27,46,0.9) 80%); border:1px solid #D4AF37; padding:22px; text-align:center;">
        <div style="font-family:'Noto Serif Devanagari', serif; font-size:1.15rem; color:#FDE68A; line-height:1.7; margin-bottom:12px;">
          "${data.conclusion.closingBlessing}"
        </div>
        <div style="font-family:'Cinzel', serif; font-size:0.85rem; color:#94A3B8; letter-spacing:2px;">
          VEDIC ASTRO KUNDLI REPORT • POWERED BY ANCIENT WISDOM & PRECISE MATHEMATICS
        </div>
      </div>
    </div>

    <div style="border-top:1px solid #334155; padding-top:10px; display:flex; justify-content:space-between; font-size:0.75rem; color:#64748B;">
      <span>वेबसाइट: vedic-astro.com | सहायता: support@vedic-astro.com</span>
      <span>रिपोर्ट आईडी: REP_${Math.random().toString(36).substring(2, 10).toUpperCase()} • पृष्ठ 17</span>
    </div>
  </div>

</body>
</html>`;
}
