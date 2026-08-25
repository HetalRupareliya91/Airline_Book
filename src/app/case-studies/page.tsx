import Link from "next/link";

const studies = [
  {
    client: "Apex Consulting Group",
    result: "42% faster executive travel confirmations",
    summary:
      "AirlineRoom streamlined multi-city appointment scheduling for leadership travel with concierge-based route planning.",
  },
  {
    client: "NorthBridge Medical Team",
    result: "Reduced trip changes by 31%",
    summary:
      "By coordinating flight appointments and clear rebooking support, AirlineRoom improved scheduling reliability for medical staff.",
  },
  {
    client: "Global Ventures Inc.",
    result: "Saved 18+ booking hours monthly",
    summary:
      "AirlineRoom managed premium appointment requests and consolidated itinerary handling for cross-regional project teams.",
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,#c8ebff_0%,#eaf6ff_45%,#f4fbff_100%)] px-6 py-12 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-7xl">
        <p className="heading-kicker">Case Studies</p>
        <h1 className="mt-2 text-4xl font-bold text-[#0d2f4c] sm:text-5xl">
          Real outcomes from premium appointment booking
        </h1>
        <p className="mt-4 max-w-3xl text-[#2f6388]">
          See how organizations use AirlineRoom to improve travel speed,
          consistency, and support across business-critical flight appointments.
        </p>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {studies.map((study) => (
            <article
              key={study.client}
              className="rounded-3xl border border-[#a9d8f7] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(225,242,255,0.88))] p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#197dc1]">
                {study.client}
              </p>
              <h2 className="mt-3 text-xl font-bold text-[#123f60]">{study.result}</h2>
              <p className="mt-3 text-sm text-[#416b8a]">{study.summary}</p>
            </article>
          ))}
        </section>

        <div className="mt-10">
          <Link href="/contact-us" className="smart-button">
            Talk to Concierge
          </Link>
        </div>
      </div>
    </main>
  );
}
