import { useRef, useState } from "react";
import { Bold, Italic, Heading2, List, ListOrdered, ImagePlus, Video, Loader2 } from "lucide-react";
import { api } from "../../lib/api";

// Wraps/prefixes the current textarea selection with markdown syntax and
// keeps focus + selection sane afterward, the way a minimal WYSIWYG toolbar
// should — no external editor dependency needed for this scope.
function applyWrap(textarea, before, after = before) {
  const { selectionStart: s, selectionEnd: e, value } = textarea;
  const selected = value.slice(s, e) || "text";
  const next = value.slice(0, s) + before + selected + after + value.slice(e);
  return { next, cursor: s + before.length, selectionLength: selected.length };
}

function applyLinePrefix(textarea, prefix) {
  const { selectionStart: s, value } = textarea;
  const lineStart = value.lastIndexOf("\n", s - 1) + 1;
  const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  return { next, cursor: s + prefix.length };
}

export default function RichContentEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  function run(fn) {
    const textarea = ref.current;
    if (!textarea) return;
    const result = fn(textarea);
    onChange(result.next);
    requestAnimationFrame(() => {
      textarea.focus();
      const pos = result.cursor + (result.selectionLength || 0);
      textarea.setSelectionRange(result.cursor, pos);
    });
  }

  async function insertImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const media = await api.post("/media", fd);
      run((textarea) => {
        const { selectionStart: s, value: v } = textarea;
        const snippet = `\n![${file.name}](${media.url})\n`;
        return { next: v.slice(0, s) + snippet + v.slice(s), cursor: s + snippet.length };
      });
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function insertVideo() {
    const url = window.prompt("Paste a YouTube or Vimeo link:");
    if (!url) return;
    run((textarea) => {
      const { selectionStart: s, value: v } = textarea;
      const snippet = `\n[video](${url})\n`;
      return { next: v.slice(0, s) + snippet, cursor: s + snippet.length };
    });
  }

  const buttons = [
    { icon: Bold, label: "Bold", onClick: () => run((t) => applyWrap(t, "**")) },
    { icon: Italic, label: "Italic", onClick: () => run((t) => applyWrap(t, "_")) },
    { icon: Heading2, label: "Heading", onClick: () => run((t) => applyLinePrefix(t, "## ")) },
    { icon: List, label: "Bulleted list", onClick: () => run((t) => applyLinePrefix(t, "- ")) },
    { icon: ListOrdered, label: "Numbered list", onClick: () => run((t) => applyLinePrefix(t, "1. ")) },
  ];

  return (
    <div className="border border-[#E7DFCC] rounded-sm overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-paperDim border-b border-[#E7DFCC]">
        {buttons.map((b) => (
          <button key={b.label} type="button" onClick={b.onClick} title={b.label}
            className="p-1.5 rounded-sm text-graphite hover:bg-white hover:text-ink transition-colors">
            <b.icon size={14} />
          </button>
        ))}
        <div className="w-px h-4 bg-[#E7DFCC] mx-1" />
        <label title="Insert image" className="p-1.5 rounded-sm text-graphite hover:bg-white hover:text-ink transition-colors cursor-pointer">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
          <input type="file" accept="image/*" className="hidden" onChange={insertImage} disabled={uploading} />
        </label>
        <button type="button" onClick={insertVideo} title="Embed video" className="p-1.5 rounded-sm text-graphite hover:bg-white hover:text-ink transition-colors">
          <Video size={14} />
        </button>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={10}
        className="w-full px-3 py-2.5 text-sm outline-none resize-y font-mono"
      />
      {error && <p className="px-3 py-1.5 text-xs font-medium text-redpen bg-white">{error}</p>}
      <p className="px-3 py-1.5 text-[11px] text-[#8A8471] bg-white border-t border-paperDim">
        Formatted with Markdown — **bold**, _italic_, ## headings, - lists, and images/video inserted via the toolbar.
      </p>
    </div>
  );
}
