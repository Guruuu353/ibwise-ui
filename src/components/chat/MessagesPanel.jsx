import { useState, useRef, useEffect } from "react";
import { Send, MessageCircleMore } from "lucide-react";
import { usePolling } from "../../hooks/usePolling";
import { CONVERSATIONS, MESSAGES_SEED } from "../../lib/mockData";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

// Shared between teacher and student dashboards — messaging works the same
// way for both, only the conversation list content differs by role.
export default function MessagesPanel() {
  const { user } = useAuth();
  const { data: conversations, isMock: convosMock } = usePolling("/chat/conversations", { intervalMs: 6000, mock: CONVERSATIONS });
  const [activeId, setActiveId] = useState(null);
  const active = conversations.find((c) => c.id === activeId) || conversations[0];
  const { data: messages, isMock: msgsMock, refresh } = usePolling(
    active ? `/chat/conversations/${active.id}/messages` : null,
    { intervalMs: 3000, mock: MESSAGES_SEED }
  );
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send() {
    if (!draft.trim() || !active) return;
    const text = draft;
    setDraft("");
    if (msgsMock) return; // demo mode — nothing to send to
    try {
      await api.post(`/chat/conversations/${active.id}/messages`, { body: text });
      refresh();
    } catch { /* leave draft cleared; polling will resync on next tick */ }
  }

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-4 h-[70vh]">
      <div className="bg-white border border-[#E7DFCC] rounded-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-[#E7DFCC] text-xs font-semibold uppercase tracking-wide text-[#8A8471]">
          Conversations
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full text-left px-4 py-3 border-b border-[#F1EBDA] hover:bg-paperDim transition-colors ${active?.id === c.id ? "bg-paperDim" : ""}`}
            >
              <p className="text-sm font-medium text-ink truncate">{c.title || c.otherName || "Conversation"}</p>
              <p className="text-xs text-[#8A8471] truncate">{c.messages?.[0]?.body || "No messages yet"}</p>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="px-4 py-6 text-xs text-[#8A8471] flex flex-col items-center gap-2 text-center">
              <MessageCircleMore size={20} /> No conversations yet.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#E7DFCC] rounded-sm flex flex-col">
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.map((m) => {
            const mine = m.senderId === user?.id;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-sm text-sm ${mine ? "bg-ink text-paper" : "bg-paperDim text-ink"}`}>
                  {m.body}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <div className="p-3 border-t border-[#E7DFCC] flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={msgsMock ? "Demo mode — connect the backend to send" : "Type a message…"}
            className="flex-1 px-3 py-2 border border-[#E7DFCC] rounded-sm text-sm outline-none focus:border-ink"
          />
          <button onClick={send} className="w-9 h-9 rounded-sm bg-marigold text-ink flex items-center justify-center shrink-0">
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
