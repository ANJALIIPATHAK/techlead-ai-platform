from sqlalchemy.orm import Session

from app.agents.product_manager import ProductManagerAgent
from app.models.approval import ApprovalStatus
from app.models.document import Document, DocumentType
from app.models.project import Project
from app.services.approval_service import ApprovalService
from app.services.document_service import DocumentService
from app.services.llm_factory import LLMFactory


class ProductManagerService:
    @staticmethod
    def generate_prd(
        db: Session,
        project: Project,
    ) -> Document:
        """
        Generates the initial PRD for a project.
        """

        llm = LLMFactory.create()
        agent = ProductManagerAgent(llm)

        prd = agent.generate(
            project_title=project.title,
            project_description=project.description,
        )

        document = DocumentService.create_document(
            db=db,
            project=project,
            document_type=DocumentType.PRD,
            title="Product Requirements Document",
            content=prd,
        )

        ApprovalService.create_initial_approval(
            db=db,
            document=document,
        )

        return document

    @staticmethod
    def regenerate_prd(
        db: Session,
        project: Project,
        reviewer_feedback: str,
    ) -> Document:
        """
        Regenerates the latest PRD based on reviewer feedback.
        """

        llm = LLMFactory.create()
        agent = ProductManagerAgent(llm)

        latest_prd = DocumentService.get_latest_document(
            db=db,
            project=project,
            document_type=DocumentType.PRD,
        )

        if latest_prd is None:
            raise ValueError("No PRD found for this project.")

        approval = ApprovalService.get_approval_by_document(
            db=db,
            document=latest_prd,
        )

        if approval is not None:
            ApprovalService.update_approval(
                db=db,
                approval=approval,
                status=ApprovalStatus.REJECTED,
                review_comment=reviewer_feedback,
            )

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