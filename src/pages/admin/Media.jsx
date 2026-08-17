import { useState, useRef } from "react";
import { UploadCloud, FileText, Trash2 } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { MEDIA_SEED } from "../../lib/mockData";
import { api } from "../../lib/api";

function humanSize(bytes) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
}

export default function AdminMedia() {
  const { data, isMock } = useApiData("/media", MEDIA_SEED);
  const [local, setLocal] = useState(null);
  const items = local ?? data;
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    if (!isMock) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        await api.post("/media", fd, { headers: { "Content-Type": "multipart/form-data" } });
      } catch { /* fall through to optimistic update */ }
    }
    setLocal([{ id: `md${Date.now()}`, filename: file.name, mimeType: file.type, size: file.size, uploadedBy: { firstName: "You" }, createdAt: new Date().toISOString() }, ...items]);
    setUploading(false);
    e.target.value = "";
  }

  function remove(id) {
    setLocal(items.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="bg-white border border-dashed border-[#E7DFCC] rounded-sm p-8 flex flex-col items-center text-center">
        <UploadCloud size={24} className="text-marigold mb-2" />
        <p className="text-sm text-graphite mb-3">Upload documents, images or resources for the school library.</p>
        <input ref={fileRef} type="file" onChange={handleFile} className="hidden" />
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="px-4 py-2 rounded-sm bg-ink text-paper text-xs font-semibold disabled:opacity-60">
          {uploading ? "Uploading…" : "Choose file"}
        </button>
      </div>
      <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
        {items.map((m) => (
          <div key={m.id} className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-[#8A8471]" />
              <div>
                <p className="text-sm font-medium text-ink">{m.filename}</p>
                <p className="text-xs text-[#8A8471]">{humanSize(m.size)} · uploaded by {m.uploadedBy?.firstName}</p>
              </div>
            </div>
            <button onClick={() => remove(m.id)} aria-label="Remove file"><Trash2 size={15} className="text-[#8A8471] hover:text-redpen transition-colors" /></button>
          </div>
        ))}
        {items.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471]">No files uploaded yet.</p>}
      </div>
    </div>
  );
}
