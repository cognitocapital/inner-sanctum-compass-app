import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import chapter4Hero from "@/assets/chapter4-hero.jpg";

const Chapter4 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter4.mp3", "/audio/chapter4-part2.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-4" />
      <SEOHead title="Chapter 4: Finding My Footing - What a Journey" description="Learning to navigate the new reality after a brain injury." path="/chapter-4" />

      {/* Cinematic hero */}
      <section className="relative w-full h-[88vh] min-h-[560px] overflow-hidden">
        <img
          src={chapter4Hero}
          alt="A solitary figure walking at dawn — first tentative steps toward recovery"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[fade-in_1.6s_ease-out]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/70 via-transparent to-[#0a0a0f]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(10,10,15,0.7)_100%)]" />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[22%] left-[14%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-[float_6s_ease-in-out_infinite] opacity-60 shadow-[0_0_12px_rgba(245,158,11,0.7)]" />
          <div className="absolute top-[38%] right-[20%] w-1 h-1 bg-amber-300 rounded-full animate-[float_7s_ease-in-out_infinite_1s] opacity-50 shadow-[0_0_10px_rgba(252,211,77,0.6)]" />
          <div className="absolute bottom-[30%] left-[26%] w-2 h-2 bg-amber-500 rounded-full animate-[float_8s_ease-in-out_infinite_2s] opacity-55 shadow-[0_0_14px_rgba(245,158,11,0.6)]" />
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
              Chapter Four
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-4 animate-[fade-in_1.4s_ease-out_0.5s_both] drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              Finding My Footing
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl font-light italic animate-[fade-in_1.6s_ease-out_0.7s_both]">
              Short walks. Smoothies. Sleep. The quiet, strategic work of putting yourself first.
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
              As the initial fog began to lift, I realized that staying in bed all day, every day, wasn't going to cut it. My body, as much as my mind, needed to heal. I had to start moving, even if it was just a little. So, I started walking. Short walks at first, around the block, then gradually further afield. It was slow going, and some days it felt like I was wading through molasses, but I kept at it.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Exercise, I discovered, was a double-edged sword. It helped clear my head, gave me a sense of accomplishment, but it also drained my limited energy reserves. I had to be careful not to push myself too hard. I had a set of dumbbells—4kg, 8kg, and 15kg. About a month after getting out of hospital, even the lightest ones felt heavy. For a while, under doctor's orders, I was restricted from any heavy lifting to avoid putting pressure on my brain. It wasn't until a couple of months later that I could even use the 15kg ones, and even then, sparingly.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              My diet was another challenge. With my sense of taste warped and unreliable, eating had become a chore. I ended up relying on smoothies, which I could make with oats, bananas, protein powder, Sustagen, milk, and honey, all blended in my trusty NutriBullet. It wasn't pretty, but it was fuel, and it was something I could stomach.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Sleep, or the lack thereof, became a major factor. When I managed to get a good night's sleep, I felt almost human. My brain felt clearer, my energy levels were higher, and I could function, at least for a few hours. But when sleep was elusive, which was often, the next day was a guaranteed struggle. It was like bad sleep compounded the effects of the injury, amplifying the fatigue, the brain fog, the emotional instability.
            </p>

            <blockquote className="my-10 pl-6 border-l-2 border-amber-400/60 italic text-white/90 font-serif text-xl leading-relaxed">
              It was around this time that my grandfather's words came back to me: "You have to look after number one." Number one, meaning me. It was a simple statement, but it struck a chord. I realized that if I was going to recover, if I was going to be there for my family, I had to prioritize my own well-being. I had to make myself number one, at least for a while. That was a turning point. It wasn't about being selfish; it was about being strategic. It was about understanding that a broken me was no good to anyone. In these early stages, my focus was on the basics: getting enough rest, eating what I could, and starting to move my body again. I knew about the power of breathwork, but I wasn't consistently practicing any specific techniques yet.
            </blockquote>

            <p className="text-lg leading-relaxed mb-8">
              Looking back, those first steps towards taking care of myself were tentative, but they were crucial. I was starting to learn that healing wasn't just about resting; it was about actively nourishing my body and mind, finding my footing on the long and winding road to recovery.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-white/10">
            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-amber-400/50 hover:text-amber-300 transition-all duration-300">
                <Link to="/chapter-3">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Chapter
                </Link>
              </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-105">
                <Link to="/chapter-5">
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

export default Chapter4;
