import pg from 'pg';
import bcrypt from 'bcryptjs';

const password = process.env.DB_PASSWORD || 'root';
const user = process.env.DB_USER || 'postgres';
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '5432', 10);
const dbName = process.env.DB_NAME || 'astrology';

async function seedData() {
  console.log(`🌱 Seeding initial reference data into '${dbName}'...`);
  const client = new pg.Client({ user, password, host, port, database: dbName });

  try {
    await client.connect();

    const passHash = await bcrypt.hash('password123', 10);

    // 1. Seed Demo Users
    const userRes = await client.query(`
      INSERT INTO users (email, phone, password_hash, role)
      VALUES 
        ('user@vedic-astro.com', '+919876543210', $1, 'user'),
        ('astrologer1@vedic-astro.com', '+919876543211', $1, 'astrologer'),
        ('astrologer2@vedic-astro.com', '+919876543212', $1, 'astrologer'),
        ('admin@vedic-astro.com', '+919876543213', $1, 'admin')
      ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
      RETURNING id, email, role;
    `, [passHash]);

    const usersMap = {};
    userRes.rows.forEach((r) => { usersMap[r.email] = r.id; });

    // 2. Seed User Profiles
    await client.query(`
      INSERT INTO user_profiles (user_id, full_name, gender, preferred_language, timezone)
      VALUES 
        ($1, 'Rahul Sharma', 'male', 'hi', 'Asia/Kolkata'),
        ($2, 'Acharya Devraj', 'male', 'en', 'Asia/Kolkata'),
        ($3, 'Pandit Ramesh Shastri', 'male', 'hi', 'Asia/Kolkata'),
        ($4, 'Vedic Astro Admin', 'male', 'en', 'Asia/Kolkata')
      ON CONFLICT DO NOTHING;
    `, [usersMap['user@vedic-astro.com'], usersMap['astrologer1@vedic-astro.com'], usersMap['astrologer2@vedic-astro.com'], usersMap['admin@vedic-astro.com']]);

    // 3. Seed Saved Birth Profiles
    await client.query(`
      INSERT INTO birth_profiles (user_id, name, gender, dob, tob, latitude, longitude, place_name, country, timezone_id, is_primary)
      VALUES 
        ($1, 'Rahul Primary Kundli', 'male', '1990-01-15', '10:30:00', 28.6139, 77.2090, 'New Delhi', 'India', 'Asia/Kolkata', true)
      ON CONFLICT DO NOTHING;
    `, [usersMap['user@vedic-astro.com']]);

    // 4. Seed Astrologers Marketplace Profiles
    await client.query(`
      INSERT INTO astrologers (user_id, bio, experience_years, per_minute_rate, rating, total_consultations, status, is_online, languages, specializations)
      VALUES 
        ($1, 'Expert Vedic Astrologer with 15+ years experience in Kundli, Career & Relationship guidance.', 15, 25.00, 4.95, 1420, 'approved', true, '{"Hindi", "English"}', '{"Vedic Astrology", "Kundli", "Career"}'),
        ($2, 'Specialist in Ashtakoota Matchmaking, Kuja/Manglik Dosha Remedies & Gemstones.', 20, 35.00, 4.98, 2890, 'approved', true, '{"Hindi"}', '{"Matchmaking", "Dosha Remedies", "Lal Kitab"}')
      ON CONFLICT DO NOTHING;
    `, [usersMap['astrologer1@vedic-astro.com'], usersMap['astrologer2@vedic-astro.com']]);

    // 5. Seed Astrology Rules & Interpretations
    await client.query(`
      INSERT INTO astrology_rules (category, planet, house, rashi, condition_json, priority, interpretation_en, interpretation_hi)
      VALUES 
        ('career', 'Sun', 10, 0, '{"planet": "Sun", "house": 10}', 1, 'Sun in 10th house indicates leadership, authority, high position in government or executive management.', 'दशम भाव में सूर्य प्रशासनिक अधिकारियों, सरकारी पद एवं नेतृत्व क्षमता को दर्शाता है।'),
        ('marriage', 'Venus', 7, 1, '{"planet": "Venus", "house": 7}', 1, 'Venus in 7th house blesses with an attractive, loving spouse and harmonious marital relationship.', 'सप्तम भाव में शुक्र सुंदर, स्नेही जीवनसाथी एवं सुखद वैवाहिक जीवन प्रदान करता है।'),
        ('finance', 'Jupiter', 2, 8, '{"planet": "Jupiter", "house": 2}', 1, 'Jupiter in 2nd house ensures steady wealth accumulation, wisdom in financial management, and supportive family.', 'द्वितीय भाव में गुरु धन संचय, वाणी में मधुरता एवं परिवार का पूर्ण सहयोग दिलाता है।')
      ON CONFLICT DO NOTHING;
    `, []);

    console.log(`✅ Seed data successfully inserted!`);
  } catch (err) {
    console.error(`❌ Seeding failed:`, err.message);
  } finally {
    await client.end();
  }
}

seedData();
