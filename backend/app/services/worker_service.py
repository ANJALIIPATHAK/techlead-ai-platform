import traceback


from sqlalchemy.orm import Session


from app.models.document import DocumentType

from app.models.workflow import WorkflowStage

from app.services.document_service import DocumentService

from app.services.product_manager_service import (

    ProductManagerService,

)

from app.services.program_manager_service import (

    ProgramManagerService,

)

from app.services.system_architect_service import (

    SystemArchitectService,

)

from app.services.workflow_job_service import (

    WorkflowJobService,

)




class WorkerService:

    @staticmethod

    def process_next_job(

        db: Session,

    ) -> bool:

        """

        Processes exactly one queued workflow job.

        """


        workflow = WorkflowJobService.find_next_queued_job(

            db,

        )


        if workflow is None:

            return False


        WorkflowJobService.mark_generating(

            db,

            workflow,

        )


        project = WorkflowJobService.get_project(

            db,

            workflow,

        )


        if project is None:

            WorkflowJobService.mark_failed(

                db,

                workflow,

                "Project not found.",

            )

            return False


        try:


            #

            # PRODUCT MANAGER

            #

            if workflow.stage == WorkflowStage.PRD:


                if workflow.review_comment:

                    ProductManagerService.regenerate_prd(

                        db=db,

                        project=project,

                        reviewer_feedback=workflow.review_comment,

                    )

                else:

                    ProductManagerService.generate_prd(

                        db=db,

                        project=project,

                    )


                WorkflowJobService.mark_waiting_for_review(

                    db,

                    workflow,

                )


            #

            # SYSTEM ARCHITECT

            #

            elif (

                workflow.stage

                == WorkflowStage.SYSTEM_DESIGN

            ):


                latest_prd = (

                    DocumentService.get_latest_document(

                        db=db,

                        project=project,

                        document_type=DocumentType.PRD,

                    )

                )


                if latest_prd is None:

                    raise ValueError(

                        "Approved PRD not found."

                    )


                if workflow.review_comment:

                    SystemArchitectService.regenerate_system_design(

                        db=db,

                        project=project,

                        reviewer_feedback=workflow.review_comment,

                    )

                else:

                    SystemArchitectService.generate_system_design(

                        db=db,

                        project=project,

                        prd_content=latest_prd.content,

                    )


                WorkflowJobService.mark_waiting_for_review(

                    db,

                    workflow,

                )


            #

            # PROGRAM MANAGER

            #

            elif (

                workflow.stage

                == WorkflowStage.SPRINT_PLAN

            ):


                latest_system_design = (

                    DocumentService.get_latest_document(

                        db=db,

                        project=project,

                        document_type=DocumentType.SYSTEM_DESIGN,

                    )

                )


                if latest_system_design is None:

                    raise ValueError(

                        "Approved System Design not found."

                    )


                if workflow.review_comment:

                    ProgramManagerService.regenerate_sprint_plan(

                        db=db,

                        project=project,

                        reviewer_feedback=workflow.review_comment,

                    )

                else:

                    ProgramManagerService.generate_sprint_plan(

                        db=db,

                        project=project,

                        system_design_content=latest_system_design.content,

                    )


                WorkflowJobService.mark_waiting_for_review(

                    db,

                    workflow,

                )


            else:


                raise ValueError(

                    f"Unknown workflow stage: {workflow.stage}"

                )


        except Exception:


            WorkflowJobService.mark_failed(

                db,

                workflow,

                traceback.format_exc(),

            )


            return False


        return True