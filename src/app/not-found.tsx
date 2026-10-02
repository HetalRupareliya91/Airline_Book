import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_0%,#c8ebff_0%,#eaf6ff_45%,#f4fbff_100%)] px-6">
      <div className="max-w-md rounded-[2rem] border border-[#a9d8f7] bg-white/90 p-10 text-center">
        <p className="heading-kicker">404</p>
        <h1 className="mt-2 text-3xl font-bold text-[#0d2f4c]">Page not found</h1>
        <p className="mt-3 text-[#416b8a]">That page doesn&apos;t exist or has moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="smart-ghost-button">Home</Link>
          <Link href="/flights" className="smart-button">Search flights</Link>
        </div>
      </div>
    </main>
  );
}
