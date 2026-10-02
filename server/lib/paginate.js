/** Reads ?page and ?limit safely: page >= 1, 1 <= limit <= maxLimit. */
function parsePagination(query = {}, { defaultLimit = 50, maxLimit = 100 } = {}) {
  const limit = Math.min(Math.max(Number.parseInt(String(query.limit ?? ""), 10) || defaultLimit, 1), maxLimit);
  const page = Math.max(Number.parseInt(String(query.page ?? ""), 10) || 1, 1);
  return { page, limit, skip: (page - 1) * limit };
}

function buildMeta(page, limit, total) {
  return { page, limit, total, pages: Math.max(Math.ceil(total / limit), 1) };
}

module.exports = { parsePagination, buildMeta };
