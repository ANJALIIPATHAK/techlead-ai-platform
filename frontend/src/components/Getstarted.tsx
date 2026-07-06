import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";

import ProjectInput from "./ProjectInput";

interface Props {
  description: string;
  loading: boolean;
  showInput: boolean;
  onChange: (value: string) => void;
  onGenerate: () => void;
  onRevealInput: () => void;
  onCancel: () => void;
}

function GetStarted({
  description,
  loading,
  showInput,
  onChange,
  onGenerate,
  onRevealInput,
  onCancel,
}: Props) {
  return (
    <AnimatePresence mode="wait">
      {!showInput ? (
        <motion.section
          key="cta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111317] via-[#0d1015] to-[#0a0c10] px-10 py-20 text-center shadow-2xl shadow-cyan-950/10"
        >
          <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300">
              <Sparkles size={14} />
              Start Planning
            </div>

            <h2 className="max-w-xl text-3xl font-bold leading-tight text-white">
              Turn your idea into an approved plan
            </h2>

            <p className="max-w-lg leading-7 text-slate-400">
              Describe what you want to build. Hazel AI drafts the
              requirements, architecture and sprint plan, one
              approval-gated stage at a time.
            </p>

            <button
              type="button"
              onClick={onRevealInput}
              className="group mt-2 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/40"
            >
              Create Project
              <ArrowRight
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </motion.section>
      ) : (
        <motion.div
          key="input"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
            >
              <X size={15} />
              Cancel
            </button>
          </div>

          <ProjectInput
            description={description}
            loading={loading}
            onChange={onChange}
            onGenerate={onGenerate}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GetStarted;