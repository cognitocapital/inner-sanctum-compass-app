import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import heroImage from "@/assets/chapter19-hero.jpg";

const Chapter19 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter19.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-19" />
      <SEOHead title="Chapter 19: A New Resource - What a Journey" description="Discovering new resources and support for TBI recovery." path="/chapter-19" />

      {/* Cinematic hero */}
      <div className="relative h-[88vh] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="An open book with brain illustration under a brass lamp"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(10,10,15,0.55)_55%,_#0a0a0f_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/40 via-transparent to-[#0a0a0f]" />

        {/* Floating amber motes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-[15%] w-1.5 h-1.5 rounded-full bg-amber-300/70 shadow-[0_0_12px_2px_rgba(252,211,77,0.6)] animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 right-[20%] w-1 h-1 rounded-full bg-amber-200/60 shadow-[0_0_10px_2px_rgba(252,211,77,0.5)] animate-[float_7s_ease-in-out_infinite_1.2s]" />
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-amber-300/60 shadow-[0_0_10px_2px_rgba(252,211,77,0.5)] animate-[float_8s_ease-in-out_infinite_2s]" />
          <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-200/70 shadow-[0_0_14px_3px_rgba(252,211,77,0.5)] animate-[float_9s_ease-in-out_infinite_3s]" />
        </div>

        <div className="absolute top-6 left-6 z-10">
          <Button asChild variant="ghost" className="text-white/80 hover:text-white hover:bg-white/5 backdrop-blur-md">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to the Library
            </Link>
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-20 md:pb-28 text-center">
          <p className="text-amber-300/80 tracking-[0.4em] uppercase text-xs md:text-sm mb-4 font-light">Chapter Nineteen</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.05] mb-6">
            A New <span className="italic text-amber-200/90">Resource</span>
          </h1>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.3em] uppercase animate-pulse">Read</div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24 pb-20">
        <article className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-14 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8)] animate-fade-in">
          <div className="prose prose-invert prose-lg max-w-none font-light text-white/85 leading-[1.85]">

            <p className="italic text-amber-300/70 tracking-[0.3em] uppercase text-xs mb-8 not-prose">
              April 1, 2025
            </p>

            <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1">
              Recovery has a way of catching you off guard, even when you think you've found your footing. On April 1, 2025, I picked up Daniel Amen's Change Your Brain Every Day. It wasn't planned—just a book that landed in my lap and felt like it belonged there, like life giving me a sly nudge. I didn't expect much at first. I've waded through plenty of advice since the accident, some of it gold, some of it noise. But then Amen started talking about brains—battered ones, like those of NFL players he'd studied, scarred by concussions and CTE. That stopped me cold. My skull fractures aren't the same as a linebacker's war wounds, but the language of a scrambled mind? That's a dialect I speak fluently.
            </p>

            <p>
              What hooked me was his take on neuroplasticity—how our brains can rewire, rebuild, even after the worst hits. It wasn't news to me, not exactly. I've been clinging to that hope since the day my world flipped upside down, when coffee started tasting like rust and regret, and vertigo turned every step into a gamble. But hearing it from a bloke who's mapped thousands of broken brains, who's seen the wreckage of CTE up close, made it real in a new way. He wasn't peddling quick fixes—no kale smoothies or miracle cures—just a quiet insistence that no brain's too far gone.
            </p>

            <blockquote className="my-10 pl-6 border-l-2 border-amber-400/60 italic text-white/90 font-serif text-xl md:text-2xl leading-relaxed not-prose">
              That's not optimism. That's a lifeline.
            </blockquote>

            <p>
              The book didn't rewrite my playbook. Mindfulness, gratitude, facing the hard stuff—they're still the bedrock I stand on. But it tossed me a few extra tools. Slow breathing to tame the chaos, a nudge to stay in the moment—stuff I'd been doing by instinct, now backed by science. It even got me thinking about the Companion app I've been shaping. Amen's words clicked as I tinkered with it, building something to share the light I'd stumbled into. Recovery's not a straight shot or a finished story—it's alive, messy, full of detours. And this book, landing when it did, felt like a nod from the universe: keep going. There's more to learn, more ways to mend.
            </p>

            <p>
              The accident cracked me open—literally—and it hurt like hell. But it let light in too. It forced me to see myself, and the world, through a different lens. Now, as I pass this story to you, I hope it cracks something open in you too. Not to break you, but to show you what's possible. Because our stories don't end—they stretch out, unwritten and wild, and that's where the good stuff lives. That's where resilience takes root and setbacks are a chance to grow. As I tried to hold it all together, these cracks were starting to show, and I didn't realize how close I was to breaking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-14 pt-8 border-t border-white/10">
            <Button asChild variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
              <Link to="/chapter-18">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-medium shadow-[0_10px_40px_-10px_rgba(251,191,36,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(251,191,36,0.8)] transition-all duration-500">
              <Link to="/chapter-20">
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

export default Chapter19;
