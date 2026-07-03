from enum import Enum

from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base_model import PersistentModel

from uuid import UUID

from sqlalchemy import ForeignKey


class ApprovalStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class Approval(PersistentModel):
    __tablename__ = "approvals"

    status: Mapped[ApprovalStatus] = mapped_column(
        SQLEnum(ApprovalStatus),
        nullable=False,
    )
    
    document_id: Mapped[UUID] = mapped_column(
        ForeignKey("documents.id"),
        nullable=False,
        unique=True,
    )
    
    review_comment: Mapped[str | None] = mapped_column(
        nullable=True,
    )