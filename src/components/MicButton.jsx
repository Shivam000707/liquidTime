import { Mic } from 'lucide-react'
import { GRAD, SHADOW, BORDER, CLR } from '../styles/tokens'

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
          ? { background: GRAD.primary, color: '#fff', border: 'none', boxShadow: SHADOW.micActive }
          : { background: '#0f172a', color: '#f1f5f9', border: BORDER.slate70, boxShadow: SHADOW.micIdle }),
      }}
    >
      {recording && (
        <>
          <span
            className="absolute rounded-full pointer-events-none"
            style={{ inset: -10, border: `1.5px solid ${CLR.emeraldBorder45}`, animation: 'lt-pulse 1.6s cubic-bezier(0.22,1,0.36,1) infinite' }}
          />
          <span
            className="absolute rounded-full pointer-events-none"
            style={{ inset: -20, border: `1px solid ${CLR.emeraldBorder35}`, animation: 'lt-pulse 1.6s cubic-bezier(0.22,1,0.36,1) 0.35s infinite' }}
          />
        </>
      )}
      <Mic size={28} strokeWidth={1.6} />
    </button>
  )
}

export default MicButton
