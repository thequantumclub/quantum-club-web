import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";

import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QUANTUM CLUB | More Than An Event",
  description: "We bring people together through unforgettable events, music, and culture in Parbhani.",
  openGraph: {
    title: "QUANTUM CLUB",
    description: "More than an event. An experience.",
    url: "https://quantumclub.com",
    siteName: "Quantum Club",
    images: [
      {
        url: "/logo-transparent-final.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth dark`}>
      <body className="bg-brand-black text-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
