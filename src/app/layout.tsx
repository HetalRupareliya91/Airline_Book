import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AirlineRoom | Professional Airplane Appointment Booking",
  description:
    "AirlineRoom is a premium airplane appointment booking service with concierge support, fast confirmations, and curated domestic and international flight options.",
  keywords: [
    "airplane appointment booking",
    "flight appointment service",
    "premium flight concierge",
    "business class appointment tickets",
    "AirlineRoom",
  ],
  openGraph: {
    title: "AirlineRoom | Professional Airplane Appointment Booking",
    description:
      "Schedule your flight appointment in minutes with AirlineRoom. Get concierge support, curated routes, and premium booking service.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AirlineRoom | Professional Airplane Appointment Booking",
    description:
      "Schedule your flight appointment in minutes with AirlineRoom and get premium concierge support.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
