from sqlalchemy.orm import Session


from app.models.approval import ApprovalStatus

from app.models.document import DocumentType

from app.models.project import Project

from app.services.approval_service import ApprovalService

from app.services.document_service import DocumentService

from app.services.program_manager_service import (

    ProgramManagerService,

)

from app.services.system_architect_service import (

    SystemArchitectService,

)

from app.services.workflow_job_service import WorkflowJobService

from app.models.workflow import WorkflowStage




class WorkflowService:

    @staticmethod

    def approve_prd(

        db: Session,

        project: Project,

    ):

        """

        Approves the latest PRD and automatically

        generates the System Design document.

        """


        latest_prd = DocumentService.get_latest_document(

            db=db,

            project=project,

            document_type=DocumentType.PRD,

        )


        if latest_prd is None:

            raise ValueError("No PRD exists for this project.")


        approval = ApprovalService.get_approval_by_document(

            db=db,

            document=latest_prd,

        )


        if approval is None:

            raise ValueError("Approval record not found.")


        ApprovalService.update_approval(

            db=db,

            approval=approval,

            status=ApprovalStatus.APPROVED,

        )


        workflow = WorkflowJobService.get_job(

            db=db,

            project=project,

        )


        if workflow is None:

            raise ValueError("Workflow record not found.")


        WorkflowJobService.queue_stage(

            db=db,

            workflow=workflow,

            stage=WorkflowStage.SYSTEM_DESIGN,

        )


        return workflow


    @staticmethod

    def approve_system_design(

        db: Session,

        project: Project,

    ):

        """

        Approves the latest System Design and

        automatically generates the Sprint Plan.

        """


        latest_system_design = (

            DocumentService.get_latest_document(

                db=db,

                project=project,

                document_type=DocumentType.SYSTEM_DESIGN,

            )

        )


        if latest_system_design is None:

            raise ValueError(

                "No System Design exists for this project."

            )


        approval = ApprovalService.get_approval_by_document(

            db=db,

            document=latest_system_design,

        )


        if approval is None:

            raise ValueError("Approval record not found.")


        ApprovalService.update_approval(

            db=db,

            approval=approval,

            status=ApprovalStatus.APPROVED,

        )


        workflow = WorkflowJobService.get_job(

            db=db,

            project=project,

        )


        if workflow is None:

            raise ValueError("Workflow record not found.")


        WorkflowJobService.queue_stage(

            db=db,

            workflow=workflow,

            stage=WorkflowStage.SPRINT_PLAN,

        )


        return workflow


    @staticmethod

    def regenerate_prd(

        db: Session,

        project: Project,

        reviewer_feedback: str,

    ):

        workflow = WorkflowJobService.get_job(

            db=db,

            project=project,

        )


        if workflow is None:

            raise ValueError("Workflow record not found.")


        return WorkflowJobService.queue_stage(

            db=db,

            workflow=workflow,

            stage=WorkflowStage.PRD,

            review_comment=reviewer_feedback,

        )


    @staticmethod

    def regenerate_system_design(

        db: Session,

        project: Project,

        reviewer_feedback: str,

    ):

        workflow = WorkflowJobService.get_job(

            db=db,

            project=project,

        )


        if workflow is None:

            raise ValueError("Workflow record not found.")


        return WorkflowJobService.queue_stage(

            db=db,

            workflow=workflow,

            stage=WorkflowStage.SYSTEM_DESIGN,

            review_comment=reviewer_feedback,

        )


    @staticmethod

    def regenerate_sprint_plan(

        db: Session,

        project: Project,

        reviewer_feedback: str,

    ):

        workflow = WorkflowJobService.get_job(

            db=db,

            project=project,

        )


        if workflow is None:

            raise ValueError("Workflow record not found.")


        return WorkflowJobService.queue_stage(

            db=db,

            workflow=workflow,

            stage=WorkflowStage.SPRINT_PLAN,

            review_comment=reviewer_feedback,

        )


    @staticmethod

    def approve_sprint_plan(

        db: Session,

        project: Project,

    ):

        """

        Approves the latest Sprint Plan.

        """


        latest_sprint_plan = (

            DocumentService.get_latest_document(

                db=db,

                project=project,

                document_type=DocumentType.SPRINT_PLAN,

            )

        )


        if latest_sprint_plan is None:

            raise ValueError(

                "No Sprint Plan exists for this project."

            )


        approval = ApprovalService.get_approval_by_document(

            db=db,

            document=latest_sprint_plan,

        )


        if approval is None:

            raise ValueError("Approval record not found.")


        ApprovalService.update_approval(

            db=db,

            approval=approval,

            status=ApprovalStatus.APPROVED,

        )


        workflow = WorkflowJobService.get_job(

            db=db,

            project=project,

        )


        if workflow is None:

            raise ValueError("Workflow record not found.")


        workflow.stage = WorkflowStage.COMPLETED

        WorkflowJobService.mark_completed(

            db=db,

            workflow=workflow,

        )


        return latest_sprint_plan