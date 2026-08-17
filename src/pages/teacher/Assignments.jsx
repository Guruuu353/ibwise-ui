import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, ChevronRight, Loader2 } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { useAuth } from "../../context/AuthContext";
import { ADMIN_ASSIGNMENTS, COURSES } from "../../lib/mockData";
import StatusBadge from "../../components/ui/StatusBadge";
import { api } from "../../lib/api";

export default function TeacherAssignments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const teacherId = user?.teacher?.id;

  const { data: courses } = useApiData(
    teacherId ? `/subjects/courses?teacherId=${teacherId}` : "/subjects/courses",
    COURSES
  );
  const { data, isMock } = useApiData("/assignments/mine", ADMIN_ASSIGNMENTS);
  const [local, setLocal] = useState(null);
  const assignments = local ?? data;

  const [form, setForm] = useState({ title: "", description: "", instructions: "", courseId: "", dueDate: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function addAssignment(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.courseId || !form.dueDate) {
      setError("Title, class, and due date are all required.");
      return;
    }
    setError(null);
    setBusy(true);

    const course = courses.find((c) => c.id === form.courseId);
    const payload = { ...form, dueDate: new Date(form.dueDate).toISOString(), status: "PUBLISHED" };

    try {
      let createdAssignment;
      if (!isMock) {
        createdAssignment = await api.post("/assignments", payload);
      } else {
        createdAssignment = { id: `a${Date.now()}`, ...payload, course, _count: { submissions: 0 } };
      }
      setLocal([{ ...createdAssignment, course: createdAssignment.course || course }, ...assignments]);
      setForm({ title: "", description: "", instructions: "", courseId: "", dueDate: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addAssignment} className="bg-white border border-[#E7DFCC] rounded-sm p-5 space-y-3">
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-graphite">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Fractions Quiz 2" className="mt-1 w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
          </div>
          <div>
            <label className="text-xs font-semibold text-graphite">Class</label>
            <select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink bg-white">
              <option value="">Select…</option>
              {(courses || []).map((c) => <option key={c.id} value={c.id}>{c.subject?.name} — {c.class?.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-graphite">Due date</label>
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
          </div>
        </div>
        <textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} rows={2}
          placeholder="Instructions for students (optional)"
          className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        {error && <p className="text-xs font-medium text-redpen">{error}</p>}
        <button disabled={busy} className="flex items-center gap-2 px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold disabled:opacity-50">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <PlusCircle size={15} />}
          {busy ? "Publishing…" : "Publish assignment"}
        </button>
      </form>

      <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
        {assignments.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471] text-center">No assignments published yet.</p>}
        {assignments.map((a) => (
          <button
            key={a.id}
            onClick={() => a.id && navigate(`/teacher/assignments/${a.id}`)}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-paperDim transition-colors"
          >
            <div>
              <p className="font-medium text-sm text-ink">{a.title}</p>
              <p className="text-xs text-[#8A8471]">
                {a.course ? `${a.course.subject?.name} — ${a.course.class?.name}` : a.cls} · due{" "}
                {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : a.due}
                {a._count ? ` · ${a._count.submissions} submissions` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={a.status || "PUBLISHED"} extra={a.grade} />
              <ChevronRight size={16} className="text-[#8A8471]" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
