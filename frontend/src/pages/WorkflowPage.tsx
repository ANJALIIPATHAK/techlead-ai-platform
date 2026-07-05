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

        {/* Background */}

        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.08),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(168,85,247,0.06),transparent_32%),linear-gradient(180deg,rgba(15,19,25,0.45),rgba(7,9,12,1))]" />

        {/* Page */}

        <div className="relative mx-auto flex w-full justify-center">

          <div className="w-full max-w-[1400px] px-6 py-14 md:px-10 xl:px-14">

            {/* Hero */}

            <HeroSection />

            {/* Main Dashboard */}

            <section className="mt-16 space-y-14">

              <ProjectInput
                description={description}
                loading={loading}
                onChange={setDescription}
                onGenerate={generateProject}
              />

              <DocumentStatusBoard
                stage={stage}
                documents={
                  project?.documents ?? []
                }
              />

              <div className="grid gap-10 xl:grid-cols-2">

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

            </section>

            {/* Generated Project */}

            {project && (

              <section className="mt-20">

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

              </section>

            )}

          </div>

        </div>

      </main>
    </>
  );
}

export default WorkflowPage;