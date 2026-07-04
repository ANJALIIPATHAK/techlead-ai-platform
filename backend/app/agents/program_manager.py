from app.agents.base_agent import BaseAgent
from app.services.llm_service import LLMService
from app.utils.prompt_loader import PromptLoader


class ProgramManagerAgent(BaseAgent):
    def __init__(self, llm: LLMService):
        self.llm = llm

    @property
    def name(self) -> str:
        return "Program Manager"

    @property
    def document_type(self) -> str:
        return "SPRINT_PLAN"

    def generate(
        self,
        project_title: str,
        approved_system_design_content: str,
    ) -> str:
        system_prompt = PromptLoader.load(
            "program_manager.md"
        )

        user_prompt = f"""
Project Title:
{project_title}

Approved System Design Document:

{approved_system_design_content}
"""

        return self.llm.generate(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
        )

    def regenerate(
        self,
        current_document: str,
        conversation_history: str,
    ) -> str:
        system_prompt = PromptLoader.load(
            "program_manager.md"
        )

        user_prompt = f"""
Current Sprint Plan:

{current_document}

Reviewer Feedback:

{conversation_history}

Generate an improved Sprint Plan by addressing all reviewer feedback.

Return the complete updated Sprint Plan in Markdown.
"""

        return self.llm.generate(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
        )