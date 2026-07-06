import apiClient from "./client";
import type { Project } from "../types/project";

export interface RegenerateRequest {
  review_comment: string;
}

export const createProject = async (description: string) => {
  const response = await apiClient.post("/projects", {
    description,
  });

  return response.data;
};

export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get("/projects");

  return response.data;
};

export const getProject = async (projectId: string) => {
  const response = await apiClient.get(`/projects/${projectId}`);

  return response.data;
};

export const regeneratePrd = async (
  projectId: string,
  reviewComment: string,
) => {
  const response = await apiClient.post(
    `/projects/${projectId}/regenerate-prd`,
    {
      review_comment: reviewComment,
    },
  );

  return response.data;
};

export const approvePrd = async (projectId: string) => {
  const response = await apiClient.post(
    `/projects/${projectId}/approve-prd`,
  );

  return response.data;
};

export const regenerateSystemDesign = async (
  projectId: string,
  reviewComment: string,
) => {
  const response = await apiClient.post(
    `/projects/${projectId}/regenerate-system-design`,
    {
      review_comment: reviewComment,
    },
  );

  return response.data;
};

export const approveSystemDesign = async (projectId: string) => {
  const response = await apiClient.post(
    `/projects/${projectId}/approve-system-design`,
  );

  return response.data;
};

export const regenerateSprintPlan = async (
  projectId: string,
  reviewComment: string,
) => {
  const response = await apiClient.post(
    `/projects/${projectId}/regenerate-sprint-plan`,
    {
      review_comment: reviewComment,
    },
  );

  return response.data;
};

export const approveSprintPlan = async (projectId: string) => {
  const response = await apiClient.post(
    `/projects/${projectId}/approve-sprint-plan`,
  );

  return response.data;
};