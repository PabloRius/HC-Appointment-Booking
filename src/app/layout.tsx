import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Using Inter font for better readability (clean, modern, designed for UI)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Healthcare Appointment System",
  description: "Official healthcare appointment booking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans bg-gray-50 h-full`}>
        <main className="min-h-full">{children}</main>
      </body>
    </html>
  );
}
