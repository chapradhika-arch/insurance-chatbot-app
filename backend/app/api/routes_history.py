from fastapi import APIRouter

from app.domain.schemas import ChatMessage, HistoryResponse
from app.services.chat_service import chat_service

router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("/{conversation_id}", response_model=HistoryResponse)
async def get_history(conversation_id: str) -> HistoryResponse:
    raw = chat_service.history(conversation_id)
    messages = [ChatMessage(role=m["role"], content=m["content"]) for m in raw]
    return HistoryResponse(conversation_id=conversation_id, messages=messages)


@router.delete("/{conversation_id}", status_code=204)
async def clear_history(conversation_id: str) -> None:
    chat_service.clear(conversation_id)
