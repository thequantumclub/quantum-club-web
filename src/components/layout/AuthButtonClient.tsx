"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

import type { User } from "@supabase/supabase-js";

// showEmail prints the signed-in email under LOGOUT (mobile menu, where
// there is no hover); otherwise it appears in a tooltip on hover/focus.
export default function AuthButtonClient({ showEmail = false }: { showEmail?: boolean }) {
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
      <form
        action="/auth/signout"
        method="post"
        className={showEmail ? "flex flex-col items-center gap-1" : "relative inline group"}
      >
        <button className="text-sm font-bold tracking-widest text-brand-silver hover:text-brand-white transition-colors">
          LOGOUT
        </button>
        {showEmail ? (
          <span className="text-xs text-gray-500">{user.email}</span>
        ) : (
          <span
            role="tooltip"
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-3 whitespace-nowrap rounded-lg border border-white/10 bg-brand-black px-3 py-2 text-xs text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          >
            Signed in as <span className="font-medium text-white">{user.email}</span>
          </span>
        )}
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
