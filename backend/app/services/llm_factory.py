from app.core.config import settings

from app.services.llm_service import LLMService




class LLMFactory:

    @staticmethod

    def create() -> LLMService:

        provider = (getattr(settings, "llm_provider", "") or "").lower()


        if provider == "gemini":

            from app.services.gemini_llm_service import GeminiLLMService


            print("Using Gemini LLM")

            return GeminiLLMService()


        if provider == "groq":

            from app.services.groq_llm_service import GroqLLMService


            print("Using Groq LLM")

            return GroqLLMService()


        raise ValueError(

            f"Unsupported LLM provider: {provider}"

        )