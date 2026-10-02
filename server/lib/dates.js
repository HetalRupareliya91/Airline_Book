/** Returns the UTC [start, end) range for a YYYY-MM-DD string, or null if it is not a valid date. */
function utcDayRange(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return null;
  const start = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime())) return null;
  return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
}

module.exports = { utcDayRange };
