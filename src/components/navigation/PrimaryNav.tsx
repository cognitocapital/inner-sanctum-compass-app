import { Link, useLocation } from "react-router-dom";
import { Sparkles, HeartPulse, Activity, MessageCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = {
  to: string;
  label: string;
  Icon: typeof Sparkles;
  match: (path: string) => boolean;
};

const TABS: Tab[] = [
  { to: "/dashboard",    label: "Today",     Icon: Sparkles,       match: (p) => p === "/dashboard" || p === "/phoenix-path" || p.startsWith("/quest") },
  { to: "/practice",     label: "Practice",  Icon: HeartPulse,     match: (p) => p.startsWith("/practice") },
  { to: "/progress",     label: "Progress",  Icon: Activity,       match: (p) => p.startsWith("/progress") },
  { to: "/ai-companion", label: "Companion", Icon: MessageCircle,  match: (p) => p.startsWith("/ai-companion") },
  { to: "/book",         label: "Book",      Icon: BookOpen,       match: (p) => p.startsWith("/book") },
];

// Hide the primary nav on public entry surfaces.
const HIDE_ON = new Set<string>(["/", "/auth", "/ai-companion"]);

export const PrimaryNav = () => {
  const { pathname } = useLocation();
  if (HIDE_ON.has(pathname)) return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-t border-orange-500/30"
    >
      <div className="flex items-center justify-around py-2 px-1 safe-area-pb max-w-2xl mx-auto">
        {TABS.map(({ to, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[60px]",
                active
                  ? "text-orange-400 bg-orange-500/15"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default PrimaryNav;