import { Link } from "react-router-dom";
import { useApiData } from "../../hooks/useApiData";
import { BLOG_POSTS } from "../../lib/mockData";

function slugify(title) { return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40); }

export default function StudentBlog() {
  const { data: posts } = useApiData("/blog", BLOG_POSTS.filter((p) => p.status === "Published"));
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {posts.map((p, i) => (
        <Link key={p.id || i} to={`/blog/${p.slug || slugify(p.title)}`} className="block bg-white border border-[#E7DFCC] rounded-sm p-5 hover:shadow-stamp transition-shadow">
          <p className="text-xs text-marigold font-semibold mb-2">{p.category?.name || p.category}</p>
          <h3 className="font-semibold mb-2 font-display">{p.title}</h3>
          <p className="text-xs text-[#8A8471]">{p.date || p.publishedAt?.slice(0, 10)}</p>
        </Link>
      ))}
      {posts.length === 0 && <p className="text-sm text-[#8A8471] md:col-span-2 text-center py-10">No posts published yet.</p>}
    </div>
  );
}
