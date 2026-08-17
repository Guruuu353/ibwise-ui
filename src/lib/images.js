// Curated photography — real, freely-licensed education/school photos
// served from Unsplash's CDN (hotlinked by photo id, which is the
// standard, stable way to reference Unsplash images). Every component
// below just reads `src`, so swapping in IBWISE's own campus photography
// later is a one-line change per entry, nothing else.
const unsplash = (id, w = 1200, h = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

export const IMAGES = {
  // Top-of-homepage hero — full-bleed, auto-advancing, slow Ken Burns zoom.
  heroCarousel: [
    {
      src: unsplash("photo-1522202176988-66273c2fd55f", 1800, 1100),
      caption: "Small classes, real feedback",
      eyebrow: "Every learner is known by name",
    },
    {
      src: unsplash("photo-1509062522246-3755977927d7", 1800, 1100),
      caption: "Live, teacher-led lessons every weekday",
      eyebrow: "Teaching that never goes on autopilot",
    },
    {
      src: unsplash("photo-1532094349884-543bc11b234d", 1800, 1100),
      caption: "Hands-on science across every track",
      eyebrow: "Learning by doing, not just reading",
    },
    {
      src: unsplash("photo-1580582932707-520aed937b7b", 1800, 1100),
      caption: "CBC, Cambridge and Diploma — one community",
      eyebrow: "Three curricula, one family of learners",
    },
  ],
  pageHeaders: {
    academics: unsplash("photo-1580582932707-520aed937b7b", 1800, 600),
    cbc: unsplash("photo-1509062522246-3755977927d7", 1800, 600),
    cambridge: unsplash("photo-1523050854058-8df90110c9f1", 1800, 600),
    diploma: unsplash("photo-1523240795612-9a054b0db644", 1800, 600),
    admissions: unsplash("photo-1523580494863-6f3031224c94", 1800, 600),
    about: unsplash("photo-1580582932707-520aed937b7b", 1800, 600),
    teachers: unsplash("photo-1544717305-2782549b5136", 1800, 600),
    blog: unsplash("photo-1455390582262-044cdead277a", 1800, 600),
    events: unsplash("photo-1511578314322-379afb476865", 1800, 600),
    schoolLife: unsplash("photo-1526676037777-05a232554f77", 1800, 600),
    activities: unsplash("photo-1526676037777-05a232554f77", 1800, 600),
    timetables: unsplash("photo-1503676260728-1c00da094a0b", 1800, 600),
    contact: unsplash("photo-1497633762265-9d179a990aa6", 1800, 600),
    careers: unsplash("photo-1521737604893-d14cc237f11d", 1800, 600),
    policy: unsplash("photo-1481627834876-b7833e8f5570", 1800, 600),
    exams: unsplash("photo-1454165804606-c3d57bc86b40", 1800, 600),
    liveClasses: unsplash("photo-1588072432836-e10032774350", 1800, 600),
    courses: unsplash("photo-1501504905252-473c47e087f8", 1800, 600),
    certificates: unsplash("photo-1523240795612-9a054b0db644", 1800, 600),
    parents: unsplash("photo-1600880292203-757bb62b4baf", 1800, 600),
  },
  whyChooseUs: unsplash("photo-1571260899304-425eee4c7efc", 900, 1000),
  teacherPhoto: (name) => {
    // Deterministic pick across a small pool of real portrait photos so the
    // same teacher always gets the same face, without needing per-teacher
    // uploads yet.
    const pool = [
      "photo-1580489944761-15a19d654956",
      "photo-1544717305-2782549b5136",
      "photo-1573496359142-b8d87734a5a2",
      "photo-1568602471122-7832951cc4c5",
      "photo-1519085360753-af0119f7cbe7",
      "photo-1580894732444-8ecded7900cd",
    ];
    let hash = 0;
    for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    return unsplash(pool[hash % pool.length], 300, 300);
  },
  blogThumb: (slug) => {
    const pool = [
      "photo-1503676260728-1c00da094a0b",
      "photo-1524995997946-a1c2e315a42f",
      "photo-1427504494785-3a9ca7044f45",
      "photo-1509062522246-3755977927d7",
      "photo-1522202176988-66273c2fd55f",
    ];
    let hash = 0;
    for (const ch of slug) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    return unsplash(pool[hash % pool.length], 600, 380);
  },
  eventThumb: (slug) => {
    const pool = [
      "photo-1511578314322-379afb476865",
      "photo-1531482615713-2afd69097998",
      "photo-1526676037777-05a232554f77",
      "photo-1523580494863-6f3031224c94",
    ];
    let hash = 0;
    for (const ch of slug) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    return unsplash(pool[hash % pool.length], 600, 380);
  },
};
