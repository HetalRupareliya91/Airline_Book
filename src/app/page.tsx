"use client";

import Image from "next/image";
import Lottie from "lottie-react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Globe2,
  Headset,
  Handshake,
  Landmark,
  Mail,
  Minus,
  MapPin,
  Plane,
  Plus,
  Phone,
  ShieldCheck,
} from "lucide-react";

type Country = {
  name: string;
  dialCode: string;
  flag: string;
};

const countries: Country[] = [
  { name: "United States", dialCode: "+1", flag: "/flags/us.svg" },
  { name: "United Kingdom", dialCode: "+44", flag: "/flags/gb.svg" },
  { name: "Canada", dialCode: "+1", flag: "/flags/ca.svg" },
  { name: "Australia", dialCode: "+61", flag: "/flags/au.svg" },
  { name: "Brazil", dialCode: "+55", flag: "/flags/br.svg" },
  { name: "China", dialCode: "+86", flag: "/flags/cn.svg" },
  { name: "Denmark", dialCode: "+45", flag: "/flags/dk.svg" },
  { name: "Germany", dialCode: "+49", flag: "/flags/de.svg" },
  { name: "Spain", dialCode: "+34", flag: "/flags/es.svg" },
  { name: "France", dialCode: "+33", flag: "/flags/fr.svg" },
  { name: "Japan", dialCode: "+81", flag: "/flags/jp.svg" },
  { name: "India", dialCode: "+91", flag: "/flags/in.svg" },
  { name: "Italy", dialCode: "+39", flag: "/flags/it.svg" },
  { name: "Kenya", dialCode: "+254", flag: "/flags/ke.svg" },
  { name: "Mexico", dialCode: "+52", flag: "/flags/mx.svg" },
  { name: "Nigeria", dialCode: "+234", flag: "/flags/ng.svg" },
  { name: "Netherlands", dialCode: "+31", flag: "/flags/nl.svg" },
  { name: "Norway", dialCode: "+47", flag: "/flags/no.svg" },
  { name: "Sweden", dialCode: "+46", flag: "/flags/se.svg" },
  { name: "South Africa", dialCode: "+27", flag: "/flags/za.svg" },
  { name: "Other", dialCode: "+000", flag: "/flags/other.svg" },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const floatingX = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [earthAnimation, setEarthAnimation] = useState<object | null>(null);

  const [appointmentFullName, setAppointmentFullName] = useState("");
  const [appointmentEmail, setAppointmentEmail] = useState("");
  const [appointmentPhone, setAppointmentPhone] = useState("");
  const [appointmentDestination, setAppointmentDestination] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [appointmentError, setAppointmentError] = useState("");

  useEffect(() => {
    const loadEarthAnimation = async () => {
      try {
        const response = await fetch(
          "https://assets1.lottiefiles.com/packages/lf20_dd8hi5yh.json",
        );
        const data = (await response.json()) as object;
        setEarthAnimation(data);
      } catch {
        setEarthAnimation(null);
      }
    };
    loadEarthAnimation();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsScrolled(latest > 0.03);
  });

  const popularRoutes = useMemo(
    () => [
      { route: "New York (JFK) to Los Angeles (LAX)", deal: "From $289", timing: "Direct, 6h 05m" },
      { route: "Chicago (ORD) to London (LHR)", deal: "From $612", timing: "Direct, 7h 55m" },
      { route: "San Francisco (SFO) to Tokyo (HND)", deal: "From $734", timing: "Direct, 10h 50m" },
    ],
    [],
  );

  const faqItems = useMemo(
    () => [
      {
        q: "How do I schedule a flight appointment with AirlineRoom?",
        a: "Submit the appointment form with your route, date, and contact details. Our booking team follows up quickly with flight options and confirmation steps.",
      },
      {
        q: "Are AirlineRoom fees included in the quoted price?",
        a: "Yes. We provide transparent pricing before checkout. Any applicable service fee is shown clearly before you approve your booking.",
      },
      {
        q: "Can I request business or first-class appointments?",
        a: "Absolutely. We specialize in premium cabin bookings and can prioritize business and first-class options based on your schedule and budget.",
      },
      {
        q: "Can I change or reschedule my flight after booking?",
        a: "Yes. Our concierge team helps with rebooking and schedule changes according to your airline fare rules and seat availability.",
      },
      {
        q: "Do you support family, group, and corporate travel?",
        a: "Yes. We coordinate multi-passenger itineraries, seating requests, and travel preferences for families, teams, and executive groups.",
      },
    ],
    [],
  );

  async function submitAppointment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAppointmentStatus("submitting");
    setAppointmentError("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: appointmentFullName,
          email: appointmentEmail,
          phone: `${selectedCountry.dialCode} ${appointmentPhone}`.trim(),
          country: { name: selectedCountry.name, dialCode: selectedCountry.dialCode },
          travelDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
          destination: appointmentDestination,
          details: appointmentDetails,
        }),
      });

      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to submit request.");
      }

      setAppointmentStatus("success");
      setAppointmentFullName("");
      setAppointmentEmail("");
      setAppointmentPhone("");
      setSelectedDate(undefined);
      setAppointmentDestination("");
      setAppointmentDetails("");
    } catch (err) {
      setAppointmentStatus("error");
      setAppointmentError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <main className="bg-[radial-gradient(circle_at_20%_0%,#c8ebff_0%,#eaf6ff_45%,#f4fbff_100%)] text-[#0f2f4d]">
      <motion.header
        animate={{
          y: isScrolled ? 0 : 6,
          scale: isScrolled ? 1 : 0.995,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`sticky top-0 z-30 w-screen border-b backdrop-blur ${
          isScrolled ? "border-[#a7d5f3] bg-white/92" : "border-transparent bg-white/78"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(140deg,#0f95e2,#3aa9e3)] text-sm font-bold text-white shadow-[0_6px_14px_rgba(27,128,186,0.28)]">
              AR
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-[#0f4f7d]">
                AirlineRoom
              </p>
              <p className="text-xs text-[#5e8aa9]">Luxury Air Appointments</p>
            </div>
          </div>
          <nav className="hidden gap-8 text-sm font-semibold text-[#2d6388] lg:flex">
            <a href="/case-studies" className="smart-link">
              Case Studies
            </a>
            <a href="/blog" className="smart-link">
              Blog
            </a>
            <a href="#about" className="smart-link">
              About
            </a>
            <a href="#switchback" className="smart-link">
              Experience
            </a>
            <a href="#offers" className="smart-link">
              Offers
            </a>
            <a href="#appointment" className="smart-link">
              Appointment
            </a>
            <a href="/contact-us" className="smart-link">
              Contact
            </a>
            <a href="/admin" className="smart-link">
              Admin
            </a>
          </nav>
          <a href="#appointment" className="smart-button inline-flex">
            Speak to Concierge
          </a>
        </div>
      </motion.header>

      <section className="relative overflow-hidden px-6 pb-20 pt-6 sm:px-10 lg:px-20">
        <motion.div
          style={{ y: heroY }}
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(83,181,242,0.35),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(80,99,193,0.18),transparent_35%)]"
        />

        <div className="mx-auto mt-14 grid w-full max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-7"
          >
            <span className="inline-flex rounded-full border border-[#b7def8] bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#1785ce]">
              Private Flight Appointment Concierge
            </span>
            <h1 className="text-4xl font-bold leading-tight text-[#0d2f4c] sm:text-5xl lg:text-6xl">
              Book premium flight appointments faster.
            </h1>
            <p className="max-w-2xl text-lg text-[#2f6388]">
              AirlineRoom helps travelers and business teams secure the right
              flights with a premium, appointment-first booking experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#appointment" className="smart-button">
                Book My Appointment
              </a>
              <a href="#offers" className="smart-ghost-button">
                View Flight Deals
              </a>
            </div>
          </motion.div>

          <motion.div style={{ y: cardY }} className="relative">
            <motion.div
              style={{ x: floatingX }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-[#8ed7ff]/45 blur-lg"
            />
            <div className="relative mx-auto flex h-[420px] w-full max-w-[560px] items-center justify-center">
              <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-[#8ed7ff]/35 blur-3xl" />
              {earthAnimation ? (
                <Lottie
                  animationData={earthAnimation}
                  className="h-full w-full"
                  style={{ filter: "hue-rotate(10deg) saturate(1.12) brightness(1.02)" }}
                  loop
                />
              ) : null}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-6 sm:px-10 lg:px-20">
        <div className="mx-auto w-full max-w-7xl rounded-3xl border border-[#b7dcf7] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(228,244,255,0.86))] p-5">
          <p className="heading-kicker mb-4">Why U.S. Travelers Trust AirlineRoom</p>
          <div className="relative overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 22, ease: "linear", repeat: Infinity }}
              className="flex min-w-max gap-3"
            >
              {[
                { label: "IATA Approved", icon: BadgeCheck },
                { label: "24/7 Concierge", icon: Clock3 },
                { label: "Secure Payments", icon: CircleDollarSign },
                { label: "Global Airlines", icon: Globe2 },
                { label: "Premium Lounges", icon: BriefcaseBusiness },
                { label: "Fast Support", icon: Headset },
                { label: "Priority Boarding", icon: Plane },
                { label: "Visa Guidance", icon: ShieldCheck },
              ]
                .concat([
                  { label: "IATA Approved", icon: BadgeCheck },
                  { label: "24/7 Concierge", icon: Clock3 },
                  { label: "Secure Payments", icon: CircleDollarSign },
                  { label: "Global Airlines", icon: Globe2 },
                  { label: "Premium Lounges", icon: BriefcaseBusiness },
                  { label: "Fast Support", icon: Headset },
                  { label: "Priority Boarding", icon: Plane },
                  { label: "Visa Guidance", icon: ShieldCheck },
                ])
                .map((item, idx) => (
                  <div
                    key={`${item.label}-${idx}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#b6daf4] bg-[linear-gradient(135deg,#ffffff,#e8f6ff)] px-4 py-2 text-sm font-semibold text-[#285e82]"
                  >
                    <item.icon size={15} className="text-[#157dc4]" />
                    {item.label}
                  </div>
                ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="about" className="parallax-strip px-6 py-20 sm:px-10 lg:px-20">
        <div className="mx-auto w-full max-w-7xl pb-8">
          <p className="heading-kicker">AirlineRoom Standards</p>
          <h2 className="heading-title mt-2">
            Professional service built for stress-free flight booking
          </h2>
        </div>
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-3">
          {[
            {
              icon: Handshake,
              title: "Private Concierge",
              text: "Work with dedicated booking specialists for route planning, timing, and rapid itinerary updates.",
            },
            {
              icon: ShieldCheck,
              title: "Luxury Fleet Access",
              text: "Get curated options across trusted airlines, including business and first-class recommendations.",
            },
            {
              icon: Landmark,
              title: "Smart Alerts",
              text: "Receive timely updates on departure windows, gates, and changes before your trip.",
            },
          ].map((item) => (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              key={item.title}
              className="rounded-3xl border border-[#9ad8f8]/60 bg-[linear-gradient(140deg,#1a9ddd_0%,#3b97d0_55%,#5f7ec1_100%)] p-7 text-center text-white"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/35 bg-white/15">
                <item.icon size={22} className="text-[#e9f7ff]" />
              </div>
              <h3 className="text-2xl font-bold text-[#f3fbff]">{item.title}</h3>
              <p className="mt-3 text-[#d6e8f8]">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="switchback" className="px-6 py-20 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#a9d8f7] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(225,242,255,0.88))] p-6 text-[#123e5f] md:p-8">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2b77a8]">
                Business Travel Desk
              </p>
              <h3 className="text-4xl font-bold leading-tight text-[#0f3a59]">
                Corporate flight appointments, handled end-to-end
              </h3>
              <p className="mt-4 max-w-xl text-[#3d6787]">
                From leadership travel to multi-city team schedules, AirlineRoom
                coordinates reliable appointments with premium routing and fast
                support from a dedicated concierge team.
              </p>
              <a href="#appointment" className="mt-6 inline-flex rounded-full bg-[#1492df] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f7ec8]">
                Explore Corporate Services
              </a>
              <div className="mt-8 flex gap-3">
                <span className="h-1 w-8 rounded-full bg-[#1897e0]" />
                <span className="h-1 w-8 rounded-full bg-[#8cc5e8]" />
                <span className="h-1 w-8 rounded-full bg-[#8cc5e8]" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="relative overflow-hidden rounded-2xl border border-[#9ccbe7]"
            >
              <Image
                src="https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=1400&q=80"
                alt="Premium airline lounge and airplane concept"
                width={900}
                height={520}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(33,105,162,0.28),rgba(44,136,188,0.16))]" />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-r-lg bg-[#4f82be] px-2 py-12 text-xs font-bold uppercase tracking-[0.25em] text-[#f4fbff] [writing-mode:vertical-rl]">
                New Product
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="offers" className="px-6 py-20 sm:px-10 lg:px-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="heading-kicker">
                Popular Flight Deals
              </p>
              <h2 className="heading-title mt-2">Top routes this week</h2>
            </div>
            <a className="smart-link text-sm font-semibold" href="#appointment">
              View all routes
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {popularRoutes.map((item) => (
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                key={item.route}
                className="group glass-panel rounded-3xl p-5"
              >
                <div className="relative h-44 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80"
                    alt="Airplane wing with clouds"
                    fill
                    priority={item.route === popularRoutes[0]?.route}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-[#0f3a59]">{item.route}</h3>
                <p className="mt-1 text-[#4d7390]">{item.timing}</p>
                <p className="mt-2 text-xl font-bold text-[#1785ce]">{item.deal}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="appointment" className="px-6 pb-24 sm:px-10 lg:px-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 rounded-[2rem] border border-[#a9d8f7] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(225,242,255,0.88))] p-7 backdrop-blur md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <div>
            <h2 className="text-4xl font-bold leading-tight text-[#0d2f4c]">
              Schedule your airplane appointment in minutes
            </h2>
            <p className="mt-4 text-[#2f6388]">
              Share your travel details and our team will follow up with the
              best available options to confirm your booking quickly.
            </p>
          </div>

          <form className="grid gap-4" onSubmit={submitAppointment}>
            <input
              className="smart-input"
              type="text"
              placeholder="Full Legal Name"
              required
              value={appointmentFullName}
              onChange={(e) => setAppointmentFullName(e.target.value)}
            />
            <input
              className="smart-input"
              type="email"
              placeholder="Best Email Address"
              required
              value={appointmentEmail}
              onChange={(e) => setAppointmentEmail(e.target.value)}
            />
            <div className="relative">
              <div className="flex w-full items-center gap-2 rounded-2xl border border-[#b2dcf8] bg-white px-3">
                <button
                  type="button"
                  onClick={() => setIsCountryMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl px-1 py-2 text-sm font-semibold text-[#1f5b80]"
                >
                  <Image
                    src={selectedCountry.flag}
                    width={24}
                    height={18}
                    alt={`${selectedCountry.name} flag`}
                    className="h-auto w-auto rounded-sm"
                  />
                  <span className="max-w-28 truncate">{selectedCountry.name}</span>
                  <span className="text-[#6294b2]">{selectedCountry.dialCode}</span>
                  <ChevronDown size={16} />
                </button>
                <input
                  className="w-full bg-transparent py-3.5 text-sm text-[#113754] outline-none placeholder:text-[#84a8bf]"
                  type="tel"
                  placeholder="Mobile Phone Number"
                  required
                  value={appointmentPhone}
                  onChange={(e) => setAppointmentPhone(e.target.value)}
                />
              </div>
              {isCountryMenuOpen ? (
                <div className="absolute left-0 top-[110%] z-20 max-h-72 w-[280px] overflow-y-auto rounded-2xl border border-[#b2dcf8] bg-white p-2 shadow-xl">
                  {countries.map((country) => (
                    <button
                      type="button"
                      key={country.name}
                      onClick={() => {
                        setSelectedCountry(country);
                        setIsCountryMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left hover:bg-[#edf8ff]"
                      title={country.name}
                    >
                      <span className="flex items-center gap-2">
                        <Image
                          src={country.flag}
                          width={22}
                          height={16}
                          alt={`${country.name} flag`}
                          className="h-auto w-auto rounded-sm"
                        />
                        <span className="text-sm font-semibold text-[#1f5b80]">{country.name}</span>
                        <span className="text-sm text-[#6294b2]">{country.dialCode}</span>
                      </span>
                      {selectedCountry.name === country.name ? (
                        <Check size={16} className="text-[#1296e8]" />
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDateMenuOpen((prev) => !prev)}
                  className="smart-input flex items-center justify-between text-left"
                >
                  <span className={selectedDate ? "text-[#113754]" : "text-[#84a8bf]"}>
                    {selectedDate ? format(selectedDate, "PPP") : "Select travel date"}
                  </span>
                  <CalendarDays size={16} className="text-[#5f88a4]" />
                </button>
                <input
                  type="hidden"
                  name="travelDate"
                  value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                  required
                />
                {isDateMenuOpen ? (
                  <div className="absolute left-0 top-[110%] z-20 rounded-2xl border border-[#b2dcf8] bg-white p-4 shadow-xl">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) setIsDateMenuOpen(false);
                      }}
                      disabled={{ before: new Date() }}
                      className="airline-calendar"
                      showOutsideDays
                      components={{
                        Chevron: ({ orientation }) =>
                          orientation === "left" ? (
                            <ChevronLeft size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          ),
                      }}
                      classNames={{
                        months: "flex",
                        month: "space-y-4",
                        month_caption:
                          "relative flex items-center justify-center pb-1 text-sm font-semibold text-[#0d2942]",
                        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
                        button_previous:
                          "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#d2e9fa] text-[#1f5b80] hover:bg-[#f2f9ff]",
                        button_next:
                          "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#d2e9fa] text-[#1f5b80] hover:bg-[#f2f9ff]",
                        weekday:
                          "w-10 text-center text-xs font-semibold uppercase tracking-wide text-[#6b93ad]",
                        week: "mt-1 flex w-full gap-1",
                        day: "h-10 w-10 rounded-xl text-sm font-medium text-[#1d4f6f] hover:bg-[#eef8ff]",
                        today: "border border-[#9ad5ff] text-[#0f76bc]",
                        selected:
                          "bg-[#1391de] text-white hover:bg-[#0d81cb] focus:bg-[#0d81cb]",
                        outside: "text-[#a5bdcf]",
                        disabled: "text-[#bdd0de]",
                      }}
                    />
                  </div>
                ) : null}
              </div>
              <input
                className="smart-input"
                type="text"
                placeholder="Destination (City or Airport)"
                required
                value={appointmentDestination}
                onChange={(e) => setAppointmentDestination(e.target.value)}
              />
            </div>
            <textarea
              className="smart-input min-h-28 resize-none"
              placeholder="Trip details (airline preference, cabin class, baggage, etc.)"
              value={appointmentDetails}
              onChange={(e) => setAppointmentDetails(e.target.value)}
            />
            <button
              type="submit"
              className="smart-button mt-1 w-full"
              disabled={appointmentStatus === "submitting"}
            >
              {appointmentStatus === "submitting" ? "Submitting..." : "Request My Appointment"}
            </button>
            {appointmentStatus === "success" ? (
              <p className="text-sm font-semibold text-[#0d7a38]">
                Request sent. Our concierge will contact you soon.
              </p>
            ) : null}
            {appointmentStatus === "error" ? (
              <p className="text-sm font-semibold text-[#b42318]">{appointmentError}</p>
            ) : null}
          </form>
        </div>
      </section>

      <section className="px-6 pb-16 sm:px-10 lg:px-20">
        <div className="mx-auto w-full max-w-7xl rounded-3xl border border-[#a9d8f7] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(225,242,255,0.88))] p-7 text-[#123f60] md:p-10">
          <p className="heading-kicker text-[#2b79aa]">Priority Booking</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-5">
            <div>
              <h3 className="text-3xl font-bold leading-tight text-[#0f3a59]">
                Need a flight appointment confirmed today?
              </h3>
              <p className="mt-2 text-[#3f6888]">
                Start now and receive personalized flight options from our
                concierge team in just a few minutes.
              </p>
            </div>
            <a href="#appointment" className="smart-button">
              Start My Booking
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-20">
        <div className="mx-auto w-full max-w-7xl rounded-3xl border border-[#a9d8f7] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(225,242,255,0.88))] p-6 md:p-8">
          <h3 className="text-center text-3xl font-bold text-[#0f3a59] md:text-5xl">
            Airplane Appointment FAQs
          </h3>
          <div className="mt-8 space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-2xl border border-[#9ec6df] bg-[linear-gradient(90deg,rgba(232,245,253,0.9),rgba(221,238,249,0.9))]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-semibold text-[#123f60]">{item.q}</span>
                    <span className="text-[#2b6f9d]">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="px-5 pb-5 text-sm text-[#416b8a]">{item.a}</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#b7def8] bg-white/45 px-6 py-10 sm:px-10 lg:px-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="text-xl font-bold text-[#0c5f95]">AirlineRoom</p>
            <p className="mt-2 max-w-md text-sm text-[#2b607f]">
              Professional airplane appointment booking for domestic and
              international travelers who value speed, clarity, and support.
            </p>
          </div>
          <div className="space-y-2 text-sm text-[#2b607f]">
            <p className="font-semibold text-[#0e5f95]">Contact</p>
            <p className="flex items-center gap-2">
              <Phone size={15} /> +1 800 225 488
            </p>
            <p className="flex items-center gap-2">
              <Mail size={15} /> concierge@airlineroom.com
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={15} /> 210 Aviation Ave, NY
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-[#0e5f95]">Social</p>
            <div className="flex gap-3 text-[#1579ba]">
              {[
                {
                  href: "https://www.instagram.com",
                  label: "Instagram",
                  path: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .2 2.7.5.8.3 1.4.7 2 1.3.6.6 1 1.2 1.3 2 .3.7.5 1.5.5 2.7.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 2-.5 2.7-.3.8-.7 1.4-1.3 2-.6.6-1.2 1-2 1.3-.7.3-1.5.5-2.7.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.2-2.7-.5-.8-.3-1.4-.7-2-1.3-.6-.6-1-1.2-1.3-2-.3-.7-.5-1.5-.5-2.7C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-2 .5-2.7.3-.8.7-1.4 1.3-2 .6-.6 1.2-1 2-1.3.7-.3 1.5-.5 2.7-.5C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.8.1-1.1.1-1.7.2-2.1.4-.6.2-1 .5-1.5.9-.4.4-.7.8-.9 1.5-.2.4-.4 1-.4 2.1-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.1.2 1.7.4 2.1.2.6.5 1 .9 1.5.4.4.8.7 1.5.9.4.2 1 .4 2.1.4 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.1-.1 1.7-.2 2.1-.4.6-.2 1-.5 1.5-.9.4-.4.7-.8.9-1.5.2-.4.4-1 .4-2.1.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.1-.2-1.7-.4-2.1-.2-.6-.5-1-.9-1.5-.4-.4-.8-.7-1.5-.9-.4-.2-1-.4-2.1-.4-1.3-.1-1.7-.1-4.8-.1zm0 4.4A5.6 5.6 0 1 1 12 19.6 5.6 5.6 0 0 1 12 8.4zm0 9.4A3.8 3.8 0 1 0 12 10a3.8 3.8 0 0 0 0 7.6zm7.1-9.6a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0z",
                },
                {
                  href: "https://www.linkedin.com",
                  label: "LinkedIn",
                  path: "M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.5h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.2 2.3 4.2 5.4v6.3zM5.2 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zm1.8 13H3.4V9H7v11.4zM22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z",
                },
                {
                  href: "https://x.com",
                  label: "X",
                  path: "M18.9 2H22l-6.8 7.8 8 10.2h-6.3L12 14l-5.3 6H3.6l7.2-8.2L3.1 2h6.5l4.4 5.6L18.9 2zm-1.1 16h1.7L8.7 3.9H6.9L17.8 18z",
                },
                {
                  href: "https://facebook.com",
                  label: "Facebook",
                  path: "M22 12A10 10 0 1 0 10.4 21.9v-7h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4H15c-1.2 0-1.6.8-1.6 1.5V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="rounded-full border border-[#b9def7] bg-white p-2.5 transition-transform duration-300 hover:-translate-y-1 hover:border-[#8acaf2] hover:text-[#0f6ca9]"
                >
                  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 w-full max-w-7xl border-t border-[#c9e7fb] pt-4 text-sm text-[#2b607f]">
          © {new Date().getFullYear()} AirlineRoom. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
