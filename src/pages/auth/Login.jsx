import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, GraduationCap, BookOpen, ChevronRight, AlertCircle } from "lucide-react";
import Logo from "../../components/ui/Logo";
import { useAuth } from "../../context/AuthContext";

const ROLES = [
  { key: "ADMIN", label: "Admin", icon: ShieldCheck, blurb: "Users, classes, content & settings" },
  { key: "TEACHER", label: "Teacher", icon: GraduationCap, blurb: "Classes, assignments & grading" },
  { key: "STUDENT", label: "Student", icon: BookOpen, blurb: "Assignments, submissions & grades" },
];

export default function Login() {
  const { login, previewRole } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      navigate(`/${user.role.toLowerCase()}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handlePreview(role) {
    previewRole(role);
    navigate(`/${role.toLowerCase()}`);
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-5 font-body">
      <div className="w-full max-w-md">
        <Link to="/" className="text-sm text-graphite mb-6 inline-block hover:text-ink">← Back to site</Link>
        <div className="mb-8"><Logo /></div>
        <h1 className="text-2xl mb-1 font-display font-semibold">Welcome back</h1>
        <p className="text-sm text-graphite mb-6">Sign in with your IBWISE account.</p>

        <form onSubmit={handleSubmit} className="space-y-3 mb-8">
          <input
            required type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-sm border border-[#E7DFCC] text-sm outline-none focus:border-ink"
          />
          <input
            required type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 rounded-sm border border-[#E7DFCC] text-sm outline-none focus:border-ink"
          />
          {error && (
            <div className="flex items-center gap-2 text-redpen text-xs font-medium">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <button disabled={submitting} className="w-full px-4 py-2.5 rounded-sm bg-ink text-paper text-sm font-semibold disabled:opacity-60">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-[#E7DFCC] flex-1" />
          <span className="text-xs text-[#8A8471]">or preview a dashboard</span>
          <div className="h-px bg-[#E7DFCC] flex-1" />
        </div>

        <div className="space-y-3">
          {ROLES.map((r) => (
            <motion.button
              key={r.key}
              whileHover={{ x: 3 }}
              onClick={() => handlePreview(r.key)}
              className="w-full flex items-center gap-4 p-4 rounded-sm border border-[#E7DFCC] bg-white hover:border-ink hover:shadow-stamp transition-all text-left"
            >
              <div className="w-10 h-10 rounded-sm bg-paperDim flex items-center justify-center shrink-0">
                <r.icon size={18} className="text-ink" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{r.label}</p>
                <p className="text-xs text-[#8A8471]">{r.blurb}</p>
              </div>
              <ChevronRight size={16} className="text-[#8A8471]" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
