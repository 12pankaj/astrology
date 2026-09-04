# Risk Register & Mitigation Matrix (`RISK_REGISTER.md`)

## Risk Matrix

| Risk ID | Category | Risk Description | Severity | Mitigation Strategy |
|---|---|---|---|---|
| `RISK-001` | **Astrological** | Inaccurate planetary position calculation due to wrong Ayanamsha or time math | **High** | Built-in Golden Reference Test Suite running on every build; strict pure TS math based on Swiss Ephemeris formulas. |
| `RISK-002` | **Data/Timezone**| Historical Timezone / Daylight Saving Time (DST) miscalculation for international birth places | **High** | Use IANA Timezone Database strings (`Asia/Kolkata`, `America/New_York`) with `luxon` / `date-fns-tz` to ensure exact historical UTC offsets. |
| `RISK-003` | **Security** | Hardcoded secrets or unparameterized SQL query injection | **Critical** | Enforce raw parameterized queries `$1, $2` with `pg` pool; mandatory `.env` secret validation on service start; zero secrets in Git. |
| `RISK-004` | **Marketplace** | Fraudulent consultation payment claims or duplicate webhooks | **High** | Idempotent payment webhook handler with HMAC signature verification; server-side wallet balance check before call initiation. |
| `RISK-005` | **Cost** | High Google Maps API costs for birth location autocomplete | **Medium** | Map Provider Abstraction (`IGeocodingProvider`) defaulting to free Nominatim / OpenStreetMap. |
