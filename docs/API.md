# API reference

All responses look like `{ "ok": true, "data": ... }` or `{ "ok": false, "error": "...", "message": "..." }`.
Auth uses an httpOnly `token` cookie set by login/register.

## Auth
- `POST /api/auth/register` - `{ email, password }` (password >= 6 chars). The first user becomes admin.
- `POST /api/auth/login` - `{ email, password }`

## Flights
- `GET /api/flights` - public search. Query: `origin`, `destination`, `date=YYYY-MM-DD`, `maxPrice`, `minSeats`, `sort` (`price`, `-price`, `departure`, `-departure`), `page`, `limit`.
- `GET /api/flights/meta/cities` - distinct origin/destination names.
- `GET /api/flights/:id` - one flight, including `takenSeats`.
- `POST /api/flights` - admin. `{ flightNumber, origin, destination, departAt, arriveAt, price, seatsTotal }`
- `PATCH /api/flights/:id` - admin. `price`, `departAt`, `arriveAt`.
- `DELETE /api/flights/:id` - admin.

## Bookings (login required)
- `POST /api/bookings` - `{ flightId, passengers: [{ name }], seatNumbers?: ["3A"] }`. Seats are reserved atomically; 409 if taken.
- `GET /api/bookings/mine` - your bookings.
- `GET /api/bookings/:id` - one booking (owner or admin).
- `GET /api/bookings/stats` - admin. `{ confirmedBookings, cancelledBookings, revenue, flights, occupancyPercent }`.
- `PATCH /api/bookings/:id/cancel` - owner or admin. Users cannot cancel within `CANCEL_CUTOFF_HOURS` (default 2) of departure.
- `GET /api/bookings` - admin, all bookings. Query: `status` (confirmed or cancelled), `page`, `limit`. Returns `meta`.

## Health
- `GET /api/health` - service and database status.
