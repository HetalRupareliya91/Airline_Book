"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fullName, email, message }),
      });

      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to send message.");
      }

      setStatus("success");
      setFullName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-2xl border border-[#b5dcf6] bg-white/70 p-5"
    >
      <input
        className="smart-input"
        type="text"
        placeholder="Full Name"
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        className="smart-input"
        type="email"
        placeholder="Email Address"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        className="smart-input min-h-28 resize-none"
        placeholder="How can we help?"
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className="smart-button w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
      {status === "success" ? (
        <p className="text-sm font-semibold text-[#0d7a38]">Message sent. We’ll reply soon.</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm font-semibold text-[#b42318]">{error}</p>
      ) : null}
    </form>
  );
}

