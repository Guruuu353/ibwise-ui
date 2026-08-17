import { useState } from "react";
import { FileText, Video, Link as LinkIcon, StickyNote, ChevronDown, ChevronUp } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { useAuth } from "../../context/AuthContext";
import { COURSES, LESSONS_SEED } from "../../lib/mockData";
import { resolveFileUrl } from "../../lib/api";

const TYPE_ICON = { NOTE: StickyNote, VIDEO: Video, FILE: FileText, LINK: LinkIcon };
const RECENT_COUNT = 6;

function LessonRow({ l }) {
  const Icon = TYPE_ICON[l.contentType] || StickyNote;
  return (
    <div className="px-5 py-3 flex items-center gap-3">
      <Icon size={14} className="text-marigold shrink-0" />
      <div className="min-w-0 flex-1">
        {l.url ? (
          <a href={resolveFileUrl(l.url)} target="_blank" rel="noreferrer" className="text-sm font-medium text-ink hover:text-marigold transition-colors">
            {l.title}
          </a>
        ) : (
          <p className="text-sm font-medium text-ink">{l.title}</p>
        )}
        {l.body && <p className="text-xs text-graphite mt-0.5">{l.body}</p>}
        <p className="text-xs text-[#8A8471] mt-0.5">{l.course?.subject?.name} · {l.course?.class?.name}</p>
      </div>
    </div>
  );
}

// A single class/course card — shows subject + teacher, and expands in place
// to show every piece of content the teacher has published for it, so it
// stays current the moment a teacher adds something new.
function CourseCard({ course, lessons }) {
  const [open, setOpen] = useState(false);
  const courseLessons = lessons.filter((l) => l.courseId === course.id || (l.course?.subject?.name === course.subject?.name && l.course?.class?.name === course.class?.name));

  return (
    <div className="bg-white border border-[#E7DFCC] rounded-sm overflow-hidden">
      <div className="p-5">
        <p className="text-xs text-marigold font-semibold mb-2">{course.subject?.name}</p>
        <h3 className="font-semibold font-display">{course.class?.name}</h3>
        {course.teacher?.user && (
          <p className="text-xs text-[#8A8471] mt-1">Taught by {course.teacher.user.firstName} {course.teacher.user.lastName}</p>
        )}
        <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-xs font-semibold text-ink hover:text-marigold transition-colors mt-3">
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {open ? "Hide content" : `View more (${courseLessons.length})`}
        </button>
      </div>
      {open && (
        <div className="border-t border-paperDim divide-y divide-paperDim">
          {courseLessons.length === 0 && <p className="px-5 py-4 text-sm text-[#8A8471]">Nothing published for this class yet.</p>}
          {courseLessons.map((l) => <LessonRow key={l.id} l={l} />)}
        </div>
      )}
    </div>
  );
}

export default function StudentClasses() {
  const { user } = useAuth();
  const classId = user?.student?.classId;
  const { data: courses } = useApiData(classId ? `/subjects/courses?classId=${classId}` : "/subjects/courses", COURSES);
  const { data: lessons } = useApiData("/lessons/mine", LESSONS_SEED);
  const recent = [...lessons].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, RECENT_COUNT);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {courses.map((c) => <CourseCard key={c.id} course={c} lessons={lessons} />)}
        {courses.length === 0 && (
          <p className="text-sm text-[#8A8471] md:col-span-3 text-center py-10">
            You're not assigned to a class yet — check with your school admin.
          </p>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-graphite uppercase tracking-wide mb-3">Recent class content</p>
        <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
          {recent.map((l) => <LessonRow key={l.id} l={l} />)}
          {recent.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471]">No class content published yet.</p>}
        </div>
      </div>
    </div>
  );
}
