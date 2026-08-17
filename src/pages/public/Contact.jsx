import { useState } from "react";
import { MapPin, Mail, Phone, Check } from "lucide-react";
import { IMAGES } from "../../lib/images";
import { SOCIAL_LINKS } from "../../lib/curriculum";
import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/ui/Reveal";
import { api } from "../../lib/api";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    try { await api.post("/inquiries", form); } catch { /* still confirm — see ChatWidget for the same pattern */ }
    setSent(true);
  }

  return (
    <>
      <PageHeader image={IMAGES.pageHeaders.contact} eyebrow="Contact" title="Get in touch" subtitle="Admissions, general questions, or just to say hello." />
      <section className="bg-ink text-paper py-16">
        <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-10">
          <Reveal>
            <div>
              <h2 className="text-2xl mb-5 font-display font-semibold">Reach us directly</h2>
              <div className="space-y-3 text-sm text-[#B9C2D6] mb-8">
                <div className="flex items-center gap-3"><MapPin size={16} /> Nakuru, Kenya</div>
                <div className="flex items-center gap-3"><Mail size={16} /> admissions@ibwise.example</div>
                <div className="flex items-center gap-3"><Phone size={16} /> +254 757 279 330</div>
              </div>
              <p className="text-xs uppercase tracking-widest text-marigold font-mono mb-3">Follow us</p>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}
                    className="w-10 h-10 rounded-full bg-inkLight flex items-center justify-center text-sm font-semibold hover:bg-marigold hover:text-ink transition-colors">
                    {s.label[0]}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            {sent ? (
              <div className="flex items-center gap-2 text-leaf bg-[#E4EDE6] rounded-sm px-4 py-3 text-sm font-semibold w-fit">
                <Check size={16} /> Message sent — we'll be in touch.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-sm bg-inkLight border border-[#354a72] text-sm placeholder-[#8492ad] outline-none" />
                <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-sm bg-inkLight border border-[#354a72] text-sm placeholder-[#8492ad] outline-none" />
                <textarea required placeholder="Message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-sm bg-inkLight border border-[#354a72] text-sm placeholder-[#8492ad] outline-none" />
                <button className="px-5 py-2.5 rounded-sm bg-marigold text-ink font-semibold text-sm">Send message</button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
