import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Heart,
  Users,
  ShieldCheck,
  BookOpen,
  Sparkles,
  ExternalLink,
  Flame,
  HandHeart,
  AlertTriangle,
  MessageCircle,
  Compass,
} from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import carerCircleHero from "@/assets/carer-circle-hero.jpg";

const X_URL = "https://x.com/WhatajourneyTBI";
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const CarerCircle = () => {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const guides = [
    {
      icon: Compass,
      title: "First 30 Days After TBI",
      description: "What to watch for, what to expect, and the small things that matter most when everything feels uncertain.",
      tag: "Field Guide",
    },
    {
      icon: AlertTriangle,
      title: "Spotting a Fog Day",
      description: "Recognising when your loved one is overwhelmed — and the kindest thing you can do in that moment.",
      tag: "Daily Practice",
    },
    {
      icon: HandHeart,
      title: "How to Show Up Well",
      description: "Practical scripts, energy boundaries, and the difference between rescuing and supporting.",
      tag: "Communication",
    },
    {
      icon: ShieldCheck,
      title: "Looking After Yourself",
      description: "Carer fatigue is real. Your wellbeing is part of their recovery — not separate from it.",
      tag: "Self-care",
    },
  ];

  const supportPaths = [
    {
      icon: Users,
      title: "Peer Carer Circle",
      description: "Connect with other carers walking this same road. You don't have to figure this out alone.",
      cta: "Join the circle",
      href: X_URL,
      external: true,
    },
    {
      icon: BookOpen,
      title: "Read Their Story",
      description: "Michael's manuscript was written so the people who love survivors could finally understand what's happening inside.",
      cta: "Open the book",
      href: "/dedication",
      external: false,
    },
    {
      icon: MessageCircle,
      title: "Ask Phoenix",
      description: "A judgement-free AI companion trained on the manuscript. Ask anything — at 3am if you have to.",
      cta: "Start a conversation",
      href: "/ai-companion",
      external: false,
    },
  ];

  const lifelines = [
    { name: "Brain Injury Association of America", website: "https://www.biausa.org", focus: "National helpline & carer resources" },
    { name: "Headway UK", website: "https://www.headway.org.uk", focus: "Carer support, helpline 0808 800 2244" },
    { name: "BrainLine — For Caregivers", website: "https://www.brainline.org/caregivers", focus: "Curated TBI carer education" },
    { name: "Family Caregiver Alliance", website: "https://www.caregiver.org", focus: "Burnout, respite & wellbeing tools" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950/30 text-white relative overflow-hidden">
      <SEOHead
        title="The Carer Circle — What a Journey"
        description="A field guide and community for the people who carry TBI survivors — partners, parents, friends and quiet allies."
        path="/circle"
      />

      {/* ============ CINEMATIC HERO ============ */}
      <section className="relative min-h-[100svh] w-full overflow-hidden flex flex-col">
        <img
          src={carerCircleHero}
          alt="Two silhouetted figures sitting close on a hillside under a starlit sky, sharing a glowing lantern between them — a phoenix constellation faintly traced in the stars above."
          className="absolute inset-0 w-full h-full object-cover object-center animate-[fade-in_1.6s_ease-out]"
          loading="eager"
          width={1920}
          height={1080}
        />

        {/* Atmospheric overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_70%,_rgba(0,0,0,0.92)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-gray-950/70 to-gray-950" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Drifting embers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[25%] left-[18%] w-1.5 h-1.5 bg-orange-400 rounded-full opacity-80 shadow-[0_0_12px_4px_rgba(251,146,60,0.6)] animate-[float_4s_ease-in-out_infinite]" />
          <div className="absolute top-[40%] right-[22%] w-1 h-1 bg-amber-300 rounded-full opacity-70 shadow-[0_0_10px_3px_rgba(252,211,77,0.5)] animate-[float_5s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[58%] left-[30%] w-2 h-2 bg-orange-500 rounded-full opacity-60 shadow-[0_0_14px_5px_rgba(249,115,22,0.5)] animate-[float_6s_ease-in-out_infinite_2s]" />
          <div className="absolute top-[68%] right-[28%] w-1 h-1 bg-amber-400 rounded-full opacity-55 shadow-[0_0_10px_3px_rgba(245,158,11,0.5)] animate-[float_7s_ease-in-out_infinite_0.5s]" />
        </div>

        {/* Back button */}
        <button
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/resources"))}
          className="absolute top-5 left-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Editorial title block */}
        <div className="relative z-10 mt-auto px-6 md:px-16 pb-16 md:pb-24 animate-[fade-in_2s_ease-out_0.4s_both]">
          <div className="max-w-4xl mx-auto text-center md:text-left">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs md:text-sm font-light uppercase mb-4 inline-flex items-center gap-2">
              <Flame className="h-3.5 w-3.5" style={{ filter: "drop-shadow(0 0 6px rgba(251,146,60,0.8))" }} />
              For the people who carry us
            </p>
            <h1 className="font-serif font-bold text-white text-5xl md:text-7xl leading-[1.02] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              The Carer Circle
            </h1>
            <p className="mt-6 text-white/80 text-base md:text-lg max-w-2xl font-light italic leading-relaxed mx-auto md:mx-0">
              You hold the lantern when they can't. This space is for partners, parents, children, friends and quiet allies — the unseen scaffolding of every recovery.
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-[float_2.5s_ease-in-out_infinite]">
          <ChevronDown className="h-6 w-6 text-white/60" />
        </div>
      </section>
      {/* ============ END HERO ============ */}

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-6xl space-y-20">
        {/* Manifesto */}
        <section className="animate-[fade-in_1s_ease-out]">
          <figure className="relative max-w-3xl mx-auto rounded-3xl border border-orange-400/25 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent backdrop-blur-xl p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <Heart className="w-7 h-7 text-orange-300 mx-auto mb-5" />
              <blockquote className="font-serif text-xl md:text-2xl text-white/90 italic leading-relaxed">
                "Brain injury doesn't only happen to one person — it happens to everyone who loves them. If you're reading this, you are part of the recovery. You always have been."
              </blockquote>
              <figcaption className="mt-6 text-xs tracking-[0.3em] uppercase text-orange-300/70">
                — Michael Heron
              </figcaption>
            </div>
          </figure>
        </section>

        {/* Field Guides */}
        <section>
          <div className="text-center mb-10">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs font-light uppercase mb-3 inline-flex items-center gap-2">
              <Compass className="h-3.5 w-3.5" />
              The Field Guide
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">What no one tells you</h2>
            <div className="mt-4 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
            <p className="mt-4 text-white/60 max-w-2xl mx-auto leading-relaxed">
              Honest, practical guidance written by survivors and the people who walked beside them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {guides.map((g) => (
              <div
                key={g.title}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-7 hover:border-orange-400/40 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/0 group-hover:bg-orange-500/15 rounded-full blur-2xl transition-colors duration-700 pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-orange-500/15 border border-orange-400/30 flex items-center justify-center">
                      <g.icon className="w-5 h-5 text-orange-300" />
                    </div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-orange-300/70 font-medium">{g.tag}</span>
                  </div>
                  <h3 className="font-serif text-xl text-white font-semibold leading-tight">{g.title}</h3>
                  <p className="text-sm text-white/65 mt-2 leading-relaxed">{g.description}</p>
                  <p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-amber-300/60 italic">Coming soon · Beta</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support Paths */}
        <section>
          <div className="text-center mb-10">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs font-light uppercase mb-3 inline-flex items-center gap-2">
              <HandHeart className="h-3.5 w-3.5" />
              Stand Under the Torch
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">You don't carry this alone</h2>
            <div className="mt-4 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {supportPaths.map((s) => {
              const inner = (
                <div className="relative h-full">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-orange-500/30 transition-colors duration-700" />
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-white/10 border border-orange-400/30 flex items-center justify-center mb-4">
                      <s.icon className="w-5 h-5 text-orange-300" />
                    </div>
                    <h3 className="font-serif text-xl text-white font-semibold mb-2">{s.title}</h3>
                    <p className="text-sm text-white/65 leading-relaxed">{s.description}</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-orange-200 group-hover:text-orange-100 tracking-wider uppercase">
                      {s.cta} {s.external ? <ExternalLink className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
              const className = "group relative rounded-2xl border border-orange-400/25 bg-gradient-to-br from-orange-500/10 to-amber-500/5 backdrop-blur-xl p-6 md:p-7 hover:border-orange-300/50 hover:-translate-y-1 transition-all duration-500 overflow-hidden";

              return s.external ? (
                <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" className={className}>
                  {inner}
                </a>
              ) : (
                <Link key={s.title} to={s.href} className={className}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Lifelines (external orgs) */}
        <section>
          <div className="text-center mb-10">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs font-light uppercase mb-3 inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Lifelines
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">Trusted carer organisations</h2>
            <div className="mt-4 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {lifelines.map((l) => (
              <a
                key={l.name}
                href={l.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-orange-400/40 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-white font-semibold">{l.name}</h3>
                    <p className="text-xs text-orange-300/80 mt-1 tracking-wide">{l.focus}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-orange-300 transition-colors flex-shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* X Community CTA */}
        <section>
          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block rounded-3xl border border-orange-400/30 bg-gradient-to-br from-orange-600/15 via-amber-500/10 to-rose-600/10 backdrop-blur-xl overflow-hidden hover:border-orange-300/60 transition-all duration-500"
          >
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6 p-8 md:p-10">
              <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-white/10 border border-orange-400/40 flex items-center justify-center">
                <XIcon className="h-6 w-6 text-orange-300" />
              </div>
              <div className="flex-1">
                <p className="text-orange-300/80 tracking-[0.3em] text-xs font-light uppercase mb-2">The Torch Circle on X</p>
                <h3 className="font-serif text-2xl md:text-3xl text-white font-bold">@WhatajourneyTBI</h3>
                <p className="text-white/70 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                  Carers, survivors, clinicians and quiet allies — sharing the daily reality, the wins, and the small protocols that actually work.
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 group-hover:bg-orange-400 text-white font-semibold shadow-lg shadow-orange-500/30 transition-all group-hover:scale-105">
                  Follow & Join <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>
        </section>

        {/* Beta disclaimer */}
        <section className="pb-12">
          <div className="max-w-3xl mx-auto rounded-2xl border border-amber-400/20 bg-amber-500/[0.04] backdrop-blur-xl p-6 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-amber-300/80 mb-3 font-medium">Beta Prototype</p>
            <p className="text-sm text-white/60 leading-relaxed">
              The Carer Circle is in active beta with intentionally public demonstration content. It is a peer-support and educational resource — not a substitute for medical advice or professional caregiver counselling. If you or your loved one are in crisis, please contact a local emergency line or your healthcare team.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CarerCircle;
