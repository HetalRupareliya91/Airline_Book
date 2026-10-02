const test = require("node:test");
const assert = require("node:assert/strict");
const { getConfig } = require("../lib/config");

test("falls back to defaults", () => {
  assert.deepEqual(getConfig({}), { port: 5000, cancelCutoffHours: 2 });
});

test("reads numeric overrides, including 0", () => {
  assert.deepEqual(getConfig({ PORT: "8080", CANCEL_CUTOFF_HOURS: "0" }), { port: 8080, cancelCutoffHours: 0 });
});

test("ignores values that are not numbers", () => {
  assert.equal(getConfig({ CANCEL_CUTOFF_HOURS: "soon" }).cancelCutoffHours, 2);
  assert.equal(getConfig({ PORT: "" }).port, 5000);
});
