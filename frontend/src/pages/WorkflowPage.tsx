import { useEffect, useRef } from "react";

import AgentTimeline from "../components/AgentTimeline";
import DocumentStatusBoard from "../components/DocumentStatusBoard";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import ProjectInput from "../components/ProjectInput";
import ProjectOverview from "../components/ProjectOverview";
import WorkflowTimeline from "../components/WorkflowTimeline";

import { useWorkflow } from "../hooks/useWorkflow";

function WorkflowPage() {
  const agentPanelRef =
    useRef<HTMLDivElement>(null);

  const {
    description,
    setDescription,

    feedback,
    setFeedback,

    loading,

    project,

    stage,

    agent,
    agentMessage,

    generateProject,
    regenerateCurrentDocument,
    approveCurrentDocument,
  } = useWorkflow();

  useEffect(() => {
    if (!project || stage === "IDLE") {
      return;
    }

    const timeout = window.setTimeout(() => {
      agentPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);

    return () =>
      window.clearTimeout(timeout);
  }, [project, stage]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-hidden bg-[#07090c]">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,0.10),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(45,212,191,0.08),transparent_30%),linear-gradient(180deg,rgba(17,19,23,0.45),rgba(7,9,12,1))]" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-8 md:px-8">
          <HeroSection />

          <div className="mt-4 space-y-6">
            <ProjectInput
              description={description}
              loading={loading}
              onChange={setDescription}
              onGenerate={generateProject}
            />

            <DocumentStatusBoard
              stage={stage}
              documents={project?.documents ?? []}
            />

            <div className="grid gap-6 xl:grid-cols-2">
              <WorkflowTimeline
                stage={stage}
                documents={
                  project?.documents ?? []
                }
              />

              <AgentTimeline
                stage={stage}
                documents={
                  project?.documents ?? []
                }
              />
            </div>
          </div>

          {project && (
            <ProjectOverview
              project={project}
              stage={stage}
              loading={loading}
              agent={agent}
              agentMessage={agentMessage}
              feedback={feedback}
              onFeedbackChange={setFeedback}
              onRegenerate={
                regenerateCurrentDocument
              }
              onApprove={
                approveCurrentDocument
              }
              agentPanelRef={agentPanelRef}
            />
          )}
        </div>
      </main>
    </>
  );
}

export default WorkflowPage;
