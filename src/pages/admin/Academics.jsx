import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { CLASSES, SUBJECTS, COURSES } from "../../lib/mockData";
import SubTabs from "../../components/ui/SubTabs";
import { api } from "../../lib/api";

function ClassesTab() {
  const { data, isMock } = useApiData("/classes", CLASSES);
  const [local, setLocal] = useState(null);
  const classes = local ?? data;
  const [form, setForm] = useState({ name: "", curriculum: "CBC", levelName: "" });

  async function addClass(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (!isMock) { try { await api.post("/classes", form); } catch { /* fall through */ } }
    setLocal([{ id: `c${Date.now()}`, name: form.name, curriculum: form.curriculum, levelName: form.levelName, students: 0 }, ...classes]);
    setForm({ name: "", curriculum: "CBC", levelName: "" });
  }

  return (
    <div className="space-y-5">
      <form onSubmit={addClass} className="bg-white border border-[#E7DFCC] rounded-sm p-4 grid md:grid-cols-4 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-graphite">Class name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Grade 8"
            className="mt-1 w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        </div>
        <div>
          <label className="text-xs font-semibold text-graphite">Curriculum</label>
          <select value={form.curriculum} onChange={(e) => setForm({ ...form, curriculum: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink">
            <option value="CBC">CBC</option><option value="CAMBRIDGE">Cambridge</option><option value="DIPLOMA">Diploma</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold"><PlusCircle size={15} /> Add class</button>
      </form>
      <div className="bg-white border border-[#E7DFCC] rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paperDim text-left text-xs uppercase tracking-wide text-[#8A8471]">
            <tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Track</th><th className="px-5 py-3">Students</th></tr>
          </thead>
          <tbody className="divide-y divide-paperDim">
            {classes.map((c) => (
              <tr key={c.id}><td className="px-5 py-3 font-medium">{c.name}</td><td className="px-5 py-3 text-graphite">{c.curriculum}</td><td className="px-5 py-3">{c.students ?? c._count?.students ?? "—"}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubjectsTab() {
  const { data, isMock } = useApiData("/subjects", SUBJECTS);
  const [local, setLocal] = useState(null);
  const subjects = local ?? data;
  const [form, setForm] = useState({ name: "", code: "" });

  async function addSubject(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (!isMock) { try { await api.post("/subjects", form); } catch { /* fall through */ } }
    setLocal([{ id: `s${Date.now()}`, ...form }, ...subjects]);
    setForm({ name: "", code: "" });
  }

  return (
    <div className="space-y-5">
      <form onSubmit={addSubject} className="bg-white border border-[#E7DFCC] rounded-sm p-4 grid md:grid-cols-3 gap-3 items-end">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Subject name"
          className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Code e.g. MATH7"
          className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        <button className="flex items-center gap-2 px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold w-fit"><PlusCircle size={15} /> Add subject</button>
      </form>
      <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
        {subjects.map((s) => (
          <div key={s.id} className="px-5 py-3 flex items-center justify-between text-sm">
            <span className="font-medium">{s.name}</span><span className="text-graphite">{s.code}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoursesTab() {
  const { data } = useApiData("/subjects/courses", COURSES);
  return (
    <div className="bg-white border border-[#E7DFCC] rounded-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-paperDim text-left text-xs uppercase tracking-wide text-[#8A8471]">
          <tr><th className="px-5 py-3">Class</th><th className="px-5 py-3">Subject</th><th className="px-5 py-3">Teacher</th></tr>
        </thead>
        <tbody className="divide-y divide-paperDim">
          {data.map((c) => (
            <tr key={c.id}>
              <td className="px-5 py-3 font-medium">{c.class?.name}</td>
              <td className="px-5 py-3 text-graphite">{c.subject?.name}</td>
              <td className="px-5 py-3 text-graphite">{c.teacher?.user?.firstName} {c.teacher?.user?.lastName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminAcademics() {
  return (
    <SubTabs tabs={[{ key: "classes", label: "Classes" }, { key: "subjects", label: "Subjects" }, { key: "courses", label: "Courses" }]}>
      {(active) => active === "classes" ? <ClassesTab /> : active === "subjects" ? <SubjectsTab /> : <CoursesTab />}
    </SubTabs>
  );
}
