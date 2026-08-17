import { Routes, Route } from "react-router-dom";
import {
  LayoutDashboard, Users, Newspaper, Calendar, School, ClipboardList, FileText, Star,
  MessageSquare, Wallet, MessageCircleMore, BookMarked, GraduationCap, Award, Megaphone,
  Image, Bell, BarChart3, Settings as SettingsIcon, User, CalendarCheck, Video,
} from "lucide-react";

import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Academics from "../pages/public/Academics";
import Cbc from "../pages/public/tracks/Cbc";
import Cambridge from "../pages/public/tracks/Cambridge";
import Diploma from "../pages/public/tracks/Diploma";
import Admissions from "../pages/public/Admissions";
import Teachers from "../pages/public/Teachers";
import Blog from "../pages/public/Blog";
import BlogPost from "../pages/public/BlogPost";
import Events from "../pages/public/Events";
import SchoolLife from "../pages/public/SchoolLife";
import Activities from "../pages/public/Activities";
import Timetables from "../pages/public/Timetables";
import Careers from "../pages/public/Careers";
import Cookies from "../pages/public/Cookies";
import Terms from "../pages/public/Terms";
import Contact from "../pages/public/Contact";
import Login from "../pages/auth/Login";

import AdminOverview from "../pages/admin/Overview";
import AdminUsers from "../pages/admin/Users";
import AdminAcademics from "../pages/admin/Academics";
import AdminAssignments from "../pages/admin/Assignments";
import AdminSubmissions from "../pages/admin/Submissions";
import AdminGrades from "../pages/admin/Grades";
import AdminContent from "../pages/admin/Content";
import AdminEvents from "../pages/admin/Events";
import AdminAnnouncements from "../pages/admin/Announcements";
import AdminFees from "../pages/admin/Fees";
import AdminMedia from "../pages/admin/Media";
import AdminNotifications from "../pages/admin/Notifications";
import AdminReports from "../pages/admin/Reports";
import AdminSettings from "../pages/admin/Settings";

import TeacherDashboard from "../pages/teacher/Dashboard";
import TeacherClasses from "../pages/teacher/Classes";
import TeacherAttendance from "../pages/teacher/Attendance";
import TeacherLiveLessons from "../pages/teacher/LiveLessons";
import TeacherAssignments from "../pages/teacher/Assignments";
import TeacherAssignmentDetail from "../pages/teacher/AssignmentDetail";
import TeacherSubmissions from "../pages/teacher/Submissions";
import TeacherGrades from "../pages/teacher/Grades";
import TeacherAnnouncements from "../pages/teacher/Announcements";
import TeacherBlog from "../pages/teacher/Blog";
import TeacherMessages from "../pages/teacher/Messages";
import TeacherNotifications from "../pages/teacher/Notifications";
import TeacherProfile from "../pages/teacher/Profile";

import StudentDashboard from "../pages/student/Dashboard";
import StudentClasses from "../pages/student/Classes";
import StudentLiveLessons from "../pages/student/LiveLessons";
import StudentAssignments from "../pages/student/Assignments";
import StudentSubmissions from "../pages/student/Submissions";
import StudentGrades from "../pages/student/Grades";
import StudentAnnouncements from "../pages/student/Announcements";
import StudentBlog from "../pages/student/Blog";
import StudentFees from "../pages/student/Fees";
import StudentMessages from "../pages/student/Messages";
import StudentNotifications from "../pages/student/Notifications";
import StudentProfile from "../pages/student/Profile";
import StudentAttendance from "../pages/student/Attendance";

const ADMIN_TABS = [
  { to: "/admin", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/academics", label: "Academics", icon: BookMarked },
  { to: "/admin/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/admin/submissions", label: "Submissions", icon: FileText },
  { to: "/admin/grades", label: "Grades", icon: GraduationCap },
  { to: "/admin/content", label: "Blog & Content", icon: Newspaper },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/events", label: "Events", icon: Calendar },
  { to: "/admin/fees", label: "Fees & Payments", icon: Wallet },
  { to: "/admin/media", label: "Media", icon: Image },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

const TEACHER_TABS = [
  { to: "/teacher", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/teacher/classes", label: "My Classes", icon: School },
  { to: "/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/teacher/live", label: "Live Lessons", icon: Video },
  { to: "/teacher/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/teacher/submissions", label: "Submissions", icon: FileText },
  { to: "/teacher/grades", label: "Grades", icon: Award },
  { to: "/teacher/announcements", label: "Announcements", icon: Megaphone },
  { to: "/teacher/blog", label: "Blog", icon: Newspaper },
  { to: "/teacher/messages", label: "Messages", icon: MessageCircleMore },
  { to: "/teacher/notifications", label: "Notifications", icon: Bell },
  { to: "/teacher/profile", label: "Profile", icon: User },
];

const STUDENT_TABS = [
  { to: "/student", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/classes", label: "My Classes", icon: School },
  { to: "/student/live", label: "Live Lessons", icon: Video },
  { to: "/student/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/student/submissions", label: "Submissions", icon: FileText },
  { to: "/student/grades", label: "Grades & Feedback", icon: Star },
  { to: "/student/announcements", label: "Announcements", icon: MessageSquare },
  { to: "/student/blog", label: "Blog", icon: Newspaper },
  { to: "/student/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/student/fees", label: "Fees & Payments", icon: Wallet },
  { to: "/student/messages", label: "Messages", icon: MessageCircleMore },
  { to: "/student/notifications", label: "Notifications", icon: Bell },
  { to: "/student/profile", label: "Profile", icon: User },
];

// One place to see the entire site map. Every dashboard branch is gated by
// ProtectedRoute so a direct URL visit without the right session/role
// redirects instead of rendering a half-populated page.
export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/academics/cbc" element={<Cbc />} />
        <Route path="/academics/cambridge" element={<Cambridge />} />
        <Route path="/academics/diploma" element={<Diploma />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/events" element={<Events />} />
        <Route path="/school-life" element={<SchoolLife />} />
        <Route path="/school-life/activities" element={<Activities />} />
        <Route path="/school-life/timetables" element={<Timetables />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route path="/admin" element={<DashboardLayout role="ADMIN" tabs={ADMIN_TABS} />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="academics" element={<AdminAcademics />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="grades" element={<AdminGrades />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="fees" element={<AdminFees />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="TEACHER" />}>
        <Route path="/teacher" element={<DashboardLayout role="TEACHER" tabs={TEACHER_TABS} />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="live" element={<TeacherLiveLessons />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="assignments/:id" element={<TeacherAssignmentDetail />} />
          <Route path="submissions" element={<TeacherSubmissions />} />
          <Route path="grades" element={<TeacherGrades />} />
          <Route path="announcements" element={<TeacherAnnouncements />} />
          <Route path="blog" element={<TeacherBlog />} />
          <Route path="messages" element={<TeacherMessages />} />
          <Route path="notifications" element={<TeacherNotifications />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="STUDENT" />}>
        <Route path="/student" element={<DashboardLayout role="STUDENT" tabs={STUDENT_TABS} />}>
          <Route index element={<StudentDashboard />} />
          <Route path="classes" element={<StudentClasses />} />
          <Route path="live" element={<StudentLiveLessons />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="submissions" element={<StudentSubmissions />} />
          <Route path="grades" element={<StudentGrades />} />
          <Route path="announcements" element={<StudentAnnouncements />} />
          <Route path="blog" element={<StudentBlog />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="messages" element={<StudentMessages />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Route>
    </Routes>
  );
}
