import { useApiData } from "../../hooks/useApiData";
import { ADMIN_GRADES } from "../../lib/mockData";

export default function AdminGrades() {
  const { data: grades } = useApiData("/grades", ADMIN_GRADES);
  return (
    <div className="bg-white border border-[#E7DFCC] rounded-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-paperDim text-left text-xs uppercase tracking-wide text-[#8A8471]">
          <tr><th className="px-5 py-3">Student</th><th className="px-5 py-3">Assignment</th><th className="px-5 py-3">Teacher</th><th className="px-5 py-3 text-right">Score</th></tr>
        </thead>
        <tbody className="divide-y divide-paperDim">
          {grades.map((g) => (
            <tr key={g.id}>
              <td className="px-5 py-3 font-medium">{g.submission?.student?.user?.firstName} {g.submission?.student?.user?.lastName}</td>
              <td className="px-5 py-3 text-graphite">{g.submission?.assignment?.title}</td>
              <td className="px-5 py-3 text-graphite">{g.teacher?.user?.firstName} {g.teacher?.user?.lastName}</td>
              <td className="px-5 py-3 text-right font-semibold text-ink">{g.score}/{g.maxScore} {g.letter && `(${g.letter})`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
