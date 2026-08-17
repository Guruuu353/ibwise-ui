import { useApiData } from "../../hooks/useApiData";
import { INVOICES } from "../../lib/mockData";

export default function AdminFees() {
  const { data: invoices } = useApiData("/fees/invoices", INVOICES.map((i) => ({ ...i, student: { user: { firstName: "Faith", lastName: "Njeri" } } })));

  return (
    <div className="bg-white border border-[#E7DFCC] rounded-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-paperDim text-left text-xs uppercase tracking-wide text-[#8A8471]">
          <tr>
            <th className="px-5 py-3">Student</th>
            <th className="px-5 py-3">Class / Term</th>
            <th className="px-5 py-3 text-right">Amount</th>
            <th className="px-5 py-3 text-right">Balance</th>
            <th className="px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-paperDim">
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td className="px-5 py-3 font-medium">{inv.student?.user?.firstName} {inv.student?.user?.lastName}</td>
              <td className="px-5 py-3 text-graphite">{inv.feeStructure?.class?.name} · {inv.feeStructure?.term}</td>
              <td className="px-5 py-3 text-right">KES {Number(inv.amount).toLocaleString()}</td>
              <td className="px-5 py-3 text-right font-semibold">{Number(inv.balance).toLocaleString()}</td>
              <td className="px-5 py-3">
                <span className={`text-xs font-semibold ${inv.status === "PAID" ? "text-leaf" : "text-redpen"}`}>{inv.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
