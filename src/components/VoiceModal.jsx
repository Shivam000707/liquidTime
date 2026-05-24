import { useState, useEffect, useRef } from 'react'
import { X, Mic, MicOff, Loader2, AlertCircle } from 'lucide-react'

const WAVE_BARS = 14

function MiniWaveform() {
  const bars = []
  for (let i = 0; i < WAVE_BARS; i++) {
    const baseH = 22 + ((i * 37) % 66)
    const delay = ((i * 73) % 600) / 1000
    bars.push(
      <span
        key={i}
        className="inline-block rounded-full"
        style={{
          width: 2,
          height: `${baseH}%`,
          background: 'linear-gradient(180deg, #f97316, #ec4899)',
          boxShadow: '0 0 5px rgba(6,182,212,0.35)',
          animation: `lt-wave 1s ease-in-out ${delay}s infinite`,
        }}
      />
    )
  }
  return (
    <div className="flex items-center gap-[3px] h-[28px]">
      {bars}
    </div>
  )
}

function VoiceModal({
  open, onClose, onCommit,
  transcript, isListening, isSupported = true,
  submitting = false, error = null,
  startListening, stopListening,
}) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  // Reset on open
  useEffect(() => {
    if (open) {
      setText('')
      setTimeout(() => textareaRef.current?.focus(), 80)
    }
  }, [open])

  // Mirror live speech into the textarea while the mic is active
  useEffect(() => {
    if (isListening && transcript) setText(transcript)
  }, [transcript, isListening])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape' && !submitting) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, submitting])

  const toggleMic = () => {
    if (isListening) stopListening()
    else startListening()
  }

  const handleCommit = () => {
    if (!text.trim() || submitting) return
    onCommit(text.trim())
  }

  if (!open) return null

  return (
    <>
      {/* mobile backdrop */}
      <div
        className="fixed inset-0 z-40 sm:hidden"
        style={{ background: 'rgba(2,6,23,0.6)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', animation: 'lt-fade-in 200ms ease-out both' }}
        onClick={!submitting ? onClose : undefined}
      />

      {/* panel — bottom sheet on mobile, floating panel on desktop */}
      <div
        className="fixed z-50 left-0 right-0 bottom-0 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[360px]"
        style={{ animation: 'lt-slide-up 280ms cubic-bezier(0.22,1,0.36,1) both' }}
      >
      <div
        className="rounded-t-[28px] sm:rounded-[20px] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pb-5"
        style={{
          background: 'linear-gradient(180deg, rgba(15,23,42,0.98), rgba(2,6,23,0.98))',
          border: '1px solid rgba(249,115,22,0.32)',
          borderBottom: 'none',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5), 0 0 40px rgba(249,115,22,0.14), inset 0 1px 0 rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* drag handle on mobile */}
        <div className="sm:hidden flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(100,116,139,0.4)' }} />
        </div>
        {/* header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {isSupported && isListening ? (
              <>
                <span className="relative w-1.5 h-1.5 shrink-0">
                  <span className="absolute inset-0 rounded-full bg-cyan-400" />
                  <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping" />
                </span>
                <MiniWaveform />
              </>
            ) : (
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                {submitting
                  ? 'reflowing schedule…'
                  : isSupported ? 'mic paused · edit or resume' : 'type command'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {/* mic toggle — only shown when voice is supported */}
            {isSupported && (
              <button
                onClick={toggleMic}
                disabled={submitting}
                title={isListening ? 'Pause mic' : 'Resume mic'}
                className="w-7 h-7 rounded-lg grid place-items-center transition-colors disabled:opacity-40"
                style={isListening
                  ? { background: 'rgba(249,115,22,0.18)', color: '#fb923c' }
                  : { background: 'rgba(30,41,59,0.6)', color: '#64748b' }}
              >
                {isListening ? <Mic size={13} /> : <MicOff size={13} />}
              </button>
            )}
            <button
              onClick={onClose}
              disabled={submitting}
              aria-label="Close"
              className="w-7 h-7 rounded-lg grid place-items-center text-slate-500 hover:text-slate-100 hover:bg-slate-800/60 transition-colors disabled:opacity-40"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* always-visible editable textarea */}
        <textarea
          ref={textareaRef}
          placeholder={isSupported ? 'speak or type your command…' : 'e.g. "move gym to 6 PM"'}
          value={text}
          disabled={submitting}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && text.trim()) {
              e.preventDefault()
              handleCommit()
            }
          }}
          className="w-full rounded-xl px-3 py-2.5 text-[14px] text-slate-100 placeholder-slate-500 resize-none outline-none leading-relaxed disabled:opacity-60"
          style={{
            background: 'rgba(15,23,42,0.7)',
            border: `1px solid ${isListening ? 'rgba(249,115,22,0.45)' : 'rgba(249,115,22,0.20)'}`,
            minHeight: 72,
            transition: 'border-color 0.2s',
          }}
        />

        {isSupported && !isListening && !text && !error && (
          <p className="mt-2 text-[11px] text-slate-600">
            try "move gym to 6 PM" · "add lunch at noon" · "delete sleep block"
          </p>
        )}

        {/* error — modal stays open so the command isn't lost */}
        {error && (
          <div className="mt-3 flex items-start gap-2 px-3 py-2 rounded-xl text-[12px] text-red-300 bg-red-900/40 border border-red-800/60">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* actions */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-2 rounded-xl text-[13px] font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleCommit}
            disabled={!text.trim() || submitting}
            className="flex-1 py-2 rounded-xl text-[13px] font-medium text-white transition-all disabled:opacity-35 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5"
            style={{ background: 'linear-gradient(135deg,#f97316,#ec4899)', boxShadow: '0 6px 20px rgba(249,115,22,0.30), inset 0 1px 0 rgba(255,255,255,0.18)' }}
          >
            {submitting
              ? <><Loader2 size={14} className="animate-spin" /> Reflowing…</>
              : error ? 'Retry · reflow' : 'Commit · reflow'}
          </button>
        </div>
      </div>
      </div>
    </>
  )
}

export default VoiceModal
