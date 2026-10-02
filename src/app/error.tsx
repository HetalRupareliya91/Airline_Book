"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_0%,#c8ebff_0%,#eaf6ff_45%,#f4fbff_100%)] px-6">
      <div className="max-w-md rounded-[2rem] border border-[#a9d8f7] bg-white/90 p-10 text-center">
        <p className="heading-kicker">Something went wrong</p>
        <h1 className="mt-2 text-3xl font-bold text-[#0d2f4c]">Unexpected error</h1>
        <p className="mt-3 text-[#416b8a]">{error.message || "Please try again."}</p>
        <button className="smart-button mt-6" onClick={() => reset()}>Try again</button>
      </div>
    </main>
  );
}
