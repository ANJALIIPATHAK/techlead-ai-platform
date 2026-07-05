from sqlalchemy.orm import Session

from app.agents.system_architect import SystemArchitectAgent
from app.models.approval import ApprovalStatus
from app.models.document import Document, DocumentType
from app.models.project import Project
from app.services.approval_service import ApprovalService
from app.services.document_service import DocumentService
from app.services.llm_factory import LLMFactory


class SystemArchitectService:
    @staticmethod
    def generate_system_design(
        db: Session,
        project: Project,
        prd_content: str,
    ) -> Document:
        """
        Generates the initial System Design from an approved PRD.
        """

        llm = LLMFactory.create()
        agent = SystemArchitectAgent(llm)

        system_design = agent.generate(
            project_title=project.title,
            approved_prd_content=prd_content,
        )

        document = DocumentService.create_document(
            db=db,
            project=project,
            document_type=DocumentType.SYSTEM_DESIGN,
            title="System Design Document",
            content=system_design,
        )

        ApprovalService.create_initial_approval(
            db=db,
            document=document,
        )

        return document

    @staticmethod
    def regenerate_system_design(
        db: Session,
        project: Project,
        reviewer_feedback: str,
    ) -> Document:
        """
        Regenerates the latest System Design based on reviewer feedback.
        """

        llm = LLMFactory.create()
        agent = SystemArchitectAgent(llm)

        latest_system_design = DocumentService.get_latest_document(
            db=db,
            project=project,
            document_type=DocumentType.SYSTEM_DESIGN,
        )

        if latest_system_design is None:
            raise ValueError(
                "No System Design found for this project."
            )

        approval = ApprovalService.get_approval_by_document(
            db=db,
            document=latest_system_design,
        )

        if approval is not None:
            ApprovalService.update_approval(
                db=db,
                approval=approval,
                status=ApprovalStatus.REJECTED,
                review_comment=reviewer_feedback,
            )

        updated_system_design = agent.regenerate(
            current_document=latest_system_design.content,
            conversation_history=reviewer_feedback,
        )

        new_document = DocumentService.create_document(
            db=db,
            project=project,
            document_type=DocumentType.SYSTEM_DESIGN,
            title=latest_system_design.title,
            content=updated_system_design,
        )

        ApprovalService.create_initial_approval(
            db=db,
            document=new_document,
        )

        return new_document