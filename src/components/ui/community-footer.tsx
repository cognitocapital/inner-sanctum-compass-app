import { ExternalLink } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const X_URL = "https://x.com/WhatajourneyTBI";

export const CommunityFooter = () => (
  <footer className="relative z-10 border-t border-white/[0.06] bg-black/20 backdrop-blur-sm">
    <div className="container mx-auto px-4 py-8 text-center max-w-2xl">
      <p className="text-sm text-white/50 leading-relaxed mb-4">
        We're also building community on X where survivors share their journeys, wins, and quiet moments.
        <br className="hidden sm:block" />
        Come stand under the torch with us.
      </p>
      <a
        href={X_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.06] border border-orange-500/30 hover:border-orange-400/60 hover:bg-white/[0.1] transition-all duration-200 group"
      >
        <XIcon className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
        <span className="text-sm font-medium text-orange-300 group-hover:text-orange-200 transition-colors">
          @WhatajourneyTBI
        </span>
        <ExternalLink className="w-3 h-3 text-white/30" />
      </a>
      <p className="text-xs text-white/30 mt-6">
        © 2024 Michael Heron. All rights reserved.
      </p>
    </div>
  </footer>
);

export const XCommunityLink = ({ className }: { className?: string }) => (
  <a
    href={X_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={`group relative inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-orange-500/30 hover:bg-white/[0.08] transition-all duration-200 ${className || ""}`}
    title="Share your story, read others, and keep the torch lit together."
  >
    <XIcon className="w-4 h-4 text-orange-400" />
    <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
      @WhatajourneyTBI
    </span>
  </a>
);
