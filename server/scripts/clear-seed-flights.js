// Deletes sample flights (AR1xx) that have no bookings.   npm run seed:clear
const { loadEnv } = require("../lib/env");
const { connectToDatabase } = require("../lib/db");

loadEnv();
const mongoose = require("mongoose");
const Flight = require("../models/Flight");
const Booking = require("../models/Booking");

async function main() {
  await connectToDatabase();
  const booked = await Booking.distinct("flight");
  const res = await Flight.deleteMany({ flightNumber: /^AR1\d\d$/, _id: { $nin: booked } });
  console.log(`[seed:clear] removed ${res.deletedCount} sample flights (flights with bookings were kept).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed:clear] failed:", err.message);
  process.exit(1);
});
