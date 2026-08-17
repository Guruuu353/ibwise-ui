import { Link } from "react-router-dom";
import { ArrowRight, Users, Clock, Calendar as CalendarIcon } from "lucide-react";
import { IMAGES } from "../../lib/images";
import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/ui/Reveal";

const LINKS = [
  { to: "/school-life/activities", icon: Users, title: "Extracurricular Activities", body: "Clubs, sports and showcases across every track." },
  { to: "/school-life/timetables", icon: Clock, title: "Timetables", body: "See the shape of a typical learning week." },
  { to: "/events", icon: CalendarIcon, title: "Events", body: "What's coming up this term." },
];

export default function SchoolLife() {
  return (
    <>
      <PageHeader
        image={IMAGES.pageHeaders.schoolLife}
        eyebrow="School Life"
        title="Learning goes beyond the assignment list"
        subtitle="Clubs, timetables and events that make IBWISE a community, not just a portal."
      />
      <section className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-3 gap-6">
        {LINKS.map((l, i) => (
          <Reveal key={l.to} delay={i * 0.08}>
            <Link to={l.to} className="block border border-[#E7DFCC] rounded-sm p-6 h-full bg-white hover:shadow-stamp transition-shadow">
              <l.icon size={20} className="text-marigold mb-3" />
              <h2 className="font-semibold text-lg mb-2 font-display">{l.title}</h2>
              <p className="text-sm text-graphite mb-4">{l.body}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                Explore <ArrowRight size={14} />
              </span>
            </Link>
          </Reveal>
        ))}
      </section>
    </>
  );
}
