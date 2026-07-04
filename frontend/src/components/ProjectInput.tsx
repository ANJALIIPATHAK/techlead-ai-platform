import { motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

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
      className="mx-auto mt-8 max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-500/10 p-2">
          <Sparkles
            size={20}
            className="text-blue-400"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Describe Your Software Project
          </h2>

          <p className="text-sm text-zinc-400">
            Give our AI Engineering Team as much context as
            possible.
          </p>
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Example: Build an AI-powered healthcare appointment management platform that supports patients, doctors, administrators, notifications, analytics dashboards, secure APIs and scalable cloud deployment..."
        className="h-64 w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-950 px-6 py-5 text-base text-white outline-none transition-all placeholder:text-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />

      <div className="mt-8 flex justify-center">
        <button
          onClick={onGenerate}
          disabled={loading}
          className="flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
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
              Generate Project
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </motion.section>
  );
}

export default ProjectInput;