import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { School, ArrowRight, PlayCircle } from "lucide-react";
import { IMAGES } from "../../lib/images";
import Pill from "./Pill";

const AUTO_MS = 6000;

// Full-bleed hero: background photos cross-fade and slowly zoom (Ken Burns)
// while headline copy stays fixed on top, so the very first thing a visitor
// sees is real school life, not a static illustration.
export default function HeroCarousel() {
  const slides = IMAGES.heroCarousel;
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(next, AUTO_MS);
    return () => clearInterval(t);
  }, [next, reduce]);

  const active = slides[index];

  return (
    <section className="relative h-[560px] md:h-[680px] overflow-hidden bg-ink">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          <motion.img
            src={active.src}
            alt={active.caption}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: reduce ? 1 : 1.12 }}
            transition={{ duration: AUTO_MS / 1000 + 1, ease: "linear" }}
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>

      {/* Readability scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/10 to-transparent" />

      <div className="relative h-full max-w-6xl mx-auto px-5 flex flex-col justify-center">
        <div className="max-w-xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Pill className="bg-marigold/15 text-marigold border border-marigold/30 mb-5">
              <School size={13} /> CBC · Cambridge · Diploma — Kenya
            </Pill>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.p
              key={`eyebrow-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="text-marigold text-xs uppercase tracking-widest font-mono mb-3"
            >
              {active.eyebrow}
            </motion.p>
          </AnimatePresence>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-[38px] md:text-[54px] leading-[1.05] mb-5 font-display font-semibold text-paper"
          >
            Where every assignment gets a real reply.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-[#E9E4D5] text-[16px] leading-relaxed mb-8 max-w-md"
          >
            Classes, assignments, exams, fees and school life on one platform — across CBC,
            Cambridge and Diploma tracks. Built for teachers who mark, students who submit, and
            parents who want to know how it's going.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-marigold text-ink font-semibold text-sm hover:bg-[#d38a2c] transition-colors"
            >
              Enter the learning portal <ArrowRight size={16} />
            </Link>
            <Link
              to="/admissions#enroll"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-sm border border-paper/40 text-paper text-sm font-semibold hover:bg-paper hover:text-ink transition-colors backdrop-blur-sm"
            >
              <PlayCircle size={16} /> Start your application
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 right-6 md:right-12 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-marigold" : "w-1.5 bg-paper/50 hover:bg-paper/80"}`}
          />
        ))}
      </div>
    </section>
  );
}
