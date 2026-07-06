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

from app.services.system_architect_service import SystemArchitectService

from app.services.program_manager_service import ProgramManagerService

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

    "/projects",

    response_model=list[ProjectResponse],

)
def list_projects(

    db: Session = Depends(get_db),

):

    return ProjectService.list_projects(db)


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


    workflow = WorkflowService.regenerate_prd(

        db=db,

        project=project,

        reviewer_feedback=request.review_comment,

    )


    return {

        "message": "PRD regeneration queued successfully.",

        "workflow_stage": workflow.stage.value,

        "workflow_status": workflow.status.value,

    }

    

@router.post("/projects/{project_id}/regenerate-system-design")

def regenerate_system_design(

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


    workflow = WorkflowService.regenerate_system_design(

        db=db,

        project=project,

        reviewer_feedback=request.review_comment,

    )


    return {

        "message": "System Design regeneration queued successfully.",

        "workflow_stage": workflow.stage.value,

        "workflow_status": workflow.status.value,

    }

    

@router.post("/projects/{project_id}/regenerate-sprint-plan")

def regenerate_sprint_plan(

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


    workflow = WorkflowService.regenerate_sprint_plan(

        db=db,

        project=project,

        reviewer_feedback=request.review_comment,

    )


    return {

        "message": "Sprint Plan regeneration queued successfully.",

        "workflow_stage": workflow.stage.value,

        "workflow_status": workflow.status.value,

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


    workflow = WorkflowService.approve_prd(

        db=db,

        project=project,

    )


    return {

        "message": "PRD approved successfully.",

        "workflow_stage": workflow.stage.value,

        "workflow_status": workflow.status.value,

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


    workflow = WorkflowService.approve_system_design(

        db=db,

        project=project,

    )


    return {

        "message": "System Design approved successfully.",

        "workflow_stage": workflow.stage.value,

        "workflow_status": workflow.status.value,

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