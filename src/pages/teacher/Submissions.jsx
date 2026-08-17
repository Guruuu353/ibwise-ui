import { Link } from "react-router-dom";
import { Paperclip, ChevronRight } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { useAuth } from "../../context/AuthContext";
import { ADMIN_ASSIGNMENTS } from "../../lib/mockData";

// A hub of the teacher's assignments with how much grading is left on each
// — clicking through opens the same assignment detail page where grading
// actually happens, so there's one grading flow, not two.
export default function TeacherSubmissions() {
  const { data, loading } = useApiData("/assignments/mine", ADMIN_ASSIGNMENTS);

  return (
    <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
      {loading && <p className="px-5 py-6 text-sm text-[#8A8471] text-center">Loading…</p>}
      {!loading && data.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471] text-center">No assignments published yet.</p>}
      {!loading && data.map((a) => (
        <Link
          key={a.id}
          to={a.id ? `/teacher/assignments/${a.id}` : "#"}
          className="px-5 py-4 flex items-center justify-between hover:bg-paperDim transition-colors"
        >
          <div className="flex items-center gap-3">
            <Paperclip size={15} className="text-[#8A8471]" />
            <div>
              <p className="font-medium text-sm text-ink">{a.title}</p>
              <p className="text-xs text-[#8A8471]">
                {a.course ? `${a.course.subject?.name} — ${a.course.class?.name}` : a.cls}
                {a._count ? ` · ${a._count.submissions} submissions` : ""}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#8A8471]" />
        </Link>
      ))}
    </div>
  );
}
