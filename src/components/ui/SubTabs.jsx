import { useState } from "react";

// Lightweight in-page tab switcher — used inside dashboard pages that have
// their own sub-sections (Users: Students/Teachers/Parents, Academics:
// Classes/Subjects/Courses) without adding more router routes than needed.
export default function SubTabs({ tabs, initial, children }) {
  const [active, setActive] = useState(initial || tabs[0]?.key);
  return (
    <div>
      <div className="flex items-center gap-1 mb-5 border-b border-[#E7DFCC]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              active === t.key ? "border-marigold text-ink" : "border-transparent text-[#8A8471] hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  );
}
