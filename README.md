# Elevra — Executive English Coaching Web Platform

A full-stack, responsive web application for **Elevra (English with Kanika)**, built with React, Vite, TypeScript, Express, Mongoose (MongoDB Atlas), and Resend.

---

## Architecture Overview

```text
elevra/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB Atlas connection & state check
│   ├── middleware/
│   │   ├── errorHandler.js    # Safe, sanitized error handler
│   │   ├── rateLimiter.js     # IP-based rate limiting (5 req / 15 min for bookings)
│   │   └── validation.js      # Strict field validation, enums & honeypot spam trap
│   ├── models/
│   │   └── DemoRequest.js     # Mongoose lead schema with notification lifecycle
│   ├── routes/
│   │   └── demoRoutes.js      # POST /api/demo-requests & protected retry endpoint
│   ├── services/
│   │   └── emailService.js    # Resend email notification service + bounded retry worker
│   ├── test/
│   │   ├── backend.test.js    # API, validation, 503 db handling & rate limit tests
│   │   └── emailService.test.js # Email failure isolation & retry backoff unit tests
│   └── index.js               # Express application entrypoint & static client hosting
├── src/
│   ├── components/
│   │   ├── Layout.tsx         # Navbar, mobile drawer, footer, scroll-to-top
│   │   └── Sections.tsx       # Hero, Features, DemoBooking form, etc.
│   ├── pages/
│   │   └── Home.tsx           # Single-page high-converting landing experience
│   ├── styles.css             # Responsive styles with fluid typography
│   └── main.tsx
├── .env.example               # Template for required environment variables
├── vite.config.ts             # Vite configuration with /api development proxy
└── package.json
```

---

## Environment Variables

Copy `.env.example` to `.env` before running locally:

```bash
cp .env.example .env
```

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | Server port (defaults to 5001) | `5001` |
| `NODE_ENV` | Optional | Environment mode | `development` or `production` |
| `MONGODB_URI` | **Required** | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster0.mongodb.net/elevra` |
| `RESEND_API_KEY` | **Required** | Resend API Key | `re_1234567890abcdef` |
| `VERIFIED_FROM_EMAIL` | **Required** | Verified sender in Resend | `Elevra Bookings <onboarding@resend.dev>` |
| `COACH_EMAIL` | **Required** | Destination email for notifications | `kanika@elevra.in` |
| `CORS_ORIGIN` | Optional | Allowed frontend origins (comma-separated) | `http://localhost:5173,https://your-domain.com` |
| `INTERNAL_ADMIN_KEY` | Optional | Secret key to trigger manual retry pass | `your_secret_admin_token` |

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Fullstack Dev Server (Frontend + Backend concurrently)
```bash
npm run dev
```
- Client runs on **http://localhost:5173** (or the next available port Vite assigns)
- Backend runs on **http://localhost:5001**
- Vite automatically proxies `/api/*` requests to port `5001`.

### 3. Run Backend or Client Independently
```bash
# Run Express server only (with file watching)
npm run dev:server

# Run Vite client only
npm run dev:client
```

### 4. Run Automated Test Suite
```bash
npm test
```
Executes all 12 backend integration and unit tests using Node's native test runner (`node:test`).

### 5. Build for Production
```bash
npm run build
```

---

## API Specification

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response** (200 OK or 503 Degraded):
  ```json
  {
    "status": "healthy",
    "database": "connected",
    "environment": "development",
    "uptimeSeconds": 142,
    "timestamp": "2026-10-09T15:35:00.000Z"
  }
  ```

### 2. Submit Demo Request
- **Endpoint**: `POST /api/demo-requests`
- **Rate Limit**: Max 5 requests per 15 minutes per IP.
- **Request Body**: 
  ```json
  {
    "fullName": "Rahul Sharma",
    "profession": "Associate Director, Consulting",
    "email": "rahul.sharma@example.com",
    "whatsappNumber": "+91 98765 43210",
    "format": "1-on-1 VIP Mentorship",
    "preferredSlot": "Evening (6:00 PM – 9:00 PM)",
    "primaryGoal": "Executive tone and leadership presence",
    "company_hp": ""
  }
  ```
- **Allowed Values**:
  - `format`: `"1-on-1 VIP Mentorship"` \| `"Executive Group Cohort"`
  - `preferredSlot`: `"Morning (9:00 AM – 12:00 PM)"` \| `"Evening (6:00 PM – 9:00 PM)"` \| `"Weekend Batch"`
  - `primaryGoal`:
    - `"Freezing under pressure in meetings"`
    - `"Executive tone and leadership presence"`
    - `"Client presentations & interviews"`
    - `"Concise email writing & updates"`
    - `"Overcoming mother-tongue translation"`
- **Response** (201 Created):
  ```json
  {
    "success": true,
    "message": "Spot reserved successfully! We will confirm your Google Meet slot shortly on WhatsApp & email.",
    "leadId": "67069123456789abcdef0123",
    "leadSaved": true,
    "notificationStatus": "sent"
  }
  ```
- **Database Unavailable** (503 Service Unavailable):
  ```json
  {
    "success": false,
    "leadSaved": false,
    "message": "Database service is temporarily unavailable. Please try again shortly or contact us directly on WhatsApp (+91 87002 76743)."
  }
  ```

### 3. Protected Internal Retry
- **Endpoint**: `POST /api/internal/retry-emails`
- **Header**: `x-internal-admin-key: <INTERNAL_ADMIN_KEY>`
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "result": { "processed": 2, "successful": 2 }
  }
  ```

---

## Resend Email & Bounded Retry Design

1. **Lead Preservation First**: The lead is always saved in MongoDB before email delivery is attempted.
2. **Delivery Decoupling**: If Resend fails (or credentials are missing), the lead remains safely preserved in the database with status `new` and `emailNotification.status = 'failed'`.
3. **Bounded Exponential Backoff**:
   - Attempt 1: Failed -> Scheduled retry after 2 minutes
   - Attempt 2: Failed -> Scheduled retry after 10 minutes
   - Attempt 3: Failed -> Marked as `'permanently_failed'` (no further automatic retries)
4. **Background Worker**: An in-process background worker (`startEmailRetryWorker()`) runs every 2 minutes checking for eligible failed notifications.

---

## Deployment to Render (Single-Service)

Elevra is configured for streamlined deployment as a **Single Web Service** on Render:

1. **Create Web Service** on Render connected to your Git repository.
2. **Environment**: `Node`
3. **Build Command**:
   ```bash
   npm install && npm run build
   ```
4. **Start Command**:
   ```bash
   npm start
   ```
5. **Add Environment Variables** in the Render Dashboard:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<your MongoDB Atlas URI>`
   - `RESEND_API_KEY`: `<your Resend API key>`
   - `VERIFIED_FROM_EMAIL`: `<your verified Resend sender>`
   - `COACH_EMAIL`: `kanika@elevra.in`
   - `CORS_ORIGIN`: `https://your-service.onrender.com`
   - `INTERNAL_ADMIN_KEY`: `<secure random string>`
6. In production, Express automatically serves the compiled static files from `dist/` and routes all API endpoints under `/api`.

---

## Verification Status

| Component | Status | Notes |
| :--- | :---: | :--- |
| **Frontend Form Integration** | **Verified** | Controlled inputs, honeypot, loading/error states, duplicate submit prevention. |
| **Frontend Production Build** | **Verified** | `npm run build` compiles TypeScript & bundles assets with 0 errors. |
| **Validation & Enums** | **Verified** | 100% matched against frontend dropdown options. |
| **Rate Limiter & Honeypot** | **Verified** | Tested with automated unit suite. |
| **Database Disconnect (503)** | **Verified** | Tested that requests fail safely with 503 without claiming success. |
| **Protected Internal Retry** | **Verified** | 403 when key is missing/invalid, 200 when authenticated. |
| **Email Failure Isolation** | **Verified** | Bounded attempts & backoff verified with unit tests. |
| **Live Atlas & Live Resend Delivery** | *Requires Credentials* | Requires populating `MONGODB_URI` and `RESEND_API_KEY` in `.env`. |

# elevra-client
