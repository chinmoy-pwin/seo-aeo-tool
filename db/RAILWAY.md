# Railway database (PostgreSQL)

BuildCraft deploys the database as a **managed Railway plugin**, not from files in `db/`.

## Manual Railway setup

1. Create a Railway project and add the **PostgreSQL** plugin (`railway add --database postgres`).
2. Link `DATABASE_URL` on the **api** service (Railway injects this automatically when services share a project).
3. Deploy **api** from `backend/` (`backend/railway.toml`) and **web** from `frontend/` (`frontend/railway.toml`).

SQL migrations in `db/migrations/` are applied at deploy time by BuildCraft, or run manually against `DATABASE_URL`.
