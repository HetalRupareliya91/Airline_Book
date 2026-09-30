const test = require("node:test");
const assert = require("node:assert/strict");
const { createRateLimiter } = require("../lib/rateLimit");

function run(limiter, ip = "1.1.1.1") {
  const res = { headers: {}, statusCode: 200, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; } };
  let passed = false;
  limiter({ ip }, res, () => { passed = true; });
  return { res, passed };
}

test("allows up to max requests then returns 429", () => {
  const limiter = createRateLimiter({ windowMs: 60_000, max: 2 });
  assert.equal(run(limiter).passed, true);
  assert.equal(run(limiter).passed, true);
  const third = run(limiter);
  assert.equal(third.passed, false);
  assert.equal(third.res.statusCode, 429);
  assert.ok(third.res.headers["Retry-After"]);
});

test("limits each IP separately", () => {
  const limiter = createRateLimiter({ windowMs: 60_000, max: 1 });
  assert.equal(run(limiter, "a").passed, true);
  assert.equal(run(limiter, "b").passed, true);
  assert.equal(run(limiter, "a").passed, false);
});
