import { useMemo, useState } from "react";

import {
  approveDocument,
  generateProject as generateProjectService,
  regenerateDocument,
} from "../services/workflowService";

import type { ProjectDetail } from "../types/project";
import type { WorkflowStage } from "../types/workflow";

export function useWorkflow() {
  const [description, setDescription] = useState("");

  const [feedback, setFeedback] = useState("");

  const [loading, setLoading] = useState(false);

  const [project, setProject] =
    useState<ProjectDetail | null>(null);

  const [stage, setStage] =
    useState<WorkflowStage>("IDLE");

  const workflowInfo = useMemo(() => {
    switch (stage) {
      case "GENERATING_PRD":
        return {
          agent: "Product Manager",
          message:
            "I'm understanding your project requirements and drafting the Product Requirements Document.",
        };

      case "REVIEW_PRD":
        return {
          agent: "Product Manager",
          message:
            "I've completed the Product Requirements Document. Review it below. If you'd like any improvements, provide feedback and regenerate it. Otherwise, approve it so I can hand it over to the System Architect.",
        };

      case "GENERATING_SYSTEM_DESIGN":
        return {
          agent: "System Architect",
          message:
            "I've received the approved PRD and I'm preparing the System Design.",
        };

      case "REVIEW_SYSTEM_DESIGN":
        return {
          agent: "System Architect",
          message:
            "The System Design is ready. Review it and either regenerate it with feedback or approve it to continue.",
        };

      case "GENERATING_SPRINT_PLAN":
        return {
          agent: "Program Manager",
          message:
            "I'm breaking the approved system into implementation sprints.",
        };

      case "REVIEW_SPRINT_PLAN":
        return {
          agent: "Program Manager",
          message:
            "The Sprint Plan is ready. Review it before completing the workflow.",
        };

      case "COMPLETED":
        return {
          agent: "TechLead AI",
          message:
            "Congratulations! Your software planning workflow has been completed successfully.",
        };

      default:
        return {
          agent: "Product Manager",
          message:
            "Describe your project to get started.",
        };
    }
  }, [stage]);

  async function generateProject() {
    if (!description.trim()) {
      alert("Please enter a project description.");
      return;
    }

    try {
      setLoading(true);

      setStage("GENERATING_PRD");

      const project =
        await generateProjectService(
          description,
        );

      setProject(project);

      setStage("REVIEW_PRD");
    } finally {
      setLoading(false);
    }
  }

  async function regenerateCurrentDocument() {
    if (!project) return;

    if (!feedback.trim()) {
      alert("Please provide feedback.");
      return;
    }

    try {
      setLoading(true);

      const currentFeedback = feedback;

      setFeedback("");

      const generatingStage =
        stage === "REVIEW_PRD"
          ? "GENERATING_PRD"
          : stage ===
            "REVIEW_SYSTEM_DESIGN"
          ? "GENERATING_SYSTEM_DESIGN"
          : "GENERATING_SPRINT_PLAN";

      setStage(generatingStage);

      const updatedProject =
        await regenerateDocument(
          project.id,
          stage,
          currentFeedback,
        );

      setProject(updatedProject);

      const reviewStage =
        stage === "REVIEW_PRD"
          ? "REVIEW_PRD"
          : stage ===
            "REVIEW_SYSTEM_DESIGN"
          ? "REVIEW_SYSTEM_DESIGN"
          : "REVIEW_SPRINT_PLAN";

      setStage(reviewStage);
    } finally {
      setLoading(false);
    }
  }

  async function approveCurrentDocument() {
    if (!project) return;

    try {
      setLoading(true);

      const currentStage = stage;
      const nextGeneratingStage =
        currentStage === "REVIEW_PRD"
          ? "GENERATING_SYSTEM_DESIGN"
          : currentStage ===
              "REVIEW_SYSTEM_DESIGN"
            ? "GENERATING_SPRINT_PLAN"
            : null;

      if (nextGeneratingStage) {
        setStage(nextGeneratingStage);
      }

      const updatedProject =
        await approveDocument(
          project.id,
          currentStage,
        );

      setProject(updatedProject);

      switch (currentStage) {
        case "REVIEW_PRD":
          setStage(
            "REVIEW_SYSTEM_DESIGN",
          );
          break;

        case "REVIEW_SYSTEM_DESIGN":
          setStage(
            "REVIEW_SPRINT_PLAN",
          );
          break;

        case "REVIEW_SPRINT_PLAN":
          setStage("COMPLETED");
          break;
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    description,
    setDescription,

    feedback,
    setFeedback,

    loading,

    project,

    stage,

    agent: workflowInfo.agent,

    agentMessage: workflowInfo.message,

    generateProject,

    regenerateCurrentDocument,

    approveCurrentDocument,
  };
}
