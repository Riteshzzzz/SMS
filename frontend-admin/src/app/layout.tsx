import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Society Admin Portal | Building Management System",
  description: "Comprehensive admin dashboard for managing residential societies, apartment complexes, and gated communities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
