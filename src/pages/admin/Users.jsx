import { useState } from "react";
import { UserPlus, CheckCircle2, Clock, Pencil, UserX, X, BookOpen, Trash2 } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { TEACHERS, STUDENTS, PARENTS, PENDING_TEACHERS, CLASSES, SUBJECTS, COURSES } from "../../lib/mockData";
import SubTabs from "../../components/ui/SubTabs";
import { api } from "../../lib/api";
import Pagination, { paginate } from "../../components/ui/Pagination";
import { SkeletonRows } from "../../components/ui/Loaders";

const PAGE_SIZE = 8;

// Small centered modal shell — reused by the edit and assign dialogs below.
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-sm w-full max-w-md max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7DFCC]">
          <p className="text-sm font-semibold text-ink">{title}</p>
          <button onClick={onClose} aria-label="Close" className="text-graphite hover:text-ink">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// Shared shell for the three role tables below — handles the loading
// skeleton and pagination so each table only needs to describe its columns.
function PagedTable({ rows, loading, columns, empty }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = paginate(rows, page, PAGE_SIZE);

  if (loading) return <SkeletonRows rows={6} cols={columns.length} />;
  if (rows.length === 0) return <p className="text-sm text-[#8A8471] text-center py-10">{empty}</p>;

  return (
    <div>
      <table className="w-full text-sm">
        <thead className="bg-paperDim text-left text-xs uppercase tracking-wide text-[#8A8471]">
          <tr>{columns.map((c) => <th key={c.label} className="px-5 py-3">{c.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-paperDim">
          {visible.map((row, i) => (
            <tr key={row.id || i}>
              {columns.map((c, ci) => (
                <td key={c.label} className={`px-5 py-3 ${ci === 0 ? "font-medium text-ink" : "text-graphite"}`}>{c.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && <div className="py-4 border-t border-paperDim"><Pagination page={page} totalPages={totalPages} onChange={setPage} /></div>}
    </div>
  );
}

function PendingTeachers() {
  const { data, isMock } = useApiData("/users/teachers/pending", PENDING_TEACHERS);
  const [local, setLocal] = useState(null);
  const pending = local ?? data;

  async function approve(t) {
    if (!isMock) { try { await api.patch(`/users/teachers/${t.id}/approve`); } catch { /* fall through */ } }
    setLocal(pending.filter((p) => p.id !== t.id));
  }

  if (pending.length === 0) return null;

  return (
    <div className="bg-[#FBEEDA] border border-marigold/30 rounded-sm p-4 mb-5">
      <p className="text-xs font-semibold text-[#8A6A2B] mb-3 flex items-center gap-1.5"><Clock size={13} /> Awaiting approval</p>
      <div className="space-y-2">
        {pending.map((t) => (
          <div key={t.id} className="flex items-center justify-between bg-paper rounded-sm px-4 py-2.5">
            <div>
              <p className="text-sm font-medium text-ink">{t.user.firstName} {t.user.lastName}</p>
              <p className="text-xs text-[#8A8471]">{t.user.email} · {t.staffNo}</p>
            </div>
            <button onClick={() => approve(t)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-leaf text-white text-xs font-semibold">
              <CheckCircle2 size={13} /> Approve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddStudentForm({ onCreated }) {
  const { data: classes } = useApiData("/classes", CLASSES);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", classId: "" });
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    try {
      const created = await api.post("/users", { ...form, role: "STUDENT" });
      setStatus({
        ok: true,
        message: `Account created. Admission No: ${created.student?.admissionNo || "—"} · Login: ${form.email} / ${form.password}`,
      });
      setForm({ firstName: "", lastName: "", email: "", password: "", classId: "" });
      onCreated?.();
    } catch (err) {
      setStatus({ ok: false, message: err.message });
    }
  }

  return (
    <form onSubmit={submit} className="bg-white border border-[#E7DFCC] rounded-sm p-4 grid md:grid-cols-6 gap-3 items-end mb-5">
      <input required placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
      <input required placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
      <input required type="password" placeholder="Temp password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
      <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}
        className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink bg-white">
        <option value="">Class…</option>
        {(classes || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <button className="flex items-center gap-2 px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold"><UserPlus size={15} /> Add student</button>
      {status && <p className={`md:col-span-6 text-xs font-medium ${status.ok ? "text-leaf" : "text-redpen"}`}>{status.message}</p>}
    </form>
  );
}

function AddTeacherForm({ onCreated }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post("/users", { ...form, role: "TEACHER" });
      setStatus({ ok: true, message: "Teacher account created and approved." });
      setForm({ firstName: "", lastName: "", email: "", password: "" });
      onCreated?.();
    } catch (err) {
      setStatus({ ok: false, message: err.message });
    }
  }

  return (
    <form onSubmit={submit} className="bg-white border border-[#E7DFCC] rounded-sm p-4 grid md:grid-cols-5 gap-3 items-end mb-5">
      <input required placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
      <input required placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
      <input required type="password" placeholder="Temp password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
      <button className="flex items-center gap-2 px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold"><UserPlus size={15} /> Add teacher</button>
      {status && <p className={`md:col-span-5 text-xs font-medium ${status.ok ? "text-leaf" : "text-redpen"}`}>{status.message}</p>}
    </form>
  );
}

// Edit a user's core fields + active/inactive, and deactivate (soft delete)
// from the same dialog. Works for students, teachers, and parents alike —
// the User model fields are the same across roles.
function EditUserModal({ user, onClose, onSaved }) {
  const isStudent = user.role === "STUDENT" || Boolean(user.student);
  const { data: classes } = useApiData("/classes", CLASSES);
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    isActive: user.isActive ?? true,
    classId: user.student?.classId || user.student?.class?.id || "",
  });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.put(`/users/${user.id}`, form);
      setStatus({ ok: true, message: "Saved." });
      onSaved?.();
      onClose();
    } catch (err) {
      setStatus({ ok: false, message: err.message });
    } finally {
      setBusy(false);
    }
  }

  async function deactivate() {
    if (!confirm(`Deactivate ${form.firstName} ${form.lastName}? Their history is kept, but they won't be able to log in.`)) return;
    setBusy(true);
    try {
      await api.delete(`/users/${user.id}`);
      onSaved?.();
      onClose();
    } catch (err) {
      setStatus({ ok: false, message: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Edit user" onClose={onClose}>
      <form onSubmit={save} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
          <input required placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        </div>
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
        {isStudent && (
          <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}
            className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink bg-white">
            <option value="">Unassigned</option>
            {(classes || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
        <label className="flex items-center gap-2 text-sm text-graphite">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          Active (can log in)
        </label>

        {status && <p className={`text-xs font-medium ${status.ok ? "text-leaf" : "text-redpen"}`}>{status.message}</p>}

        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={deactivate} disabled={busy}
            className="flex items-center gap-1.5 text-xs font-semibold text-redpen hover:underline disabled:opacity-50">
            <UserX size={14} /> Deactivate account
          </button>
          <button disabled={busy} className="px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold disabled:opacity-50">
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Assign a teacher to a class + subject (creates a Course offering), shows
// their current assignments, and lets the admin unassign or reassign.
function AssignTeacherModal({ teacher, onClose }) {
  const { data: classes } = useApiData("/classes", CLASSES);
  const { data: subjects } = useApiData("/subjects", SUBJECTS);
  const teacherId = teacher.teacher?.id || teacher.id;
  const { data: allCourses, isMock } = useApiData(`/subjects/courses?teacherId=${teacherId}`, COURSES);
  const [form, setForm] = useState({ classId: "", subjectId: "" });
  const [status, setStatus] = useState(null);
  const [version, setVersion] = useState(0);

  const myCourses = (allCourses || []).filter((c) => (c.teacher?.id ? c.teacher.id === teacherId : true));

  async function assign(e) {
    e.preventDefault();
    try {
      await api.post("/subjects/courses", { ...form, teacherId });
      setStatus({ ok: true, message: "Assigned." });
      setForm({ classId: "", subjectId: "" });
      setVersion((v) => v + 1);
    } catch (err) {
      setStatus({ ok: false, message: err.message });
    }
  }

  async function unassign(courseId) {
    try {
      await api.delete(`/subjects/courses/${courseId}`);
      setVersion((v) => v + 1);
    } catch (err) {
      setStatus({ ok: false, message: err.message });
    }
  }

  return (
    <Modal title={`Assign — ${teacher.firstName} ${teacher.lastName}`} onClose={onClose}>
      <form onSubmit={assign} className="grid grid-cols-2 gap-3 mb-4">
        <select required value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}
          className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink bg-white">
          <option value="">Class…</option>
          {(classes || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select required value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
          className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink bg-white">
          <option value="">Subject…</option>
          {(subjects || []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button className="col-span-2 flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold">
          <BookOpen size={15} /> Assign to class
        </button>
      </form>

      {status && <p className={`text-xs font-medium mb-3 ${status.ok ? "text-leaf" : "text-redpen"}`}>{status.message}</p>}

      <p className="text-xs font-semibold text-[#8A8471] uppercase tracking-wide mb-2">Current assignments</p>
      <div className="space-y-2" key={version}>
        {myCourses.length === 0 && <p className="text-xs text-[#8A8471]">Not assigned to any class yet.</p>}
        {myCourses.map((c) => (
          <div key={c.id} className="flex items-center justify-between bg-paperDim rounded-sm px-3 py-2">
            <p className="text-sm text-ink">{c.subject?.name} — {c.class?.name}</p>
            {!isMock && (
              <button onClick={() => unassign(c.id)} aria-label="Unassign" className="text-graphite hover:text-redpen">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}

function StudentsTable() {
  const { data, loading } = useApiData("/users?role=STUDENT", STUDENTS);
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <>
      <AddStudentForm onCreated={() => setRefreshKey((k) => k + 1)} />
      <PagedTable
        key={refreshKey}
        rows={data}
        loading={loading}
        empty="No students yet."
        columns={[
          { label: "Name", render: (s) => (s.firstName ? `${s.firstName} ${s.lastName}` : s.name) },
          { label: "Class", render: (s) => s.student?.class?.name || s.cls || "Unassigned" },
          { label: "Status", render: (s) => (s.isActive === false ? "Inactive" : "Active") },
          {
            label: "",
            render: (s) => s.id && (
              <button onClick={() => setEditing(s)} className="flex items-center gap-1 text-xs font-semibold text-graphite hover:text-ink">
                <Pencil size={13} /> Edit
              </button>
            ),
          },
        ]}
      />
      {editing && (
        <EditUserModal user={editing} onClose={() => setEditing(null)} onSaved={() => setRefreshKey((k) => k + 1)} />
      )}
    </>
  );
}

function TeachersTable() {
  const { data, loading } = useApiData("/users?role=TEACHER", TEACHERS);
  const [editing, setEditing] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <>
      <AddTeacherForm onCreated={() => setRefreshKey((k) => k + 1)} />
      <PagedTable
        key={refreshKey}
        rows={data}
        loading={loading}
        empty="No teachers yet."
        columns={[
          { label: "Name", render: (t) => (t.firstName ? `${t.firstName} ${t.lastName}` : t.name) },
          { label: "Subject / Staff No", render: (t) => t.teacher?.staffNo || t.subject },
          { label: "Status", render: (t) => (t.isActive === false ? "Inactive" : "Active") },
          {
            label: "",
            render: (t) => t.id && (
              <div className="flex items-center gap-3">
                <button onClick={() => setAssigning(t)} className="flex items-center gap-1 text-xs font-semibold text-graphite hover:text-ink">
                  <BookOpen size={13} /> Assign
                </button>
                <button onClick={() => setEditing(t)} className="flex items-center gap-1 text-xs font-semibold text-graphite hover:text-ink">
                  <Pencil size={13} /> Edit
                </button>
              </div>
            ),
          },
        ]}
      />
      {editing && (
        <EditUserModal user={editing} onClose={() => setEditing(null)} onSaved={() => setRefreshKey((k) => k + 1)} />
      )}
      {assigning && <AssignTeacherModal teacher={assigning} onClose={() => setAssigning(null)} />}
    </>
  );
}

function ParentsTable() {
  const { data, loading } = useApiData("/users?role=PARENT", PARENTS);
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <>
      <PagedTable
        key={refreshKey}
        rows={data}
        loading={loading}
        empty="No parent accounts yet."
        columns={[
          { label: "Name", render: (p) => (p.firstName ? `${p.firstName} ${p.lastName}` : p.name) },
          { label: "Child(ren)", render: (p) => p.cls || "—" },
          {
            label: "",
            render: (p) => p.id && (
              <button onClick={() => setEditing(p)} className="flex items-center gap-1 text-xs font-semibold text-graphite hover:text-ink">
                <Pencil size={13} /> Edit
              </button>
            ),
          },
        ]}
      />
      {editing && (
        <EditUserModal user={editing} onClose={() => setEditing(null)} onSaved={() => setRefreshKey((k) => k + 1)} />
      )}
    </>
  );
}

export default function AdminUsers() {
  return (
    <div>
      <PendingTeachers />
      <SubTabs tabs={[{ key: "students", label: "Students" }, { key: "teachers", label: "Teachers" }, { key: "parents", label: "Parents" }]}>
        {(active) => (
          <div className="bg-white border border-[#E7DFCC] rounded-sm overflow-hidden">
            {active === "students" && <StudentsTable />}
            {active === "teachers" && <TeachersTable />}
            {active === "parents" && <ParentsTable />}
          </div>
        )}
      </SubTabs>
    </div>
  );
}
