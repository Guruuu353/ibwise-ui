import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white border border-[#E7DFCC] rounded-sm p-5 transition-shadow hover:shadow-md"
    >
      <div className={`w-9 h-9 rounded-sm flex items-center justify-center mb-3 ${tint}`}>
        <Icon size={16} />
      </div>
      <p className="text-2xl text-ink font-display font-semibold">{value}</p>
      <p className="text-xs text-[#8A8471] mt-1">{label}</p>
    </motion.div>
  );
}
