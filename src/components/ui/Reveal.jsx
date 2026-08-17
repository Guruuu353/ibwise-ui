import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// Scroll-triggered fade/slide-up, used to give the public site a sense of
// arrival without scattering random effects everywhere. Respects
// prefers-reduced-motion by skipping the animation entirely.
export default function Reveal({ children, delay = 0, y = 16, className = "" }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
