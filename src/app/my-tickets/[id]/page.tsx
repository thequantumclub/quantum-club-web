import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { featuredEvent, upcomingEvents, pastEvents } from "@/data/config";
import { ArrowLeft, AlertCircle } from "lucide-react";
import QRCodeClient from "./QRCodeClient";

export default async function ViewTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login");
  }

  const { id } = await params;

  // Fetch ticket and related booking details
  const { data: ticket, error } = await supabase
    .from("tickets")
    .select("*, bookings(quantity, amount)")
    .eq("id", id)
    .single();

  if (error || !ticket) {
    console.error("Ticket fetch error:", error);
    notFound();
  }

  // Ensure user owns this ticket
  if (ticket.user_id !== authData.user.id) {
    redirect("/my-tickets");
  }

  const allEvents = [featuredEvent, ...upcomingEvents, ...pastEvents];
  const eventInfo = allEvents.find(e => e.id === ticket.event_id);
  const eventTitle = eventInfo ? eventInfo.title : "Unknown Event";

  // Calculate ticket amount
  const bookingQuantity = ticket.bookings?.quantity || 1;
  const bookingAmount = ticket.bookings?.amount || 0;
  const ticketAmount = bookingAmount / bookingQuantity;

  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 max-w-md">
        <Link 
          href="/my-tickets"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Tickets
        </Link>

        {/* Warning Banner */}
        <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-yellow-200 font-medium text-sm">
            PLEASE TAKE A SCREENSHOT OF THIS QR CODE. YOU WILL NEED IT FOR ENTRY.
          </p>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 relative bg-white/5">
          {/* Ticket Header */}
          <div className="p-6 border-b border-white/10 bg-brand-violet/10 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">{eventTitle}</h1>
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
              ticket.status === 'ACTIVE' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {ticket.status}
            </div>
          </div>

          {/* Ticket Body / QR Code */}
          <div className="p-8 flex flex-col items-center justify-center bg-white">
            <QRCodeClient value={ticket.qr_token} />
            <p className="mt-6 font-mono text-gray-500 tracking-widest text-lg font-bold">
              {ticket.ticket_number}
            </p>
          </div>

          {/* Ticket Footer / Details */}
          <div className="p-6 border-t border-white/10 bg-black/40">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Admit</p>
                <p className="text-lg font-bold text-white">1 Person</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Amount</p>
                <p className="text-lg font-bold text-white">₹{ticketAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          {/* Decorative punch holes */}
          <div className="absolute left-[-15px] top-[180px] w-[30px] h-[30px] rounded-full bg-brand-black border-r border-white/10"></div>
          <div className="absolute right-[-15px] top-[180px] w-[30px] h-[30px] rounded-full bg-brand-black border-l border-white/10"></div>
        </div>
      </div>
    </div>
  );
}
