import { motion } from "framer-motion";
import {
  CheckCircle,
  MessageSquare,
  RefreshCw,
} from "lucide-react";

interface FeedbackPanelProps {
  feedback: string;
  loading: boolean;
  stageName: string;
  onChange: (value: string) => void;
  onRegenerate: () => void;
  onApprove: () => void;
}

function FeedbackPanel({
  feedback,
  loading,
  stageName,
  onChange,
  onRegenerate,
  onApprove,
}: FeedbackPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-white/8 bg-[#0f1319] shadow-2xl shadow-black/40"
    >
      {/* Header */}

      <div className="border-b border-white/8 px-8 py-7">

        <div className="flex items-center gap-5">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
            <MessageSquare size={24} />
          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">
              Human Review
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Review {stageName}
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-400">
              Approve the generated document or provide feedback to
              regenerate an improved version.
            </p>

          </div>

        </div>

      </div>

      {/* Body */}

      <div className="space-y-8 p-8">

        <div>

          <label className="mb-3 block text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Feedback for AI
          </label>

          <textarea
            value={feedback}
            onChange={(e) =>
              onChange(e.target.value)
            }
            placeholder="Example: Improve the authentication flow, include API sequence diagrams, expand sprint estimates, add security considerations..."
            className="min-h-44 w-full resize-y rounded-2xl border border-white/10 bg-[#151a22] px-6 py-5 text-base leading-8 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-500/10"
          />

        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">

          <button
            onClick={onRegenerate}
            disabled={loading}
            className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-slate-200 transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={19}
              className={loading ? "animate-spin" : ""}
            />

            Regenerate

          </button>

          <button
            onClick={onApprove}
            disabled={loading}
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 px-8 py-4 text-base font-semibold text-slate-950 shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle size={20} />

            Approve Document

          </button>

        </div>

      </div>

    </motion.section>
  );
}

export default FeedbackPanel;