"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nextUrl = formData.get("next") as string || "/";

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(nextUrl);
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nextUrl = formData.get("next") as string || "/";

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("already registered") || error.message.includes("User already exists")) {
      // If user already exists, try to log them in automatically
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) {
        // If login fails (wrong password), tell them they already have an account and need to login
        return { error: "An account with this email already exists. Please switch to Login and enter your correct password." };
      }
      // Login succeeded
      revalidatePath("/", "layout");
      redirect(nextUrl);
    }
    return { error: error.message };
  }

  if (data.session === null) {
    return { error: "Please check your email for a confirmation link to complete your registration." };
  }

  revalidatePath("/", "layout");
  redirect(nextUrl);
}
