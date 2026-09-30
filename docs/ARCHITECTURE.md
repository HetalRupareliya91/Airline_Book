# Architecture

- **Web** (`src/app`): Next.js App Router pages. `next.config.ts` proxies `/api/*` to the Express server on port 5000.
- **API** (`server`): Express 5. `routes/` hold endpoints, `models/` hold Mongoose schemas, `lib/` holds helpers (auth, db, validation, seats, middleware).
- **Auth**: JWT in an httpOnly cookie. `requireAuth` and `requireAdmin` guard routes; `src/middleware.ts` redirects logged-out users away from `/admin` and `/bookings`.
- **Seat safety**: booking uses one atomic `findOneAndUpdate` that checks free seats and reserves them together, so two users can never take the same seat.
- **Data**: `Flight`, `Booking`, `User`, plus the original `AppointmentRequest` and `ContactMessage`.
