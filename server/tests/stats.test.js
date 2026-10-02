const test = require("node:test");
const assert = require("node:assert/strict");
const { summarizeStats } = require("../lib/stats");

test("summarises bookings, revenue and occupancy", () => {
  const out = summarizeStats(
    [{ _id: "confirmed", count: 3, revenue: 15000 }, { _id: "cancelled", count: 1, revenue: 4000 }],
    [{ flights: 2, seatsTotal: 200, seatsAvailable: 150 }],
  );
  assert.deepEqual(out, { confirmedBookings: 3, cancelledBookings: 1, revenue: 15000, flights: 2, occupancyPercent: 25 });
});

test("empty database gives zeros, not NaN", () => {
  assert.deepEqual(summarizeStats([], []), { confirmedBookings: 0, cancelledBookings: 0, revenue: 0, flights: 0, occupancyPercent: 0 });
});
