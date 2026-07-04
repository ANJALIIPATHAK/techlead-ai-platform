from sqlalchemy.orm import Session

from app.agents.program_manager import ProgramManagerAgent
from app.models.document import Document, DocumentType
from app.models.project import Project
from app.services.approval_service import ApprovalService
from app.services.document_service import DocumentService
from app.services.gemini_llm_service import GeminiLLMService


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

        llm = GeminiLLMService()
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