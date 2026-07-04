import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";

interface AgentPanelProps {
  agent: string;
  message: string;
  loading: boolean;
}

function AgentPanel({
  agent,
  message,
  loading,
}: AgentPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-start gap-6">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
          <Bot
            size={42}
            className="text-white"
          />
        </div>

        <div className="flex-1">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">
              {agent}
            </h2>

            <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
              Active Agent
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-3 flex items-center gap-2 text-blue-400">
              <Sparkles size={16} />

              <span className="text-sm font-medium">
                AI Response
              </span>
            </div>

            <p className="text-base leading-8 text-zinc-300">
              {message}
            </p>

            {loading && (
              <div className="mt-8 flex items-center gap-3">
                <span className="h-3 w-3 animate-bounce rounded-full bg-blue-400" />
                <span className="h-3 w-3 animate-bounce rounded-full bg-blue-400 [animation-delay:150ms]" />
                <span className="h-3 w-3 animate-bounce rounded-full bg-blue-400 [animation-delay:300ms]" />

                <span className="ml-2 text-sm text-zinc-500">
                  Thinking...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default AgentPanel;