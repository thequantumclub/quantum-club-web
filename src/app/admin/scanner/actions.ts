"use server";

import { createClient } from "@/utils/supabase/server";

export async function verifyTicket(qrToken: string) {
  if (!qrToken) return { error: "No QR token provided." };
  
  const token = qrToken.trim();
  console.log("Scanned QR Token:", token);

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return { error: "Unauthorized access." };
  }

  // Ensure admin
  const { data: adminData } = await supabase.from("admins").select("user_id").eq("user_id", authData.user.id).single();
  if (!adminData) {
    return { error: "Admin privileges required." };
  }

  // Find ticket by exact qr_token
  const { data, error } = await supabase
    .from("tickets")
    .select(`
      id, ticket_number, customer_name, status, claimed_at, claimed_by,
      event_id,
      bookings (amount, quantity)
    `)
    .eq("qr_token", token)
    .single();

  if (error || !data) {
    console.error("Supabase Error:", error);
    return { error: `Invalid QR Code. Ticket not found in the system.\nScanned value: ${token}` };
  }

  const ticket = data as any; // Bypass strict relationship array types

  // Fetch event title separately since there's no FK constraint
  const { data: eventData } = await supabase
    .from("events")
    .select("title")
    .eq("id", ticket.event_id)
    .single();

  // Calculate ticket's individual amount (booking amount / booking quantity)
  const bookingData = Array.isArray(ticket.bookings) ? ticket.bookings[0] : ticket.bookings;

  const bookingAmount = bookingData?.amount || 0;
  const bookingQuantity = bookingData?.quantity || 1;
  const ticketAmount = bookingAmount / bookingQuantity;

  return { 
    success: true, 
    ticket: {
      id: ticket.id,
      ticket_number: ticket.ticket_number,
      customer_name: ticket.customer_name || 'N/A',
      status: ticket.status,
      claimed_at: ticket.claimed_at,
      claimed_by: ticket.claimed_by,
      event_title: eventData?.title || 'Unknown Event',
      amount: ticketAmount
    }
  };
}

export async function claimTicket(ticketId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) return { error: "Unauthorized" };
  const adminEmail = authData.user.email;

  // Strict atomic update: only update if status is 'ACTIVE'
  const { data, error } = await supabase
    .from("tickets")
    .update({ 
      status: "CLAIMED",
      claimed_at: new Date().toISOString(),
      claimed_by: adminEmail
    })
    .eq("id", ticketId)
    .eq("status", "ACTIVE")
    .select()
    .single();

  if (error || !data) {
    return { error: "Ticket could not be claimed. It may have already been claimed." };
  }

  return { success: true, claimed_at: data.claimed_at };
}
