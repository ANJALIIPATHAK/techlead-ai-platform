import os



from pydantic_settings import BaseSettings, SettingsConfigDict





class Settings(BaseSettings):

    app_name: str = os.getenv("APP_NAME", "TechLead AI Platform")

    app_version: str = os.getenv("APP_VERSION", "1.0.0")

    environment: str = os.getenv("ENVIRONMENT", "development")



    database_url: str = os.getenv("DATABASE_URL", "")



    llm_provider: str = os.getenv("LLM_PROVIDER", "groq")



    # Gemini

    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")

    gemini_model: str = os.getenv("GEMINI_MODEL", "")



    # Groq

    groq_api_key: str = os.getenv("GROQ_API_KEY", "")

    groq_model: str = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")



    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")

    ollama_model: str = os.getenv("OLLAMA_MODEL", "llama3")



    model_config = SettingsConfigDict(

        env_file=".env",

        case_sensitive=False,

        extra="ignore",

    )





settings = Settings()