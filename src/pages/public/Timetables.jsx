import { TIMETABLE_SAMPLE } from "../../lib/curriculum";
import { IMAGES } from "../../lib/images";
import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/ui/Reveal";

export default function Timetables() {
  return (
    <>
      <PageHeader image={IMAGES.pageHeaders.timetables} eyebrow="School Life" title="Timetables" subtitle={TIMETABLE_SAMPLE.note} />
      <section className="max-w-5xl mx-auto px-5 py-16 grid md:grid-cols-3 gap-6">
        {TIMETABLE_SAMPLE.days.map((d, i) => (
          <Reveal key={d.day} delay={i * 0.08}>
            <div className="border border-[#E7DFCC] rounded-sm bg-white overflow-hidden h-full">
              <div className="bg-ink text-paper px-4 py-3 font-display font-semibold text-sm">{d.day}</div>
              <div className="divide-y divide-[#F1EBDA]">
                {d.blocks.map((b) => (
                  <div key={b} className="px-4 py-3 text-sm text-graphite">{b}</div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </section>
    </>
  );
}
