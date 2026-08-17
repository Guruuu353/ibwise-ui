// Demo/offline data — used only when VITE_USE_MOCKS=true or when a live
// API call fails, so the UI is still click-through-able before the backend
// is deployed or reachable. Shapes mirror the real API responses so
// swapping to live data later is a no-op in the components.

export const CLASSES = [
  { id: "c1", name: "Grade 7 — Mathematics", students: 28, subject: "Mathematics" },
  { id: "c2", name: "Grade 8 — Integrated Science", students: 24, subject: "Science" },
  { id: "c3", name: "Grade 7 — English", students: 28, subject: "English" },
];

export const TEACHERS = [
  { name: "Achieng Otieno", subject: "Mathematics", initials: "AO" },
  { name: "Kiplangat Rono", subject: "Integrated Science", initials: "KR" },
  { name: "Wanjiru Kamau", subject: "English", initials: "WK" },
  { name: "Otieno Barasa", subject: "Kiswahili", initials: "OB" },
];

export const STUDENTS = [
  { name: "Faith Njeri", cls: "Grade 7 — Mathematics" },
  { name: "David Mwangi", cls: "Grade 7 — Mathematics" },
  { name: "Grace Wambui", cls: "Grade 8 — Integrated Science" },
  { name: "Brian Kiptoo", cls: "Grade 7 — English" },
];

export const BLOG_CATEGORIES = [
  { id: "cat1", name: "School News", slug: "school-news" },
  { id: "cat2", name: "Parenting", slug: "parenting" },
  { id: "cat3", name: "Teachers", slug: "teachers" },
];

export const BLOG_POSTS = [
  { slug: "five-ways-to-support-revision-at-home", title: "Five ways to support revision at home", category: "Parenting", status: "Published", date: "Aug 10", body: "Revision season doesn't have to be stressful. Here are five simple habits that help.\n\n## 1. A quiet, consistent spot\nSame time, same place, every day — it removes the friction of deciding when to start.\n\n## 2. Short, focused sessions\n25 minutes of focused work beats two hours of half-attention. Take real breaks in between.\n\n- Keep phones in another room\n- Use a timer\n- Reward the session, not just the result\n\nSmall, steady habits add up over a term." },
  { slug: "cbc-assessment-what-changed-this-term", title: "CBC assessment: what changed this term", category: "School News", status: "Published", date: "Aug 6", body: "This term brought a few updates to how CBC assessments are structured.\n\n## What's new\n1. Continuous assessment now counts for more of the final grade\n2. Practical components have clearer rubrics\n3. Parents get a mid-term summary, not just an end-of-term report\n\nWe'll keep this page updated as the Ministry issues further guidance." },
  { slug: "meet-the-grade-8-science-team", title: "Meet the Grade 8 Science team", category: "Teachers", status: "Pending review", date: "Aug 14", body: "A quick introduction to the team leading Grade 8 Science this year." },
];

export const EVENTS = [
  { title: "Parent–Teacher Meeting", date: "Aug 22", tag: "Term event" },
  { title: "Inter-class Science Fair", date: "Sep 4", tag: "Academics" },
];

export const ASSIGNMENTS = [
  { id: "a1", title: "Linear Equations — Worksheet 4", cls: "Grade 7 — Mathematics", due: "Aug 18", status: "Submitted" },
  { id: "a2", title: "States of Matter — Lab Report", cls: "Grade 8 — Integrated Science", due: "Aug 20", status: "Pending" },
  { id: "a3", title: "Comprehension: The River", cls: "Grade 7 — English", due: "Aug 15", status: "Late" },
  { id: "a4", title: "Fractions Revision Set", cls: "Grade 7 — Mathematics", due: "Aug 12", status: "Graded", grade: "88%" },
];

export const ADMIN_STATS = { students: 112, teachers: 9, classes: 6, openAssignments: 14, pendingBlog: 1 };

export const INVOICES = [
  { id: "inv1", feeStructure: { class: { name: "Grade 7", curriculum: "CBC" }, term: "Term 2 2026" }, amount: 15000, balance: 15000, status: "UNPAID", dueDate: "2026-09-01" },
];

export const CONVERSATIONS = [
  { id: "conv1", title: null, isGroup: false, participants: [{ userId: "demo" }, { userId: "t1" }], otherName: "Achieng Otieno (Teacher)", messages: [{ body: "Please remember to submit the worksheet by Friday.", createdAt: "2026-08-14T10:00:00Z" }] },
];

export const MESSAGES_SEED = [
  { id: "m1", senderId: "t1", body: "Hi Faith — how's the revision going?", createdAt: "2026-08-14T09:00:00Z" },
  { id: "m2", senderId: "demo", body: "Going well! Just finishing the last worksheet.", createdAt: "2026-08-14T09:05:00Z" },
  { id: "m3", senderId: "t1", body: "Please remember to submit the worksheet by Friday.", createdAt: "2026-08-14T10:00:00Z" },
];

export const PARENTS = [
  { name: "James Njeri", cls: "Faith Njeri (Grade 7)" },
  { name: "Mary Mwangi", cls: "David Mwangi (Grade 7)" },
];

export const PENDING_TEACHERS = [
  { id: "pt1", staffNo: "T-000002", user: { firstName: "Kiplangat", lastName: "Rono", email: "newteacher@ibwise.example" } },
];

export const SUBJECTS = [
  { id: "s1", name: "Mathematics", code: "MATH7" },
  { id: "s2", name: "Integrated Science", code: "SCI8" },
  { id: "s3", name: "English", code: "ENG7" },
];

export const COURSES = [
  { id: "co1", class: { name: "Grade 7" }, subject: { name: "Mathematics" }, teacher: { user: { firstName: "Achieng", lastName: "Otieno" } } },
];

export const ADMIN_ASSIGNMENTS = ASSIGNMENTS.map((a) => ({ ...a, teacher: { user: { firstName: "Achieng", lastName: "Otieno" } }, _count: { submissions: 12 } }));

export const ADMIN_SUBMISSIONS = [
  { id: "sub1", student: { user: { firstName: "Faith", lastName: "Njeri" } }, assignment: { title: "Linear Equations — Worksheet 4" }, status: "Submitted", grade: null },
  { id: "sub2", student: { user: { firstName: "David", lastName: "Mwangi" } }, assignment: { title: "Fractions Revision Set" }, status: "Graded", grade: { score: 88 } },
];

export const ADMIN_GRADES = [
  { id: "g1", teacher: { user: { firstName: "Achieng", lastName: "Otieno" } }, submission: { student: { user: { firstName: "David", lastName: "Mwangi" } }, assignment: { title: "Fractions Revision Set" } }, score: 88, maxScore: 100, letter: "A" },
];

export const ANNOUNCEMENTS = [
  { id: "an1", title: "Term 2 revision timetable is now posted", body: "Check the portal for your class schedule.", audience: "ALL", createdAt: "2026-08-13T08:00:00Z" },
  { id: "an2", title: "Science Fair sign-ups close Friday", body: "Speak to your class teacher to register.", audience: "STUDENT", createdAt: "2026-08-12T08:00:00Z" },
];

export const NOTIFICATIONS_SEED = [
  { id: "n1", type: "ASSIGNMENT_NEW", title: "New assignment: Linear Equations — Worksheet 4", read: false, createdAt: "2026-08-14T09:00:00Z" },
  { id: "n2", type: "ANNOUNCEMENT", title: "Term 2 revision timetable is now posted", read: true, createdAt: "2026-08-13T08:00:00Z" },
];

export const MEDIA_SEED = [
  { id: "md1", filename: "term2-timetable.pdf", mimeType: "application/pdf", size: 245000, uploadedBy: { firstName: "Admin", lastName: "User" }, createdAt: "2026-08-10T08:00:00Z" },
];

export const REPORTS_SEED = {
  averageGrade: 82,
  gradedCount: 46,
  invoicesByStatus: [{ status: "UNPAID", _count: 8, _sum: { amount: 120000, balance: 90000 } }, { status: "PAID", _count: 14, _sum: { amount: 210000, balance: 0 } }],
  attendanceByStatus: [{ status: "PRESENT", _count: 340 }, { status: "ABSENT", _count: 18 }, { status: "LATE", _count: 9 }],
  classesByCurriculum: [{ curriculum: "CBC", _count: 4 }, { curriculum: "CAMBRIDGE", _count: 1 }, { curriculum: "DIPLOMA", _count: 1 }],
  submissionsByStatus: [{ status: "GRADED", _count: 46 }, { status: "SUBMITTED", _count: 12 }, { status: "PENDING", _count: 8 }],
};

export const SETTINGS_SEED = {
  schoolName: "IBWISE Learning",
  contactEmail: "admissions@ibwise.example",
  contactPhone: "+254 757 279 330",
  blogModerationRequired: true,
};

export const LESSONS_SEED = [
  { id: "l1", title: "Introduction to Linear Equations", contentType: "NOTE", body: "Covers solving for x in single-variable equations.", course: { subject: { name: "Mathematics" }, class: { name: "Grade 7" } }, createdAt: "2026-08-10T08:00:00Z" },
];

export const ATTENDANCE_SEED = [
  { id: "att1", date: "2026-08-14", status: "PRESENT", course: { subject: { name: "Mathematics" }, class: { name: "Grade 7" } } },
  { id: "att2", date: "2026-08-13", status: "LATE", course: { subject: { name: "Mathematics" }, class: { name: "Grade 7" } } },
];

export const ATTENDANCE_SUMMARY = { total: 40, present: 37, rate: 93 };
