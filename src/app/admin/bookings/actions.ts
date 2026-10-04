"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(formData: FormData) {
  const supabase = await createClient();
  
  // Auth Check
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Unauthorized");
  
  // Admin Check
  const { data: adminData } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", authData.user.id)
    .single();
      if (!adminData) throw new Error("Admin access required");

  const id = formData.get("id") as string;
  const status = formData.get("status") as string; // PENDING, VERIFIED, REJECTED
  
  if (!id || !status) throw new Error("Missing fields");

  // 1. Fetch current booking to ensure we don't generate duplicate tickets
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();
    
  if (fetchError || !booking) throw new Error("Booking not found");

  // 2. Update booking status
  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);
    
  if (updateError) {
    console.error("Error updating booking:", updateError.message);
    throw new Error("Failed to update booking status");
  }
  
  // 3. Generate tickets if status changed to VERIFIED
  if (status === "VERIFIED" && booking.status !== "VERIFIED") {
    // Check if tickets already exist just to be absolutely safe against race conditions
    const { data: existingTickets } = await supabase
      .from("tickets")
      .select("id")
      .eq("booking_id", id)
      .limit(1);
      
    if (!existingTickets || existingTickets.length === 0) {
      const tickets = [];
      for (let i = 0; i < booking.quantity; i++) {
        const ticketNumber = `QC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${i+1}`;
        const qrToken = crypto.randomUUID();
        
        tickets.push({
          booking_id: booking.id,
          user_id: booking.user_id,
          event_id: booking.event_id,
          customer_name: booking.customer_name,
          ticket_number: ticketNumber,
          qr_token: qrToken,
          status: 'ACTIVE'
        });
      }

      const { error: ticketError } = await supabase
        .from('tickets')
        .insert(tickets);
        
      if (ticketError) {
        console.error("Ticket generation error:", ticketError);
        throw new Error("Status updated but failed to generate tickets.");
      }
    }
  }
  
  revalidatePath("/admin/bookings");
}
