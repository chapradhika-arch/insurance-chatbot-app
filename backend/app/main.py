import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_chat import router as chat_router
from app.api.routes_history import router as history_router
from app.core.config import settings

logging.basicConfig(level=settings.LOG_LEVEL)

app = FastAPI(
    title="Insurance Chatbot API",
    version="0.1.0",
    description="POC backend: FastAPI + LangChain + Cohere.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(history_router)


@app.get("/api/health", tags=["meta"])
async def health() -> dict[str, str]:
    return {"status": "ok", "model": settings.COHERE_CHAT_MODEL}
