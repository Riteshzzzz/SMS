import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resident Portal | Society Management",
  description: "View bills, file complaints, book amenities, and manage visitors",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
