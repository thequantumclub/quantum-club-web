"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthButtonClient from "./AuthButtonClient";

const links = [
  { name: "HOME", href: "/" },
  { name: "EVENTS", href: "/#events" },
  { name: "PAST EVENTS", href: "/#past-events" },
  { name: "ABOUT US", href: "/#about" },
  { name: "MY TICKETS", href: "/my-tickets" },
  { name: "CONTACT", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-brand-black/90 backdrop-blur-md py-4 shadow-lg border-b border-brand-silver/10" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <Image 
            src="/logo-transparent-final.png" 
            alt="Quantum Club Logo" 
            width={225} 
            height={62} 
            className="h-[60px] w-auto object-contain"
          />
        </Link>

        <div className="hidden md:flex space-x-8 items-center">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-bold tracking-widest text-brand-silver hover:text-brand-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <AuthButtonClient />
          <Link
            href="/#events"
            className="btn-primary"
          >
            BOOK TICKETS
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-brand-white focus:outline-none z-10"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full h-screen bg-brand-black flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold tracking-widest text-brand-silver hover:text-brand-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <AuthButtonClient />
            <Link
              href="/#events"
              onClick={() => setIsOpen(false)}
              className="btn-primary"
            >
              BOOK TICKETS
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
