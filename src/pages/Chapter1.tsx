import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import chapter1Hero from "@/assets/chapter1-hero.jpg";

const Chapter1 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter1.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-1" />
      <SEOHead title="Chapter 1: Australia Day - What a Journey" description="The story begins on Australia Day in Michael Heron's TBI recovery memoir." path="/chapter-1" />

      {/* Cinematic hero — the Australia Day farm property, the suspended moment */}
      <section className="relative w-full h-[88vh] min-h-[560px] overflow-hidden">
        <img
          src={chapter1Hero}
          alt="A lone electric skateboard rests on a long bitumen driveway beside a still farm dam at golden hour, gum trees casting long shadows across a Sunshine Coast Hinterland property — the suspended moment before everything changed."
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[fade-in_1.6s_ease-out]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/70 via-transparent to-[#0a0a0f]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,15,0.55)_100%)]" />

        {/* Drifting embers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-[18%] w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-[float_6s_ease-in-out_infinite] opacity-70" />
          <div className="absolute top-1/3 left-[32%] w-1 h-1 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.7)] animate-[float_7s_ease-in-out_infinite_1s] opacity-60" />
          <div className="absolute top-2/3 left-[24%] w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.8)] animate-[float_8s_ease-in-out_infinite_2s] opacity-65" />
          <div className="absolute top-1/2 left-[48%] w-1 h-1 rounded-full bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.7)] animate-[float_9s_ease-in-out_infinite_3s] opacity-55" />
          <div className="absolute bottom-1/4 right-[32%] w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-[float_7s_ease-in-out_infinite_4s] opacity-60" />
        </div>

        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-5 animate-fade-in">
              <div className="h-px w-12 bg-amber-400/60" />
              <p className="text-amber-300/90 text-xs md:text-sm tracking-[0.4em] uppercase font-light">
                Chapter One · 26 January 2024
              </p>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl animate-fade-in leading-[1.05]">
              Australia Day
            </h1>
            <p className="mt-6 text-lg md:text-2xl text-white/85 italic max-w-2xl animate-fade-in font-serif leading-relaxed">
              "This is what life's all about." — A fleeting thought, before the blackness.
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-amber-200/60 animate-[float_3s_ease-in-out_infinite]">
          <span className="text-[10px] tracking-[0.3em] uppercase">Read</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* Ambient ember field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        {/* Primary flame particles */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-80 shadow-lg shadow-orange-500/50"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1s] opacity-60 shadow-lg shadow-orange-500/40"></div>
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2s] opacity-70 shadow-lg shadow-orange-500/45"></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_3s] opacity-50 shadow-lg shadow-orange-500/35"></div>
        <div className="absolute top-1/3 left-1/6 w-1.5 h-1.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.5s] opacity-45 shadow-lg shadow-orange-500/30"></div>
        <div className="absolute bottom-1/3 right-1/6 w-1 h-1 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2.5s] opacity-35 shadow-lg shadow-orange-500/25"></div>
        <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.5s] opacity-55 shadow-lg shadow-orange-500/40"></div>
        
        {/* Additional ember particles */}
        <div className="absolute top-32 left-1/5 w-1 h-1 bg-yellow-400 rounded-full animate-[float_4s_ease-in-out_infinite_4s] opacity-40"></div>
        <div className="absolute top-56 right-1/4 w-1.5 h-1.5 bg-red-400 rounded-full animate-[float_4s_ease-in-out_infinite_5s] opacity-35"></div>
        <div className="absolute bottom-72 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-[float_4s_ease-in-out_infinite_6s] opacity-30"></div>
        <div className="absolute bottom-24 right-1/6 w-1.5 h-1.5 bg-orange-500 rounded-full animate-[float_4s_ease-in-out_infinite_7s] opacity-45"></div>
        <div className="absolute top-1/4 right-1/8 w-1 h-1 bg-red-500 rounded-full animate-[float_4s_ease-in-out_infinite_8s] opacity-40"></div>
        
        {/* Subtle flame trails */}
        <div className="absolute top-16 left-1/2 w-0.5 h-8 bg-gradient-to-t from-orange-500/60 to-transparent animate-[float_3s_ease-in-out_infinite_3.5s] opacity-30"></div>
        <div className="absolute bottom-32 right-1/2 w-0.5 h-6 bg-gradient-to-t from-orange-500/50 to-transparent animate-[float_3s_ease-in-out_infinite_4.5s] opacity-25"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in px-4 py-12 md:py-20">
        <div className="mb-10">
          <Button asChild variant="ghost" className="pl-0 text-amber-200/70 hover:text-amber-200 hover:bg-transparent transition-colors">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to the Library
            </Link>
          </Button>
        </div>

        {/* Glassmorphic editorial card */}
        <article className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_60px_rgba(245,158,11,0.08)] p-8 md:p-14 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <p className="text-amber-300/70 text-xs tracking-[0.4em] uppercase mb-4 text-center">Chapter One</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-center text-white mb-3">
              Australia Day
            </h2>
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="h-px w-8 bg-amber-400/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
              <div className="h-px w-8 bg-amber-400/40" />
            </div>

            <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/80 prose-p:leading-[1.85] prose-p:font-light">
              <p className="first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9] first-letter:mt-1">
              Australia Day dawned bright and clear; the sun was already warm on my skin. We were at a mate's country property in the Sunshine Coast Hinterland. It was shaping up to be a very memorable day, regardless of the events that were about to unfold. The weather was glorious, a gentle breeze rustling the leaves of the gum trees, good food, a carefree day where everyone could do what they wanted—whether it be swimming in the pool, swinging and jumping into the dam, or taking the kids down to feed the animals. They have chickens, turkeys, ducks, geese, pigeons, and cows—Betty is our favourite. Whenever we go up to their place, the kids absolutely love their time at the farm, as we all do.
            </p>

            <p>
              A few of us were keen to try out the BMX jump into the dam—nothing serious, just a bit of fun. We were all just enjoying each other's company, soaking up the sunshine and the laid-back Aussie vibes. I remember thinking to myself, "This is what life's all about." A fleeting thought, perhaps, but one that, in hindsight, feels oddly significant. I had no idea that this would be my last moment of bliss before my world turned upside down.
            </p>

            <blockquote className="not-prose my-10 border-l-2 border-amber-400/60 pl-6 py-2">
              <p className="text-xl md:text-2xl font-serif italic text-amber-100/90 leading-relaxed">
                "And then… nothing but blackness and a void for possibly hours."
              </p>
            </blockquote>

            <p>
              Later in the afternoon, I decided to cruise up and down the driveway on my electric skateboard. It was a spur-of-the-moment thing. The driveway stretched at least 100 metres, a gentle slope that seemed perfect for a leisurely ride. I was simply weaving my way up, enjoying the feel of the board beneath my feet, when suddenly, my wheels came off the bitumen and bit into the grass. The board lost momentum instantly, but I kept going, flung forward into the air. And then… nothing but blackness and a void for possibly hours. It was as if my memory reel had been abruptly snipped, leaving a gaping hole in the film of my life. That's where this part of the journey begins, in the blank space between a perfect Australia Day and the harsh reality of what came next.
            </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-14 pt-8 border-t border-white/10">
              <Button asChild variant="outline" className="border-amber-400/30 bg-transparent text-amber-100 hover:bg-amber-400/10 hover:border-amber-400/60 hover:text-amber-50 transition-all duration-300">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-[1.02]">
                <Link to="/chapter-2">
                  Next Chapter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Chapter1;