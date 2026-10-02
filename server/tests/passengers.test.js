const test = require("node:test");
const assert = require("node:assert/strict");
const { parsePassengerNames } = require("../lib/passengers");

test("reads names from objects and plain strings", () => {
  assert.deepEqual(parsePassengerNames([{ name: " Asha " }, "Ravi"]), ["Asha", "Ravi"]);
});

test("drops blank entries", () => {
  assert.deepEqual(parsePassengerNames([{ name: "" }, "   ", null, undefined, { name: "Mina" }]), ["Mina"]);
});

test("non-arrays give an empty list", () => {
  for (const v of [undefined, null, "Asha", 5, {}]) assert.deepEqual(parsePassengerNames(v), []);
});
