# Security

## Reporting a problem
Open a private security advisory on GitHub (Security tab -> Report a vulnerability) or contact the repository owner directly. Please do not post exploit details in public issues.

## Rules for contributors
- Never commit secrets. `.env` is git-ignored; use `.env.example` for placeholders.
- Never execute data as code: no `eval`, no `new Function`, no decoding and running strings. `server/tests/noHiddenCode.test.js` fails the build if this appears in server code.
- Do not hide payloads in assets (images, SVGs, fonts). The same test rejects large comments inside SVG files.
- Review every dependency you add; prefer well known packages with active maintenance.

## What the app already does
- Passwords are hashed with bcrypt; sessions use a signed JWT in an httpOnly, sameSite cookie.
- Login and register are rate limited; responses carry basic security headers.
- Seat reservation is atomic, so seats cannot be double booked.

## History
An earlier version of this project contained a hidden loader that decoded text from SVG comments and ran it. It was removed in the "security: remove hidden remote code execution" pull request. If you ran an older version on your machine, rotate any passwords and tokens you used on it.
