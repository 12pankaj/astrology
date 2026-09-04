-- 001_initial_schema.sql: Enterprise Vedic Astrology Master Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'user', -- 'user', 'astrologer', 'admin'
    status VARCHAR(30) NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'unverified'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20),
    avatar_url TEXT,
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Birth Places Table
CREATE TABLE IF NOT EXISTS birth_places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_name VARCHAR(255) NOT NULL,
    state VARCHAR(255),
    country VARCHAR(255) NOT NULL,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    timezone_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Birth Profiles Table
CREATE TABLE IF NOT EXISTS birth_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20),
    dob DATE NOT NULL,
    tob TIME NOT NULL,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    place_name VARCHAR(255) NOT NULL,
    state VARCHAR(255),
    country VARCHAR(255) NOT NULL,
    timezone_id VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Kundli Calculation Cache Table
CREATE TABLE IF NOT EXISTS kundli (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_profile_id UUID NOT NULL REFERENCES birth_profiles(id) ON DELETE CASCADE,
    ayanamsha VARCHAR(50) NOT NULL DEFAULT 'LAHIRI',
    engine_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    lagna_deg NUMERIC(9,6) NOT NULL,
    planets_json JSONB NOT NULL,
    houses_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Divisional Charts Table
CREATE TABLE IF NOT EXISTS divisional_charts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kundli_id UUID NOT NULL REFERENCES kundli(id) ON DELETE CASCADE,
    chart_type VARCHAR(20) NOT NULL, -- 'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'
    chart_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Dashas Table
CREATE TABLE IF NOT EXISTS dashas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kundli_id UUID NOT NULL REFERENCES kundli(id) ON DELETE CASCADE,
    dasha_system VARCHAR(30) NOT NULL DEFAULT 'VIMSHOTTARI',
    dasha_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Panchang Daily Table
CREATE TABLE IF NOT EXISTS panchang (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    tithi_json JSONB NOT NULL,
    vara_json JSONB NOT NULL,
    nakshatra_json JSONB NOT NULL,
    yoga_json JSONB NOT NULL,
    karana_json JSONB NOT NULL,
    muhurat_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Astrology Rules Table
CREATE TABLE IF NOT EXISTS astrology_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL, -- 'career', 'marriage', 'finance', 'health', 'family', 'travel', 'spirituality', 'general'
    planet VARCHAR(30),
    house INT,
    rashi INT,
    condition_json JSONB NOT NULL,
    priority INT DEFAULT 1,
    interpretation_en TEXT NOT NULL,
    interpretation_hi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Astrologers Table
CREATE TABLE IF NOT EXISTS astrologers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    experience_years INT NOT NULL DEFAULT 0,
    per_minute_rate NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    rating NUMERIC(3,2) DEFAULT 5.00,
    total_consultations INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'approved',
    is_online BOOLEAN DEFAULT FALSE,
    languages TEXT[] DEFAULT '{"English", "Hindi"}',
    specializations TEXT[] DEFAULT '{"Vedic Astrology", "Kundli Matching"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Astrologer Availability Table
CREATE TABLE IF NOT EXISTS astrologer_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    astrologer_id UUID NOT NULL REFERENCES astrologers(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL, -- 0 (Sun) to 6 (Sat)
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_online BOOLEAN DEFAULT TRUE
);

-- 12. Consultations Table
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    astrologer_id UUID NOT NULL REFERENCES astrologers(id),
    type VARCHAR(30) NOT NULL DEFAULT 'chat', -- 'chat', 'audio', 'video'
    status VARCHAR(30) NOT NULL DEFAULT 'completed', -- 'scheduled', 'active', 'completed', 'cancelled'
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INT DEFAULT 0,
    total_amount NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Consultation Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    message_text TEXT NOT NULL,
    media_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    astrologer_id UUID NOT NULL REFERENCES astrologers(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL DEFAULT 'free', -- 'free', 'premium_monthly', 'premium_yearly'
    status VARCHAR(30) NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired'
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE
);

-- 16. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_gateway VARCHAR(50) DEFAULT 'RAZORPAY',
    transaction_id VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUCCESS', -- 'PENDING', 'SUCCESS', 'FAILED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. Feature Flags Table
CREATE TABLE IF NOT EXISTS feature_flags (
    key VARCHAR(100) PRIMARY KEY,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Feature Flags Seed
INSERT INTO feature_flags (key, enabled, description) VALUES
    ('kundli', true, 'Enable Kundli generation'),
    ('matching', true, 'Enable 36 Guna Ashtakoota matching'),
    ('panchang', true, 'Enable Panchang & Muhurat'),
    ('astrologer_chat', true, 'Enable live astrologer consultation marketplace'),
    ('ai_astrologer', true, 'Enable AI astrology explanations'),
    ('premium_reports', true, 'Enable premium Kundli report PDF generation')
ON CONFLICT (key) DO NOTHING;

-- 18. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    details_json JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
