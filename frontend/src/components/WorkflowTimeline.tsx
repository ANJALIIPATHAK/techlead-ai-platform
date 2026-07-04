import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
} from "lucide-react";

interface WorkflowTimelineProps {
  stage: "PRD" | "SYSTEM_DESIGN" | "SPRINT_PLAN";
}

const stages = [
  {
    key: "PRD",
    label: "Product Requirements",
  },
  {
    key: "SYSTEM_DESIGN",
    label: "System Design",
  },
  {
    key: "SPRINT_PLAN",
    label: "Sprint Plan",
  },
];

function WorkflowTimeline({
  stage,
}: WorkflowTimelineProps) {
  const activeIndex = stages.findIndex(
    (s) => s.key === stage,
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">

        {stages.map((item, index) => (
          <div
            key={item.key}
            className="flex flex-1 items-center"
          >
            <div className="flex flex-col items-center">

              {index <= activeIndex ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle2
                    size={28}
                    className="text-emerald-400"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
                  <Circle
                    size={26}
                    className="text-zinc-500"
                  />
                </div>
              )}

              <span className="mt-4 text-center text-sm font-medium text-zinc-300">
                {item.label}
              </span>
            </div>

            {index !== stages.length - 1 && (
              <div className="mx-5 h-[2px] flex-1 bg-zinc-700" />
            )}
          </div>
        ))}

      </div>
    </motion.section>
  );
}

export default WorkflowTimeline;