import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import heroImage from "@/assets/chapter21-hero.jpg";

const Chapter21 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: "#0a0a0f" }}>
      <ChapterNavArrows currentPath="/chapter-21" />
      <SEOHead title="Acknowledgments - What a Journey" description="With gratitude — acknowledgments for What a Journey by Michael Heron." path="/chapter-21" />

      {/* HERO */}
      <section className="relative w-full h-[88vh] overflow-hidden">
        <img
          src={heroImage}
          alt="A single lit candle surrounded by warm golden bokeh"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(10,10,15,0.7)_80%)]" />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 bg-amber-300 rounded-full animate-[float_6s_ease-in-out_infinite] opacity-70 shadow-[0_0_12px_rgba(252,211,77,0.8)]" />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-amber-200 rounded-full animate-[float_8s_ease-in-out_infinite_2s] opacity-60 shadow-[0_0_10px_rgba(252,211,77,0.7)]" />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-amber-400 rounded-full animate-[float_7s_ease-in-out_infinite_1s] opacity-50 shadow-[0_0_14px_rgba(251,191,36,0.7)]" />
          <div className="absolute bottom-1/4 right-1/5 w-1 h-1 bg-amber-300 rounded-full animate-[float_9s_ease-in-out_infinite_3s] opacity-65 shadow-[0_0_10px_rgba(252,211,77,0.7)]" />
        </div>

        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <p className="text-amber-300/80 tracking-[0.4em] uppercase text-xs md:text-sm mb-5 font-light">With Gratitude</p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[1.05] tracking-tight">
              Acknowled<span className="italic text-amber-200">gments</span>
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
          <p className="text-amber-300/70 tracking-[0.3em] uppercase text-xs mb-8 font-light">A Note of Thanks</p>

          <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/85 prose-p:leading-[1.85] prose-p:font-light">
            <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none">
              This book would not have been possible without the unwavering love, support, and encouragement of many people. I am eternally grateful to:
            </p>

            <ul className="list-none space-y-5 pl-0 not-prose text-white/85 text-lg leading-[1.85] font-light">
              <li className="pl-6 border-l border-amber-400/40"><span className="text-amber-200 font-serif">My wife, Sarah,</span> for her strength, her patience, her advocacy, and for simply being there through it all. You are my rock.</li>
              <li className="pl-6 border-l border-amber-400/40"><span className="text-amber-200 font-serif">My children,</span> for their unconditional love and for inspiring me to keep fighting every single day.</li>
              <li className="pl-6 border-l border-amber-400/40"><span className="text-amber-200 font-serif">My parents,</span> for their constant support and understanding.</li>
              <li className="pl-6 border-l border-amber-400/40"><span className="text-amber-200 font-serif">My twin brother, Mathew,</span> for the "use of his frontal lobe," his unwavering support, and our invaluable daily check-ins.</li>
              <li className="pl-6 border-l border-amber-400/40"><span className="text-amber-200 font-serif">My extended family and friends,</span> for surrounding me with love and encouragement.</li>
              <li className="pl-6 border-l border-amber-400/40"><span className="text-amber-200 font-serif">The medical professionals</span> who guided me on this journey, especially the doctor who insisted on those crucial scans and my ENT specialist for his expertise.</li>
              <li className="pl-6 border-l border-amber-400/40"><span className="text-amber-200 font-serif">The team at BIRU,</span> for confirming that I was on the right track. Grace, I'm truly grateful for the sanctuary that your office is, for giving that "sprouting seed" everything it needed to grow.</li>
              <li className="pl-6 border-l border-amber-400/40"><span className="text-amber-200 font-serif">Wendy,</span> for your insightful guidance and for helping me find a deeper meaning in this experience.</li>
              <li className="pl-6 border-l border-amber-400/40"><span className="text-amber-200 font-serif">Eckhart Tolle and Dan Brulé,</span> for their teachings on presence, the observer, and the power of the breath.</li>
            </ul>

            <blockquote className="my-12 pl-6 border-l-2 border-amber-400/60 italic text-white/95 font-serif text-xl md:text-2xl leading-relaxed not-prose">
              And to all those who have shared their stories of TBI recovery, thank you for your courage and for reminding me that I am not alone.
            </blockquote>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-14 pt-10 border-t border-white/10">
            <Button asChild variant="outline" className="border-white/20 bg-transparent hover:bg-white/5 hover:border-amber-300/60 text-white/80 hover:text-amber-200 transition-all duration-300">
              <Link to="/chapter-20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold shadow-[0_10px_40px_-10px_rgba(251,191,36,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(251,191,36,0.8)] transition-all duration-300 hover:scale-105">
              <Link to="/">
                Table of Contents
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Chapter21;
