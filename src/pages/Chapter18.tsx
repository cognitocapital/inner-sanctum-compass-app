import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import heroImage from "@/assets/chapter18-hero.jpg";

const Chapter18 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter18.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-18" />
      <SEOHead title="Chapter 18: Unwritten Chapters - What a Journey" description="Embracing the unknown and the chapters yet to be written." path="/chapter-18" />

      {/* Cinematic hero */}
      <div className="relative h-[88vh] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="An open blank journal with fountain pen in golden light"
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
          <p className="text-amber-300/80 tracking-[0.4em] uppercase text-xs md:text-sm mb-4 font-light">Chapter Eighteen</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.05] mb-6">
            Unwritten <span className="italic text-amber-200/90">Chapters</span>
          </h1>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.3em] uppercase animate-pulse">Read</div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24 pb-20">
        <article className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-14 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8)] animate-fade-in">
          <div className="prose prose-invert prose-lg max-w-none font-light text-white/85 leading-[1.85]">

            <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1">
              This journey, from that fateful Australia Day to this present moment, has been a whirlwind of challenges, triumphs, setbacks, and breakthroughs. It's been a journey of pain and healing, of fear and courage, of despair and hope. I've shared my story with you—the good, the bad, and the ugly—in the hope that it might offer some solace, some guidance, some inspiration to those who are navigating their own difficult paths.
            </p>

            <p>
              But the truth is, my story is far from over. The ending is still unwritten. And that's the beauty of it. Life is full of uncertainty, and while that can be scary at times, it's also where the magic happens.
            </p>

            <blockquote className="my-10 pl-6 border-l-2 border-amber-400/60 italic text-white/90 font-serif text-xl md:text-2xl leading-relaxed not-prose">
              It's in the unwritten chapters that we have the opportunity to grow, to transform, to become the best versions of ourselves.
            </blockquote>

            <p>
              So, to anyone reading this who is facing their own challenges, I urge you to embrace the uncertainty. Don't be afraid of the unknown. See it as an opportunity, a chance to create something new, something beautiful, something meaningful. You are stronger than you think you are. You have within you the resilience, the courage, and the power to overcome whatever obstacles life throws your way. Remember, you are not your symptoms.
            </p>

            <p>
              And remember, you're not alone. We're all in this together, navigating our own journeys, writing our own unwritten chapters. Sharing our stories is one of the most powerful things we can do. It connects us, it inspires us, it reminds us that we're not alone in our struggles.
            </p>

            <p>
              What will your unwritten chapters hold? Will you confront the challenges you are facing? Will you pick up your pen and begin to write the next chapter of your life? The future is yours to create. Embrace it. Own it. Live it to the fullest. The journey may be long, the challenges may be great, but the human spirit is capable of extraordinary things. Embrace your unwritten chapters. You are stronger than you know.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-14 pt-8 border-t border-white/10">
            <Button asChild variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
              <Link to="/chapter-17">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-medium shadow-[0_10px_40px_-10px_rgba(251,191,36,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(251,191,36,0.8)] transition-all duration-500">
              <Link to="/chapter-19">
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

export default Chapter18;
