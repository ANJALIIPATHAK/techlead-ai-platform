from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models.document import Document, DocumentType
from app.models.project import Project


class DocumentService:
    @staticmethod
    def create_document(
        db: Session,
        project: Project,
        document_type: DocumentType,
        title: str,
        content: str,
    ) -> Document:
        """
        Creates a new document with the next available version.
        """

        latest_document = DocumentService.get_latest_document(
            db=db,
            project=project,
            document_type=document_type,
        )

        next_version = (
            latest_document.version + 1
            if latest_document
            else 1
        )

        document = Document(
            project_id=project.id,
            type=document_type,
            title=title,
            content=content,
            version=next_version,
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        return document

    @staticmethod
    def get_latest_document(
        db: Session,
        project: Project,
        document_type: DocumentType,
    ) -> Document | None:
        """
        Returns the latest version of a document for a project.
        """

        return (
            db.query(Document)
            .filter(
                Document.project_id == project.id,
                Document.type == document_type,
            )
            .order_by(desc(Document.version))
            .first()
        )