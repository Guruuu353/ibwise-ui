// Static search index for the nav search popup. Small enough to keep as a
// plain array — if the site grows much past this, swap for a real search
// service (Algolia, Meilisearch) without changing the SearchModal component,
// which only needs { title, path, category } back.
export const SEARCH_INDEX = [
  { title: "Home", path: "/", category: "Pages" },
  { title: "IBWISE CBC Track", path: "/academics/cbc", category: "Academics" },
  { title: "Cambridge International", path: "/academics/cambridge", category: "Academics" },
  { title: "Diploma Programs", path: "/academics/diploma", category: "Academics" },
  { title: "Academics overview", path: "/academics", category: "Academics" },
  { title: "Admissions & How to Apply", path: "/admissions", category: "Admissions" },
  { title: "Fee Structure", path: "/admissions#fees", category: "Admissions" },
  { title: "Admission Booklet", path: "/admissions#booklet", category: "Admissions" },
  { title: "Enroll Now", path: "/admissions#enroll", category: "Admissions" },
  { title: "About Our School", path: "/about", category: "About" },
  { title: "Mission & Vision", path: "/about#mission", category: "About" },
  { title: "Our Teachers", path: "/teachers", category: "About" },
  { title: "Extracurricular Activities", path: "/school-life/activities", category: "School Life" },
  { title: "Timetables", path: "/school-life/timetables", category: "School Life" },
  { title: "Events", path: "/events", category: "School Life" },
  { title: "News & Blog", path: "/blog", category: "News" },
  { title: "Careers & Vacancies", path: "/careers", category: "Company" },
  { title: "Contact Us", path: "/contact", category: "Company" },
  { title: "Cookies Policy", path: "/cookies", category: "Legal" },
  { title: "Terms & Conditions", path: "/terms", category: "Legal" },
  { title: "Student / Parent / Teacher Login", path: "/login", category: "Portal" },
];
