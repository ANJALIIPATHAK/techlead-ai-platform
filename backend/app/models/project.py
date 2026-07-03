from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base_model import PersistentModel


class Project(PersistentModel):
    """
    Represents a software project submitted by the user.
    """

    __tablename__ = "projects"

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )