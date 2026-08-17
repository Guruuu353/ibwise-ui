import Pill from "./Pill";

export const STATUS_STYLE = {
  Pending: "bg-[#EFE7D6] text-[#8A6A2B]",
  Submitted: "bg-[#E4EDE6] text-leaf",
  Late: "bg-[#F5E1DE] text-redpen",
  Reviewed: "bg-[#E3E7EE] text-ink",
  Graded: "bg-ink text-paper",
  PENDING: "bg-[#EFE7D6] text-[#8A6A2B]",
  SUBMITTED: "bg-[#E4EDE6] text-leaf",
  LATE: "bg-[#F5E1DE] text-redpen",
  REVIEWED: "bg-[#E3E7EE] text-ink",
  GRADED: "bg-ink text-paper",
  DRAFT: "bg-gray-100 text-gray-600",
  PUBLISHED: "bg-[#E4EDE6] text-leaf",
  CLOSED: "bg-[#E3E7EE] text-ink",
};

function titleCase(s) {
  if (!s) return s;
  return s.charAt(0) + s.slice(1).toLowerCase();
}

export default function StatusBadge({ status, extra }) {
  return <Pill className={STATUS_STYLE[status] || "bg-gray-100 text-gray-600"}>{titleCase(status)}{extra ? ` · ${extra}` : ""}</Pill>;
}
