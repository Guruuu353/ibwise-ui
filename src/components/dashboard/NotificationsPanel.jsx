import { Bell, CheckCheck } from "lucide-react";
import { useApiData } from "../../hooks/useApiData";
import { NOTIFICATIONS_SEED } from "../../lib/mockData";
import { api } from "../../lib/api";
import { useState } from "react";

const LABEL = {
  ASSIGNMENT_NEW: "New assignment",
  DEADLINE_REMINDER: "Deadline reminder",
  SUBMISSION_RECEIVED: "Submission received",
  GRADED: "Graded",
  ANNOUNCEMENT: "Announcement",
  BLOG_APPROVED: "Blog approved",
};

// Shared across all three dashboards — same notification shape, only the
// events that generate them differ by role.
export default function NotificationsPanel() {
  const { data, isMock } = useApiData("/notifications/mine", NOTIFICATIONS_SEED);
  const [local, setLocal] = useState(null);
  const notifications = local ?? data;

  async function markAllRead() {
    if (!isMock) { try { await api.patch("/notifications/read-all"); } catch { /* demo fallback below still updates UI */ } }
    setLocal(notifications.map((n) => ({ ...n, read: true })));
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-marigold transition-colors">
          <CheckCheck size={14} /> Mark all as read
        </button>
      </div>
      <div className="bg-white border border-[#E7DFCC] rounded-sm divide-y divide-paperDim">
        {notifications.map((n) => (
          <div key={n.id} className={`px-5 py-4 flex items-start gap-3 ${!n.read ? "bg-[#FBF6EA]" : ""}`}>
            <Bell size={15} className={n.read ? "text-[#B5AF9A]" : "text-marigold"} />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{n.title}</p>
              <p className="text-xs text-[#8A8471] mt-0.5">{LABEL[n.type] || n.type} · {n.createdAt?.slice(0, 10)}</p>
            </div>
            {!n.read && <span className="w-2 h-2 rounded-full bg-marigold mt-1.5 shrink-0" />}
          </div>
        ))}
        {notifications.length === 0 && <p className="px-5 py-6 text-sm text-[#8A8471]">No notifications yet.</p>}
      </div>
    </div>
  );
}
