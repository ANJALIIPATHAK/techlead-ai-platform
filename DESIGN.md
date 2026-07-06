# System Design


## High-level architecture


TechLead AI Platform is a staged planning workflow that transforms a submitted project idea into three approved planning artifacts:


1. Product Requirements Document (PRD)

2. System Design Document

3. Sprint Plan


The main components are:


- FastAPI backend API in `backend/app`

- PostgreSQL database for persistence

- Background worker in `backend/app/worker.py`

- React frontend in `frontend/src`

- Simple local orchestration via `infrastructure/docker-compose.yml`


The user-facing experience is approval-gated and reflects a minimal AI team collaboration pattern.


## Data model


The project state is represented by four core entities:


- `Project`

- `title`, `description`, `created_at`

- Captures the user’s project prompt and generated title.


- `Workflow`

- `project_id`, `stage`, `status`, `review_comment`, `error_message`, `retry_count`

- Tracks current workflow stage and whether it is queued, generating, waiting for review, failed, or completed.

- One workflow record exists per project.


- `Document`

- `project_id`, `type`, `title`, `content`, `version`

- Stores every generated document version for PRD, System Design, and Sprint Plan.

- A new version is created on each regeneration request.


- `Approval`

- `document_id`, `status`, `review_comment`

- Ties approval state directly to the document instance.

- Approval records are created when a document is generated, then updated on approve or reject.


This model intentionally separates workflow control from document history: the workflow record manages the current stage, while document and approval records keep full artifact and review history.


## Workflow stages and statuses


Workflow stages are defined by `WorkflowStage`:


- `PRD`

- `SYSTEM_DESIGN`

- `SPRINT_PLAN`

- `COMPLETED`


Workflow statuses are defined by `WorkflowStatus`:


- `QUEUED`

- `GENERATING`

- `WAITING_FOR_REVIEW`

- `FAILED`

- `COMPLETED`


The worker transitions jobs through these states. Each stage is processed in order, and completion of one stage enqueues the next after user approval.


## Pause / approve / resume cycle


The approval cycle is the core control mechanism:


1. Project creation enqueues a `PRD` workflow job in `QUEUED`.

2. The worker picks the oldest queued job and marks it `GENERATING`.

3. The corresponding AI service generates a document and creates an `Approval` record with status `PENDING`.

4. The worker marks the workflow `WAITING_FOR_REVIEW` and pauses further progress for that project.

5. The frontend displays the current stage and allows the user to approve or regenerate.

6. If the user approves:

- The approval status is updated to `APPROVED`.

- The next workflow stage is queued (`SYSTEM_DESIGN` after PRD, `SPRINT_PLAN` after System Design).

7. If the user requests regeneration:

- The previous approval is marked `REJECTED` with the reviewer comment.

- The workflow is re-queued for the same stage with `review_comment` preserved.

- The worker regenerates the document using the reviewer feedback.


This creates an effective pause point: the workflow is held in `WAITING_FOR_REVIEW` until human action resumes it.


## Live update strategy


The frontend does not use a real WebSocket channel today. Instead, live progress is implemented as polling in `frontend/src/hooks/useWorkflow.ts`.


While a workflow is in a generating stage, the UI:


- polls the backend every 3 seconds

- refreshes project and document state

- checks whether the expected document version has appeared

- advances the UI when the workflow reaches `WAITING_FOR_REVIEW`


This approach keeps the UI responsive without requiring a full real-time socket implementation. An empty backend `app/websocket/__init__.py` suggests a live update concept that is not yet built out.


## Key design decisions


- **Approval gating before stage transition:** each document requires explicit approval before the next AI agent runs.

- **Document versioning:** document content is append-only; each regeneration creates a new version while preserving history.

- **Worker-based orchestration:** a simple Python worker loop processes queued jobs and enforces stage order.

- **Provider-agnostic LLM layer:** `LLMFactory` selects the configured provider (`groq` or `gemini`) and keeps agent logic isolated.

- **Frontend state recovery:** the UI stores stage state in local storage and restores it on refresh.


## Deliberate omissions


The current implementation intentionally omits or defers several capabilities:


- No authentication or multi-user access control.

- No real WebSocket or push-based live update channel.

- No advanced retry/backoff beyond a single queued/fail state.

- No persistent scheduling system beyond the worker’s polling loop.

- No separate document editor or rich diff view.

- No audit trail of user approvals beyond the current approval status and comment.


## Why this approach


The design focuses on a clear, incremental planning pipeline rather than a broad product management system. By separating workflow control from document artifacts, the implementation keeps each stage simple and traceable. The approval gate is the main safety mechanism: it gives a human reviewer full control to accept or reject generated content before the next AI phase begins.