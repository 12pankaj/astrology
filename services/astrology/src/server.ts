import express from 'express';
import cors from 'cors';
import { KundliRequestSchema, KundliMatchingSchema } from '@vedic-astro/validation';
import {
  calculateKundli,
  calculateDivisionalCharts,
  calculateVimshottariDasha,
  calculateDailyPanchang,
  calculateAshtakootaMatching,
  generateFullKundliReport,
  generateKundliReportHtml
} from '@vedic-astro/astrology-engine';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4002;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'astrology-service', timestamp: new Date().toISOString() });
});

// Calculate Kundli Endpoint
app.post('/api/v1/astrology/kundli', (req, res) => {
  try {
    const parseResult = KundliRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid birth parameters', details: parseResult.error.format() }
      });
    }

    const { dob, tob, latitude, longitude, timezoneId, ayanamsha } = parseResult.data;
    const kundli = calculateKundli(dob, tob, latitude, longitude, timezoneId, ayanamsha);

    return res.json({
      success: true,
      data: kundli
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'CALCULATION_ERROR', message: err.message }
    });
  }
});

// Calculate Divisional Charts Endpoint (D1 - D60)
app.post('/api/v1/astrology/divisional', (req, res) => {
  try {
    const parseResult = KundliRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' } });
    }

    const { dob, tob, latitude, longitude, timezoneId, ayanamsha } = parseResult.data;
    const kundli = calculateKundli(dob, tob, latitude, longitude, timezoneId, ayanamsha);
    const charts = calculateDivisionalCharts(kundli);

    return res.json({
      success: true,
      data: charts
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'CALCULATION_ERROR', message: err.message } });
  }
});

// Calculate Vimshottari Dasha Endpoint
app.post('/api/v1/astrology/dasha', (req, res) => {
  try {
    const parseResult = KundliRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' } });
    }

    const { dob, tob, latitude, longitude, timezoneId, ayanamsha } = parseResult.data;
    const kundli = calculateKundli(dob, tob, latitude, longitude, timezoneId, ayanamsha);
    const dasha = calculateVimshottariDasha(kundli, dob);

    return res.json({
      success: true,
      data: dasha
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'CALCULATION_ERROR', message: err.message } });
  }
});

// Calculate Panchang Endpoint
app.post('/api/v1/astrology/panchang', (req, res) => {
  try {
    const { date, latitude, longitude } = req.body;
    if (!date || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'date, latitude, longitude required' } });
    }

    const panchang = calculateDailyPanchang(date, latitude, longitude);
    return res.json({
      success: true,
      data: panchang
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'CALCULATION_ERROR', message: err.message } });
  }
});

// Calculate Kundli Matching Endpoint (36 Gunas Ashtakoota)
app.post('/api/v1/astrology/matching', (req, res) => {
  try {
    const parseResult = KundliMatchingSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload for both Person A and Person B' } });
    }

    const { personA, personB } = parseResult.data;
    const kundliA = calculateKundli(personA.dob, personA.tob, personA.latitude, personA.longitude, personA.timezoneId);
    const kundliB = calculateKundli(personB.dob, personB.tob, personB.latitude, personB.longitude, personB.timezoneId);

    const matching = calculateAshtakootaMatching(kundliA, kundliB);

    return res.json({
      success: true,
      data: matching
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'CALCULATION_ERROR', message: err.message } });
  }
});

// Full 17-Chapter Kundli Report Endpoints
app.post('/api/v1/astrology/report/json', (req, res) => {
  try {
    const { name = 'PANKAJ DADHICH', gender = 'Male', dob = '2002-02-01', tob = '06:55:00', place = 'Kheri Seela, Rajasthan', latitude = 26.8956, longitude = 74.4630 } = req.body;
    const reportData = generateFullKundliReport(name, gender, dob, tob, latitude, longitude, place);
    return res.json({ success: true, data: reportData });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'REPORT_GEN_ERROR', message: err.message } });
  }
});

app.post('/api/v1/astrology/report/html', (req, res) => {
  try {
    const { name = 'PANKAJ DADHICH', gender = 'Male', dob = '2002-02-01', tob = '06:55:00', place = 'Kheri Seela, Rajasthan', latitude = 26.8956, longitude = 74.4630 } = req.body;
    const reportData = generateFullKundliReport(name, gender, dob, tob, latitude, longitude, place);
    const html = generateKundliReportHtml(reportData);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'REPORT_HTML_ERROR', message: err.message } });
  }
});

app.post('/api/v1/astrology/report/pdf', (req, res) => {
  try {
    const { name = 'PANKAJ DADHICH', gender = 'Male', dob = '2002-02-01', tob = '06:55:00', place = 'Kheri Seela, Rajasthan', latitude = 26.8956, longitude = 74.4630 } = req.body;
    const reportData = generateFullKundliReport(name, gender, dob, tob, latitude, longitude, place);
    const html = generateKundliReportHtml(reportData);

    const tmpDir = os.tmpdir();
    const fileId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const htmlPath = path.join(tmpDir, `${fileId}.html`);
    const pdfPath = path.join(tmpDir, `${fileId}.pdf`);

    fs.writeFileSync(htmlPath, html, 'utf8');

    const candidates = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium'
    ];
    let chromeExe = 'chrome';
    for (const c of candidates) {
      if (fs.existsSync(c)) { chromeExe = c; break; }
    }

    execSync(`"${chromeExe}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`, { timeout: 45000 });
    const pdfBuf = fs.readFileSync(pdfPath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Vedic_Kundli_Report_${encodeURIComponent(name)}.pdf"`);
    res.setHeader('Content-Length', pdfBuf.length);

    setTimeout(() => {
      try {
        if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
      } catch {}
    }, 30000);

    return res.send(pdfBuf);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'REPORT_PDF_ERROR', message: err.message } });
  }
});


app.listen(PORT, () => {
  console.log(`🔮 Astrology Service running on port ${PORT}`);
});
