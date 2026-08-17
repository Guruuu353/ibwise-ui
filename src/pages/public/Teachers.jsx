import { TEACHERS } from "../../lib/mockData";
import { IMAGES } from "../../lib/images";
import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/ui/Reveal";

export default function Teachers() {
  return (
    <>
      <PageHeader image={IMAGES.pageHeaders.teachers} eyebrow="About" title="Our Teachers" subtitle="The people behind every assignment, every grade, every reply." />
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {TEACHERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <div className="text-center">
                <img
                  src={IMAGES.teacherPhoto(t.name)}
                  alt={t.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                  loading="lazy"
                />
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-graphite">{t.subject}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
