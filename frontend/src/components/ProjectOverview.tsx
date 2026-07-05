import type { Ref } from "react";

import type { ProjectDetail } from "../types/project";
import type { WorkflowStage } from "../types/workflow";
import { getActiveDocumentType } from "../utils/workflowDocuments";

import AgentPanel from "./AgentPanel";
import CompletionSummary from "./CompletionSummary";
import DocumentHistory from "./DocumentHistory";
import FeedbackPanel from "./FeedbackPanel";

interface Props {
  project: ProjectDetail;

  stage: WorkflowStage;

  loading: boolean;

  agent: string;

  agentMessage: string;

  feedback: string;

  onFeedbackChange: (value: string) => void;

  onRegenerate: () => void;

  onApprove: () => void;

  agentPanelRef?: Ref<HTMLDivElement>;
}

function getStageName(stage: WorkflowStage) {
  if (
    stage === "GENERATING_SYSTEM_DESIGN" ||
    stage === "REVIEW_SYSTEM_DESIGN"
  ) {
    return "System Design";
  }

  if (
    stage === "GENERATING_SPRINT_PLAN" ||
    stage === "REVIEW_SPRINT_PLAN" ||
    stage === "COMPLETED"
  ) {
    return "Sprint Plan";
  }

  return "Product Requirements Document";
}

function ProjectOverview({
  project,
  stage,
  loading,
  agent,
  agentMessage,
  feedback,
  onFeedbackChange,
  onRegenerate,
  onApprove,
  agentPanelRef,
}: Props) {
  const showFeedback =
    stage === "REVIEW_PRD" ||
    stage === "REVIEW_SYSTEM_DESIGN" ||
    stage === "REVIEW_SPRINT_PLAN";

  const isComplete = stage === "COMPLETED";
  const activeDocumentType =
    getActiveDocumentType(stage);

  return (
    <div className="mt-10 space-y-8">
      <section className="rounded-2xl border border-[#2a2f38] bg-[#111317]/92 p-6 shadow-xl shadow-black/20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/80">
          Project
        </p>

        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-5xl text-3xl font-semibold leading-tight text-white md:text-4xl">
              {project.title}
            </h1>

            <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">
              {project.description}
            </p>
          </div>

          <div className="shrink-0 rounded-xl border border-[#343a44] bg-[#171a20] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Current Stage
            </p>

            <p className="mt-1 text-sm font-semibold text-amber-100">
              {isComplete
                ? "Completed"
                : getStageName(stage)}
            </p>
          </div>
        </div>
      </section>

      {isComplete && (
        <CompletionSummary
          documents={project.documents}
        />
      )}

      <div ref={agentPanelRef}>
        <AgentPanel
          agent={agent}
          loading={loading}
          message={agentMessage}
          stage={stage}
        />
      </div>

      {showFeedback && (
        <FeedbackPanel
          stageName={getStageName(stage)}
          feedback={feedback}
          loading={loading}
          onChange={onFeedbackChange}
          onRegenerate={onRegenerate}
          onApprove={onApprove}
        />
      )}

      <DocumentHistory
        documents={project.documents}
        activeType={activeDocumentType}
        collapseWhenComplete={isComplete}
      />
    </div>
  );
}

export default ProjectOverview;
