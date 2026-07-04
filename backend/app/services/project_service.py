from uuid import UUID

from sqlalchemy.orm import Session

from app.agents.product_manager import ProductManagerAgent
from app.models.document import Document, DocumentType
from app.models.project import Project
from app.schemas.project import ProjectCreate
from app.services.approval_service import ApprovalService
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
        Creates a new project and automatically generates
        its initial Product Requirements Document (PRD).
        """

        title = TitleGenerator.generate(project_data.description)

        project = Project(
            title=title,
            description=project_data.description,
        )

        db.add(project)
        db.commit()
        db.refresh(project)

        # Generate PRD using AI
        llm = GeminiLLMService()
        product_manager = ProductManagerAgent(llm)

        prd = product_manager.generate(
            project_title=project.title,
            project_description=project.description,
        )

        # Save PRD
        document = DocumentService.create_document(
            db=db,
            project=project,
            document_type=DocumentType.PRD,
            title="Product Requirements Document",
            content=prd,
        )

        # Create initial approval
        ApprovalService.create_initial_approval(
            db=db,
            document=document,
        )

        return project

    @staticmethod
    def get_project(
        db: Session,
        project_id: UUID,
    ):
        """
        Retrieves a project along with all its generated documents.
        """

        project = (
            db.query(Project)
            .filter(Project.id == project_id)
            .first()
        )

        if project is None:
            return None

        documents = (
            db.query(Document)
            .filter(Document.project_id == project.id)
            .all()
        )

        return {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "documents": [
                {
                    "type": document.type.value,
                    "title": document.title,
                    "content": document.content,
                    "version": document.version,
                }
                for document in documents
            ],
        }