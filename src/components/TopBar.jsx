import { useState, useEffect, useRef } from 'react'
import { Droplet, Loader2, Pencil, LogOut, Check, X } from 'lucide-react'

function useNow(intervalMs = 15_000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

function fmtTime(d) {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
function fmtDate(d) {
  return d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })
}
function greeting(d) {
  const h = d.getHours()
  if (h < 5)  return 'still up'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

function SyncPill({ synced, syncing }) {
  if (syncing) {
    return (
      <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium backdrop-blur-md"
        style={{ background: 'linear-gradient(135deg,rgba(6,182,212,0.12),rgba(139,92,246,0.12))', color: '#a5f3fc', border: '1px solid rgba(6,182,212,0.35)' }}>
        <Loader2 size={12} strokeWidth={2} className="animate-spin" />
        AI · reflowing
      </span>
    )
  }
  if (!synced) {
    return (
      <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        drafting
      </span>
    )
  }
  return (
    <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
      <span className="relative w-1.5 h-1.5">
        <span className="absolute inset-0 rounded-full bg-emerald-400" />
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
      </span>
      synced
    </span>
  )
}

const MENU_STYLE = {
  background: 'linear-gradient(180deg, rgba(15,23,42,0.98), rgba(2,6,23,0.98))',
  border: '1px solid rgba(249,115,22,0.25)',
  boxShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 24px rgba(249,115,22,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
}

function TopBar({ userName, synced, syncing, onNameChange, onReset }) {
  const now = useNow(15_000)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('main')   // 'main' | 'editName' | 'confirmReset'
  const [nameInput, setNameInput] = useState(userName)
  const menuRef = useRef(null)
  const nameInputRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) closeMenu()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const openMenu = () => {
    setNameInput(userName)
    setStep('main')
    setOpen(true)
  }

  const closeMenu = () => {
    setOpen(false)
    setStep('main')
  }

  const goEditName = () => {
    setStep('editName')
    setTimeout(() => nameInputRef.current?.select(), 40)
  }

  const saveName = () => {
    const trimmed = nameInput.trim()
    if (trimmed && trimmed !== userName) onNameChange(trimmed)
    closeMenu()
  }

  const confirmReset = () => {
    onReset()
    closeMenu()
  }

  return (
    <header className="flex items-center justify-between gap-4 sm:gap-6 px-4 sm:px-8 py-3.5 sm:py-5 border-b border-slate-800/50">
      {/* logo */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-9 h-9 rounded-xl grid place-items-center bg-slate-900 border border-slate-800/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/15 to-violet-500/15" />
          <Droplet size={18} strokeWidth={1.6} className="relative" style={{ color: '#67e8f9' }} />
        </div>
        <div className="hidden sm:block">
          <div className="text-[15px] font-semibold tracking-tight text-slate-100">LiquidTime</div>
          <div className="text-[11px] uppercase tracking-[0.08em] text-slate-500 font-medium leading-none mt-0.5">fluid scheduler</div>
        </div>
      </div>

      {/* centre greeting */}
      <div className="hidden md:flex items-baseline gap-3 min-w-0 flex-1 justify-center">
        <h1 className="text-[18px] font-medium tracking-tight text-slate-100 truncate">
          {greeting(now)}, <span className="text-slate-50">{userName}</span>
        </h1>
        <span className="text-slate-700">·</span>
        <span className="font-mono text-[14px] text-slate-300" style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtDate(now)}</span>
        <span className="font-mono text-[14px] text-slate-500" style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtTime(now)}</span>
      </div>

      {/* right side */}
      <div className="flex items-center gap-2 shrink-0">
        <SyncPill synced={synced} syncing={syncing} />

        {/* avatar — opens account menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={open ? closeMenu : openMenu}
            aria-label="Account menu"
            className="w-9 h-9 rounded-full grid place-items-center text-[12px] font-semibold text-slate-950 shadow-[0_0_24px_rgba(6,182,212,0.25)] transition-transform hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#f97316,#ec4899)' }}
          >
            {userName?.[0]?.toUpperCase() ?? '?'}
          </button>

          {/* dropdown */}
          {open && (
            <div
              className="absolute right-0 top-full mt-2 w-[220px] rounded-2xl p-3 z-50"
              style={{ ...MENU_STYLE, animation: 'lt-fade-in 150ms ease-out both' }}
            >
              {step === 'main' && (
                <div className="flex flex-col gap-1">
                  <div className="px-2 py-1.5 mb-1">
                    <p className="text-[12px] font-semibold text-slate-200 truncate">{userName}</p>
                    <p className="text-[11px] text-slate-500">your schedule · local only</p>
                  </div>
                  <div className="h-px bg-slate-800/80 mb-1" />
                  <button
                    onClick={goEditName}
                    className="flex items-center gap-2.5 px-2 py-2 rounded-xl text-[13px] text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition-colors w-full text-left"
                  >
                    <Pencil size={14} strokeWidth={1.8} />
                    Change name
                  </button>
                  <button
                    onClick={() => setStep('confirmReset')}
                    className="flex items-center gap-2.5 px-2 py-2 rounded-xl text-[13px] text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors w-full text-left"
                  >
                    <LogOut size={14} strokeWidth={1.8} />
                    Reset &amp; start fresh
                  </button>
                </div>
              )}

              {step === 'editName' && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-slate-500 px-1 mb-2">Change name</p>
                  <input
                    ref={nameInputRef}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveName()
                      if (e.key === 'Escape') closeMenu()
                    }}
                    maxLength={40}
                    className="w-full rounded-xl px-3 py-2 text-[13px] text-slate-100 outline-none"
                    style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(249,115,22,0.30)' }}
                  />
                  <div className="mt-2 flex gap-1.5">
                    <button
                      onClick={closeMenu}
                      className="flex-1 py-1.5 rounded-xl text-[12px] text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveName}
                      disabled={!nameInput.trim()}
                      className="flex-1 py-1.5 rounded-xl text-[12px] font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1"
                      style={{ background: 'linear-gradient(135deg,#f97316,#ec4899)' }}
                    >
                      <Check size={12} strokeWidth={2.5} /> Save
                    </button>
                  </div>
                </div>
              )}

              {step === 'confirmReset' && (
                <div>
                  <div className="flex items-center gap-2 px-1 mb-2">
                    <LogOut size={14} strokeWidth={1.8} className="text-red-400 shrink-0" />
                    <p className="text-[12px] font-semibold text-slate-100">Reset &amp; start fresh?</p>
                  </div>
                  <p className="text-[11px] text-slate-400 px-1 mb-3 leading-relaxed">
                    This deletes your name, schedule, and all blocks. You'll go back to the setup screen. This can't be undone.
                  </p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={closeMenu}
                      className="flex-1 py-1.5 rounded-xl text-[12px] text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <X size={12} /> Cancel
                    </button>
                    <button
                      onClick={confirmReset}
                      className="flex-1 py-1.5 rounded-xl text-[12px] font-medium text-white inline-flex items-center justify-center gap-1"
                      style={{ background: 'linear-gradient(135deg,#dc2626,#9f1239)' }}
                    >
                      <LogOut size={12} /> Yes, reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar
