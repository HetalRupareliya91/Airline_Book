"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatINR } from "@/lib/format";

type Flight = {
  flightNumber: string;
  origin: string;
  destination: string;
  departAt: string;
  price: number;
  seatsAvailable: number;
  seatsTotal: number;
  takenSeats?: string[];
};

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [names, setNames] = useState<string[]>([""]);
  const [picked, setPicked] = useState<string[]>([]);
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

  const taken = useMemo(() => new Set(flight?.takenSeats ?? []), [flight]);
  const rows = flight ? Math.ceil(flight.seatsTotal / 6) : 0;
  const exists = (r: number, l: number) => (r - 1) * 6 + l < (flight?.seatsTotal ?? 0);

  function changeCount(next: string[]) {
    setNames(next);
    setPicked((p) => p.slice(0, next.length));
  }

  function toggle(seat: string) {
    setPicked((p) => (p.includes(seat) ? p.filter((s) => s !== seat) : p.length < names.length ? [...p, seat] : p));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (picked.length !== names.length) return setError(`Please select ${names.length} seat(s) on the map.`);
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ flightId: id, passengers: names.map((name) => ({ name })), seatNumbers: picked }),
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
            {flight.flightNumber} · {formatINR(flight.price)} per seat · Total {formatINR(flight.price * names.length)}
          </p>
        ) : null}

        <form onSubmit={submit} className="mt-6 grid gap-3">
          {names.map((n, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="smart-input flex-1"
                placeholder={`Passenger ${i + 1} full name`}
                required
                minLength={2}
                value={n}
                onChange={(e) => changeCount(names.map((x, j) => (j === i ? e.target.value : x)))}
              />
              <span className="w-12 text-center text-sm font-bold text-[#0f3a59]">{picked[i] ?? "—"}</span>
            </div>
          ))}
          <div className="flex gap-3">
            <button type="button" className="smart-ghost-button" disabled={names.length >= max} onClick={() => changeCount([...names, ""])}>
              + Add passenger
            </button>
            <button type="button" className="smart-ghost-button" disabled={names.length <= 1} onClick={() => changeCount(names.slice(0, -1))}>
              Remove
            </button>
          </div>

          {flight ? (
            <div className="mt-2">
              <p className="mb-2 text-sm font-semibold text-[#2f6388]">
                Pick {names.length} seat{names.length > 1 ? "s" : ""} ({picked.length} selected)
              </p>
              <div className="max-h-72 overflow-y-auto rounded-2xl border border-[#a9d8f7] bg-white/70 p-3">
                <div className="mb-1 grid grid-cols-[2rem_repeat(3,1fr)_1rem_repeat(3,1fr)] gap-1 text-center text-xs font-bold text-[#5e8aa9]">
                  <span />
                  {LETTERS.slice(0, 3).map((l) => <span key={l}>{l}</span>)}
                  <span />
                  {LETTERS.slice(3).map((l) => <span key={l}>{l}</span>)}
                </div>
                {Array.from({ length: rows }, (_, r) => r + 1).map((row) => (
                  <div key={row} className="mb-1 grid grid-cols-[2rem_repeat(3,1fr)_1rem_repeat(3,1fr)] items-center gap-1">
                    <span className="text-center text-xs text-[#5e8aa9]">{row}</span>
                    {LETTERS.map((l, li) => {
                      const seat = `${row}${l}`;
                      const cell = !exists(row, li) ? (
                        <span key={seat} />
                      ) : (
                        <button
                          key={seat}
                          type="button"
                          disabled={taken.has(seat)}
                          onClick={() => toggle(seat)}
                          className={`rounded-md py-1 text-xs font-semibold transition ${
                            taken.has(seat)
                              ? "cursor-not-allowed bg-[#d0d5dd] text-[#98a2b3]"
                              : picked.includes(seat)
                                ? "bg-[#1492df] text-white"
                                : "bg-[#e1f2ff] text-[#0f3a59] hover:bg-[#c8ebff]"
                          }`}
                        >
                          {seat}
                        </button>
                      );
                      return li === 2 ? [cell, <span key={`a${row}`} />] : cell;
                    })}
                  </div>
                ))}
              </div>
              <p className="mt-1 text-xs text-[#5e8aa9]">Grey = taken · Blue = your selection</p>
            </div>
          ) : null}

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
