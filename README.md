# Insurance Chatbot — POC

AI-powered insurance customer-service chatbot. **Angular 20 + NgRx** frontend, **FastAPI + LangChain** backend, **Cohere** LLM (trial key for POC).

> Looking for the end-user guide? See [USER_MANUAL.md](USER_MANUAL.md).

```
insurance-chatbot-app/
├── backend/      FastAPI + LangChain + Cohere (server-side, holds API key)
├── frontend/     Angular 20 + NgRx (browser, NEVER holds secrets)
├── README.md     this file (developer guide)
└── USER_MANUAL.md  end-user guide
```

---

## 🔐 Security: Where the Cohere Key Lives

**Backend `.env` only.** Never in Angular environment files.

| File | Holds secrets? | Why |
|------|----------------|-----|
| `backend/.env` | ✅ Yes (Cohere key) | Read by FastAPI server-side. Gitignored. |
| `backend/.env.example` | ❌ Placeholder only | Committed template. Public. |
| `frontend/src/environments/environment*.ts` | ❌ Never | Bundled into browser JS. Public to every visitor. |

If a secret ends up in chat, IDE share session, or a git commit — **revoke it immediately** at https://dashboard.cohere.com and generate a new one.

---

## Prerequisites

| Tool | Required version | This project tested on |
|------|------------------|------------------------|
| Python | 3.11+ | **3.12.0** |
| Node.js | 20.19+ or 22.12+ | **24.15.0 LTS** |
| OS | — | Windows 11 (PowerShell) |
| Cohere account | Free trial | https://dashboard.cohere.com |

### Installing Python on Windows
The `python` command on a clean Windows install often points to a Microsoft Store stub. Either:
- Install real Python from https://www.python.org/downloads/ with **"Add Python to PATH"** ticked, **or**
- Use the **`py`** launcher (already used by [backend/run.ps1](backend/run.ps1) to avoid the Store stub).

### Installing Node on Windows
```powershell
winget install OpenJS.NodeJS.LTS
```
Then open a **fresh** PowerShell so PATH refreshes.

---

## Setup

### 1. Backend

```powershell
cd backend
copy .env.example .env
# Open .env and paste your Cohere trial key into COHERE_API_KEY
.\run.ps1
```

`run.ps1` does everything: creates the venv via `py`, installs dependencies, validates `.env`, starts uvicorn.

Verify:
```
GET http://localhost:8000/api/health
→ {"status":"ok","model":"command-r-plus-08-2024"}
```

### 2. Frontend

```powershell
cd frontend
npm install
npm start
```

Open http://localhost:4200.

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

## Project Structure

```
backend/
├── app/
│   ├── main.py                FastAPI app, CORS, health
│   ├── api/
│   │   ├── routes_chat.py     /api/chat + /api/chat/stream
│   │   └── routes_history.py  /api/history
│   ├── core/config.py         pydantic-settings, loads .env
│   ├── llm/
│   │   ├── chain_factory.py   ChatCohere + RunnableWithMessageHistory
│   │   └── prompts.py         INSURANCE_SYSTEM_PROMPT
│   ├── services/chat_service.py
│   └── domain/schemas.py      Pydantic DTOs
├── requirements.txt
├── run.ps1                    Windows runner (uses py launcher)
├── .env                       SECRET — gitignored
└── .env.example               public template

frontend/
├── src/
│   ├── app/
│   │   ├── app.config.ts      provideStore, provideEffects, provideHttpClient
│   │   ├── core/
│   │   │   ├── models/message.model.ts
│   │   │   └── services/chat-api.service.ts
│   │   └── features/chat/
│   │       ├── chat-page.component.ts
│   │       ├── components/    message-list, message-bubble, input-box
│   │       └── store/         actions, reducer, effects, selectors, state
│   └── environments/          NO SECRETS — apiBaseUrl only
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Troubleshooting

### "Python was not found" / Store stub intercepts `python`
Use the `py` launcher (already used by `run.ps1`), or disable App Execution Aliases in **Settings → Apps → Advanced app settings → App execution aliases**.

### `ERESOLVE` peer dep conflict on `npm install`
Angular 20 needs TypeScript ≥5.8. The `package.json` already pins `~5.8.0`. If you customised it, ensure TS is ≥5.8 <6.0.

### `Node.js version vXX detected. The Angular CLI requires a minimum Node.js version of v20.19 or v22.12.`
Upgrade Node (see Prerequisites). After install, **open a fresh PowerShell** for PATH to refresh.

### `WinError 32 — file in use` during `pip install`
Windows Defender real-time scanning is locking pandas test files. Either retry, or add the project to exclusions:
```powershell
Add-MpPreference -ExclusionPath "c:\AI\Insurance ChatBot\insurance-chatbot-app"
```
(needs admin PowerShell)

### Backend starts but `/api/chat` returns 502
Check `.env` — `COHERE_API_KEY` must be set and valid. The trial key has rate limits (~20 calls/min); if exceeded, you'll see 429s from Cohere bubbled up as 502.

---

## What's Intentionally Not in the POC (Future Work)

- Auth (JWT) — currently unauthenticated; fine for localhost POC
- Persistent storage (Postgres / Redis) — in-memory only; conversations lost on restart
- Vector DB + RAG over policy documents — design ready in [architecture plan](#architecture), not wired up
- PII redaction / prompt-injection guard
- Production observability (OpenTelemetry, LangSmith)
- Docker + CI/CD
- Multi-tenant isolation

---

## Switching to Production-Grade

1. **Cohere:** generate a *production* key in the dashboard → update `backend/.env`. Trial keys explicitly forbid production use under Cohere ToS.
2. **History:** swap `InMemoryChatMessageHistory` in [chain_factory.py](backend/app/llm/chain_factory.py) for Redis (`RedisChatMessageHistory`) or Postgres.
3. **Secrets:** move `.env` contents into Azure Key Vault / AWS Secrets Manager; mount as env vars at container startup.
4. **CORS:** restrict `CORS_ORIGINS` to your real frontend domain.
5. **Frontend:** update [environment.production.ts](frontend/src/environments/environment.production.ts) `apiBaseUrl` to your backend's public URL.

The frontend needs no key-handling changes — the Cohere key never crosses the network boundary into the browser. That's the entire point of this architecture split.
