// Adds sample flights for the next N days (default 14). Safe to re-run: existing flights are not duplicated.
//   npm run seed            or            npm run seed -- --days 30
const { loadEnv } = require("../lib/env");
const { connectToDatabase } = require("../lib/db");

loadEnv();
const mongoose = require("mongoose");
const Flight = require("../models/Flight");

const ROUTES = [
  ["Surat", "Delhi", 5200, 150],
  ["Delhi", "Surat", 5100, 150],
  ["Surat", "Mumbai", 2800, 120],
  ["Mumbai", "Surat", 2700, 120],
  ["Mumbai", "Delhi", 4500, 180],
  ["Delhi", "Mumbai", 4600, 180],
  ["Delhi", "Bengaluru", 6100, 180],
  ["Bengaluru", "Mumbai", 4900, 180],
];
const DURATION_HOURS = 2;

async function main() {
  const i = process.argv.indexOf("--days");
  const days = i > -1 ? Number.parseInt(process.argv[i + 1], 10) || 14 : 14;

  await connectToDatabase();
  const ops = [];
  for (let d = 1; d <= days; d++) {
    ROUTES.forEach(([origin, destination, basePrice, seats], r) => {
      const departAt = new Date();
      departAt.setUTCDate(departAt.getUTCDate() + d);
      departAt.setUTCHours(1 + r * 2, 30, 0, 0);
      const arriveAt = new Date(departAt.getTime() + DURATION_HOURS * 60 * 60 * 1000);
      const price = basePrice + (d % 5) * 150; // small variation across days
      ops.push({
        updateOne: {
          filter: { flightNumber: `AR${100 + r}`, departAt },
          update: { $setOnInsert: { origin, destination, arriveAt, price, seatsTotal: seats, seatsAvailable: seats } },
          upsert: true,
        },
      });
    });
  }
  const res = await Flight.bulkWrite(ops);
  console.log(`[seed] added ${res.upsertedCount} new flights (${ops.length - res.upsertedCount} already existed).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed] failed:", err.message);
  process.exit(1);
});
