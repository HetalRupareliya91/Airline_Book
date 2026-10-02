const test = require("node:test");
const assert = require("node:assert/strict");
const { utcDayRange } = require("../lib/dates");

test("returns a 24 hour UTC range", () => {
  const r = utcDayRange("2026-10-15");
  assert.equal(r.start.toISOString(), "2026-10-15T00:00:00.000Z");
  assert.equal(r.end.toISOString(), "2026-10-16T00:00:00.000Z");
});

test("rejects malformed dates", () => {
  for (const bad of ["", "abc", "2026-13-45", "15-10-2026", "2026-10-15T10:00", undefined]) assert.equal(utcDayRange(bad), null);
});
