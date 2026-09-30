# Airline Book

Flight search and booking app: Next.js 16 front end, Express + MongoDB (Mongoose) API.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `MONGODB_URI` and `JWT_SECRET`.
3. `npm run seed` to add sample flights (optional).
4. `npm run dev` - web on http://localhost:3000, API on http://localhost:5000.

The first account you register becomes the admin.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Web and API together |
| `npm run dev:web` / `npm run dev:server` | Only one of them |
| `npm run build` / `npm start` | Production build and start |
| `npm run lint` | ESLint |
| `npm test` | Server unit tests (node:test) |
| `npm run seed` | Add sample flights for the next 14 days |
| `npm run seed:clear` | Remove sample flights that have no bookings |
