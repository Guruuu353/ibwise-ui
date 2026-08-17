import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { SEARCH_INDEX } from "../../lib/siteSearch";

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) { setQuery(""); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return SEARCH_INDEX.slice(0, 8);
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter((r) => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  }, [query]);

  function go(path) {
    onClose();
    navigate(path);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-sm flex items-start justify-center pt-24 px-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-paper rounded-sm shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E7DFCC]">
              <Search size={18} className="text-[#8A8471]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, academics, admissions…"
                className="flex-1 bg-transparent outline-none text-sm text-ink"
              />
              <button onClick={onClose} aria-label="Close search"><X size={18} className="text-[#8A8471]" /></button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {results.length === 0 && <p className="px-4 py-6 text-sm text-[#8A8471] text-center">No matches for "{query}"</p>}
              {results.map((r) => (
                <button
                  key={r.path}
                  onClick={() => go(r.path)}
                  className="w-full text-left px-4 py-3 hover:bg-paperDim transition-colors flex items-center justify-between border-b border-[#F1EBDA] last:border-0"
                >
                  <span className="text-sm font-medium text-ink">{r.title}</span>
                  <span className="text-xs text-[#8A8471]">{r.category}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
