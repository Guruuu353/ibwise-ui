import { Link } from "react-router-dom";
import Reveal from "./Reveal";

export default function CtaBanner() {
  return (
    <section className="bg-marigold">
      <div className="max-w-6xl mx-auto px-5 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-ink max-w-lg">
            Your child's next term could start differently.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex gap-3 shrink-0">
            <Link to="/admissions" className="px-5 py-3 rounded-sm bg-ink text-paper font-semibold text-sm hover:bg-inkLight transition-colors">
              Start admissions
            </Link>
            <Link to="/contact" className="px-5 py-3 rounded-sm border border-ink text-ink font-semibold text-sm hover:bg-ink hover:text-paper transition-colors">
              Talk to us
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
