import { Fragment } from "react";

import {
  Bot,
  CheckCircle2,
  Circle,
} from "lucide-react";

import type { Document } from "../types/project";
import type { WorkflowStage } from "../types/workflow";
import {
  getDocumentProgressStatus,
  type DocumentType,
} from "../utils/workflowDocuments";

interface Props {
  stage: WorkflowStage;
  documents?: Document[];
}

const agents: Array<{
  label: string;
  role: string;
  documentType: DocumentType;
}> = [
  {
    label: "Product Manager",
    role: "Requirements",
    documentType: "PRD",
  },
  {
    label: "System Architect",
    role: "Architecture",
    documentType: "SYSTEM_DESIGN",
  },
  {
    label: "Program Manager",
    role: "Execution",
    documentType: "SPRINT_PLAN",
  },
];

function AgentTimeline({
  stage,
  documents = [],
}: Props) {
  return (
    <section className="h-full rounded-3xl border border-white/8 bg-[#0f1319] p-10 shadow-2xl shadow-black/40">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
          <Bot size={26} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">
            Workflow
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Agent Timeline
          </h2>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start">
        {agents.map((agent, index) => {
          const status =
            getDocumentProgressStatus(
              documents,
              agent.documentType,
              stage,
            );

          const isCompleted =
            status === "APPROVED";

          const isActive =
            status === "GENERATING" ||
            status === "PENDING_APPROVAL";

          return (
            <Fragment key={agent.label}>
              <div className="flex items-center gap-5 md:flex-col md:text-center">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 ${
                    isCompleted
                      ? "border-emerald-400 bg-emerald-400/15 text-emerald-300 shadow-xl shadow-emerald-500/20"
                      : isActive
                        ? "border-violet-400 bg-violet-400/10 text-violet-300 shadow-xl shadow-violet-500/20"
                        : "border-white/10 bg-[#171b22] text-slate-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={34} />
                  ) : isActive ? (
                    <Bot size={28} />
                  ) : (
                    <Circle size={24} />
                  )}
                </div>

                <div className="mt-4">
                  <h3
                    className={`text-base font-semibold ${
                      isCompleted
                        ? "text-emerald-100"
                        : isActive
                          ? "text-violet-100"
                          : "text-slate-300"
                    }`}
                  >
                    {agent.label}
                  </h3>

                  <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                    {agent.role}
                  </div>

                  <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                    {isCompleted
                      ? "Completed"
                      : isActive
                        ? "Working"
                        : "Waiting"}
                  </p>
                </div>
              </div>

              {index !== agents.length - 1 && (
                <div
                  className={`hidden h-[4px] w-full self-center rounded-full md:block ${
                    isCompleted
                      ? "bg-gradient-to-r from-emerald-400 via-violet-400 to-violet-300"
                      : "bg-[#2a3038]"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}

export default AgentTimeline;