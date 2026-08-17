import { IMAGES } from "../../lib/images";
import PageHeader from "../../components/ui/PageHeader";

export default function Terms() {
  return (
    <>
      <PageHeader image={IMAGES.pageHeaders.policy} eyebrow="Legal" title="Terms & Conditions" />
      <section className="max-w-3xl mx-auto px-5 py-16">
        <p className="text-graphite text-sm leading-relaxed mb-6">
          These terms govern use of the IBWISE Learning website and portal. This is placeholder
          policy text — replace with counsel-reviewed language before publishing.
        </p>
        <h2 className="text-lg font-display font-semibold mb-2 mt-8">Use of the portal</h2>
        <p className="text-graphite text-sm leading-relaxed mb-4">
          Access to student, teacher and admin dashboards is provided for enrolled families and
          staff only. Accounts are personal and should not be shared.
        </p>
        <h2 className="text-lg font-display font-semibold mb-2 mt-8">Fees & payments</h2>
        <p className="text-graphite text-sm leading-relaxed mb-4">
          Fee invoices are issued per term and are payable by the stated due date. Payment
          confirmations are recorded automatically once a transaction completes.
        </p>
        <h2 className="text-lg font-display font-semibold mb-2 mt-8">Content</h2>
        <p className="text-graphite text-sm leading-relaxed">
          Blog and announcement content is moderated before publishing and remains the property
          of IBWISE Learning.
        </p>
      </section>
    </>
  );
}
