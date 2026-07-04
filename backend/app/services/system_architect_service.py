from sqlalchemy.orm import Session

from app.agents.system_architect import SystemArchitectAgent
from app.models.document import Document, DocumentType
from app.models.project import Project
from app.services.approval_service import ApprovalService
from app.services.document_service import DocumentService
from app.services.gemini_llm_service import GeminiLLMService


class SystemArchitectService:
    @staticmethod
    def generate_system_design(
        db: Session,
        project: Project,
        prd_content: str,
    ) -> Document:
        llm = GeminiLLMService()
        agent = SystemArchitectAgent(llm)

        system_design = agent.generate(
            project_title=project.title,
            project_description=prd_content,
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