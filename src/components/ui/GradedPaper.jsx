import { Check } from "lucide-react";
import { motion } from "framer-motion";

// The signature element — a "graded assignment" card, reused across the
// public hero and the student grades view so the metaphor stays consistent.
export default function GradedPaper({ className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`relative bg-[#FFFDF8] border border-[#E7DFCC] rounded-sm shadow-stamp p-5 w-64 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#8A8471] font-mono">Assignment</p>
          <p className="mt-1 text-[15px] text-ink font-display font-semibold">Linear Equations</p>
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: -8 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="w-10 h-10 rounded-full border-2 border-redpen text-redpen flex items-center justify-center text-xs font-bold font-mono"
        >
          A-
        </motion.div>
      </div>
      <div className="mt-4 space-y-1.5">
        {[100, 80, 60].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full bg-[#EFE9DA]" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-leaf text-xs font-semibold">
        <Check size={14} strokeWidth={3} /> Reviewed by Ms. Otieno
      </div>
    </motion.div>
  );
}
