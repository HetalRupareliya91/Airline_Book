"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatDateTime, formatDuration, formatINR } from "@/lib/format";

type Flight = {
  _id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departAt: string;
  arriveAt: string;
  price: number;
  seatsAvailable: number;
};

export default function FlightsPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("departure");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams();
      if (origin) qs.set("origin", origin);
      if (destination) qs.set("destination", destination);
      if (date) qs.set("date", date);
      qs.set("sort", sort);
      const res = await fetch(`/api/flights?${qs.toString()}`);
      const json = (await res.json()) as { ok: boolean; data?: Flight[]; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message || "Search failed.");
      setFlights(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [origin, destination, date, sort]);

  useEffect(() => {
    void search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,#c8ebff_0%,#eaf6ff_45%,#f4fbff_100%)] px-6 py-12 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-5xl rounded-[2rem] border border-[#a9d8f7] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(225,242,255,0.88))] p-7 md:p-10">
        <p className="heading-kicker">Flights</p>
        <h1 className="mt-2 text-4xl font-bold text-[#0d2f4c]">Search flights</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void search();
          }}
          className="mt-6 grid gap-3 sm:grid-cols-4"
        >
          <input className="smart-input" placeholder="From" value={origin} onChange={(e) => setOrigin(e.target.value)} />
          <input className="smart-input" placeholder="To" value={destination} onChange={(e) => setDestination(e.target.value)} />
          <input className="smart-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button className="smart-button" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#2f6388]">
          <label className="flex items-center gap-2">
            Sort by
            <select className="smart-input" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="departure">Earliest departure</option>
              <option value="-departure">Latest departure</option>
              <option value="price">Lowest price</option>
              <option value="-price">Highest price</option>
            </select>
          </label>
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-[#b42318]">{error}</p> : null}

        <div className="mt-6 grid gap-4">
          {flights.map((f) => (
            <article key={f._id} className="glass-panel flex flex-wrap items-center justify-between gap-4 p-5 text-[#123e5f]">
              <div>
                <p className="text-lg font-bold text-[#0f3a59]">
                  {f.origin} → {f.destination}
                </p>
                <p className="text-sm text-[#416b8a]">
                  {f.flightNumber} · {formatDateTime(f.departAt)} – {formatDateTime(f.arriveAt)} · {formatDuration(f.departAt, f.arriveAt)}
                </p>
                <p className="text-xs text-[#5e8aa9]">{f.seatsAvailable} seats left</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-2xl font-bold text-[#0f3a59]">{formatINR(f.price)}</p>
                <Link href={`/flights/${f._id}/book`} className="smart-button">
                  Book
                </Link>
              </div>
            </article>
          ))}
          {!loading && flights.length === 0 ? <p className="text-sm text-[#416b8a]">No flights found.</p> : null}
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/bookings" className="smart-ghost-button">My bookings</Link>
          <Link href="/" className="smart-ghost-button">Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
