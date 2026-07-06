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

    Boolean(project) &&
    (loading ||
      stage === "REVIEW_PRD" ||
      stage === "REVIEW_SYSTEM_DESIGN" ||
      stage === "REVIEW_SPRINT_PLAN" ||
      stage === "GENERATING_PRD" ||
      stage === "GENERATING_SYSTEM_DESIGN" ||
      stage === "GENERATING_SPRINT_PLAN");


  const isComplete =

    stage === "COMPLETED";


  const activeDocumentType =

    getActiveDocumentType(stage);


  const copyProjectId = async () => {

    try {

      await navigator.clipboard.writeText(project.id);

      // simple feedback could be added later

    } catch {

      // ignore clipboard errors

    }

  };


  return (

    <div className="space-y-14">


      {/* Project Header */}


      <section className="rounded-3xl border border-white/8 bg-[#0f1319] p-10 shadow-2xl shadow-black/40">


        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">


          <div className="max-w-4xl">


            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">

              Project

            </p>


            <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight text-white">

              {project.title}

            </h1>


            <p className="mt-6 text-lg leading-9 text-slate-400">

              {project.description}

            </p>


            <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">

              <div className="font-medium text-slate-300">Project ID:</div>

              <div className="truncate">{project.id}</div>

              <button

                onClick={copyProjectId}

                className="ml-2 rounded-md bg-slate-700/40 px-2 py-1 text-xs text-slate-200"

              >

                Copy

              </button>

            </div>


          </div>


          <div className="min-w-[240px] rounded-2xl border border-white/8 bg-[#171c24] p-6">


            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">

              Current Stage

            </p>


            <p className="mt-3 text-lg font-semibold text-cyan-200">

              {isComplete

                ? "Completed"

                : getStageName(stage)}

            </p>


          </div>


        </div>


      </section>


      {/* Completion */}


      {isComplete && (

        <CompletionSummary

          documents={project.documents}

        />

      )}


      {/* Agent */}


      <div ref={agentPanelRef}>

        <AgentPanel

          agent={agent}

          loading={loading}

          message={agentMessage}

          stage={stage}

        />

      </div>


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