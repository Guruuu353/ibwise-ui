import { useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../ui/Logo";
import SearchModal from "../search/SearchModal";

// Every dropdown parent has its own `to` — clicking the label navigates to
// that section's landing page; hovering/clicking the chevron reveals the
// specific sub-pages within it. Both stay true at once, which is the
// behaviour asked for: the dropdown persists, but the parent is a real page.
const NAV = [
  { label: "Home", to: "/" },
  {
    label: "Academics",
    to: "/academics",
    items: [
      { to: "/academics/cbc", label: "IBWISE CBC Track", blurb: "Kenyan Competency-Based Curriculum" },
      { to: "/academics/cambridge", label: "Cambridge International", blurb: "Primary to A-Level" },
      { to: "/academics/diploma", label: "Diploma Programs", blurb: "Post-secondary, career-focused" },
    ],
  },
  {
    label: "Admissions",
    to: "/admissions",
    items: [
      { to: "/admissions", label: "How to Apply", blurb: "Requirements & placement" },
      { to: "/admissions#fees", label: "Fee Structure", blurb: "Indicative fees per track" },
      { to: "/admissions#booklet", label: "Admission Booklet", blurb: "Download the full prospectus" },
      { to: "/admissions#enroll", label: "Enroll Now", blurb: "Start your application" },
    ],
  },
  {
    label: "About",
    to: "/about",
    items: [
      { to: "/about", label: "Our School", blurb: "Mission, story & approach" },
      { to: "/about#mission", label: "Mission & Vision", blurb: "What we stand for" },
      { to: "/teachers", label: "Our Teachers", blurb: "Meet the teaching staff" },
    ],
  },
  {
    label: "School Life",
    to: "/school-life",
    items: [
      { to: "/school-life/activities", label: "Extracurricular Activities", blurb: "Clubs, sports & showcases" },
      { to: "/school-life/timetables", label: "Timetables", blurb: "Sample weekly structure" },
      { to: "/events", label: "Events", blurb: "What's coming up this term" },
    ],
  },
  { label: "News & Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

function Dropdown({ item }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  function show() { clearTimeout(timer.current); setOpen(true); }
  function hide() { timer.current = setTimeout(() => setOpen(false), 120); }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <div className="flex items-center gap-1 py-2">
        <Link to={item.to} className="text-sm font-medium text-ink hover:text-marigold transition-colors">
          {item.label}
        </Link>
        <button onClick={() => setOpen(!open)} aria-label={`Show ${item.label} submenu`} className="text-ink">
          <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full pt-2 w-72 z-50"
          >
            <div className="bg-white border border-[#E7DFCC] rounded-sm shadow-xl overflow-hidden">
              {item.items.map((sub) => (
                <Link
                  key={sub.label} to={sub.to} onClick={() => setOpen(false)}
                  className="block px-4 py-3 hover:bg-paperDim transition-colors border-b border-[#F1EBDA] last:border-0"
                >
                  <p className="text-sm font-semibold text-ink">{sub.label}</p>
                  <p className="text-xs text-[#8A8471] mt-0.5">{sub.blurb}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-[#E7DFCC]">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link to="/"><Logo /></Link>
        <nav className="hidden lg:flex items-center gap-6">
          {NAV.map((item) =>
            item.items ? (
              <Dropdown key={item.label} item={item} />
            ) : (
              <NavLink
                key={item.label} to={item.to}
                className={({ isActive }) => `text-sm font-medium hover:text-marigold transition-colors ${isActive ? "text-marigold" : "text-ink"}`}
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={() => setSearchOpen(true)} aria-label="Search the site" className="w-9 h-9 rounded-sm border border-[#E7DFCC] flex items-center justify-center hover:border-ink transition-colors">
            <Search size={16} className="text-ink" />
          </button>
          <button onClick={() => navigate("/login")} className="px-4 py-2 rounded-sm bg-ink text-paper text-sm font-semibold hover:bg-inkLight transition-colors">
            Log in
          </button>
        </div>
        <div className="lg:hidden flex items-center gap-2">
          <button onClick={() => setSearchOpen(true)} aria-label="Search the site"><Search size={20} /></button>
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden px-5 pb-4 flex flex-col gap-1 text-sm font-medium">
          {NAV.map((item) =>
            item.items ? (
              <div key={item.label}>
                <div className="w-full flex items-center justify-between py-2.5">
                  <Link to={item.to} onClick={() => setOpen(false)}>{item.label}</Link>
                  <button onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}>
                    <ChevronDown size={14} className={`transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {mobileExpanded === item.label && (
                  <div className="pl-4 pb-2 flex flex-col gap-2">
                    {item.items.map((sub) => (
                      <Link key={sub.label} to={sub.to} onClick={() => setOpen(false)} className="text-graphite py-1">{sub.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.label} to={item.to} onClick={() => setOpen(false)} className="py-2.5">{item.label}</Link>
            )
          )}
          <button onClick={() => { setOpen(false); navigate("/login"); }} className="mt-2 px-4 py-2 rounded-sm bg-ink text-paper text-sm font-semibold w-fit">
            Log in
          </button>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
