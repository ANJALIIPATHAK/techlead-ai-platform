import { Plus } from "lucide-react";

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

  onNewProject: () => void;
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
  onNewProject,
}: Props) {
  const showFeedback =
    Boolean(project) &&
    (loading ||
      stage === "REVIEW_PRD" ||
      stage === "REVIEW_SYSTEM_DESIGN" ||
      stage === "REVIEW_SPRINT_PLAN" ||
      stage === "GENERATING_PRD" ||
      stage === "GENERATING_SYSTEM_DESIGN" ||
      stage === "GENERATING_SPRINT_PLAN");

  const isComplete = stage === "COMPLETED";

  const activeDocumentType = getActiveDocumentType(stage);

  const copyProjectId = async () => {
    try {
      await navigator.clipboard.writeText(project.id);
      // simple feedback could be added later
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="space-y-10">

      {/* Project Header */}

      <section className="rounded-3xl border border-white/8 bg-[#0f1319] p-8 shadow-2xl shadow-black/40">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

          <div className="min-w-0 max-w-4xl">

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Project
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              {project.title}
            </h1>

            <p className="mt-4 text-base leading-8 text-slate-400">
              {project.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <div className="font-medium text-slate-300">
                Project ID:
              </div>

              <div className="truncate">{project.id}</div>

              <button
                type="button"
                onClick={copyProjectId}
                className="rounded-md bg-slate-700/40 px-2 py-1 text-xs text-slate-200 transition hover:bg-slate-700/70"
              >
                Copy
              </button>
            </div>

          </div>

          <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">

            <div className="min-w-[200px] rounded-2xl border border-white/8 bg-[#171c24] px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Current Stage
              </p>

              <p className="mt-2 text-base font-semibold text-cyan-200">
                {isComplete ? "Completed" : getStageName(stage)}
              </p>
            </div>

            <button
              type="button"
              onClick={onNewProject}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-white"
            >
              <Plus size={15} />
              New Project
            </button>

          </div>

        </div>

      </section>

      {/* Completion */}

      {isComplete && <CompletionSummary documents={project.documents} />}

      {/* Agent */}

      <AgentPanel
        agent={agent}
        loading={loading}
        message={agentMessage}
        stage={stage}
      />

      {/* Feedback */}

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

      {/* Document History */}

      <DocumentHistory
        documents={project.documents}
        activeType={activeDocumentType}
        collapseWhenComplete={isComplete}
      />

    </div>
  );
}

export default ProjectOverview;