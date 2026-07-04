from app.models.document import Document, DocumentType
from app.models.project import Project
from sqlalchemy.orm import Session


class DocumentService:
    @staticmethod
    def create_document(
        db: Session,
        project: Project,
        document_type: DocumentType,
        title: str,
        content: str,
    ) -> Document:
        document = Document(
            project_id=project.id,
            type=document_type,
            title=title,
            content=content,
            version=1,
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        return document