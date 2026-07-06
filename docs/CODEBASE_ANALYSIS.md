# TechLead AI Platform: Detailed Codebase Analysis

## 1. Architectural Overview

The TechLead AI Platform is a full-stack application designed to orchestrate a multi-agent AI workflow for software project planning. The architecture follows a **staged, approval-gated process** where each stage produces a specific planning artifact.

### Core Components:
- **Frontend (React + Vite):** A responsive web interface where users submit project ideas, review generated documents, and manage the workflow.
- **Backend (FastAPI):** A Python-based REST API that handles project management, document storage, and workflow state transitions.
- **Database (PostgreSQL):** Persistent storage for projects, workflows, documents, and approvals.
- **Background Worker:** A dedicated Python process that polls for queued workflow jobs and executes AI agent logic asynchronously.
- **AI Agents:** Specialized services (Product Manager, System Architect, Program Manager) that interact with LLMs (Groq, Gemini, or Ollama) to generate content.

### Workflow Lifecycle:
1. **Initiation:** The user submits a project description. This creates a `Project` and queues a `PRD` stage workflow.
2. **Asynchronous Generation:** The Background Worker picks up the job, calls the `Product Manager Agent`, and generates a PRD.
3. **Approval Gating:** The workflow pauses in a `WAITING_FOR_REVIEW` state. The user must either:
   - **Approve:** Moves the workflow to the next stage (`SYSTEM_DESIGN`).
   - **Regenerate:** Provides feedback, and the worker regenerates the document.
4. **Completion:** The process repeats for `System Design` and `Sprint Plan` until the workflow is marked `COMPLETED`.

---

## 2. Backend Deep Dive (`backend/`)

The backend is built with **FastAPI** and uses **SQLAlchemy 2.0** for its ORM.

### Data Model (`app/models/`):
- **`Project`**: Stores the core project metadata (title, initial description).
- **`Workflow`**: The state machine of the project. It tracks the current `stage` (PRD, SYSTEM_DESIGN, etc.) and `status` (QUEUED, GENERATING, WAITING_FOR_REVIEW).
- **`Document`**: Stores versioned Markdown content. Every regeneration creates a new version, preserving history.
- **`Approval`**: Records user decisions (APPROVED, REJECTED) and links them to specific document versions.

### Service Layer & Orchestration:
- **`WorkflowService`**: Handles high-level API actions like `approve_prd` or `regenerate_sprint_plan`.
- **`WorkerService`**: The logic executed by the background process. It determines which agent to invoke based on the current workflow stage.
- **`LLMFactory`**: Implements a factory pattern to switch between LLM providers (Groq, Gemini, Ollama) based on environment configuration, keeping the agents decoupled from specific APIs.

### AI Agents (`app/agents/`):
Agents are implemented as classes inheriting from a `BaseAgent`. They use structured prompts (loaded from `app/prompts/`) to guide the LLM in generating specific artifacts.

---

## 3. Frontend Deep Dive (`frontend/`)

The frontend is a modern **TypeScript** application using **React**, **Vite**, and **Tailwind CSS**.

### State Management & Custom Hooks:
- **`useWorkflow.ts`**: The "brain" of the frontend. It manages:
  - **Polling Logic:** Since there are no WebSockets, it polls the backend every 3 seconds when a workflow is in a `GENERATING` status to provide live updates.
  - **Persistence:** Syncs the current project and workflow state to `localStorage`, allowing users to resume their work after a page refresh.
  - **Stage Normalization:** Translates backend workflow states into UI-friendly stages.

### Component Architecture:
- **`WorkflowPage.tsx`**: The primary layout component that coordinates the sidebar (project history) and the main dashboard.
- **`ProjectOverview.tsx`**: The central review hub where the `DocumentViewer` and `FeedbackPanel` reside.
- **`AgentTimeline.tsx` & `WorkflowTimeline.tsx`**: Visual indicators that show the progress of the multi-stage pipeline.

---

## 4. Tech Stack Summary

| Layer | Technology |
| :--- | :--- |
| **Language** | Python 3.12, TypeScript |
| **Frameworks** | FastAPI, React + Vite |
| **Styling** | Tailwind CSS, Lucide React (Icons) |
| **Database** | PostgreSQL (Relational storage) |
| **ORM / Migrations** | SQLAlchemy 2.0, Alembic |
| **AI Integration** | Groq (Llama 3.1), Gemini, Ollama |
| **Infrastructure** | Docker Compose (for local DB) |

## 5. Key Design Observations

1. **Human-in-the-Loop:** The system is strictly approval-gated. An AI agent cannot proceed until a human has verified the previous stage's output.
2. **Append-Only History:** By versioning documents and approvals, the system maintains a full audit trail of how a project's plan evolved through feedback.
3. **Decoupled Worker Pattern:** Separating the worker from the API ensures that long-running LLM calls (which can take 10-30 seconds) do not block the web server or cause request timeouts.
4. **Polling for Simplicity:** The choice of polling over WebSockets reduces architectural complexity while still providing a "live" feel to the user interface.
