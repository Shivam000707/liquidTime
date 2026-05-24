import { useEffect } from 'react'
import { Sparkles, Undo2, X } from 'lucide-react'

/**
 * Transient bottom-center notice. `toast` is either null or
 * { message, actionLabel?, onAction? }. Auto-dismisses after a delay —
 * longer when an action (e.g. Undo) is offered.
 */
function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(onDismiss, toast.actionLabel ? 10000 : 6000)
    return () => clearTimeout(id)
  }, [toast, onDismiss])

  if (!toast) return null

  return (
    <div
      className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-[420px]"
      style={{ animation: 'lt-fade-in 240ms ease-out both' }}
    >
      <div
        className="flex items-start gap-3 rounded-2xl px-4 py-3"
        style={{
          background: 'linear-gradient(180deg, rgba(15,23,42,0.97), rgba(2,6,23,0.97))',
          border: '1px solid rgba(6,182,212,0.32)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(6,182,212,0.14)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <span
          className="inline-flex w-6 h-6 rounded-lg items-center justify-center shrink-0 mt-0.5"
          style={{ background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)' }}
        >
          <Sparkles size={12} strokeWidth={2} style={{ color: '#fff' }} />
        </span>

        <p className="flex-1 min-w-0 text-[13px] leading-relaxed text-slate-200">
          {toast.message}
        </p>

        {toast.actionLabel && (
          <button
            onClick={() => { toast.onAction?.(); onDismiss() }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-cyan-200 transition-colors hover:brightness-125"
            style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.35)' }}
          >
            <Undo2 size={13} strokeWidth={2} />
            {toast.actionLabel}
          </button>
        )}

        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 w-6 h-6 rounded-lg grid place-items-center text-slate-500 hover:text-slate-100 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export default Toast
