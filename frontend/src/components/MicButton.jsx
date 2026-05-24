import { Mic } from 'lucide-react'

function MicButton({ recording, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={recording ? 'Stop recording' : 'Tap to speak'}
      className="relative grid place-items-center transition-transform duration-150 active:scale-95"
      style={{
        width: 72,
        height: 72,
        borderRadius: 9999,
        ...(recording
          ? {
              background: 'linear-gradient(135deg, #f97316, #ec4899)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 0 0 1px rgba(249,115,22,0.40), 0 0 32px rgba(249,115,22,0.55), 0 0 64px rgba(236,72,153,0.4)',
            }
          : {
              background: '#0f172a',
              color: '#f1f5f9',
              border: '1px solid rgba(51,65,85,0.7)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4), 0 0 24px rgba(249,115,22,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
            }),
      }}
    >
      {recording && (
        <>
          <span
            className="absolute rounded-full pointer-events-none"
            style={{ inset: -10, border: '1.5px solid rgba(249,115,22,0.45)', animation: 'lt-pulse 1.6s cubic-bezier(0.22,1,0.36,1) infinite' }}
          />
          <span
            className="absolute rounded-full pointer-events-none"
            style={{ inset: -20, border: '1px solid rgba(236,72,153,0.35)', animation: 'lt-pulse 1.6s cubic-bezier(0.22,1,0.36,1) 0.35s infinite' }}
          />
        </>
      )}
      <Mic size={28} strokeWidth={1.6} />
    </button>
  )
}

export default MicButton
