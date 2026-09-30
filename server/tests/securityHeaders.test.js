const test = require("node:test");
const assert = require("node:assert/strict");
const { securityHeaders } = require("../lib/securityHeaders");

test("sets protective headers and calls next", () => {
  const headers = {};
  let called = false;
  securityHeaders({}, { setHeader: (k, v) => { headers[k] = v; } }, () => { called = true; });
  assert.equal(called, true);
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["X-Frame-Options"], "DENY");
});
