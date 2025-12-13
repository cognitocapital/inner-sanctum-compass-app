import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <header className="text-center mb-16 animate-phoenix-rise">
      {/* Back navigation */}
      <div className="absolute top-8 left-8">
        <Button asChild variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 transition-all">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
      
      {/* Phoenix emblem */}
      <div className="relative mb-8 mx-auto w-32 h-32 group">
        {/* Outer glow rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 blur-2xl animate-pulse" />
        <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 blur-3xl animate-glow-pulse" />
        
        {/* Main phoenix image */}
        <div 
          className="relative w-full h-full rounded-full border-2 border-orange-500/50 shadow-2xl phoenix-image cursor-pointer transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Orbiting embers */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-400 rounded-full animate-float shadow-lg shadow-orange-500/50"
            style={{
              top: `${-10 + Math.sin(i * 1.2) * 50}%`,
              left: `${50 + Math.cos(i * 1.2) * 60}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + i * 0.3}s`
            }}
          />
        ))}
      </div>
      
      {/* Title with dramatic styling */}
      <div className="relative">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-3 tracking-tight">
          <span className="text-flame-gradient">Yellow Brick Road</span>
        </h1>
        <div className="flex items-center justify-center gap-3 text-white/60">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500/50" />
          <Compass className="h-4 w-4 text-orange-400" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500/50" />
        </div>
      </div>
      
      <p className="text-lg md:text-xl text-white/70 mt-6 max-w-2xl mx-auto leading-relaxed font-light">
        Your personalized pathway to recovery — evidence-based rehabilitation tools 
        designed to help you <span className="text-orange-400 font-medium">rise from the ashes</span>
      </p>
      
      {/* Stats or progress indicator placeholder */}
      <div className="flex items-center justify-center gap-8 mt-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">7</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Modules</div>
        </div>
        <div className="w-px h-8 bg-white/20" />
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">INCOG 2.0</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Aligned</div>
        </div>
        <div className="w-px h-8 bg-white/20" />
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">∞</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Possibilities</div>
        </div>
      </div>
    </header>
  );
};
