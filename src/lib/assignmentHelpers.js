// The real API returns Submission rows (with `.assignment` nested inside)
// for a student's "mine" feeds; the mock data is a flat assignment-shaped
// list. These read whichever shape is present so pages work in both
// live and demo mode without branching everywhere.

export function getTitle(item) { return item.assignment?.title ?? item.title; }

export function getClassLabel(item) {
  if (item.assignment?.course) return `${item.assignment.course.subject?.name} — ${item.assignment.course.class?.name}`;
  return item.cls;
}

export function getDue(item) {
  const d = item.assignment?.dueDate ?? item.due;
  if (!d) return "—";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? d : date.toLocaleDateString();
}

export function getAssignmentId(item) { return item.assignment?.id ?? item.id; }

export function isPending(item) { return (item.status || "").toUpperCase() === "PENDING"; }
