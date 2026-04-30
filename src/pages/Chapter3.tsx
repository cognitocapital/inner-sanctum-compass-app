import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import chapter3Hero from "@/assets/chapter3-hero.jpg";

const Chapter3 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter3.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-3" />
      <SEOHead title="Chapter 3: The Gun to My Head - What a Journey" description="Facing life-or-death moments during TBI recovery." path="/chapter-3" />

      {/* Cinematic hero */}
      <section className="relative w-full h-[88vh] min-h-[560px] overflow-hidden">
        <img
          src={chapter3Hero}
          alt="A solitary silhouette at twilight — the weight of early TBI recovery at home"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[fade-in_1.6s_ease-out]"
        />
        {/* Color grading layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/70 via-transparent to-[#0a0a0f]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(10,10,15,0.7)_100%)]" />

        {/* Drifting embers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[12%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-[float_6s_ease-in-out_infinite] opacity-60 shadow-[0_0_12px_rgba(245,158,11,0.7)]" />
          <div className="absolute top-[35%] right-[18%] w-1 h-1 bg-amber-300 rounded-full animate-[float_7s_ease-in-out_infinite_1s] opacity-50 shadow-[0_0_10px_rgba(252,211,77,0.6)]" />
          <div className="absolute bottom-[28%] left-[28%] w-2 h-2 bg-amber-500 rounded-full animate-[float_8s_ease-in-out_infinite_2s] opacity-55 shadow-[0_0_14px_rgba(245,158,11,0.6)]" />
          <div className="absolute bottom-[40%] right-[32%] w-1 h-1 bg-amber-300 rounded-full animate-[float_5s_ease-in-out_infinite_3s] opacity-45 shadow-[0_0_8px_rgba(252,211,77,0.5)]" />
          <div className="absolute top-[55%] left-[45%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-[float_9s_ease-in-out_infinite_4s] opacity-40 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
        </div>

        {/* Hero copy */}
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
              Chapter Three
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-4 animate-[fade-in_1.4s_ease-out_0.5s_both] drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              The Gun to My Head
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl font-light italic animate-[fade-in_1.6s_ease-out_0.7s_both]">
              On surviving the first weeks home — and the invisible pressure that never let go.
            </p>
          </div>
        </div>

        {/* Scroll cue */}
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
              Leaving the hospital felt less like a release and more like stepping into a different kind of battle zone. Gone were the sterile white walls and the rhythmic beeping of monitors, replaced by the familiar chaos of home life. But "home" felt different now, altered in a way I couldn't quite grasp. I was home, but I wasn't myself.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Those first few weeks were a blur of raw emotion and overwhelming fatigue. I was in survival mode, just trying to make it through each day, each hour, each minute. It felt like I was constantly on edge, like there was an invisible gun to my head, holstered "for now." The pressure was immense, the fear that any wrong move, any lapse in concentration, could send me spiralling back to square one.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              My emotions were all over the place, a chaotic rollercoaster that I couldn't seem to control. One minute I'd be fine, the next I'd be overwhelmed by a wave of anxiety or frustration. Tears would come out of nowhere, triggered by the smallest things. I remember one night, about six months in, lying next to my youngest daughter, Harper, as she drifted off to sleep. I was trying to be quiet, but the tears started rolling down my cheeks—tears of gratitude for how much I'd achieved in this seemingly impossible situation, for the personal victories I'd clawed out. I can't articulate that exact sense of gratitude; it's bloody hard to paint the picture of what it was like. Mixed with exhaustion, I didn't want to wake her, didn't want to explain why Daddy was crying. Truth is, they were happy tears.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              The emotional rollercoaster was one of the hardest things to deal with. I was easily overwhelmed, and the anxiety came and went like a bad dream. When it did, it was like falling into a pit I couldn't climb out of. It was affecting everyone around me, especially my wife and kids. They were walking on eggshells, trying to navigate my unpredictable moods, my sudden bursts of frustration, my inability to cope with things that used to be simple.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              My brain felt like it was constantly misfiring. Simple tasks became monumental challenges. I remember struggling to spell the word "writing" at one point. "Writing," a word I'd used countless times before. It was like my brain had short-circuited; the connections severed. I had the mental capacity of a goldfish and the energy reserves of a sloth. It was a fight just to survive, to get through each day without collapsing in a heap.
            </p>

            <blockquote className="my-10 pl-6 border-l-2 border-amber-400/60 italic text-white/90 font-serif text-xl leading-relaxed">
              This isn't a story about sympathy, though. Not at all. I don't want it. I want this to be a story about hope, about resilience. If one person can read this and feel like they're not alone on their journey, then it's worth it. If some of the things I've implemented can help someone else navigate their own recovery, that's a victory. I know I've already said this in my story, but my recovery from TBI is by far the hardest thing I've had to navigate in my entire life. How could someone possibly understand what it's like to have a brain injury when no two brain injuries are the same, and we could argue that no two brains are the same either?
            </blockquote>

            <p className="text-lg leading-relaxed mb-8">
              Those early days at home were some of the darkest. It felt like I was constantly on edge, fighting an invisible battle within myself. But even then, in the midst of the struggle, I knew I had to keep going, for myself and for my family.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-white/10">
            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-amber-400/50 hover:text-amber-300 transition-all duration-300">
                <Link to="/chapter-2">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Chapter
                </Link>
              </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-105">
                <Link to="/chapter-4">
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

export default Chapter3;
