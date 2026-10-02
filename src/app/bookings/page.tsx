"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatDateTime, formatINR } from "@/lib/format";

type Booking = {
  _id: string;
  reference: string;
  passengers: { name: string }[];
  seats: number;
  totalPrice: number;
  status: "confirmed" | "cancelled";
  seatNumbers?: string[];
  flight: { origin: string; destination: string; departAt: string; flightNumber: string } | null;
};

export default function BookingsPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/bookings/mine");
    const json = (await res.json()) as { ok: boolean; data?: Booking[]; message?: string };
    if (!res.ok || !json.ok) return setError(json.message || "Failed to load bookings.");
    setItems(json.data || []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function cancel(id: string) {
    setError("");
    const res = await fetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
    const json = (await res.json()) as { ok: boolean; message?: string };
    if (!res.ok || !json.ok) return setError(json.message || "Cancel failed.");
    await load();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,#c8ebff_0%,#eaf6ff_45%,#f4fbff_100%)] px-6 py-12 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-5xl rounded-[2rem] border border-[#a9d8f7] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(225,242,255,0.88))] p-7 md:p-10">
        <p className="heading-kicker">Account</p>
        <h1 className="mt-2 text-4xl font-bold text-[#0d2f4c]">My bookings</h1>
        {error ? <p className="mt-4 text-sm font-semibold text-[#b42318]">{error}</p> : null}
        <div className="mt-6 grid gap-4">
          {items.map((b) => (
            <article key={b._id} className="glass-panel flex flex-wrap items-start justify-between gap-3 p-5 text-[#123e5f]">
              <div>
                <p className="text-lg font-bold text-[#0f3a59]">
                  {b.flight ? `${b.flight.origin} → ${b.flight.destination}` : "Flight removed"}
                </p>
                <p className="text-sm text-[#416b8a]">
                  Ref {b.reference} · {b.flight ? formatDateTime(b.flight.departAt) : ""}
                </p>
                <p className="text-sm text-[#2f6388]">{b.passengers.map((p) => p.name).join(", ")}</p>
                <p className="text-sm font-semibold text-[#0f3a59]">
                  {formatINR(b.totalPrice)} · {b.status}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/bookings/${b._id}/ticket`} className="smart-ghost-button">View ticket</Link>
                {b.status === "confirmed" ? (
                  <button className="smart-ghost-button" onClick={() => void cancel(b._id)}>Cancel</button>
                ) : null}
              </div>
            </article>
          ))}
          {items.length === 0 && !error ? <p className="text-sm text-[#416b8a]">No bookings yet.</p> : null}
        </div>
        <Link href="/flights" className="smart-button mt-6 inline-block">Search flights</Link>
      </div>
    </main>
  );
}
