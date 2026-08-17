import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import { Mail, MapPin, Phone } from "lucide-react";
import { SOCIAL_LINKS } from "../../lib/curriculum";

const COLUMNS = [
  {
    title: "Academics",
    links: [
      { label: "IBWISE CBC Track", to: "/academics/cbc" },
      { label: "Cambridge International", to: "/academics/cambridge" },
      { label: "Diploma Programs", to: "/academics/diploma" },
    ],
  },
  {
    title: "Students & Parents",
    links: [
      { label: "Fee Structure", to: "/admissions#fees" },
      { label: "How to Apply", to: "/admissions" },
      { label: "Timetables", to: "/school-life/timetables" },
      { label: "Events", to: "/events" },
      { label: "News & Blog", to: "/blog" },
    ],
  },
  {
    title: "Portals",
    links: [
      { label: "Student / Parent Login", to: "/login" },
      { label: "Teacher Login", to: "/login" },
      { label: "Admin Login", to: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Our School", to: "/about" },
      { label: "Careers & Vacancies", to: "/careers" },
      { label: "Contact Us", to: "/contact" },
      { label: "Cookies Policy", to: "/cookies" },
      { label: "Terms & Conditions", to: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-1">
          <Logo dark />
          <p className="text-sm text-[#B9C2D6] mt-4 leading-relaxed max-w-xs">
            A CBC, Cambridge and Diploma learning community built around real feedback.
          </p>
          <div className="space-y-2 mt-5 text-sm text-[#B9C2D6]">
            <div className="flex items-center gap-2"><MapPin size={14} /> Nakuru, Kenya</div>
            <div className="flex items-center gap-2"><Mail size={14} /> admissions@ibwise.example</div>
            <div className="flex items-center gap-2"><Phone size={14} /> +254 757 279 330</div>
          </div>
          <div className="flex items-center gap-3 mt-5">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}
                className="w-8 h-8 rounded-full bg-inkLight flex items-center justify-center text-xs font-semibold hover:bg-marigold hover:text-ink transition-colors">
                {s.label[0]}
              </a>
            ))}
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-xs uppercase tracking-widest text-marigold font-mono mb-4">{col.title}</p>
            <ul className="space-y-2.5 text-sm text-[#B9C2D6]">
              {col.links.map((l) => (
                <li key={l.label}><Link to={l.to} className="hover:text-paper transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-inkLight px-5 py-5 text-center text-xs text-[#8492ad]">
        IBWISE Learning — built by Yobby Technologies. Not affiliated with or copying any referenced sample site.
      </div>
    </footer>
  );
}
