# Changelog

## Unreleased

### Added
- Flight search with filters (price, seats), sorting, pagination and city autocomplete.
- Bookings with atomic seat reservation, seat map, cancellation rules and printable e-tickets with calendar export.
- Admin tabs for flights (create, edit price, delete) and bookings (summary, status filter).
- `npm run seed` / `npm run seed:clear`, `npm test`, `npm run typecheck`.
- Docs: API reference, architecture, testing, deployment, security, contributing.

### Changed
- Server hardening: request logging, security headers, rate limited auth, JSON 404s and clearer validation errors.
- Shared helpers for validation, pagination, dates and configuration, each with unit tests.

### Security
- Removed a hidden loader that ran code decoded from SVG comments; added a guard test.
