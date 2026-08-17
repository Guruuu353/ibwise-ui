import { useState } from "react";
import { Clock, UploadCloud, Loader2, Paperclip, X } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { ASSIGNMENTS } from "../../lib/mockData";
import StatusBadge from "../../components/ui/StatusBadge";
import { api } from "../../lib/api";

import { getTitle, getClassLabel, getDue, getAssignmentId, isPending } from "../../lib/assignmentHelpers";

function SubmitForm({ item, isMock, onSubmitted }) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  function addFiles(e) {
    setFiles([...files, ...Array.from(e.target.files || [])].slice(0, 5));
  }
  function removeFile(i) { setFiles(files.filter((_, idx) => idx !== i)); }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (!isMock) {
        const fd = new FormData();
        fd.append("assignmentId", getAssignmentId(item));
        fd.append("content", content);
        files.forEach((f) => fd.append("files", f));
        await api.post("/submissions", fd);
      }
      onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-2 bg-paperDim rounded-sm p-3">
      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="Write your answer here…"
        className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink bg-white" />
      <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-[#C9C0A5] rounded-sm text-xs text-graphite cursor-pointer hover:border-ink transition-colors w-fit">
        <UploadCloud size={14} /> Attach files
        <input type="file" multiple className="hidden" onChange={addFiles} />
      </label>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f, i) => (
            <span key={i} className="flex items-center gap-1 text-xs bg-white border border-[#E7DFCC] rounded-sm px-2 py-1">
              <Paperclip size={11} /> {f.name}
              <button type="button" onClick={() => removeFile(i)} aria-label="Remove file"><X size={11} /></button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="text-xs font-medium text-redpen">{error}</p>}
      <button disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-ink text-paper text-xs font-semibold disabled:opacity-50">
        {busy ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
        {busy ? "Submitting…" : "Submit work"}
      </button>
    </form>
  );
}

export default function StudentAssignments() {
  const { data, isMock } = useApiData("/assignments/mine", ASSIGNMENTS);
  const [local, setLocal] = useState(null);
  const [openId, setOpenId] = useState(null);
  const assignments = local ?? data;

  function handleSubmitted(item) {
    setLocal(assignments.map((x) => x.id === item.id ? { ...x, status: "SUBMITTED", submittedAt: new Date().toISOString() } : x));
    setOpenId(null);
  }

  return (
    <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
      {assignments.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471] text-center">No assignments yet.</p>}
      {assignments.map((a) => (
        <div key={a.id} className="px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Clock size={15} className="text-[#8A8471]" />
              <div>
                <p className="font-medium text-sm text-ink">{getTitle(a)}</p>
                <p className="text-xs text-[#8A8471]">{getClassLabel(a)} · due {getDue(a)}</p>
                {a.grade && (
                  <p className="text-xs text-leaf font-medium mt-0.5">
                    Grade: {a.grade.score ?? a.grade}{a.grade.maxScore ? `/${a.grade.maxScore}` : ""}
                    {a.feedback?.[0]?.comment ? ` — “${a.feedback[0].comment}”` : ""}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={a.status} extra={typeof a.grade === "string" ? a.grade : undefined} />
              {isPending(a) && (
                <button onClick={() => setOpenId(openId === a.id ? null : a.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-ink text-paper text-xs font-semibold">
                  <UploadCloud size={13} /> {openId === a.id ? "Cancel" : "Submit work"}
                </button>
              )}
            </div>
          </div>
          {openId === a.id && <SubmitForm item={a} isMock={isMock} onSubmitted={() => handleSubmitted(a)} />}
        </div>
      ))}
    </div>
  );
}
