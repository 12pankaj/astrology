import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { RegisterSchema, LoginSchema } from '@vedic-astro/validation';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'vedic-astro-jwt-secret-key-2026';
const PORT = process.env.PORT || 4001;

// Raw PostgreSQL Parameterized Connection Pool (No ORM / No Prisma)
const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/astrology'
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth-service', timestamp: new Date().toISOString() });
});

// Register Endpoint
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parseResult.error.format() }
      });
    }

    const { email, phone, password, fullName } = parseResult.data;

    // Check existing user
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'User with this email already exists' }
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Raw SQL parameterized insert
    const userRes = await db.query(
      'INSERT INTO users (email, phone, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
      [email, phone || null, passwordHash, 'user']
    );

    const user = userRes.rows[0];

    // Insert user profile
    await db.query(
      'INSERT INTO user_profiles (user_id, full_name) VALUES ($1, $2)',
      [user.id, fullName]
    );

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, role: user.role, fullName }
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message }
    });
  }
});

// Login Endpoint
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parseResult.error.format() }
      });
    }

    const { email, password } = parseResult.data;

    const userRes = await db.query('SELECT id, email, password_hash, role FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, role: user.role }
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message }
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Auth Service running on port ${PORT}`);
});
