import { useState } from "react";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ProjectInput from "../components/ProjectInput";
import WorkflowTimeline from "../components/WorkflowTimeline";
import AgentPanel from "../components/AgentPanel";
import DocumentViewer from "../components/DocumentViewer";

import {
  createProject,
  getProject,
} from "../api/projects";

import type { ProjectDetail } from "../types/project";

function WorkflowPage() {
  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [project, setProject] =
    useState<ProjectDetail | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert("Please enter a project description.");
      return;
    }

    try {
      setLoading(true);

      const createdProject =
        await createProject(description);

      const projectDetails =
        await getProject(createdProject.id);

      setProject(projectDetails);
    } catch (error) {
      console.error(error);

      alert("Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden">

        {/* Background Glow */}
        <div className="absolute left-1/2 top-24 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[160px]" />

        <div className="relative mx-auto w-full max-w-6xl px-8 pb-20 pt-10">

          <HeroSection />

          <ProjectInput
            description={description}
            loading={loading}
            onChange={setDescription}
            onGenerate={handleGenerate}
          />

          {(loading || project) && (
            <div className="mt-12 space-y-8">

              <WorkflowTimeline
                stage="PRD"
              />

              <AgentPanel
                agent="Product Manager"
                loading={loading}
                message={
                  loading
                    ? "I'm analyzing your project requirements and preparing a comprehensive Product Requirements Document."
                    : "I've completed the Product Requirements Document. Please review it carefully. If you'd like any changes, provide your feedback and regenerate it. Otherwise, approve it so I can hand it over to the System Architect."
                }
              />

              {project && (
                <DocumentViewer
                  title={
                    project.documents[0].title
                  }
                  version={
                    project.documents[0].version
                  }
                  content={
                    project.documents[0].content
                  }
                />
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default WorkflowPage;