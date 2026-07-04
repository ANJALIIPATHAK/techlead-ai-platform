from uuid import UUID

from sqlalchemy.orm import Session

from app.agents.product_manager import ProductManagerAgent
from app.models.document import DocumentType
from app.models.project import Project
from app.schemas.project import ProjectCreate
from app.services.document_service import DocumentService
from app.services.gemini_llm_service import GeminiLLMService
from app.services.title_generator import TitleGenerator


class ProjectService:
    @staticmethod
    def create_project(
        db: Session,
        project_data: ProjectCreate,
    ) -> Project:
        """
        Creates a new project and generates its initial PRD.
        """

        title = TitleGenerator.generate(project_data.description)

        project = Project(
            title=title,
            description=project_data.description,
        )

        db.add(project)
        db.commit()
        db.refresh(project)

        # Generate PRD
        llm = GeminiLLMService()
        product_manager = ProductManagerAgent(llm)

        prd = product_manager.generate(
            project_title=project.title,
            project_description=project.description,
        )

        # Save PRD
        DocumentService.create_document(
            db=db,
            project=project,
            document_type=DocumentType.PRD,
            title="Product Requirements Document",
            content=prd,
        )

        return project

    @staticmethod
    def get_project(
        db: Session,
        project_id: UUID,
    ) -> Project | None:
        """
        Retrieves a project by its ID.
        """

        return (
            db.query(Project)
            .filter(Project.id == project_id)
            .first()
        )