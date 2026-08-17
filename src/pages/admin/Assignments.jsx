import { useApiData } from "../../hooks/useApiData";
import { ADMIN_ASSIGNMENTS } from "../../lib/mockData";
import StatusBadge from "../../components/ui/StatusBadge";

export default function AdminAssignments() {
  const { data: assignments } = useApiData("/assignments/all", ADMIN_ASSIGNMENTS);
  return (
    <div className="bg-white border border-[#E7DFCC] rounded-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-paperDim text-left text-xs uppercase tracking-wide text-[#8A8471]">
          <tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Class</th><th className="px-5 py-3">Teacher</th><th className="px-5 py-3">Submissions</th><th className="px-5 py-3">Status</th></tr>
        </thead>
        <tbody className="divide-y divide-paperDim">
          {assignments.map((a) => (
            <tr key={a.id}>
              <td className="px-5 py-3 font-medium">{a.title}</td>
              <td className="px-5 py-3 text-graphite">{a.cls || a.course?.class?.name}</td>
              <td className="px-5 py-3 text-graphite">{a.teacher?.user ? `${a.teacher.user.firstName} ${a.teacher.user.lastName}` : "—"}</td>
              <td className="px-5 py-3">{a._count?.submissions ?? "—"}</td>
              <td className="px-5 py-3"><StatusBadge status={a.status || "Published"} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
