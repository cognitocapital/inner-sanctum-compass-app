import { ReactNode, useEffect, useRef, useState } from "react";
import { useCinematic3D } from "@/hooks/use-cinematic-3d";

interface CinematicHeroProps {
  image: string;
  alt: string;
  kicker: string;
  title: string;
  quote: ReactNode;
  children?: ReactNode;
  variant?: "cinematic" | "official";
}

/**
 * Layered depth + focus pull cinematic hero.
 * - 3 parallax planes built from the SAME image (no extra network).
 * - Mouse parallax + scroll dolly + slow ambient drift.
 * - Falls back to a static image when reduced motion / toggle off.
 */
export const CinematicHero = ({ image, alt, kicker, title, quote, children }: CinematicHeroProps) => {
  const enabled = useCinematic3D();
  const sectionRef = useRef<HTMLElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const foreRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const scrollY = useRef(0);
  const rafId = useRef<number>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!enabled) return;
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      target.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      target.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
      scrollY.current = progress;
    };

    const tick = () => {
      // ease toward cursor
      mouse.current.x += (target.current.x - mouse.current.x) * 0.06;
      mouse.current.y += (target.current.y - mouse.current.y) * 0.06;
      const { x, y } = mouse.current;
      const dolly = scrollY.current; // 0 -> 1

      if (backRef.current) {
        backRef.current.style.transform =
          `translate3d(${x * -3}px, ${y * -3}px, 0) scale(${1.1 + dolly * 0.04})`;
      }
      if (midRef.current) {
        midRef.current.style.transform =
          `translate3d(${x * -7}px, ${y * -7}px, 0) scale(${1.05 + dolly * 0.08})`;
      }
      if (foreRef.current) {
        foreRef.current.style.transform =
          `translate3d(${x * -14}px, ${y * -14}px, 0) scale(${1.0 + dolly * 0.14})`;
      }
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enabled]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[88vh] min-h-[560px] overflow-hidden bg-black"
    >
      {enabled ? (
        <>
          {/* Deep background plane — slowest, hazy */}
          <div
            ref={backRef}
            className="absolute inset-0 will-change-transform animate-[cinematic-drift_28s_ease-in-out_infinite_alternate]"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(6px) brightness(0.7) saturate(1.1)",
              opacity: 0.85,
              transform: "scale(1.1)",
            }}
          />
          {/* Golden hour glow */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse at 50% 42%, rgba(245,158,11,0.28) 0%, rgba(245,158,11,0.08) 35%, transparent 70%)",
            }}
          />
          {/* Midground plane — the farm */}
          <div
            ref={midRef}
            className="absolute inset-0 will-change-transform animate-[cinematic-drift_22s_ease-in-out_infinite_alternate-reverse]"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(1.5px) brightness(0.85)",
              opacity: 0.9,
              transform: "scale(1.05)",
            }}
          />
          {/* Foreground plane — sharp, dramatic */}
          <div
            ref={foreRef}
            className="absolute inset-0 will-change-transform animate-[cinematic-zoom_24s_ease-in-out_infinite_alternate]"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              filter: "contrast(1.1) saturate(1.05)",
              maskImage:
                "radial-gradient(ellipse 90% 70% at 50% 70%, black 40%, transparent 90%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 90% 70% at 50% 70%, black 40%, transparent 90%)",
            }}
          />
          {/* Embers on foreground plane */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute top-[28%] left-[22%] w-1.5 h-1.5 rounded-full bg-amber-400 blur-[1px] opacity-70 animate-[cinematic-ember-float_9s_ease-in-out_infinite]" />
            <div className="absolute top-[64%] left-[48%] w-2 h-2 rounded-full bg-orange-400 blur-[1.5px] opacity-50 animate-[cinematic-ember-float_13s_ease-in-out_infinite_1.5s]" />
            <div className="absolute top-[44%] left-[72%] w-1 h-1 rounded-full bg-amber-200 blur-[1px] opacity-60 animate-[cinematic-ember-float_11s_ease-in-out_infinite_3s]" />
            <div className="absolute top-[36%] left-[34%] w-2 h-2 rounded-full bg-amber-500 blur-[2px] opacity-45 animate-[cinematic-ember-float_15s_ease-in-out_infinite_0.5s]" />
            <div className="absolute top-[72%] left-[20%] w-1 h-1 rounded-full bg-yellow-300 blur-[1px] opacity-55 animate-[cinematic-ember-float_12s_ease-in-out_infinite_2s]" />
          </div>
        </>
      ) : (
        <img
          src={image}
          alt={alt}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Cinematic vignette + bottom fade for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/70 via-transparent to-[#0a0a0f]/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,15,0.55)_100%)] pointer-events-none" />

      {children}

      <div className="absolute inset-x-0 bottom-0 px-6 pb-16 md:pb-24 z-20">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-12 bg-amber-400/60" />
            <p className="text-amber-300/90 text-xs md:text-sm tracking-[0.4em] uppercase font-light">
              {kicker}
            </p>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl leading-[1.05]">
            {title}
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-white/85 italic max-w-2xl font-serif leading-relaxed">
            {quote}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CinematicHero;