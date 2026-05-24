# LiquidTime

An AI-driven personal scheduling PWA that eliminates the overhead of manually managing a highly variable daily routine. Built for B.Tech students and anyone with a dynamic schedule.

## What it does

You speak a natural language command into your phone or browser, and LiquidTime instantly reflows your schedule around it:

- **"My lab got pushed back an hour"** → The app shifts the lab 1h later and automatically moves gym/meal-prep blocks to fit
- **"Move my powerlifting to right now"** → Instantly reschedules the 90-min gym block to start immediately
- **"I need 30 min after my workout for meal prep"** → Adds a meal-prep block right after the gym and reshuffles the rest of the day

The app handles the complexity so you don't have to manually drag blocks around. Fixed anchors (classes, labs) stay put; floating blocks (gym, meals, study) reflow intelligently.

---

## How it works

### The voice-to-schedule pipeline

1. **You speak** → The browser's Web Speech API transcribes your words in real-time
2. **Backend receives transcript** → FastAPI endpoint gets your command + current schedule
3. **AI processes it** → NVIDIA NIM (Llama 3) with function calling parses your intent and outputs a complete mutated schedule
4. **Schedule reflows** → The frontend receives the new timeline and re-renders with animations showing what changed
5. **Saved locally** → Your new schedule is persisted in browser localStorage (zero server cost)

No database, no user accounts, no cloud save — everything lives on your device.

---

## Key features

### Smart scheduling rules

- **Fixed blocks** (e.g. lectures, labs) are immovable anchors. The AI respects them.
- **Floating blocks** (e.g. gym, meals, study) reflow around fixed anchors to fill gaps intelligently.
- **No overlaps** — the AI detects conflicts and pushes blocks forward automatically.
- **Preserved intent** — block durations never change unless you explicitly ask.

### Real-time metrics

The sidebar shows:
- **Productive hours** — how much class + work time you have today
- **Bulk window** — the training + eating window (gym start to next fixed block)
- **Buffer** — total free time between 7am–11pm

### Natural language understanding

The AI understands context like:
- Relative time: "move my 5 PM session to tomorrow morning"
- Duration inference: "add 30 min after the gym for meal prep"
- Relative anchors: "reschedule the gym to right before lunch"

### PWA — install like a native app

- Open in browser, tap "Install" → runs as a standalone app on your home screen
- Works offline for viewing; voice commands need internet for the AI
- Service worker caches fonts and UI, ensuring instant loads

---

## Usage walkthrough

### Starting a voice command

1. **Tap the mic button** (bottom center of the screen)
2. **Speak naturally** — try: "move my powerlifting to 11 AM" or "delay the lab by an hour and shift everything after it"
3. **Tap Commit · reflow** when done (or wait for auto-detection)
4. **Watch the timeline reflow** — the moved blocks glow cyan to highlight changes

### Reading the timeline

Each block shows:
- **Time + duration** (left column) — e.g. "9:00 AM" + "90 min"
- **Category icon** (colored circle) — book=class, dumbbell=gym, utensils=food, code=work
- **Title + location** — e.g. "College Lab · DSA · Computer Lab 3"
- **Type badge** — "fixed" (locked) or "floating" (can move)
- **Hint text** (on floating blocks) — e.g. "between 5 PM – 8 PM" or "moved up · lab pushed"

### Fallback: type commands (if no microphone)

If Web Speech API isn't available (e.g. Firefox on desktop), the voice modal shows a text area. Type your command and commit the same way.

---

## Architecture

### Frontend (Vite + React 19)

- **Single-page PWA** — runs entirely in the browser
- **Components** — Dashboard orchestrates the voice-to-reflow loop; Timeline/TimelineBlock render the schedule
- **Hooks** — `useSchedule` (localStorage), `useSpeechRecognition` (Web Speech API)
- **Persistence** — `localStorage` key `lt_schedule_v1` holds the full schedule state
- **Styling** — Tailwind v4 + custom keyframes for animations

### Backend (FastAPI)

- **Stateless** — all schedule state lives on the client
- **Single endpoint** — `POST /api/v1/schedule/voice-command`
- **AI integration** — NVIDIA NIM with function calling for JSON-structured output
- **No database** — no user accounts, no cloud save

### Data model

```js
Block {
  id: 'b1',
  type: 'fixed' | 'floating',
  title: 'Morning lecture · OS',
  start: '9:00 AM',           // display only
  end: '10:30 AM',            // display only
  startISO: '2026-05-20T09:00:00',   // for time math
  endISO: '2026-05-20T10:30:00',
  durationMin: 90,
  category: 'class' | 'gym' | 'food' | 'work',
  location?: 'Block C · Room 204',
  hint?: 'moved up · lab pushed',
  changed?: true,    // triggers glow animation
}
```

---

## Getting started

### Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.9+** (for backend)
- **NVIDIA NIM API key** — get free credits at [build.nvidia.com](https://build.nvidia.com)
- **Modern browser** — Chrome/Firefox/Safari with Web Speech API support (or fallback to text input)

### Setup

```bash
# Frontend
cd frontend
npm install
npm run dev          # http://localhost:5173

# Backend (in a separate terminal)
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1   # Windows
# or: source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
# Edit .env: paste your NVIDIA_API_KEY
uvicorn app.main:app --reload --port 8000
```

### Your first schedule change

1. Open http://localhost:5173
2. Tap the mic button
3. Say: **"move my powerlifting block to right now"**
4. Watch the timeline reflow — the gym block slides to 10:45 AM and everything after it shifts

---

## Design decisions

### Why localStorage instead of a database?

- **Zero server cost** — no database to maintain, no user accounts, no subscription
- **Privacy** — your schedule never leaves your device (except the transcript sent to NVIDIA for AI processing)
- **Offline-first** — you can view your schedule without internet
- **Single-user focus** — LiquidTime is a personal app, not a team scheduler

### Why NVIDIA NIM instead of OpenAI?

- **Free tier** — NIM offers free inference credits (unlike GPT-4 which costs per token)
- **Llama 3** — strong function-calling support, good enough for scheduling logic
- **Function calling enforces structure** — the AI outputs valid JSON matching the block schema, no post-processing needed

### Why Vite + React instead of Next.js?

- **PWA-first** — Vite integrates the service worker cleanly via `vite-plugin-pwa`
- **No SSR overhead** — the app runs entirely on the client; no server rendering needed
- **Fast iteration** — Vite's HMR is instant

---

## Limitations & roadmap

### Current limitations

- **Single-day only** — the app reschedules blocks within today; multi-day planning is not yet supported
- **No recurring events** — each day starts fresh with the demo schedule seed
- **No drag-to-reschedule UI** — the drag affordance is visual only; you must use voice commands
- **No history** — schedule changes are not versioned; each reflow overwrites the previous state
- **No multi-user** — each browser instance has its own schedule

### Potential improvements

- **Week view** — see all 7 days at once, drag blocks across days
- **Recurring blocks** — set up "gym is always 6am–7am on MWF"
- **Undo/redo** — roll back recent reflows
- **Shared calendars** — sync with Google Calendar, Outlook, iCal
- **Team scheduling** — coordinate schedules with classmates or project mates
- **Mobile-native apps** — React Native builds for iOS/Android

---

## Commands & dev info

See [CLAUDE.md](./CLAUDE.md) for:
- Frontend / backend startup commands
- Repository structure
- Key architectural decisions
- Environment variable setup

---

## Authors

Built by Shivam Thapliyal. Design and architecture guided by Claude.

---

## License

MIT (or specify your choice)
