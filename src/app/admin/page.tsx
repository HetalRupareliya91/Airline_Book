"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BookingsPanel, FlightsPanel } from "./AirlinePanels";

type ApiResponse<T> = { ok: boolean; data?: T; message?: string };

type ContactMessage = {
  _id: string;
  fullName: string;
  email: string;
  message: string;
  status: "new" | "read" | "archived";
  createdAt: string;
};

type AppointmentRequest = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  country?: { name?: string; dialCode?: string };
  travelDate: string;
  destination: string;
  details?: string;
  status: "new" | "contacted" | "archived";
  createdAt: string;
};

type Tab = "appointments" | "contact" | "flights" | "bookings";

function formatWhen(iso: string) {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return iso;
  return dt.toLocaleString();
}

async function safeJson<T>(res: Response): Promise<ApiResponse<T>> {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return { ok: false, message: `Unexpected response (${res.status}). Please login.` };
  }
  return (await res.json()) as ApiResponse<T>;
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("appointments");

  const [contact, setContact] = useState<ContactMessage[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeCount = useMemo(
    () => (tab === "appointments" ? appointments.length : contact.length),
    [appointments.length, contact.length, tab],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [aRes, cRes] = await Promise.all([
        fetch("/api/appointments?limit=200"),
        fetch("/api/contact?limit=200"),
      ]);

      const [aJson, cJson] = await Promise.all([
        safeJson<AppointmentRequest[]>(aRes),
        safeJson<ContactMessage[]>(cRes),
      ]);

      if (!aRes.ok || !aJson.ok) throw new Error(aJson.message || "Failed to load appointments.");
      if (!cRes.ok || !cJson.ok) throw new Error(cJson.message || "Failed to load contact messages.");

      setAppointments(aJson.data || []);
      setContact(cJson.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(kind: "appointments" | "contact", id: string, status: string) {
    setError("");
    try {
      const res = await fetch(`/api/${kind}/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await safeJson<unknown>(res);
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to update status.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  async function remove(kind: "appointments" | "contact", id: string) {
    setError("");
    try {
      const res = await fetch(`/api/${kind}/${id}`, { method: "DELETE" });
      const json = await safeJson<unknown>(res);
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to delete.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,#c8ebff_0%,#eaf6ff_45%,#f4fbff_100%)] px-6 py-12 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-[#a9d8f7] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(225,242,255,0.88))] p-7 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="heading-kicker">Admin</p>
            <h1 className="mt-2 text-4xl font-bold text-[#0d2f4c] sm:text-5xl">Submissions</h1>
            <p className="mt-3 text-[#2f6388]">
              Manage appointment requests and contact messages. Total shown:{" "}
              <span className="font-semibold text-[#0f3a59]">{activeCount}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" className="smart-ghost-button" onClick={load} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <Link href="/" className="smart-ghost-button">
              Back to Home
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setTab("appointments")}
            className={tab === "appointments" ? "smart-button" : "smart-ghost-button"}
          >
            Appointment Requests
          </button>
          <button
            type="button"
            onClick={() => setTab("contact")}
            className={tab === "contact" ? "smart-button" : "smart-ghost-button"}
          >
            Contact Messages
          </button>
          <button type="button" onClick={() => setTab("flights")} className={tab === "flights" ? "smart-button" : "smart-ghost-button"}>
            Flights
          </button>
          <button type="button" onClick={() => setTab("bookings")} className={tab === "bookings" ? "smart-button" : "smart-ghost-button"}>
            Bookings
          </button>
        </div>

        {error ? <p className="mt-5 text-sm font-semibold text-[#b42318]">{error}</p> : null}

        {tab === "flights" ? <div className="mt-6"><FlightsPanel /></div> : null}
        {tab === "bookings" ? <div className="mt-6"><BookingsPanel /></div> : null}

        <div className={tab === "flights" || tab === "bookings" ? "hidden" : "mt-6 grid gap-4"}>
          {tab === "appointments"
            ? appointments.map((item) => (
                <article key={item._id} className="glass-panel p-5 text-[#123e5f]">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-[240px]">
                      <p className="text-lg font-bold text-[#0f3a59]">{item.fullName}</p>
                      <p className="text-sm text-[#416b8a]">{item.email}</p>
                      <p className="text-sm text-[#416b8a]">{item.phone}</p>
                      <p className="mt-2 text-sm text-[#2f6388]">
                        <span className="font-semibold">Destination:</span> {item.destination}
                      </p>
                      <p className="text-sm text-[#2f6388]">
                        <span className="font-semibold">Travel date:</span> {item.travelDate}
                      </p>
                      {item.details ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-[#2f6388]">
                          {item.details}
                        </p>
                      ) : null}
                      <p className="mt-2 text-xs text-[#5e8aa9]">Created: {formatWhen(item.createdAt)}</p>
                    </div>

                    <div className="flex min-w-[240px] flex-col gap-2">
                      <select
                        className="smart-input"
                        value={item.status}
                        onChange={(e) => void updateStatus("appointments", item._id, e.target.value)}
                      >
                        <option value="new">new</option>
                        <option value="contacted">contacted</option>
                        <option value="archived">archived</option>
                      </select>
                      <button
                        type="button"
                        className="smart-ghost-button"
                        onClick={() => void remove("appointments", item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            : contact.map((item) => (
                <article key={item._id} className="glass-panel p-5 text-[#123e5f]">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-[240px]">
                      <p className="text-lg font-bold text-[#0f3a59]">{item.fullName}</p>
                      <p className="text-sm text-[#416b8a]">{item.email}</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-[#2f6388]">{item.message}</p>
                      <p className="mt-2 text-xs text-[#5e8aa9]">Created: {formatWhen(item.createdAt)}</p>
                    </div>

                    <div className="flex min-w-[240px] flex-col gap-2">
                      <select
                        className="smart-input"
                        value={item.status}
                        onChange={(e) => void updateStatus("contact", item._id, e.target.value)}
                      >
                        <option value="new">new</option>
                        <option value="read">read</option>
                        <option value="archived">archived</option>
                      </select>
                      <button
                        type="button"
                        className="smart-ghost-button"
                        onClick={() => void remove("contact", item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}

          {!loading && tab === "appointments" && appointments.length === 0 ? (
            <p className="text-sm text-[#416b8a]">No appointment requests yet.</p>
          ) : null}
          {!loading && tab === "contact" && contact.length === 0 ? (
            <p className="text-sm text-[#416b8a]">No contact messages yet.</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}

