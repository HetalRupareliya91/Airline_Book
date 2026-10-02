"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { downloadTicketIcs } from "@/lib/ics";
import { formatINR } from "@/lib/format";

type Booking = {
  reference: string;
  passengers: { name: string }[];
  seats: number;
  seatNumbers?: string[];
  totalPrice: number;
  status: "confirmed" | "cancelled";
  createdAt: string;
  flight: { flightNumber: string; origin: string; destination: string; departAt: string; arriveAt: string } | null;
};

const fmt = (iso: string) => new Date(iso).toLocaleString([], { dateStyle: "full", timeStyle: "short" });

export default function TicketPage() {
  const { id } = useParams<{ id: string }>();
  const [b, setB] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/bookings/${id}`);
      const json = (await res.json()) as { ok: boolean; data?: Booking };
      if (res.ok && json.ok && json.data) setB(json.data);
      else setError("Ticket not found.");
    })();
  }, [id]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,#c8ebff_0%,#eaf6ff_45%,#f4fbff_100%)] px-6 py-12 sm:px-10 print:bg-white print:p-0">
      <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-[#a9d8f7] bg-white p-7 md:p-10 print:border-black print:rounded-none">
        <p className="heading-kicker">E-ticket</p>
        {error ? <p className="mt-4 font-semibold text-[#b42318]">{error}</p> : null}
        {b ? (
          <>
            <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-3xl font-bold text-[#0d2f4c]">
                {b.flight ? `${b.flight.origin} → ${b.flight.destination}` : "Flight removed"}
              </h1>
              <span className={`rounded-full px-4 py-1 text-sm font-bold ${b.status === "confirmed" ? "bg-[#d1fadf] text-[#05603a]" : "bg-[#fee4e2] text-[#b42318]"}`}>
                {b.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-6 grid gap-4 border-y border-dashed border-[#a9d8f7] py-6 sm:grid-cols-2 text-[#123e5f]">
              <div><p className="text-xs uppercase text-[#5e8aa9]">Booking reference</p><p className="font-mono text-2xl font-bold tracking-widest">{b.reference}</p></div>
              <div><p className="text-xs uppercase text-[#5e8aa9]">Flight</p><p className="text-2xl font-bold">{b.flight?.flightNumber ?? "-"}</p></div>
              {b.flight ? (
                <>
                  <div><p className="text-xs uppercase text-[#5e8aa9]">Departs</p><p className="font-semibold">{fmt(b.flight.departAt)}</p></div>
                  <div><p className="text-xs uppercase text-[#5e8aa9]">Arrives</p><p className="font-semibold">{fmt(b.flight.arriveAt)}</p></div>
                </>
              ) : null}
            </div>

            <div className="mt-6 text-[#123e5f]">
              <p className="text-xs uppercase text-[#5e8aa9]">Passengers ({b.seats})</p>
              <ol className="mt-2 list-decimal pl-5 font-semibold">
                {b.passengers.map((p, i) => (
                  <li key={i}>{p.name}{b.seatNumbers?.[i] ? ` — Seat ${b.seatNumbers[i]}` : ""}</li>
                ))}
              </ol>
              <p className="mt-6 text-xl font-bold text-[#0f3a59]">Total paid: {formatINR(b.totalPrice)}</p>
              <p className="mt-1 text-xs text-[#5e8aa9]">Booked on {new Date(b.createdAt).toLocaleString()}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 print:hidden">
              <button className="smart-button" onClick={() => window.print()}>Print / Save as PDF</button>
              <button
                className="smart-ghost-button"
                onClick={() => {
                  void navigator.clipboard.writeText(b.reference);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? "Copied!" : "Copy reference"}
              </button>
              <button className="smart-ghost-button" onClick={() => downloadTicketIcs(b)}>
                Add to calendar
              </button>
              <Link href="/bookings" className="smart-ghost-button">My bookings</Link>
              <Link href="/flights" className="smart-ghost-button">Search flights</Link>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
