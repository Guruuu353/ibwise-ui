import { useState } from "react";
import { Calendar, Plus, Pencil, Trash2 } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { EVENTS } from "../../lib/mockData";
import { api } from "../../lib/api";
import { SkeletonRows } from "../../components/ui/Loaders";

const EMPTY_FORM = { title: "", description: "", location: "", tag: "", startsAt: "", endsAt: "" };

// datetime-local inputs need "YYYY-MM-DDTHH:mm" — trims the seconds/timezone
// off an ISO string coming back from the API.
function toLocalInput(iso) {
  if (!iso) return "";
  return iso.slice(0, 16);
}

function EventForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const isEdit = Boolean(initial?.id);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const payload = { ...form, endsAt: form.endsAt || null };
      if (isEdit) await api.put(`/events/${initial.id}`, payload);
      else await api.post("/events", payload);
      onSaved();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white border border-[#E7DFCC] rounded-sm p-4 space-y-3 mb-5">
      <div className="grid md:grid-cols-2 gap-3">
        <input required placeholder="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        <input placeholder="Tag (e.g. Academics)" value={form.tag || ""} onChange={(e) => setForm({ ...form, tag: e.target.value })}
          className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <input placeholder="Location" value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        <textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={1} className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink resize-none" />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="text-xs text-[#8A8471] flex flex-col gap-1">
          Starts at
          <input required type="datetime-local" value={toLocalInput(form.startsAt)} onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
            className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        </label>
        <label className="text-xs text-[#8A8471] flex flex-col gap-1">
          Ends at (optional)
          <input type="datetime-local" value={toLocalInput(form.endsAt)} onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
            className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        </label>
      </div>
      {status && <p className="text-xs font-medium text-redpen">{status}</p>}
      <div className="flex items-center gap-3">
        <button disabled={busy} className="px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold disabled:opacity-50">
          {isEdit ? "Save changes" : "Create event"}
        </button>
        <button type="button" onClick={onCancel} className="text-xs font-semibold text-graphite hover:text-ink">Cancel</button>
      </div>
    </form>
  );
}

export default function AdminEvents() {
  const { data: events, loading, isMock } = useApiData("/events/all", EVENTS);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function saved() {
    setCreating(false);
    setEditing(null);
    setRefreshKey((k) => k + 1);
  }

  async function remove(e) {
    if (!confirm(`Delete "${e.title}"? This can't be undone.`)) return;
    try {
      await api.delete(`/events/${e.id}`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div key={refreshKey}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-graphite">Create and manage school events shown on the calendar and public site.</p>
        {!creating && !editing && (
          <button onClick={() => setCreating(true)} className="flex items-center gap-2 px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold">
            <Plus size={15} /> New event
          </button>
        )}
      </div>

      {creating && <EventForm onCancel={() => setCreating(false)} onSaved={saved} />}
      {editing && <EventForm initial={editing} onCancel={() => setEditing(null)} onSaved={saved} />}

      {loading ? (
        <SkeletonRows rows={4} cols={1} />
      ) : (
        <div className="space-y-3">
          {events.length === 0 && <p className="text-sm text-[#8A8471] text-center py-10">No events yet.</p>}
          {events.map((e) => (
            <div key={e.id || e.title} className="bg-white border border-[#E7DFCC] rounded-sm p-4 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <Calendar size={16} className="text-leaf mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{e.title}</p>
                  <p className="text-xs text-[#8A8471] mt-0.5">
                    {e.tag ? `${e.tag} · ` : ""}
                    {(e.date || e.startsAt?.slice(0, 10))}
                    {e.location ? ` · ${e.location}` : ""}
                  </p>
                </div>
              </div>
              {e.id && !isMock && (
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => setEditing(e)} aria-label="Edit event" className="text-graphite hover:text-ink">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => remove(e)} aria-label="Delete event" className="text-graphite hover:text-redpen">
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
