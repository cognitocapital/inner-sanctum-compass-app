import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Play, Pause, Volume2, VolumeX, AlertTriangle, Shield, Heart, Scale, BookOpen, Phone } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SEOHead from "@/components/seo/SEOHead";

const Disclaimer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => { setIsPlaying(false); setProgress(0); };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    audio.play().then(() => setIsPlaying(true)).catch(() => {});

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      <SEOHead title="Disclaimer - What a Journey" description="Important disclaimer for What a Journey, a TBI recovery memoir by Michael Heron." path="/disclaimer" />
      <audio ref={audioRef} src="/audio/disclaimer.mp3" preload="auto" />

      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-float opacity-80 shadow-lg shadow-orange-500/50" />
        <div className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-float opacity-60 shadow-lg shadow-orange-500/40" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-float opacity-70 shadow-lg shadow-orange-500/45" style={{ animationDelay: '2s' }} />
        <div className="absolute top-32 left-[20%] w-1 h-1 bg-yellow-400 rounded-full animate-float opacity-40" style={{ animationDelay: '4s' }} />
        <div className="absolute top-56 right-1/4 w-1.5 h-1.5 bg-red-400 rounded-full animate-float opacity-35" style={{ animationDelay: '5s' }} />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Back navigation */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-orange-300 hover:text-orange-200 hover:bg-orange-500/20">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Phoenix icon */}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div 
                className="w-full h-full rounded-full border-2 border-orange-500/40 shadow-xl"
                style={{
                  backgroundImage: `url('/lovable-uploads/5d3e9ae0-c18d-4e9a-9d2b-95582494f6bd.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-xl -z-10" />
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 drop-shadow-lg">Disclaimer</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Before we begin this journey together, please take a moment to listen to and read this important message.
            </p>
          </div>

          {/* Audio Player */}
          <div className="mb-10 p-6 rounded-2xl backdrop-blur-sm bg-orange-500/10 border border-orange-500/30 shadow-xl">
            <div className="mb-4">
              <input type="range" min="0" max={duration || 100} value={progress} onChange={handleSeek} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6">
              <Button onClick={togglePlay} className="bg-orange-500 hover:bg-orange-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              </Button>
              <div className="flex items-center gap-2">
                <Button onClick={toggleMute} variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-orange-500/20">
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
              </div>
            </div>
          </div>

          {/* Written Disclaimer Sections */}
          <div className="space-y-8 text-left">

            {/* Important Notice */}
            <section className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                <h2 className="text-xl font-semibold text-amber-300">Important Notice — Beta Prototype</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                This application is a <strong className="text-white">prototype in beta live testing</strong> with intentionally public data for demonstration purposes. Features may change without notice, data may be reset, and the experience is provided <strong className="text-white">"as is"</strong> without warranty of any kind, express or implied.
              </p>
            </section>

            {/* Not Medical Advice */}
            <section className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <Shield className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
                <h2 className="text-xl font-semibold text-white">Not Medical Advice</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                <em>What a Journey</em> is a personal memoir and recovery journal. It is <strong className="text-white">not</strong> a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or experienced in this application.
              </p>
            </section>

            {/* No Guarantee of Outcomes */}
            <section className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <Scale className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
                <h2 className="text-xl font-semibold text-white">No Guarantee of Outcomes</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Individual recovery experiences vary significantly. The exercises, protocols, and strategies described in this application reflect the author's personal journey. Nothing in this app guarantees similar results for any other individual. Any progress or outcomes mentioned are anecdotal and should not be interpreted as typical or expected.
              </p>
            </section>

            {/* Your Data */}
            <section className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <h2 className="text-xl font-semibold text-white">Your Data</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                User data — including check-ins, journal entries, and assessment results — is stored securely using industry-standard encryption and access controls. However, as this is a beta prototype, you should <strong className="text-white">not enter information you are not comfortable storing digitally</strong>. We cannot guarantee against data loss during the beta period.
              </p>
            </section>

            {/* Emergency Resources */}
            <section className="p-6 rounded-xl bg-red-500/10 border border-red-500/30">
              <div className="flex items-start gap-3 mb-3">
                <Phone className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <h2 className="text-xl font-semibold text-red-300">Emergency Resources</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-3">
                If you or someone you know is in crisis or experiencing a medical emergency, please contact emergency services immediately:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong className="text-white">Australia:</strong> 000 (Emergency) or Lifeline 13 11 14</li>
                <li>• <strong className="text-white">United States:</strong> 911 or 988 Suicide & Crisis Lifeline</li>
                <li>• <strong className="text-white">United Kingdom:</strong> 999 or Samaritans 116 123</li>
                <li>• <strong className="text-white">International:</strong> <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline hover:text-orange-300">findahelpline.com</a></li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <Scale className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
                <h2 className="text-xl font-semibold text-white">Limitation of Liability</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To the fullest extent permitted by applicable law, the author, developers, and contributors to this application shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of, or inability to use, this application, including but not limited to personal injury, emotional distress, or loss of data.
              </p>
            </section>

            {/* Copyright */}
            <section className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <BookOpen className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
                <h2 className="text-xl font-semibold text-white">Intellectual Property</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                All content within this application — including text, audio, images, and interactive elements — is © 2024 Michael Heron. All rights reserved. Unauthorized reproduction, distribution, or modification of any content is strictly prohibited without prior written consent.
              </p>
            </section>
          </div>

          {/* I Understand / Continue */}
          <div className="mt-12 mb-8 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-400 text-center">By continuing, you acknowledge that you have read and understood this disclaimer.</p>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <Link to="/prologue">
                I Understand — Continue to Prologue <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-gray-400">
          <p>© 2024 Michael Heron. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Disclaimer;
