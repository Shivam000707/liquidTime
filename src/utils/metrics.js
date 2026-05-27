function fmtDuration(totalMinutes) {
  if (totalMinutes <= 0) return '0 min'
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function fmtDisplayTime(isoStr) {
  const d = new Date(isoStr)
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function computeMetrics(blocks) {
  if (!blocks || blocks.length === 0) {
    return {
      productive: { value: '0 min', sub: 'planned today', delta: '' },
      bulkWindow: { value: '0 min', sub: '' },
      buffer:     { value: '0 min', sub: 'free across day' },
    }
  }

  const sorted = [...blocks].sort((a, b) => (a.startISO ?? '').localeCompare(b.startISO ?? ''))

  // Productive hours: class + work category blocks
  const productiveMin = sorted
    .filter((b) => b.category === 'class' || b.category === 'work')
    .reduce((sum, b) => sum + b.durationMin, 0)

  // Buffer: free minutes in waking hours (7am–11pm) between blocks
  const dateStr = sorted[0]?.startISO?.split('T')[0] ?? new Date().toISOString().split('T')[0]
  const wakeMs  = new Date(`${dateStr}T07:00:00`).getTime()
  const sleepMs = new Date(`${dateStr}T23:00:00`).getTime()

  let freeMs = 0
  let cursor = wakeMs
  for (const b of sorted) {
    if (!b.startISO || !b.endISO) continue
    const bStart = new Date(b.startISO).getTime()
    const bEnd   = new Date(b.endISO).getTime()
    if (bStart > cursor && bStart <= sleepMs) {
      freeMs += Math.min(bStart, sleepMs) - cursor
    }
    cursor = Math.max(cursor, bEnd)
  }
  if (cursor < sleepMs) freeMs += sleepMs - cursor
  const bufferMin = Math.max(0, Math.round(freeMs / 60000))

  // Bulk window: from gym block start to next block start
  const gymBlock = sorted.find((b) => b.category === 'gym')
  let bulkMin
  let bulkClosesAt

  if (gymBlock && gymBlock.startISO) {
    const gymStartMs = new Date(gymBlock.startISO).getTime()
    const nextBlock = sorted.find(
      (b) => b.startISO && new Date(b.startISO).getTime() > gymStartMs && b.id !== gymBlock.id
    )
    const windowEndMs = nextBlock
      ? new Date(nextBlock.startISO).getTime()
      : new Date(gymBlock.endISO).getTime() + 2 * 60 * 60000
    bulkMin = Math.max(0, Math.round((windowEndMs - gymStartMs) / 60000))
    bulkClosesAt = nextBlock ? `closes ${fmtDisplayTime(nextBlock.startISO)}` : 'no hard close'
  } else {
    // Fallback: largest gap between adjacent blocks
    let maxGap = 0
    let maxGapEnd = ''
    for (let i = 0; i < sorted.length - 1; i++) {
      if (!sorted[i].endISO || !sorted[i + 1].startISO) continue
      const gap = new Date(sorted[i + 1].startISO).getTime() - new Date(sorted[i].endISO).getTime()
      if (gap > maxGap) { maxGap = gap; maxGapEnd = sorted[i + 1].startISO }
    }
    bulkMin = Math.max(0, Math.round(maxGap / 60000))
    bulkClosesAt = maxGapEnd ? `closes ${fmtDisplayTime(maxGapEnd)}` : ''
  }

  return {
    productive: {
      value: fmtDuration(productiveMin),
      sub:   'planned today',
      delta: '',
    },
    bulkWindow: {
      value: fmtDuration(bulkMin),
      sub:   bulkClosesAt,
    },
    buffer: {
      value: fmtDuration(bufferMin),
      sub:   'free across day',
    },
  }
}
