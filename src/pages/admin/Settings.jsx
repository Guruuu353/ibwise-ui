import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { SETTINGS_SEED } from "../../lib/mockData";
import { api } from "../../lib/api";

export default function AdminSettings() {
  const { data, isMock } = useApiData("/settings", SETTINGS_SEED);
  const [form, setForm] = useState(data);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(data); }, [data]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isMock) { try { await api.put("/settings", form); } catch { /* demo fallback */ } }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="text-xs font-semibold text-graphite">School name</label>
        <input value={form.schoolName || ""} onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
      </div>
      <div>
        <label className="text-xs font-semibold text-graphite">Contact email</label>
        <input value={form.contactEmail || ""} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
      </div>
      <div>
        <label className="text-xs font-semibold text-graphite">Contact phone</label>
        <input value={form.contactPhone || ""} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
      </div>
      <label className="flex items-center gap-2 text-sm text-graphite">
        <input type="checkbox" checked={!!form.blogModerationRequired} onChange={(e) => setForm({ ...form, blogModerationRequired: e.target.checked })} />
        Require admin approval before blog posts go live
      </label>
      <button className="px-5 py-2.5 rounded-sm bg-ink text-paper text-sm font-semibold">Save settings</button>
      {saved && <span className="ml-3 inline-flex items-center gap-1.5 text-xs text-leaf font-semibold"><CheckCircle2 size={14} /> Saved</span>}
    </form>
  );
}
