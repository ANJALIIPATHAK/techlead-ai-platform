# TechLead AI Platform


TechLead AI Platform is a full-stack prototype that converts a product idea into a review-gated planning workflow. The system orchestrates three AI agents—Product Manager, System Architect, and Program Manager—through a staged generation and approval cycle.


## What this repository contains


- `backend/`: FastAPI backend, SQLAlchemy models, workflow services, and a polling worker.

- `frontend/`: React + Vite application for project creation, review, and approval.

- `infrastructure/`: `docker-compose.yml` for running PostgreSQL locally.

- `backend/requirements.txt`: Python dependencies for the API and worker.


## Local setup


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


### 3. Configure backend environment


Create `backend/.env` with at least:


```env

DATABASE_URL=your_databse_url

LLM_PROVIDER=groq

GROQ_API_KEY=your_groq_api_key

GROQ_MODEL=llama-3.1-8b-instant

```


If you prefer Gemini, set `LLM_PROVIDER=gemini` and provide `GEMINI_API_KEY`/`GEMINI_MODEL` instead.


### 4. Install backend dependencies


```bash

cd backend

python3 -m venv .venv

source .venv/bin/activate

python -m pip install --upgrade pip

python -m pip install -r requirements.txt

```


### 5. Run database migrations


```bash

cd backend

alembic upgrade head

```


### 6. Start the backend API


```bash

cd backend

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

```


### 7. Start the background worker


In a second terminal:


```bash

cd backend

source .venv/bin/activate

python app/worker.py

```


### 8. Start the frontend


```bash

cd frontend

npm install

npm run dev

```


### 9. Open the UI


Visit `http://localhost:5173` and use the app to submit a project description, review generated documents, and approve or request regeneration.


## How the app works


- Create a project and queue the first PRD workflow.

- A worker processes one queued workflow at a time.

- Each stage produces a document and creates a pending approval record.

- User approval triggers the next workflow stage.

- Feedback-based regeneration rejects the prior approval and creates a new document version.


## API endpoints


- `POST /projects` — create a project

- `GET /projects` — list projects

- `GET /projects/{project_id}` — fetch project details

- `POST /projects/{project_id}/approve-prd` — approve PRD

- `POST /projects/{project_id}/approve-system-design` — approve System Design

- `POST /projects/{project_id}/approve-sprint-plan` — approve Sprint Plan

- `POST /projects/{project_id}/regenerate-prd` — regenerate PRD with feedback

- `POST /projects/{project_id}/regenerate-system-design` — regenerate System Design with feedback

- `POST /projects/{project_id}/regenerate-sprint-plan` — regenerate Sprint Plan with feedback


## Notes


- Frontend is configured to call `http://127.0.0.1:8000`.

- The worker uses a simple polling loop and must run alongside the API.

- Live workflow state is refreshed from the backend while generation is in progress.




