"use client";

import { motion } from "framer-motion";
import { Mic2, Music, Laugh, Users } from "lucide-react";

const highlights = [
  { icon: Mic2, label: "Singing & Rapping" },
  { icon: Music, label: "Dancing & Jamming" },
  { icon: Laugh, label: "Stand-Up Comedy" },
  { icon: Users, label: "Meeting New People" },
];

export default function StrangersUnplugged() {
  return (
    <section className="py-24 bg-brand-black relative border-y border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full bg-brand-silver/10 border border-brand-silver/20 text-brand-silver text-xs font-bold uppercase tracking-widest mb-6"
            >
              The Community Experience
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase mb-6"
            >
              STRANGERS TODAY. <br />
              <span className="metallic-text">FRIENDS TONIGHT.</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-brand-gray text-lg leading-relaxed mb-10"
            >
              A stage for talent, a space for expression, and a room full of people who might not know each other yet. 
              Strangers Unplugged is our flagship concept where participation is just as important as the performance.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-6"
            >
              {highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-graphite border border-brand-silver/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-brand-silver" />
                  </div>
                  <span className="font-bold text-sm tracking-wide text-brand-white">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative h-[600px] rounded-3xl overflow-hidden glass-panel"
          >
            {/* Replace with real images when available */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/strangers-unplugged-1.png')" }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10">
              <h3 className="text-3xl font-black uppercase tracking-widest mb-2 text-brand-white">STRANGERS UNPLUGGED</h3>
              <p className="text-brand-gray font-bold tracking-widest text-sm uppercase">2 Successful Editions</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
