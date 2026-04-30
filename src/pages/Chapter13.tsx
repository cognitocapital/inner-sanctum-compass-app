import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import chapter13Hero from "@/assets/chapter13-hero.jpg";

const Chapter13 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter13.mp3", "/audio/chapter13-part2.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-13" />
      <SEOHead title="Chapter 13: The Power of Gratitude - What a Journey" description="Discovering the transformative power of gratitude in recovery." path="/chapter-13" />

      {/* Cinematic hero */}
      <section className="relative w-full h-[88vh] min-h-[560px] overflow-hidden">
        <img
          src={chapter13Hero}
          alt="An open hand and a steaming coffee in morning light — the practice of gratitude"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[fade-in_1.6s_ease-out]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/70 via-transparent to-[#0a0a0f]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(10,10,15,0.7)_100%)]" />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[22%] left-[16%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-[float_6s_ease-in-out_infinite] opacity-60 shadow-[0_0_12px_rgba(245,158,11,0.7)]" />
          <div className="absolute top-[36%] right-[22%] w-1 h-1 bg-amber-300 rounded-full animate-[float_7s_ease-in-out_infinite_1s] opacity-50 shadow-[0_0_10px_rgba(252,211,77,0.6)]" />
          <div className="absolute bottom-[30%] left-[30%] w-2 h-2 bg-amber-500 rounded-full animate-[float_8s_ease-in-out_infinite_2s] opacity-55 shadow-[0_0_14px_rgba(245,158,11,0.6)]" />
          <div className="absolute bottom-[44%] right-[36%] w-1 h-1 bg-amber-300 rounded-full animate-[float_5s_ease-in-out_infinite_3s] opacity-45 shadow-[0_0_8px_rgba(252,211,77,0.5)]" />
          <div className="absolute top-[60%] left-[50%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-[float_9s_ease-in-out_infinite_4s] opacity-40 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto px-6 md:px-10 w-full">
            <div className="mb-6">
              <Button asChild variant="ghost" className="pl-0 text-white/70 hover:text-amber-300 hover:bg-transparent transition-colors">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to the Library
                </Link>
              </Button>
            </div>
            <p className="text-amber-400/80 tracking-[0.3em] text-xs md:text-sm uppercase mb-4 animate-[fade-in_1.2s_ease-out_0.3s_both]">
              Chapter Thirteen
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-4 animate-[fade-in_1.4s_ease-out_0.5s_both] drop-shadow[0_4px_30px_rgba(0,0,0,0.8)]">
              The Power of Gratitude
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl font-light italic animate-[fade-in_1.6s_ease-out_0.7s_both]">
              An open hand, a warm cup, a daughter's report card — the small anchors that held the storm.
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.3em] uppercase animate-pulse">
          Read
        </div>
      </section>

      {/* Editorial article */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <article className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-14 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8)] animate-[fade-in_0.8s_ease-out]">
          <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/80 prose-p:leading-relaxed prose-p:font-light">

            <p className="text-lg leading-relaxed mb-6 first-letter:text-6xl first-letter:font-serif first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1">
              In the midst of the pain, the frustration, and the uncertainty of recovery, there was one thing that consistently lifted my spirits: gratitude. It's easy to say "be grateful" when things are going well, but it's a lot harder to practice when you're facing challenges that seem insurmountable. But I learned that gratitude, even in the darkest of times, can be a powerful source of strength and resilience.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              It wasn't about ignoring the difficulties or pretending that everything was perfect. It was about consciously shifting my focus from what was wrong to what was right. From what I'd lost to what I still had. And what I had was a lot. A loving family, a supportive network of friends, and the simple fact that I was still alive, still breathing, still able to experience the world, even if it was through a different lens.
            </p>

            <blockquote className="my-10 pl-6 border-l-2 border-amber-400/60 italic text-white/90 font-serif text-xl leading-relaxed">
              A moment that stands out is when my eldest daughter, Bailey, received her report card. Straight A's. Every single subject. I was overwhelmed with pride and joy. It wasn't just about the grades themselves, but about what they represented: her hard work, her resilience, her ability to thrive despite the challenges our family had faced. It was a powerful reminder that even in the midst of adversity, there is always something to be grateful for.
            </blockquote>

            <p className="text-lg leading-relaxed mb-6">
              Gratitude became a daily practice. I didn't keep a formal journal, but I made a conscious effort to acknowledge the good things in my life, no matter how small. The warmth of the sun on my skin, a good cup of coffee, a hug from my kids—these simple things, things I might have overlooked before, took on a new significance. I don't see any other way to tackle my life at this point.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Practicing gratitude is closely connected to mindfulness, to being present in the moment. When you're fully present, when you're observing your thoughts and emotions without judgment, it's easier to appreciate the good things, the things that often get lost in the shuffle of daily life. Gratitude wasn't a magic cure, but it was a powerful anchor. It helped me stay grounded during the storm, appreciate the good amidst the bad, and find the strength to keep moving forward, even when the road ahead seemed impossibly long.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-white/10">
            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-amber-400/50 hover:text-amber-300 transition-all duration-300">
              <Link to="/chapter-12">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-105">
              <Link to="/chapter-14">
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

export default Chapter13;
