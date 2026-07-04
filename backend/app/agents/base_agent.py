from abc import ABC, abstractmethod


class BaseAgent(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        """Returns the agent's display name."""
        ...

    @property
    @abstractmethod
    def document_type(self) -> str:
        """Returns the document type handled by this agent."""
        ...

    @abstractmethod
    def generate(
        self,
        project_title: str,
        project_description: str,
    ) -> str:
        """Generates the initial document."""
        ...

    @abstractmethod
    def regenerate(
        self,
        current_document: str,
        conversation_history: str,
    ) -> str:
        """Updates an existing document."""
        ...