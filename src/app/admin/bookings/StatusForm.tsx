"use client";

import { useActionState } from "react";
import { updateBookingStatus } from "./actions";

export default function StatusForm({ id, status }: { id: string; status: string }) {
  const [state, formAction, pending] = useActionState(updateBookingStatus, { message: "" });

  return (
    <form action={formAction} className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <input type="hidden" name="id" value={id} />
        <select
          name="status"
          defaultValue={status}
          className={`px-2 py-1 rounded-lg text-xs font-bold border-none outline-none appearance-none cursor-pointer ${
            status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
            status === 'VERIFIED' ? 'bg-green-500/20 text-green-400' :
            'bg-red-500/20 text-red-400'
          }`}
        >
          <option value="PENDING">PENDING</option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
        <button type="submit" disabled={pending} className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors disabled:opacity-50">
          {pending ? "Saving..." : "Save"}
        </button>
      </div>
      {state.message && (
        <p aria-live="polite" className="text-xs text-red-400 max-w-xs">{state.message}</p>
      )}
    </form>
  );
}
