import { createClient } from "@/utils/supabase/server";
import { createEvent, updateEvent, deleteEvent } from "./actions";
import Link from "next/link";

export default async function AdminEvents({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("*").order("created_at", { ascending: false });

  let editingEvent = null;
  if (edit && events) {
    editingEvent = events.find((e) => e.id === edit);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Manage Events</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="p-6 glass-panel rounded-3xl border border-white/5 relative">
            {editingEvent && (
              <div className="absolute top-6 right-6">
                <Link href="/admin/events" className="text-xs text-gray-400 hover:text-white underline">Cancel Edit</Link>
              </div>
            )}
            <h2 className="text-xl font-bold text-white mb-4">
              {editingEvent ? "Edit Event" : "Create New Event"}
            </h2>
            <form action={editingEvent ? updateEvent : createEvent} className="space-y-4">
              {editingEvent && <input type="hidden" name="id" value={editingEvent.id} />}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input name="title" defaultValue={editingEvent?.title || ""} required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date (e.g. Oct 24, 2026)</label>
                <input name="date" defaultValue={editingEvent?.date || ""} required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Time (e.g. 7:00 PM)</label>
                <input name="time" defaultValue={editingEvent?.time || ""} required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location</label>
                <input name="location" defaultValue={editingEvent?.location || ""} required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Ticket Price (₹)</label>
                <input name="ticket_price" type="number" defaultValue={editingEvent?.ticket_price || ""} required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Image URL (Optional)</label>
                <input name="image" defaultValue={editingEvent?.image || ""} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>
              <button type="submit" className="w-full py-2 bg-brand-violet hover:bg-brand-violet/80 text-white rounded-xl font-bold transition-colors">
                {editingEvent ? "SAVE CHANGES" : "CREATE EVENT"}
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-4">
            {events?.map((event) => (
              <div key={event.id} className="p-4 glass-panel rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">{event.title}</h3>
                  <p className="text-sm text-gray-400">{event.date} at {event.time} | {event.location} | ₹{event.ticket_price}</p>
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`/admin/events?edit=${event.id}`}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
                  >
                    Edit
                  </Link>
                  <form action={async () => {
                    "use server";
                    await deleteEvent(event.id);
                  }}>
                    <button type="submit" className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg text-sm transition-colors">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
            {(!events || events.length === 0) && (
              <p className="text-gray-400">No events found in database.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
