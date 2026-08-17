import { useState } from "react";
import { Video, Radio, Clock } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { useAuth } from "../../context/AuthContext";
import LiveVideoRoom from "../../components/ui/LiveVideoRoom";

const MOCK_SESSIONS = [
  { id: "ls1", title: "Algebra live recap", status: "LIVE", scheduledAt: new Date().toISOString(), course: { subject: { name: "Mathematics" }, class: { name: "Grade 7" } }, roomName: "demo-room" },
];

export default function StudentLiveLessons() {
  const { user } = useAuth();
  const { data: sessions } = useApiData("/live-sessions/mine/joining", MOCK_SESSIONS);
  const [inCall, setInCall] = useState(null);

  const live = sessions.filter((s) => s.status === "LIVE");
  const upcoming = sessions.filter((s) => s.status === "SCHEDULED");

  return (
    <div className="space-y-8">
      {live.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-redpen uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Radio size={13} className="animate-pulse" /> Happening now
          </p>
          <div className="space-y-3">
            {live.map((s) => (
              <div key={s.id} className="bg-white border border-redpen/30 rounded-sm p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{s.title}</p>
                  <p className="text-xs text-[#8A8471]">{s.course?.subject?.name} — {s.course?.class?.name}</p>
                </div>
                <button onClick={() => setInCall(s)} className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-redpen text-white text-xs font-semibold">
                  <Video size={13} /> Join now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-graphite uppercase tracking-wide mb-3">Upcoming</p>
        <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
          {upcoming.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471] text-center">Nothing scheduled right now.</p>}
          {upcoming.map((s) => (
            <div key={s.id} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={15} className="text-[#8A8471]" />
                <div>
                  <p className="text-sm font-medium text-ink">{s.title}</p>
                  <p className="text-xs text-[#8A8471]">{s.course?.subject?.name} — {s.course?.class?.name}</p>
                </div>
              </div>
              <p className="text-xs text-[#8A8471]">{new Date(s.scheduledAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {inCall && (
        <LiveVideoRoom
          roomName={inCall.roomName}
          displayName={`${user?.firstName || ""} ${user?.lastName || ""}`}
          onClose={() => setInCall(null)}
        />
      )}
    </div>
  );
}
