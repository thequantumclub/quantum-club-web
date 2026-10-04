import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Clock, Ticket, MessageCircle } from "lucide-react";
import { featuredEvent, upcomingEvents, pastEvents, siteConfig, whatsappMessages } from "@/data/config";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const allEvents = [featuredEvent, ...upcomingEvents, ...pastEvents];
  const { id } = await params;
  const event = allEvents.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  return (
    <div className="pt-24 pb-24 bg-brand-black min-h-screen">
      {/* Event Hero */}
      <div 
        className="w-full h-[50vh] min-h-[400px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-4 text-white">
              {event.title}
            </h1>
            {/* If it's the featured event, it has a subtitle */}
            {'subtitle' in event && (
              <p className="text-xl text-gray-300 max-w-2xl">
                {(event as any).subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-8">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">About this event</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {('description' in event ? (event as any).description : "") || 
                 "Join us for an unforgettable experience at Quantum Club. Get ready for a night of incredible music, electric atmosphere, and memories that will last a lifetime. Ensure you book your tickets early as spots are limited."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-8 glass-panel rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold mb-6">Event Details</h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4 text-gray-300">
                  <Calendar className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Date</p>
                    <p className="text-sm mt-1">{('displayDate' in event) ? (event as any).displayDate : new Date((event as any).date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                
                {'time' in event && (
                  <div className="flex items-start gap-4 text-gray-300">
                    <Clock className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Time</p>
                      <p className="text-sm mt-1">{(event as any).time}</p>
                    </div>
                  </div>
                )}
                
                {'venue' in event && (
                  <div className="flex items-start gap-4 text-gray-300">
                    <MapPin className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Venue</p>
                      <p className="text-sm mt-1">{(event as any).venue}</p>
                    </div>
                  </div>
                )}

                {'price' in event && (
                  <div className="flex items-start gap-4 text-gray-300">
                    <Ticket className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Entry</p>
                      <p className="text-sm mt-1">{(event as any).price}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-brand-silver/10 flex flex-col gap-4">
                {!pastEvents.some((e) => e.id === event.id) && (
                  <Link 
                    href={`/events/${event.id}/register`}
                    className="btn-primary w-full text-center"
                  >
                    REGISTER NOW
                  </Link>
                )}
                <a 
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(whatsappMessages.event(event.title))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" /> ENQUIRY
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
