import { createClient } from "@/utils/supabase/server";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";
import { updateTicketStatus } from "./actions";

export default async function AdminTickets({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const supabase = await createClient();

  let queryBuilder = supabase
    .from("tickets")
    .select(`
      id, ticket_number, status, created_at, customer_name, event_id
    `)
    .order("created_at", { ascending: false });

  if (query) {
    // Search by ticket_number OR customer_name
    queryBuilder = queryBuilder.or(`ticket_number.ilike.%${query}%,customer_name.ilike.%${query}%`);
  }

  const { data: ticketsData, error } = await queryBuilder;
  if (error) console.error(error);

  // Fetch events separately to avoid FK relationship error
  const { data: eventsData } = await supabase.from("events").select("id, title");
  
  const tickets = ticketsData?.map(ticket => ({
    ...ticket,
    event_title: eventsData?.find(e => e.id === ticket.event_id)?.title || 'Unknown Event'
  })) || [];

  // Function to handle form submission for search via server action
  async function searchTickets(formData: FormData) {
    "use server";
    const q = formData.get("query") as string;
    if (q) {
      redirect(`/admin/tickets?query=${encodeURIComponent(q)}`);
    } else {
      redirect(`/admin/tickets`);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Manage Tickets</h1>

      <div className="mb-6 flex justify-between items-center bg-black/30 p-4 rounded-2xl border border-white/5">
        <form action={searchTickets} className="flex gap-4 flex-1 max-w-md relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            name="query" 
            defaultValue={query || ""}
            placeholder="Search by ticket number or customer name..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-brand-silver transition-colors"
          />
          <button type="submit" className="px-4 py-2 bg-brand-violet hover:bg-brand-violet/80 text-white rounded-xl font-bold transition-colors">
            Search
          </button>
        </form>
      </div>

      <div className="bg-black/50 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 text-gray-400 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Ticket Number</th>
                <th className="px-6 py-4 font-medium">Customer Name</th>
                <th className="px-6 py-4 font-medium">Event</th>
                <th className="px-6 py-4 font-medium">Status / Actions</th>
                <th className="px-6 py-4 font-medium">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tickets.map((ticket: any) => (
                <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-brand-silver">{ticket.ticket_number}</td>
                  <td className="px-6 py-4 text-white">{ticket.customer_name || 'N/A'}</td>
                  <td className="px-6 py-4">{ticket.event_title}</td>
                  <td className="px-6 py-4">
                    <form action={updateTicketStatus} className="flex gap-2 items-center">
                      <input type="hidden" name="id" value={ticket.id} />
                      <select 
                        name="status"
                        defaultValue={ticket.status}
                        className={`px-2 py-1 rounded-lg text-xs font-bold border-none outline-none appearance-none cursor-pointer ${
                          ticket.status === 'ACTIVE' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="CLAIMED">CLAIMED</option>
                      </select>
                      <button type="submit" className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded">
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!tickets || tickets.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No tickets found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
