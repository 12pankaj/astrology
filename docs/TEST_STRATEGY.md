# Comprehensive Testing Strategy & Golden Test Matrix (`TEST_STRATEGY.md`)

## 1. Testing Pyramid

- **Unit Tests**: Pure TS engine calculations, date conversion, planetary degrees, Ashtakoota Guna scoring.
- **Integration Tests**: Microservice REST API routes, JWT security middleware, raw SQL queries.
- **Astrology Golden Reference Tests**: Verified reference birth-data regression test suite.
- **E2E Tests**: Web customer login -> Birth profile -> Kundli rendering & matching workflow.

---

## 2. Test Execution Commands

```bash
# Run all unit and golden tests across monorepo
pnpm test

# Run pure TS calculation engine test suite
pnpm --filter @vedic-astro/astrology-engine test

# Run microservice integration tests
pnpm --filter auth-service test
pnpm --filter user-service test
```

---

## 3. Minimum Test Case Matrix (As specified in `ASTROLOGY_APP_REQUIREMENTS.txt`)

| Category | Test ID | Description | Expected Outcome |
|---|---|---|---|
| **AUTH** | `TC-AUTH-001` | Register New User | Returns User ID & 201 Created |
| **AUTH** | `TC-AUTH-002` | Valid Login | Returns Access JWT & Refresh Cookie |
| **AUTH** | `TC-AUTH-003` | Invalid Password | Returns 401 Unauthorized Envelope |
| **AUTH** | `TC-AUTH-007` | Expired Token Refresh | Successfully yields new Access Token |
| **PROFILE**| `TC-PROFILE-001`| Create Birth Profile | Resolves Lat/Lng/TZ & Stores in DB |
| **ASTRO** | `TC-ASTRO-001`| Calculate Lagna | Exact Ascendant longitude match |
| **ASTRO** | `TC-ASTRO-005`| Planetary Positions | Valid 9 planetary longitudes & signs |
| **ASTRO** | `TC-ASTRO-007`| Retrograde Handling | Correctly tags Saturn/Jupiter R status |
| **ASTRO** | `TC-ASTRO-010`| Ayanamsha Config | Correctly calculates Lahiri offset |
| **DIVISION**| `TC-DIV-001` | D1 Rashi Chart | Accurate sign placement per house |
| **DIVISION**| `TC-DIV-002` | D9 Navamsha Chart | Accurate 9th division sign placement |
| **DASHA** | `TC-DASHA-001`| Vimshottari Dasha | Correct Mahadasha timeline & balance |
| **PANCHANG**| `TC-PAN-001` | Daily Tithi | Accurate Sun-Moon 12° division Tithi |
| **PANCHANG**| `TC-PAN-007` | Rahu Kalam | Location-based 1/8th day segment calculation |
| **MATCHING**| `TC-MATCH-001`| 36 Guna Ashtakoota | Exact Guna breakdown score (0-36) |
| **MATCHING**| `TC-MATCH-005`| Manglik Dosha Check | Identifies Kuja placement and cancellations |

---

## 4. Golden Test Reference Dataset Sample

```typescript
export const GOLDEN_CASE_001 = {
  id: "GOLDEN_001",
  dob: "1990-01-15",
  tob: "10:30:00",
  lat: 28.6139,
  lng: 77.2090,
  timezone: "Asia/Kolkata",
  ayanamsha: "LAHIRI",
  expected: {
    lagnaRashi: "Kumbha",
    lagnaDegree: 18.42,
    sunRashi: "Makara",
    moonRashi: "Simha",
    nakshatra: "Purva Phalguni",
    pada: 3,
    dashaBalanceYears: 3.25
  }
};
```
