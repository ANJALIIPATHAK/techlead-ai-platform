from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.document import DocumentResponse


class ProjectCreate(BaseModel):
    description: str = Field(
        ...,
        min_length=20,
        max_length=5000,
    )


class WorkflowResponse(BaseModel):
    stage: str
    status: str


class ProjectResponse(BaseModel):
    id: UUID
    title: str
    description: str


class ProjectDetailResponse(BaseModel):
    id: UUID
    title: str
    description: str
    workflow: WorkflowResponse | None = None
    documents: list[DocumentResponse]