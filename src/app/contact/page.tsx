"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig, whatsappMessages } from "@/data/config";
import { MessageCircle, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate form submission
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-4"
            >
              GET IN <span className="text-gradient">TOUCH</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
              Whether you have a general enquiry or want to discuss a partnership, we'd love to hear from you.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div className="p-8 glass-panel rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold mb-6">Contact Info</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 text-gray-300">
                    <MapPin className="w-6 h-6 text-brand-silver shrink-0" />
                    <div>
                      <p className="font-semibold text-white">Location</p>
                      <p className="text-sm mt-1">{siteConfig.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 text-gray-300">
                    <Mail className="w-6 h-6 text-brand-silver shrink-0" />
                    <div>
                      <p className="font-semibold text-white">Email</p>
                      <a href={`mailto:${siteConfig.contactEmail}`} className="text-sm mt-1 hover:text-brand-silver transition-colors">
                        {siteConfig.contactEmail}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 text-gray-300">
                    <MessageCircle className="w-6 h-6 text-brand-silver shrink-0" />
                    <div>
                      <p className="font-semibold text-white">WhatsApp</p>
                      <a 
                        href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(whatsappMessages.general)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm mt-1 hover:text-brand-silver transition-colors"
                      >
                        +{siteConfig.whatsappNumber}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="p-8 md:p-10 glass-panel rounded-2xl border border-white/5">
                <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                
                {status === "success" ? (
                  <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                    <h4 className="text-xl font-bold text-green-400 mb-2">Message Sent!</h4>
                    <p className="text-gray-300">We'll get back to you shortly.</p>
                    <button 
                      onClick={() => setStatus("idle")}
                      className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-300">Your Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          required
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-silver transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          required
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-silver transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="type" className="text-sm font-medium text-gray-300">Enquiry Type</label>
                      <select 
                        id="type" 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-silver transition-colors appearance-none"
                      >
                        <option value="general">General Enquiry</option>
                        <option value="partnership">Partnership / Sponsorship</option>
                        <option value="event">Event Feedback</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
                      <textarea 
                        id="message" 
                        required
                        rows={5}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-silver transition-colors resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={status === "loading"}
                      className="btn-primary w-full disabled:opacity-50"
                    >
                      {status === "loading" ? "SENDING..." : "SEND MESSAGE"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
