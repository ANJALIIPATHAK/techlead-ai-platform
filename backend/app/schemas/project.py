from pydantic import BaseModel, Field
from uuid import UUID


class ProjectCreate(BaseModel):
    description: str = Field(
        ...,
        min_length=20,
        max_length=5000,
    )


class ProjectResponse(BaseModel):
    id: UUID
    title: str
    description: str