import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, LifeBuoy, MessageCircle } from "lucide-react";
import type { RedFlag } from "@/lib/clinical/types";

interface SafetyModalProps {
  open: boolean;
  flags: RedFlag[];
  onAcknowledge: () => void;
  onCancel: () => void;
}

/**
 * Triggered when an instrument returns a blocking red flag (e.g. PHQ-9 Q9 ≥ 1).
 * Surfaces real crisis resources and requires the user to acknowledge before
 * the assessment is saved. This is non-negotiable safety routing.
 */
export const SafetyModal = ({ open, flags, onAcknowledge, onCancel }: SafetyModalProps) => {
  const critical = flags.find((f) => f.severity === "critical") ?? flags[0];
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="bg-slate-950 border-rose-500/30 max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/40 flex items-center justify-center">
            <LifeBuoy className="w-6 h-6 text-rose-300" aria-hidden="true" />
          </div>
          <DialogTitle className="text-white text-center text-xl">
            We're glad you told us
          </DialogTitle>
          <DialogDescription className="text-white/70 text-center text-sm">
            {critical?.message ?? "You indicated something that we need to take seriously."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <p className="text-white/85 text-sm leading-relaxed">
            If you are thinking about hurting yourself, please reach out now to a trained crisis counsellor — free, confidential, 24/7.
          </p>

          <div className="rounded-xl border border-white/10 bg-white/5 divide-y divide-white/10">
            <a href="tel:988" className="flex items-center gap-3 p-3 hover:bg-white/5 transition" aria-label="Call 988 Suicide and Crisis Lifeline">
              <Phone className="w-5 h-5 text-rose-300 shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <div className="text-white font-medium">988 Suicide & Crisis Lifeline</div>
                <div className="text-white/55 text-xs">USA & Canada — call or text 988</div>
              </div>
            </a>
            <a href="tel:116123" className="flex items-center gap-3 p-3 hover:bg-white/5 transition" aria-label="Call Samaritans 116 123">
              <Phone className="w-5 h-5 text-amber-300 shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <div className="text-white font-medium">Samaritans (UK & ROI)</div>
                <div className="text-white/55 text-xs">Call 116 123 — free, 24/7</div>
              </div>
            </a>
            <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 hover:bg-white/5 transition" aria-label="Find a helpline in your country">
              <MessageCircle className="w-5 h-5 text-sky-300 shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <div className="text-white font-medium">findahelpline.com</div>
                <div className="text-white/55 text-xs">Crisis lines in 130+ countries</div>
              </div>
            </a>
          </div>

          <p className="text-white/55 text-xs leading-relaxed">
            This app is not a substitute for emergency care. If you or someone you are with is in immediate danger, please call your local emergency number.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={onCancel} className="flex-1 border-white/15 text-white/70 hover:text-white">
            Don't save this result
          </Button>
          <Button onClick={onAcknowledge} className="flex-1 bg-rose-500/90 hover:bg-rose-500 text-white">
            I've read this — save & continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
