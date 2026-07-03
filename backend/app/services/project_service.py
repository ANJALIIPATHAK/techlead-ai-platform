from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import ProjectCreate
from app.services.title_generator import TitleGenerator


class ProjectService:
    @staticmethod
    def create_project(
        db: Session,
        project_data: ProjectCreate,
    ) -> Project:
        """
        Creates a new project.
        """

        title = TitleGenerator.generate(project_data.description)

        project = Project(
            title=title,
            description=project_data.description,
        )

        db.add(project)
        db.commit()
        db.refresh(project)

        return project