import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Music, ChevronDown } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import BookSchema from "@/components/seo/BookSchema";
import BetaDisclaimerBanner from "@/components/ui/beta-disclaimer-banner";
import { CommunityFooter } from "@/components/ui/community-footer";
import landingIllustration from "@/assets/landing-phoenix-illustration.jpg";

const Index = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
            <SEOHead
                title="What a Journey - TBI Recovery Story by Michael Heron"
                description="An intimate account of recovering from a traumatic brain injury, finding new strength, and embracing life's unwritten chapters."
                path="/"
            />
            <BookSchema />

            {/* ============ CINEMATIC HERO ============ */}
            <section className="relative min-h-[100svh] w-full overflow-hidden flex flex-col">
                {/* Illustration backdrop */}
                <img
                    src={landingIllustration}
                    alt="A man kneels holding an open, glowing book with a luminous feather rising from its pages, surrounded by scattered photographs and broken frames — visual metaphor for the What a Journey memoir of TBI recovery, resilience and rewriting one's story."
                    className="absolute inset-0 w-full h-full object-cover object-center animate-[fade-in_1.6s_ease-out]"
                    loading="eager"
                />

                {/* Atmospheric overlays — vignette + bottom fade into page */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_70%,_rgba(0,0,0,0.9)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-gray-900/70 to-gray-900" />
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

                {/* Drifting embers */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-orange-400 rounded-full opacity-80 shadow-[0_0_12px_4px_rgba(251,146,60,0.6)] animate-[float_4s_ease-in-out_infinite]" />
                    <div className="absolute top-[35%] right-[20%] w-1 h-1 bg-amber-300 rounded-full opacity-70 shadow-[0_0_10px_3px_rgba(252,211,77,0.5)] animate-[float_5s_ease-in-out_infinite_1s]" />
                    <div className="absolute top-[55%] left-[25%] w-2 h-2 bg-orange-500 rounded-full opacity-60 shadow-[0_0_14px_5px_rgba(249,115,22,0.5)] animate-[float_6s_ease-in-out_infinite_2s]" />
                    <div className="absolute top-[45%] right-[30%] w-1 h-1 bg-orange-300 rounded-full opacity-50 animate-[float_7s_ease-in-out_infinite_3s]" />
                    <div className="absolute top-[65%] right-[15%] w-1.5 h-1.5 bg-amber-400 rounded-full opacity-65 shadow-[0_0_10px_3px_rgba(245,158,11,0.5)] animate-[float_5s_ease-in-out_infinite_0.5s]" />
                    <div className="absolute top-[75%] left-[40%] w-1 h-1 bg-amber-300 rounded-full opacity-55 shadow-[0_0_8px_3px_rgba(252,211,77,0.4)] animate-[float_6s_ease-in-out_infinite_2.5s]" />
                </div>

                {/* Soundscapes icon — top right */}
                <Link to="/soundscapes" className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all duration-300 hover:scale-110" title="Healing Soundscapes">
                    <Music className="h-5 w-5" />
                </Link>

                {/* Title block — bottom-aligned editorial */}
                <div className="relative z-10 mt-auto px-6 md:px-16 pb-16 md:pb-24 animate-[fade-in_2s_ease-out_0.4s_both]">
                    <div className="max-w-4xl mx-auto text-center md:text-left">
                        <p className="text-orange-300/80 tracking-[0.4em] text-xs md:text-sm font-light uppercase mb-4">
                            A Memoir · Michael Heron
                        </p>
                        <h1 className="font-serif font-bold text-white text-6xl md:text-8xl leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                            What a Journey
                        </h1>
                        <p className="mt-6 text-white/75 text-base md:text-lg max-w-xl font-light italic leading-relaxed mx-auto md:mx-0">
                            An intimate account of recovering from a traumatic brain injury,
                            finding new strength, and embracing life's unwritten chapters.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start flex-wrap">
                            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                                <Link to="/dashboard">
                                    Phoenix Journey <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                                <Link to="/disclaimer">
                                    Start Reading <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-md border border-white/25 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                                <Link to="/resources">
                                    Growth Resources <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>

                        <p className="mt-8 text-xs text-white/50 max-w-md mx-auto md:mx-0">
                            This is a beta prototype for demonstration purposes. Content is not medical advice.{" "}
                            <Link to="/disclaimer" className="underline text-orange-300/70 hover:text-orange-200 transition-colors">
                                See full disclaimer
                            </Link>.
                        </p>
                    </div>
                </div>

                {/* Scroll cue */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-[float_2.5s_ease-in-out_infinite]">
                    <ChevronDown className="h-6 w-6 text-white/60" />
                </div>
            </section>
            {/* ============ END HERO ============ */}

            <div className="relative z-10 container mx-auto px-4 pb-12">
                <BetaDisclaimerBanner />
            </div>
            <CommunityFooter />
        </div>
    );
};

export default Index;