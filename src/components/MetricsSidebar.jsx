import { Activity, Dumbbell, Hourglass, Sparkles, ArrowUpRight } from 'lucide-react'
import { GRAD, SHADOW, BORDER, CLR } from '../styles/tokens'

const TILE_ICONS = { activity: Activity, dumbbell: Dumbbell, hourglass: Hourglass }

function accentFill(accent) {
  return accent === 'violet'
    ? 'radial-gradient(circle,rgba(163,230,53,0.16),transparent 60%)'
    : 'radial-gradient(circle,rgba(16,185,129,0.14),transparent 60%)'
}

function MetricTile({ icon, label, value, sub, delta, accent }) {
  const Icon = TILE_ICONS[icon]
  return (
    <div
      className="relative overflow-hidden rounded-2xl px-5 py-4 bg-slate-900/60 border border-slate-800/60"
      style={{ boxShadow: SHADOW.tile }}
    >
      <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: accentFill(accent) }} />
      <div className="relative">
        <div className="flex items-center gap-2 text-slate-400 mb-3">
          {Icon && <Icon size={14} strokeWidth={1.6} />}
          <span className="text-[11px] uppercase tracking-[0.08em] font-semibold">{label}</span>
        </div>
        <div className="font-mono text-[26px] font-medium text-slate-50 tracking-tight leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </div>
        <div className="text-[12px] text-slate-400 mt-1.5">{sub}</div>
        {delta && (
          <div className="inline-flex items-center gap-1 mt-2 text-[11px] text-emerald-400 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
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
    <div
      className="relative overflow-hidden rounded-2xl p-5"
      style={{ background: GRAD.aiInsight, border: BORDER.emerald25, boxShadow: SHADOW.aiInsight }}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span className="inline-flex w-6 h-6 rounded-lg items-center justify-center" style={{ background: GRAD.primaryLime }}>
          <Sparkles size={12} strokeWidth={2} className="text-white" />
        </span>
        <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-emerald-200">AI · insight</span>
      </div>
      <p className="text-[13px] leading-relaxed text-slate-200">{message}</p>
    </div>
  )
}

const MOBILE_CHIPS = [
  { icon: 'activity',  label: 'Productive', key: 'productive', accent: 'cyan'   },
  { icon: 'dumbbell',  label: 'Gym',        key: 'bulkWindow', accent: 'violet' },
  { icon: 'hourglass', label: 'Buffer',     key: 'buffer',     accent: 'cyan'   },
]

function MetricsSidebar({ metrics, insight }) {
  return (
    <aside>
      {/* mobile: horizontal scroll chips */}
      <div className="lg:hidden -mx-6 px-6 overflow-x-auto scroll-momentum" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-2.5 pb-1" style={{ width: 'max-content' }}>
          {MOBILE_CHIPS.map((m) => {
            const Icon = TILE_ICONS[m.icon]
            const isViolet = m.accent === 'violet'
            return (
              <div
                key={m.label}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl shrink-0"
                style={{ background: CLR.bgPanelMd, border: BORDER.slate45 }}
              >
                <div
                  className="w-7 h-7 rounded-lg grid place-items-center shrink-0"
                  style={{ background: isViolet ? CLR.limeFill15 : CLR.emeraldFill12 }}
                >
                  {Icon && <Icon size={13} strokeWidth={1.6} style={{ color: isViolet ? CLR.limeLight : CLR.emeraldLight }} />}
                </div>
                <div>
                  <div className="font-mono text-[14px] font-medium text-slate-50 leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {metrics[m.key].value}
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-[0.06em] font-semibold">{m.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* desktop: vertical stack */}
      <div className="hidden lg:flex flex-col gap-3">
        <div className="text-[11px] uppercase tracking-[0.08em] font-semibold text-slate-500 px-1 mb-1">Today at a glance</div>
        <MetricTile icon="activity"  label="Productive"  value={metrics.productive.value}  sub={metrics.productive.sub}  delta={metrics.productive.delta} accent="cyan"   />
        <MetricTile icon="dumbbell"  label="Gym window"  value={metrics.bulkWindow.value}  sub={metrics.bulkWindow.sub}                                    accent="violet" />
        <MetricTile icon="hourglass" label="Buffer"      value={metrics.buffer.value}      sub={metrics.buffer.sub}                                        accent="cyan"   />
        <AIInsight message={insight} />
      </div>
    </aside>
  )
}

export default MetricsSidebar
