import { IMAGES } from "../../lib/images";
import PageHeader from "../../components/ui/PageHeader";

// Template policy text — placeholder copy to replace with counsel-reviewed
// language before this goes live; structure and sections are standard.
export default function Cookies() {
  return (
    <>
      <PageHeader image={IMAGES.pageHeaders.policy} eyebrow="Legal" title="Cookies Policy" />
      <section className="max-w-3xl mx-auto px-5 py-16 prose-sm">
        <p className="text-graphite text-sm leading-relaxed mb-6">
          This page explains how IBWISE Learning uses cookies and similar technologies on this
          website. This is placeholder policy text — replace with counsel-reviewed language
          before publishing.
        </p>
        <h2 className="text-lg font-display font-semibold mb-2 mt-8">What cookies we use</h2>
        <p className="text-graphite text-sm leading-relaxed mb-4">
          Essential cookies keep you logged in to the portal and remember your session. We may
          also use analytics cookies to understand how visitors use the site, so we can improve it.
        </p>
        <h2 className="text-lg font-display font-semibold mb-2 mt-8">Managing cookies</h2>
        <p className="text-graphite text-sm leading-relaxed mb-4">
          Most browsers let you block or delete cookies through their settings. Blocking essential
          cookies may prevent parts of the portal — like staying logged in — from working correctly.
        </p>
        <h2 className="text-lg font-display font-semibold mb-2 mt-8">Contact</h2>
        <p className="text-graphite text-sm leading-relaxed">
          Questions about this policy can be sent to admissions@ibwise.example.
        </p>
      </section>
    </>
  );
}
