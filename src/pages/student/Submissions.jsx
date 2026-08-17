import { useApiData } from "../../hooks/useApiData";
import { ASSIGNMENTS } from "../../lib/mockData";
import StatusBadge from "../../components/ui/StatusBadge";
import { getTitle, getClassLabel, isPending } from "../../lib/assignmentHelpers";

// Same underlying feed as Assignments, filtered to what's already been
// turned in — what you sent and when, rather than what's still due.
export default function StudentSubmissions() {
  const { data } = useApiData("/assignments/mine", ASSIGNMENTS.filter((a) => a.status !== "Pending"));
  const submissions = data.filter((a) => !isPending(a));

  return (
    <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
      {submissions.map((a) => (
        <div key={a.id} className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink">{getTitle(a)}</p>
            <p className="text-xs text-[#8A8471]">{getClassLabel(a)}</p>
            {a.grade && (
              <p className="text-xs text-leaf font-medium mt-0.5">
                Grade: {a.grade.score ?? a.grade}{a.grade.maxScore ? `/${a.grade.maxScore}` : ""}
                {a.feedback?.[0]?.comment ? ` — “${a.feedback[0].comment}”` : ""}
              </p>
            )}
          </div>
          <StatusBadge status={a.status} extra={typeof a.grade === "string" ? a.grade : undefined} />
        </div>
      ))}
      {submissions.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471]">No submissions yet.</p>}
    </div>
  );
}
