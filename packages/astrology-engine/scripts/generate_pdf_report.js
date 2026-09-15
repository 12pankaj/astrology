import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { generateFullKundliReport } from '../dist/reportGenerator.js';
import { generateKundliReportHtml } from '../dist/reportHtml.js';

async function main() {
  console.log('🔮 Loading compiled Vedic Astrology Report Engine...');

  const native = {
    name: 'PANKAJ DADHICH',
    gender: 'Male',
    dob: '2002-02-01',
    tob: '06:55:00',
    latitude: 26.8956428,
    longitude: 74.4629988,
    place: 'Kheri Seela, Rajasthan, India'
  };

  console.log(`📊 Computing 17 Chapters for ${native.name} (${native.dob} ${native.tob})...`);
  const reportData = generateFullKundliReport(
    native.name,
    native.gender,
    native.dob,
    native.tob,
    native.latitude,
    native.longitude,
    native.place
  );

  console.log('✅ Calculations complete:');
  console.log('  - Lagna:', reportData.avakahada.lagna, reportData.avakahada.lagnaDegree);
  console.log('  - Moon Sign:', reportData.avakahada.moonRashi, reportData.avakahada.nakshatra);
  console.log('  - Chara Karakas count:', reportData.charaKarakas.length);
  console.log('  - Bhavphal houses analyzed:', reportData.bhavphal.length);
  console.log('  - Raj Yogas detected:', reportData.rajYogas.length);
  console.log('  - Doshas evaluated:', reportData.doshas.length);
  console.log('  - Manglik Status:', reportData.manglikAnalysis.status);
  console.log('  - Sade Sati Status:', reportData.sadeSati.currentStatus);

  console.log('🎨 Generating Publication-Quality HTML with Vector SVG Charts...');
  const html = generateKundliReportHtml(reportData);

  const htmlOutputPath = path.resolve('d:/astrology', 'test_kundli_report.html');
  fs.writeFileSync(htmlOutputPath, html, 'utf8');
  console.log(`📄 HTML report written to: ${htmlOutputPath} (${html.length} characters)`);

  // Headless Chrome PDF Generation
  console.log('🖨️ Compiling PDF with Headless Chrome Engine...');
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  let chromeExe = 'chrome';
  for (const c of candidates) {
    if (fs.existsSync(c)) { chromeExe = c; break; }
  }

  const pdfOutputPath = path.resolve('d:/astrology', 'REP_vedic_kundli_pankaj.pdf');
  const cmd = `"${chromeExe}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfOutputPath}" "${htmlOutputPath}"`;
  
  execSync(cmd, { stdio: 'inherit' });

  if (fs.existsSync(pdfOutputPath)) {
    const stats = fs.statSync(pdfOutputPath);
    console.log(`🎉 SUCCESS! PDF generated successfully:`);
    console.log(`   File: ${pdfOutputPath}`);
    console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB (${stats.size} bytes)`);
  } else {
    console.error('❌ PDF was not generated.');
  }
}

main().catch(console.error);
