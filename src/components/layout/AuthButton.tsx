import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
