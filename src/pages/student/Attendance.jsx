import { CalendarCheck } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { ATTENDANCE_SEED, ATTENDANCE_SUMMARY } from "../../lib/mockData";
import StatCard from "../../components/ui/StatCard";

const STATUS_COLOR = { PRESENT: "text-leaf", ABSENT: "text-redpen", LATE: "text-[#8A6A2B]", EXCUSED: "text-ink" };

export default function StudentAttendance() {
  const { data: summary } = useApiData("/attendance/mine/summary", ATTENDANCE_SUMMARY);
  const { data: records } = useApiData("/attendance/mine", ATTENDANCE_SEED);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={CalendarCheck} label="Attendance rate" value={summary.rate ? `${summary.rate}%` : "—"} tint="bg-[#E4EDE6] text-leaf" />
        <StatCard icon={CalendarCheck} label="Days present" value={summary.present ?? 0} tint="bg-[#E3E7EE] text-ink" />
        <StatCard icon={CalendarCheck} label="Days recorded" value={summary.total ?? 0} tint="bg-[#EFE7D6] text-[#8A6A2B]" />
      </div>
      <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
        {records.map((r) => (
          <div key={r.id} className="px-5 py-3 flex items-center justify-between text-sm">
            <span className="text-graphite">{r.course?.subject?.name} · {r.course?.class?.name}</span>
            <span className="text-[#8A8471]">{r.date}</span>
            <span className={`font-semibold ${STATUS_COLOR[r.status]}`}>{r.status}</span>
          </div>
        ))}
        {records.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471]">No attendance recorded yet.</p>}
      </div>
    </div>
  );
}
