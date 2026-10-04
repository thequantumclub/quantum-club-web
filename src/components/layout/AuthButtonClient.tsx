"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

import type { User } from "@supabase/supabase-js";

export default function AuthButtonClient() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // Check active session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="w-16 h-4 animate-pulse bg-white/10 rounded"></div>;
  }

  if (user) {
    return (
      <form action="/auth/signout" method="post" className="inline">
        <button className="text-sm font-bold tracking-widest text-brand-silver hover:text-brand-white transition-colors">
          LOGOUT
        </button>
      </form>
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm font-bold tracking-widest text-brand-silver hover:text-brand-white transition-colors"
    >
      LOGIN / SIGNUP
    </Link>
  );
}
