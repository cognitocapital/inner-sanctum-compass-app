import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Chapter11 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      {/* Animated background elements inspired by phoenix flames */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary flame particles */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-80 shadow-lg shadow-orange-500/50"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1s] opacity-60 shadow-lg shadow-orange-500/40"></div>
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2s] opacity-70 shadow-lg shadow-orange-500/45"></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_3s] opacity-50 shadow-lg shadow-orange-500/35"></div>
        <div className="absolute top-1/3 left-1/6 w-1.5 h-1.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.5s] opacity-45 shadow-lg shadow-orange-500/30"></div>
        <div className="absolute bottom-1/3 right-1/6 w-1 h-1 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2.5s] opacity-35 shadow-lg shadow-orange-500/25"></div>
        <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.5s] opacity-55 shadow-lg shadow-orange-500/40"></div>
        
        {/* Additional ember particles */}
        <div className="absolute top-32 left-1/5 w-1 h-1 bg-yellow-400 rounded-full animate-[float_4s_ease-in-out_infinite_4s] opacity-40"></div>
        <div className="absolute top-56 right-1/4 w-1.5 h-1.5 bg-red-400 rounded-full animate-[float_4s_ease-in-out_infinite_5s] opacity-35"></div>
        <div className="absolute bottom-72 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-[float_4s_ease-in-out_infinite_6s] opacity-30"></div>
        <div className="absolute bottom-24 right-1/6 w-1.5 h-1.5 bg-orange-500 rounded-full animate-[float_4s_ease-in-out_infinite_7s] opacity-45"></div>
        <div className="absolute top-1/4 right-1/8 w-1 h-1 bg-red-500 rounded-full animate-[float_4s_ease-in-out_infinite_8s] opacity-40"></div>
        
        {/* Subtle flame trails */}
        <div className="absolute top-16 left-1/2 w-0.5 h-8 bg-gradient-to-t from-orange-500/60 to-transparent animate-[float_3s_ease-in-out_infinite_3.5s] opacity-30"></div>
        <div className="absolute bottom-32 right-1/2 w-0.5 h-6 bg-gradient-to-t from-orange-500/50 to-transparent animate-[float_3s_ease-in-out_infinite_4.5s] opacity-25"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="pl-0 text-gray-300 hover:text-white transition-colors">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back Home
            </Link>
          </Button>
        </div>

        {/* Phoenix image for chapter header */}
        <div className="text-center mb-8">
          <div className="relative mx-auto w-24 h-24 group">
            <div 
              className="w-full h-full rounded-full border-4 border-orange-500/40 shadow-2xl hover:scale-110 transition-all duration-700 cursor-pointer phoenix-image"
              style={{
                backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            {/* Flame particles around phoenix */}
            <div className="absolute -top-4 -left-4 w-4 h-4 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-90"></div>
            <div className="absolute -top-6 right-12 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.8s] opacity-75"></div>
            <div className="absolute top-6 -right-5 w-3.5 h-3.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.2s] opacity-85"></div>
            <div className="absolute bottom-12 -left-6 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.3s] opacity-65"></div>
            <div className="absolute -bottom-5 right-8 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.5s] opacity-80"></div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/90 border-orange-500/20 shadow-2xl rounded-lg p-8 md:p-12">
          <article className="prose prose-lg mx-auto text-gray-900 max-w-none">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-orange-600 mb-2 drop-shadow-sm">
              Chapter 11
            </h1>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-gray-600 mt-0 mb-12">
              The Inner Work
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              Doctors and specialists can provide valuable guidance, but I learned early on that true healing from a TBI requires deep inner work. For nearly ten months, I navigated this alien world largely on my own, relying on my intuition, my determination, and a growing understanding of my own mind and body. My twin brother, Mathew, jokingly offered his cognition and the use of his frontal lobe. In a way, that's exactly what he did. His support was invaluable, and our daily check-ins became a lifeline, a space where I could bounce ideas, vent frustrations, and process the challenges I was facing. It was during this time that I truly discovered the power of self-reliance and the transformative potential of inner exploration.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              One of the most profound shifts I experienced was learning to become "the observer." I was already familiar with Eckhart Tolle's work, having listened to The Power of Now and A New Earth in the year or so leading up to the accident. His philosophies, particularly the concept of "the observer," became invaluable during my recovery. Tolle teaches that we are not our thoughts and emotions, but rather the awareness that observes them. He emphasizes that emotions, like thoughts, are transient phenomena, arising and passing away like waves on the ocean. They are "yours" in the sense that you experience them, but they are not "you." They are not personal possessions that define your identity.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              This distinction was crucial for me. Instead of being swept away by the emotional rollercoaster triggered by my injury, I began to practice observing my emotions as they arose. When fear crept in, I would acknowledge it: "Fear is here." When anxiety surged, I would note it: "Anxiety is present." I wouldn't fight the emotions or try to suppress them. I would simply observe them, like a scientist observing a specimen under a microscope. I learned the importance of disassociating "self" from "symptoms."
            </p>

            <p className="text-lg leading-relaxed mb-6">
              This "observer" perspective became my anchor amidst the turbulent seas of recovery. When the emotional rollercoaster hit, I could step back, observe the fear, the anxiety, the frustration, and acknowledge them without letting them consume me. Tolle often uses the analogy of the sky and the clouds. The clouds (our emotions) may be dark and stormy, but they are temporary. They pass. The sky (our true self, the awareness) is always there, vast and unchanging, regardless of the clouds that drift across it. When my brain felt like scrambled eggs, I could recognize it as a temporary state, a signal to slow down, rather than a permanent condition.
            </p>

            <h3 className="text-xl font-serif font-bold text-orange-600 mt-8 mb-4">Meditation and Mindfulness</h3>

            <p className="text-lg leading-relaxed mb-6">
              Meditation became a crucial tool in cultivating this inner observer. It wasn't easy. My mind was a whirlwind, especially in those early months. But I persisted. I started with simple breathing exercises, focusing on the sensation of my breath entering and leaving my body. Slowly, gradually, I found moments of stillness amidst the chaos. In those moments, I connected with the silent witness within, the part of me that was calm, centred, and untouched by the turmoil of my injury. It was in these moments of stillness that I could truly grasp Tolle's teaching that I am not my emotions; I am the space in which they arise and pass away.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Mindfulness became a way of life. I started to pay attention to the simple things: the warmth of the sun on my skin, the taste of my food, the sound of my children's laughter. These moments of presence, however brief, helped ground me in the present and pull me out of the downward spiral of my thoughts. It was more than a social media detox; it was about having a limited number of "concentration credits" and being intentional about where I spent them. With my mentally demanding business and a busy home life—Sarah working full-time too—I had to be strategic. I even managed to keep on top of our investment portfolio, ensuring we were in the right assets with limited new capital to invest. Despite the challenges, I managed to outperform the S&P 500 and Nasdaq indices—a feat many hedge funds fail to achieve. I'd already done the groundwork, educating myself and finding my feet as an investor with a clear strategy. This was another example of needing to be strategic, and for me, it meant ditching the distractions of TikTok, Instagram, Facebook, X, and even YouTube. It was amazing how much mental energy I reclaimed by simply disconnecting from the digital noise.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Another powerful tool I discovered was the practice of "sitting with the uncomfortable." This wasn't about seeking out pain; it was about learning to tolerate discomfort, both physical and emotional, without running away or shutting down. Whether it was the throbbing in my head, the frustration of cognitive challenges, or the emotional rawness that often surfaced, I began to practice simply being with the discomfort, observing it without judgment, breathing through it. This practice, though challenging, helped me build resilience and expand my capacity to handle difficult situations. While this practice has become increasingly important in recent months, especially as I've explored the Wim Hof Method, it was "the observer" that formed the bedrock of my coping strategies during those initial ten months of self-navigated recovery.
            </p>

            <h3 className="text-xl font-serif font-bold text-orange-600 mt-8 mb-4">Practical Tools for You</h3>

            <ul className="text-lg leading-relaxed mb-6 list-disc pl-6 space-y-2">
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

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-orange-200">
              <Button asChild variant="outline" className="border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300">
                <Link to="/chapter-10">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Chapter
                </Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/chapter-12">
                  Next Chapter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default Chapter11;
