import { ACTIVITIES } from "../../lib/curriculum";
import { IMAGES } from "../../lib/images";
import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/ui/Reveal";

export default function Activities() {
  return (
    <>
      <PageHeader image={IMAGES.pageHeaders.activities} eyebrow="School Life" title="Extracurricular Activities" subtitle="Clubs, competitions and showcases open to every learner." />
      <section className="max-w-5xl mx-auto px-5 py-16 grid sm:grid-cols-2 gap-6">
        {ACTIVITIES.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.06}>
            <div className="border border-[#E7DFCC] rounded-sm p-6 h-full bg-white">
              <h2 className="font-semibold text-lg mb-2 font-display">{a.title}</h2>
              <p className="text-sm text-graphite">{a.body}</p>
            </div>
          </Reveal>
        ))}
      </section>
    </>
  );
}
