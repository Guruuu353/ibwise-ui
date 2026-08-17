import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

// Shared between teacher and student dashboards — self-service edit of
// name/phone (and bio, for teachers). Writes to PUT /auth/me, deliberately
// narrow on the backend so this can never touch role or account status.
export default function ProfilePanel({ showBio }) {
  const { user, patchUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || "", lastName: user?.lastName || "",
    phone: user?.phone || "", bio: user?.teacher?.bio || "",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const updated = await api.put("/auth/me", form);
      patchUser(updated);
      setSaved(true);
    } catch {
      patchUser(form); // demo fallback — still reflect the edit locally
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-paperDim text-ink flex items-center justify-center text-xl font-display font-semibold">
          {(user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")}
        </div>
        <div>
          <p className="font-semibold text-ink">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-[#8A8471]">{user?.email || "Demo preview account"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-graphite">First name</label>
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
          </div>
          <div>
            <label className="text-xs font-semibold text-graphite">Last name</label>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-graphite">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="07XX XXX XXX" className="mt-1 w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        </div>
        {showBio && (
          <div>
            <label className="text-xs font-semibold text-graphite">Bio</label>
            <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="A short line for your teacher profile" className="mt-1 w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
          </div>
        )}
        <button disabled={saving} className="px-5 py-2.5 rounded-sm bg-ink text-paper text-sm font-semibold disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="ml-3 inline-flex items-center gap-1.5 text-xs text-leaf font-semibold"><CheckCircle2 size={14} /> Saved</span>}
      </form>
    </div>
  );
}
