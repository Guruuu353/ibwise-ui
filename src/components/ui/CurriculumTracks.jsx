import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TRACKS } from "../../lib/curriculum";
import Reveal from "./Reveal";

const TINT = {
  leaf: "bg-[#E4EDE6] text-leaf border-leaf/20",
  marigold: "bg-[#FBEEDA] text-[#8A6A2B] border-marigold/30",
  ink: "bg-[#E3E7EE] text-ink border-ink/20",
};

export default function CurriculumTracks() {
  return (
    <section id="tracks" className="max-w-6xl mx-auto px-5 py-16">
      <Reveal>
        <p className="text-xs uppercase tracking-widest text-marigold font-mono mb-3">Three pathways, one platform</p>
        <h2 className="text-3xl md:text-4xl font-display font-semibold mb-10 max-w-xl">Choose the curriculum that fits your child.</h2>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-6">
        {TRACKS.map((t, i) => (
          <Reveal key={t.key} delay={i * 0.08}>
            <div className="border border-[#E7DFCC] rounded-sm p-6 h-full flex flex-col hover:shadow-stamp transition-shadow bg-white">
              <span className={`inline-block w-fit px-2.5 py-1 rounded-full text-[11px] font-semibold border mb-4 ${TINT[t.color]}`}>
                {t.levels.length} levels
              </span>
              <h3 className="text-xl font-display font-semibold mb-2">{t.name}</h3>
              <p className="text-sm text-graphite mb-5 flex-1">{t.tagline}</p>
              <ul className="text-xs text-[#8A8471] space-y-1.5 mb-5">
                {t.levels.slice(0, 3).map((l) => (
                  <li key={l.name}>• {l.name} <span className="text-[#B5AF9A]">({l.range})</span></li>
                ))}
                {t.levels.length > 3 && <li>+ {t.levels.length - 3} more</li>}
              </ul>
              <Link to={`/academics#${t.key}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-marigold transition-colors mt-auto">
                Explore {t.name.split(" ")[0]} <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
