import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Turns a YouTube/Vimeo URL into its embeddable form. Returns null for
// anything else so callers can fall back to a plain link.
function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

// [video](https://youtube.com/watch?v=...) -> a responsive embedded iframe.
// Runs before markdown parsing since it isn't standard markdown syntax.
function expandVideoShortcodes(markdown) {
  return markdown.replace(/\[video\]\((https?:\/\/[^\s)]+)\)/g, (match, url) => {
    const embed = toEmbedUrl(url);
    if (!embed) return `[Watch video](${url})`;
    return `<div class="video-embed"><iframe src="${embed}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
  });
}

marked.setOptions({ breaks: true, gfm: true });

export default function RichContent({ markdown, className = "" }) {
  const html = useMemo(() => {
    if (!markdown) return "";
    const withEmbeds = expandVideoShortcodes(markdown);
    const raw = marked.parse(withEmbeds);
    return DOMPurify.sanitize(raw, { ADD_TAGS: ["iframe"], ADD_ATTR: ["allow", "allowfullscreen", "loading", "frameborder"] });
  }, [markdown]);

  return <div className={`rich-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
