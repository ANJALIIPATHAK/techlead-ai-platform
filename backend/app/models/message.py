from uuid import UUID

from sqlalchemy import ForeignKey

from enum import Enum

from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base_model import PersistentModel


class MessageRole(str, Enum):
    USER = "USER"
    PRODUCT_MANAGER = "PRODUCT_MANAGER"
    SYSTEM_ARCHITECT = "SYSTEM_ARCHITECT"
    PROGRAM_MANAGER = "PROGRAM_MANAGER"


class Message(PersistentModel):
    __tablename__ = "messages"

    role: Mapped[MessageRole] = mapped_column(
        SQLEnum(MessageRole),
        nullable=False,
    )
    
    document_id: Mapped[UUID] = mapped_column(
        ForeignKey("documents.id"),
        nullable=False,
    )
    
    content: Mapped[str] = mapped_column(
        nullable=False,
    )
    
    is_final: Mapped[bool] = mapped_column(
        nullable=False,
        default=True,
    )