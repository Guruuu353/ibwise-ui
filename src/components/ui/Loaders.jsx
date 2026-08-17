import { Loader2 } from "lucide-react";

// Centered spinner for a section/panel that's fetching data.
export function Spinner({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 py-14 text-[#8A8471] ${className}`}>
      <Loader2 size={22} className="animate-spin text-marigold" />
      <span className="text-xs font-mono uppercase tracking-widest">{label}</span>
    </div>
  );
}

// Skeleton rows for table/list views while their first fetch resolves —
// avoids a layout jump between "empty" and "populated" states.
export function SkeletonRows({ rows = 5, cols = 4 }) {
  return (
    <div className="divide-y divide-[#F1EBDA]">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-5 py-3.5">
          {Array.from({ length: cols }).map((__, c) => (
            <div
              key={c}
              className="h-3.5 rounded-full bg-[#EDE6D4] animate-pulse"
              style={{ width: c === 0 ? "28%" : `${60 + ((r + c) % 3) * 10}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Skeleton for a grid of cards (blog, events, courses…).
export function SkeletonCards({ count = 6 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-sm overflow-hidden border border-[#E7DFCC] bg-white">
          <div className="h-40 bg-[#EDE6D4] animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-3.5 w-3/4 rounded-full bg-[#EDE6D4] animate-pulse" />
            <div className="h-3 w-1/2 rounded-full bg-[#EDE6D4] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
