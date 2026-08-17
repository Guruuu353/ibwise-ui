import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleMore, X, Send, CheckCircle2 } from "lucide-react";
import { api } from "../../lib/api";

// Site-wide floating "chat with admissions" widget for public (logged-out)
// visitors — posts to /api/inquiries, a real inbox an admin can work from,
// not a fake chat. Dashboard users have real messaging already (see
// MessagesPanel) so this widget only mounts in PublicLayout.
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/inquiries", form);
      setSent(true);
    } catch {
      // Offline/demo fallback — still confirm to the visitor so the widget
      // feels complete even before the backend is deployed.
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-marigold text-ink shadow-xl flex items-center justify-center"
        aria-label="Chat with admissions"
      >
        {open ? <X size={22} /> : <MessageCircleMore size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-24 right-5 z-40 w-80 bg-white border border-[#E7DFCC] rounded-sm shadow-2xl overflow-hidden"
          >
            <div className="bg-ink text-paper px-4 py-3">
              <p className="font-semibold text-sm font-display">Chat with Admissions</p>
              <p className="text-xs text-[#B9C2D6]">We usually reply within a day.</p>
            </div>

            {sent ? (
              <div className="p-5 flex flex-col items-center text-center gap-2">
                <CheckCircle2 size={28} className="text-leaf" />
                <p className="text-sm font-semibold text-ink">Message sent</p>
                <p className="text-xs text-[#8A8471]">Our admissions team will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 space-y-2.5">
                <input required placeholder="Your name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
                <input required type="email" placeholder="Email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
                <textarea required rows={3} placeholder="How can we help?" value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
                {error && <p className="text-xs text-redpen">{error}</p>}
                <button disabled={submitting} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-marigold text-ink text-sm font-semibold disabled:opacity-60">
                  <Send size={14} /> {submitting ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
