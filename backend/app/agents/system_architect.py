from app.agents.base_agent import BaseAgent
from app.services.llm_service import LLMService
from app.utils.prompt_loader import PromptLoader


class SystemArchitectAgent(BaseAgent):
    def __init__(self, llm: LLMService):
        self.llm = llm

    @property
    def name(self) -> str:
        return "System Architect"

    @property
    def document_type(self) -> str:
        return "SYSTEM_DESIGN"

    def generate(
        self,
        project_title: str,
        project_description: str,
    ) -> str:
        system_prompt = PromptLoader.load(
            "system_architect.md"
        )

        user_prompt = f"""
Project Title:
{project_title}

Approved Product Requirements Document:

{project_description}
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
            "system_architect.md"
        )

        user_prompt = f"""
Current System Design:

{current_document}

Reviewer Feedback:

{conversation_history}

Generate an improved System Design by addressing all reviewer feedback.

Return the complete updated System Design in Markdown.
"""

        return self.llm.generate(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
        )