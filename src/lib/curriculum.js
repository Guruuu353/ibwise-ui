// Static content for the Academics section — the three tracks IBWISE
// offers. This is marketing/informational content (not tied to live
// Class records), so it lives here rather than being fetched.

export const TRACKS = [
  {
    key: "cbc",
    name: "IBWISE CBC Track",
    tagline: "Kenya's Competency-Based Curriculum, taught with real feedback loops.",
    color: "leaf",
    levels: [
      { name: "Pre-Primary", range: "PP1 – PP2", ages: "Ages 4–5" },
      { name: "Lower Primary", range: "Grade 1 – 3", ages: "Ages 6–8" },
      { name: "Upper Primary", range: "Grade 4 – 6", ages: "Ages 9–11" },
      { name: "Junior Secondary", range: "Grade 7 – 9", ages: "Ages 12–14" },
    ],
    subjects: ["Mathematics", "English", "Kiswahili", "Integrated Science", "Social Studies", "Creative Arts", "Agriculture", "Pre-Technical Studies", "Religious Education"],
    assessment: "Competency-based continuous assessment (CBA) throughout the term, combined with end-of-term summative tasks — reported against specific learning outcomes rather than a single exam score.",
    entryRequirements: "Open enrollment at any level with a short placement check for learners transferring from another curriculum.",
    highlights: [
      { title: "Outcome-based reporting", body: "Progress reports track specific competencies, not just an overall grade — parents see exactly what's mastered and what needs support." },
      { title: "Local relevance", body: "Follows the Kenyan CBC syllabus and calendar, so transitions to national exams and other CBC schools are seamless." },
    ],
  },
  {
    key: "cambridge",
    name: "Cambridge International",
    tagline: "An internationally recognised pathway, taught locally.",
    color: "marigold",
    levels: [
      { name: "Cambridge Primary", range: "Year 1 – 6", ages: "Ages 5–11" },
      { name: "Cambridge Lower Secondary", range: "Year 7 – 9", ages: "Ages 11–14" },
      { name: "Cambridge IGCSE", range: "Year 10 – 11", ages: "Ages 14–16" },
      { name: "Cambridge AS & A-Level", range: "Year 12 – 13", ages: "Ages 16–18" },
    ],
    subjects: ["Mathematics", "English Language & Literature", "Sciences (Biology, Chemistry, Physics)", "Global Perspectives", "ICT", "Business Studies", "Economics", "Foreign Languages"],
    assessment: "Cambridge Checkpoint tests at Primary/Lower Secondary, moving to externally-marked IGCSE and AS/A-Level examinations — all graded on Cambridge's internationally recognised scale.",
    entryRequirements: "IGCSE entry typically requires completion of Cambridge Lower Secondary or an equivalent placement assessment; AS/A-Level requires IGCSE passes in the relevant subjects.",
    highlights: [
      { title: "Globally recognised", body: "Cambridge qualifications are accepted by universities and employers worldwide, without needing to relocate for an international curriculum." },
      { title: "Subject flexibility", body: "Students choose subject combinations at IGCSE and A-Level that match the university pathway they're aiming for." },
    ],
  },
  {
    key: "diploma",
    name: "Diploma Programs",
    tagline: "Applied, career-focused study for post-secondary learners.",
    color: "ink",
    levels: [
      { name: "Diploma in Business Management", range: "2 years", ages: "Post-secondary" },
      { name: "Diploma in ICT", range: "2 years", ages: "Post-secondary" },
      { name: "Diploma in Education", range: "2 years", ages: "Post-secondary" },
    ],
    subjects: ["Core modules vary by diploma — see individual program outlines", "Business: Accounting, Marketing, Entrepreneurship", "ICT: Networking, Programming, Systems Design", "Education: Pedagogy, Curriculum Design, Classroom Practice"],
    assessment: "A mix of coursework, practical projects, and end-of-year examinations per module, plus a final capstone project or attachment in the second year.",
    entryRequirements: "A completed IGCSE, A-Level, or KCSE certificate — our admissions team confirms eligibility per program during enrolment.",
    highlights: [
      { title: "Career-focused", body: "Every module is built around applied, workplace-ready skills rather than purely theoretical study." },
      { title: "Industry attachment", body: "Second-year students complete a supervised work placement relevant to their diploma track." },
    ],
  },
];

export const TESTIMONIALS = [
  { quote: "My son used to dread homework. Now he logs in on his own and shows me his grades before I even ask.", name: "Njeri W.", role: "Parent, Grade 7" },
  { quote: "The IGCSE track gave us the international recognition we wanted without relocating the whole family.", name: "Hassan A.", role: "Parent, Cambridge IGCSE" },
  { quote: "Teachers reply to submissions the same week, not the same term. That alone changed how my daughter works.", name: "Grace M.", role: "Parent, Diploma track" },
];

export const FAQS = [
  { q: "Can my child move between CBC and Cambridge tracks?", a: "Yes — our academic team runs a placement assessment and builds a short bridging plan so the transition doesn't cost a term." },
  { q: "How do I pay school fees?", a: "Fees are invoiced per term and payable via M-Pesa directly from the parent/student portal, or by bank transfer." },
  { q: "Is there a diploma-level entry requirement?", a: "Diploma programs require a completed IGCSE, A-Level, or KCSE certificate — our admissions team can confirm eligibility during enrolment." },
  { q: "How do teachers and parents communicate?", a: "Through in-portal messaging, termly progress reports, and scheduled parent-teacher meetings." },
];

export const STATS = [
  { value: 450, suffix: "+", label: "Students enrolled" },
  { value: 3, suffix: "", label: "Curricula offered" },
  { value: 92, suffix: "%", label: "Assignment feedback within 48h" },
  { value: 6, suffix: "", label: "Years running" },
];

export const WHY_CHOOSE_US = [
  { title: "Real, fast feedback", body: "Assignments get marked and returned within days, not terms — every track, every level." },
  { title: "A platform, not a promise", body: "Classes, grades, fees and messaging all live in one portal your family actually uses." },
  { title: "Room to move between tracks", body: "A placement assessment and short bridging plan make switching curricula straightforward, not disruptive." },
  { title: "Teachers who know your child's name", body: "Small class groups mean feedback is personal, not templated." },
];

export const MISSION_VISION = {
  mission: "To give every learner — whichever curriculum fits their family — a school experience built on fast, honest feedback and real teacher attention.",
  vision: "A learning community where CBC, Cambridge and Diploma students all have the same standard of support, regardless of which pathway they're on.",
  values: [
    { title: "Clarity", body: "Every student and parent should always know exactly where they stand — grades, fees, and feedback, without chasing anyone." },
    { title: "Belonging", body: "A safe, judgment-free space for learners moving between systems, cities, or curricula." },
    { title: "Rigor with flexibility", body: "High academic standards that still bend around a family's real circumstances." },
  ],
};

export const SOCIAL_LINKS = [
  { label: "YouTube", url: "https://youtube.com" },
  { label: "TikTok", url: "https://tiktok.com" },
  { label: "LinkedIn", url: "https://linkedin.com" },
  { label: "Instagram", url: "https://instagram.com" },
  { label: "Facebook", url: "https://facebook.com" },
  { label: "X", url: "https://x.com" },
];

export const ACTIVITIES = [
  { title: "STEM & Robotics Club", body: "Weekly hands-on building and coding sessions across all three tracks." },
  { title: "Debate & Public Speaking", body: "Termly inter-class debate competitions building confidence and argument." },
  { title: "Sports Day", body: "Athletics, football and netball — one big term-ending event for every learner." },
  { title: "Art & Talent Showcase", body: "A stage for music, art and performance outside the academic calendar." },
];

export const TIMETABLE_SAMPLE = {
  note: "Indicative weekly structure — actual timetables are issued per class at the start of each term via the portal.",
  days: [
    { day: "Monday", blocks: ["8:00 Mathematics", "9:30 English", "11:00 Science", "1:00 Elective"] },
    { day: "Tuesday", blocks: ["8:00 Science", "9:30 Social Studies", "11:00 Mathematics", "1:00 Sports"] },
    { day: "Wednesday", blocks: ["8:00 English", "9:30 Mathematics", "11:00 Elective", "1:00 Clubs"] },
  ],
};
