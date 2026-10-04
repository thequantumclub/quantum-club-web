"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTicketStatus(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  
  if (!id || !status) return;

  const { error } = await supabase
    .from("tickets")
    .update({ status })
    .eq("id", id);
    
  if (error) console.error("Error updating ticket:", error.message);
  
  revalidatePath("/admin/tickets");
}
