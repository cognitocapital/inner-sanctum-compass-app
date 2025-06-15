import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Introduction = () => {
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
              Back to Table of Contents
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
              Introduction
            </h1>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-gray-600 mt-0 mb-12">
              What a Journey
            </h2>


            <p className="text-lg leading-relaxed mb-6">
              "What a journey." It's a term I would often say to my Dad on one of our "work days" as he would drive me to look at work sites, because I could not drive after my brain injury. We were trying to keep my business going and work progressing for my team of roofing tradesmen. Often while looking out the window of the car, I would be contemplating life. Always after we had one of our Friday morning "meetings." I use the term meeting loosely, as what we discussed varied massively, as there were so many factors that I had asked my Dad for guidance on. Those Friday brekkie chats at Manly weren't just about work. They were about life—sorting out fears, dreams, failures. If you've ever felt humbled by life's twists, you'll find yourself here. In fact, my exact words to get him to the cafe at Manly that morning were, "Dad, I want you to help me sort my life out." That is a very humbling experience for a 38-year-old man who has a wonderful family and his own business as a roof plumber.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              This isn't where this particular journey began. This journey began on Australia Day 2024. It turned out to be a fateful day that will stick with me for the rest of my life. Come with me as I guide you through the world through my lens. In this chapter, I want to give you a summary of my journey from there.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              To celebrate Australia Day, we were having a typical get-together with family and friends. We often enjoyed time together like this. My wife Sarah and our three daughters, Harper (4), Matilda (6), and Bailey (8), were all there, soaking up the easy-going atmosphere. Our friends are more like family, especially this group. I especially want to mention my best mates, Tyson and my twin brother, Matthew—we have been the three musketeers since grade 4. We all grew up together, a tight-knit crew. When we were growing up, we were passionate about skateboarding and fishing. We were just enjoying each other's company, having a good time. None of us knew how drastically things were about to change, or how close I'd come to losing it all that day when a simple skateboard accident changed everything.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              The next thing I remember is being in a hospital bed, my head pounding, and I was dazed and dizzy and could not comprehend or talk properly. I found out I was knocked unconscious when my head crashed into the ground during the skateboard accident, and I had a very bad concussion, but it turned out to be much more serious. That's when it really sunk in—I'd cheated death, having no idea what lay ahead. I couldn't see the road in front of me. Ignorance was bliss at this stage, but ignorance was only going to get me so far; the journey back to myself was going to be a long one.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              I have a traumatic brain injury, but I am lucky—lucky to be alive, to move my face, to have hearing in my right ear. I am still regaining my balance as the vertigo slowly subsides. I used to be able to climb ladders and walk on roofs. I am about to finish writing my story on the 12-month anniversary of my accident. Another hard part of my injury was my loss of taste and smell. Let's just say after 12 months, they're making a slow comeback.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Writing my story has been a huge challenge and a very slow process, doing it when my mind will let me—but writing it has also helped me to concentrate and focus. Sometimes when I have been struggling, it helped to put my feelings in writing. My story is not about sadness or self-pity, really. It's more gratitude than anything else. Gratitude for what I've been able to achieve with this messed-up brain. But damn, the emotional rollercoaster is still one of the hardest things to deal with. Getting overwhelmed, the anxiety that comes and goes—it's exhausting. It takes a lot more to tip me over the edge now, but it still happens.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              I'd thought about writing this story before, but to be honest, I haven't had the mental capacity—it's been a fight just to survive. One night after putting my youngest daughter to bed, something felt different, and I felt well enough to start writing. Maybe it's because I finally managed to take some pressure off myself at work by restructuring my business. Whatever it is, I'm grateful for this moment of clarity. I'm grateful to be able to share my story, to tell you about the things I've learned, and hopefully, to help you find your own way through the darkness.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Hopefully, I've grabbed your attention. Now let me start from the beginning and tell you my story in full. The gloves are off, so prepare yourself!
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-orange-200">
              <Button asChild variant="outline" className="border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300">
                <Link to="/prologue">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Prologue
                </Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/chapter-1">
                  Chapter 1
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

export default Introduction;