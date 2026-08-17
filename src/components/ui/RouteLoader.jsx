import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// A slim top progress bar that pulses briefly on every route change, so
// navigating between pages (especially data-heavy dashboard tabs) always
// gives immediate visual feedback instead of a blank beat.
export default function RouteLoader() {
  const location = useLocation();
  const [active, setActive] = useState(false);
  const timerRef = useRef(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    setActive(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActive(false), 450);
    return () => clearTimeout(timerRef.current);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-marigold origin-left"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, transition: { duration: 0.45, ease: "easeInOut" } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        />
      )}
    </AnimatePresence>
  );
}
