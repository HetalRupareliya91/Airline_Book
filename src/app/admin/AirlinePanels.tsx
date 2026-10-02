"use client";

import { useCallback, useEffect, useState } from "react";

type Flight = { _id: string; flightNumber: string; origin: string; destination: string; departAt: string; price: number; seatsAvailable: number; seatsTotal: number };
type Booking = {
  _id: string; reference: string; seats: number; totalPrice: number; status: "confirmed" | "cancelled";
  passengers: { name: string }[]; user?: { email?: string } | null;
  flight: { origin: string; destination: string; departAt: string } | null;
};
type Api<T> = { ok: boolean; data?: T; message?: string };

const empty = { flightNumber: "", origin: "", destination: "", departAt: "", arriveAt: "", price: "", seatsTotal: "" };

export function FlightsPanel() {
  const [items, setItems] = useState<Flight[]>([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/flights");
    const json = (await res.json()) as Api<Flight[]>;
    setItems(json.data || []);
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/flights", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...form,
        departAt: new Date(form.departAt).toISOString(),
        arriveAt: new Date(form.arriveAt).toISOString(),
        price: Number(form.price),
        seatsTotal: Number(form.seatsTotal),
      }),
    });
    const json = (await res.json()) as Api<Flight>;
    if (!res.ok || !json.ok) return setError(json.message || "Failed to add flight.");
    setForm(empty);
    await load();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this flight? Existing bookings keep their record.")) return;
    await fetch(`/api/flights/${id}`, { method: "DELETE" });
    await load();
  }

  async function editPrice(f: Flight) {
    const input = window.prompt(`New price for ${f.flightNumber} (₹)`, String(f.price));
    if (input === null) return;
    const price = Number(input);
    if (!Number.isFinite(price) || price < 0) return setError("Enter a valid price.");
    const res = await fetch(`/api/flights/${f._id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ price }),
    });
    const json = (await res.json()) as Api<Flight>;
    if (!res.ok || !json.ok) return setError(json.message || "Update failed.");
    await load();
  }

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="grid gap-4">
      <form onSubmit={add} className="glass-panel grid gap-3 p-5 sm:grid-cols-3">
        <input className="smart-input" placeholder="Flight no." required value={form.flightNumber} onChange={set("flightNumber")} />
        <input className="smart-input" placeholder="From" required value={form.origin} onChange={set("origin")} />
        <input className="smart-input" placeholder="To" required value={form.destination} onChange={set("destination")} />
        <input className="smart-input" type="datetime-local" required value={form.departAt} onChange={set("departAt")} />
        <input className="smart-input" type="datetime-local" required value={form.arriveAt} onChange={set("arriveAt")} />
        <input className="smart-input" type="number" min={0} placeholder="Price ₹" required value={form.price} onChange={set("price")} />
        <input className="smart-input" type="number" min={1} placeholder="Total seats" required value={form.seatsTotal} onChange={set("seatsTotal")} />
        <button className="smart-button sm:col-span-2" type="submit">Add flight</button>
        {error ? <p className="text-sm font-semibold text-[#b42318] sm:col-span-3">{error}</p> : null}
      </form>
      {items.map((f) => (
        <article key={f._id} className="glass-panel flex flex-wrap items-center justify-between gap-3 p-5 text-[#123e5f]">
          <div>
            <p className="text-lg font-bold text-[#0f3a59]">{f.flightNumber} · {f.origin} → {f.destination}</p>
            <p className="text-sm text-[#416b8a]">{new Date(f.departAt).toLocaleString()} · ₹{f.price} · {f.seatsTotal - f.seatsAvailable}/{f.seatsTotal} seats sold</p>
          </div>
          <div className="flex gap-2">
            <button className="smart-ghost-button" onClick={() => void editPrice(f)}>Edit price</button>
            <button className="smart-ghost-button" onClick={() => void remove(f._id)}>Delete</button>
          </div>
        </article>
      ))}
      {items.length === 0 ? <p className="text-sm text-[#416b8a]">No upcoming flights yet.</p> : null}
    </div>
  );
}

export function BookingsPanel() {
  const [items, setItems] = useState<Booking[]>([]);
  const [status, setStatus] = useState("all");
  const load = useCallback(async () => {
    const res = await fetch("/api/bookings?limit=200");
    const json = (await res.json()) as Api<Booking[]>;
    setItems(json.data || []);
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function cancel(id: string) {
    await fetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
    await load();
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm font-semibold text-[#2f6388]">
        {items.filter((b) => b.status === "confirmed").length} confirmed · Revenue ₹
        {items.filter((b) => b.status === "confirmed").reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString("en-IN")}
      </p>
      <select className="smart-input w-48" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">All statuses</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {items.filter((b) => status === "all" || b.status === status).map((b) => (
        <article key={b._id} className="glass-panel flex flex-wrap items-start justify-between gap-3 p-5 text-[#123e5f]">
          <div>
            <p className="text-lg font-bold text-[#0f3a59]">{b.reference} · {b.flight ? `${b.flight.origin} → ${b.flight.destination}` : "Flight removed"}</p>
            <p className="text-sm text-[#416b8a]">{b.user?.email} · {b.passengers.map((p) => p.name).join(", ")}</p>
            <p className="text-sm font-semibold text-[#0f3a59]">₹{b.totalPrice} · {b.seats} seat(s) · {b.status}</p>
          </div>
          {b.status === "confirmed" ? <button className="smart-ghost-button" onClick={() => void cancel(b._id)}>Cancel</button> : null}
        </article>
      ))}
      {items.length === 0 ? <p className="text-sm text-[#416b8a]">No bookings yet.</p> : null}
    </div>
  );
}
