# FinSight frontend

Responsive personal finance dashboard built with React, Vite, React Router, Recharts, Lucide, and Axios. Mock financial values use Indian Rupees, `en-IN` formatting, and Indian spending categories.

## Run locally

From the `frontend` directory:

```sh
npm install
npm run dev
```

## Mock data and API

The initial dashboard uses realistic sample data in `src/data/mockData.js`. API access is kept separate from UI components in `src/services/financeApi.js`; the mock-data flag can be switched off when the finance API is available. The service expects successful responses in the `{ "success": true, "data": { ... } }` envelope and errors in the `{ "success": false, "message": "..." }` envelope. Set `VITE_API_BASE_URL` to configure the API base URL.
