from collections.abc import AsyncIterator

from app.llm.chain_factory import get_chain, get_history_messages, reset_history


class ChatService:
    """Thin orchestration layer over the LangChain chain.

    LangChain's RunnableWithMessageHistory holds the per-conversation
    BaseChatMessageHistory (in-memory for POC). Swap for Redis/Postgres
    in production via a different history factory.
    """

    async def reply(self, conversation_id: str, question: str) -> str:
        chain = get_chain()
        result = await chain.ainvoke(
            {"question": question},
            config={"configurable": {"session_id": conversation_id}},
        )
        return result.content if hasattr(result, "content") else str(result)

    async def stream(self, conversation_id: str, question: str) -> AsyncIterator[str]:
        chain = get_chain()
        async for chunk in chain.astream(
            {"question": question},
            config={"configurable": {"session_id": conversation_id}},
        ):
            text = chunk.content if hasattr(chunk, "content") else str(chunk)
            if text:
                yield text

    def history(self, conversation_id: str) -> list[dict[str, str]]:
        return get_history_messages(conversation_id)

    def clear(self, conversation_id: str) -> None:
        reset_history(conversation_id)


chat_service = ChatService()
