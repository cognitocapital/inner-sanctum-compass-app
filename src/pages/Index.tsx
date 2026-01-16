import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame } from "lucide-react";
import { EmberParticles } from "@/components/ui/ember-particles";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950 text-white relative overflow-hidden flex flex-col">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glow behind phoenix */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl" />
        
        {/* Ember particles */}
        <EmberParticles count={20} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-12">
        {/* Phoenix image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-10"
        >
          {/* Outer glow rings */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 -m-8 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 blur-2xl"
          />
          
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <motion.div
              animate={{ 
                filter: [
                  "drop-shadow(0 0 30px rgba(251,146,60,0.5))",
                  "drop-shadow(0 0 50px rgba(251,146,60,0.7))",
                  "drop-shadow(0 0 30px rgba(251,146,60,0.5))"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full rounded-full border-2 border-orange-500/30"
              style={{
                backgroundImage: `url('/lovable-uploads/5d3e9ae0-c18d-4e9a-9d2b-95582494f6bd.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-center mb-6"
        >
          <span className="text-flame-gradient">Rise Again</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl text-white/60 text-center max-w-xl mb-12 leading-relaxed"
        >
          A 20-week guided transformation through the ashes of adversity 
          into the flames of renewal
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Button
            asChild
            size="lg"
            className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-400 hover:via-orange-500 hover:to-red-500 text-white font-semibold px-10 py-7 text-lg shadow-2xl shadow-orange-500/30 group overflow-hidden"
          >
            <Link to="/disclaimer">
              {/* Pulse effect */}
              <motion.span
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(251,146,60,0.4)",
                    "0 0 0 20px rgba(251,146,60,0)",
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-md"
              />
              
              <span className="relative flex items-center gap-3">
                <Flame className="w-5 h-5" />
                Begin Your Journey
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </span>
            </Link>
          </Button>
        </motion.div>

        {/* Secondary links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex items-center gap-6 mt-10"
        >
          <Link
            to="/dedication"
            className="text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Dedication
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <Link
            to="/resources"
            className="text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Resources
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <Link
            to="/dashboard"
            className="text-sm text-orange-400/80 hover:text-orange-400 transition-colors"
          >
            Continue Journey
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 text-center py-8 text-sm text-white/30"
      >
        <p>© 2024 Michael Heron. All rights reserved.</p>
      </motion.footer>
    </div>
  );
};

export default Index;
