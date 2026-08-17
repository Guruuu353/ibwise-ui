import { ChevronLeft, ChevronRight } from "lucide-react";

// Drop-in pagination bar. Fully controlled: caller owns `page` state and
// slices its own array — this component only renders the control and
// reports the page the user picked. Works the same for a public list
// (blog, events, courses) or an admin table.
export default function Pagination({ page, totalPages, onChange, className = "" }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const windowSize = 1;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= windowSize) pages.push(p);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <nav className={`flex items-center justify-center gap-1.5 ${className}`} aria-label="Pagination">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="w-9 h-9 rounded-sm border border-[#E7DFCC] flex items-center justify-center text-ink hover:border-ink transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-xs text-[#8A8471]">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`w-9 h-9 rounded-sm text-sm font-semibold transition-colors ${
              p === page ? "bg-ink text-paper" : "border border-[#E7DFCC] text-ink hover:border-ink"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className="w-9 h-9 rounded-sm border border-[#E7DFCC] flex items-center justify-center text-ink hover:border-ink transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

// Helper: slice an array for the current page.
export function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
