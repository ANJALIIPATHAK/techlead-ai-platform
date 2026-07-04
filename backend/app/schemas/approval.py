from pydantic import BaseModel


class ApprovalRequest(BaseModel):
    approved: bool
    review_comment: str | None = None