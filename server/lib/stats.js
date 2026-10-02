/** Turns the two aggregation results into the numbers shown on the admin dashboard. */
function summarizeStats(byStatus = [], flightTotals = []) {
  const get = (status) => byStatus.find((x) => x._id === status) || { count: 0, revenue: 0 };
  const confirmed = get("confirmed");
  const cancelled = get("cancelled");
  const f = flightTotals[0] || { flights: 0, seatsTotal: 0, seatsAvailable: 0 };
  const sold = f.seatsTotal - f.seatsAvailable;
  return {
    confirmedBookings: confirmed.count,
    cancelledBookings: cancelled.count,
    revenue: confirmed.revenue,
    flights: f.flights,
    occupancyPercent: f.seatsTotal ? Math.round((sold / f.seatsTotal) * 100) : 0,
  };
}

module.exports = { summarizeStats };
