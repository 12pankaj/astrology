# PostgreSQL Database Schema Design (`DATABASE_DESIGN.md`)

## 1. Principles & Standard Requirements
- **Driver**: Node `pg` connection pool with raw parameterized SQL queries (`$1, $2`).
- **NO ORM**: No Prisma, TypeORM, or Sequelize.
- **Migration Strategy**: Version-controlled raw `.sql` files executed sequentially in `database/migrations/`.
- **Primary Keys**: UUID v4 (`gen_random_uuid()`).
- **Timestamps**: `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`, `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`.

---

## 2. Core Tables DDL Schema

```sql
-- Migration 001_init.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'user', -- 'user', 'astrologer', 'admin'
    status VARCHAR(30) NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'unverified'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles
CREATE TABLE user_profiles (
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

-- Birth Profiles
CREATE TABLE birth_profiles (
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

-- Kundli Calculation Data Cache
CREATE TABLE kundli (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_profile_id UUID NOT NULL REFERENCES birth_profiles(id) ON DELETE CASCADE,
    ayanamsha VARCHAR(50) NOT NULL DEFAULT 'LAHIRI',
    engine_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    lagna_deg NUMERIC(9,6) NOT NULL,
    planets_json JSONB NOT NULL,
    houses_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Astrologers Marketplace
CREATE TABLE astrologers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    experience_years INT NOT NULL DEFAULT 0,
    per_minute_rate NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    rating NUMERIC(3,2) DEFAULT 5.00,
    total_consultations INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    is_online BOOLEAN DEFAULT FALSE,
    languages TEXT[] DEFAULT '{}',
    specializations TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultations
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    astrologer_id UUID NOT NULL REFERENCES astrologers(id),
    type VARCHAR(30) NOT NULL, -- 'chat', 'audio', 'video'
    status VARCHAR(30) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'active', 'completed', 'cancelled'
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INT DEFAULT 0,
    total_amount NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature Flags
CREATE TABLE feature_flags (
    key VARCHAR(100) PRIMARY KEY,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    details_json JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
