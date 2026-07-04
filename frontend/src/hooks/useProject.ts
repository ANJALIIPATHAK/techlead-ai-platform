import { useEffect, useState } from "react";

import { getProject } from "../api/projects";
import type { ProjectDetail } from "../types/project";

export function useProject(projectId: string | undefined) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    async function loadProject() {
      try {
        const data = await getProject(projectId!);
        setProject(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  return {
    project,
    loading,
  };
}