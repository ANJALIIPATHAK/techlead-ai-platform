from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.workflow import (
    Workflow,
    WorkflowStage,
    WorkflowStatus,
)


class WorkflowJobService:
    @staticmethod
    def create_job(
        db: Session,
        project: Project,
        stage: WorkflowStage,
    ) -> Workflow:
        """
        Creates a new workflow job.
        """

        workflow = Workflow(
            project_id=project.id,
            stage=stage,
            status=WorkflowStatus.QUEUED,
            retry_count=0,
        )

        db.add(workflow)
        db.commit()
        db.refresh(workflow)

        return workflow

    @staticmethod
    def get_job(
        db: Session,
        project: Project,
    ) -> Workflow | None:
        """
        Returns the workflow associated with a project.
        """

        return (
            db.query(Workflow)
            .filter(
                Workflow.project_id == project.id,
            )
            .first()
        )

    @staticmethod
    def get_project(
        db: Session,
        workflow: Workflow,
    ) -> Project | None:
        """
        Returns the project associated with a workflow.
        """

        return (
            db.query(Project)
            .filter(
                Project.id == workflow.project_id,
            )
            .first()
        )

    @staticmethod
    def find_next_queued_job(
        db: Session,
    ) -> Workflow | None:
        """
        Returns the oldest queued workflow.
        """

        return (
            db.query(Workflow)
            .filter(
                Workflow.status == WorkflowStatus.QUEUED,
            )
            .order_by(
                Workflow.created_at.asc(),
            )
            .first()
        )

    @staticmethod
    def mark_generating(
        db: Session,
        workflow: Workflow,
    ) -> Workflow:
        """
        Marks a workflow as currently generating.
        """

        workflow.status = WorkflowStatus.GENERATING

        db.commit()
        db.refresh(workflow)

        return workflow

    @staticmethod
    def mark_waiting_for_review(
        db: Session,
        workflow: Workflow,
    ) -> Workflow:
        """
        Marks a workflow as waiting for user review.
        """

        workflow.status = (
            WorkflowStatus.WAITING_FOR_REVIEW
        )

        db.commit()
        db.refresh(workflow)

        return workflow

    @staticmethod
    def mark_completed(
        db: Session,
        workflow: Workflow,
    ) -> Workflow:
        """
        Marks a workflow as completed.
        """

        workflow.status = WorkflowStatus.COMPLETED

        db.commit()
        db.refresh(workflow)

        return workflow

    @staticmethod
    def mark_failed(
        db: Session,
        workflow: Workflow,
        error_message: str,
    ) -> Workflow:
        """
        Marks a workflow as failed.
        """

        workflow.status = WorkflowStatus.FAILED
        workflow.error_message = error_message
        workflow.retry_count += 1

        db.commit()
        db.refresh(workflow)

        return workflow

    @staticmethod
    def queue_stage(
        db: Session,
        workflow: Workflow,
        stage: WorkflowStage,
    ) -> Workflow:
        """
        Queues the next workflow stage.
        """

        workflow.stage = stage
        workflow.status = WorkflowStatus.QUEUED

        db.commit()
        db.refresh(workflow)

        return workflow