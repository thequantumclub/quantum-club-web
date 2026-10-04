import { createClient } from "@/utils/supabase/server";
import { Ticket, CheckCircle2, CircleDashed } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch all tickets to compute stats
  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("status");

  if (error) {
    return <div className="text-red-400">Error loading dashboard stats.</div>;
  }

  const totalTickets = tickets?.length || 0;
  const claimedTickets = tickets?.filter(t => t.status === "CLAIMED").length || 0;
  const activeTickets = tickets?.filter(t => t.status === "ACTIVE").length || 0;

  const stats = [
    { name: "Total Tickets Sold", value: totalTickets, icon: Ticket, color: "text-blue-400", bg: "bg-blue-500/10" },
    { name: "Active Tickets", value: activeTickets, icon: CircleDashed, color: "text-green-400", bg: "bg-green-500/10" },
    { name: "Claimed Tickets", value: claimedTickets, icon: CheckCircle2, color: "text-gray-400", bg: "bg-gray-500/10" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 glass-panel rounded-3xl border border-white/5 flex items-center gap-6">
            <div className={`p-4 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">{stat.name}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
