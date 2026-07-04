from sqlalchemy.orm import Session

from app.models.approval import Approval, ApprovalStatus
from app.models.document import Document


class ApprovalService:
    @staticmethod
    def create_initial_approval(
        db: Session,
        document: Document,
    ) -> Approval:
        approval = Approval(
            document_id=document.id,
            status=ApprovalStatus.PENDING,
            review_comment=None,
        )

        db.add(approval)
        db.commit()
        db.refresh(approval)

        return approval

    @staticmethod
    def get_approval_by_document(
        db: Session,
        document: Document,
    ) -> Approval | None:
        return (
            db.query(Approval)
            .filter(Approval.document_id == document.id)
            .first()
        )

    @staticmethod
    def update_approval(
        db: Session,
        approval: Approval,
        status: ApprovalStatus,
        review_comment: str | None = None,
    ) -> Approval:
        approval.status = status
        approval.review_comment = review_comment

        db.commit()
        db.refresh(approval)

        return approval