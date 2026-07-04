from app.agents.base_agent import BaseAgent
from app.services.llm_service import LLMService
from app.utils.prompt_loader import PromptLoader


class ProductManagerAgent(BaseAgent):
    def __init__(self, llm: LLMService):
        self.llm = llm

    @property
    def name(self) -> str:
        return "Product Manager"

    @property
    def document_type(self) -> str:
        return "PRD"

    def generate(
        self,
        project_title: str,
        project_description: str,
    ) -> str:
        system_prompt = PromptLoader.load(
            "product_manager.md"
        )

        user_prompt = f"""
Project Title:
{project_title}

Project Description:
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
            "product_manager.md"
        )

        user_prompt = f"""
    Current Product Requirements Document:

    {current_document}

    Reviewer Feedback:

    {conversation_history}

    Generate an improved version of the PRD by addressing all reviewer feedback.

    Return the complete updated PRD in Markdown.
    """

        return self.llm.generate(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
        )