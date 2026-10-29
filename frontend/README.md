# FinSight frontend

Responsive personal-finance dashboard built with React, Vite, React Router, Recharts, Lucide, and Axios. Currency is formatted as Indian Rupees (`en-IN`).

## Run locally

From the `frontend` directory:

```sh
npm install
npm run dev
npm run lint
npm run build
```

## Features

- Dashboard with balance, income, expenses, savings, monthly cash-flow and category charts, recent transactions, budgets, and savings-goal progress.
- Transaction create, edit, delete, search, and type/category/date filters.
- Monthly category budgets with spending progress and over-budget alerts.
- Savings goal create, edit, delete, and contribution tracking.
- EMI and emergency-fund calculators, including a 3/6/12-month coverage planner.
- What-if comparison for income and expense changes, current savings, and a configurable projection duration.
- Income/expense reports, category analysis, savings trends, profile, registration, and logout pages.

## Data and authentication

The project currently runs in local mock-data mode. Transactions, budgets, and savings goals are persisted in browser local storage; login state is stored in the browser session. The login/register screens are explicitly demo-only and do not verify credentials or provide real account security. Connect an authentication and finance API before using real accounts or financial data.

The finance service is isolated in `src/services/financeApi.js` and expects the `{ "success": true, "data": ... }` response envelope when connected to an API. Set `VITE_API_BASE_URL` to configure the API base URL. Financial-planning data and calculations are implemented in `src/services/financialPlanningApi.js` and `src/utils/financialCalculations.js`; no planning backend is assumed.
