from openai import OpenAI

from app.core.config import settings
from app.services.llm_service import LLMService


class OllamaLLMService(LLMService):
    def __init__(self):
        self.client = OpenAI(
            base_url=settings.ollama_base_url,
            api_key="ollama",  # Required by the SDK, ignored by Ollama
        )

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
    ) -> str:
        response = self.client.chat.completions.create(
            model=settings.ollama_model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
        )

        return response.choices[0].message.content