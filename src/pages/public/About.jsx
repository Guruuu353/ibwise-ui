import { Target, Eye } from "lucide-react";
import { MISSION_VISION } from "../../lib/curriculum";
import { IMAGES } from "../../lib/images";
import PageHeader from "../../components/ui/PageHeader";
import WhyChooseUs from "../../components/ui/WhyChooseUs";
import Reveal from "../../components/ui/Reveal";

export default function About() {
  return (
    <>
      <PageHeader
        image={IMAGES.pageHeaders.about}
        eyebrow="About IBWISE"
        title="A school built around real feedback"
        subtitle="CBC, Cambridge and Diploma learners, one consistent standard of attention."
      />

      <section className="max-w-4xl mx-auto px-5 py-16">
        <Reveal>
          <p className="text-graphite text-[17px] leading-relaxed mb-4">
            IBWISE is a learning community built around one idea: every piece of work a student
            submits deserves a real, timely response. Our platform gives teachers the tools to
            publish assignments and give feedback without the paperwork, and gives students and
            parents a clear window into how learning is actually going — across CBC, Cambridge
            and Diploma tracks alike.
          </p>
        </Reveal>
      </section>

      <section id="mission" className="bg-paperDim py-16 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-5 grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="bg-paper border border-[#E7DFCC] rounded-sm p-7 h-full">
              <Target size={22} className="text-marigold mb-4" />
              <h2 className="text-xl font-display font-semibold mb-2">Our Mission</h2>
              <p className="text-sm text-graphite leading-relaxed">{MISSION_VISION.mission}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="bg-paper border border-[#E7DFCC] rounded-sm p-7 h-full">
              <Eye size={22} className="text-leaf mb-4" />
              <h2 className="text-xl font-display font-semibold mb-2">Our Vision</h2>
              <p className="text-sm text-graphite leading-relaxed">{MISSION_VISION.vision}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 py-16">
        <Reveal><h2 className="text-3xl font-display font-semibold mb-10">What we value</h2></Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {MISSION_VISION.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="border-t-2 border-ink pt-4 h-full">
                <h3 className="font-semibold text-[17px] mb-2 font-display">{v.title}</h3>
                <p className="text-graphite text-sm leading-relaxed">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <WhyChooseUs />
    </>
  );
}
