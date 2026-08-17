import { useState, useEffect } from "react";
import { CalendarCheck, Loader2, CheckCircle2 } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { useAuth } from "../../context/AuthContext";
import { COURSES } from "../../lib/mockData";
import { api } from "../../lib/api";

const STATUSES = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];
const STATUS_COLOR = {
  PRESENT: "bg-[#E4EDE6] text-leaf border-leaf/30",
  ABSENT: "bg-[#F5E1DE] text-redpen border-redpen/30",
  LATE: "bg-[#FBEEDA] text-[#8A6A2B] border-marigold/30",
  EXCUSED: "bg-[#E3E7EE] text-ink border-ink/20",
};

function todayISO() { return new Date().toISOString().slice(0, 10); }

export default function TeacherAttendance() {
  const { user } = useAuth();
  const teacherId = user?.teacher?.id;
  const { data: courses } = useApiData(teacherId ? `/subjects/courses?teacherId=${teacherId}` : "/subjects/courses", COURSES);

  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [roster, setRoster] = useState([]);
  const [marks, setMarks] = useState({}); // studentId -> status
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const course = courses.find((c) => c.id === courseId);

  useEffect(() => {
    if (!course?.class?.id) { setRoster([]); return; }
    let cancelled = false;
    setLoading(true);
    setSaved(false);
    setError(null);

    Promise.all([
      api.get(`/classes/${course.class.id}`),
      api.get(`/attendance/course`, { params: { courseId, date } }).catch(() => []),
    ])
      .then(([cls, existing]) => {
        if (cancelled) return;
        const students = cls.students || [];
        setRoster(students);
        const prefilled = {};
        (Array.isArray(existing) ? existing : []).forEach((r) => { prefilled[r.studentId] = r.status; });
        students.forEach((s) => { if (!prefilled[s.id]) prefilled[s.id] = "PRESENT"; });
        setMarks(prefilled);
      })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [courseId, date, course?.class?.id]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await api.post("/attendance/mark", {
        courseId,
        date: new Date(date).toISOString(),
        records: roster.map((s) => ({ studentId: s.id, status: marks[s.id] || "PRESENT" })),
      });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#E7DFCC] rounded-sm p-5 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs font-semibold text-graphite">Class</label>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)}
            className="mt-1 block px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink bg-white min-w-[220px]">
            <option value="">Select a class…</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.subject?.name} — {c.class?.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-graphite">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="mt-1 block px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        </div>
      </div>

      {!courseId && (
        <p className="text-sm text-[#8A8471] text-center py-10">
          <CalendarCheck size={18} className="inline mr-1.5 -mt-0.5" /> Pick a class and date to mark attendance.
        </p>
      )}

      {courseId && loading && <p className="text-sm text-[#8A8471] text-center py-10">Loading roster…</p>}

      {courseId && !loading && (
        <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
          {roster.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471] text-center">No students in this class yet.</p>}
          {roster.map((s) => (
            <div key={s.id} className="px-5 py-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink">{s.user?.firstName} {s.user?.lastName}</p>
              <div className="flex gap-1.5">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => { setMarks({ ...marks, [s.id]: status }); setSaved(false); }}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-sm border transition-colors ${
                      marks[s.id] === status ? STATUS_COLOR[status] : "bg-white text-[#8A8471] border-[#E7DFCC] hover:bg-paperDim"
                    }`}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {roster.length > 0 && (
            <div className="px-5 py-4 flex items-center gap-3">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold disabled:opacity-50">
                {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle2 size={15} /> : <CalendarCheck size={15} />}
                {saving ? "Saving…" : saved ? "Saved" : "Save attendance"}
              </button>
              {error && <p className="text-xs font-medium text-redpen">{error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
