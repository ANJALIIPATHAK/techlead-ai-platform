import type { Document } from "../types/project";
import type { WorkflowStage } from "../types/workflow";

export type DocumentType =
  | "PRD"
  | "SYSTEM_DESIGN"
  | "SPRINT_PLAN";

export type DocumentProgressStatus =
  | "WAITING"
  | "GENERATING"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED";

export const documentSteps: Array<{
  type: DocumentType;
  label: string;
  shortLabel: string;
}> = [
  {
    type: "PRD",
    label: "Product Requirements",
    shortLabel: "PRD",
  },
  {
    type: "SYSTEM_DESIGN",
    label: "System Design",
    shortLabel: "Design",
  },
  {
    type: "SPRINT_PLAN",
    label: "Sprint Plan",
    shortLabel: "Sprint",
  },
];

export function getLatestDocument(
  documents: Document[],
  type: DocumentType,
) {
  return documents
    .filter((document) => document.type === type)
    .sort((a, b) => b.version - a.version)[0];
}

export function getLatestApprovedDocument(
  documents: Document[],
  type: DocumentType,
) {
  return documents
    .filter(
      (document) =>
        document.type === type &&
        document.status === "APPROVED",
    )
    .sort((a, b) => b.version - a.version)[0];
}

export function isDocumentGenerating(
  type: DocumentType,
  stage: WorkflowStage,
) {
  return (
    (type === "PRD" &&
      stage === "GENERATING_PRD") ||
    (type === "SYSTEM_DESIGN" &&
      stage === "GENERATING_SYSTEM_DESIGN") ||
    (type === "SPRINT_PLAN" &&
      stage === "GENERATING_SPRINT_PLAN")
  );
}

export function isDocumentUnderReview(
  type: DocumentType,
  stage: WorkflowStage,
) {
  return (
    (type === "PRD" && stage === "REVIEW_PRD") ||
    (type === "SYSTEM_DESIGN" &&
      stage === "REVIEW_SYSTEM_DESIGN") ||
    (type === "SPRINT_PLAN" &&
      stage === "REVIEW_SPRINT_PLAN")
  );
}

export function isDocumentApprovedByStage(
  type: DocumentType,
  stage: WorkflowStage,
) {
  if (type === "PRD") {
    return [
      "GENERATING_SYSTEM_DESIGN",
      "REVIEW_SYSTEM_DESIGN",
      "GENERATING_SPRINT_PLAN",
      "REVIEW_SPRINT_PLAN",
      "COMPLETED",
    ].includes(stage);
  }

  if (type === "SYSTEM_DESIGN") {
    return [
      "GENERATING_SPRINT_PLAN",
      "REVIEW_SPRINT_PLAN",
      "COMPLETED",
    ].includes(stage);
  }

  return stage === "COMPLETED";
}

export function getDocumentProgressStatus(
  documents: Document[],
  type: DocumentType,
  stage: WorkflowStage,
): DocumentProgressStatus {
  const latestDocument =
    getLatestDocument(documents, type);

  if (isDocumentGenerating(type, stage)) {
    return "GENERATING";
  }

  if (
    isDocumentApprovedByStage(type, stage) ||
    latestDocument?.status === "APPROVED"
  ) {
    return "APPROVED";
  }

  if (
    isDocumentUnderReview(type, stage) ||
    latestDocument?.status === "PENDING"
  ) {
    return "PENDING_APPROVAL";
  }

  if (latestDocument?.status === "REJECTED") {
    return "REJECTED";
  }

  return "WAITING";
}

export function getActiveDocumentType(
  stage: WorkflowStage,
): DocumentType | null {
  if (
    stage === "GENERATING_PRD" ||
    stage === "REVIEW_PRD"
  ) {
    return "PRD";
  }

  if (
    stage === "GENERATING_SYSTEM_DESIGN" ||
    stage === "REVIEW_SYSTEM_DESIGN"
  ) {
    return "SYSTEM_DESIGN";
  }

  if (
    stage === "GENERATING_SPRINT_PLAN" ||
    stage === "REVIEW_SPRINT_PLAN"
  ) {
    return "SPRINT_PLAN";
  }

  return null;
}

export function getStatusLabel(
  status: DocumentProgressStatus,
) {
  switch (status) {
    case "GENERATING":
      return "Generating";
    case "PENDING_APPROVAL":
      return "Pending approval";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    default:
      return "Waiting";
  }
}
