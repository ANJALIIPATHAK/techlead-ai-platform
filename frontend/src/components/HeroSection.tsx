import { motion } from "framer-motion";
import {
  Building2,
  GitBranch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const highlights = [
  {
    label: "Approval Gated",
    Icon: ShieldCheck,
  },
  {
    label: "Multi-Agent Workflow",
    Icon: GitBranch,
  },
  {
    label: "Enterprise Ready",
    Icon: Building2,
  },
];

function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative py-6"
    >
      <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
          <Sparkles size={14} />
          Hazel AI
        </div>

        <h1 className="mt-5 max-w-5xl text-5xl font-bold leading-tight text-white">

          Enterprise{" "}

          <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
            Multi-Agent
          </span>

          <br />

          Software Planning

        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
          Transform a software idea into approved product requirements,
          system architecture, and sprint planning documents through an
          AI-powered collaborative workflow.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">

          {highlights.map(({ label, Icon }) => (

            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/5"
            >

              <Icon
                size={18}
                className="text-cyan-300"
              />

              <span className="text-sm font-medium text-slate-200">
                {label}
              </span>

            </div>

          ))}

        </div>

      </div>
    </motion.section>
  );
}

export default HeroSection;