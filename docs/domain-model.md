# Domain Model

This document describes the core business entities of the TechLead AI Platform before they are translated into database models.

## Domain Entities

### Project

Represents a software project submitted by a user.

A Project is the root entity of the system and owns the complete document generation workflow.

---

### Job

Represents a long-running workflow responsible for generating project documents.

A Job maintains the current workflow stage and execution state.

---

### Document

Represents a generated artifact within a project.

Examples include:

- Product Requirements Document (PRD)
- Technical Design
- Sprint Plan

Each document belongs to exactly one Project and is generated during a specific workflow stage.

---

### Approval

Represents a human review decision for a generated document.

Possible outcomes include:

- Approved
- Rework Requested

---

### Message

Represents one message exchanged between the human reviewer and an AI agent while reviewing a document.

Each message belongs to a single document.

## Application Components

The following concepts are implemented as application services rather than persisted entities:

- ProductManagerAgent
- SystemArchitectAgent
- ProgramManagerAgent
- Celery Worker
- WebSocket Manager