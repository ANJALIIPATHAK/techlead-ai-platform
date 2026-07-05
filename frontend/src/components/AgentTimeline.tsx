import { Fragment } from "react";

import { Bot, CheckCircle2, Circle } from "lucide-react";

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
  documentType: DocumentType;
}> = [
  {
    label: "Product Manager",
    documentType: "PRD",
  },
  {
    label: "System Architect",
    documentType: "SYSTEM_DESIGN",
  },
  {
    label: "Program Manager",
    documentType: "SPRINT_PLAN",
  },
];

function AgentTimeline({
  stage,
  documents = [],
}: Props) {
  return (
    <section className="rounded-2xl border border-[#2a2f38] bg-[#111317]/90 p-6 shadow-xl shadow-black/20">
      <div className="mb-7 flex items-center gap-3">
        <div className="rounded-xl bg-violet-400/10 p-2 text-violet-200">
          <Bot size={20} />
        </div>

        <h2 className="text-lg font-semibold text-white">
          Agent Timeline
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start">
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
              <div
                className="flex items-center gap-4 md:flex-col md:text-center"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                    isCompleted
                      ? "border-teal-400 bg-teal-400/15 text-teal-200"
                      : isActive
                        ? "border-violet-300 bg-violet-300/10 text-violet-100"
                        : "border-[#4a505b] bg-[#20242b] text-slate-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={24} />
                  ) : isActive ? (
                    <Circle
                      size={18}
                      className="fill-current"
                    />
                  ) : (
                    index + 1
                  )}
                </div>

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      isCompleted
                        ? "text-teal-100"
                        : isActive
                          ? "text-violet-100"
                          : "text-slate-400"
                    }`}
                  >
                    {agent.label}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {isCompleted
                      ? "Completed"
                      : isActive
                        ? "Active"
                        : "Waiting"}
                  </p>
                </div>
              </div>

              {index !== agents.length - 1 && (
                <div
                  className={`hidden h-[2px] w-24 self-center md:block ${
                    isCompleted
                      ? "bg-teal-400"
                      : "bg-[#3a3f49]"
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
