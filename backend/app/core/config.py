from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str
    app_version: str
    environment: str

    database_url: str

    llm_provider: str

    # Gemini
    gemini_api_key: str = ""
    gemini_model: str = ""

    # Groq
    groq_api_key: str = ""
    groq_model: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()