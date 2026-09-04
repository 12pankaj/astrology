# REST & WebSocket API Contracts (`API_CONTRACT.md`)

## 1. Global Standard Response Format

All HTTP REST endpoints return JSON matching this envelope:

### Success Response Envelope:
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-09-01T20:20:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### Error Response Envelope:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid birth time format",
    "details": [
      { "field": "tob", "issue": "Expected HH:mm:ss string" }
    ]
  },
  "meta": {
    "timestamp": "2026-09-01T20:20:00.000Z",
    "requestId": "req_123456789"
  }
}
```

---

## 2. API Endpoints Overview

### Authentication Service (`/api/v1/auth`)
- `POST /api/v1/auth/register` (Email, Phone, Password, FullName)
- `POST /api/v1/auth/login` (Email/Phone, Password) -> Returns Access JWT + HTTP-only Refresh Token
- `POST /api/v1/auth/refresh` -> Rotates refresh token and yields new access token
- `POST /api/v1/auth/logout` -> Revokes refresh token

### User Service (`/api/v1/users`)
- `GET /api/v1/users/me` -> Get user profile
- `PUT /api/v1/users/me` -> Update user profile

### Birth Profiles (`/api/v1/birth-profiles`)
- `GET /api/v1/birth-profiles` -> List user's birth profiles
- `POST /api/v1/birth-profiles` -> Create new birth profile
- `PUT /api/v1/birth-profiles/:id` -> Update birth profile
- `DELETE /api/v1/birth-profiles/:id` -> Delete birth profile

### Astrology Engine API (`/api/v1/astrology`)
- `POST /api/v1/astrology/kundli` -> Calculate Lagna, Planets, Houses, D1 Chart
- `POST /api/v1/astrology/dasha` -> Calculate Vimshottari & Yogini Dasha timeline
- `POST /api/v1/astrology/divisional` -> Calculate specific Divisional Chart (D1 to D60)
- `POST /api/v1/astrology/yogas` -> Detect active Yogas and Doshas

### Panchang API (`/api/v1/panchang`)
- `GET /api/v1/panchang/daily?lat={lat}&lng={lng}&date={date}&tz={tz}` -> Get Tithi, Vara, Nakshatra, Yoga, Karana, Rahu Kalam, Muhurat

### Kundli Matching API (`/api/v1/matching`)
- `POST /api/v1/matching/ashtakoota` -> Calculate 36 Guna score between Person A & Person B + Manglik/Dosha check

### Consultation & Marketplace API (`/api/v1/consultation`)
- `GET /api/v1/consultation/astrologers` -> Search/list verified astrologers
- `POST /api/v1/consultation/book` -> Book scheduled/instant consultation
- WebSocket signaling endpoint: `wss://api.vedic-astro.com/ws/consultation`
