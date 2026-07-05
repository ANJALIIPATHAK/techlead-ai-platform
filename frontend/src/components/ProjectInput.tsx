import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Sparkles,
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border border-[#2a2f38] bg-[#111317]/92 p-6 shadow-xl shadow-black/20"
    >
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-400/10 p-2 text-amber-200">
            <Sparkles size={20} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Describe Your Software Project
            </h2>

            <p className="text-sm text-slate-400">
              Enterprise planning starts from one clear requirement.
            </p>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-950/30 hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Generating
            </>
          ) : (
            <>
              Generate Project
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>

      <textarea
        value={description}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder="Example: Build an AI-powered fleet management platform for enterprise operations, real-time dashboards, maintenance scheduling, route optimization, analytics, and secure APIs..."
        className="min-h-44 w-full resize-y rounded-xl border border-[#343a44] bg-[#0b0d10] px-5 py-4 text-base leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/15"
      />
    </motion.section>
  );
}

export default ProjectInput;
