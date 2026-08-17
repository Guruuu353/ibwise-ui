import { ClipboardList, Star } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import StatCard from "../../components/ui/StatCard";
import Reveal from "../../components/ui/Reveal";

const MOCK_STATS = { pending: 2, graded: 6 };

export default function StudentDashboard() {
  const { data: stats } = useApiData("/dashboard/stats", MOCK_STATS);
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Reveal><StatCard icon={ClipboardList} label="Assignments pending" value={stats.pending} tint="bg-[#EFE7D6] text-[#8A6A2B]" /></Reveal>
      <Reveal delay={0.05}><StatCard icon={Star} label="Assignments graded" value={stats.graded} tint="bg-[#E4EDE6] text-leaf" /></Reveal>
    </div>
  );
}
