# Mobiversite E‑commerce Monorepo

JS + JSX only. Next.js 15 app router; json-server backend.

## Local Run

```bash
# 1) install deps
npm i

# 2) seed API (writes apps/api/db.json from fakestoreapi)
npm run seed

# 3) envs
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local

# 4) dev (runs API @4000 and Web @3000 together)
npm run dev
```
Login with: `demo@mobiversite.io / 123456` or create a user in **/register**.

## Notes
- Project is JavaScript + JSX only.
- `pageExtensions: ['js','jsx']` so stray TSX is ignored.
- Prebuild guard blocks TS/TSX in `apps/web`.
