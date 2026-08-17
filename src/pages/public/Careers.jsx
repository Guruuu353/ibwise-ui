import { Briefcase } from "lucide-react";
import { IMAGES } from "../../lib/images";
import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/ui/Reveal";

// Honest empty state — wire this up to a real /api/careers listing
// once IBWISE has open roles to publish, rather than faking postings.
export default function Careers() {
  return (
    <>
      <PageHeader image={IMAGES.pageHeaders.careers} eyebrow="Careers" title="Join the IBWISE team" subtitle="Teaching and operations roles across our CBC, Cambridge and Diploma tracks." />
      <section className="max-w-3xl mx-auto px-5 py-16 text-center">
        <Reveal>
          <Briefcase size={28} className="text-marigold mx-auto mb-4" />
          <h2 className="text-xl font-display font-semibold mb-2">No open positions right now</h2>
          <p className="text-graphite text-sm mb-6">
            We're not actively hiring at the moment, but we're always glad to hear from great
            teachers. Send us a note through the contact page and we'll keep it on file.
          </p>
          <a href="/contact" className="inline-block px-5 py-3 rounded-sm bg-ink text-paper font-semibold text-sm">
            Get in touch
          </a>
        </Reveal>
      </section>
    </>
  );
}
