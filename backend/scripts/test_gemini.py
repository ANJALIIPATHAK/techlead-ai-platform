from app.services.gemini_llm_service import GeminiLLMService


def main():
    llm = GeminiLLMService()

    response = llm.generate(
        system_prompt="You are a helpful assistant.",
        user_prompt="Reply with exactly: TechLead AI Platform is working.",
    )

    print("\n===== GEMINI RESPONSE =====\n")
    print(response)


if __name__ == "__main__":
    main()