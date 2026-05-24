import { Activity, Dumbbell, Hourglass, Sparkles, ArrowUpRight } from 'lucide-react'

const TILE_ICONS = { activity: Activity, dumbbell: Dumbbell, hourglass: Hourglass }

function MetricTile({ icon, label, value, sub, delta, accent }) {
  const Icon = TILE_ICONS[icon]
  return (
    <div className="relative overflow-hidden rounded-2xl px-5 py-4 bg-slate-900/60 border border-slate-800/60"
      style={{boxShadow:'0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'}}>
      <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full pointer-events-none"
        style={{background: accent === 'violet'
          ? 'radial-gradient(circle, rgba(139,92,246,0.16), transparent 60%)'
          : 'radial-gradient(circle, rgba(6,182,212,0.14), transparent 60%)'}} />
      <div className="relative">
        <div className="flex items-center gap-2 text-slate-400 mb-3">
          {Icon && <Icon size={14} strokeWidth={1.6} />}
          <span className="text-[11px] uppercase tracking-[0.08em] font-semibold">{label}</span>
        </div>
        <div className="font-mono text-[26px] font-medium text-slate-50 tracking-tight leading-none" style={{fontVariantNumeric:'tabular-nums'}}>
          {value}
        </div>
        <div className="text-[12px] text-slate-400 mt-1.5">{sub}</div>
        {delta && (
          <div className="inline-flex items-center gap-1 mt-2 text-[11px] text-emerald-400 font-mono" style={{fontVariantNumeric:'tabular-nums'}}>
            <ArrowUpRight size={11} strokeWidth={2} />
            {delta}
          </div>
        )}
      </div>
    </div>
  )
}

function AIInsight({ message }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 border"
      style={{ background:'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(139,92,246,0.08))', borderColor:'rgba(6,182,212,0.25)', boxShadow:'0 0 32px rgba(6,182,212,0.10), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="inline-flex w-6 h-6 rounded-lg items-center justify-center" style={{background:'linear-gradient(135deg,#06b6d4,#8b5cf6)'}}>
          <Sparkles size={12} strokeWidth={2} style={{color:'#fff'}} />
        </span>
        <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-cyan-200">AI · insight</span>
      </div>
      <p className="text-[13px] leading-relaxed text-slate-200">{message}</p>
    </div>
  )
}

function MetricsSidebar({ metrics, insight }) {
  return (
    <aside className="flex flex-col gap-3">
      <div className="text-[11px] uppercase tracking-[0.08em] font-semibold text-slate-500 px-1 mb-1">Today at a glance</div>
      <MetricTile icon="activity"  label="Productive"  value={metrics.productive.value}  sub={metrics.productive.sub}  delta={metrics.productive.delta} accent="cyan"   />
      <MetricTile icon="dumbbell"  label="Bulk window" value={metrics.bulkWindow.value} sub={metrics.bulkWindow.sub}                                                    accent="violet" />
      <MetricTile icon="hourglass" label="Buffer"      value={metrics.buffer.value}     sub={metrics.buffer.sub}                                                        accent="cyan"   />
      <AIInsight message={insight} />
    </aside>
  )
}

export default MetricsSidebar
