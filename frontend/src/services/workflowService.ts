import {
  approvePrd,
  approveSprintPlan,
  approveSystemDesign,
  createProject,
  getProject,
  regeneratePrd,
  regenerateSprintPlan,
  regenerateSystemDesign,
} from "../api/projects";

import type { ProjectDetail } from "../types/project";
import type { WorkflowStage } from "../types/workflow";

export async function generateProject(
  description: string,
): Promise<ProjectDetail> {
  const created = await createProject(description);

  return getProject(created.id);
}

export async function refreshProject(
  projectId: string,
): Promise<ProjectDetail> {
  return getProject(projectId);
}

export async function regenerateDocument(
  projectId: string,
  stage: WorkflowStage,
  feedback: string,
): Promise<ProjectDetail> {
  switch (stage) {
    case "REVIEW_PRD":
      await regeneratePrd(projectId, feedback);
      break;

    case "REVIEW_SYSTEM_DESIGN":
      await regenerateSystemDesign(
        projectId,
        feedback,
      );
      break;

    case "REVIEW_SPRINT_PLAN":
      await regenerateSprintPlan(
        projectId,
        feedback,
      );
      break;

    default:
      throw new Error(
        `Cannot regenerate during stage: ${stage}`,
      );
  }

  return getProject(projectId);
}

export async function approveDocument(
  projectId: string,
  stage: WorkflowStage,
): Promise<ProjectDetail> {
  switch (stage) {
    case "REVIEW_PRD":
      await approvePrd(projectId);
      break;

    case "REVIEW_SYSTEM_DESIGN":
      await approveSystemDesign(projectId);
      break;

    case "REVIEW_SPRINT_PLAN":
      await approveSprintPlan(projectId);
      break;

    default:
      throw new Error(
        `Cannot approve during stage: ${stage}`,
      );
  }

  return getProject(projectId);
}