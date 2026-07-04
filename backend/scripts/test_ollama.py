from app.services.ollama_llm_service import OllamaLLMService


def main():
    llm = OllamaLLMService()

    response = llm.generate(
        system_prompt="You are a helpful assistant.",
        user_prompt="Reply with exactly: TechLead AI Platform is working.",
    )

    print("\n===== LLM RESPONSE =====\n")
    print(response)


if __name__ == "__main__":
    main()