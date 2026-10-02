import type { Metadata } from "next";

export const metadata: Metadata = { title: "Search flights | Airline Book" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
