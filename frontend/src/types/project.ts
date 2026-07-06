export interface Document {

  type: string;

  title: string;

  content: string;

  version: number;

  status: string;

  review_comment: string | null;

}


export interface Project {

  id: string;

  title: string;

  description: string;

}


export interface WorkflowStatus {

  stage: string;

  status: string;

}


export interface ProjectDetail {

  id: string;

  title: string;

  description: string;

  workflow: WorkflowStatus | null;

  documents: Document[];

}


export interface RegenerateRequest {

  review_comment: string;

}