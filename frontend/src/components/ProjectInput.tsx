import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Sparkles,
  FileText,
  GitBranch,
  CalendarDays,
} from "lucide-react";

interface ProjectInputProps {
  description: string;
  loading: boolean;
  onChange: (value: string) => void;
  onGenerate: () => void;
}

function ProjectInput({
  description,
  loading,
  onChange,
  onGenerate,
}: ProjectInputProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111317] via-[#0d1015] to-[#0a0c10] shadow-2xl shadow-cyan-950/10"
    >
      {/* Background Glow */}
      <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative p-8">

        {/* Header */}

        <div className="mb-8 flex items-start justify-between gap-8">

          <div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300">
              <Sparkles size={14} />
              Project Input
            </div>

            <h2 className="text-3xl font-bold text-white">
              Describe Your Software Project
            </h2>

            <p className="mt-3 max-w-2xl text-slate-400 leading-7">
              Describe the product you want to build. Hazel AI will
              automatically create a complete planning package through
              an approval-gated multi-agent workflow.
            </p>

          </div>

        </div>

        {/* Textarea */}

        <textarea
          value={description}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder="Example: Build a restaurant management platform with online ordering, inventory management, analytics, customer loyalty programs and role-based access..."
          className="min-h-36 w-full resize-y rounded-2xl border border-white/10 bg-[#080a0d]/80 px-6 py-5 text-base leading-8 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-500/10"
        />

        {/* Bottom Row */}

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}

          <div>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Hazel AI will generate
            </p>

            <div className="flex flex-wrap gap-3">

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <FileText
                  size={18}
                  className="text-cyan-300"
                />
                <span className="text-sm text-white">
                  Product Requirements
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <GitBranch
                  size={18}
                  className="text-violet-300"
                />
                <span className="text-sm text-white">
                  System Design
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <CalendarDays
                  size={18}
                  className="text-emerald-300"
                />
                <span className="text-sm text-white">
                  Sprint Plan
                </span>
              </div>

            </div>

          </div>

          {/* Right */}

          <button
            onClick={onGenerate}
            disabled={loading}
            className="group flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />
                Generating...
              </>
            ) : (
              <>
                Generate Planning Package

                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>

        </div>

      </div>
    </motion.section>
  );
}

export default ProjectInput;