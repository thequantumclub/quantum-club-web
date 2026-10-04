"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { pastEvents } from "@/data/config";

export default function PastEvents() {
  return (
    <section id="past-events" className="py-24 bg-brand-charcoal relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4"
            >
              PAST <span className="metallic-text">EVENTS</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-brand-gray max-w-2xl text-lg"
            >
              Our history of bringing people together.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group rounded-2xl overflow-hidden glass-panel ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <div 
                className={`w-full ${index === 0 ? 'h-80 md:h-[400px]' : 'h-64'} bg-cover bg-center transition-transform duration-700 group-hover:scale-105`}
                style={{ backgroundImage: `url(${event.imageUrl})` }}
              />
              <div className="p-8 relative bg-brand-graphite/90 backdrop-blur-md -mt-10 mx-4 md:mx-8 mb-4 md:mb-8 rounded-xl border border-brand-silver/10">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-silver uppercase tracking-widest mb-3">
                  <Calendar className="w-4 h-4 text-brand-silver" />
                  <span>{new Date(event.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-brand-white uppercase tracking-wide">{event.title}</h3>
                <p className="text-brand-gray text-sm leading-relaxed mb-6">
                  {event.description}
                </p>
                <Link 
                  href={`/events/${event.id}`}
                  className="inline-flex items-center text-sm font-bold tracking-widest text-brand-white hover:text-brand-silver transition-colors"
                >
                  VIEW HIGHLIGHTS <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
