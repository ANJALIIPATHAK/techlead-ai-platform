import { useEffect, useRef, useState } from "react";

import AgentTimeline from "../components/AgentTimeline";
import DocumentStatusBoard from "../components/DocumentStatusBoard";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import ProjectInput from "../components/ProjectInput";
import ProjectOverview from "../components/ProjectOverview";
import WorkflowTimeline from "../components/WorkflowTimeline";

import { getProjects } from "../api/projects";
import { useWorkflow } from "../hooks/useWorkflow";
import type { Project } from "../types/project";

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
    resetWorkflow,
  } = useWorkflow();

  const [projectHistory, setProjectHistory] = useState<Project[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadProjectHistory = async () => {
    try {
      setHistoryLoading(true);
      const projects = await getProjects();
      setProjectHistory(projects);
    } catch (error) {
      console.error(error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    void loadProjectHistory();
  }, []);

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

  const handleCreateNewProject = async () => {
    resetWorkflow();
  };

  const handleGenerateProject = async () => {
    await generateProject();
    await loadProjectHistory();
  };

  const handleOpenProject = (projectId: string) => {
    window.history.pushState({}, "", `?project_id=${projectId}`);
    window.location.reload();
  };

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

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#0f1319]/80 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                    Workflow
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Create a new planning package or revisit an older project
                  </h2>
                </div>

                <button
                  onClick={handleCreateNewProject}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                >
                  Create New Project
                </button>
              </div>

              <ProjectInput
                description={description}
                loading={loading}
                onChange={setDescription}
                onGenerate={handleGenerateProject}
              />

              <section className="rounded-3xl border border-white/10 bg-[#0f1319]/80 p-8 shadow-2xl shadow-black/30">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                      Project History
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      Previous projects
                    </h3>
                  </div>

                  <button
                    onClick={() => void loadProjectHistory()}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    Refresh
                  </button>
                </div>

                {historyLoading ? (
                  <p className="mt-6 text-sm text-slate-400">
                    Loading project history...
                  </p>
                ) : projectHistory.length === 0 ? (
                  <p className="mt-6 text-sm text-slate-400">
                    No projects have been created yet.
                  </p>
                ) : (
                  <div className="mt-8 grid gap-4 lg:grid-cols-2">
                    {projectHistory.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-white/10 bg-[#0b0f14] p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-lg font-semibold text-white">
                              {item.title}
                            </h4>
                            <p className="mt-2 text-sm leading-7 text-slate-400">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleOpenProject(item.id)}
                          className="mt-5 rounded-xl bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                        >
                          Open Project
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

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