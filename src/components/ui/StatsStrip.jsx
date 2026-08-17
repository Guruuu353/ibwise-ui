import CountUp from "./CountUp";
import { STATS } from "../../lib/curriculum";
import Reveal from "./Reveal";

export default function StatsStrip() {
  return (
    <section className="bg-inkLight text-paper">
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div className="text-center md:text-left">
              <p className="text-3xl md:text-4xl font-display font-semibold text-marigold">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs md:text-sm text-[#B9C2D6] mt-1">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
