const test = require("node:test");
const assert = require("node:assert/strict");
const { parsePagination, buildMeta } = require("../lib/paginate");

test("uses defaults when nothing is given", () => {
  assert.deepEqual(parsePagination({}), { page: 1, limit: 50, skip: 0 });
});

test("computes skip and clamps limit and page", () => {
  assert.deepEqual(parsePagination({ page: "3", limit: "20" }), { page: 3, limit: 20, skip: 40 });
  assert.equal(parsePagination({ limit: "9999" }, { maxLimit: 100 }).limit, 100);
  assert.equal(parsePagination({ limit: "-5" }).limit, 1);
  assert.equal(parsePagination({ page: "-2" }).page, 1);
  assert.equal(parsePagination({ page: "abc" }).page, 1);
});

test("buildMeta always reports at least one page", () => {
  assert.deepEqual(buildMeta(1, 20, 0), { page: 1, limit: 20, total: 0, pages: 1 });
  assert.equal(buildMeta(1, 20, 41).pages, 3);
});
