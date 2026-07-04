from app.models.approval import Approval, ApprovalStatus
from app.models.document import Document
from sqlalchemy.orm import Session


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