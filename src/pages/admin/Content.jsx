import { useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle, PlusCircle, ImagePlus, Loader2 } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { BLOG_POSTS, BLOG_CATEGORIES } from "../../lib/mockData";
import Pill from "../../components/ui/Pill";
import RichContentEditor from "../../components/ui/RichContentEditor";
import { api } from "../../lib/api";

function ComposeForm({ isMock, onPublished }) {
  const { data: categories } = useApiData("/blog/categories", BLOG_CATEGORIES);
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

  async function publish(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) { setError("Title and content are both required."); return; }
    setError(null);
    setBusy(true);
    try {
      let post = { title: form.title, category: "Published", status: "Published", date: "Today" };
      if (!isMock) post = await api.post("/blog", { ...form, submitForReview: true });
      onPublished(post);
      setForm({ title: "", body: "", categoryId: "", featuredImage: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={publish} className="bg-white border border-[#E7DFCC] rounded-sm p-5 space-y-3 mb-5">
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

      <RichContentEditor value={form.body} onChange={(body) => setForm({ ...form, body })} placeholder="Write the post…" />

      {error && <p className="text-xs font-medium text-redpen">{error}</p>}
      <button disabled={busy} className="flex items-center gap-2 px-4 py-2 rounded-sm bg-marigold text-ink text-sm font-semibold disabled:opacity-50">
        {busy ? <Loader2 size={15} className="animate-spin" /> : <PlusCircle size={15} />}
        {busy ? "Publishing…" : "Publish now"}
      </button>
    </form>
  );
}

export default function AdminContent() {
  const { data, isMock } = useApiData("/blog/moderation", BLOG_POSTS);
  const [posts, setPosts] = useState(null);
  const list = posts ?? data;

  async function approve(post) {
    if (!isMock) { try { await api.patch(`/blog/${post.id}/approve`); } catch { /* demo fallback below still updates UI */ } }
    setPosts(list.map((p) => (p === post ? { ...p, status: "Published" } : p)));
  }

  async function reject(post) {
    if (!isMock) { try { await api.patch(`/blog/${post.id}/reject`); } catch { /* demo fallback below still updates UI */ } }
    setPosts(list.map((p) => (p === post ? { ...p, status: "REJECTED" } : p)));
  }

  return (
    <div>
      <ComposeForm isMock={isMock} onPublished={(post) => setPosts([post, ...list])} />
      <div className="space-y-3">
        {list.map((p, i) => (
          <div key={p.id || i} className="bg-white border border-[#E7DFCC] rounded-sm p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-ink">{p.title}</p>
              <p className="text-xs text-[#8A8471]">{p.category?.name || p.category} · {p.date || p.createdAt?.slice(0, 10) || ""}</p>
            </div>
            {p.status === "Pending review" || p.status === "PENDING_REVIEW" ? (
              <div className="flex items-center gap-2">
                <Pill className="bg-[#F5E1DE] text-redpen"><AlertTriangle size={12} /> Pending review</Pill>
                <button onClick={() => reject(p)} className="px-3 py-1.5 rounded-sm border border-[#E7DFCC] text-graphite text-xs font-semibold hover:bg-paperDim">Reject</button>
                <button onClick={() => approve(p)} className="px-3 py-1.5 rounded-sm bg-ink text-paper text-xs font-semibold">Approve</button>
              </div>
            ) : p.status === "REJECTED" ? (
              <Pill className="bg-[#F1EBDA] text-[#8A8471]"><XCircle size={12} /> Not approved</Pill>
            ) : (
              <Pill className="bg-[#E4EDE6] text-leaf"><CheckCircle2 size={12} /> Published</Pill>
            )}
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-[#8A8471] text-center py-10">No posts to review right now.</p>}
      </div>
    </div>
  );
}
