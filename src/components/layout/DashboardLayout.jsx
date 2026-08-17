import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Menu, X } from "lucide-react";
import Logo from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";

const NOTIFICATIONS_PATH = { ADMIN: "/admin/notifications", TEACHER: "/teacher/notifications", STUDENT: "/student/notifications" };
const PROFILE_PATH = { TEACHER: "/teacher/profile", STUDENT: "/student/profile" };

// One shell for all three roles — `tabs` is passed in per-role from each
// dashboard's route config (see routes/AppRouter.jsx), so adding a tab to
// one role never risks touching another.
//
// Below `lg`, the sidebar becomes an off-canvas drawer triggered by a
// hamburger in the topbar, closes on route change, and closes on backdrop
// tap — the desktop layout (fixed 240px rail) is untouched above `lg`.
export default function DashboardLayout({ role, tabs }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const roleLabel = { ADMIN: "Admin", TEACHER: "Teacher", STUDENT: "Student" }[role];

  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  // Lock background scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const SidebarContent = ({ onNavigate }) => (
    <>
      <div className="p-5 border-b border-inkLight flex items-center justify-between">
        <Logo dark />
        <button
          onClick={onNavigate}
          aria-label="Close menu"
          className="lg:hidden w-8 h-8 flex items-center justify-center text-paper/70 hover:text-paper"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-150 ${
                isActive ? "bg-marigold text-ink shadow-sm" : "text-[#B9C2D6] hover:bg-inkLight hover:text-paper"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-ink/40" />}
                <t.icon size={16} className="transition-transform duration-150 group-hover:scale-110" />
                {t.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-inkLight">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-[#B9C2D6] hover:bg-inkLight hover:text-paper transition-all duration-150">
          <LogOut size={16} /> Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen bg-[#F3EFE3] flex font-body overflow-hidden">
      {/* Desktop sidebar — fixed in place, full viewport height, own scroll if it ever overflows */}
      <aside className="hidden lg:flex w-60 bg-ink text-paper flex-col shrink-0 h-screen sticky top-0">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {/* Mobile off-canvas drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-ink/60 z-40 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-ink text-paper flex flex-col z-50 lg:hidden"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              role="dialog" aria-modal="true" aria-label={`${roleLabel} navigation`}
            >
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-8 py-4 sm:py-5 border-b border-[#E7DFCC] bg-paper shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="lg:hidden w-9 h-9 -ml-1 shrink-0 rounded-sm flex items-center justify-center text-ink hover:bg-paperDim transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-[#8A8471] uppercase tracking-widest font-mono">{roleLabel} Dashboard</p>
              <h1 className="text-base sm:text-xl text-ink font-display font-semibold truncate">
                {user?.firstName ? `Welcome, ${user.firstName}` : roleLabel}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to={NOTIFICATIONS_PATH[role]} aria-label="Notifications" className="transition-transform hover:scale-110">
              <Bell size={18} className="text-[#5B6472] hover:text-ink transition-colors" />
            </Link>
            {PROFILE_PATH[role] ? (
              <Link to={PROFILE_PATH[role]} className="w-9 h-9 rounded-full bg-[#E4EDE6] text-leaf flex items-center justify-center text-xs font-semibold ring-1 ring-leaf/20 hover:ring-leaf/40 transition-all">
                {roleLabel[0]}
              </Link>
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#E4EDE6] text-leaf flex items-center justify-center text-xs font-semibold ring-1 ring-leaf/20">
                {roleLabel[0]}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
