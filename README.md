# E-Commerce App

Full-stack e-commerce — React frontend + Node.js/Express backend + MongoDB.

## Structure

```
backend/   — Express API (port 3000)
frontend/  — React app (CRA)
```

## Running Locally

### Backend
```bash
cd backend
npm install
npm start
```
Needs MongoDB running on 127.0.0.1:27017 (or set `DB_ONLINE`).

### Seed data
On startup the backend seeds the database automatically **if it has no products**:
8 categories and 32 products with real images (from dummyjson.com), plus two accounts:

| Role  | Email            | Password   |
|-------|------------------|------------|
| admin | admin@shop.com   | Admin123   |
| user  | user@shop.com    | User1234   |

To wipe the catalog/carts and reseed manually:
```bash
cd backend
npm run seed
```

### Frontend
```bash
cd frontend
npm install
npm start
```
The frontend calls the API on the same origin (`/api/...`); in dev, the `proxy` in frontend/package.json forwards it to the backend on :3000.

## Kubernetes / Docker

| Hop | Port |
|-----|------|
| Ingress `/api` → Service `api` | 8080 → targetPort **3000** (backend container, `PORT=3000`) |
| Ingress `/` → Service `frontend` | 3000 → targetPort **8080** (nginx-unprivileged, `frontend/nginx.conf`) |

The backend needs `DB_ONLINE` (MongoDB URI) set in its Deployment; it seeds itself on first start.

## Config

All config values have hardcoded defaults so the app runs without any env file. Override via environment variables if needed.
