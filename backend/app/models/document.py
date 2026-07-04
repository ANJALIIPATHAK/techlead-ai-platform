from enum import Enum

from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column

from uuid import UUID

from sqlalchemy import ForeignKey

from app.models.base_model import PersistentModel


class DocumentType(str, Enum):
    PRD = "PRD"
    SYSTEM_DESIGN = "SYSTEM_DESIGN"
    SPRINT_PLAN = "SPRINT_PLAN"


class Document(PersistentModel):
    __tablename__ = "documents"

    type: Mapped[DocumentType] = mapped_column(
        SQLEnum(DocumentType),
        nullable=False,
    )
    
    project_id: Mapped[UUID] = mapped_column(
        ForeignKey("projects.id"),
        nullable=False,
    )
    
    title: Mapped[str] = mapped_column(
        nullable=False,
    )
    
    content: Mapped[str] = mapped_column(
        nullable=False,
    )
    
    version: Mapped[int] = mapped_column(
        nullable=False,
        default=1,
    )