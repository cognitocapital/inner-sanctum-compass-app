import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Chapter12 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      <SEOHead title="Chapter 12: Reclaiming Independence - What a Journey" description="Steps toward regaining independence after a traumatic brain injury." path="/chapter-12" />
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
              Chapter 12
            </h1>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-gray-600 mt-0 mb-12">
              Reclaiming Independence
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              One of the hardest things about the injury was the loss of independence. Suddenly, I was reliant on others for the simplest things—things I used to take for granted. I couldn't drive, I couldn't work, I could barely string a coherent sentence together. For someone used to being self-sufficient, it was a bitter pill to swallow.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              But as the months passed and the inner work began to take root, something shifted. I started to realize that I was the only one who could truly reclaim my independence. I was the only one who knew what I was capable of, what my limitations were, and what I needed to do to move forward. I was done letting others dictate what I could and couldn't do. I was done being a passive passenger in my own life. I was ready to take the wheel.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              At about eleven months, a major turning point came with the decision to start driving again. I still didn't have official clearance, and I knew the legal ramifications could be significant if I was in an accident. But I also knew that I understood my body, my mind, and my limitations better than any doctor or lawyer. I had developed a keen sense of self-awareness, thanks to the mindfulness and "observer" practices I'd been cultivating. I wasn't going to be reckless, but I wasn't going to be a prisoner either. I started with short drives, close to home, always paying close attention to how I was feeling. Gradually, I expanded my range, always mindful of my energy levels, my focus, my overall state of mind.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              This wasn't just about driving. It was about taking back control of my life. It was about becoming the spokesperson, the advocate, the primary carer, and the driver of my own recovery. I made it clear that I wasn't going to compromise my recovery from a health point of view, but within those parameters, I was going to do what I needed to do. That decision to reclaim my independence rippled outwards, affecting other areas of my life. It was a shift in mindset, a willingness to trust my own judgment, to take calculated risks, and to live life on my own terms, even if it meant going against the grain sometimes.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Reclaiming my independence wasn't just about getting behind the wheel of a car. It was about reclaiming my life, my sense of self. It was about trusting the inner work I'd done and having the courage to make my own choices, even when they went against conventional wisdom.
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-orange-200">
              <Button asChild variant="outline" className="border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300">
                <Link to="/chapter-11">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Chapter
                </Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/chapter-13">
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

export default Chapter12;
