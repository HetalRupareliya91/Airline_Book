const test = require("node:test");
const assert = require("node:assert/strict");
const { isEmail, isPassword } = require("../lib/validators");

test("isEmail accepts normal addresses and rejects malformed ones", () => {
  assert.equal(isEmail("a@b.com"), true);
  assert.equal(isEmail("  hetal@example.co.in  "), true);
  for (const bad of ["", "abc", "a@b", "a b@c.com", "@b.com", null, 42]) assert.equal(isEmail(bad), false);
});

test("isPassword enforces 6-72 characters", () => {
  assert.equal(isPassword("12345"), false);
  assert.equal(isPassword("123456"), true);
  assert.equal(isPassword("x".repeat(72)), true);
  assert.equal(isPassword("x".repeat(73)), false);
  assert.equal(isPassword(undefined), false);
});
