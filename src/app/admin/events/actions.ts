"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const location = formData.get("location") as string;
  const ticket_price = parseFloat(formData.get("ticket_price") as string);
  const image = formData.get("image") as string || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80";

  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const { error } = await supabase.from("events").insert([{
    id, title, date, time, location, ticket_price, image, status: 'upcoming'
  }]);

  if (error) console.error(error.message);
  
  revalidatePath("/admin/events");
}

export async function updateEvent(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const location = formData.get("location") as string;
  const ticket_price = parseFloat(formData.get("ticket_price") as string);
  const image = formData.get("image") as string;

  const { error } = await supabase.from("events").update({
    title, date, time, location, ticket_price, image
  }).eq("id", id);

  if (error) console.error(error.message);
  
  revalidatePath("/admin/events");
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  
  if (error) console.error(error.message);
  
  revalidatePath("/admin/events");
}
