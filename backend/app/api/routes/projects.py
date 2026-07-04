from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.project import Project
from app.schemas.document import RegenerateDocumentRequest
from app.schemas.project import (
    ProjectCreate,
    ProjectDetailResponse,
    ProjectResponse,
)
from app.services.product_manager_service import ProductManagerService
from app.services.project_service import ProjectService
from app.services.workflow_service import WorkflowService

router = APIRouter()


@router.post(
    "/projects",
    response_model=ProjectResponse,
    status_code=201,
)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
):
    return ProjectService.create_project(db, project)


@router.get(
    "/projects/{project_id}",
    response_model=ProjectDetailResponse,
)
def get_project(
    project_id: UUID,
    db: Session = Depends(get_db),
):
    project = ProjectService.get_project(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return project


@router.post("/projects/{project_id}/regenerate-prd")
def regenerate_prd(
    project_id: UUID,
    request: RegenerateDocumentRequest,
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    document = ProductManagerService.regenerate_prd(
        db=db,
        project=project,
        reviewer_feedback=request.review_comment,
    )

    return {
        "message": "PRD regenerated successfully.",
        "document_id": document.id,
        "version": document.version,
    }


@router.post("/projects/{project_id}/approve-prd")
def approve_prd(
    project_id: UUID,
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    system_design = WorkflowService.approve_prd(
        db=db,
        project=project,
    )

    return {
        "message": "PRD approved successfully.",
        "document_id": system_design.id,
        "version": system_design.version,
    }
    
@router.post("/projects/{project_id}/approve-system-design")
def approve_system_design(
    project_id: UUID,
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    sprint_plan = WorkflowService.approve_system_design(
        db=db,
        project=project,
    )

    return {
        "message": "System Design approved successfully.",
        "document_id": sprint_plan.id,
        "version": sprint_plan.version,
    }


@router.post("/projects/{project_id}/approve-sprint-plan")
def approve_sprint_plan(
    project_id: UUID,
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    sprint_plan = WorkflowService.approve_sprint_plan(
        db=db,
        project=project,
    )

    return {
        "message": "Workflow completed successfully.",
        "document_id": sprint_plan.id,
        "version": sprint_plan.version,
    }