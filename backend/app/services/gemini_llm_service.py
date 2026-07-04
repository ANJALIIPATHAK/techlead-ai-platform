from google import genai

from app.core.config import settings
from app.services.llm_service import LLMService


class GeminiLLMService(LLMService):
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.gemini_api_key,
        )

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
    ) -> str:
        response = self.client.models.generate_content(
            model=settings.gemini_model,
            contents=f"""
{system_prompt}

{user_prompt}
""",
        )

        return response.text