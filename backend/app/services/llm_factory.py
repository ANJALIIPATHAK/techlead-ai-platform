from app.core.config import settings
from app.services.llm_service import LLMService
from app.services.gemini_llm_service import GeminiLLMService
from app.services.groq_llm_service import GroqLLMService


class LLMFactory:
    @staticmethod
    def create() -> LLMService:
        provider = settings.llm_provider.lower()

        if provider == "gemini":
            print("Using Gemini LLM")
            return GeminiLLMService()

        if provider == "groq":
            print("Using Groq LLM")
            return GroqLLMService()

        raise ValueError(
            f"Unsupported LLM provider: {provider}"
        )