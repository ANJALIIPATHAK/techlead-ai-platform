from uuid import UUID

from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.project import Project
from app.schemas.project import ProjectCreate
from app.services.approval_service import ApprovalService
from app.services.product_manager_service import ProductManagerService
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

        ProductManagerService.generate_prd(
            db=db,
            project=project,
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
            .order_by(Document.type, Document.version)
            .all()
        )

        documents_response = []

        for document in documents:
            approval = ApprovalService.get_approval_by_document(
                db=db,
                document=document,
            )

            documents_response.append(
                {
                    "type": document.type.value,
                    "title": document.title,
                    "content": document.content,
                    "version": document.version,
                    "status": (
                        approval.status.value
                        if approval
                        else "UNKNOWN"
                    ),
                    "review_comment": (
                        approval.review_comment
                        if approval
                        else None
                    ),
                }
            )

        return {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "documents": documents_response,
        }