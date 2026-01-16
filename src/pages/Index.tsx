import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Flame, ChevronDown } from "lucide-react";
import { EmberParticles } from "@/components/ui/ember-particles";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950 text-white relative overflow-hidden">
      {/* Ember particles */}
      <EmberParticles count={25} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-orange-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
        {/* Phoenix Image with dramatic effects */}
        <motion.div
          className="relative mb-10 group"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Multi-layer glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/40 to-red-600/40 blur-3xl scale-150" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-yellow-500/20 to-transparent blur-2xl scale-125" />
          
          {/* Phoenix image */}
          <motion.div
            className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-orange-500/50 shadow-2xl"
            animate={{
              boxShadow: [
                '0 0 30px rgba(249, 115, 22, 0.3)',
                '0 0 60px rgba(249, 115, 22, 0.5)',
                '0 0 30px rgba(249, 115, 22, 0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url('/lovable-uploads/5d3e9ae0-c18d-4e9a-9d2b-95582494f6bd.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="text-flame-gradient">Rise Again</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl md:text-2xl text-white/60 text-center max-w-xl mb-12 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          A 20-week guided transformation
        </motion.p>

        {/* Single Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Button
            asChild
            size="lg"
            className="relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg font-semibold px-10 py-7 rounded-full shadow-2xl shadow-orange-500/30 group overflow-hidden"
          >
            <Link to="/dashboard">
              {/* Pulsing border effect */}
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-orange-400"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Flame className="mr-2 h-5 w-5" />
              Begin The Protocol
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-sm mb-2">Discover more</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Story Section - Scroll Reveal */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            className="text-2xl md:text-3xl text-white/80 font-light leading-relaxed mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            Born from trauma. Backed by science. Built for{' '}
            <span className="text-orange-400 font-medium">you</span>.
          </motion.p>

          {/* Three pillars */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: '20', label: 'Weeks of Transformation', sublabel: 'Structured protocol' },
              { number: '∞', label: 'Possibilities Await', sublabel: 'Your potential is limitless' },
              { number: '1', label: 'Your Story', sublabel: 'Uniquely yours' }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">{item.number}</div>
                <div className="text-white font-medium mb-1">{item.label}</div>
                <div className="text-white/50 text-sm">{item.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manuscript Link - Subtle Secondary Action */}
      <section className="relative py-24 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <BookOpen className="w-10 h-10 text-orange-400/60 mx-auto mb-6" />
            <h3 className="text-2xl font-serif text-white/80 mb-4">
              Read the Manuscript
            </h3>
            <p className="text-white/50 mb-8 max-w-lg mx-auto">
              An intimate account of recovering from a traumatic brain injury — the story that became this protocol.
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Link to="/prologue">
                Start Reading
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 text-sm text-white/30 border-t border-white/5">
        <p>© 2024 Michael Heron. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
