import { motion } from "framer-motion";
import { CheckCircle, RefreshCw } from "lucide-react";

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
      className="rounded-2xl border border-[#2a2f38] bg-[#111317]/92 shadow-xl shadow-black/20"
    >
      <div className="border-b border-[#2a2f38] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/80">
          Human Review
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-white">
          Review {stageName}
        </h2>
      </div>

      <div className="space-y-5 p-6">
        <textarea
          value={feedback}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder="Add feedback for the agent before regenerating this document..."
          className="min-h-36 w-full resize-y rounded-xl border border-[#343a44] bg-[#0b0d10] p-4 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-300 focus:ring-2 focus:ring-violet-300/15"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#343a44] px-5 py-3 text-sm font-semibold text-slate-200 hover:border-violet-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Regenerate
          </button>

          <button
            onClick={onApprove}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-950/30 hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle size={17} />
            Approve
          </button>
        </div>
      </div>
    </motion.section>
  );
}

export default FeedbackPanel;
