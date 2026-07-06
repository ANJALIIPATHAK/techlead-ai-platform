import { useEffect, useRef, useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

          <div className="flex w-full max-w-[1600px] flex-col gap-6 px-6 py-14 md:px-10 xl:px-14 lg:flex-row lg:items-start">

            <aside
              className={`w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0f1319]/80 shadow-2xl shadow-black/30 backdrop-blur transition-all duration-300 lg:sticky lg:top-6 ${isSidebarOpen ? "p-4 lg:w-80" : "p-2 lg:w-14"}`}
            >
              <div className={`flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"} gap-3`}>
                {isSidebarOpen ? (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
                      Project History
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                      Previous projects
                    </h3>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => setIsSidebarOpen((value) => !value)}
                  aria-label={isSidebarOpen ? "Collapse project history" : "Expand project history"}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                >
                  {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                </button>
              </div>

              {isSidebarOpen ? (
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => void loadProjectHistory()}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-left text-sm font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    Refresh history
                  </button>

                  {historyLoading ? (
                    <p className="text-sm text-slate-400">Loading project history...</p>
                  ) : projectHistory.length === 0 ? (
                    <p className="text-sm text-slate-400">No projects have been created yet.</p>
                  ) : (
                    projectHistory.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-white/10 bg-[#0b0f14] p-4"
                      >
                        <h4 className="text-sm font-semibold text-white">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-3">
                          {item.description}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleOpenProject(item.id)}
                          className="mt-4 rounded-xl bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                        >
                          Open Project
                        </button>
                      </div>
                    ))
                  )}
                </div>
              ) : null}
            </aside>

            <div className="min-w-0 flex-1">

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

        </div>

      </main>
    </>
  );
}

export default WorkflowPage;