import { useApiData } from "../../hooks/useApiData";
import { ADMIN_GRADES } from "../../lib/mockData";

export default function StudentGrades() {
  const { data } = useApiData("/grades/mine", ADMIN_GRADES);
  const graded = Array.isArray(data) ? data : [];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {graded.length === 0 && <p className="text-sm text-[#8A8471]">Nothing graded yet.</p>}
      {graded.map((g) => {
        const assignment = g.submission?.assignment;
        const comment = g.submission?.feedback?.[0]?.comment;
        return (
          <div key={g.id} className="bg-white border border-[#E7DFCC] rounded-sm p-5">
            <div className="flex justify-between items-start mb-1">
              <div>
                <p className="font-semibold text-sm text-ink font-display">{assignment?.title}</p>
                {assignment?.course && (
                  <p className="text-xs text-[#8A8471] mt-0.5">{assignment.course.subject?.name} — {assignment.course.class?.name}</p>
                )}
              </div>
              <span className="text-lg font-bold text-redpen font-mono">
                {g.score}/{g.maxScore}{g.letter ? ` (${g.letter})` : ""}
              </span>
            </div>

            {g.rubricScores?.length > 0 && (
              <div className="mt-3 space-y-1.5 border-t border-paperDim pt-3">
                {g.rubricScores.map((rs) => (
                  <div key={rs.id} className="flex items-center justify-between text-xs">
                    <span className="text-graphite">{rs.criterion?.title}</span>
                    <span className="font-semibold text-ink">{rs.points}/{rs.criterion?.maxPoints}</span>
                  </div>
                ))}
              </div>
            )}

            {comment ? (
              <p className="text-sm text-graphite italic mt-2">"{comment}"</p>
            ) : (
              <p className="text-xs text-[#8A8471] mt-2">No written feedback on this one.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
