export interface Document {
  type: string;
  title: string;
  content: string;
  version: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
}

export interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  documents: Document[];
}

export interface RegenerateRequest {
  review_comment: string;
}