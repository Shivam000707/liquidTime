function pad(n) { return String(n).padStart(2, '0') }

/** '2026-05-20T09:00:00' → '9:00 AM' */
export function fmtDisplay(iso) {
  const t = iso.split('T')[1] ?? '00:00:00'
  const [h, m] = t.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 || 12
  return `${h12}:${pad(m)} ${period}`
}

/** Build an ISO local datetime for a given date + 'HH:MM'. */
export function composeISO(dateStr, hhmm) {
  return `${dateStr}T${hhmm}:00`
}

/** Minutes between two ISO datetimes. */
export function durationBetween(startISO, endISO) {
  return Math.round((new Date(endISO) - new Date(startISO)) / 60000)
}

/** Next free block id like 'b4', given the current blocks. */
export function nextBlockId(blocks) {
  let n = 1
  const used = new Set(blocks.map((b) => b.id))
  while (used.has(`b${n}`)) n += 1
  return `b${n}`
}

/**
 * Walk blocks sorted by startISO; push any block that overlaps the previous
 * block's end forward by its durationMin. Mirrors the backend resolve_conflicts pass.
 */
export function resolveConflicts(blocks) {
  const sorted = [...blocks].sort((a, b) => a.startISO.localeCompare(b.startISO))
  const result = []

  for (const block of sorted) {
    if (result.length === 0) { result.push(block); continue }

    const prev = result[result.length - 1]
    const prevEnd = new Date(prev.endISO)
    const currStart = new Date(block.startISO)

    if (currStart >= prevEnd) {
      result.push(block)
    } else {
      const newStart = prevEnd
      const newEnd = new Date(newStart.getTime() + block.durationMin * 60000)
      const startISO = toLocalISO(newStart)
      const endISO = toLocalISO(newEnd)
      result.push({
        ...block,
        startISO, endISO,
        start: fmtDisplay(startISO), end: fmtDisplay(endISO),
        changed: true,
      })
    }
  }
  return result
}

function toLocalISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
         `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
