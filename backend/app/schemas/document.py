from pydantic import BaseModel


class DocumentResponse(BaseModel):
    type: str
    title: str
    content: str
    version: int