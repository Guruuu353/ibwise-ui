import { useState } from "react";
import { PlusCircle, Clock, CheckCircle2, XCircle, ImagePlus, Loader2 } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { BLOG_POSTS, BLOG_CATEGORIES } from "../../lib/mockData";
import { api } from "../../lib/api";
import RichContentEditor from "../../components/ui/RichContentEditor";

const STATUS_UI = {
  Published: { icon: CheckCircle2, className: "text-leaf" },
  PUBLISHED: { icon: CheckCircle2, className: "text-leaf" },
  "Pending review": { icon: Clock, className: "text-[#8A6A2B]" },
  PENDING_REVIEW: { icon: Clock, className: "text-[#8A6A2B]" },
  REJECTED: { icon: XCircle, className: "text-redpen" },
};

export default function TeacherBlog() {
  const { data, isMock } = useApiData("/blog/moderation", BLOG_POSTS.filter((p) => p.status !== "Published"));
  const { data: categories } = useApiData("/blog/categories", BLOG_CATEGORIES);
  const [local, setLocal] = useState(null);
  const posts = local ?? data;

  const [form, setForm] = useState({ title: "", body: "", categoryId: "", featuredImage: "" });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function uploadFeaturedImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const media = await api.post("/media", fd);
      setForm((f) => ({ ...f, featuredImage: media.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  }

  async function submitForReview(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      setError("Title and content are both required.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      let createdPost = { title: form.title, category: "Pending", status: "Pending review", date: "Today" };
      if (!isMock) createdPost = await api.post("/blog", { ...form, submitForReview: true });
      setLocal([createdPost, ...posts]);
      setForm({ title: "", body: "", categoryId: "", featuredImage: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={submitForReview} className="bg-white border border-[#E7DFCC] rounded-sm p-5 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title"
            className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink" />
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink bg-white">
            <option value="">Category…</option>
            {(categories || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-[#C9C0A5] rounded-sm text-xs text-graphite cursor-pointer hover:border-ink transition-colors w-fit">
          {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
          {form.featuredImage ? "Featured image set — change" : "Add a featured image"}
          <input type="file" accept="image/*" className="hidden" onChange={uploadFeaturedImage} disabled={uploadingImage} />
        </label>
        {form.featuredImage && <img src={form.featuredImage} alt="Featured" className="h-28 rounded-sm object-cover" />}

        <RichContentEditor value={form.body} onChange={(body) => setForm({ ...form, body })} placeholder="Write your post… use the toolbar to add headings, lists, images, and video." />

        {error && <p className="text-xs font-medium text-redpen">{error}</p>}
        <button disabled={busy} className="flex items-center gap-2 px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold disabled:opacity-50">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <PlusCircle size={15} />}
          {busy ? "Submitting…" : "Submit for review"}
        </button>
      </form>

      <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
        {posts.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471] text-center">No posts yet.</p>}
        {posts.map((p, i) => {
          const ui = STATUS_UI[p.status] || STATUS_UI.PENDING_REVIEW;
          return (
            <div key={p.id || i} className="px-5 py-4 flex items-center justify-between">
              <div><p className="text-sm font-semibold text-ink">{p.title}</p><p className="text-xs text-[#8A8471]">{p.category?.name || p.category} · {p.date || p.createdAt?.slice(0, 10)}</p></div>
              <span className={`flex items-center gap-1.5 text-xs font-semibold ${ui.className}`}>
                <ui.icon size={13} /> {p.status === "PENDING_REVIEW" ? "Pending review" : p.status === "REJECTED" ? "Not approved" : p.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
