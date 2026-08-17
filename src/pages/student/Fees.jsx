import { useState } from "react";
import { Wallet, CheckCircle2, Smartphone } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { INVOICES } from "../../lib/mockData";
import { api } from "../../lib/api";

export default function StudentFees() {
  const { data, isMock } = useApiData("/fees/invoices/mine", INVOICES);
  const [local, setLocal] = useState(null);
  const invoices = local ?? data;
  const [payingId, setPayingId] = useState(null);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null); // { invoiceId, message }

  async function pay(invoice) {
    setStatus(null);
    if (isMock) {
      // Demo fallback: simulate the STK push completing.
      setLocal(invoices.map((i) => i.id === invoice.id ? { ...i, balance: 0, status: "PAID" } : i));
      setStatus({ invoiceId: invoice.id, message: "Simulated payment complete — balance cleared (demo mode, no backend connected)." });
      setPayingId(null);
      return;
    }
    try {
      const result = await api.post("/fees/pay", { invoiceId: invoice.id, amount: invoice.balance, phone });
      setStatus({ invoiceId: invoice.id, message: result.simulated ? result.message : "STK push sent — check your phone to complete payment." });
    } catch (err) {
      setStatus({ invoiceId: invoice.id, message: err.message, error: true });
    }
    setPayingId(null);
  }

  return (
    <div className="space-y-4">
      {invoices.map((inv) => (
        <div key={inv.id} className="bg-white border border-[#E7DFCC] rounded-sm p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-paperDim flex items-center justify-center">
                <Wallet size={18} className="text-ink" />
              </div>
              <div>
                <p className="font-semibold text-sm text-ink">{inv.feeStructure?.class?.name} — {inv.feeStructure?.term}</p>
                <p className="text-xs text-[#8A8471]">Due {inv.dueDate?.slice?.(0, 10) || inv.dueDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-display font-semibold text-ink">KES {Number(inv.balance).toLocaleString()}</p>
              <p className={`text-xs font-semibold ${inv.status === "PAID" ? "text-leaf" : "text-redpen"}`}>{inv.status}</p>
            </div>
          </div>

          {inv.status !== "PAID" && (
            <div className="mt-4 pt-4 border-t border-[#F1EBDA]">
              {payingId === inv.id ? (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 border border-[#E7DFCC] rounded-sm px-3 py-2">
                    <Smartphone size={14} className="text-[#8A8471]" />
                    <input
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="07XX XXX XXX" className="text-sm outline-none w-32"
                    />
                  </div>
                  <button onClick={() => pay(inv)} className="px-4 py-2 rounded-sm bg-marigold text-ink text-xs font-semibold">
                    Send STK push
                  </button>
                  <button onClick={() => setPayingId(null)} className="text-xs text-[#8A8471]">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setPayingId(inv.id)} className="px-4 py-2 rounded-sm bg-ink text-paper text-xs font-semibold">
                  Pay with M-Pesa
                </button>
              )}
            </div>
          )}

          {status?.invoiceId === inv.id && (
            <div className={`mt-3 flex items-start gap-2 text-xs font-medium ${status.error ? "text-redpen" : "text-leaf"}`}>
              <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> {status.message}
            </div>
          )}
        </div>
      ))}
      {invoices.length === 0 && <p className="text-sm text-[#8A8471]">No invoices yet — nothing owing.</p>}
    </div>
  );
}
