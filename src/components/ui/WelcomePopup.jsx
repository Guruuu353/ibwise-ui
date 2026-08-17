import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { IMAGES } from "../../lib/images";

const SESSION_KEY = "ibwise_welcome_dismissed";

// A single, gentle entrance popup — shows once per browser session, only on
// the homepage, after a short delay so it never blocks the first paint.
// Dismissing it (backdrop, X, or CTA) sets a session flag so it never nags
// on the same visit again.
export default function WelcomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => setOpen(true), 1600);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setOpen(false);
    sessionStorage.setItem(SESSION_KEY, "1");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-ink/60 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-paper rounded-sm overflow-hidden shadow-2xl"
            role="dialog" aria-modal="true" aria-label="Enrollment announcement"
          >
            <button
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-ink/50 text-paper flex items-center justify-center hover:bg-ink/70 transition-colors"
            >
              <X size={16} />
            </button>
            <div className="relative h-32">
              <img src={IMAGES.pageHeaders.admissions} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink to-ink/10" />
            </div>
            <div className="p-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-marigold uppercase tracking-widest font-mono mb-3">
                <Sparkles size={13} /> Enrolling now
              </span>
              <h3 className="text-2xl font-display font-semibold mb-2">Term 2 2026 applications are open</h3>
              <p className="text-sm text-graphite mb-6 leading-relaxed">
                Places across CBC, Cambridge and Diploma tracks are filling up. Start your child's
                application today and hear back within one working day.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/admissions#enroll"
                  onClick={dismiss}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-marigold text-ink font-semibold text-sm hover:bg-[#d38a2c] transition-colors"
                >
                  Start application <ArrowRight size={15} />
                </Link>
                <button onClick={dismiss} className="px-5 py-2.5 rounded-sm border border-[#E7DFCC] text-sm font-semibold text-graphite hover:bg-paperDim transition-colors">
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
