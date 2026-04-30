import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import chapter9Hero from "@/assets/chapter9-hero.jpg";

const Chapter9 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter9.mp3", "/audio/chapter9-part2.mp3", "/audio/chapter9-part3.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-9" />
      <SEOHead title="Chapter 9: The Business Dilemma - What a Journey" description="Balancing career and recovery after a traumatic brain injury." path="/chapter-9" />

      {/* Cinematic hero */}
      <section className="relative w-full h-[88vh] min-h-[560px] overflow-hidden">
        <img
          src={chapter9Hero}
          alt="A lone tradesman on a stormy rooftop — the weight of the business"
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
              Chapter Nine
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-4 animate-[fade-in_1.4s_ease-out_0.5s_both] drop-shadow[0_4px_30px_rgba(0,0,0,0.8)]">
              The Business Dilemma
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl font-light italic animate-[fade-in_1.6s_ease-out_0.7s_both]">
              A vertigo on the rooftop, a tightrope between recovery and the relentless demands of work.
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
              The accident had thrown my personal life into disarray, but there was another major area that demanded my attention: my business. I couldn't just let it fall by the wayside. I'd worked too hard for too long to let it crumble. But how do you run a business when you can barely string a coherent sentence together? The doctors had been very clear: "Don't stress your brain." But what did that even mean when you're a business owner? Every decision, every email, every phone call felt like a monumental task. I was constantly torn between the need to rest and recover and the relentless demands of my work. I was, as I've mentioned before, doing more than I should be doing.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              The pressure was immense. I was terrified of making mistakes, of letting down my clients, of jeopardizing the future of my business. And with my cognitive function still impaired, the fear of screwing up was even more intense. It was a vicious cycle: the more stressed I got, the harder it was to think clearly, and the more likely I was to make mistakes. After much soul-searching, I made the difficult decision to restructure my business. It was the only way I could see to alleviate some of the pressure and create a more sustainable situation for myself. This involved having some tough conversations and making significant changes to how things were run.
            </p>

            <blockquote className="my-10 pl-6 border-l-2 border-amber-400/60 italic text-white/90 font-serif text-xl leading-relaxed">
              One of the hardest parts was figuring out what to do about my most trusted employee. I couldn't just leave him high and dry. He'd been with me through thick and thin, and I felt a deep sense of responsibility to him. So, I set about finding him a new job, with the same rate of pay, somewhere he could continue to use his skills and experience. It was a stressful process, but it was important to me to do right by him. Letting go wasn't just logistical—it was emotional. Guilt gnawed at me, but I knew it was necessary. Resilience isn't just surviving; it's adapting, even when it bloody hurts.
            </blockquote>

            <p className="text-lg leading-relaxed mb-6">
              Even with the restructuring, which I had no choice but to do due to my inability to concentrate for long periods, my ability to process things and make decisions, dealing with subcontractors, still having to do lots of work for less money—not to mention the matter of vertigo and heights aren't a good combination from a health and safety point of view—there were times that felt like I was drowning. I remember one particular job, installing valleys on a roof. It was a complex job, not a standard setup at all, and it required my expertise. I pushed myself to be there, to oversee the work, but it was a huge mistake. Midway through the day, I started to have an anxiety attack. My heart was racing, my chest felt tight, and I felt a sense of overwhelming panic. My hands were shaking, breath catching as I tried to steady myself. I knew I had to get out of there. I went for a walk, trying to calm myself down. My dad came and picked me up, suggesting we grab a coffee, and I distinctly remember him saying that I should leave the job and do it another day. In my head, I knew he was right. But I also knew that the boys were likely at the point of no return. The way the valleys were designed, once we'd started, we couldn't just walk away. We had to finish the job, or any rain would be directed straight into the roof cavity.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              I ended up staying, helping where I could. It was a long, gruelling day, and by the end of it, I was completely shattered. My head pounded, my body ached, and my mind was a mess. I'd pushed myself far beyond my limits, and I paid the price for it in the days and weeks that followed. It was a stark reminder that I was still very much in recovery, that I couldn't just power through things like I used to. The weight of the business during those early months was immense. It felt like I was constantly walking a tightrope, trying to balance my own needs with the needs of my employees and clients. It was a painful but necessary lesson in learning to let go, to delegate, and to prioritize my own well-being.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-white/10">
            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-amber-400/50 hover:text-amber-300 transition-all duration-300">
              <Link to="/chapter-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-105">
              <Link to="/chapter-10">
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

export default Chapter9;
