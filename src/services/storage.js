const STORAGE_KEY = 'lt_schedule_v1'
const PROFILE_KEY = 'lt_profile_v1'
const CURRENT_VERSION = 1

function pad(n) { return String(n).padStart(2, '0') }

function todayStr() {
  const t = new Date()
  return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`
}

function fmtDisplay(h, m) {
  const period = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 || 12
  return `${h12}:${pad(m)} ${period}`
}

function displayFromISO(iso) {
  const t = iso.split('T')[1] ?? '00:00:00'
  const [h, m] = t.split(':').map(Number)
  return fmtDisplay(h, m)
}

/** Dev-only seed schedule. Not used on the normal user path. */
export function generateDefaultBlocks() {
  const dateStr = todayStr()
  function iso(h, m) { return `${dateStr}T${pad(h)}:${pad(m)}:00` }
  return [
    { id: 'b1', title: 'Morning lecture · OS',
      start: fmtDisplay(9, 0), end: fmtDisplay(10, 30),
      startISO: iso(9, 0), endISO: iso(10, 30),
      durationMin: 90, hint: 'Block C · Room 204', category: 'class' },
    { id: 'b2', title: 'Powerlifting block',
      start: fmtDisplay(10, 45), end: fmtDisplay(12, 15),
      startISO: iso(10, 45), endISO: iso(12, 15),
      durationMin: 90, hint: 'between 10 AM – 1 PM', category: 'gym' },
    { id: 'b3', title: 'College Lab · DSA',
      start: fmtDisplay(14, 0), end: fmtDisplay(16, 30),
      startISO: iso(14, 0), endISO: iso(16, 30),
      durationMin: 150, hint: 'Computer Lab 3', category: 'class' },
  ]
}

/** Carry a schedule forward to today: rewrite ISO dates, refresh display strings,
 *  clear changed flags and reschedule-pass hint noise. */
function rollScheduleForward(blocks, today) {
  return blocks.map((b) => {
    const startISO = b.startISO?.replace(/^\d{4}-\d{2}-\d{2}/, today) ?? b.startISO
    const endISO   = b.endISO?.replace(/^\d{4}-\d{2}-\d{2}/, today) ?? b.endISO
    let hint = b.hint
    if (hint) {
      hint = hint
        .replace(/\s*·?\s*auto-resolved overlap/gi, '')
        .replace(/\s*·?\s*moved [^·]*/gi, '')
        .trim()
      if (!hint) hint = undefined
    }
    return { ...b, startISO, endISO,
      start: displayFromISO(startISO), end: displayFromISO(endISO),
      changed: false, hint }
  })
}

export function getSchedule() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (parsed.version !== CURRENT_VERSION || !Array.isArray(parsed.blocks)) {
      return []
    }
    if (parsed.blocks.length === 0) return []

    const today = todayStr()
    const storedDate = parsed.blocks[0]?.startISO?.split('T')[0]
    if (storedDate && storedDate !== today) {
      const rolled = rollScheduleForward(parsed.blocks, today)
      saveSchedule(rolled)
      return rolled
    }
    return parsed.blocks
  } catch {
    return []
  }
}

export function saveSchedule(blocks) {
  const payload = {
    version: CURRENT_VERSION,
    updatedAt: new Date().toISOString(),
    blocks,
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (e) {
    console.warn('localStorage write failed:', e)
  }
}

export function resetSchedule() {
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  return []
}

// ── User profile ──────────────────────────────────────────────────────────

export function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.version !== CURRENT_VERSION || typeof parsed.name !== 'string') {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function saveProfile({ name, onboarded }) {
  const existing = getProfile()
  const payload = {
    version: CURRENT_VERSION,
    name,
    onboarded: !!onboarded,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  }
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(payload))
  } catch (e) {
    console.warn('localStorage write failed:', e)
  }
  return payload
}

export function clearProfile() {
  try { localStorage.removeItem(PROFILE_KEY) } catch { /* ignore */ }
}
