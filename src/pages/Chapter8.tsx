import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import chapter8Hero from "@/assets/chapter8-hero.jpg";

const Chapter8 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter8.mp3", "/audio/chapter8-part2.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-8" />
      <SEOHead title="Chapter 8: Nourishing the Body - What a Journey" description="The role of nutrition and physical care in TBI recovery." path="/chapter-8" />

      {/* Cinematic hero */}
      <section className="relative w-full h-[88vh] min-h-[560px] overflow-hidden">
        <img
          src={chapter8Hero}
          alt="A NutriBullet smoothie on a dim kitchen counter — fueling recovery"
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
              Chapter Eight
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-4 animate-[fade-in_1.4s_ease-out_0.5s_both] drop-shadow[0_4px_30px_rgba(0,0,0,0.8)]">
              Nourishing the Body
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl font-light italic animate-[fade-in_1.6s_ease-out_0.7s_both]">
              A roulette of taste, a war with food, and the slow, blended return to fuel.
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
              They say you are what you eat. Well, after my accident, I wasn't sure what I was, let alone what I was eating. My sense of taste was like a roulette wheel gone haywire—every spin landed on a different shade of awful. Imagine biting into a banana and tasting rancid chicken or sipping milk that tasted like it had been curdled in the sun for a week. That was my reality.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              It was a bloody nightmare, especially in those early days when I was trying to regain my strength and heal my brain. I knew I needed to eat, to fuel the recovery, but the thought of putting anything in my mouth filled me with dread. It was like my body was rejecting the very thing it needed to survive. Smoothies became my lifeline. I'd chuck everything into the NutriBullet—oats, bananas, protein powder, Sustagen, milk, honey—anything I could stomach without gagging. It wasn't exactly gourmet cuisine, but it got the job done. It was fuel, pure and simple, and I clung to it like a life raft in a sea of culinary chaos.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Gradually, after about eight months, my sense of taste started to crawl back from the abyss, and I was able to introduce more solid foods into my diet. But it was a slow, agonizing process, filled with trial and error. I'd take a bite of something, hoping for a hint of familiarity, only to be met with a flavour that made my stomach churn. Herbs and spices became my weapons in this culinary war—not for flavour, but for camouflage. I'd drown my food in garlic, chili, anything to mask the off-putting tastes that still lingered like unwelcome guests.
            </p>

            <blockquote className="my-10 pl-6 border-l-2 border-amber-400/60 italic text-white/90 font-serif text-xl leading-relaxed">
              Eating became a bloody science project. I had to pay close attention to how different foods made me feel, both physically and mentally. Some days, a simple piece of toast would send my head spinning. Other days, a plate of scrambled eggs would be my brain's best friend. It was a constant game of detective, trying to decipher the cryptic messages my body was sending me. But through it all, I learned a valuable lesson. Nourishing my body wasn't just about physical healing; it was about mental and emotional well-being too. It was about finding a way to fuel my recovery, even when the very act of eating felt like a battle. It was about taking control, one blended concoction or spice-laden meal at a time.
            </blockquote>

            <p className="text-lg leading-relaxed mb-8">
              Dealing with those distorted senses was one of the most unexpected and frustrating aspects of the injury. It was a constant battle to find ways to nourish my body, even when the very act of eating was a challenge. But it taught me to appreciate the simple pleasure of a good meal and the profound connection between food and well-being.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-white/10">
            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-amber-400/50 hover:text-amber-300 transition-all duration-300">
              <Link to="/chapter-7">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-105">
              <Link to="/chapter-9">
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

export default Chapter8;
