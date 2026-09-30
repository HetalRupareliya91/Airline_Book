const test = require("node:test");
const assert = require("node:assert/strict");
const { seatLabels } = require("../lib/seats");

test("labels seats 6 per row starting at 1A", () => {
  assert.deepEqual(seatLabels(8), ["1A", "1B", "1C", "1D", "1E", "1F", "2A", "2B"]);
});

test("returns unique labels and the requested count", () => {
  const labels = seatLabels(180);
  assert.equal(labels.length, 180);
  assert.equal(new Set(labels).size, 180);
  assert.equal(labels.at(-1), "30F");
});
