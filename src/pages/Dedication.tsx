import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Headphones, ChevronDown } from "lucide-react";
import { useOpenAudiobook } from "@/hooks/use-audiobook";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import dedicationIllustration from "@/assets/dedication-illustration.jpg";

const Dedication = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    const openAudiobook = useOpenAudiobook();
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-foreground relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/dedication.mp4"]} isVideo />
      <ChapterNavArrows currentPath="/dedication" />
            <SEOHead title="Dedication - What a Journey" description="The dedication page of What a Journey by Michael Heron, a TBI recovery memoir." path="/dedication" />

            {/* ============ CINEMATIC HERO ============ */}
            <section className="relative h-[100svh] w-full overflow-hidden">
              <img
                src={dedicationIllustration}
                alt="A man kneels in a dim room holding a glowing open book inscribed with the dedication, surrounded by family photographs and a single feather drifting upward — visual metaphor for love, loss and the act of dedicating this journey to fellow survivors."
                className="absolute inset-0 w-full h-full object-cover object-center animate-[fade-in_1.6s_ease-out]"
                loading="eager"
              />

              {/* Atmospheric overlays */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_70%,_rgba(0,0,0,0.9)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent via-gray-900/70 to-gray-900" />
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

              {/* Drifting embers / dust motes — echoing the feather */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[18%] right-[22%] w-1.5 h-1.5 bg-amber-300 rounded-full opacity-80 shadow-[0_0_12px_4px_rgba(252,211,77,0.6)] animate-[float_5s_ease-in-out_infinite]" />
                <div className="absolute top-[30%] left-[18%] w-1 h-1 bg-orange-300 rounded-full opacity-60 shadow-[0_0_10px_3px_rgba(253,186,116,0.5)] animate-[float_6s_ease-in-out_infinite_1s]" />
                <div className="absolute top-[50%] right-[28%] w-2 h-2 bg-amber-400 rounded-full opacity-55 shadow-[0_0_14px_5px_rgba(245,158,11,0.5)] animate-[float_7s_ease-in-out_infinite_2s]" />
                <div className="absolute top-[42%] left-[28%] w-1 h-1 bg-orange-200 rounded-full opacity-50 animate-[float_8s_ease-in-out_infinite_3s]" />
                <div className="absolute top-[62%] right-[18%] w-1.5 h-1.5 bg-amber-300 rounded-full opacity-65 shadow-[0_0_10px_3px_rgba(252,211,77,0.5)] animate-[float_5s_ease-in-out_infinite_0.5s]" />
              </div>

              {/* Back link */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                <Button asChild variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-full">
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
              </div>

              {/* Title block — editorial, bottom-left */}
              <div className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-16 pb-20 md:pb-28 animate-[fade-in_2s_ease-out_0.4s_both]">
                <div className="max-w-4xl mx-auto">
                  <p className="text-amber-300/80 tracking-[0.4em] text-xs md:text-sm font-light uppercase mb-4">
                    What a Journey · Michael Heron
                  </p>
                  <h1 className="font-serif font-bold text-white text-6xl md:text-8xl leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                    Dedication
                  </h1>
                  <p className="mt-6 text-white/70 text-base md:text-lg max-w-xl font-light italic leading-relaxed">
                    For every brave soul who refuses to be defined by their limitations.
                  </p>
                </div>
              </div>

              {/* Scroll cue */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-[float_2.5s_ease-in-out_infinite]">
                <ChevronDown className="h-6 w-6 text-white/60" />
              </div>
            </section>
            {/* ============ END HERO ============ */}

            {/* Animated background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-80 shadow-lg shadow-orange-500/50"></div>
                <div className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1s] opacity-60 shadow-lg shadow-orange-500/40"></div>
                <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2s] opacity-70 shadow-lg shadow-orange-500/45"></div>
                <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_3s] opacity-50 shadow-lg shadow-orange-500/35"></div>
            </div>
            
            <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
                <main className="max-w-4xl mx-auto">
                    <Card className="backdrop-blur-sm bg-white/90 border-orange-500/20 shadow-2xl">
                        <CardContent className="p-12">
                            <div className="text-center mb-12">
                                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                                    <p className="text-xl md:text-2xl font-medium italic mb-8">
                                        This book is dedicated to the brave souls who are forging their own paths through the wilderness of recovery, whether from traumatic brain injury or other life-altering challenges.
                                    </p>
                                    
                                    <p className="text-lg md:text-xl mb-6">
                                        It's for those who refuse to be defined by their limitations, who choose to embrace the unknown with courage, and who are committed to unlocking their own potential for healing and growth.
                                    </p>

                                    <p className="text-lg md:text-xl mb-6">
                                        May you find within these pages a source of strength, resilience, and wisdom.
                                    </p>
                                    
                                    <p className="text-lg md:text-xl mb-6">
                                        May you discover the extraordinary power that resides within you.
                                    </p>

                                    {/* Mid-chapter visual echo — placed after the quote so it doesn't repeat the line above */}
                                    <figure className="not-prose my-12 -mx-12 relative overflow-hidden rounded-lg">
                                      <img
                                        src={dedicationIllustration}
                                        alt=""
                                        aria-hidden="true"
                                        className="w-full h-72 md:h-96 object-cover object-center"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/55 to-gray-900/90" />
                                    </figure>

                                    <p className="text-lg md:text-xl font-semibold text-orange-600">
                                        And may you never give up on the journey back to yourself.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Listen to Audiobook Button */}
                            <div className="flex justify-center gap-4 mt-8">
                                <Button 
                                    onClick={() => openAudiobook("dedication")}
                                    size="lg" 
                                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    <Headphones className="mr-2 h-5 w-5" />
                                    Start Listening
                                </Button>
                                
                                <Button asChild size="lg" variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                                    <Link to="/prologue">
                                        Start Reading <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default Dedication;
