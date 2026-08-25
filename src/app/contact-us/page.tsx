import Link from "next/link";
import ContactForm from "./ui/ContactForm";

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,#c8ebff_0%,#eaf6ff_45%,#f4fbff_100%)] px-6 py-12 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-5xl rounded-[2rem] border border-[#a9d8f7] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(225,242,255,0.88))] p-7 md:p-10">
        <p className="heading-kicker">Contact Us</p>
        <h1 className="mt-2 text-4xl font-bold text-[#0d2f4c] sm:text-5xl">
          Speak with AirlineRoom Concierge
        </h1>
        <p className="mt-4 max-w-3xl text-[#2f6388]">
          Have questions about routes, premium cabins, or scheduling? Our team
          is ready to help you plan and confirm your airplane appointment.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#b5dcf6] bg-white/70 p-5">
            <h2 className="text-xl font-semibold text-[#0f3a59]">Direct Contact</h2>
            <p className="mt-3 text-[#416b8a]">Phone: +1 800 225 488</p>
            <p className="text-[#416b8a]">Email: concierge@airlineroom.com</p>
            <p className="text-[#416b8a]">
              Office Hours: Monday to Friday, 7:00 AM to 7:00 PM EST
            </p>
          </div>
          <ContactForm />
        </div>

        <div className="mt-8">
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="smart-ghost-button">
              Back to Home
            </Link>
            <Link href="/admin" className="smart-ghost-button">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
