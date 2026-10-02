/** Accepts [{ name }] or ["name"], trims, and drops blanks. Anything else yields []. */
function parsePassengerNames(passengers) {
  if (!Array.isArray(passengers)) return [];
  return passengers.map((p) => String(p?.name ?? p ?? "").trim()).filter(Boolean);
}

module.exports = { parsePassengerNames };
