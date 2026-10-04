"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { siteConfig } from "@/data/config";

export default function Partnerships() {
  return (
    <section id="partnerships" className="py-16 bg-brand-charcoal border-t border-brand-silver/10">
      <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-black tracking-widest uppercase mb-4 text-brand-white"
        >
          INTERESTED IN WORKING WITH QUANTUM CLUB?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-brand-silver font-medium text-lg mb-8"
        >
          Let's explore event sponsorships, creative collaborations and brand experiences.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link 
            href="/contact?type=partnership"
            className="btn-secondary"
          >
            GET IN TOUCH
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
