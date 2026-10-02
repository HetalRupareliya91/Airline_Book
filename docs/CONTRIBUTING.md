# Contributing

## Branches
Create one branch per change from an up to date `main`: `feat/...`, `fix/...`, `docs/...`, `test/...`, `chore/...`.

## Commits
Use short, imperative messages with a type prefix, for example `feat(flights): add price filter` or `fix(bookings): release seats on cancel`. Keep each commit to one logical change.

## Pull requests
- One feature or fix per PR, with a short description of what changed and why.
- Run `npm test` and `npm run typecheck` before opening it.
- Update `docs/API.md` when an endpoint changes and `CHANGELOG.md` for user-visible changes.
- Never add code that decodes or executes strings (see `docs/SECURITY.md`).
