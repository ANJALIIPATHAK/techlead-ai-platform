from sqlalchemy.orm import Session

from app.agents.product_manager import ProductManagerAgent
from app.models.document import Document, DocumentType
from app.models.project import Project
from app.services.approval_service import ApprovalService
from app.services.document_service import DocumentService
from app.services.gemini_llm_service import GeminiLLMService


class ProductManagerService:
    @staticmethod
    def regenerate_prd(
        db: Session,
        project: Project,
        reviewer_feedback: str,
    ) -> Document:
        llm = GeminiLLMService()
        agent = ProductManagerAgent(llm)

        latest_prd = DocumentService.get_latest_document(
            db=db,
            project=project,
            document_type=DocumentType.PRD,
        )

        if latest_prd is None:
            raise ValueError("No PRD found for this project.")

        updated_prd = agent.regenerate(
            current_document=latest_prd.content,
            conversation_history=reviewer_feedback,
        )

        new_document = DocumentService.create_document(
            db=db,
            project=project,
            document_type=DocumentType.PRD,
            title=latest_prd.title,
            content=updated_prd,
        )

        ApprovalService.create_initial_approval(
            db=db,
            document=new_document,
        )

        return new_document