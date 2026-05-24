import { ArrowRight, Zap, Mic2, Lock } from 'lucide-react'
import AnimatedBackground from './AnimatedBackground'

function Landing({ onEnter }) {
  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden"
      style={{ background: '#0a0e27', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* sophisticated animated background */}
      <AnimatedBackground />

      {/* content */}
      <div className="relative max-w-2xl z-10">
        {/* hero intro */}
        <div className="text-center mb-16 space-y-6">
          {/* accent line */}
          <div
            className="inline-block"
            style={{
              animation: 'slideInDown 900ms cubic-bezier(0.34,1.56,0.64,1) both',
            }}
          >
            <span
              className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full inline-block"
              style={{
                background: 'linear-gradient(90deg, rgba(249,115,22,0.2), rgba(236,72,153,0.2))',
                border: '1px solid rgba(249,115,22,0.4)',
                color: '#f97316',
              }}
            >
              ✨ AI-Powered Scheduling
            </span>
          </div>

          {/* main headline */}
          <h1
            className="text-5xl sm:text-7xl font-black tracking-tighter leading-[1.1]"
            style={{
              animation: 'slideInUp 900ms cubic-bezier(0.34,1.56,0.64,1) 150ms both',
              fontFamily: '"Playfair Display", serif',
              letterSpacing: '-0.02em',
            }}
          >
            Your Day,{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Orchestrated
            </span>
          </h1>

          {/* subheading */}
          <p
            className="text-lg sm:text-xl text-slate-300 max-w-lg mx-auto leading-relaxed"
            style={{
              animation: 'slideInUp 900ms cubic-bezier(0.34,1.56,0.64,1) 250ms both',
            }}
          >
            Describe the life you want. Let AI build the perfect schedule. Adjust with voice or blocks.
          </p>
        </div>

        {/* three feature pills */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12"
          style={{
            animation: 'slideInUp 900ms cubic-bezier(0.34,1.56,0.64,1) 350ms both',
          }}
        >
          {[
            { icon: Mic2, label: 'Voice Commands', desc: 'Reflow in seconds' },
            { icon: Zap, label: 'Instant Generation', desc: 'AI builds it live' },
            { icon: Lock, label: 'On-Device', desc: 'Nothing leaves your phone' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl backdrop-blur-md border transition-all hover:border-orange-400/60 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer group"
              style={{
                background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(236,72,153,0.06))',
                border: '1px solid rgba(249,115,22,0.2)',
              }}
            >
              <feature.icon
                size={24}
                className="text-orange-400 mb-2 group-hover:scale-110 transition-transform"
              />
              <p className="text-sm font-bold text-white">{feature.label}</p>
              <p className="text-xs text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <div
          className="flex justify-center"
          style={{
            animation: 'slideInUp 900ms cubic-bezier(0.34,1.56,0.64,1) 450ms both',
          }}
        >
          <button
            onClick={onEnter}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #f97316, #ec4899)',
              boxShadow: '0 20px 60px rgba(249,115,22,0.35)',
            }}
          >
            <span>Start Scheduling</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* trust line */}
        <p
          className="text-center text-xs text-slate-500 mt-8"
          style={{
            animation: 'slideInUp 900ms cubic-bezier(0.34,1.56,0.64,1) 550ms both',
          }}
        >
          No sign-up required · All data stays on your device · Start free
        </p>
      </div>

    </div>
  )
}

export default Landing
