const test = require("node:test");
const assert = require("node:assert/strict");
const { escapeRegex } = require("../lib/escapeRegex");

test("escapes regex metacharacters", () => {
  assert.equal(escapeRegex("a.b*c"), "a\\.b\\*c");
});

test("the escaped text matches itself literally and nothing else", () => {
  const re = new RegExp(escapeRegex("New (Delhi)+"), "i");
  assert.equal(re.test("new (delhi)+"), true);
  assert.equal(re.test("New Delhi"), false);
});
