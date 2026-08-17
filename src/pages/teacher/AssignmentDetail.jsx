import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Paperclip, UploadCloud, Loader2, CheckCircle2, ListChecks, PlusCircle, Trash2 } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { api, resolveFileUrl } from "../../lib/api";
import StatusBadge from "../../components/ui/StatusBadge";
import { ADMIN_ASSIGNMENTS, ADMIN_SUBMISSIONS } from "../../lib/mockData";

// Builds/edits the weighted-criteria rubric for this assignment. Saving
// replaces the whole criteria list — simplest correct behavior since an
// edited rubric invalidates any prior per-criterion scores anyway.
function RubricEditor({ assignmentId, rubric, isMock, onSaved, onClose }) {
  const [title, setTitle] = useState(rubric?.title || "Grading rubric");
  const [criteria, setCriteria] = useState(
    rubric?.criteria?.length ? rubric.criteria.map((c) => ({ ...c })) : [{ title: "", description: "", maxPoints: 10 }]
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  function updateCriterion(i, patch) {
    setCriteria(criteria.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }
  function addCriterion() { setCriteria([...criteria, { title: "", description: "", maxPoints: 10 }]); }
  function removeCriterion(i) { setCriteria(criteria.filter((_, idx) => idx !== i)); }

  async function save(e) {
    e.preventDefault();
    if (criteria.some((c) => !c.title.trim())) { setError("Every criterion needs a title."); return; }
    setError(null);
    setBusy(true);
    try {
      const payload = { title, criteria: criteria.map((c) => ({ ...c, maxPoints: Number(c.maxPoints) || 0 })) };
      let saved = { ...payload, criteria: payload.criteria.map((c, i) => ({ ...c, id: c.id || `rc${i}` })) };
      if (!isMock) saved = await api.put(`/rubrics/${assignmentId}`, payload);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const total = criteria.reduce((sum, c) => sum + (Number(c.maxPoints) || 0), 0);

  return (
    <form onSubmit={save} className="bg-paperDim rounded-sm p-4 space-y-3 mt-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Rubric title"
        className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink bg-white" />

      <div className="space-y-2">
        {criteria.map((c, i) => (
          <div key={i} className="bg-white border border-[#E7DFCC] rounded-sm p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input value={c.title} onChange={(e) => updateCriterion(i, { title: e.target.value })} placeholder="Criterion (e.g. Argument clarity)"
                className="flex-1 px-2 py-1.5 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
              <input type="number" min="1" value={c.maxPoints} onChange={(e) => updateCriterion(i, { maxPoints: e.target.value })}
                className="w-20 px-2 py-1.5 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" title="Max points" />
              <button type="button" onClick={() => removeCriterion(i)} aria-label="Remove criterion" className="text-[#8A8471] hover:text-redpen">
                <Trash2 size={14} />
              </button>
            </div>
            <input value={c.description || ""} onChange={(e) => updateCriterion(i, { description: e.target.value })} placeholder="What earns full marks here? (optional)"
              className="w-full px-2 py-1.5 border border-[#E7DFCC] rounded-sm text-xs outline-none focus:border-ink" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={addCriterion} className="flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-marigold transition-colors">
          <PlusCircle size={13} /> Add criterion
        </button>
        <p className="text-xs text-[#8A8471]">Total: {total} pts</p>
      </div>

      {error && <p className="text-xs font-medium text-redpen">{error}</p>}

      <div className="flex items-center gap-3">
        <button disabled={busy} className="px-4 py-2 rounded-sm bg-marigold text-ink text-xs font-semibold disabled:opacity-50">
          {busy ? "Saving…" : "Save rubric"}
        </button>
        <button type="button" onClick={onClose} className="text-xs font-semibold text-graphite hover:text-ink">Cancel</button>
      </div>
    </form>
  );
}

// One submission row: shows what the student turned in, and a live
// grade + feedback form. Grading posts immediately — no separate save step
// — and the row updates in place so the teacher sees it flip to Graded
// without leaving the page or reloading anything else. When the assignment
// has a rubric, grading happens per-criterion and the total is computed
// automatically instead of one holistic number.
function SubmissionRow({ submission, rubric, isMock, onGraded }) {
  const existingGrade = submission.grade;
  const [score, setScore] = useState(existingGrade?.score ?? "");
  const [maxScore, setMaxScore] = useState(existingGrade?.maxScore ?? 100);
  const [criterionPoints, setCriterionPoints] = useState(() => {
    const initial = {};
    (rubric?.criteria || []).forEach((c) => {
      const existing = existingGrade?.rubricScores?.find((rs) => rs.criterionId === c.id);
      initial[c.id] = existing ? existing.points : "";
    });
    return initial;
  });
  const [comment, setComment] = useState(submission.feedback?.[0]?.comment || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [justGraded, setJustGraded] = useState(false);

  const hasWork = submission.status !== "PENDING";
  const rubricTotal = rubric ? rubric.criteria.reduce((sum, c) => sum + (Number(criterionPoints[c.id]) || 0), 0) : null;
  const rubricMax = rubric ? rubric.criteria.reduce((sum, c) => sum + c.maxPoints, 0) : null;

  async function submitGrade(e) {
    e.preventDefault();
    setError(null);

    let payload = { submissionId: submission.id, comment };
    if (rubric) {
      const rubricScores = rubric.criteria.map((c) => ({ criterionId: c.id, points: Number(criterionPoints[c.id]) || 0 }));
      if (rubric.criteria.some((c) => criterionPoints[c.id] === "" || criterionPoints[c.id] === undefined)) {
        setError("Score every criterion before saving.");
        return;
      }
      payload = { ...payload, rubricScores };
    } else {
      if (score === "" || Number.isNaN(Number(score))) { setError("Enter a numeric score."); return; }
      payload = { ...payload, score: Number(score), maxScore: Number(maxScore) };
    }

    setBusy(true);
    try {
      let grade = rubric
        ? { score: rubricTotal, maxScore: rubricMax }
        : { score: Number(score), maxScore: Number(maxScore) };
      if (!isMock) grade = await api.post("/grades", payload);
      setJustGraded(true);
      onGraded(submission.id, grade);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const status = justGraded ? "GRADED" : submission.status;

  return (
    <div className="px-5 py-4 border-b border-paperDim last:border-b-0">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <p className="font-medium text-sm text-ink">
            {submission.student?.user?.firstName} {submission.student?.user?.lastName}
          </p>
          <p className="text-xs text-[#8A8471]">
            {submission.submittedAt ? `Submitted ${new Date(submission.submittedAt).toLocaleString()}` : "Not submitted yet"}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {submission.content && <p className="text-sm text-graphite bg-paperDim rounded-sm p-3 mb-2">{submission.content}</p>}

      {submission.files?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {submission.files.map((f) => (
            <a key={f.id} href={resolveFileUrl(f.url)} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-ink bg-paperDim rounded-sm px-2.5 py-1.5 hover:bg-[#EFE7D6] transition-colors">
              <Paperclip size={12} /> {f.filename}
            </a>
          ))}
        </div>
      )}

      {!hasWork ? (
        <p className="text-xs text-[#8A8471] italic">Waiting on the student — nothing to grade yet.</p>
      ) : rubric ? (
        <form onSubmit={submitGrade} className="mt-2 space-y-2">
          {rubric.criteria.map((c) => (
            <div key={c.id} className="flex items-center gap-2 bg-paperDim rounded-sm px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-ink">{c.title}</p>
                {c.description && <p className="text-[11px] text-[#8A8471]">{c.description}</p>}
              </div>
              <input type="number" min="0" max={c.maxPoints} value={criterionPoints[c.id] ?? ""}
                onChange={(e) => setCriterionPoints({ ...criterionPoints, [c.id]: e.target.value })}
                className="w-16 px-2 py-1 border border-[#E7DFCC] rounded-sm text-sm text-center outline-none focus:border-ink bg-white" />
              <span className="text-xs text-[#8A8471] shrink-0">/ {c.maxPoints}</span>
            </div>
          ))}
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex-1 min-w-[180px]">
              <label className="text-[10px] font-semibold text-graphite uppercase tracking-wide">Feedback</label>
              <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="A note for the student"
                className="mt-1 w-full px-2 py-1.5 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
            </div>
            <p className="text-xs font-semibold text-ink">Total: {rubricTotal}/{rubricMax}</p>
            <button disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-ink text-paper text-xs font-semibold disabled:opacity-50">
              {busy ? <Loader2 size={13} className="animate-spin" /> : justGraded ? <CheckCircle2 size={13} /> : null}
              {justGraded ? "Graded" : "Save grade"}
            </button>
          </div>
          {error && <p className="text-xs font-medium text-redpen">{error}</p>}
        </form>
      ) : (
        <form onSubmit={submitGrade} className="flex flex-wrap items-end gap-2 mt-2">
          <div>
            <label className="text-[10px] font-semibold text-graphite uppercase tracking-wide">Score</label>
            <input type="number" min="0" value={score} onChange={(e) => setScore(e.target.value)}
              className="mt-1 w-20 px-2 py-1.5 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-graphite uppercase tracking-wide">Out of</label>
            <input type="number" min="1" value={maxScore} onChange={(e) => setMaxScore(e.target.value)}
              className="mt-1 w-20 px-2 py-1.5 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="text-[10px] font-semibold text-graphite uppercase tracking-wide">Feedback</label>
            <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Nice work — a note for the student"
              className="mt-1 w-full px-2 py-1.5 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
          </div>
          <button disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-ink text-paper text-xs font-semibold disabled:opacity-50">
            {busy ? <Loader2 size={13} className="animate-spin" /> : justGraded ? <CheckCircle2 size={13} /> : null}
            {justGraded ? "Graded" : "Save grade"}
          </button>
          {error && <p className="w-full text-xs font-medium text-redpen">{error}</p>}
        </form>
      )}
    </div>
  );
}

function AttachmentUploader({ assignmentId, isMock, onAdded }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function upload() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      if (!isMock) {
        const fd = new FormData();
        fd.append("file", file);
        const attachment = await api.post(`/assignments/${assignmentId}/attachments`, fd);
        onAdded(attachment);
      } else {
        onAdded({ id: `att${Date.now()}`, filename: file.name, url: "#" });
      }
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-[#C9C0A5] rounded-sm text-xs text-graphite cursor-pointer hover:border-ink transition-colors">
        <UploadCloud size={14} /> {file ? file.name : "Attach a resource file"}
        <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </label>
      {file && (
        <button onClick={upload} disabled={busy} className="px-3 py-2 rounded-sm bg-marigold text-ink text-xs font-semibold disabled:opacity-50">
          {busy ? "Uploading…" : "Upload"}
        </button>
      )}
      {error && <p className="text-xs font-medium text-redpen">{error}</p>}
    </div>
  );
}

export default function TeacherAssignmentDetail() {
  const { id } = useParams();
  const mockAssignment = ADMIN_ASSIGNMENTS.find((a) => a.id === id) || ADMIN_ASSIGNMENTS[0];
  const { data: assignment, isMock } = useApiData(`/assignments/${id}`, mockAssignment, [id]);
  const { data: fetchedSubmissions, loading } = useApiData(`/submissions/assignment/${id}`, ADMIN_SUBMISSIONS, [id]);

  const [submissions, setSubmissions] = useState(null);
  const [attachments, setAttachments] = useState(null);
  const [rubric, setRubric] = useState(undefined); // undefined = use assignment.rubric, null = removed
  const [editingRubric, setEditingRubric] = useState(false);
  const list = submissions ?? fetchedSubmissions;
  const attachmentList = attachments ?? assignment.attachments ?? [];
  const effectiveRubric = rubric === undefined ? assignment.rubric : rubric;

  function handleGraded(submissionId, grade) {
    setSubmissions((list ?? fetchedSubmissions).map((s) =>
      s.id === submissionId ? { ...s, status: "GRADED", grade: { ...grade, rubricScores: s.grade?.rubricScores } } : s
    ));
  }

  const submittedCount = list.filter((s) => s.status !== "PENDING").length;

  return (
    <div className="space-y-5">
      <Link to="/teacher/assignments" className="inline-flex items-center gap-1.5 text-xs font-semibold text-graphite hover:text-ink">
        <ArrowLeft size={14} /> Back to assignments
      </Link>

      <div className="bg-white border border-[#E7DFCC] rounded-sm p-5">
        <p className="text-xs text-marigold font-semibold mb-1">
          {assignment.course?.subject?.name || assignment.cls} — {assignment.course?.class?.name || ""}
        </p>
        <h2 className="text-lg font-display font-semibold text-ink mb-2">{assignment.title}</h2>
        {assignment.description && <p className="text-sm text-graphite mb-2">{assignment.description}</p>}
        {assignment.instructions && (
          <div className="bg-paperDim rounded-sm p-3 text-sm text-graphite mb-3 whitespace-pre-wrap">{assignment.instructions}</div>
        )}
        <p className="text-xs text-[#8A8471] mb-3">
          Due {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : assignment.due} · {submittedCount}/{list.length} submitted
        </p>

        {attachmentList.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachmentList.map((a) => (
              <a key={a.id} href={resolveFileUrl(a.url)} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-ink bg-paperDim rounded-sm px-2.5 py-1.5 hover:bg-[#EFE7D6] transition-colors">
                <Paperclip size={12} /> {a.filename}
              </a>
            ))}
          </div>
        )}

        {assignment.id && (
          <AttachmentUploader
            assignmentId={assignment.id}
            isMock={isMock}
            onAdded={(a) => setAttachments([...(attachments ?? assignment.attachments ?? []), a])}
          />
        )}

        <div className="mt-4 pt-4 border-t border-paperDim">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-graphite uppercase tracking-wide flex items-center gap-1.5">
              <ListChecks size={13} /> Grading rubric
            </p>
            {!editingRubric && (
              <button onClick={() => setEditingRubric(true)} className="text-xs font-semibold text-ink hover:text-marigold transition-colors">
                {effectiveRubric ? "Edit rubric" : "Add a rubric"}
              </button>
            )}
          </div>
          {!editingRubric && effectiveRubric && (
            <div className="mt-2 space-y-1">
              {effectiveRubric.criteria.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs text-graphite">
                  <span>{c.title}</span><span className="text-[#8A8471]">{c.maxPoints} pts</span>
                </div>
              ))}
            </div>
          )}
          {!editingRubric && !effectiveRubric && (
            <p className="text-xs text-[#8A8471] mt-1">No rubric — grading uses a single overall score.</p>
          )}
          {editingRubric && (
            <RubricEditor
              assignmentId={assignment.id}
              rubric={effectiveRubric}
              isMock={isMock}
              onSaved={(saved) => setRubric(saved)}
              onClose={() => setEditingRubric(false)}
            />
          )}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink mb-3">Submissions</p>
        <div className="bg-white border border-[#E7DFCC] rounded-sm overflow-hidden">
          {loading && <p className="px-5 py-6 text-sm text-[#8A8471] text-center">Loading…</p>}
          {!loading && list.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471] text-center">No students enrolled in this class yet.</p>}
          {!loading && list.map((s) => (
            <SubmissionRow key={s.id} submission={s} rubric={effectiveRubric} isMock={isMock} onGraded={handleGraded} />
          ))}
        </div>
      </div>
    </div>
  );
}
