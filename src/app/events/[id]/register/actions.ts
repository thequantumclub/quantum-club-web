"use server";

import { featuredEvent, upcomingEvents, pastEvents, siteConfig } from "@/data/config";
import { createClient } from "@/utils/supabase/server";
import { sendBookingConfirmationEmail } from "@/lib/email";

export async function generatePaymentDetails(eventId: string, quantity: number) {
  const allEvents = [featuredEvent, ...upcomingEvents, ...pastEvents];
  const event = allEvents.find((e) => e.id === eventId);
  if (!event) throw new Error("Event not found");

  const ticketPrice = (event as any).ticketPrice || 0;
  if (isNaN(quantity) || quantity < 1) throw new Error("Invalid quantity");
  
  let exactAmount = ticketPrice * quantity;
  if (quantity >= 6 && quantity < 8) {
    exactAmount = exactAmount * 0.9;
  }

  // Use configuration values
  const upiId = (siteConfig as any).upiId || "unknown@upi";
  const upiName = (siteConfig as any).upiName || "Merchant";
  const note = `Event ${eventId}`;
  
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${exactAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;

  return {
    success: true,
    exactAmount,
    upiUrl,
  };
}

export async function submitPayment(eventId: string, quantity: number, exactAmount: number, utr: string, customerName: string, customerPhone: string) {
  const utrRegex = /^\d{12}$/;
  if (!utrRegex.test(utr)) {
    return { success: false, error: "Please enter a valid 12-digit UTR number." };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    return { success: false, error: "You must be logged in to complete this purchase." };
  }

  const userId = authData.user.id;
  const userEmail = authData.user.email;

  try {
    // 1. Check for duplicate UTR globally
    const { data: existingUtr, error: fetchError } = await supabase
      .from('bookings')
      .select('id')
      .eq('utr', utr)
      .limit(1);

    if (fetchError) {
      return { success: false, error: "Database error while verifying payment." };
    }
    if (existingUtr && existingUtr.length > 0) {
       return { success: false, error: "This UTR has already been submitted. Please check your payment details or prevent duplicate submission." };
    }

    // Apply special offer: Buy 8, get 1 free (scales infinitely)
    const bonusTickets = Math.floor(quantity / 8);
    const finalQuantity = quantity + bonusTickets;

    // 2. Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: userId,
          event_id: eventId,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: userEmail,
          quantity: finalQuantity,
          amount: exactAmount,
          utr: utr,
          status: 'PENDING'
        }
      ])
      .select()
      .single();

    if (bookingError || !booking) {
      console.error("Booking creation error:", bookingError);
      return { success: false, error: "Failed to create booking." };
    }

    // ── Send booking confirmation email (Email 1) ──
    try {
      const allEvents = [featuredEvent, ...upcomingEvents, ...pastEvents];
      const eventInfo = allEvents.find((e) => e.id === eventId);
      if (userEmail) {
        await sendBookingConfirmationEmail({
          toEmail: userEmail,
          customerName: customerName,
          eventTitle: (eventInfo as any)?.title || "Quantum Club Event",
          eventDate: (eventInfo as any)?.displayDate || (eventInfo as any)?.date || "",
          eventTime: (eventInfo as any)?.time || "",
          eventVenue: (eventInfo as any)?.venue || "",
          quantity: finalQuantity,
          amount: exactAmount,
          utr: utr,
        });
      }
    } catch (emailErr) {
      console.error("[Email] Booking confirmation email failed:", emailErr);
    }
    // ───────────────────────────────────────────

    return { success: true, bookingId: booking.id };

  } catch (e) {
    console.error("Supabase exception:", e);
    return { success: false, error: "Server error while processing your request." };
  }
}
