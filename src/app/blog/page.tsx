import Link from "next/link";

const posts = [
  {
    title: "How to Prepare for a Smooth International Flight Appointment",
    excerpt:
      "A practical checklist covering passports, visa timing, airport arrival strategy, and essential travel confirmations.",
    tag: "Travel Tips",
  },
  {
    title: "Business Class vs First Class: Which Cabin Is Right for Your Trip?",
    excerpt:
      "Compare comfort, value, and scheduling flexibility to choose the best premium cabin option for your next route.",
    tag: "Premium Travel",
  },
  {
    title: "5 Ways Concierge Booking Saves Time for Corporate Teams",
    excerpt:
      "Learn how appointment-first booking helps companies coordinate executive and group travel without delays.",
    tag: "Corporate Travel",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,#c8ebff_0%,#eaf6ff_45%,#f4fbff_100%)] px-6 py-12 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-7xl">
        <p className="heading-kicker">AirlineRoom Blog</p>
        <h1 className="mt-2 text-4xl font-bold text-[#0d2f4c] sm:text-5xl">
          Insights for smarter airplane appointments
        </h1>
        <p className="mt-4 max-w-3xl text-[#2f6388]">
          Explore practical booking guides, premium travel strategies, and
          updates designed for modern travelers and business teams.
        </p>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="rounded-3xl border border-[#a9d8f7] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(225,242,255,0.88))] p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#197dc1]">
                {post.tag}
              </p>
              <h2 className="mt-3 text-xl font-bold text-[#123f60]">{post.title}</h2>
              <p className="mt-3 text-sm text-[#416b8a]">{post.excerpt}</p>
            </article>
          ))}
        </section>

        <div className="mt-10">
          <Link href="/" className="smart-button">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
