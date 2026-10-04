"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, MapPin, Clock, Ticket } from "lucide-react";
import { featuredEvent } from "@/data/config";

export default function FeaturedEvent() {
  return (
    <section id="events" className="py-24 bg-brand-black relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold tracking-widest text-brand-silver uppercase mb-2"
          >
            THE NEXT BIG NIGHT.
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight metallic-text uppercase"
          >
            {featuredEvent.title}
          </motion.h3>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden glass-panel"
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div 
              className="h-[400px] md:h-auto bg-cover bg-center"
              style={{ backgroundImage: `url(${featuredEvent.imageUrl})` }}
            />
            <div className="p-10 md:p-14 flex flex-col justify-center bg-brand-graphite/40">
              <h3 className="text-2xl font-bold mb-8 text-brand-white">Event Details</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4 text-brand-silver">
                  <div className="w-10 h-10 rounded-full bg-brand-white/5 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-brand-silver" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-gray uppercase tracking-wider font-bold mb-1">Date</p>
                    <p className="font-medium text-brand-white">{('displayDate' in featuredEvent) ? (featuredEvent as any).displayDate : new Date((featuredEvent as any).date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-brand-silver">
                  <div className="w-10 h-10 rounded-full bg-brand-white/5 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-brand-silver" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-gray uppercase tracking-wider font-bold mb-1">Time</p>
                    <p className="font-medium text-brand-white">{featuredEvent.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-brand-silver">
                  <div className="w-10 h-10 rounded-full bg-brand-white/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-brand-silver" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-gray uppercase tracking-wider font-bold mb-1">Venue</p>
                    <p className="font-medium text-brand-white">{featuredEvent.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-brand-silver">
                  <div className="w-10 h-10 rounded-full bg-brand-white/5 flex items-center justify-center shrink-0">
                    <Ticket className="w-5 h-5 text-brand-silver" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-gray uppercase tracking-wider font-bold mb-1">Entry</p>
                    <p className="font-medium text-brand-white">{featuredEvent.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href={`/events/${featuredEvent.id}/register`}
                  className="btn-primary text-center"
                >
                  BOOK YOUR SLOT
                </Link>
                <Link 
                  href={`/events/${featuredEvent.id}`}
                  className="btn-secondary text-center"
                >
                  EVENT DETAILS
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
