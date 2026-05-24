const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'

/**
 * Turn a raw error (network failure, HTTP status, backend detail) into a
 * short, plain-language message safe to show the user.
 */
export function friendlyError(err) {
  const msg = err?.message ?? ''
  if (err instanceof TypeError || /failed to fetch|networkerror|load failed/i.test(msg)) {
    return "Couldn't reach the scheduler. Check your connection and try again."
  }
  if (/\b5\d\d\b/.test(msg)) {
    return 'The scheduler ran into a problem. Give it another try in a moment.'
  }
  if (/\b4\d\d\b/.test(msg)) {
    return "That command couldn't be processed. Try rephrasing it."
  }
  return msg || 'Something went wrong. Try rephrasing your command.'
}

/**
 * Send a voice command transcript + current blocks to the backend.
 * Returns { schedule, message } on success.
 * Throws on HTTP error or network failure.
 */
export async function sendVoiceCommand(transcript, currentBlocks) {
  const currentTimeContext = new Date().toISOString().slice(0, 19)

  const res = await fetch(`${API_BASE}/schedule/voice-command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      transcript,
      current_schedule: currentBlocks,
      current_time_context: currentTimeContext,
    }),
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(errBody.detail ?? `API error ${res.status}`)
  }

  const data = await res.json()
  if (data.status === 'error') throw new Error(data.message)
  return { schedule: data.new_schedule, message: data.message }
}

/**
 * Generate a fresh schedule from a natural-language description.
 * Returns { schedule, message }. Throws on HTTP error or network failure.
 */
export async function generateSchedule(description, userName, targetDate) {
  const res = await fetch(`${API_BASE}/schedule/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description,
      user_name: userName || null,
      target_date: targetDate,
    }),
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(errBody.detail ?? `API error ${res.status}`)
  }

  const data = await res.json()
  return { schedule: data.schedule, message: data.message }
}
