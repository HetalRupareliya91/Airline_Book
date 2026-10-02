import type { Metadata } from "next";

export const metadata: Metadata = { title: "My bookings | Airline Book" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
