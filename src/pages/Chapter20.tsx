import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import heroImage from "@/assets/chapter20-hero.jpg";

const Chapter20 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: "#0a0a0f" }}>
      <ChapterNavArrows currentPath="/chapter-20" />
      <SEOHead title="Chapter 20: The Next Page - What a Journey" description="Turning to the next page in the ongoing story of recovery." path="/chapter-20" />

      {/* HERO */}
      <section className="relative w-full h-[88vh] overflow-hidden">
        <img
          src={heroImage}
          alt="A hand turning to a fresh blank page in warm amber light"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(10,10,15,0.7)_80%)]" />

        {/* Floating amber motes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 bg-amber-300 rounded-full animate-[float_6s_ease-in-out_infinite] opacity-70 shadow-[0_0_12px_rgba(252,211,77,0.8)]" />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-amber-200 rounded-full animate-[float_8s_ease-in-out_infinite_2s] opacity-60 shadow-[0_0_10px_rgba(252,211,77,0.7)]" />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-amber-400 rounded-full animate-[float_7s_ease-in-out_infinite_1s] opacity-50 shadow-[0_0_14px_rgba(251,191,36,0.7)]" />
          <div className="absolute bottom-1/4 right-1/5 w-1 h-1 bg-amber-300 rounded-full animate-[float_9s_ease-in-out_infinite_3s] opacity-65 shadow-[0_0_10px_rgba(252,211,77,0.7)]" />
        </div>

        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <p className="text-amber-300/80 tracking-[0.4em] uppercase text-xs md:text-sm mb-5 font-light">Chapter Twenty</p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[1.05] tracking-tight">
              The Next<br /><span className="italic text-amber-200">Page</span>
            </h1>
            <div className="mt-8 h-px w-24 bg-gradient-to-r from-amber-400/80 to-transparent" />
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-amber-200/60 text-xs tracking-[0.3em] uppercase animate-pulse">
          Read
        </div>
      </section>

      {/* ARTICLE */}
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="mb-10">
          <Button asChild variant="ghost" className="pl-0 text-white/60 hover:text-amber-200 transition-colors">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to the Library
            </Link>
          </Button>
        </div>

        <article className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-14 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8)]">
          <p className="text-amber-300/70 tracking-[0.3em] uppercase text-xs mb-8 font-light">April 8, 2025</p>

          <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/85 prose-p:leading-[1.85] prose-p:font-light">
            <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none">
              Today's a quiet day—coffee's still off, but the vertigo's dialled back a notch. The Companion app's humming along, rough around the edges but growing, a little piece of me I'm sending out into the world. It's not a cure or a grand fix—just a tool, like this book, to help someone find their footing. I'm not done yet, not by a long shot. Recovery's a marathon, not a sprint, and I'm still lacing up my shoes some days. But I'm here, standing taller than I thought I could.
            </p>

            <p>
              That's the thing about falling apart—you get to decide what to build from the pieces. For me, it's this: a story, an app, a stubborn belief that we're tougher than we realize. I've done everything I can to claw my way back—read the books, faced the shadows, learned the hard way. And I'll keep going, because that's what we do. We adapt. We grow. We write the next page.
            </p>

            <blockquote className="my-12 pl-6 border-l-2 border-amber-400/60 italic text-white/95 font-serif text-xl md:text-2xl leading-relaxed not-prose">
              Now it's your turn. You've got your own road, your own cracks. What'll you make of them? The future's wide open—yours to shape.
            </blockquote>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-14 pt-10 border-t border-white/10">
            <Button asChild variant="outline" className="border-white/20 bg-transparent hover:bg-white/5 hover:border-amber-300/60 text-white/80 hover:text-amber-200 transition-all duration-300">
              <Link to="/chapter-19">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold shadow-[0_10px_40px_-10px_rgba(251,191,36,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(251,191,36,0.8)] transition-all duration-300 hover:scale-105">
              <Link to="/chapter-21">
                Next Chapter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Chapter20;
