import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQS } from "../../lib/curriculum";
import Reveal from "./Reveal";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="max-w-3xl mx-auto px-5 py-16">
      <Reveal><h2 className="text-3xl font-display font-semibold mb-10">Frequently asked questions</h2></Reveal>
      <div className="space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = openIndex === i;
          return (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className="border border-[#E7DFCC] rounded-sm bg-white overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-semibold text-sm text-ink">{f.q}</span>
                  <ChevronDown size={16} className={`text-[#8A8471] transition-transform shrink-0 ml-3 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-graphite leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
