# Insurance Chatbot — POC

AI insurance chatbot. **Angular 20 + NgRx** frontend, **FastAPI + LangChain** backend, **Cohere** LLM (trial key for POC).

```
insurance-chatbot-app/
├── backend/    FastAPI + LangChain + Cohere (server-side, holds API key)
└── frontend/   Angular 20 + NgRx (browser, NEVER holds secrets)
```

---

## 🔐 Security: Where the Cohere Key Lives

**Backend `.env` only.** Never in Angular environment files.

| File | Holds secrets? | Why |
|------|----------------|-----|
| `backend/.env` | ✅ Yes (Cohere key) | Read by FastAPI server-side. Gitignored. |
| `frontend/src/environments/environment.ts` | ❌ NO | Bundled into browser JS. Public to every visitor. |

If you ever paste a secret into a public chat, IDE share session, or git commit — **rotate it immediately** at https://dashboard.cohere.com.

---

## Prerequisites

- Python 3.11+
- Node.js 20.19+ or 22.12+ (Angular 20 requirement)
- Cohere trial API key from https://dashboard.cohere.com

---

## Setup

### 1. Backend

```powershell
cd backend
copy .env.example .env
# Open .env and paste your rotated Cohere trial key into COHERE_API_KEY
.\run.ps1
```

Backend starts at `http://localhost:8000`. Verify with:

```
GET http://localhost:8000/api/health
```

### 2. Frontend

```powershell
cd frontend
npm install
npm start
```

Frontend starts at `http://localhost:4200`.

---

## API Surface

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET    | `/api/health` | Health + active model |
| POST   | `/api/chat` | Non-streaming reply |
| GET    | `/api/chat/stream?conversation_id=&message=` | SSE token stream |
| GET    | `/api/history/{conversation_id}` | Full message history |
| DELETE | `/api/history/{conversation_id}` | Clear conversation |

---

## Architecture

```
Angular 20 SPA            FastAPI Backend           Cohere
─────────────             ──────────────            ─────────
 NgRx Store                LangChain chain
   chat.state              ChatCohere
   chat.actions            RunnableWithMessageHistory
   chat.reducer
   chat.selectors        ──────HTTP/SSE────▶  REST
   chat.effects ─SSE────▶   /api/chat/stream
                            /api/chat
                            /api/history
 chat-page.component        chat_service.py
   message-list             chain_factory.py (Cohere)
   message-bubble           prompts.py (insurance persona)
   input-box                routes_chat.py / routes_history.py
```

**State management (NgRx):** Single `chat` feature slice holds `messages[]`, current `streamingText` (token buffer), `status`, and `conversationId`. Effects open an `EventSource` to `/api/chat/stream`, dispatch `streamChunkReceived` per token, then `streamCompleted` with the finalized assistant message.

**Conversation memory:** LangChain's `RunnableWithMessageHistory` keeps an in-memory `ChatMessageHistory` per `conversation_id` server-side. POC-grade — swap to Redis/Postgres for production.

---

## What's Intentionally Not in the POC (Future Work)

- Auth (JWT) — currently unauthenticated, fine for localhost POC
- Persistent storage (Postgres) — in-memory only
- Vector DB + RAG over policy documents — design ready in plan, not wired up
- PII redaction / prompt-injection guard
- Production-grade observability (OpenTelemetry, LangSmith)
- Docker + CI/CD

---

## Switching Cohere Key Tier

When you graduate from POC:

1. Generate a **production** key at the Cohere dashboard
2. Update `backend/.env` `COHERE_API_KEY`
3. Restart backend — no frontend changes needed (the frontend never sees the key)

This is exactly why we keep the key server-side: rotation is a one-file change.
