from abc import ABC, abstractmethod


class LLMService(ABC):
    @abstractmethod
    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
    ) -> str:
        """
        Generates text using an LLM.
        """
        ...