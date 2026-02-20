# FinGuard AI Frontend

Next.js (App Router + TypeScript) frontend for the FinGuard AI fraud detection platform.

## Prerequisites

- Node.js 18+
- npm
- Backend API running on `http://localhost:8000`

## Install

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

Frontend will be available at:

- `http://localhost:3000`

## Build and Run (production)

```bash
npm run build
npm run start
```

## Routes

- `/` — Home and platform status
- `/detect` — Fraud detection form + transaction history
- `/dashboard` — Live analytics dashboard

## API Integration

The frontend uses Axios in `services/api.ts` with base URL:

- `http://localhost:8000`

Endpoints consumed:

- `POST /predict`
- `GET /transactions`
- `PATCH /transactions/{id}/block`

## Notes

- Styling is implemented with Tailwind CSS plus shared classes and tokens in `app/globals.css`.
- If backend is not running, pages show connection errors by design.
