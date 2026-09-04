import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4004;

const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/astrology'
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'consultation-service', timestamp: new Date().toISOString() });
});

// GET Astrologers Marketplace List
app.get('/api/v1/consultation/astrologers', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.id, a.user_id, up.full_name, up.avatar_url, a.bio, a.experience_years, 
             a.per_minute_rate, a.rating, a.total_consultations, a.is_online, a.languages, a.specializations
      FROM astrologers a
      JOIN user_profiles up ON a.user_id = up.user_id
      WHERE a.status = 'approved'
      ORDER BY a.is_online DESC, a.rating DESC
    `);
    return res.json({ success: true, data: result.rows });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// POST Book Consultation
app.post('/api/v1/consultation/book', async (req, res) => {
  try {
    const { userId, astrologerId, type = 'chat' } = req.body;
    if (!userId || !astrologerId) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'userId and astrologerId required' } });
    }

    const result = await db.query(
      `INSERT INTO consultations (user_id, astrologer_id, type, status, started_at)
       VALUES ($1, $2, $3, 'active', NOW())
       RETURNING *`,
      [userId, astrologerId, type]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

app.listen(PORT, () => {
  console.log(`🧙 Consultation Service running on port ${PORT}`);
});
