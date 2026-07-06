import { useCallback, useEffect, useMemo, useRef, useState } from "react";


import {

  approveDocument,

  generateProject as generateProjectService,

  refreshProject,

  regenerateDocument,

} from "../services/workflowService";

import type { ProjectDetail } from "../types/project";

import type { WorkflowStage } from "../types/workflow";

import type { DocumentType } from "../utils/workflowDocuments";


const WORKFLOW_STORAGE_KEY = "techlead-workflow-state";


function inferWorkflowStage(documents: ProjectDetail["documents"]): WorkflowStage {

  const latestDocument = [...documents]

    .sort((a, b) => b.version - a.version)[0];


  if (!latestDocument) {

    return "IDLE";

  }


  if (latestDocument.type === "SPRINT_PLAN") {

    return latestDocument.status === "APPROVED" ? "COMPLETED" : "REVIEW_SPRINT_PLAN";

  }


  if (latestDocument.type === "SYSTEM_DESIGN") {

    return latestDocument.status === "APPROVED" ? "REVIEW_SPRINT_PLAN" : "REVIEW_SYSTEM_DESIGN";

  }


  return latestDocument.status === "APPROVED" ? "REVIEW_SYSTEM_DESIGN" : "REVIEW_PRD";

}


function normalizeWorkflowStage(

  workflow: ProjectDetail["workflow"],

  documents: ProjectDetail["documents"],

): WorkflowStage {

  if (!workflow) {

    return inferWorkflowStage(documents);

  }


  switch (workflow.stage) {

    case "PRD":

      if (workflow.status === "WAITING_FOR_REVIEW") {

        return "REVIEW_PRD";

      }


      return "GENERATING_PRD";


    case "SYSTEM_DESIGN":

      if (workflow.status === "WAITING_FOR_REVIEW") {

        return "REVIEW_SYSTEM_DESIGN";

      }


      return "GENERATING_SYSTEM_DESIGN";


    case "SPRINT_PLAN":

      if (workflow.status === "WAITING_FOR_REVIEW") {

        return "REVIEW_SPRINT_PLAN";

      }


      return "GENERATING_SPRINT_PLAN";


    case "COMPLETED":

      return "COMPLETED";


    default:

      return inferWorkflowStage(documents);

  }

}


function isGeneratingStage(stage: WorkflowStage) {

  return (

    stage === "GENERATING_PRD" ||

    stage === "GENERATING_SYSTEM_DESIGN" ||

    stage === "GENERATING_SPRINT_PLAN"

  );

}


function getLatestDocumentVersion(

  documents: ProjectDetail["documents"],

  type: "PRD" | "SYSTEM_DESIGN" | "SPRINT_PLAN",

) {

  const latestDocument = [...documents]

    .filter((document) => document.type === type)

    .sort((a, b) => b.version - a.version)[0];


  return latestDocument?.version ?? 0;

}


function resolveDocumentType(

  stage: WorkflowStage,

  documents: ProjectDetail["documents"],

): DocumentType {

  if (stage === "REVIEW_PRD" || stage === "GENERATING_PRD") {

    return "PRD";

  }


  if (

    stage === "REVIEW_SYSTEM_DESIGN" ||

    stage === "GENERATING_SYSTEM_DESIGN"

  ) {

    return "SYSTEM_DESIGN";

  }


  if (

    stage === "REVIEW_SPRINT_PLAN" ||

    stage === "GENERATING_SPRINT_PLAN"

  ) {

    return "SPRINT_PLAN";

  }


  const latestDocument = [...documents]

    .sort((a, b) => b.version - a.version)[0];


  if (latestDocument?.type === "SPRINT_PLAN") {

    return "SPRINT_PLAN";

  }


  if (latestDocument?.type === "SYSTEM_DESIGN") {

    return "SYSTEM_DESIGN";

  }


  return "PRD";

}


export function useWorkflow() {

  const [description, setDescription] = useState("");

  const [feedback, setFeedback] = useState("");

  const [loading, setLoading] = useState(false);

  const [project, setProject] = useState<ProjectDetail | null>(null);

  const [stage, setStage] = useState<WorkflowStage>("IDLE");

  const pendingDocumentTypeRef = useRef<"PRD" | "SYSTEM_DESIGN" | "SPRINT_PLAN" | null>(null);

  const pendingDocumentVersionRef = useRef(0);


  const persistState = (

    nextProject: ProjectDetail | null,

    nextStage: WorkflowStage,

    nextDescription: string,

    nextFeedback: string,

  ) => {

    window.localStorage.setItem(

      WORKFLOW_STORAGE_KEY,

      JSON.stringify({

        projectId: nextProject?.id ?? null,

        stage: nextStage,

        description: nextDescription,

        feedback: nextFeedback,

      }),

    );

  };


  const restoreProject = useCallback(

    async (

      projectId: string,

      fallbackStage?: WorkflowStage,

      fallbackDescription?: string,

      fallbackFeedback?: string,

    ) => {

      try {

        setLoading(true);

        const restoredProject = await refreshProject(projectId);

      const restoredStage =

        normalizeWorkflowStage(restoredProject.workflow, restoredProject.documents) ||

        fallbackStage ||

        "IDLE";


      setProject(restoredProject);

      setDescription(restoredProject.description || fallbackDescription || "");

      setFeedback(fallbackFeedback ?? "");

      setStage(restoredStage);

      persistState(

        restoredProject,

        restoredStage,

        restoredProject.description || fallbackDescription || "",

        fallbackFeedback ?? "",

      );

      } catch {

        window.localStorage.removeItem(WORKFLOW_STORAGE_KEY);

      } finally {

        setLoading(false);

      }

    },

    [],

  );


  useEffect(() => {

    const initializeWorkflow = async () => {

      const urlParams = new URLSearchParams(window.location.search);

      const urlProjectId =

        urlParams.get("project_id") ||

        (() => {

          const match = window.location.pathname.match(/\/projects\/([0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{12})/);

          return match ? match[1] : null;

        })();


      if (urlProjectId) {

        await restoreProject(urlProjectId);

        return;

      }


      const saved = window.localStorage.getItem(WORKFLOW_STORAGE_KEY);


      if (!saved) {

        return;

      }


      try {

        const parsed = JSON.parse(saved) as {

          projectId?: string | null;

          stage?: WorkflowStage;

          description?: string;

          feedback?: string;

        };


        if (!parsed.projectId) {

          return;

        }


        await restoreProject(parsed.projectId, parsed.stage, parsed.description, parsed.feedback);

      } catch {

        window.localStorage.removeItem(WORKFLOW_STORAGE_KEY);

      }

    };


    void initializeWorkflow();

  }, [restoreProject]);


  useEffect(() => {

    if (!project?.id || !isGeneratingStage(stage)) {

      return;

    }


    let cancelled = false;

    let pollCount = 0;

    const maxPolls = 20;


    const pollForUpdates = async () => {

      if (cancelled || pollCount >= maxPolls) {

        return;

      }


      try {

        const latestProject = await refreshProject(project.id);


        if (cancelled) {

          return;

        }


        setProject(latestProject);


        const expectedType = pendingDocumentTypeRef.current;

        const latestExpectedVersion = expectedType

          ? getLatestDocumentVersion(latestProject.documents, expectedType)

          : 0;


        const nextStage = normalizeWorkflowStage(latestProject.workflow, latestProject.documents) || stage;

        const workflowWaitingForReview =

          latestProject.workflow?.status === "WAITING_FOR_REVIEW";


        if (

          (expectedType && latestExpectedVersion > pendingDocumentVersionRef.current) ||

          workflowWaitingForReview

        ) {

          setStage(nextStage);

          setLoading(false);

          pendingDocumentTypeRef.current = null;

          pendingDocumentVersionRef.current = 0;

          persistState(latestProject, nextStage, description, feedback);

          return;

        }


        pollCount += 1;


        if (pollCount < maxPolls) {

          window.setTimeout(() => {

            void pollForUpdates();

          }, 3000);

        }

      } catch (error) {

        console.error("Failed to refresh workflow project", error);


        pollCount += 1;


        if (!cancelled && pollCount < maxPolls) {

          window.setTimeout(() => {

            void pollForUpdates();

          }, 3000);

        }

      }

    };


    void pollForUpdates();


    return () => {

      cancelled = true;

    };

  }, [project?.id, stage, description, feedback]);


  const workflowInfo = useMemo(() => {

    switch (stage) {

      case "GENERATING_PRD":

        return {

          agent: "Product Manager",

          message: "I’m drafting the product requirements document now.",

        };


      case "REVIEW_PRD":

        return {

          agent: "Product Manager",

          message: "The PRD is ready. Review it and either regenerate it with feedback or approve it to continue.",

        };


      case "GENERATING_SYSTEM_DESIGN":

        return {

          agent: "System Architect",

          message: "I’m turning the approved requirements into a system design.",

        };


      case "REVIEW_SYSTEM_DESIGN":

        return {

          agent: "System Architect",

          message: "The System Design is ready. Review it and either regenerate it with feedback or approve it to continue.",

        };


      case "GENERATING_SPRINT_PLAN":

        return {

          agent: "Program Manager",

          message: "I’m breaking the approved system into implementation sprints.",

        };


      case "REVIEW_SPRINT_PLAN":

        return {

          agent: "Program Manager",

          message: "The Sprint Plan is ready. Review it before completing the workflow.",

        };


      case "COMPLETED":

        return {

          agent: "TechLead AI",

          message: "Congratulations! Your software planning workflow has been completed successfully.",

        };


      default:

        return {

          agent: "Product Manager",

          message: "Describe your project to get started.",

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

      pendingDocumentTypeRef.current = "PRD";

      pendingDocumentVersionRef.current = 0;

      setStage("GENERATING_PRD");

      const createdProject = await generateProjectService(description);

      setProject(createdProject);

      persistState(createdProject, "GENERATING_PRD", description, "");

      setFeedback("");

    } catch {

      setLoading(false);

    }

  }


  async function regenerateCurrentDocument() {

    if (!project) {

      return;

    }


    if (!feedback.trim()) {

      alert("Please provide feedback.");

      return;

    }


    try {

      setLoading(true);

      const currentFeedback = feedback;

      setFeedback("");


      const targetDocumentType = resolveDocumentType(stage, project.documents);

      const generatingStage =

        targetDocumentType === "PRD"

          ? "GENERATING_PRD"

          : targetDocumentType === "SYSTEM_DESIGN"

            ? "GENERATING_SYSTEM_DESIGN"

            : "GENERATING_SPRINT_PLAN";


      pendingDocumentTypeRef.current = targetDocumentType;

      pendingDocumentVersionRef.current = getLatestDocumentVersion(

        project.documents,

        targetDocumentType,

      );


      setStage(generatingStage);


      const updatedProject = await regenerateDocument(

        project.id,

        targetDocumentType,

        currentFeedback,

      );

      setProject(updatedProject);

      persistState(updatedProject, generatingStage, description, "");

    } catch {

      setLoading(false);

    }

  }


  async function approveCurrentDocument() {

    if (!project) {

      return;

    }


    try {

      setLoading(true);

      const targetDocumentType = resolveDocumentType(stage, project.documents);


      let nextStage: WorkflowStage = stage;


      if (targetDocumentType === "PRD") {

        pendingDocumentTypeRef.current = "SYSTEM_DESIGN";

        pendingDocumentVersionRef.current = getLatestDocumentVersion(

          project.documents,

          "SYSTEM_DESIGN",

        );

        nextStage = "GENERATING_SYSTEM_DESIGN";

        setStage(nextStage);

      } else if (targetDocumentType === "SYSTEM_DESIGN") {

        pendingDocumentTypeRef.current = "SPRINT_PLAN";

        pendingDocumentVersionRef.current = getLatestDocumentVersion(

          project.documents,

          "SPRINT_PLAN",

        );

        nextStage = "GENERATING_SPRINT_PLAN";

        setStage(nextStage);

      } else {

        pendingDocumentTypeRef.current = null;

        pendingDocumentVersionRef.current = 0;

      }


      const updatedProject = await approveDocument(project.id, targetDocumentType);

      setProject(updatedProject);

      const resolvedStage = normalizeWorkflowStage(updatedProject.workflow, updatedProject.documents);

      setStage(resolvedStage);

      persistState(updatedProject, resolvedStage, description, feedback);

    } catch {

      setLoading(false);

    }

  }


  function resetWorkflow() {

    setDescription("");

    setFeedback("");

    setProject(null);

    setStage("IDLE");

    pendingDocumentTypeRef.current = null;

    pendingDocumentVersionRef.current = 0;

    window.localStorage.removeItem(WORKFLOW_STORAGE_KEY);

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

    resetWorkflow,

  };

}