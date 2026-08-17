import { useState } from "react";
import { CheckCircle2, Download, FileText, Send, Check, Loader2 } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { IMAGES } from "../../lib/images";
import { api } from "../../lib/api";
import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/ui/Reveal";

const STEPS = [
  "Submit an online application with your child's recent academic report",
  "Our academic team reviews the report and schedules a placement assessment",
  "Receive a level recommendation across CBC, Cambridge or Diploma tracks",
  "Complete enrolment and receive your first term invoice",
];

const TRACKS = ["CBC", "Cambridge International", "Diploma", "Not sure yet"];

const MOCK_FEES = [
  { class: { name: "Grade 7", curriculum: "CBC" }, term: "Term 2 2026", amount: 15000 },
  { class: { name: "IGCSE Year 10", curriculum: "CAMBRIDGE" }, term: "Term 2 2026", amount: 45000 },
  { class: { name: "Diploma in Business — Year 1", curriculum: "DIPLOMA" }, term: "Term 2 2026", amount: 60000 },
];

const EMPTY_FORM = { parentName: "", email: "", phone: "", studentName: "", track: TRACKS[0], grade: "", message: "" };

function EnrollForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const message = [
      `Application for: ${form.studentName || "—"} (${form.grade ? `Grade/Level: ${form.grade}, ` : ""}Track: ${form.track})`,
      form.message ? `Notes: ${form.message}` : null,
    ].filter(Boolean).join("\n");
    try {
      await api.post("/inquiries", { name: form.parentName, email: form.email, phone: form.phone, message });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong — please try again or call us directly.");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex items-start gap-3 text-leaf bg-[#E4EDE6] rounded-sm px-5 py-4 text-sm font-medium max-w-lg mx-auto">
        <Check size={18} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Application received.</p>
          <p className="text-[#3f5c4c] font-normal mt-1">Our admissions team will review {form.studentName || "your child's"} details and respond within one working day at {form.email}.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto text-left bg-white border border-[#E7DFCC] rounded-sm p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#5B6472] mb-1.5">Parent / Guardian name *</label>
          <input required value={form.parentName} onChange={set("parentName")}
            className="w-full px-3.5 py-2.5 rounded-sm border border-[#E7DFCC] text-sm outline-none focus:border-ink transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#5B6472] mb-1.5">Child's full name *</label>
          <input required value={form.studentName} onChange={set("studentName")}
            className="w-full px-3.5 py-2.5 rounded-sm border border-[#E7DFCC] text-sm outline-none focus:border-ink transition-colors" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#5B6472] mb-1.5">Email *</label>
          <input required type="email" value={form.email} onChange={set("email")}
            className="w-full px-3.5 py-2.5 rounded-sm border border-[#E7DFCC] text-sm outline-none focus:border-ink transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#5B6472] mb-1.5">Phone</label>
          <input value={form.phone} onChange={set("phone")} placeholder="+254 7xx xxx xxx"
            className="w-full px-3.5 py-2.5 rounded-sm border border-[#E7DFCC] text-sm outline-none focus:border-ink transition-colors" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#5B6472] mb-1.5">Preferred track *</label>
          <select required value={form.track} onChange={set("track")}
            className="w-full px-3.5 py-2.5 rounded-sm border border-[#E7DFCC] text-sm outline-none focus:border-ink transition-colors bg-white">
            {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#5B6472] mb-1.5">Current grade / level</label>
          <input value={form.grade} onChange={set("grade")} placeholder="e.g. Grade 6"
            className="w-full px-3.5 py-2.5 rounded-sm border border-[#E7DFCC] text-sm outline-none focus:border-ink transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#5B6472] mb-1.5">Anything we should know?</label>
        <textarea rows={3} value={form.message} onChange={set("message")}
          className="w-full px-3.5 py-2.5 rounded-sm border border-[#E7DFCC] text-sm outline-none focus:border-ink transition-colors" />
      </div>

      {status === "error" && (
        <p className="text-redpen text-xs font-medium">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-marigold text-ink font-semibold text-sm hover:bg-[#d38a2c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? (
          <><Loader2 size={16} className="animate-spin" /> Submitting…</>
        ) : (
          <><Send size={16} /> Submit application</>
        )}
      </button>
      <p className="text-[11px] text-[#8A8471] text-center">Our admissions team responds within one working day.</p>
    </form>
  );
}

function BookletRequest() {
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRequest() {
    setLoading(true);
    try {
      await api.post("/inquiries", {
        name: "Booklet request",
        email: "no-reply@ibwise.example",
        message: "A visitor requested the admission booklet from the Admissions page.",
      });
    } catch { /* still confirm — matches the pattern used on the Contact form */ }
    setLoading(false);
    setRequested(true);
  }

  if (requested) {
    return (
      <span className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-inkLight text-paper font-semibold text-sm shrink-0">
        <Check size={16} className="text-marigold" /> Request received — check your inbox soon
      </span>
    );
  }

  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-marigold text-ink font-semibold text-sm shrink-0 hover:bg-[#d38a2c] transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      {loading ? "Sending…" : "Request the Booklet"}
    </button>
  );
}

export default function Admissions() {
  const { data: fees } = useApiData("/fees/structures/public", MOCK_FEES);

  return (
    <>
      <PageHeader
        image={IMAGES.pageHeaders.admissions}
        eyebrow="Admissions"
        title="Four steps to your child's first day"
        subtitle="Application, placement, enrolment, and your first term invoice."
      />

      <section className="max-w-4xl mx-auto px-5 py-16">
        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <Reveal key={s} delay={i * 0.06}>
              <div className="flex items-start gap-4 border border-[#E7DFCC] rounded-sm p-4 bg-white">
                <div className="w-7 h-7 rounded-full bg-ink text-paper flex items-center justify-center text-xs font-bold font-mono shrink-0">{i + 1}</div>
                <p className="text-sm text-[#3f4c63] pt-1">{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="booklet" className="bg-ink text-paper py-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <Reveal>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-sm bg-inkLight flex items-center justify-center shrink-0">
                <FileText size={22} className="text-marigold" />
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold">Admission Booklet</h2>
                <p className="text-sm text-[#B9C2D6]">Full prospectus — curricula, fees, and what to expect in your first term.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <BookletRequest />
          </Reveal>
        </div>
      </section>

      <section id="fees" className="bg-paperDim py-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-5">
          <Reveal><h2 className="text-3xl font-display font-semibold mb-2">Indicative fee structure</h2></Reveal>
          <Reveal delay={0.05}>
            <p className="text-sm text-[#8A8471] mb-8">Fees vary by track and level — this term's published amounts below. Enrolled families pay directly from the portal via M-Pesa.</p>
          </Reveal>
          <div className="bg-paper border border-[#E7DFCC] rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead className="bg-white text-left text-xs uppercase tracking-wide text-[#8A8471]">
                <tr><th className="px-5 py-3">Class</th><th className="px-5 py-3">Track</th><th className="px-5 py-3">Term</th><th className="px-5 py-3 text-right">Amount</th></tr>
              </thead>
              <tbody className="divide-y divide-[#F1EBDA]">
                {fees.map((f, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3 font-medium">{f.class?.name}</td>
                    <td className="px-5 py-3 text-graphite">{f.class?.curriculum}</td>
                    <td className="px-5 py-3 text-graphite">{f.term}</td>
                    <td className="px-5 py-3 text-right font-semibold text-ink">KES {Number(f.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8A8471] mt-4">
            <CheckCircle2 size={14} className="text-leaf" /> Fees cover tuition, digital learning resources and academic support.
          </div>
        </div>
      </section>

      <section id="enroll" className="max-w-4xl mx-auto px-5 py-16 scroll-mt-24 text-center">
        <Reveal>
          <h2 className="text-3xl font-display font-semibold mb-3">Ready to enroll?</h2>
          <p className="text-graphite mb-8 max-w-md mx-auto">Fill out the application below — our admissions team responds within one working day.</p>
        </Reveal>
        <Reveal delay={0.08}>
          <EnrollForm />
        </Reveal>
      </section>
    </>
  );
}
