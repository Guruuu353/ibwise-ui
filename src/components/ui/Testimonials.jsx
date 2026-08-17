import { Quote } from "lucide-react";
import { TESTIMONIALS } from "../../lib/curriculum";
import Reveal from "./Reveal";

export default function Testimonials() {
  return (
    <section className="bg-paperDim py-16">
      <div className="max-w-6xl mx-auto px-5">
        <Reveal><h2 className="text-3xl font-display font-semibold mb-10">What parents are saying</h2></Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="bg-paper border border-[#E7DFCC] rounded-sm p-6 h-full flex flex-col">
                <Quote size={22} className="text-marigold mb-4" />
                <p className="text-sm text-[#3f4c63] leading-relaxed italic flex-1">"{t.quote}"</p>
                <div className="mt-5 pt-4 border-t border-[#E7DFCC]">
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-[#8A8471]">{t.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
