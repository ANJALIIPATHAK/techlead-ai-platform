import { motion } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";

import type { Document } from "../types/project";
import type { WorkflowStage } from "../types/workflow";
import {
  getDocumentProgressStatus,
  getLatestDocument,
  getStatusLabel,
  type DocumentType,
} from "../utils/workflowDocuments";

interface Props {
  stage: WorkflowStage;
  documents?: Document[];
  collapsed?: boolean;
}

const steps: Array<{
  type: DocumentType;
  agent: string;
  label: string;
}> = [
  {
    type: "PRD",
    agent: "Product Manager",
    label: "Requirements",
  },
  {
    type: "SYSTEM_DESIGN",
    agent: "System Architect",
    label: "System Design",
  },
  {
    type: "SPRINT_PLAN",
    agent: "Program Manager",
    label: "Sprint Plan",
  },
];

function WorkflowStepper({
  stage,
  documents = [],
  collapsed = false,
}: Props) {
  return (
    <div>
      {!collapsed && (
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300">
          Workflow Progress
        </p>
      )}

      <div className={collapsed ? "flex flex-col items-center gap-6" : "relative"}>
        {steps.map((step, index) => {
          const status = getDocumentProgressStatus(
            documents,
            step.type,
            stage,
          );
          const latestDocument = getLatestDocument(
            documents,
            step.type,
          );
          const isApproved = status === "APPROVED";
          const isGenerating = status === "GENERATING";
          const isActive =
            isGenerating || status === "PENDING_APPROVAL";
          const isLast = index === steps.length - 1;

          const icon = isApproved ? (
            <CheckCircle2 size={collapsed ? 16 : 18} />
          ) : isGenerating ? (
            <Loader2
              size={collapsed ? 14 : 16}
              className="animate-spin"
            />
          ) : isActive ? (
            <Bot size={collapsed ? 14 : 16} />
          ) : (
            <Circle size={collapsed ? 10 : 12} />
          );

          const circleClasses = `relative z-10 flex shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
            collapsed ? "h-8 w-8" : "h-10 w-10"
          } ${
            isApproved
              ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
              : isActive
                ? "border-violet-400 bg-violet-400/15 text-violet-300"
                : "border-white/10 bg-[#171b22] text-slate-500"
          }`;

          if (collapsed) {
            return (
              <motion.div
                key={step.type}
                animate={
                  isActive
                    ? { scale: [1, 1.1, 1] }
                    : { scale: 1 }
                }
                transition={{
                  duration: 1.6,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut",
                }}
                className={circleClasses}
                title={`${step.agent} · ${getStatusLabel(status)}`}
              >
                {icon}
              </motion.div>
            );
          }

          return (
            <div
              key={step.type}
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              {!isLast && (
                <span
                  className={`absolute left-[19px] top-10 h-[calc(100%-2.25rem)] w-[2px] transition-colors duration-500 ${
                    isApproved
                      ? "bg-emerald-400/60"
                      : "bg-white/10"
                  }`}
                />
              )}

              <motion.div
                animate={
                  isActive
                    ? { scale: [1, 1.08, 1] }
                    : { scale: 1 }
                }
                transition={{
                  duration: 1.6,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut",
                }}
                className={circleClasses}
              >
                {icon}
              </motion.div>

              <div className="min-w-0 pt-1">
                <p
                  className={`text-sm font-semibold ${
                    isApproved
                      ? "text-emerald-100"
                      : isActive
                        ? "text-violet-100"
                        : "text-slate-300"
                  }`}
                >
                  {step.agent}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {step.label}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                      isApproved
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                        : isActive
                          ? "border-violet-400/30 bg-violet-400/10 text-violet-200"
                          : "border-white/10 bg-white/5 text-slate-400"
                    }`}
                  >
                    {getStatusLabel(status)}
                  </span>

                  {latestDocument && (
                    <span className="text-[10px] text-slate-500">
                      v{latestDocument.version}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WorkflowStepper;