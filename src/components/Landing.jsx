import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Mic2, Shuffle, Clock, Shield } from 'lucide-react'

// ── inline SVG icons ─────────────────────────────────────────────────────────
function ArrowUpRight({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M7 17L17 7" /><path d="M7 7h10v10" />
    </svg>
  )
}
function PlayFill({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  )
}

// ── ambient background (no canvas, pure CSS orbs) ────────────────────────────
function AmbientBg() {
  return (
    <div aria-hidden="true" style={{ pointerEvents: 'none', position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20%', right: '-8%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 65%)' }} />
      <div style={{ position: 'absolute', top: '38%', left: '-12%', width: 580, height: 580, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 65%)' }} />
      <div style={{ position: 'absolute', bottom: '-12%', left: '28%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 65%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)', backgroundSize: '88px 88px' }} />
    </div>
  )
}

// ── word-by-word blur reveal ─────────────────────────────────────────────────
function BlurText({ text, className, startDelay = 0 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <p ref={ref} className={className}
      style={{ display: 'flex', flexWrap: 'wrap', rowGap: '0.1em', margin: 0, padding: 0 }}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          animate={inView
            ? { filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'], opacity: [0, 0.5, 1], y: [50, -5, 0] }
            : {}}
          transition={{ duration: 0.7, delay: startDelay + i * 0.1, ease: 'easeOut', times: [0, 0.5, 1] }}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}

// ── navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onEnter }) {
  return (
    <nav style={{ position: 'fixed', top: 16, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(20px, 5vw, 64px)' }}>
      {/* Logo */}
      <div className="liquid-glass" style={{ width: 48, height: 48, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 20, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>lt</span>
      </div>

      {/* Center links — desktop only */}
      <div className="liquid-glass hidden md:flex" style={{ alignItems: 'center', padding: '6px', borderRadius: 9999, gap: 0 }}>
        {['Home', 'Features', 'Privacy'].map((link) => (
          <span key={link} style={{ padding: '8px 14px', fontSize: 13, color: 'rgba(255,255,255,0.88)', cursor: 'default', fontFamily: "'Barlow', sans-serif", fontWeight: 500, whiteSpace: 'nowrap' }}>
            {link}
          </span>
        ))}
        <button
          onClick={onEnter}
          style={{ background: '#fff', color: '#000', borderRadius: 9999, padding: '8px 18px', fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 600, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', marginLeft: 4 }}
        >
          Get Started <ArrowUpRight size={13} />
        </button>
      </div>

      {/* Right — spacer desktop / CTA mobile */}
      <div style={{ width: 48, flexShrink: 0 }} className="hidden md:block" />
      <button
        onClick={onEnter}
        className="liquid-glass md:hidden"
        style={{ borderRadius: 9999, padding: '10px 16px', fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 500, color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent' }}
      >
        Start <ArrowUpRight size={13} />
      </button>
    </nav>
  )
}

// ── stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, Icon }) {
  return (
    <div className="liquid-glass" style={{ padding: '20px 22px', borderRadius: 20, width: 'clamp(160px, 22vw, 210px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)', display: 'grid', placeItems: 'center' }}>
        <Icon size={15} color="rgba(255,255,255,0.7)" strokeWidth={1.6} />
      </div>
      <div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 36px)', color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>{label}</div>
      </div>
    </div>
  )
}

// ── capability card ──────────────────────────────────────────────────────────
const CAPABILITIES = [
  {
    LucideIcon: Sparkles,
    tags: ['Natural Language', 'Instant', 'Any Day'],
    title: 'AI Generation',
    body: 'Describe your classes, gym, meals, work — anything. AI builds the perfect schedule in under a second.',
  },
  {
    LucideIcon: Mic2,
    tags: ['Voice-first', 'Real-time', 'Hands-free'],
    title: 'Voice Control',
    body: '"Move my gym to 7pm and push dinner back." Your entire day reflowed in one sentence.',
  },
  {
    LucideIcon: Shuffle,
    tags: ['Conflict-free', 'Automatic', 'Intelligent'],
    title: 'Smart Reflow',
    body: 'Fixed anchors stay locked. Floating blocks rearrange around them — no overlaps, no manual dragging.',
  },
]

function CapabilityCard({ cap, index }) {
  const { LucideIcon } = cap
  return (
    <motion.div
      className="liquid-glass"
      style={{ borderRadius: 20, padding: 24, minHeight: 340, display: 'flex', flexDirection: 'column' }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
    >
      {/* top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div className="liquid-glass" style={{ width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <LucideIcon size={20} color="#fff" strokeWidth={1.5} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 6, maxWidth: '70%' }}>
          {cap.tags.map((t) => (
            <span key={t} className="liquid-glass" style={{ borderRadius: 9999, padding: '4px 12px', fontSize: 11, color: 'rgba(255,255,255,0.82)', fontFamily: "'Barlow', sans-serif", whiteSpace: 'nowrap' }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* spacer */}
      <div style={{ flex: 1 }} />

      {/* bottom */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 36px)', color: '#fff', letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>
          {cap.title}
        </h3>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, marginTop: 12, maxWidth: '32ch', marginBottom: 0 }}>
          {cap.body}
        </p>
      </div>
    </motion.div>
  )
}

// ── main ─────────────────────────────────────────────────────────────────────
function Landing({ onEnter }) {
  const BARLOW = "'Barlow', sans-serif"

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100dvh', fontFamily: BARLOW, overflowX: 'hidden' }}>
      <Navbar onEnter={onEnter} />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{ minHeight: '100dvh', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AmbientBg />

        {/* centred content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(96px,15vh,140px) clamp(20px,5vw,60px) 32px',
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: 900,
          margin: '0 auto',
          width: '100%',
        }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.65, delay: 0.4, ease: 'easeOut' }}
          >
            <div className="liquid-glass" style={{ borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 6px' }}>
              <span style={{ background: '#fff', color: '#000', borderRadius: 9999, fontSize: 11, fontWeight: 700, fontFamily: BARLOW, padding: '3px 10px', lineHeight: 1.4 }}>New</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', fontFamily: BARLOW, paddingRight: 6 }}>
                AI-powered scheduling · voice-first
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <div style={{ marginTop: 28 }}>
            <BlurText
              text="Your Day Flows Like Liquid"
              className="lt-hero-headline"
              startDelay={0.3}
            />
          </div>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.65, delay: 0.85, ease: 'easeOut' }}
            style={{ fontFamily: BARLOW, fontWeight: 300, fontSize: 'clamp(15px, 2.4vw, 18px)', color: 'rgba(255,255,255,0.82)', maxWidth: 520, lineHeight: 1.6, margin: '20px auto 0' }}
          >
            Describe the life you want. AI generates your perfect schedule. Adjust with your voice in seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.65, delay: 1.1, ease: 'easeOut' }}
            style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <button
              onClick={onEnter}
              className="liquid-glass-strong"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 9999, color: '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'transparent' }}
            >
              Start Scheduling <ArrowUpRight size={16} />
            </button>
            <button
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.78)', fontSize: 14, fontFamily: BARLOW, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <PlayFill size={14} /> See how it works
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.65, delay: 1.3, ease: 'easeOut' }}
            style={{ display: 'flex', gap: 16, marginTop: 48, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <StatCard value="&lt; 1s" label="Schedule generation" Icon={Clock} />
            <StatCard value="100%" label="On-device privacy" Icon={Shield} />
          </motion.div>
        </div>

        {/* bottom strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.65, delay: 1.45 }}
          style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingBottom: 32 }}
        >
          <div className="liquid-glass" style={{ borderRadius: 9999, padding: '7px 18px', fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: BARLOW }}>
            No sign-up required · All data stays on your device · Free forever
          </div>
        </motion.div>
      </section>

      {/* ══ CAPABILITIES ═══════════════════════════════════════════════════════ */}
      <section style={{ minHeight: '100dvh', position: 'relative', display: 'flex', flexDirection: 'column', padding: 'clamp(64px,10vh,96px) clamp(20px,5vw,80px) clamp(40px,6vh,60px)' }}>
        <AmbientBg />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* section header */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 24, fontFamily: BARLOW, margin: '0 0 24px' }}
            >
              // Capabilities
            </motion.p>
            <BlurText
              text="Scheduling reinvented"
              className="lt-section-headline"
              startDelay={0}
            />
          </div>

          {/* cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginTop: 56, marginBottom: 0 }}>
            {CAPABILITIES.map((cap, i) => (
              <CapabilityCard key={cap.title} cap={cap} index={i} />
            ))}
          </div>

          {/* final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}
          >
            <button
              onClick={onEnter}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 9999, background: '#fff', color: '#000', fontSize: 14, fontFamily: BARLOW, fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Start Scheduling Free <ArrowUpRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Landing
