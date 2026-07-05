import { Fragment } from "react";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  FileText,
} from "lucide-react";

import type { Document } from "../types/project";
import type { WorkflowStage } from "../types/workflow";
import {
  documentSteps,
  getDocumentProgressStatus,
} from "../utils/workflowDocuments";

interface WorkflowTimelineProps {
  stage: WorkflowStage;
  documents?: Document[];
}

function WorkflowTimeline({
  stage,
  documents = [],
}: WorkflowTimelineProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="h-full rounded-3xl border border-white/8 bg-[#0f1319] p-10 shadow-2xl shadow-black/40"
    >
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
          <FileText size={26} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Workflow
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Document Timeline
          </h2>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start">
        {documentSteps.map((item, index) => {
          const status =
            getDocumentProgressStatus(
              documents,
              item.type,
              stage,
            );

          const isApproved =
            status === "APPROVED";

          const isActive =
            status === "GENERATING" ||
            status === "PENDING_APPROVAL";

          return (
            <Fragment key={item.type}>
              <div className="flex items-center gap-5 md:flex-col md:text-center">
                <motion.div
                  whileHover={{
                    scale: 1.06,
                  }}
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isApproved
                      ? "border-emerald-400 bg-emerald-400/15 text-emerald-300 shadow-xl shadow-emerald-500/20"
                      : isActive
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-xl shadow-cyan-500/20"
                        : "border-white/10 bg-[#171b22] text-slate-500"
                  }`}
                >
                  {isApproved ? (
                    <CheckCircle2 size={34} />
                  ) : (
                    <Circle
                      size={24}
                      className={
                        isActive
                          ? "fill-current"
                          : undefined
                      }
                    />
                  )}
                </motion.div>

                <div className="mt-4">
                  <h3
                    className={`text-base font-semibold ${
                      isApproved
                        ? "text-emerald-100"
                        : isActive
                          ? "text-cyan-100"
                          : "text-slate-300"
                    }`}
                  >
                    {item.label}
                  </h3>

                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                    {status
                      .toLowerCase()
                      .replace("_", " ")}
                  </p>
                </div>
              </div>

              {index !==
                documentSteps.length - 1 && (
                <div
                  className={`hidden h-[4px] w-full self-center rounded-full md:block ${
                    isApproved
                      ? "bg-gradient-to-r from-emerald-400 via-cyan-400 to-cyan-300"
                      : "bg-[#2a3038]"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </motion.section>
  );
}

export default WorkflowTimeline;