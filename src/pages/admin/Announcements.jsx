import { useState } from "react";
import { PlusCircle, Megaphone } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { ANNOUNCEMENTS } from "../../lib/mockData";
import { api } from "../../lib/api";

export default function AdminAnnouncements() {
  const { data, isMock } = useApiData("/announcements/all", ANNOUNCEMENTS);
  const [local, setLocal] = useState(null);
  const announcements = local ?? data;
  const [form, setForm] = useState({ title: "", body: "", audience: "ALL" });

  async function create(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (!isMock) { try { await api.post("/announcements", form); } catch { /* fall through */ } }
    setLocal([{ id: `an${Date.now()}`, ...form, createdAt: new Date().toISOString() }, ...announcements]);
    setForm({ title: "", body: "", audience: "ALL" });
  }

  return (
    <div className="space-y-5">
      <form onSubmit={create} className="bg-white border border-[#E7DFCC] rounded-sm p-5 space-y-3">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Announcement title"
          className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        <textarea rows={2} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Message"
          className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        <div className="flex items-center gap-3">
          <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}
            className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink">
            <option value="ALL">Everyone</option><option value="TEACHER">Teachers</option><option value="STUDENT">Students</option><option value="PARENT">Parents</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold"><PlusCircle size={15} /> Publish announcement</button>
        </div>
      </form>
      <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
        {announcements.map((a) => (
          <div key={a.id} className="px-5 py-4 flex items-start gap-3">
            <Megaphone size={15} className="text-marigold mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{a.title}</p>
              <p className="text-xs text-graphite mt-0.5">{a.body}</p>
              <p className="text-xs text-[#8A8471] mt-1">{a.audience} · {a.createdAt?.slice(0, 10)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
