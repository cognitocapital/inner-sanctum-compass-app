import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import heroImage from "@/assets/chapter15-hero.jpg";

const Chapter15 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter15.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-15" />
      <SEOHead title="Chapter 15: Still Standing - What a Journey" description="Perseverance and resilience through the toughest moments of TBI recovery." path="/chapter-15" />

      {/* Cinematic hero */}
      <div className="relative h-[88vh] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="A solitary figure standing on a coastal cliff at dawn"
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
          <p className="text-amber-300/80 tracking-[0.4em] uppercase text-xs md:text-sm mb-4 font-light">Chapter Fifteen</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.05] mb-6">
            Still <span className="italic text-amber-200/90">Standing</span>
          </h1>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.3em] uppercase animate-pulse">Read</div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24 pb-20">
        <article className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-14 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8)] animate-fade-in">
          <div className="prose prose-invert prose-lg max-w-none font-light text-white/85 leading-[1.85]">

            <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1">
              The road to recovery is rarely a straight line. There are twists and turns, uphill climbs, and unexpected detours. Even now, twelve months after the accident, I still have days when my brain feels like scrambled eggs. It's a frustrating, disorienting sensation, like my thoughts are all jumbled up, my concentration is shot, and the simplest tasks feel overwhelming.
            </p>

            <p>
              When my brain is in "scrambled eggs" mode, it's a clear sign that I've pushed myself too hard, even if I hadn't realized it at the time. It's a reminder that pacing is crucial, even when I'm feeling good, even when I think I'm "back to normal." Because the truth is, "normal" has been redefined.
            </p>

            <p>
              Self-compassion is essential on those difficult days. It's so easy to get frustrated, to beat myself up for not being able to do what I used to do. But I've learned that self-criticism only makes things worse. It adds another layer of stress and negativity to an already challenging situation. So, I try to be kind to myself, to remember that recovery takes time, and that setbacks are a normal part of the process. Some days, getting out of bed and putting on a load of washing is a monumental achievement.
            </p>

            <p>
              On those days, I would sometimes experience a kind of adrenal exhaustion. I'd catch a glimpse of myself in the mirror and see a scared, depleted shadow of a man staring back. It was a stark reminder of the physical and emotional toll this injury has taken. In those moments, I would tell myself,
            </p>

            <blockquote className="my-10 pl-6 border-l-2 border-amber-400/60 italic text-white/90 font-serif text-xl md:text-2xl leading-relaxed not-prose">
              "Everything is okay. You're okay. This will pass."
            </blockquote>

            <p>
              It wasn't about denying the reality of the situation, but about reinforcing a sense of inner safety and stability amidst the turmoil.
            </p>

            <p>
              On days when the world feels overwhelming, I know what I need. I need to slow down, to simplify, to give myself permission to rest. Sometimes, that means cancelling plans, saying no to requests, or simply retreating to a quiet space where I can be alone with my thoughts. It's not always easy, but it's necessary. I have found having a day to myself with no distractions to be priceless.
            </p>

            <p>
              Those days, when my brain feels like scrambled eggs, it's like I've been transported to an alien world. Everything feels foreign, overwhelming, and just… off. I remember one time, I was at a busy butcher shop, and the noise, the crowds, the smells—it all became too much. I felt a panic attack rising, and I nearly had to bolt out of there. It's moments like those that remind me how far I've come, but also how far I still have to go. When I'm free of stress and I don't have to directly respond to anything work-related, I feel much closer to how I did pre-TBI. When things go off track and need important decisions made, it is so difficult if I'm not in the right headspace.
            </p>

            <p>
              The self-care practices that I adopted early on—exercise, nutritious food, good sleep, mindfulness, meditation—are still just as important now as they were in the beginning. They're not just temporary measures; they're lifelong tools for well-being. They're the foundation upon which I continue to build my recovery. Recovery is a marathon, not a sprint. There are still days when my brain feels like scrambled eggs, when the world feels overwhelming, when all I want to do is retreat. But I've learned to be patient with myself, to listen to my body, and to keep practicing the things that I know help me heal. I'm still standing, and that's what matters.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-14 pt-8 border-t border-white/10">
            <Button asChild variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
              <Link to="/chapter-14">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-medium shadow-[0_10px_40px_-10px_rgba(251,191,36,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(251,191,36,0.8)] transition-all duration-500">
              <Link to="/chapter-16">
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

export default Chapter15;
