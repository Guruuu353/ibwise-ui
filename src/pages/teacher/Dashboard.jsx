import { School, ClipboardList, FileText } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import StatCard from "../../components/ui/StatCard";
import Reveal from "../../components/ui/Reveal";

const MOCK_STATS = { classCount: 3, assignmentCount: 8, ungraded: 4 };

export default function TeacherDashboard() {
  const { data: stats } = useApiData("/dashboard/stats", MOCK_STATS);
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <Reveal><StatCard icon={School} label="Classes taught" value={stats.classCount} tint="bg-[#E3E7EE] text-ink" /></Reveal>
      <Reveal delay={0.05}><StatCard icon={ClipboardList} label="Assignments published" value={stats.assignmentCount} tint="bg-[#EFE7D6] text-[#8A6A2B]" /></Reveal>
      <Reveal delay={0.1}><StatCard icon={FileText} label="Awaiting your grade" value={stats.ungraded} tint="bg-[#F5E1DE] text-redpen" /></Reveal>
    </div>
  );
}
