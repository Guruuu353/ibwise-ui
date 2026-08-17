import { Users, ClipboardList, Newspaper, MessageCircleMore, Wallet, School as SchoolIcon } from "lucide-react";
import Reveal from "../../components/ui/Reveal";
import StatsStrip from "../../components/ui/StatsStrip";
import CurriculumTracks from "../../components/ui/CurriculumTracks";
import Testimonials from "../../components/ui/Testimonials";
import FaqAccordion from "../../components/ui/FaqAccordion";
import CtaBanner from "../../components/ui/CtaBanner";
import ImageCarousel from "../../components/ui/ImageCarousel";
import HeroCarousel from "../../components/ui/HeroCarousel";
import WelcomePopup from "../../components/ui/WelcomePopup";

const FEATURES = [
  { icon: Users, title: "Role-based portals", body: "Admins, teachers and students each get a dashboard built around what they actually do." },
  { icon: ClipboardList, title: "Real assignment workflow", body: "From publish to submission to grade — every step is tracked, not guessed at." },
  { icon: Newspaper, title: "A living school blog", body: "News, parenting tips and classroom updates, moderated before they go live." },
  { icon: Wallet, title: "Pay fees from the portal", body: "Termly invoices with M-Pesa payment, so balances never rely on a phone call." },
  { icon: MessageCircleMore, title: "Direct messaging", body: "Teachers, students and admin can message inside the platform — no separate app." },
  { icon: SchoolIcon, title: "Three curricula, one system", body: "CBC, Cambridge and Diploma learners all run through the same assignment and grading workflow." },
];

export default function Home() {
  return (
    <>
      <WelcomePopup />
      <HeroCarousel />

      <StatsStrip />

      <CurriculumTracks />

      <ImageCarousel />

      <section className="max-w-6xl mx-auto px-5 py-16">
        <Reveal><h2 className="text-3xl font-display font-semibold mb-10 max-w-lg">Why families trust IBWISE</h2></Reveal>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="border-t-2 border-ink pt-4 h-full">
                <f.icon size={20} className="text-marigold mb-3" />
                <h3 className="font-semibold text-[17px] mb-2 font-display">{f.title}</h3>
                <p className="text-graphite text-sm leading-relaxed">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Testimonials />
      <FaqAccordion />
      <CtaBanner />
    </>
  );
}
