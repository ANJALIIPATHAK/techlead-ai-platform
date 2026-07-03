from textwrap import shorten


class TitleGenerator:
    @staticmethod
    def generate(description: str) -> str:
        """
        Temporary implementation.
        Will be replaced by an LLM in the next iteration.
        """
        return shorten(description, width=50, placeholder="...")