import { useState } from "react";
import { Link } from "react-router-dom";
import { useApiData } from "../../hooks/useApiData";
import { BLOG_POSTS } from "../../lib/mockData";
import { IMAGES } from "../../lib/images";
import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/ui/Reveal";
import Pagination, { paginate } from "../../components/ui/Pagination";
import { SkeletonCards } from "../../components/ui/Loaders";

function slugify(title) { return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40); }

const PAGE_SIZE = 6;

export default function Blog() {
  const { data: posts, loading } = useApiData("/blog", BLOG_POSTS.filter((p) => p.status === "Published"));
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const visible = paginate(posts, page, PAGE_SIZE);

  function goToPage(p) {
    setPage(p);
    document.getElementById("blog-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <PageHeader image={IMAGES.pageHeaders.blog} eyebrow="News & Blog" title="Updates from the classroom" subtitle="School news, parenting tips, and stories from every track." />
      <section id="blog-grid" className="max-w-6xl mx-auto px-5 py-16 scroll-mt-24">
        {loading ? (
          <SkeletonCards count={6} />
        ) : posts.length === 0 ? (
          <p className="text-sm text-[#8A8471] text-center py-16">No posts published yet — check back soon.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {visible.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.06}>
                  <Link to={`/blog/${p.slug || slugify(p.title)}`} className="bg-white rounded-sm border border-[#E7DFCC] overflow-hidden h-full flex flex-col group block">
                    <div className="overflow-hidden h-40">
                      <img
                        src={p.featuredImage || IMAGES.blogThumb(p.slug || slugify(p.title))}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-xs text-marigold font-semibold mb-2">{p.category?.name || p.category}</p>
                      <h2 className="font-semibold mb-3 leading-snug font-display flex-1">{p.title}</h2>
                      <p className="text-xs text-[#8A8471]">{p.date || p.publishedAt?.slice(0, 10)}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={goToPage} className="mt-12" />
          </>
        )}
      </section>
    </>
  );
}
