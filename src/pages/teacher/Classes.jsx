import { useState } from "react";
import { PlusCircle, FileText, Video, Link as LinkIcon, StickyNote, Trash2, UploadCloud, Loader2 } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { useAuth } from "../../context/AuthContext";
import { COURSES, LESSONS_SEED } from "../../lib/mockData";
import { api, resolveFileUrl } from "../../lib/api";

const TYPE_ICON = { NOTE: StickyNote, VIDEO: Video, FILE: FileText, LINK: LinkIcon };

function LessonsForCourse({ course, isMock }) {
  const seedForCourse = LESSONS_SEED.filter(
    (l) => l.course?.class?.name === course.class?.name && l.course?.subject?.name === course.subject?.name
  );
  const { data: fetched, loading } = useApiData(`/lessons?courseId=${course.id}`, seedForCourse, [course.id]);
  const [lessons, setLessons] = useState(null);
  const list = lessons ?? fetched;

  const [form, setForm] = useState({ title: "", contentType: "NOTE", body: "", url: "" });
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function addLesson(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setError(null);

    let url = form.url;
    // FILE and VIDEO content types can be an uploaded file instead of a
    // pasted link — upload it first via the shared media endpoint, then
    // use the resulting URL when creating the lesson.
    if ((form.contentType === "FILE" || form.contentType === "VIDEO") && file) {
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const media = await api.post("/media", fd);
        url = media.url;
      } catch (err) {
        setUploading(false);
        setError(err.message || "Upload failed.");
        return;
      }
      setUploading(false);
    }

    const payload = { ...form, url, courseId: course.id };
    let created = { id: `l${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
    if (!isMock) {
      try { created = await api.post("/lessons", payload); } catch (err) { setError(err.message); return; }
    }
    setLessons([created, ...list]);
    setForm({ title: "", contentType: "NOTE", body: "", url: "" });
    setFile(null);
    setOpen(false);
  }

  async function remove(id) {
    if (!isMock) {
      try { await api.delete(`/lessons/${id}`); } catch { /* still remove locally */ }
    }
    setLessons(list.filter((l) => l.id !== id));
  }

  return (
    <div className="mt-4 pt-4 border-t border-[#F1EBDA]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-graphite uppercase tracking-wide">Lessons & content</p>
        <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-marigold transition-colors">
          <PlusCircle size={13} /> Add content
        </button>
      </div>

      {open && (
        <form onSubmit={addLesson} className="bg-paperDim rounded-sm p-3 mb-3 space-y-2">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title"
            className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
          <select value={form.contentType} onChange={(e) => setForm({ ...form, contentType: e.target.value, url: "" })}
            className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink bg-white">
            <option value="NOTE">Note</option><option value="VIDEO">Video</option><option value="FILE">File</option><option value="LINK">Link</option>
          </select>

          {form.contentType === "NOTE" && (
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Write the note here…" rows={3}
              className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
          )}

          {form.contentType === "LINK" && (
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…"
              className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
          )}

          {(form.contentType === "FILE" || form.contentType === "VIDEO") && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-[#C9C0A5] rounded-sm text-sm text-graphite cursor-pointer hover:border-ink transition-colors">
                <UploadCloud size={15} />
                {file ? file.name : `Choose a ${form.contentType === "VIDEO" ? "video" : "file"} to upload…`}
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept={form.contentType === "VIDEO" ? "video/*" : undefined} />
              </label>
              <p className="text-[11px] text-[#8A8471]">Or paste a link instead:</p>
              <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…"
                className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
            </div>
          )}

          {error && <p className="text-xs font-medium text-redpen">{error}</p>}

          <button disabled={uploading} className="flex items-center gap-2 px-4 py-2 rounded-sm bg-marigold text-ink text-xs font-semibold disabled:opacity-50">
            {uploading && <Loader2 size={13} className="animate-spin" />}
            {uploading ? "Uploading…" : "Publish to class"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {loading && <p className="text-xs text-[#8A8471]">Loading…</p>}
        {!loading && list.map((l) => {
          const Icon = TYPE_ICON[l.contentType] || StickyNote;
          return (
            <div key={l.id} className="flex items-center justify-between bg-white border border-[#E7DFCC] rounded-sm px-3 py-2.5">
              <a
                href={l.url ? resolveFileUrl(l.url) : undefined}
                target={l.url ? "_blank" : undefined}
                rel="noreferrer"
                className={`flex items-center gap-2.5 ${l.url ? "hover:text-marigold" : ""}`}
              >
                <Icon size={14} className="text-marigold" />
                <span className="text-sm font-medium text-ink">{l.title}</span>
              </a>
              <button onClick={() => remove(l.id)} aria-label="Remove"><Trash2 size={13} className="text-[#8A8471] hover:text-redpen transition-colors" /></button>
            </div>
          );
        })}
        {!loading && list.length === 0 && <p className="text-xs text-[#8A8471]">No content published yet.</p>}
      </div>
    </div>
  );
}

export default function TeacherClasses() {
  const { user } = useAuth();
  const teacherId = user?.teacher?.id;
  const { data: courses, isMock } = useApiData(
    teacherId ? `/subjects/courses?teacherId=${teacherId}` : "/subjects/courses",
    COURSES
  );

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {courses.map((c) => (
        <div key={c.id} className="bg-white border border-[#E7DFCC] rounded-sm p-5">
          <p className="text-xs text-marigold font-semibold mb-2">{c.subject?.name}</p>
          <h3 className="font-semibold mb-1 font-display">{c.class?.name}</h3>
          <p className="text-sm text-[#8A8471]">{c.class?._count?.students ?? c.class?.students ?? 0} students</p>
          <LessonsForCourse course={c} isMock={isMock} />
        </div>
      ))}
      {courses.length === 0 && (
        <p className="text-sm text-[#8A8471] md:col-span-2 text-center py-10">
          You haven't been assigned to any classes yet — an admin can assign you from Admin → Users.
        </p>
      )}
    </div>
  );
}
