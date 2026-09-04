# Technical Stack & Dependency Inventory (`DEPENDENCY_LIST.md`)

## 1. Monorepo Core Dependencies

| Package / Tool | Purpose | Reason / Strategy |
|---|---|---|
| `pnpm` | Workspace Monorepo Package Manager | Fast, token-efficient node_modules linking |
| `turborepo` | Build System | Caching & parallel execution across workspace |
| `typescript` | Static Typing | Universal type safety across Web, Mobile & Microservices |

---

## 2. Core Microservices Stack

| Service Layer | Technology | Strategy |
|---|---|---|
| **API Gateway** | Express / Fastify + `express-rate-limit` | Central proxy, CORS, header security |
| **Database Driver** | `pg` (Node Postgres) | Parameterized SQL query pool without ORM overhead |
| **Auth & Security** | `jsonwebtoken`, `bcryptjs`, `helmet`, `cors` | Token rotation, password hashing, security headers |
| **Realtime Chat/Call** | `socket.io`, `peerjs` / WebRTC | Astrologer consultation signaling |
| **Validation** | `zod` | Shared runtime DTO validation |

---

## 3. Web & Mobile App Stack

| Component | Technology | Strategy |
|---|---|---|
| **Web Framework** | Next.js 14 (App Router) + React 18 | SSR, SEO, responsive design |
| **Mobile Framework** | React Native / Expo | Cross-platform Android + iOS |
| **Styling** | Vanilla CSS / CSS Modules | Custom Vedic dark theme & glassmorphism |
| **Charts SVG** | `react-native-svg` (Mobile) / SVG (Web) | Native diamond/grid chart rendering |

---

## 4. Abstraction Adapters Inventory

| Abstraction | Default Provider | Alternate Adapter |
|---|---|---|
| **Geocoding / Maps** | OpenStreetMap / Nominatim (Free) | Google Maps / Mapbox |
| **Payment Gateway** | Razorpay Node SDK | Stripe Node SDK |
| **Notifications** | FCM / Expo Push Notifications | Twilio SMS / Resend Email |
| **Storage** | Local FS (Dev) / AWS S3 Compatible (Prod) | Cloudflare R2 |
