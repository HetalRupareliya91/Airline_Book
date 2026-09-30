"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Flight = { flightNumber: string; origin: string; destination: string; departAt: string; price: number; seatsAvailable: number };

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [names, setNames] = useState<string[]>([""]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/flights/${id}`);
      const json = (await res.json()) as { ok: boolean; data?: Flight };
      if (json.ok && json.data) setFlight(json.data);
      else setError("Flight not found.");
    })();
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ flightId: id, passengers: names.map((name) => ({ name })) }),
      });
      if (res.status === 401) return router.push("/login");
      const json = (await res.json()) as { ok: boolean; data?: { _id: string }; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message || "Booking failed.");
      router.push(json.data?._id ? `/bookings/${json.data._id}/ticket` : "/bookings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const max = Math.min(9, flight?.seatsAvailable ?? 9);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,#c8ebff_0%,#eaf6ff_45%,#f4fbff_100%)] px-6 py-12 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-lg rounded-[2rem] border border-[#a9d8f7] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(225,242,255,0.88))] p-7 md:p-10">
        <p className="heading-kicker">Booking</p>
        <h1 className="mt-2 text-3xl font-bold text-[#0d2f4c]">
          {flight ? `${flight.origin} → ${flight.destination}` : "Book flight"}
        </h1>
        {flight ? (
          <p className="mt-2 text-[#2f6388]">
            {flight.flightNumber} · ₹{flight.price.toLocaleString()} per seat · Total ₹
            {(flight.price * names.length).toLocaleString()}
          </p>
        ) : null}

        <form onSubmit={submit} className="mt-6 grid gap-3">
          {names.map((n, i) => (
            <input
              key={i}
              className="smart-input"
              placeholder={`Passenger ${i + 1} full name`}
              required
              value={n}
              onChange={(e) => setNames(names.map((x, j) => (j === i ? e.target.value : x)))}
            />
          ))}
          <div className="flex gap-3">
            <button type="button" className="smart-ghost-button" disabled={names.length >= max} onClick={() => setNames([...names, ""])}>
              + Add passenger
            </button>
            <button type="button" className="smart-ghost-button" disabled={names.length <= 1} onClick={() => setNames(names.slice(0, -1))}>
              Remove
            </button>
          </div>
          <button className="smart-button w-full" type="submit" disabled={busy || !flight}>
            {busy ? "Booking..." : "Confirm booking"}
          </button>
          {error ? <p className="text-sm font-semibold text-[#b42318]">{error}</p> : null}
        </form>
        <Link href="/flights" className="smart-ghost-button mt-6 inline-block">Back to flights</Link>
      </div>
    </main>
  );
}
