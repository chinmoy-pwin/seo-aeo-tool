# Full-Stack Application

## Project Structure
```
├── frontend/        React + Vite + TypeScript
├── backend/         Fastify + TypeScript API
├── db/              Database migrations and seeds
├── docker-compose.yml
├── railway.toml     Railway project manifest (api + web + db)
└── README.md
```

## Quick Start (Docker)
```bash
cp backend/.env.example backend/.env   # edit DB/JWT values
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- Health: http://localhost:8080/api/health

## Railway one-click deploy
BuildCraft deploys **api**, **web**, and **Postgres** as separate Railway services. The frontend uses `VITE_API_URL` (set at build) via `src/lib/api.ts` — do not rely on nginx to proxy `/api`.

## Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env    # edit values
npm run dev             # listens on port 8080
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:8080
npm run dev             # Vite on port 3000, proxies /api → backend
```

## Database
```bash
# Run migrations (PostgreSQL)
psql $DATABASE_URL < db/migrations/001_init.sql
psql $DATABASE_URL < db/migrations/002_seed.sql
```

## Changelog

- 2026-06-23T09:46:05.626Z — Pipeline `6a3a558942b2a0ef34898a6e` (v1) stage `frontend_generator`
  - Files generated/updated in this stage: 21
