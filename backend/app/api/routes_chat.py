import json
import logging

from fastapi import APIRouter, HTTPException
from sse_starlette.sse import EventSourceResponse

from app.domain.schemas import ChatRequest, ChatResponse
from app.services.chat_service import chat_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    try:
        reply = await chat_service.reply(req.conversation_id, req.message)
        return ChatResponse(conversation_id=req.conversation_id, reply=reply)
    except Exception as exc:
        logger.exception("Chat error")
        raise HTTPException(status_code=502, detail=f"LLM error: {exc}") from exc


@router.get("/stream")
async def chat_stream(conversation_id: str, message: str) -> EventSourceResponse:
    """SSE endpoint. Browser EventSource only supports GET, so query params it is.

    Note: query length is bounded — for very long messages, prefer POST + chunked
    fetch streaming in production.
    """

    async def event_gen():
        try:
            async for chunk in chat_service.stream(conversation_id, message):
                yield {"event": "chunk", "data": json.dumps({"text": chunk})}
            yield {"event": "done", "data": json.dumps({"conversation_id": conversation_id})}
        except Exception as exc:
            logger.exception("Stream error")
            yield {"event": "error", "data": json.dumps({"message": str(exc)})}

    return EventSourceResponse(event_gen())
