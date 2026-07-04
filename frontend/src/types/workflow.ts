import type { ProjectDetail } from "./project";

export type WorkflowStage =
  | "IDLE"
  | "GENERATING_PRD"
  | "REVIEW_PRD"
  | "GENERATING_SYSTEM_DESIGN"
  | "REVIEW_SYSTEM_DESIGN"
  | "GENERATING_SPRINT_PLAN"
  | "REVIEW_SPRINT_PLAN"
  | "COMPLETED";

export interface WorkflowState {
  project: ProjectDetail | null;
  stage: WorkflowStage;
  loading: boolean;
  activeAgent: string;
  agentMessage: string;
}