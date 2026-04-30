import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import chapter5Hero from "@/assets/chapter5-hero.jpg";

const Chapter5 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter5.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-5" />
      <SEOHead title="Chapter 5: Choose Your Own Adventure - What a Journey" description="Taking control of the recovery path and choosing how to move forward." path="/chapter-5" />

      {/* Cinematic hero */}
      <section className="relative w-full h-[88vh] min-h-[560px] overflow-hidden">
        <img
          src={chapter5Hero}
          alt="A forking road at sunrise — neuroplasticity and the choice to rebuild"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[fade-in_1.6s_ease-out]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/70 via-transparent to-[#0a0a0f]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(10,10,15,0.7)_100%)]" />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-[float_6s_ease-in-out_infinite] opacity-60 shadow-[0_0_12px_rgba(245,158,11,0.7)]" />
          <div className="absolute top-[36%] right-[22%] w-1 h-1 bg-amber-300 rounded-full animate-[float_7s_ease-in-out_infinite_1s] opacity-50 shadow-[0_0_10px_rgba(252,211,77,0.6)]" />
          <div className="absolute bottom-[32%] left-[24%] w-2 h-2 bg-amber-500 rounded-full animate-[float_8s_ease-in-out_infinite_2s] opacity-55 shadow-[0_0_14px_rgba(245,158,11,0.6)]" />
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
              Chapter Five
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-4 animate-[fade-in_1.4s_ease-out_0.5s_both] drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              Choose Your Own Adventure
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl font-light italic animate-[fade-in_1.6s_ease-out_0.7s_both]">
              On neuroplasticity, agency, and the power to install a new operating system.
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
              I didn't know it at first, but I was about to begin a long recovery—at first, it was one day at a time, but then I had to learn how much it was up to me to get through it. I had to accept my brain was damaged, and there were many steps in learning how to fix it. This part is way easier said than done. A near-death experience can change you for better or worse, and I had to choose the outcome.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              My doctors did their best to help me, but I also researched online to find out more, including information from Dr. Joe Dispenza, who is a New York Times best-selling author, researcher, and lecturer. He talks about your brain reprogramming after a near-death experience, like TBI. From what I learned from his publications, he gave me inspiration in my recovery. I believe in the opportunity to install a new operating system in my mind, one which leaves the old obsolete. Here is how I rewrote my programming.
            </p>

            <blockquote className="my-10 pl-6 border-l-2 border-amber-400/60 italic text-white/90 font-serif text-xl leading-relaxed">
              But what does that even mean? I chose my own adventure after my traumatic brain injury. It started with believing that my brain has an incredible capacity to heal and rewire itself—a phenomenon called neuroplasticity. Based on my research, I thought of my brain as a vast network of roads. After my TBI, it's like a major accident has blocked some of those roads. But my brain, like a skilled engineer, can create new pathways and detours to get around those blockages.
            </blockquote>

            <p className="text-lg leading-relaxed mb-6">
              This "reprogramming" is about consciously choosing which roads to build and strengthen. It's about focusing on the positive, cultivating new habits, and embracing the opportunity for growth that this experience presents. It's not about denying the challenges or pretending everything is okay. It's about acknowledging the difficulties, accepting them, and then choosing to move forward with intention and purpose.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Cultivating a positive mindset, nurturing my emotional well-being, and connecting with my inner strength is important. It's about finding gratitude in adversity and choosing to see the light even in the darkest of times. This journey was not easy. There were setbacks, frustrations, and moments of doubt. But by embracing the power of choice, I navigated this new landscape and created a life that is even richer and more meaningful than before.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-white/10">
            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-amber-400/50 hover:text-amber-300 transition-all duration-300">
                <Link to="/chapter-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Chapter
                </Link>
              </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-105">
                <Link to="/chapter-6">
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

export default Chapter5;
