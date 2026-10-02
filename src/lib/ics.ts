type TicketLike = {
  reference: string;
  passengers: { name: string }[];
  flight: { flightNumber: string; origin: string; destination: string; departAt: string; arriveAt: string } | null;
};

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Builds an iCalendar (.ics) event for the flight, or null if the flight was removed. */
export function buildIcs(t: TicketLike): string | null {
  const f = t.flight;
  if (!f) return null;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Airline Book//EN",
    "BEGIN:VEVENT",
    `UID:${t.reference}@airline-book`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(f.departAt)}`,
    `DTEND:${stamp(f.arriveAt)}`,
    `SUMMARY:Flight ${f.flightNumber} ${f.origin} to ${f.destination}`,
    `DESCRIPTION:Booking ${t.reference}. Passengers: ${t.passengers.map((p) => p.name).join("\\, ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadTicketIcs(t: TicketLike) {
  const ics = buildIcs(t);
  if (!ics) return;
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `flight-${t.reference}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
