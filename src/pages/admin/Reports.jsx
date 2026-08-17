import { useState } from "react";
import { useApiData } from "../../hooks/useApiData";
import { REPORTS_SEED } from "../../lib/mockData";
import StatCard from "../../components/ui/StatCard";
import { Award, School, Wallet, ClipboardCheck, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { api } from "../../lib/api";

// type -> { label, description }. Matches the backend's REPORTS registry —
// keep this list in sync with backend/src/modules/reports/reports.service.js.
const REPORT_TYPES = [
  { type: "students", label: "Students Roster", description: "Every student, class, and status." },
  { type: "teachers", label: "Teachers & Assignments", description: "Staff list with the courses each one teaches." },
  { type: "attendance", label: "Attendance", description: "Attendance records across all classes." },
  { type: "grades", label: "Grades", description: "Every graded submission, school-wide." },
  { type: "fees", label: "Fees", description: "Invoices, balances, and payment status." },
];

function ReportCard({ type, label, description }) {
  const [downloading, setDownloading] = useState(null); // 'excel' | 'pdf' | null

  async function download(format) {
    setDownloading(format);
    try {
      const res = await api.get(`/reports/${type}`, { params: { format }, responseType: "blob" });
      const blob = res instanceof Blob ? res : new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-report.${format === "excel" ? "xlsx" : "pdf"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Couldn't generate that report right now. Please try again.");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="bg-white border border-[#E7DFCC] rounded-sm p-5 flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="text-xs text-graphite mt-0.5">{description}</p>
      </div>
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => download("excel")}
          disabled={downloading !== null}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium border border-[#E7DFCC] rounded-sm px-3 py-2 text-graphite hover:bg-paperDim transition-colors disabled:opacity-50"
        >
          {downloading === "excel" ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
          Excel
        </button>
        <button
          onClick={() => download("pdf")}
          disabled={downloading !== null}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium border border-[#E7DFCC] rounded-sm px-3 py-2 text-graphite hover:bg-paperDim transition-colors disabled:opacity-50"
        >
          {downloading === "pdf" ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
          PDF
        </button>
      </div>
    </div>
  );
}

export default function AdminReports() {
  const { data: r } = useApiData("/dashboard/reports", REPORTS_SEED);
  const totalInvoiced = r.invoicesByStatus?.reduce((sum, i) => sum + (i._sum?.amount || 0), 0) || 0;
  const totalOutstanding = r.invoicesByStatus?.reduce((sum, i) => sum + (i._sum?.balance || 0), 0) || 0;
  const totalAttendance = r.attendanceByStatus?.reduce((sum, a) => sum + a._count, 0) || 0;
  const presentCount = r.attendanceByStatus?.find((a) => a.status === "PRESENT")?._count || 0;

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Award} label="Average grade" value={r.averageGrade ? `${r.averageGrade}%` : "—"} tint="bg-[#E4EDE6] text-leaf" />
        <StatCard icon={ClipboardCheck} label="Submissions graded" value={r.gradedCount ?? 0} tint="bg-[#E3E7EE] text-ink" />
        <StatCard icon={Wallet} label="Fees invoiced" value={`KES ${totalInvoiced.toLocaleString()}`} tint="bg-[#EFE7D6] text-[#8A6A2B]" />
        <StatCard icon={School} label="Attendance rate" value={totalAttendance ? `${Math.round((presentCount / totalAttendance) * 100)}%` : "—"} tint="bg-[#F5E1DE] text-redpen" />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white border border-[#E7DFCC] rounded-sm p-5">
          <p className="text-sm font-semibold text-ink mb-4">Classes by curriculum</p>
          <div className="space-y-2">
            {r.classesByCurriculum?.map((c) => (
              <div key={c.curriculum} className="flex items-center justify-between text-sm">
                <span className="text-graphite">{c.curriculum}</span><span className="font-semibold">{c._count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#E7DFCC] rounded-sm p-5">
          <p className="text-sm font-semibold text-ink mb-4">Fee collection</p>
          <div className="space-y-2">
            {r.invoicesByStatus?.map((i) => (
              <div key={i.status} className="flex items-center justify-between text-sm">
                <span className="text-graphite">{i.status} ({i._count})</span><span className="font-semibold">KES {(i._sum?.amount || 0).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm pt-2 border-t border-paperDim">
              <span className="text-graphite">Outstanding balance</span><span className="font-semibold text-redpen">KES {totalOutstanding.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink mb-1">Compiled reports</p>
        <p className="text-xs text-graphite mb-4">Generated on the server and downloaded straight to your device.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_TYPES.map((rt) => (
            <ReportCard key={rt.type} {...rt} />
          ))}
        </div>
      </div>
    </div>
  );
}
