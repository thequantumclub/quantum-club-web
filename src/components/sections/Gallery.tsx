"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

// In a real scenario, these would point to actual event media.
const galleryEvents = [
  { id: "rang-barse", name: "RANG BARSE", image: "/rang-barse.png", span: "col-span-1 md:col-span-2 row-span-2" },
  { id: "strangers-1", name: "STRANGERS UNPLUGGED", image: "/strangers-unplugged-1.png", span: "col-span-1 row-span-1" },
  { id: "strangers-2", name: "STRANGERS UNPLUGGED 2.0", image: "/strangers-unplugged-2.png", span: "col-span-1 row-span-1" },
  { id: "pranit-more", name: "PRANIT MORE COMEDY", image: "/pranit-more.png", span: "col-span-1 row-span-1" },
  { id: "garba-night", name: "GARBA NIGHT", image: "/golden-garba-night.png", span: "col-span-1 md:col-span-2 row-span-1" },
  { id: "comedy-2", name: "COMEDY NIGHT 2.0", image: "/comedy-2.png", span: "col-span-1 md:col-span-3 row-span-1" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-brand-black relative">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4 text-brand-white">
            THE <span className="metallic-text">GALLERY</span>
          </h2>
          <p className="text-brand-gray max-w-2xl mx-auto font-medium">
            Visuals from our previous nights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
          {galleryEvents.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${item.span}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-brand-black/40 group-hover:bg-brand-black/60 transition-colors" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-bold text-lg tracking-widest text-brand-white uppercase">{item.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
