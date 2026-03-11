import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Security Gate | Society Management", description: "Security gate management portal" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (<html lang="en"><body>{children}</body></html>);
}
