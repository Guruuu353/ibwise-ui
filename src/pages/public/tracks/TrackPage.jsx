import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { TRACKS } from "../../../lib/curriculum";
import { IMAGES } from "../../../lib/images";
import PageHeader from "../../../components/ui/PageHeader";
import WhyChooseUs from "../../../components/ui/WhyChooseUs";
import Reveal from "../../../components/ui/Reveal";

// One component, three routes (Cbc.jsx / Cambridge.jsx / Diploma.jsx each
// pass their `trackKey`) — keeps the three pages structurally identical
// (same header/levels/subjects/assessment/why-choose-us/enroll pattern)
// while still being genuinely separate routes, as requested, for easier
// per-track reading.
export default function TrackPage({ trackKey }) {
  const track = TRACKS.find((t) => t.key === trackKey);
  if (!track) return null;

  return (
    <>
      <PageHeader
        image={IMAGES.pageHeaders[trackKey]}
        eyebrow="Academics"
        title={track.name}
        subtitle={track.tagline}
      />

      <section className="max-w-5xl mx-auto px-5 py-16">
        <Reveal>
          <h2 className="text-2xl font-display font-semibold mb-6">Levels in this track</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {track.levels.map((l, i) => (
            <Reveal key={l.name} delay={i * 0.05}>
              <div className="rounded-sm border border-[#E7DFCC] bg-white p-5 h-full">
                <h3 className="font-semibold text-ink mb-1">{l.name}</h3>
                <p className="text-sm text-graphite">{l.range} · {l.ages}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {track.subjects?.length > 0 && (
          <div className="mb-14">
            <Reveal><h2 className="text-2xl font-display font-semibold mb-6">Subjects taught</h2></Reveal>
            <Reveal delay={0.05}>
              <div className="rounded-sm border border-[#E7DFCC] bg-white p-6">
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {track.subjects.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-graphite">
                      <CheckCircle2 size={15} className="text-leaf shrink-0 mt-0.5" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        )}

        {(track.assessment || track.entryRequirements) && (
          <div className="grid md:grid-cols-2 gap-5 mb-14">
            {track.assessment && (
              <Reveal>
                <div className="rounded-sm border border-[#E7DFCC] bg-white p-6 h-full">
                  <h3 className="font-semibold text-ink mb-2">How students are assessed</h3>
                  <p className="text-sm text-graphite">{track.assessment}</p>
                </div>
              </Reveal>
            )}
            {track.entryRequirements && (
              <Reveal delay={0.05}>
                <div className="rounded-sm border border-[#E7DFCC] bg-white p-6 h-full">
                  <h3 className="font-semibold text-ink mb-2">Entry requirements</h3>
                  <p className="text-sm text-graphite">{track.entryRequirements}</p>
                </div>
              </Reveal>
            )}
          </div>
        )}

        {track.highlights?.length > 0 && (
          <div className="grid md:grid-cols-2 gap-5 mb-14">
            {track.highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 0.05}>
                <div className="rounded-sm bg-paperDim border border-[#E7DFCC] p-6 h-full">
                  <h3 className="font-semibold text-ink mb-1.5">{h.title}</h3>
                  <p className="text-sm text-graphite">{h.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal>
          <div className="rounded-sm bg-paperDim border border-[#E7DFCC] p-8 flex flex-col md:flex-row items-center justify-between gap-5">
            <div>
              <h3 className="text-xl font-display font-semibold mb-1">Ready to enroll in {track.name}?</h3>
              <p className="text-sm text-graphite">Start with a placement assessment — our academic team will confirm the right level for your child.</p>
            </div>
            <Link to="/admissions#enroll" className="px-5 py-3 rounded-sm bg-marigold text-ink font-semibold text-sm whitespace-nowrap hover:bg-[#d38a2c] transition-colors">
              Enroll Now
            </Link>
          </div>
        </Reveal>
      </section>

      <WhyChooseUs />
    </>
  );
}
