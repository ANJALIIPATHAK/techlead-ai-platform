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