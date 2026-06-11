import { LifeBuoy, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface CrisisSupportProps {
  variant?: "card" | "compact";
  className?: string;
}

/**
 * Calm, always-available crisis support element.
 * Shows Australian crisis contacts with tap-to-call links.
 * Tone: warm and steady — not alarming. Uses amber/gold tokens, not red.
 */
export const CrisisSupport = ({ variant = "card", className }: CrisisSupportProps) => {
  const contacts = [
    {
      name: "Lifeline",
      detail: "24/7 crisis support",
      number: "13 11 14",
      tel: "131114",
    },
    {
      name: "Suicide Call Back Service",
      detail: "Free counselling, 24/7",
      number: "1300 659 467",
      tel: "1300659467",
    },
    {
      name: "Emergency",
      detail: "Immediate danger",
      number: "000",
      tel: "000",
    },
  ];

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "rounded-xl border border-amber-400/20 bg-amber-500/[0.04] backdrop-blur-sm px-3 py-2",
          className,
        )}
        role="complementary"
        aria-label="Crisis support contacts"
      >
        <div className="flex items-center gap-2 flex-wrap text-[12px]">
          <span className="flex items-center gap-1.5 text-amber-200/90 font-medium">
            <LifeBuoy className="w-3.5 h-3.5" aria-hidden="true" />
            Need support now?
          </span>
          {contacts.map((c) => (
            <a
              key={c.tel}
              href={`tel:${c.tel}`}
              className="text-white/70 hover:text-amber-200 underline-offset-2 hover:underline transition-colors"
              aria-label={`Call ${c.name} on ${c.number}`}
            >
              {c.name} {c.number}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/[0.06] to-orange-500/[0.04] backdrop-blur-sm p-4 sm:p-5",
        className,
      )}
      role="complementary"
      aria-label="Crisis support contacts"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shrink-0">
          <LifeBuoy className="w-4 h-4 text-amber-300" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-serif text-amber-100 leading-snug">
            Need support now?
          </h3>
          <p className="text-[12.5px] text-white/55 leading-relaxed mt-0.5">
            You're not alone. Free, confidential help is one tap away — anytime, day or night.
          </p>

          <ul className="mt-3 divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            {contacts.map((c) => (
              <li key={c.tel}>
                <a
                  href={`tel:${c.tel}`}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-amber-500/[0.06] transition-colors group"
                  aria-label={`Call ${c.name} on ${c.number}`}
                >
                  <Phone className="w-4 h-4 text-amber-300/80 shrink-0 group-hover:text-amber-200" aria-hidden="true" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13.5px] text-white/85 font-medium truncate">
                      {c.name}
                    </span>
                    <span className="block text-[11.5px] text-white/45">{c.detail}</span>
                  </span>
                  <span className="text-[13px] tabular-nums text-amber-200/90 font-medium">
                    {c.number}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-[11px] text-white/35 leading-relaxed">
            Phoenix is a companion, not a clinician. If you or someone with you is in immediate danger, please call 000.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default CrisisSupport;