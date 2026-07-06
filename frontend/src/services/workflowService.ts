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
import type { DocumentType } from "../utils/workflowDocuments";

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
  documentType: DocumentType,
  feedback: string,
): Promise<ProjectDetail> {
  switch (documentType) {
    case "PRD":
      await regeneratePrd(projectId, feedback);
      break;

    case "SYSTEM_DESIGN":
      await regenerateSystemDesign(
        projectId,
        feedback,
      );
      break;

    case "SPRINT_PLAN":
      await regenerateSprintPlan(
        projectId,
        feedback,
      );
      break;

    default:
      throw new Error(
        `Cannot regenerate document type: ${documentType}`,
      );
  }

  return getProject(projectId);
}

export async function approveDocument(
  projectId: string,
  documentType: DocumentType,
): Promise<ProjectDetail> {
  switch (documentType) {
    case "PRD":
      await approvePrd(projectId);
      break;

    case "SYSTEM_DESIGN":
      await approveSystemDesign(projectId);
      break;

    case "SPRINT_PLAN":
      await approveSprintPlan(projectId);
      break;

    default:
      throw new Error(
        `Cannot approve document type: ${documentType}`,
      );
  }

  return getProject(projectId);
}