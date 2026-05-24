# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

LiquidTime is an AI-driven personal scheduling PWA. Any visitor can onboard by describing their day in natural language; the AI generates a full schedule which they can then manage via voice commands or a manual block editor. All schedule state lives in `localStorage` — the backend is stateless.

---

## Repository layout

```
liquidTime/
├── frontend/          ← Vite + React 19 PWA (the real app)
├── backend/           ← FastAPI + NVIDIA NIM (stateless AI processor)
├── *.jsx / index.html ← CDN-based design prototype (reference only, do not modify)
└── mobile/            ← Mobile screen designs (reference only, do not modify)
```

The root-level `.jsx` files and `mobile/` are the original design prototype. All active development happens in `frontend/` and `backend/`.

---

## Frontend (`frontend/`)

### Dev commands
```powershell
cd frontend
npm run dev       # starts Vite on http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run lint      # ESLint
```

### View routing

`App.jsx` owns `view` state (`'landing' | 'onboarding' | 'dashboard'`) and `profile`. No react-router — three views, state machine.

- On mount: `getProfile()` — if `profile.onboarded` → `dashboard`; else → `landing`.
- Landing CTA → `onboarding`. Onboarding confirm → persist profile + schedule → `dashboard`.
- `Dashboard` is mounted only after onboarding persists, so `useSchedule`'s eager localStorage read picks up the generated schedule.

### Key architecture decisions

**No build-time config for Tailwind.** Tailwind v4 is loaded via the `@tailwindcss/vite` Vite plugin — there is no `postcss.config.js`. The single CSS entry is `src/styles/globals.css`, which also defines the three animation keyframes used across components (`lt-pulse`, `lt-wave`, `lt-fade-in`).

**Vite proxy.** In dev, all `/api/*` requests are proxied to `http://localhost:8000`. CORS is not an issue in dev — `fetch('/api/v1/...')` just works. The env var `VITE_API_BASE` (set in `.env.local`) controls the prefix; it defaults to `/api/v1`.

**localStorage is the database.** Two keys:
- `lt_schedule_v1` — `{ version, updatedAt, blocks[] }` — the schedule.
- `lt_profile_v1` — `{ version, name, onboarded, createdAt }` — the user profile.

Day rollover: when the stored date ≠ today, `getSchedule()` **rolls the schedule forward** (rewrites ISO dates via string replace, recomputes display strings, clears `changed` flags and stripped hint noise) and saves. It does NOT wipe to a demo. Empty/new/corrupt storage returns `[]`.

**Block schema.** Every block carries both display strings (`start: '9:00 AM'`) and ISO timestamps (`startISO: '2026-05-20T09:00:00'`). Display strings are for rendering; ISO strings are for time math and what gets sent to the backend. Never create a block with only one of the two.

**Speech recognition.** `useSpeechRecognition` wraps `window.SpeechRecognition` / `window.webkitSpeechRecognition`. Sets `continuous: false` on Safari. When `isSupported` is `false`, `VoiceModal` renders a textarea fallback.

**Component structure.** 12 components total. All are pure presentational except `Dashboard.jsx`, which owns all state and orchestrates voice → API → reflow, and manual add/edit/delete via `BlockEditor`. Components receive data via props; they do not call the API or touch localStorage directly.

Components: `App`, `Landing`, `Onboarding`, `Dashboard`, `Timeline`, `TimelineBlock`, `NowMarker`, `TopBar`, `MetricsSidebar`, `MicButton`, `VoiceModal`, `BlockEditor`.

**`useSchedule` hook** (`src/hooks/useSchedule.js`). Exposes: `blocks`, `updateBlocks` (used by voice reflow), `addBlock`, `editBlock(id, patch)`, `deleteBlock(id)`, `resetBlocks`, `reload`, `commit`. Every mutation runs through `resolveConflicts()` before saving.

**`resolveConflicts`** (`src/utils/resolveConflicts.js`). Client-side mirror of the backend conflict pass. Also exports: `fmtDisplay(iso)`, `composeISO(dateStr, hhmm)`, `durationBetween(startISO, endISO)`, `nextBlockId(blocks)`. Used by `useSchedule` and `BlockEditor`.

### Block schema reference
```js
{
  id: string,            // 'b1' – backend assigns; 'NEW' sentinel used by AI for new blocks
  type: 'fixed' | 'floating',
  title: string,
  start: string,         // '9:00 AM' display only
  end: string,           // '10:30 AM' display only
  startISO: string,      // '2026-05-20T09:00:00' local, no Z
  endISO: string,
  durationMin: number,
  category: 'class' | 'gym' | 'food' | 'work',
  location?: string,     // shown on fixed blocks
  hint?: string,         // shown on floating blocks; explains moves
  changed?: boolean,     // true → cyan glow animation on the block
  done?: boolean,        // true → block marked complete (struck through, dimmed)
}
```

---

## Backend (`backend/`)

### Dev commands
```powershell
cd backend

# First time setup
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env   # then add your NVIDIA_API_KEY

# Run
uvicorn app.main:app --reload --port 8000

# Verify imports (quick sanity check)
python -c "from app.main import app; print('OK')"
```

### CRITICAL: `load_dotenv()` must be first in `main.py`

`nim.py` reads `NVIDIA_API_KEY` and `NIM_MODEL` at **module import time**. If `load_dotenv()` runs after the router imports, the env vars are empty and every NIM call will fail with `"Illegal header value b'Bearer '"`. The top of `main.py` must be:

```python
from dotenv import load_dotenv
load_dotenv()  # ← must come before any app imports

from fastapi import FastAPI
from app.routers import schedule
# etc.
```

### Required env vars (`backend/.env`)
| Variable | Description |
|---|---|
| `NVIDIA_API_KEY` | nvapi-... key from build.nvidia.com |
| `NIM_MODEL` | Default: `openai/gpt-oss-120b` |
| `NIM_BASE_URL` | Default: `https://integrate.api.nvidia.com/v1` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins, e.g. `http://localhost:5173` |

### Endpoints

**`POST /api/v1/schedule/voice-command`** — Reflow/edit existing schedule via natural language.
- Accepts `{transcript, current_schedule, current_schedule, current_time_context}`.
- Returns `{status, new_schedule, message}`.
- Supports full CRUD: add (AI emits `id: "NEW"`), delete (omit block), rename, move.
- `current_schedule` may be empty — empty list is valid.
- `input_date` is read from `current_time_context[:10]` (not from schedule, which may be empty).

**`POST /api/v1/schedule/generate`** — Generate an initial schedule from a natural language description (used during onboarding).
- Accepts `{description, user_name?, target_date}`.
- Returns `{status, schedule, message}`.
- Uses a separate system prompt tuned for schedule creation from scratch.

### NIM client (`app/services/nim.py`)

- Model: `openai/gpt-oss-120b` (OpenAI-compatible NVIDIA NIM API).
- Function calling with `tool_choice` forced to the relevant function name.
- Two response paths: (1) `message.tool_calls[0].function.arguments` — normal; (2) JSON extraction from message content — fallback.
- Shared helpers: `_post_nim(payload)`, `_extract_call(data, fn_name)`.
- `call_nim()` — voice reflow; uses `SYSTEM_PROMPT` + `SCHEDULE_TOOL`.
- `generate_schedule()` — onboarding generation; uses `GENERATE_SYSTEM_PROMPT` + `GENERATE_TOOL`.
- AI always emits `id: "NEW"` for new blocks. Backend resolves these via `assign_block_ids()`.

**Voice CRUD rules in `SYSTEM_PROMPT`:** fixed blocks are anchors, floating blocks reflow, no overlaps, `durationMin` never changes, all blocks always returned, `changed: true` only on time-mutated blocks, display times must match ISO times.

### `routers/schedule.py` helpers

**`assign_block_ids(raw_blocks, existing_ids)`** — replaces `"NEW"`, missing, or duplicate `id` fields with fresh sequential `b{N}`. Called after every NIM response.

**`normalize_block(b, target_date)`** — forces the block's ISO date to `target_date` (string replace) and recomputes `start`/`end` display strings. Makes model sloppiness on dates/display harmless.

**`resolve_conflicts(blocks)`** — walks blocks sorted by `startISO`, pushes overlapping floating blocks forward by their `durationMin`. Safety net after NIM responses and after normalization.

**`fmt_display_time(dt)`** — formats a datetime to `'9:00 AM'` (no leading zero). Use this everywhere on the backend — `strftime("%-I")` does not work on Windows.

---

## Running the full stack

```powershell
# Terminal 1
cd backend && .venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000

# Terminal 2
cd frontend && npm run dev
# → http://localhost:5173
```

Test the backend independently:
```powershell
Invoke-RestMethod http://localhost:8000/health
```

---

## PWA notes

- Icons live in `frontend/public/icons/` (192 and 512 PNG). Regenerate them with the PIL script used during initial setup if the design changes.
- `/api/*` routes are configured as `NetworkOnly` in the service worker — voice command responses are never cached.
- `npm run build && npm run preview` serves the PWA with the service worker active for install testing.
