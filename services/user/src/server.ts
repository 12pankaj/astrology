import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { BirthProfileSchema } from '@vedic-astro/validation';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4003;

const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/astrology'
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'user-service', timestamp: new Date().toISOString() });
});

// GET Birth Profiles for User
app.get('/api/v1/birth-profiles', async (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    const result = await db.query(
      'SELECT id, user_id, name, gender, dob, tob, latitude, longitude, place_name, state, country, timezone_id, is_primary, created_at FROM birth_profiles ORDER BY created_at DESC'
    );
    return res.json({ success: true, data: result.rows });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// POST Create Birth Profile
app.post('/api/v1/birth-profiles', async (req, res) => {
  try {
    const parseResult = BirthProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid birth profile', details: parseResult.error.format() } });
    }

    const { name, gender, dob, tob, latitude, longitude, placeName, state, country, timezoneId, isPrimary } = parseResult.data;
    const userId = req.body.userId || '00000000-0000-0000-0000-000000000000';

    const result = await db.query(
      `INSERT INTO birth_profiles 
        (user_id, name, gender, dob, tob, latitude, longitude, place_name, state, country, timezone_id, is_primary)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [userId, name, gender, dob, tob, latitude, longitude, placeName, state || null, country, timezoneId, isPrimary]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

app.listen(PORT, () => {
  console.log(`👤 User Service running on port ${PORT}`);
});
