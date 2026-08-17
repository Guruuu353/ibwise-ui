import { CheckCircle2 } from "lucide-react";
import { WHY_CHOOSE_US } from "../../lib/curriculum";
import { IMAGES } from "../../lib/images";
import Reveal from "./Reveal";

// Reused on About and on every Academics track page — same four reasons,
// since the "why choose IBWISE" case doesn't change by curriculum, only
// the surrounding page content does.
export default function WhyChooseUs() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <Reveal>
          <img src={IMAGES.whyChooseUs} alt="Students learning at IBWISE" className="rounded-sm w-full h-80 md:h-[420px] object-cover" loading="lazy" />
        </Reveal>
        <div>
          <Reveal><h2 className="text-3xl font-display font-semibold mb-8">Why choose IBWISE</h2></Reveal>
          <div className="space-y-5">
            {WHY_CHOOSE_US.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.06}>
                <div className="flex gap-3">
                  <CheckCircle2 size={18} className="text-leaf shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-ink">{w.title}</p>
                    <p className="text-sm text-graphite mt-0.5">{w.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
