import express from 'express';
import cors from 'cors';
import { KundliRequestSchema, KundliMatchingSchema } from '@vedic-astro/validation';
import { calculateKundli, calculateDivisionalCharts, calculateVimshottariDasha, calculateDailyPanchang, calculateAshtakootaMatching } from '@vedic-astro/astrology-engine';

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

app.listen(PORT, () => {
  console.log(`🔮 Astrology Service running on port ${PORT}`);
});
