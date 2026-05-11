from functools import lru_cache

from langchain_cohere import ChatCohere
from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import Runnable
from langchain_core.runnables.history import RunnableWithMessageHistory

from app.core.config import settings
from app.llm.prompts import INSURANCE_SYSTEM_PROMPT

_history_store: dict[str, BaseChatMessageHistory] = {}


def _get_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in _history_store:
        _history_store[session_id] = InMemoryChatMessageHistory()
    return _history_store[session_id]


def reset_history(session_id: str) -> None:
    _history_store.pop(session_id, None)


def get_history_messages(session_id: str) -> list[dict[str, str]]:
    history = _history_store.get(session_id)
    if history is None:
        return []
    return [
        {"role": "user" if m.type == "human" else "assistant", "content": m.content}
        for m in history.messages
    ]


@lru_cache(maxsize=1)
def _build_llm() -> ChatCohere:
    return ChatCohere(
        model=settings.COHERE_CHAT_MODEL,
        cohere_api_key=settings.COHERE_API_KEY,
        temperature=0.2,
        max_tokens=512,
        streaming=True,
    )


@lru_cache(maxsize=1)
def _build_chain() -> Runnable:
    llm = _build_llm()
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", INSURANCE_SYSTEM_PROMPT),
            MessagesPlaceholder("history"),
            ("human", "{question}"),
        ]
    )
    chain = prompt | llm
    return RunnableWithMessageHistory(
        chain,
        _get_history,
        input_messages_key="question",
        history_messages_key="history",
    )


def get_chain() -> Runnable:
    return _build_chain()
