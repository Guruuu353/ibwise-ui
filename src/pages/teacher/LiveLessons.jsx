import { useState } from "react";
import { Video, PlusCircle, Play, Square, XCircle, Loader2, Radio } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { useAuth } from "../../context/AuthContext";
import { COURSES } from "../../lib/mockData";
import { api } from "../../lib/api";
import LiveVideoRoom from "../../components/ui/LiveVideoRoom";

const MOCK_SESSIONS = [
  { id: "ls1", title: "Algebra live recap", status: "SCHEDULED", scheduledAt: new Date(Date.now() + 3600e3).toISOString(), course: { subject: { name: "Mathematics" }, class: { name: "Grade 7" } }, roomName: "demo-room" },
];

function todayLocalInput() { return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16); }

const STATUS_STYLE = {
  SCHEDULED: "bg-[#E3E7EE] text-ink",
  LIVE: "bg-[#F5E1DE] text-redpen",
  ENDED: "bg-paperDim text-[#8A8471]",
  CANCELLED: "bg-paperDim text-[#8A8471] line-through",
};

export default function TeacherLiveLessons() {
  const { user } = useAuth();
  const teacherId = user?.teacher?.id;
  const { data: courses } = useApiData(teacherId ? `/subjects/courses?teacherId=${teacherId}` : "/subjects/courses", COURSES);
  const { data, isMock } = useApiData("/live-sessions/mine/teaching", MOCK_SESSIONS);
  const [local, setLocal] = useState(null);
  const sessions = local ?? data;

  const [form, setForm] = useState({ courseId: "", title: "", scheduledAt: todayLocalInput() });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [inCall, setInCall] = useState(null); // roomName currently joined

  function updateLocal(id, patch) {
    setLocal(sessions.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function scheduleSession(e) {
    e.preventDefault();
    if (!form.courseId || !form.title.trim()) { setError("Pick a class and give the session a title."); return; }
    setError(null);
    setBusy(true);
    try {
      const course = courses.find((c) => c.id === form.courseId);
      let session = { id: `ls${Date.now()}`, ...form, status: "SCHEDULED", course, roomName: `demo-${Date.now()}` };
      if (!isMock) session = await api.post("/live-sessions", { ...form, scheduledAt: new Date(form.scheduledAt).toISOString() });
      setLocal([session, ...sessions]);
      setForm({ courseId: "", title: "", scheduledAt: todayLocalInput() });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function startSession(s) {
    if (!isMock) {
      try { await api.patch(`/live-sessions/${s.id}/start`); } catch (err) { setError(err.message); return; }
    }
    updateLocal(s.id, { status: "LIVE" });
    setInCall(s.roomName);
  }

  async function endSession(s) {
    if (!isMock) {
      try { await api.patch(`/live-sessions/${s.id}/end`); } catch { /* still reflect locally */ }
    }
    updateLocal(s.id, { status: "ENDED" });
    setInCall(null);
  }

  async function cancelSession(s) {
    if (!isMock) {
      try { await api.patch(`/live-sessions/${s.id}/cancel`); } catch { /* still reflect locally */ }
    }
    updateLocal(s.id, { status: "CANCELLED" });
  }

  return (
    <div className="space-y-5">
      <form onSubmit={scheduleSession} className="bg-white border border-[#E7DFCC] rounded-sm p-5 grid md:grid-cols-4 gap-3 items-end">
        <select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}
          className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink bg-white">
          <option value="">Class…</option>
          {(courses || []).map((c) => <option key={c.id} value={c.id}>{c.subject?.name} — {c.class?.name}</option>)}
        </select>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Session title"
          className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
          className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        <button disabled={busy} className="flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold disabled:opacity-50">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <PlusCircle size={15} />}
          Schedule
        </button>
        {error && <p className="md:col-span-4 text-xs font-medium text-redpen">{error}</p>}
      </form>

      <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
        {sessions.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471] text-center">No live sessions scheduled yet.</p>}
        {sessions.map((s) => (
          <div key={s.id} className="px-5 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Video size={16} className={s.status === "LIVE" ? "text-redpen" : "text-[#8A8471]"} />
              <div>
                <p className="text-sm font-medium text-ink">{s.title}</p>
                <p className="text-xs text-[#8A8471]">
                  {s.course?.subject?.name} — {s.course?.class?.name} · {new Date(s.scheduledAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-semibold px-2 py-1 rounded-sm ${STATUS_STYLE[s.status]}`}>
                {s.status === "LIVE" && <Radio size={10} className="inline mr-1 -mt-0.5 animate-pulse" />}
                {s.status.charAt(0) + s.status.slice(1).toLowerCase()}
              </span>
              {s.status === "SCHEDULED" && (
                <>
                  <button onClick={() => startSession(s)} className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-ink text-paper text-xs font-semibold">
                    <Play size={12} /> Start
                  </button>
                  <button onClick={() => cancelSession(s)} aria-label="Cancel" className="text-[#8A8471] hover:text-redpen">
                    <XCircle size={16} />
                  </button>
                </>
              )}
              {s.status === "LIVE" && (
                <>
                  <button onClick={() => setInCall(s.roomName)} className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-marigold text-ink text-xs font-semibold">
                    <Video size={12} /> Rejoin
                  </button>
                  <button onClick={() => endSession(s)} className="flex items-center gap-1 px-3 py-1.5 rounded-sm border border-[#E7DFCC] text-graphite text-xs font-semibold hover:bg-paperDim">
                    <Square size={12} /> End
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {inCall && (
        <LiveVideoRoom
          roomName={inCall}
          displayName={`${user?.firstName || ""} ${user?.lastName || ""}`}
          onClose={() => setInCall(null)}
        />
      )}
    </div>
  );
}
