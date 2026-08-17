const NOTICES = [
  { t: "Term 2 revision timetable is now posted", d: "Aug 13" },
  { t: "Science Fair sign-ups close Friday", d: "Aug 12" },
];

export default function StudentAnnouncements() {
  return (
    <div className="space-y-3">
      {NOTICES.map((n, i) => (
        <div key={i} className="bg-white border border-[#E7DFCC] rounded-sm p-4 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">{n.t}</p>
          <span className="text-xs text-[#8A8471]">{n.d}</span>
        </div>
      ))}
    </div>
  );
}
