import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { featuredEvent, upcomingEvents, pastEvents } from "@/data/config";
import { ArrowLeft, Ticket } from "lucide-react";

export default async function MyTicketsPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login?next=/my-tickets");
  }

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", authData.user.id)
    .order("created_at", { ascending: false });

  const allEvents = [featuredEvent, ...upcomingEvents, ...pastEvents];

  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link 
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-brand-violet/20 rounded-xl">
            <Ticket className="w-8 h-8 text-brand-violet" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">My Tickets</h1>
        </div>

        {error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            Error loading tickets. Please try again later.
          </div>
        ) : !tickets || tickets.length === 0 ? (
          <div className="p-12 glass-panel rounded-3xl border border-white/5 text-center">
            <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No tickets found</h2>
            <p className="text-gray-400 mb-6">You haven't purchased any tickets yet.</p>
            <Link href="/" className="btn-primary">
              BROWSE EVENTS
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tickets.map((ticket) => {
              const eventInfo = allEvents.find(e => e.id === ticket.event_id);
              const eventTitle = eventInfo ? eventInfo.title : "Unknown Event";
              
              return (
                <div key={ticket.id} className="p-6 glass-panel rounded-2xl border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ticket.status === 'ACTIVE' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {ticket.status}
                      </span>
                      <span className="text-sm font-mono text-gray-400">{ticket.ticket_number}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{eventTitle}</h3>
                    <p className="text-sm text-gray-400 mb-6">Purchased on {new Date(ticket.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <Link 
                    href={`/my-tickets/${ticket.id}`}
                    className="w-full text-center px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
                  >
                    View Ticket
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
