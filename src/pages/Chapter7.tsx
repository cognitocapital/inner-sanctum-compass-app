import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import chapter7Hero from "@/assets/chapter7-hero.jpg";

const Chapter7 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter7.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-7" />
      <SEOHead title="Chapter 7: Mind Games - What a Journey" description="Confronting the cognitive challenges of brain injury recovery." path="/chapter-7" />

      {/* Cinematic hero */}
      <section className="relative w-full h-[88vh] min-h-[560px] overflow-hidden">
        <img
          src={chapter7Hero}
          alt="A cluttered desk lit by a glowing laptop — cognitive fog and lost focus"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[fade-in_1.6s_ease-out]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/70 via-transparent to-[#0a0a0f]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(10,10,15,0.7)_100%)]" />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[14%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-[float_6s_ease-in-out_infinite] opacity-60 shadow-[0_0_12px_rgba(245,158,11,0.7)]" />
          <div className="absolute top-[34%] right-[20%] w-1 h-1 bg-amber-300 rounded-full animate-[float_7s_ease-in-out_infinite_1s] opacity-50 shadow-[0_0_10px_rgba(252,211,77,0.6)]" />
          <div className="absolute bottom-[30%] left-[28%] w-2 h-2 bg-amber-500 rounded-full animate-[float_8s_ease-in-out_infinite_2s] opacity-55 shadow-[0_0_14px_rgba(245,158,11,0.6)]" />
          <div className="absolute bottom-[42%] right-[34%] w-1 h-1 bg-amber-300 rounded-full animate-[float_5s_ease-in-out_infinite_3s] opacity-45 shadow-[0_0_8px_rgba(252,211,77,0.5)]" />
          <div className="absolute top-[58%] left-[48%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-[float_9s_ease-in-out_infinite_4s] opacity-40 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
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
              Chapter Seven
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-4 animate-[fade-in_1.4s_ease-out_0.5s_both] drop-shadow[0_4px_30px_rgba(0,0,0,0.8)]">
              Mind Games
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl font-light italic animate-[fade-in_1.6s_ease-out_0.7s_both]">
              Brain fog, broken focus, and the quiet humiliation of forgetting how to send an email.
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
              The physical pain of the injury—the headaches, the vertigo—those were tough, no doubt. But the mental challenges, the "mind games" my brain was playing on me, those were in a different league altogether. It was like wading through a thick fog, a constant state of mental fuzziness that made even the simplest tasks feel like climbing Mount Everest.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              My ability to concentrate had taken a major hit. I could be in the middle of something, like working on a quote for a client, and suddenly, my brain would just… shut down. It wasn't just fatigue; it was like a switch had been flipped. I'd have to close my laptop, walk away, and do something completely different, just to give my brain a chance to reset. Interruptions were another major problem. The slightest distraction—a question from one of the kids, a phone call, even just trying to remove a highlight from a document—could completely derail my train of thought, leaving me frustrated and struggling to regain my focus.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              My memory wasn't much better. I'd walk into a room and forget why I was there. I'd struggle to recall words, names, appointments. It was like my brain was a sieve, information just slipping through the holes. It was impacting my ability to run my business. My executive function—my ability to plan, organize, make decisions, and manage my time—was nowhere near where it was pre-accident. I felt like an underperforming employee in my own life, constantly falling short of my own expectations.
            </p>

            <blockquote className="my-10 pl-6 border-l-2 border-amber-400/60 italic text-white/90 font-serif text-xl leading-relaxed">
              One incident, in particular, stands out as a stark example of just how impaired I was. I was trying to send an email, a simple task I'd done thousands of times before. But I couldn't, for the life of me, figure out how to open a new message, how to create an email. I sat there, staring at the screen, feeling a mix of frustration and disbelief. It was embarrassing, to be honest. To be so utterly defeated by something so basic.
            </blockquote>

            <p className="text-lg leading-relaxed mb-8">
              These cognitive challenges weren't just frustrating; they were chipping away at my sense of self. I was used to being capable, efficient, on top of things. Now, I felt like a shadow of my former self, struggling to keep up with the demands of daily life, let alone the complexities of running a business. Those cognitive challenges were some of the most insidious aspects of the injury. They chipped away at my confidence, my sense of self. But they also taught me the importance of patience, persistence, and adapting to a new way of working and thinking.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-white/10">
            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-amber-400/50 hover:text-amber-300 transition-all duration-300">
                <Link to="/chapter-6">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Chapter
                </Link>
              </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-105">
                <Link to="/chapter-8">
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

export default Chapter7;
