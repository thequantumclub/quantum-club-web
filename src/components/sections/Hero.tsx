"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { siteConfig } from "@/data/config";

export default function Hero() {
  const [showText, setShowText] = useState(true);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setShowText(e.currentTarget.currentTime <= 7);
  };

  return (
    <section className="relative h-screen w-full flex items-end justify-center pb-32 overflow-hidden">
      {/* Background Video with Cinematic Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Desktop Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="hidden md:block absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/hero-vid.mp4" type="video/mp4" />
        </video>
        
        {/* Mobile Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="block md:hidden absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/mobile-video.mp4" type="video/mp4" />
        </video>

        {/* Elegant Gradient Overlay: dark at bottom for text readability, clear at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 z-10 pointer-events-none" />
      </div>

      <div className="container relative z-20 mx-auto px-6 md:px-12 text-center flex flex-col items-center drop-shadow-2xl">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : -20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-6 text-brand-white"
        >
          PARBHANI, <br className="md:hidden" />
          <span className="metallic-text">LET'S MAKE SOME NOISE.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : -20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="hidden md:block text-lg md:text-xl text-brand-silver max-w-2xl mb-10 font-medium tracking-wide"
        >
          Music, performances, laughter and unforgettable connections. This is Quantum Club.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link 
            href="#events" 
            className="btn-primary"
          >
            EXPLORE EVENTS
          </Link>
          <Link 
            href="#about"
            className="btn-secondary"
          >
            OUR STORY
          </Link>
        </motion.div>
      </div>

      {/* Subtle Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest text-brand-gray uppercase">Scroll</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-8 bg-gradient-to-b from-brand-silver to-transparent"
        />
      </motion.div>
    </section>
  );
}
