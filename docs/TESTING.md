# Testing

## Run the tests
```bash
npm test          # server unit tests (Node's built-in test runner, no extra packages)
npm run typecheck # TypeScript
npm run lint      # ESLint
```

## What is covered
Pure helpers in `server/lib` have unit tests in `server/tests`: rate limiter, security headers, seat labels, validators, passenger parsing, date ranges, regex escaping, pagination, config and dashboard stats. A guard test (`noHiddenCode.test.js`) fails if `eval` or hidden SVG payloads appear.

## Adding a test
1. Put logic you want to test in a small function under `server/lib` (no database or Express objects).
2. Create `server/tests/<name>.test.js` using `node:test` and `node:assert/strict`.
3. Run `npm test`. Files ending in `.test.js` are discovered automatically.

## Manual check of the booking flow
1. Register (the first account becomes admin), open `/admin` and add a flight.
2. Search on `/flights`, book two seats, and open the ticket.
3. Cancel the booking and confirm the seats show as free again on the seat map.
