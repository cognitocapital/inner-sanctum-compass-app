import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import chapter11Hero from "@/assets/chapter11-hero.jpg";

const Chapter11 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter11.mp3", "/audio/chapter11-part2.mp3", "/audio/chapter11-part3.mp3", "/audio/chapter11-part4.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-11" />
      <SEOHead title="Chapter 11: The Inner Work - What a Journey" description="Exploring the inner journey of healing after brain injury." path="/chapter-11" />

      {/* Cinematic hero */}
      <section className="relative w-full h-[88vh] min-h-[560px] overflow-hidden">
        <img
          src={chapter11Hero}
          alt="A vast ocean and sky at dawn — the observer behind the clouds"
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
              Chapter Eleven
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-4 animate-[fade-in_1.4s_ease-out_0.5s_both] drop-shadow[0_4px_30px_rgba(0,0,0,0.8)]">
              The Inner Work
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl font-light italic animate-[fade-in_1.6s_ease-out_0.7s_both]">
              The observer, the breath, and the slow return to the silent witness within.
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

          <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/80 prose-p:leading-relaxed prose-p:font-light prose-li:text-white/80 prose-strong:text-amber-300/90">

            <p className="text-lg leading-relaxed mb-6 first-letter:text-6xl first-letter:font-serif first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1">
              Doctors and specialists can provide valuable guidance, but I learned early on that true healing from a TBI requires deep inner work. For nearly ten months, I navigated this alien world largely on my own, relying on my intuition, my determination, and a growing understanding of my own mind and body. My twin brother, Mathew, jokingly offered his cognition and the use of his frontal lobe. In a way, that's exactly what he did. His support was invaluable, and our daily check-ins became a lifeline, a space where I could bounce ideas, vent frustrations, and process the challenges I was facing. It was during this time that I truly discovered the power of self-reliance and the transformative potential of inner exploration.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              One of the most profound shifts I experienced was learning to become "the observer." I was already familiar with Eckhart Tolle's work, having listened to The Power of Now and A New Earth in the year or so leading up to the accident. His philosophies, particularly the concept of "the observer," became invaluable during my recovery. Tolle teaches that we are not our thoughts and emotions, but rather the awareness that observes them. He emphasizes that emotions, like thoughts, are transient phenomena, arising and passing away like waves on the ocean. They are "yours" in the sense that you experience them, but they are not "you." They are not personal possessions that define your identity.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              This distinction was crucial for me. Instead of being swept away by the emotional rollercoaster triggered by my injury, I began to practice observing my emotions as they arose. When fear crept in, I would acknowledge it: "Fear is here." When anxiety surged, I would note it: "Anxiety is present." I wouldn't fight the emotions or try to suppress them. I would simply observe them, like a scientist observing a specimen under a microscope. I learned the importance of disassociating "self" from "symptoms."
            </p>

            <blockquote className="my-10 pl-6 border-l-2 border-amber-400/60 italic text-white/90 font-serif text-xl leading-relaxed">
              This "observer" perspective became my anchor amidst the turbulent seas of recovery. When the emotional rollercoaster hit, I could step back, observe the fear, the anxiety, the frustration, and acknowledge them without letting them consume me. Tolle often uses the analogy of the sky and the clouds. The clouds (our emotions) may be dark and stormy, but they are temporary. They pass. The sky (our true self, the awareness) is always there, vast and unchanging, regardless of the clouds that drift across it. When my brain felt like scrambled eggs, I could recognize it as a temporary state, a signal to slow down, rather than a permanent condition.
            </blockquote>

            <h3 className="text-2xl font-serif font-bold text-amber-400 mt-12 mb-6 tracking-tight">Meditation and Mindfulness</h3>

            <p className="text-lg leading-relaxed mb-6">
              Meditation became a crucial tool in cultivating this inner observer. It wasn't easy. My mind was a whirlwind, especially in those early months. But I persisted. I started with simple breathing exercises, focusing on the sensation of my breath entering and leaving my body. Slowly, gradually, I found moments of stillness amidst the chaos. In those moments, I connected with the silent witness within, the part of me that was calm, centred, and untouched by the turmoil of my injury. It was in these moments of stillness that I could truly grasp Tolle's teaching that I am not my emotions; I am the space in which they arise and pass away.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Mindfulness became a way of life. I started to pay attention to the simple things: the warmth of the sun on my skin, the taste of my food, the sound of my children's laughter. These moments of presence, however brief, helped ground me in the present and pull me out of the downward spiral of my thoughts. It was more than a social media detox; it was about having a limited number of "concentration credits" and being intentional about where I spent them. With my mentally demanding business and a busy home life—Sarah working full-time too—I had to be strategic. I even managed to keep on top of our investment portfolio, ensuring we were in the right assets with limited new capital to invest. Despite the challenges, I managed to outperform the S&P 500 and Nasdaq indices—a feat many hedge funds fail to achieve. I'd already done the groundwork, educating myself and finding my feet as an investor with a clear strategy. This was another example of needing to be strategic, and for me, it meant ditching the distractions of TikTok, Instagram, Facebook, X, and even YouTube. It was amazing how much mental energy I reclaimed by simply disconnecting from the digital noise.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Another powerful tool I discovered was the practice of "sitting with the uncomfortable." This wasn't about seeking out pain; it was about learning to tolerate discomfort, both physical and emotional, without running away or shutting down. Whether it was the throbbing in my head, the frustration of cognitive challenges, or the emotional rawness that often surfaced, I began to practice simply being with the discomfort, observing it without judgment, breathing through it. This practice, though challenging, helped me build resilience and expand my capacity to handle difficult situations. While this practice has become increasingly important in recent months, especially as I've explored the Wim Hof Method, it was "the observer" that formed the bedrock of my coping strategies during those initial ten months of self-navigated recovery.
            </p>

            <h3 className="text-2xl font-serif font-bold text-amber-400 mt-12 mb-6 tracking-tight">Practical Tools for You</h3>

            <ul className="text-lg leading-relaxed mb-6 list-none pl-0 space-y-4">
              <li><strong>Mindfulness Practice:</strong> Take 5 minutes daily to focus on your breath. Notice the air entering and leaving your nose. If your mind wanders, gently bring it back. This grounds you amidst chaos.</li>
              <li><strong>Observer Practice:</strong> When anxiety hits, say, "Anxiety's here." Don't fight it—just watch. It passes, like clouds in the sky.</li>
              <li><strong>Sitting with the Uncomfortable:</strong> Feel the headache, the frustration. Breathe through it. Don't run—it builds resilience.</li>
            </ul>

            <p className="text-lg leading-relaxed mb-6">
              These tools helped me through TBI, but they're for anyone. Stress at work? Mindfulness helps. Facing grief? Gratitude lifts. Try them—they work.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Those ten months of self-navigated recovery were a crucible of personal growth. I learned more about myself, my strengths, my weaknesses, and my capacity for healing than I ever thought possible. I emerged from that period with a deeper understanding of the power of the human mind, the importance of self-reliance, and the transformative potential of inner work. In the beginning, it was "the observer" that provided the most solace and stability. As I've progressed, "sitting with the uncomfortable" has become a powerful tool for continued growth and resilience.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-white/10">
            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-amber-400/50 hover:text-amber-300 transition-all duration-300">
              <Link to="/chapter-10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-105">
              <Link to="/chapter-12">
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

export default Chapter11;
