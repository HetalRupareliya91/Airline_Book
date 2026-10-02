# Deployment

## Environment variables
| Name | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string (Atlas works) |
| `MONGODB_DB` | Database name |
| `JWT_SECRET` | Long random string used to sign login cookies |
| `PORT` | API port (default 5000) |
| `CANCEL_CUTOFF_HOURS` | Users cannot cancel this close to departure (default 2) |
| `NODE_ENV` | Set to `production` so cookies are marked `secure` |

## Build and run
```bash
npm ci
npm run build
NODE_ENV=production node server/index.js &   # API
npm start                                    # Next.js on port 3000
```
The Next.js app proxies `/api/*` to the API (see `next.config.ts`), so both processes must run on the same host or you must update the proxy target.

## Checklist
- Use HTTPS so the `secure` cookie flag works.
- Generate a unique `JWT_SECRET` per environment.
- Restrict MongoDB network access to your server's IP.
- Run `npm run seed` only in demo environments.
