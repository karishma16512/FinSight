# FinSight

## Local development

1. Copy `backend/.env.example` to `backend/.env`.
2. In `backend/.env`, replace `MONGO_URI` with your MongoDB connection string and set `JWT_SECRET` to a long, random secret. The MongoDB connection string belongs in `backend/.env` as the value of `MONGO_URI`; do not commit that file. If your network requires a specific DNS resolver, optionally set `MONGO_DNS_SERVERS` to a comma-separated list.
3. Install dependencies in `backend` and `frontend` with `npm install`.
4. Start the API with `npm run dev` from `backend`, then start Vite with `npm run dev` from `frontend`.

The frontend proxies `/api` requests to `http://localhost:5000` by default. To use a different API origin, define `VITE_API_BASE_URL` in the frontend environment (for example `http://localhost:5000/api`).