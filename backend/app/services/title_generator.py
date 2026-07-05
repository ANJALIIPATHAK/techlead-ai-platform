from textwrap import shorten

from app.services.llm_factory import LLMFactory


class TitleGenerator:
    @staticmethod
    def generate(description: str) -> str:
        """
        Generates a concise project title using the configured LLM.
        Falls back to a shortened description if the LLM fails.
        """

        prompt = f"""
Generate a concise, professional project title.

Requirements:
- Between 3 and 8 words.
- Suitable for a software engineering project.
- Do not use quotation marks.
- Do not end with a period.
- Return ONLY the title.

Project Description:

{description}
"""

        try:
            llm = LLMFactory.create()

            title = llm.generate(
                system_prompt="You generate concise software project titles.",
                user_prompt=prompt,
            )

            title = title.strip()

            if title:
                return title

        except Exception:
            pass

        # Fallback
        return shorten(
            description,
            width=50,
            placeholder="...",
        )