import { createClient } from "@/utils/supabase/server";
import StatusForm from "./StatusForm";

export default async function AdminBookings() {
  const supabase = await createClient();
  const { data: bookingsData, error } = await supabase
    .from("bookings")
    .select(`
      id, created_at, customer_name, customer_phone, customer_email,
      quantity, amount, utr, status, event_id
    `)
    .order("created_at", { ascending: false });

  if (error) console.error(error);

  const { data: eventsData } = await supabase.from("events").select("id, title");

  const bookings = bookingsData?.map(booking => ({
    ...booking,
    event_title: eventsData?.find(e => e.id === booking.event_id)?.title || 'Unknown'
  })) || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Manage Bookings</h1>

      <div className="bg-black/50 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 text-gray-400 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Event</th>
                <th className="px-6 py-4 font-medium">Qty</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">UTR</th>
                <th className="px-6 py-4 font-medium">Status / Actions</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{booking.customer_name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{booking.customer_phone}</p>
                    <p className="text-xs text-gray-500">{booking.customer_email}</p>
                  </td>
                  <td className="px-6 py-4">{booking.event_title}</td>
                  <td className="px-6 py-4">{booking.quantity}</td>
                  <td className="px-6 py-4 text-brand-silver font-mono">₹{booking.amount}</td>
                  <td className="px-6 py-4 font-mono text-xs">{booking.utr}</td>
                  <td className="px-6 py-4">
                    <StatusForm id={booking.id} status={booking.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!bookings || bookings.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No bookings found.
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
