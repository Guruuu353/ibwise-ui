import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

// Counts up from 0 to `value` once the element scrolls into view. Runs
// once (viewport margin keeps it from re-triggering on scroll-back).
export default function CountUp({ value, suffix = "", duration = 1.2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start;
    let frame;
    function tick(ts) {
      if (start === undefined) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}{suffix}</span>;
}
