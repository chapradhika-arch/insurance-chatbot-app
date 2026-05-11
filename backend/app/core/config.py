from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    COHERE_API_KEY: str
    COHERE_CHAT_MODEL: str = "command-r-plus-08-2024"
    COHERE_EMBED_MODEL: str = "embed-english-v3.0"

    CORS_ORIGINS: str = "http://localhost:4200"

    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    LOG_LEVEL: str = "INFO"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


settings = Settings()
