import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import heroImage from "@/assets/chapter14-hero.jpg";

const Chapter14 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter14.mp3", "/audio/chapter14-part2.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-14" />
      <SEOHead title="Chapter 14: The Universe's Message - What a Journey" description="Finding meaning and messages from the universe during recovery." path="/chapter-14" />

      {/* Cinematic hero */}
      <div className="relative h-[88vh] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Sunlight streaming into a quiet healing room"
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
          <p className="text-amber-300/80 tracking-[0.4em] uppercase text-xs md:text-sm mb-4 font-light">Chapter Fourteen</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.05] mb-6">
            The Universe's<br />
            <span className="italic text-amber-200/90">Message</span>
          </h1>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.3em] uppercase animate-pulse">Read</div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24 pb-20">
        <article className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-14 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8)] animate-fade-in">
          <div className="prose prose-invert prose-lg max-w-none font-light text-white/85 leading-[1.85]">

            <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1">
              Sometimes, it takes a major disruption, a metaphorical earthquake, to shake us out of our complacency and force us to re-evaluate our lives. For me, that earthquake was a literal blow to the head. But in the aftermath of the accident, amidst the pain and the uncertainty, I began to glimpse a deeper meaning, a message from the universe, if you will.
            </p>

            <p>
              It was during a session with Wendy, a Bowen therapist and spiritual healer, that this message began to take shape. I'd gone to her seeking relief from the physical tension I was carrying, but what I found was something much more profound. I was initially sceptical but open to alternative healing modalities. Wendy, with her gentle demeanour and insightful questions, had a way of cutting through the noise and getting to the heart of the matter.
            </p>

            <p>
              As she worked on my body, we talked. She explained how she had hurt her back and saw it as the universe forcing her to stop. She had unresolved emotions relating to her late husband, who had passed a year or so prior. She believed those unresolved emotions were the root cause of her physical ailment. Then, she asked me a question that stopped me in my tracks:
            </p>

            <blockquote className="my-10 pl-6 border-l-2 border-amber-400/60 italic text-white/90 font-serif text-xl md:text-2xl leading-relaxed not-prose">
              "What was the purpose of your injury? Why did you need to stop?"
            </blockquote>

            <p>
              At first, the question felt too big, too complicated to answer. I fumbled for a response, unsure of what she was getting at. But as I reflected on it, as I allowed the question to sink in, a realization began to dawn on me. Wendy, like my psychiatrist, affirmed that I was doing well in my recovery, and both suggested I was operating at a higher level of consciousness than before the accident.
            </p>

            <p>
              Before the accident, I was living a relatively unconscious life. I was caught up in the busyness of work, family, and the daily grind. I was going through the motions, not really paying attention to the deeper currents of my life. The accident, as devastating as it was, forced me to stop, to turn inward, to re-evaluate my priorities. It was a wake-up call, a harsh but necessary reminder that I wasn't living as fully, as consciously, as I could be. It forced me to slow down. And then it hit me, the answer to Wendy's question. The purpose of my injury, the reason I needed to stop, was to wake up. To become more aware, more present, more conscious. And to use my experience to help others do the same. That's why I'm writing this book—to share my journey, to offer what I've learned in the hope that it might help someone else navigate their own path to healing.
            </p>

            <p>
              That conversation with Wendy was a turning point. It helped me see my accident not as a tragedy, but as an opportunity—a chance to wake up, to live more consciously, and to use my experience to help others. And that's what this book is all about—sharing my journey in the hope that it might offer some guidance, some solace, some inspiration to those who are also navigating their own difficult paths.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-14 pt-8 border-t border-white/10">
            <Button asChild variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
              <Link to="/chapter-13">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-medium shadow-[0_10px_40px_-10px_rgba(251,191,36,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(251,191,36,0.8)] transition-all duration-500">
              <Link to="/chapter-15">
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

export default Chapter14;
