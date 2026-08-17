import { Calendar } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { EVENTS } from "../../lib/mockData";
import { IMAGES } from "../../lib/images";
import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/ui/Reveal";

function slugify(title) { return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40); }

export default function Events() {
  const { data: events } = useApiData("/events", EVENTS);

  return (
    <>
      <PageHeader image={IMAGES.pageHeaders.events} eyebrow="School Life" title="Upcoming events" subtitle="What's coming up this term, across every track." />
      <section className="max-w-5xl mx-auto px-5 py-16">
        <div className="grid md:grid-cols-2 gap-5">
          {events.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.06}>
              <div className="bg-white rounded-sm border border-[#E7DFCC] overflow-hidden flex">
                <img src={IMAGES.eventThumb(e.slug || slugify(e.title))} alt={e.title} className="w-32 shrink-0 object-cover" loading="lazy" />
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 text-leaf mb-2"><Calendar size={14} /><span className="text-xs font-semibold">{e.tag}</span></div>
                  <p className="font-semibold text-sm text-ink mb-1">{e.title}</p>
                  <p className="text-xs text-[#8A8471]">{e.date || e.startsAt?.slice(0, 10)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
