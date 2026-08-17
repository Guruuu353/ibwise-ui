import { motion } from "framer-motion";

// Banner used at the top of every inner page — consistent image + title
// treatment so navigating the site feels like one product, not a pile of
// differently-styled pages.
export default function PageHeader({ image, eyebrow, title, subtitle }) {
  return (
    <div className="relative h-64 md:h-80 overflow-hidden bg-ink">
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
      <div className="relative max-w-6xl mx-auto px-5 h-full flex flex-col justify-end pb-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {eyebrow && <p className="text-xs uppercase tracking-widest text-marigold font-mono mb-2">{eyebrow}</p>}
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-paper">{title}</h1>
          {subtitle && <p className="text-[#D9E0EC] text-sm mt-2 max-w-xl">{subtitle}</p>}
        </motion.div>
      </div>
    </div>
  );
}
