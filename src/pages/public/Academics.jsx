import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TRACKS } from "../../lib/curriculum";
import { IMAGES } from "../../lib/images";
import PageHeader from "../../components/ui/PageHeader";
import WhyChooseUs from "../../components/ui/WhyChooseUs";
import FaqAccordion from "../../components/ui/FaqAccordion";
import Reveal from "../../components/ui/Reveal";

const TINT = {
  leaf: "border-leaf/30 bg-[#E4EDE6]",
  marigold: "border-marigold/30 bg-[#FBEEDA]",
  ink: "border-ink/30 bg-[#E3E7EE]",
};

// Landing/overview page — each track has its own dedicated page (linked
// below) for the full level breakdown, since the request was to keep
// tracks separate rather than crammed into one long scroll. The comparison
// table below gives a quick side-by-side before a family commits to
// reading a full track page.
export default function Academics() {
  return (
    <>
      <PageHeader
        image={IMAGES.pageHeaders.academics}
        eyebrow="Academics"
        title="Three pathways, one platform"
        subtitle="CBC, Cambridge and Diploma — choose the track that fits your family, with room to move between them."
      />
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {TRACKS.map((t, i) => (
            <Reveal key={t.key} delay={i * 0.08}>
              <div className="border border-[#E7DFCC] rounded-sm p-6 h-full flex flex-col hover:shadow-stamp transition-shadow bg-white">
                <span className={`inline-block w-fit px-2.5 py-1 rounded-full text-[11px] font-semibold border mb-4 ${TINT[t.color]}`}>
                  {t.levels.length} levels
                </span>
                <h2 className="text-xl font-display font-semibold mb-2">{t.name}</h2>
                <p className="text-sm text-graphite mb-5 flex-1">{t.tagline}</p>
                <Link to={`/academics/${t.key}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-marigold transition-colors">
                  View full track <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-16">
        <Reveal><h2 className="text-2xl font-display font-semibold mb-6">Compare the tracks</h2></Reveal>
        <Reveal delay={0.05}>
          <div className="border border-[#E7DFCC] rounded-sm bg-white overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-paperDim text-left text-xs uppercase tracking-wide text-[#8A8471]">
                <tr>
                  <th className="px-5 py-3">Track</th>
                  <th className="px-5 py-3">Age range</th>
                  <th className="px-5 py-3">Assessment style</th>
                  <th className="px-5 py-3">Best fit for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paperDim">
                {TRACKS.map((t) => (
                  <tr key={t.key}>
                    <td className="px-5 py-4 font-semibold text-ink">{t.name}</td>
                    <td className="px-5 py-4 text-graphite">{t.levels[0].ages} – {t.levels[t.levels.length - 1].ages}</td>
                    <td className="px-5 py-4 text-graphite">{t.assessment ? t.assessment.split(".")[0] + "." : "—"}</td>
                    <td className="px-5 py-4 text-graphite">{t.tagline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      <FaqAccordion />
      <WhyChooseUs />
    </>
  );
}
