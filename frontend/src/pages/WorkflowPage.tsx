import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import GetStarted from "../components/GetStarted";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import ProjectOverview from "../components/ProjectOverview";

import { getProjects } from "../api/projects";
import { useWorkflow } from "../hooks/useWorkflow";
import type { Project } from "../types/project";

// Mirrors the key useWorkflow persists project state under. Only used
// here to detect "is there a session to restore" on first paint, so we
// can show a restoring state instead of flashing the get-started screen.
const WORKFLOW_STORAGE_KEY = "techlead-workflow-state";

function hasStoredSession() {
  try {
    if (window.localStorage.getItem(WORKFLOW_STORAGE_KEY)) {
      return true;
    }
  } catch {
    // localStorage may be unavailable; fall through to URL checks.
  }

  const params = new URLSearchParams(window.location.search);

  if (params.get("project_id")) {
    return true;
  }

  return /\/projects\//.test(window.location.pathname);
}

function WorkflowPage() {
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
  const [showProjectInput, setShowProjectInput] = useState(false);
  const [hadStoredSession] = useState(hasStoredSession);

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

  // Scrolling is left entirely to the user — no scrollIntoView or
  // automatic focus jumps anywhere in this page.

  const handleCreateNewProject = () => {
    resetWorkflow();
    setShowProjectInput(false);
  };

  const handleGenerateProject = async () => {
    await generateProject();
    await loadProjectHistory();
  };

  const handleOpenProject = (projectId: string) => {
    window.history.pushState({}, "", `?project_id=${projectId}`);
    window.location.reload();
  };

  const isRestoringSession =
    hadStoredSession && !project && loading && stage === "IDLE";

  const isCreatingProject = !project && stage !== "IDLE";

  const showGetStarted =
    !project && stage === "IDLE" && !isRestoringSession;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07090c]">

        {/* Background */}

        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.08),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(168,85,247,0.06),transparent_32%),linear-gradient(180deg,rgba(15,19,25,0.45),rgba(7,9,12,1))]" />

        {/* Page */}

        <div className="relative mx-auto flex w-full justify-center">

          <div className="flex w-full max-w-[1500px] flex-col gap-6 px-6 py-10 md:px-10 xl:px-14 lg:flex-row lg:items-start">

            <AppSidebar
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen((value) => !value)}
              stage={stage}
              documents={project?.documents ?? []}
              projectHistory={projectHistory}
              historyLoading={historyLoading}
              onRefreshHistory={loadProjectHistory}
              onOpenProject={handleOpenProject}
            />

            <div className="min-w-0 flex-1 space-y-10">

              {showGetStarted && <HeroSection />}

              {isRestoringSession && (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-[#0f1319] px-10 py-20 text-center shadow-2xl shadow-black/40"
                >
                  <Loader2 size={28} className="animate-spin text-cyan-300" />
                  <p className="text-slate-300">
                    Restoring your last session...
                  </p>
                </motion.section>
              )}

              {isCreatingProject && (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-[#0f1319] px-10 py-20 text-center shadow-2xl shadow-black/40"
                >
                  <Loader2 size={28} className="animate-spin text-cyan-300" />
                  <p className="text-slate-300">
                    Setting up your project and briefing the Product
                    Manager agent...
                  </p>
                </motion.section>
              )}

              {showGetStarted && (
                <GetStarted
                  description={description}
                  loading={loading}
                  showInput={showProjectInput}
                  onChange={setDescription}
                  onGenerate={handleGenerateProject}
                  onRevealInput={() => setShowProjectInput(true)}
                  onCancel={() => setShowProjectInput(false)}
                />
              )}

              {project && (
                <ProjectOverview
                  project={project}
                  stage={stage}
                  loading={loading}
                  agent={agent}
                  agentMessage={agentMessage}
                  feedback={feedback}
                  onFeedbackChange={setFeedback}
                  onRegenerate={regenerateCurrentDocument}
                  onApprove={approveCurrentDocument}
                  onNewProject={handleCreateNewProject}
                />
              )}

            </div>

          </div>

        </div>

      </main>
    </>
  );
}

export default WorkflowPage;