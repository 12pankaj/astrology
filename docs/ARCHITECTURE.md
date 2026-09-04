# System Architecture Specification (`ARCHITECTURE.md`)

## 1. High-Level Architecture Overview

The **Vedic Astrology Platform** (`vedic-astro`) is designed as a scalable, modular monorepo containing shared packages, web/mobile applications, microservices, and a PostgreSQL database.

```
                      ┌─────────────────────────┐
                      │    Next.js Web App      │
                      │  (Customer + Admin UI)  │
                      └────────────┬────────────┘
                                   │
                         Shared Packages Layer
             (@vedic-astro/ui, @vedic-astro/astrology-engine,
              @vedic-astro/types, @vedic-astro/validation)
                                   │
                      ┌────────────▼────────────┐
                      │    React Native Mobile  │
                      │     (Android + iOS)     │
                      └────────────┬────────────┘
                                   │
                       API Gateway (Express/Fastify)
                                   │
 ┌───────────────┬─────────────────┼─────────────────┬───────────────┐
 │               │                 │                 │               │
Auth Service  User Service   Astrology Service   Panchang Service  Matching Service
 │               │                 │                 │               │
Notification  Subscription  Consultation Service  Payment Service   Report Worker
 │               │                 │                 │               │
 └───────────────┴─────────────────┼─────────────────┴───────────────┘
                                   │
                        PostgreSQL Database
                                   │
                        Redis / Queue / Storage
```

---

## 2. Shared Packages Specification

- `@vedic-astro/astrology-engine`: Pure TypeScript Vedic calculation engine (Ephemeris, Lagna, Rashis, Nakshatras, Dasha, Divisional Charts D1-D60, Panchang, 36 Guna Ashtakoota, KP, Shadbala).
- `@vedic-astro/ui`: Design system primitives and interactive Kundli chart renderers (North Indian Diamond, South Indian Grid, East Indian).
- `@vedic-astro/types`: TypeScript DTOs, domain models, and API interfaces.
- `@vedic-astro/validation`: Zod validation schemas for API inputs and birth profile creation.
- `@vedic-astro/api-client`: Typed HTTP client SDK using Axios/Fetch with automatic token refresh.
- `@vedic-astro/config`: Ayanamsha defaults, feature flag definitions, constants.
- `@vedic-astro/localization`: Translation dictionary keys for English, Hindi, and Hinglish.
- `@vedic-astro/utils`: Geocoordinate calculations, date/time handling, math helpers.

---

## 3. Core Abstraction Interfaces

### Map / Geocoding Abstraction (`IGeocodingProvider`)
Allows swapping Geocoding providers without affecting core logic:
```typescript
export interface GeocodingResult {
  placeName: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  timezone: string; // IANA string e.g. "Asia/Kolkata"
}

export interface IGeocodingProvider {
  searchPlace(query: string): Promise<GeocodingResult[]>;
  reverseGeocode(lat: number, lng: number): Promise<GeocodingResult>;
}
```

### Payment Provider Abstraction (`IPaymentGateway`)
Enables zero-friction replacement of payment processors (Razorpay, Stripe, etc.):
```typescript
export interface IPaymentGateway {
  createOrder(amount: number, currency: string, metadata: Record<string, any>): Promise<{ orderId: string; rawResponse: any }>;
  verifyWebhook(signature: string, payload: any): Promise<{ isValid: boolean; transactionId: string; status: 'SUCCESS' | 'FAILED' }>;
  processRefund(transactionId: string, amount: number): Promise<{ refundId: string; status: string }>;
}
```

### Notification Provider Abstraction (`INotificationProvider`)
```typescript
export interface INotificationProvider {
  sendPush(token: string, title: string, body: string, data?: any): Promise<boolean>;
  sendSMS(phone: string, text: string): Promise<boolean>;
  sendEmail(to: string, subject: string, html: string): Promise<boolean>;
}
```

---

## 4. Calculation Versioning Strategy

To guarantee historical reproducibility of reports and charts across rule updates:
Every calculated chart JSON includes:
```json
{
  "engine_version": "1.0.0",
  "ephemeris_version": "2026.1",
  "ayanamsha": "LAHIRI",
  "ayanamsha_degree": 23.7291,
  "calculation_timestamp": "2026-09-01T20:20:00.000Z"
}
```
