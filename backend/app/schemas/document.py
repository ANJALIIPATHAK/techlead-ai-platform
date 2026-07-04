from pydantic import BaseModel, Field


class DocumentResponse(BaseModel):
    type: str
    title: str
    content: str
    version: int
    status: str
    review_comment: str | None


class RegenerateDocumentRequest(BaseModel):
    review_comment: str = Field(
        ...,
        min_length=5,
        max_length=5000,
    )