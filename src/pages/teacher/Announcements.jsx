import { Megaphone } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { ANNOUNCEMENTS } from "../../lib/mockData";

export default function TeacherAnnouncements() {
  const { data: announcements } = useApiData("/announcements/mine", ANNOUNCEMENTS);
  return (
    <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
      {announcements.map((a) => (
        <div key={a.id} className="px-5 py-4 flex items-start gap-3">
          <Megaphone size={15} className="text-marigold mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-ink">{a.title}</p>
            <p className="text-xs text-graphite mt-0.5">{a.body}</p>
            <p className="text-xs text-[#8A8471] mt-1">{a.createdAt?.slice(0, 10)}</p>
          </div>
        </div>
      ))}
      {announcements.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471]">No announcements right now.</p>}
    </div>
  );
}
