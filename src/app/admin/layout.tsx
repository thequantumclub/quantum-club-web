import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, Calendar, Ticket, Users, ScanLine } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login?next=/admin");
  }

  // Check if user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", authData.user.id)
    .single();

  if (adminError && adminError.code === '42P01') {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-brand-black text-center px-4 text-white">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Database Setup Required</h1>
        <p className="max-w-lg mx-auto mb-6">
          The <code>admins</code> table is missing. You need to run the <strong>complete_setup.sql</strong> script in your Supabase SQL Editor.
        </p>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-brand-black text-center px-4 text-white">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="max-w-lg mx-auto mb-6">
          Your account is not an administrator. To fix this, go to your Supabase Table Editor and insert your user ID into the <code>admins</code> table.
        </p>
        <p className="text-gray-500 text-sm">Your User ID: {authData.user.id}</p>
        <div className="mt-8">
           <Link href="/" className="btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "QR Scanner", href: "/admin/scanner", icon: ScanLine },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Bookings", href: "/admin/bookings", icon: Users },
    { name: "Tickets", href: "/admin/tickets", icon: Ticket },
  ];

  return (
    <div className="flex h-screen bg-brand-black overflow-hidden pt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-black/50 border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-brand-violet">Admin Panel</h2>
          <p className="text-xs text-gray-400 truncate mt-1">{authData.user.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/auth/signout"
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-brand-black/95">
        <div className="p-4 md:hidden border-b border-white/10 flex justify-between items-center bg-black">
           <h2 className="text-lg font-bold text-brand-violet">Admin Panel</h2>
           <div className="flex gap-2">
             {navItems.map((item) => (
               <Link key={item.name} href={item.href} className="text-xs p-2 bg-white/5 rounded">
                 {item.name}
               </Link>
             ))}
           </div>
        </div>
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
