"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as { ok?: boolean; data?: { role?: string }; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message || "Registration failed.");

      setStatus("success");
      router.push(json.data?.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,#c8ebff_0%,#eaf6ff_45%,#f4fbff_100%)] px-6 py-12 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-lg rounded-[2rem] border border-[#a9d8f7] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(225,242,255,0.88))] p-7 md:p-10">
        <p className="heading-kicker">Account</p>
        <h1 className="mt-2 text-4xl font-bold text-[#0d2f4c]">Register</h1>
        <p className="mt-3 text-[#2f6388]">
          The first registered user becomes <span className="font-semibold text-[#0f3a59]">admin</span>.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <input
            className="smart-input"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="smart-input"
            type="password"
            placeholder="Password (min 6 chars)"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="smart-button w-full" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Creating..." : "Create account"}
          </button>
          {status === "error" ? <p className="text-sm font-semibold text-[#b42318]">{error}</p> : null}
        </form>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/login" className="smart-ghost-button">
            I already have an account
          </Link>
          <Link href="/" className="smart-ghost-button">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

