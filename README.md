# Thinkboard

A minimal full-stack notes app. One repo, one install, one command to run.

## Stack

- **Frontend:** React, Vite, React Router, Tailwind, DaisyUI, Lucide React, React Hot Toast
- **Backend:** Express, Mongoose (MongoDB)
- **Rate limiting:** Upstash Redis (optional)

## Quick start

```bash
cp .env.example .env
# Edit .env and set MONGO_URI (required)
npm install
npm run dev
```

- App: **http://localhost:5173**
- API: **http://localhost:5001**

One terminal runs both the API and the Vite dev server.

## Scripts

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm run dev`  | Run API + frontend (one terminal)    |
| `npm run build`| Build frontend to `dist/`           |
| `npm start`    | Run API only, serve built app (prod)|

For production: set `NODE_ENV=production`, run `npm run build`, then `npm start`. The server serves the API and the static frontend on one port.

## Environment

Create `.env` in the project root:

- `MONGO_URI` – MongoDB connection string (required)
- `PORT` – optional, default 5001
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` – optional, for rate limiting

## Structure

```
thinkboard/
  src/           # Frontend (React)
  server/        # Backend (Express + Mongoose)
  dist/          # Built frontend (after npm run build)
  package.json   # Single deps + scripts
```
