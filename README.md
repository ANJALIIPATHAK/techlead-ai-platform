# TechLead AI Platform

TechLead AI Platform is a full-stack prototype that converts a product idea into a review-gated planning workflow. Three specialized AI agents — **Product Manager**, **System Architect**, and **Program Manager** — collaborate through a staged generation-and-approval cycle to turn a single project description into an approved Product Requirements Document, System Design, and Sprint Plan.

## Table of Contents

- [Repository Structure](#repository-structure)
- [How It Works](#how-it-works)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Notes](#notes)

## Repository Structure

| Path | Description |
| :--- | :--- |
| `backend/` | FastAPI application, SQLAlchemy models, workflow services, and the background polling worker |
| `frontend/` | React + Vite application for project creation, review, and approval |
| `infrastructure/` | `docker-compose.yml` for running PostgreSQL locally |
| `backend/requirements.txt` | Python dependencies for the API and worker |

## How It Works

1. A user submits a project description, which creates a project and queues the first (PRD) workflow stage.
2. The background worker picks up one queued workflow at a time and calls the relevant AI agent.
3. Each stage produces a versioned document and a pending approval record.
4. The user either **approves** the document, advancing the workflow to the next stage, or **submits feedback**, which rejects the current approval and triggers regeneration of a new document version.
5. This repeats across PRD → System Design → Sprint Plan until the workflow is complete.

## Prerequisites

Install these before you begin:

| Tool | Notes |
| :--- | :--- |
| **Git** | For cloning the repository |
| **Python 3.12+** | Runs the FastAPI backend and worker |
| **Node.js 18+ and npm** | Runs the React/Vite frontend |
| **Docker Desktop** | Runs PostgreSQL locally via `docker compose` |
| **An LLM provider API key** | Groq or Gemini (or a local Ollama installation) |

## Setup & Installation

### 1. Clone the repository

```bash
git clone <repo-url>
cd techlead-ai-platform
```

### 2. Start PostgreSQL

```bash
cd infrastructure
docker compose up -d
```

### 3. Configure PostgreSQL & backend environment

Before creating the `.env` file, create a PostgreSQL database with named exactly:

```text
techlead_ai
```

After creating the database, create a .env file inside the `backend` directory with at least the following configuration:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/techlead_ai

LLM_PROVIDER=groq

GROQ_API_KEY=your_groq_api_key

GROQ_MODEL=llama-3.1-8b-instant
```

Update the following values:

- Replace `username` with your PostgreSQL username.
- Replace `password` with your PostgreSQL password.
- Replace `your_groq_api_key` with your own Groq API key.

> **Note:** The database name **must** be `techlead_ai`.

>**Note:** If you prefer Gemini instead of Groq, set `LLM_PROVIDER=gemini` and provide `GEMINI_API_KEY` / `GEMINI_MODEL` in place of the Groq variables.

### 4. Install backend dependencies

**macOS / Linux:**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

**Windows (PowerShell):**

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

> If PowerShell blocks the activation script, run PowerShell as Administrator once and execute `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, then retry.

### 5. Run database migrations

With the virtual environment still active:

```bash
cd backend
alembic upgrade head
```

### 6. Install frontend dependencies

```bash
cd frontend
npm install
```

## Running the App

The API, worker, and frontend run as three separate processes. Open a terminal for each.

### Terminal 1 — Backend API

**macOS / Linux:**

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Windows (PowerShell):**

```powershell
cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 — Background Worker

**macOS / Linux:**

```bash
cd backend
source .venv/bin/activate
python -m app.worker
```

**Windows (PowerShell):**

```powershell
cd backend
.venv\Scripts\Activate.ps1
python -m app.worker
```

### Terminal 3 — Frontend

Same command on every OS:

```bash
cd frontend
npm run dev
```

### Open the app

Visit **http://localhost:5173**, submit a project description, and step through reviewing, approving, or regenerating each document.

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/projects` | Create a project |
| `GET` | `/projects` | List all projects |
| `GET` | `/projects/{project_id}` | Fetch project details |
| `POST` | `/projects/{project_id}/approve-prd` | Approve the PRD |
| `POST` | `/projects/{project_id}/approve-system-design` | Approve the System Design |
| `POST` | `/projects/{project_id}/approve-sprint-plan` | Approve the Sprint Plan |
| `POST` | `/projects/{project_id}/regenerate-prd` | Regenerate the PRD with feedback |
| `POST` | `/projects/{project_id}/regenerate-system-design` | Regenerate the System Design with feedback |
| `POST` | `/projects/{project_id}/regenerate-sprint-plan` | Regenerate the Sprint Plan with feedback |

## Notes

- The frontend is configured to call the API at `http://127.0.0.1:8000`.
- The background worker uses a simple polling loop and must be running alongside the API for workflows to progress.
- The frontend polls the backend while a stage is generating, so live status updates without needing to refresh the page.
- Both the API server and the worker must be running for the app to function — the API alone will accept requests but won't advance any workflow stages.