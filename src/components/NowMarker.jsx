function NowMarker({ time }) {
  return (
    <div className="relative flex items-center gap-3 py-1.5 my-1" aria-label={`Now ${time}`}>
      <div className="relative w-3.5 h-3.5 shrink-0">
        <span className="absolute inset-0 rounded-full" style={{background:'linear-gradient(135deg,#10b981,#34d399)', boxShadow:'0 0 0 4px rgba(16,185,129,0.18), 0 0 16px rgba(16,185,129,0.6)'}} />
        <span className="absolute -inset-1.5 rounded-full" style={{border:'1.5px solid rgba(16,185,129,0.45)', animation: 'lt-pulse 1.8s cubic-bezier(0.22,1,0.36,1) infinite'}} />
        <span className="absolute -inset-3 rounded-full" style={{border:'1px solid rgba(52,211,153,0.35)', animation: 'lt-pulse 1.8s cubic-bezier(0.22,1,0.36,1) 0.4s infinite'}} />
      </div>
      <div className="flex-1 h-[2px] rounded-full" style={{background:'linear-gradient(90deg,#10b981,#34d399)', boxShadow:'0 0 16px rgba(16,185,129,0.6), 0 0 32px rgba(52,211,153,0.4)'}} />
      <span className="font-mono text-[11px] font-semibold tracking-wider text-emerald-300" style={{fontVariantNumeric:'tabular-nums'}}>
        NOW · {time}
      </span>
    </div>
  )
}

export default NowMarker
