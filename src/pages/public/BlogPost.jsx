import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { BLOG_POSTS } from "../../lib/mockData";
import { IMAGES } from "../../lib/images";
import RichContent from "../../components/ui/RichContent";
import Pill from "../../components/ui/Pill";

function slugify(title) { return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40); }

export default function BlogPost() {
  const { slug } = useParams();
  const mockMatch = BLOG_POSTS.find((p) => (p.slug || slugify(p.title)) === slug) || BLOG_POSTS[0];
  const { data: post, loading } = useApiData(`/blog/post/${slug}`, mockMatch, [slug]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-5 py-24 text-center text-sm text-[#8A8471]">Loading…</div>;
  }

  const dateLabel = post.publishedAt?.slice(0, 10) || post.date;
  const authorName = post.author ? `${post.author.firstName} ${post.author.lastName}` : null;
  const image = post.featuredImage || IMAGES.blogThumb(post.slug || slugify(post.title));

  return (
    <article className="max-w-3xl mx-auto px-5 py-16">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-graphite hover:text-ink mb-6">
        <ArrowLeft size={14} /> Back to News & Blog
      </Link>

      <div className="overflow-hidden rounded-sm mb-6 h-64 sm:h-80">
        <img src={image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      <p className="text-xs text-marigold font-semibold mb-2">{post.category?.name || post.category}</p>
      <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink mb-3 leading-tight">{post.title}</h1>
      <p className="text-xs text-[#8A8471] mb-8">
        {dateLabel}{authorName ? ` · by ${authorName}` : ""}
      </p>

      <RichContent markdown={post.body} />

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-[#E7DFCC]">
          {post.tags.map((t) => <Pill key={t} className="bg-paperDim text-graphite">{t}</Pill>)}
        </div>
      )}
    </article>
  );
}
