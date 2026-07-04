import { motion } from "framer-motion";
import { Bot } from "lucide-react";

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
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-10 max-w-4xl rounded-3xl border border-gray-200 bg-white p-8 shadow-lg"
    >
      <div className="flex items-start gap-6">
        <div className="rounded-full bg-blue-100 p-4">
          <Bot
            size={36}
            className="text-blue-600"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold">
            {agent}
          </h2>

          <div className="mt-3 rounded-2xl bg-gray-100 p-5">
            <p className="text-gray-700">
              {message}
            </p>

            {loading && (
              <div className="mt-5 flex gap-2">
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 delay-100" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 delay-200" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default AgentPanel;