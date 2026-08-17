import { Users, GraduationCap, School, FileText } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { ADMIN_STATS } from "../../lib/mockData";
import StatCard from "../../components/ui/StatCard";
import Reveal from "../../components/ui/Reveal";

const ACTIVITY = [
  "Wanjiru Kamau published \u201cComprehension: The River\u201d",
  "Faith Njeri submitted Linear Equations — Worksheet 4",
  "Kiplangat Rono graded 18 Fractions Revision submissions",
  "New blog post awaiting approval: \u201cMeet the Grade 8 Science team\u201d",
];

export default function Overview() {
  const { data: stats } = useApiData("/dashboard/stats", ADMIN_STATS);

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Reveal><StatCard icon={Users} label="Students" value={stats.students} tint="bg-[#E4EDE6] text-leaf" /></Reveal>
        <Reveal delay={0.05}><StatCard icon={GraduationCap} label="Teachers" value={stats.teachers} tint="bg-[#EFE7D6] text-[#8A6A2B]" /></Reveal>
        <Reveal delay={0.1}><StatCard icon={School} label="Classes" value={stats.classes} tint="bg-[#E3E7EE] text-ink" /></Reveal>
        <Reveal delay={0.15}><StatCard icon={FileText} label="Open assignments" value={stats.openAssignments} tint="bg-[#F5E1DE] text-redpen" /></Reveal>
      </div>
      <Reveal delay={0.2}>
        <div className="bg-white border border-[#E7DFCC] rounded-sm">
          <div className="px-5 py-4 border-b border-[#E7DFCC] font-semibold text-sm text-ink">Recent activity</div>
          <div className="divide-y divide-paperDim">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="px-5 py-3 text-sm text-[#3f4c63] flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-marigold" /> {a}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
