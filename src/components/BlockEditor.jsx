import { useState, useEffect } from 'react'
import { X, Trash2 } from 'lucide-react'
import { composeISO, durationBetween, fmtDisplay, nextBlockId } from '../utils/resolveConflicts'
import { GRAD, SHADOW, BORDER, BLUR, CLR } from '../styles/tokens'

const CATEGORIES = ['class', 'gym', 'food', 'work']

function todayStr() {
  const t = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`
}

function hhmm(iso) {
  return (iso?.split('T')[1] ?? '00:00:00').slice(0, 5)
}

const INPUT_STYLE = { background: CLR.bgPanelSm, border: BORDER.emerald25 }

function BlockEditor({ open, mode, block, blocks, onClose, onSave, onDelete }) {
  const [title, setTitle]       = useState('')
  const [category, setCategory] = useState('work')
  const [start, setStart]       = useState('09:00')
  const [end, setEnd]           = useState('10:00')
  const [note, setNote]         = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!open) return
    setConfirmDelete(false)
    if (mode === 'edit' && block) {
      setTitle(block.title ?? '')
      setCategory(block.category ?? 'work')
      setStart(hhmm(block.startISO))
      setEnd(hhmm(block.endISO))
      setNote(block.hint ?? block.location ?? '')
    } else {
      setTitle(''); setCategory('work')
      setStart('09:00'); setEnd('10:00'); setNote('')
    }
  }, [open, mode, block])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const date = todayStr()
  const startISO = composeISO(date, start)
  const endISO   = composeISO(date, end)
  const durationMin = durationBetween(startISO, endISO)
  const timeError = durationMin <= 0
  const canSave = title.trim() && !timeError

  const handleSave = () => {
    if (!canSave) return
    onSave({
      id: mode === 'edit' && block ? block.id : nextBlockId(blocks),
      title: title.trim(), category,
      startISO, endISO,
      start: fmtDisplay(startISO), end: fmtDisplay(endISO),
      durationMin,
      hint: note.trim() || undefined,
      changed: false,
      done: mode === 'edit' && block ? !!block.done : false,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-6"
      style={{ background: CLR.bgOverlay78, ...BLUR.md, animation: 'lt-fade-in 200ms ease-out both' }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-[460px] rounded-t-[28px] sm:rounded-[28px] p-6 sm:p-8 overflow-y-auto scroll-momentum"
        style={{
          background: GRAD.modalLight,
          border: BORDER.emerald30,
          borderBottom: 'none',
          boxShadow: SHADOW.editor,
          maxHeight: '92dvh',
          paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
          animation: 'lt-slide-up 300ms cubic-bezier(0.22,1,0.36,1) both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* drag handle — mobile only */}
        <div className="sm:hidden flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full" style={{ background: CLR.handle }} />
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-xl grid place-items-center text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="text-[18px] font-medium text-slate-50 mb-5">
          {mode === 'edit' ? 'Edit block' : 'Add block'}
        </h3>

        <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Title</label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Morning lecture · OS"
          className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-slate-100 placeholder-slate-500 outline-none mb-4"
          style={INPUT_STYLE}
        />

        <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Category</label>
        <div className="flex gap-2 mb-4">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="flex-1 py-1.5 rounded-lg text-[12px] font-medium capitalize transition-all"
              style={category === c
                ? { background: CLR.emeraldFill18, color: CLR.emeraldLight, border: BORDER.emerald45 }
                : { background: CLR.bgPanelSm, color: '#94a3b8', border: BORDER.slateDark }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mb-1">
          {[['Start', start, setStart], ['End', end, setEnd]].map(([label, val, setter]) => (
            <div key={label} className="flex-1">
              <label className="block text-[12px] font-medium text-slate-400 mb-1.5">{label}</label>
              <input
                type="time"
                value={val}
                onChange={(e) => setter(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-[14px] text-slate-100 outline-none"
                style={INPUT_STYLE}
              />
            </div>
          ))}
        </div>
        <div className="text-[12px] mb-4 h-4">
          {timeError
            ? <span className="text-red-400">End must be after start.</span>
            : <span className="text-slate-500 font-mono">{durationMin} min</span>}
        </div>

        <label className="block text-[12px] font-medium text-slate-400 mb-1.5">
          Note <span className="text-slate-600">optional</span>
        </label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Block C · Room 204 or between 10 AM – 1 PM"
          className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-slate-100 placeholder-slate-500 outline-none mb-5"
          style={INPUT_STYLE}
        />

        <div className="flex items-center gap-3">
          {mode === 'edit' && (
            confirmDelete ? (
              <button
                onClick={() => onDelete(block.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-red-200 bg-red-900/50 border border-red-800/70 transition-colors"
              >
                <Trash2 size={14} /> Confirm
              </button>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:text-red-300 border border-slate-800/70 transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            )
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[14px] font-medium text-slate-300 hover:text-slate-50 hover:bg-slate-800/60 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: GRAD.primary, boxShadow: SHADOW.btnPrimary }}
          >
            {mode === 'edit' ? 'Save' : 'Add block'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlockEditor
