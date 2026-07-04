from app.agents.product_manager import ProductManagerAgent
from app.services.gemini_llm_service import GeminiLLMService


def main():
    llm = GeminiLLMService()

    agent = ProductManagerAgent(llm)

    prd = agent.generate(
        project_title="AI Traffic Management",
        project_description="""
Build an AI-powered traffic management platform that
collects live traffic data, predicts congestion,
optimizes signal timing, detects accidents,
and provides real-time route recommendations.
""",
    )

    print("\n" + "=" * 80)
    print("GENERATED PRD")
    print("=" * 80 + "\n")
    print(prd)


if __name__ == "__main__":
    main()