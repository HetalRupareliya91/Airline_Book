/** Rupee amount with Indian digit grouping, e.g. ₹1,05,000 */
export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** e.g. "5 Oct 2026, 6:30 am" in the viewer's locale */
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

/** Flight duration between two ISO timestamps, e.g. "2h 15m" */
export const formatDuration = (fromIso: string, toIso: string) => {
  const mins = Math.max(Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / 60000), 0);
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};
