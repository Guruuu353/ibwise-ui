import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IMAGES } from "../../lib/images";
import Reveal from "./Reveal";

export default function ImageCarousel() {
  const slides = IMAGES.heroCarousel;
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <Reveal>
        <p className="text-xs uppercase tracking-widest text-marigold font-mono mb-3">Life at IBWISE</p>
        <h2 className="text-3xl font-display font-semibold mb-8">A look inside our classrooms</h2>
      </Reveal>
      <div className="relative rounded-sm overflow-hidden h-72 md:h-[420px] bg-ink">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={slides[index].src}
            alt={slides[index].caption}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            loading="lazy"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <p className="absolute bottom-5 left-6 text-paper font-display text-lg font-semibold max-w-sm">
          {slides[index].caption}
        </p>
        <button onClick={prev} aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-paper/90 flex items-center justify-center hover:bg-paper transition-colors">
          <ChevronLeft size={18} className="text-ink" />
        </button>
        <button onClick={next} aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-paper/90 flex items-center justify-center hover:bg-paper transition-colors">
          <ChevronRight size={18} className="text-ink" />
        </button>
        <div className="absolute bottom-5 right-6 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-marigold" : "w-1.5 bg-paper/60"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
