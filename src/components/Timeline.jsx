import { useState, useEffect, useMemo, useRef } from 'react'
import NowMarker from './NowMarker'
import TimelineBlock from './TimelineBlock'

function placeNow(blocks, nowMs = Date.now()) {
  for (let i = 0; i < blocks.length; i++) {
    if (new Date(blocks[i].startISO).getTime() > nowMs) return i
  }
  return blocks.length
}

function nowTimeString() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function Timeline({ blocks, reflowing, onEditBlock, onToggleDone, onAddTask, onToggleTask, onDeleteTask }) {
  const [nowMs, setNowMs] = useState(Date.now())
  const nowRef = useRef(null)
  const scrolledRef = useRef(false)
  const prevReflowing = useRef(false)

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  // Bring the "now" marker into view once, after the first render with blocks.
  useEffect(() => {
    if (scrolledRef.current || blocks.length === 0) return
    if (nowRef.current) {
      nowRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
      scrolledRef.current = true
    }
  }, [blocks])

  // After voice reflow finishes, scroll the first changed block into view.
  useEffect(() => {
    if (prevReflowing.current && !reflowing) {
      const changed = blocks.find((b) => b.changed)
      if (changed) {
        const el = document.querySelector(`[data-block-id="${changed.id}"]`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
    prevReflowing.current = reflowing
  }, [reflowing, blocks])

  const nowIdx = useMemo(() => placeNow(blocks, nowMs), [blocks, nowMs])

  if (blocks.length === 0) {
    return (
      <div
        className="rounded-2xl px-6 py-12 text-center"
        style={{ border: '1.5px dashed rgba(16,185,129,0.35)', background: 'rgba(15,23,42,0.4)' }}
      >
        <p className="text-[15px] font-medium text-slate-200">No blocks yet</p>
        <p className="text-[13px] text-slate-400 mt-1">
          Add one with <span className="text-slate-200">+</span> or describe your day with voice.
        </p>
      </div>
    )
  }

  const items = []
  blocks.forEach((b, i) => {
    if (i === nowIdx) items.push({ kind: 'now', key: 'now' })
    items.push({ kind: 'block', key: b.id, block: b })
  })
  if (nowIdx >= blocks.length) items.push({ kind: 'now', key: 'now' })

  return (
    <div className={`flex flex-col gap-3 transition-opacity duration-300 ${reflowing ? 'opacity-60' : ''}`}>
      {items.map((it, i) => {
        if (it.kind === 'now') {
          return (
            <div key={it.key} ref={nowRef}>
              <NowMarker time={nowTimeString()} />
            </div>
          )
        }
        return (
          <div
            key={it.key}
            data-block-id={it.block.id}
            style={{ animation: 'lt-fade-in 400ms cubic-bezier(0.22,1,0.36,1) both', animationDelay: `${i * 30}ms` }}
          >
            <TimelineBlock
              block={it.block}
              onEdit={onEditBlock}
              onToggleDone={onToggleDone}
              onAddTask={onAddTask}
              onToggleTask={onToggleTask}
              onDeleteTask={onDeleteTask}
            />
          </div>
        )
      })}
    </div>
  )
}

export default Timeline
