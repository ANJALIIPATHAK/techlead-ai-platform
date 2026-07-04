import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 p-14 shadow-2xl backdrop-blur-xl"
    >
      {/* Background Glow */}
      <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
          <Sparkles size={16} />
          AI Engineering Team
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight text-white">
          Transform Ideas into
          <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Production-Ready Software
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          Collaborate with specialized AI agents that generate
          Product Requirements, System Architecture and Sprint
          Plans through an interactive engineering workflow.
        </p>
      </div>
    </motion.section>
  );
}

export default HeroSection;