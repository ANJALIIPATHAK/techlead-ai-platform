from enum import Enum

from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base_model import PersistentModel

from uuid import UUID

from sqlalchemy import ForeignKey


class WorkflowStage(str, Enum):
    PRD = "PRD"
    SYSTEM_DESIGN = "SYSTEM_DESIGN"
    SPRINT_PLAN = "SPRINT_PLAN"
    COMPLETED = "COMPLETED"


class WorkflowStatus(str, Enum):
    QUEUED = "QUEUED"
    GENERATING = "GENERATING"
    WAITING_FOR_REVIEW = "WAITING_FOR_REVIEW"
    FAILED = "FAILED"
    COMPLETED = "COMPLETED"


class Workflow(PersistentModel):
    __tablename__ = "workflows"

    stage: Mapped[WorkflowStage] = mapped_column(
        SQLEnum(WorkflowStage),
        nullable=False,
    )

    status: Mapped[WorkflowStatus] = mapped_column(
        SQLEnum(WorkflowStatus),
        nullable=False,
    )
    
    project_id: Mapped[UUID] = mapped_column(
        ForeignKey("projects.id"),
        nullable=False,
        unique=True,
    )
    
    error_message: Mapped[str | None] = mapped_column(
        nullable=True,
    )

    retry_count: Mapped[int] = mapped_column(
        nullable=False,
        default=0,
    )