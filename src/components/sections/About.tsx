"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-32 bg-brand-charcoal relative overflow-hidden">
      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase mb-10 text-brand-white"
          >
            WE DON'T JUST ORGANIZE EVENTS. <br className="hidden md:block" />
            <span className="metallic-text">WE BRING PEOPLE TOGETHER.</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6 text-lg md:text-xl text-brand-silver leading-relaxed font-medium"
          >
            <p>
              Quantum Club is an event and entertainment club based in Parbhani, Maharashtra. 
              We create opportunities for people to enjoy live experiences, share their talents, 
              discover creativity, and connect with others.
            </p>
            <p>
              From the energy of a Garba night to the intimate connections of an unplugged jam session, 
              we build the stages where memories are made.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
