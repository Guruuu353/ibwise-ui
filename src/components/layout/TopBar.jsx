import { Link } from "react-router-dom";
import { Phone, Mail, ArrowRight } from "lucide-react";

// Thin strip above the main nav — contact micro-info + the primary
// conversion action ("Consult Now"), kept visually separate from the
// wayfinding nav below it so it doesn't compete with the dropdowns.
export default function TopBar() {
  return (
    <div className="bg-ink text-[#B9C2D6] text-xs">
      <div className="max-w-6xl mx-auto px-5 h-9 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-5">
          <a href="tel:+254757279330" className="flex items-center gap-1.5 hover:text-paper transition-colors">
            <Phone size={12} /> +254 757 279 330
          </a>
          <a href="mailto:admissions@ibwise.example" className="flex items-center gap-1.5 hover:text-paper transition-colors">
            <Mail size={12} /> admissions@ibwise.example
          </a>
        </div>
        <Link to="/contact" className="flex items-center gap-1.5 font-semibold text-marigold hover:text-[#f0ad5c] transition-colors ml-auto">
          Consult Now <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
