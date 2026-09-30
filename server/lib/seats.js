// Seat layout: 6 seats per row (A-F), e.g. seat index 0 -> "1A", index 6 -> "2A".
const LETTERS = "ABCDEF";

function seatLabels(total) {
  return Array.from({ length: total }, (_, i) => `${Math.floor(i / 6) + 1}${LETTERS[i % 6]}`);
}

module.exports = { seatLabels };
