import { useApiData } from "../../hooks/useApiData";
import { ADMIN_SUBMISSIONS } from "../../lib/mockData";
import StatusBadge from "../../components/ui/StatusBadge";

export default function AdminSubmissions() {
  const { data: submissions } = useApiData("/submissions/all", ADMIN_SUBMISSIONS);
  return (
    <div className="bg-white border border-[#E7DFCC] rounded-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-paperDim text-left text-xs uppercase tracking-wide text-[#8A8471]">
          <tr><th className="px-5 py-3">Student</th><th className="px-5 py-3">Assignment</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Grade</th></tr>
        </thead>
        <tbody className="divide-y divide-paperDim">
          {submissions.map((s) => (
            <tr key={s.id}>
              <td className="px-5 py-3 font-medium">{s.student?.user?.firstName} {s.student?.user?.lastName}</td>
              <td className="px-5 py-3 text-graphite">{s.assignment?.title}</td>
              <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
              <td className="px-5 py-3">{s.grade?.score ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
