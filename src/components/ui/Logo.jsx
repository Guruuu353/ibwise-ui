import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function Logo({ dark }) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        whileHover={{ rotate: -6 }}
        className="w-8 h-8 rounded-sm bg-marigold flex items-center justify-center rotate-3"
      >
        <BookOpen size={16} className="text-ink" strokeWidth={2.5} />
      </motion.div>
      <span className={`text-lg tracking-tight font-display font-semibold ${dark ? "text-paper" : "text-ink"}`}>
        IBWISE
      </span>
    </div>
  );
}
