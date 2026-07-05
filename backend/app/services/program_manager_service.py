from sqlalchemy.orm import Session

from app.agents.program_manager import ProgramManagerAgent
from app.models.approval import ApprovalStatus
from app.models.document import Document, DocumentType
from app.models.project import Project
from app.services.approval_service import ApprovalService
from app.services.document_service import DocumentService
from app.services.llm_factory import LLMFactory


class ProgramManagerService:
    @staticmethod
    def generate_sprint_plan(
        db: Session,
        project: Project,
        system_design_content: str,
    ) -> Document:
        """
        Generates the initial Sprint Plan from an approved
        System Design Document.
        """

        llm = LLMFactory.create()
        agent = ProgramManagerAgent(llm)

        sprint_plan = agent.generate(
            project_title=project.title,
            approved_system_design_content=system_design_content,
        )

        document = DocumentService.create_document(
            db=db,
            project=project,
            document_type=DocumentType.SPRINT_PLAN,
            title="Sprint Plan",
            content=sprint_plan,
        )

        ApprovalService.create_initial_approval(
            db=db,
            document=document,
        )

        return document

    @staticmethod
    def regenerate_sprint_plan(
        db: Session,
        project: Project,
        reviewer_feedback: str,
    ) -> Document:
        """
        Regenerates the latest Sprint Plan based on reviewer feedback.
        """

        llm = LLMFactory.create()
        agent = ProgramManagerAgent(llm)

        latest_sprint_plan = DocumentService.get_latest_document(
            db=db,
            project=project,
            document_type=DocumentType.SPRINT_PLAN,
        )

        if latest_sprint_plan is None:
            raise ValueError(
                "No Sprint Plan found for this project."
            )

        approval = ApprovalService.get_approval_by_document(
            db=db,
            document=latest_sprint_plan,
        )

        if approval is not None:
            ApprovalService.update_approval(
                db=db,
                approval=approval,
                status=ApprovalStatus.REJECTED,
                review_comment=reviewer_feedback,
            )

        updated_sprint_plan = agent.regenerate(
            current_document=latest_sprint_plan.content,
            conversation_history=reviewer_feedback,
        )

        new_document = DocumentService.create_document(
            db=db,
            project=project,
            document_type=DocumentType.SPRINT_PLAN,
            title=latest_sprint_plan.title,
            content=updated_sprint_plan,
        )

        ApprovalService.create_initial_approval(
            db=db,
            document=new_document,
        )

        return new_document