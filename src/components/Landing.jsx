import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Sparkles, Mic2, Shuffle, Clock, Shield } from 'lucide-react'
import LiquidBackground from './LiquidBackground'

// ── icons ────────────────────────────────────────────────────────────────────
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

// ── scroll progress bar ──────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 100,
        scaleX, transformOrigin: '0%',
        background: 'linear-gradient(90deg, rgba(16,185,129,0.9) 0%, rgba(52,211,153,0.85) 50%, rgba(163,230,53,0.9) 100%)',
      }}
    />
  )
}

// ── ambient background with parallax ─────────────────────────────────────────
function AmbientBg({ orb1Y = 0, orb2Y = 0, orb3Y = 0 }) {
  return (
    <div aria-hidden="true" style={{ pointerEvents: 'none', position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <motion.div style={{
        position: 'absolute', top: '-20%', right: '-8%', width: 700, height: 700,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 65%)',
        y: orb1Y,
      }} />
      <motion.div style={{
        position: 'absolute', top: '38%', left: '-12%', width: 580, height: 580,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 65%)',
        y: orb2Y,
      }} />
      <motion.div style={{
        position: 'absolute', bottom: '-12%', left: '28%', width: 480, height: 480,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(163,230,53,0.07) 0%, transparent 65%)',
        y: orb3Y,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(52,211,153,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.018) 1px, transparent 1px)',
        backgroundSize: '88px 88px',
      }} />
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

// ── scrolling marquee strip ──────────────────────────────────────────────────
const MARQUEE_SEGMENT = 'Your Day · Flows Like Liquid · AI Scheduling · Voice First · On Device · '

function MarqueeStrip() {
  const track = MARQUEE_SEGMENT.repeat(6)
  return (
    <div style={{
      overflow: 'hidden',
      padding: '0',
      position: 'relative',
      borderTop: '1px solid rgba(52,211,153,0.07)',
      borderBottom: '1px solid rgba(52,211,153,0.07)',
      background: 'rgba(16,185,129,0.012)',
    }}>
      {/* row 1 — left */}
      <div style={{ display: 'flex', overflow: 'hidden' }}>
        <motion.div
          style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        >
          {[track, track].map((t, i) => (
            <span key={i} style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(52px, 7vw, 82px)',
              color: 'rgba(110,231,183,0.055)',
              letterSpacing: '-2px',
              lineHeight: 1.05,
              paddingRight: '1em',
              display: 'inline-block',
            }}>{t}</span>
          ))}
        </motion.div>
      </div>

      {/* row 2 — right */}
      <div style={{ display: 'flex', overflow: 'hidden', marginTop: -8 }}>
        <motion.div
          style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[track, track].map((t, i) => (
            <span key={i} style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(44px, 5.5vw, 66px)',
              color: 'rgba(110,231,183,0.03)',
              letterSpacing: '-1.5px',
              lineHeight: 1.05,
              paddingRight: '1em',
              display: 'inline-block',
            }}>{t}</span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// ── navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onEnter }) {
  return (
    <nav style={{
      position: 'fixed', top: 16, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(20px, 5vw, 64px)',
    }}>
      <div className="liquid-glass-mint" style={{ width: 48, height: 48, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 20, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>lt</span>
      </div>

      <div className="liquid-glass-mint hidden md:flex" style={{ alignItems: 'center', padding: '6px', borderRadius: 9999, gap: 0 }}>
        {['Home', 'Features', 'Privacy'].map((link) => (
          <span key={link} style={{ padding: '8px 14px', fontSize: 13, color: 'rgba(255,255,255,0.88)', cursor: 'default', fontFamily: "'Barlow', sans-serif", fontWeight: 500, whiteSpace: 'nowrap' }}>
            {link}
          </span>
        ))}
        <button
          onClick={onEnter}
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            color: '#fff', borderRadius: 9999, padding: '8px 18px', fontSize: 13,
            fontFamily: "'Barlow', sans-serif", fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', marginLeft: 4,
            boxShadow: '0 0 12px rgba(16,185,129,0.4)',
          }}
        >
          Get Started <ArrowUpRight size={13} />
        </button>
      </div>

      <div style={{ width: 48, flexShrink: 0 }} className="hidden md:block" />
      <button
        onClick={onEnter}
        className="liquid-glass-mint md:hidden"
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
    <div className="liquid-glass-mint" style={{ padding: '20px 22px', borderRadius: 20, width: 'clamp(160px, 22vw, 210px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.28)', display: 'grid', placeItems: 'center' }}>
        <Icon size={15} color="rgba(52,211,153,0.9)" strokeWidth={1.6} />
      </div>
      <div>
        <div style={{ fontFamily: "'Zen Dots', sans-serif", fontStyle: 'normal', fontSize: 'clamp(28px, 4vw, 36px)', color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>{label}</div>
      </div>
    </div>
  )
}

// ── capability card with 3-D mouse tilt ──────────────────────────────────────
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
  const cardRef = useRef(null)
  const { LucideIcon } = cap

  const onMouseMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    el.style.transform = `perspective(700px) rotateY(${dx * 9}deg) rotateX(${-dy * 9}deg) scale3d(1.025,1.025,1.025)`
    el.style.transition = 'transform 0.08s ease'
  }

  const onMouseLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'
    el.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)'
  }

  return (
    <motion.div
      ref={cardRef}
      className="liquid-glass-mint"
      style={{ borderRadius: 20, padding: 24, minHeight: 340, display: 'flex', flexDirection: 'column', willChange: 'transform', cursor: 'default' }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(52,211,153,0.25)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <LucideIcon size={20} color="#6ee7b7" strokeWidth={1.5} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 6, maxWidth: '70%' }}>
          {cap.tags.map((t) => (
            <span key={t} className="liquid-glass-mint" style={{ borderRadius: 9999, padding: '4px 12px', fontSize: 11, color: 'rgba(110,231,183,0.9)', fontFamily: "'Barlow', sans-serif", whiteSpace: 'nowrap' }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />

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

  const { scrollY } = useScroll()
  const headlineY = useTransform(scrollY, (v) => -v * 0.075)
  const badgeY    = useTransform(scrollY, (v) => -v * 0.045)
  const subY      = useTransform(scrollY, (v) => -v * 0.05)
  const ctaY      = useTransform(scrollY, (v) => -v * 0.035)
  const statsY    = useTransform(scrollY, (v) => -v * 0.02)
  const bottomY   = useTransform(scrollY, (v) => -v * 0.015)
  const orb1Y     = useTransform(scrollY, (v) => v * 0.06)
  const orb2Y     = useTransform(scrollY, (v) => v * 0.038)
  const orb3Y     = useTransform(scrollY, (v) => v * 0.085)

  return (
    <div style={{ background: '#010806', color: '#fff', minHeight: '100dvh', fontFamily: BARLOW, overflow: 'hidden', position: 'relative' }}>
      <LiquidBackground />
      <ScrollProgress />
      <Navbar onEnter={onEnter} />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{ minHeight: '100dvh', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AmbientBg orb1Y={orb1Y} orb2Y={orb2Y} orb3Y={orb3Y} />

        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: 'clamp(96px,15vh,140px) clamp(20px,5vw,60px) 32px',
          position: 'relative', zIndex: 10, textAlign: 'center',
          maxWidth: 1400, margin: '0 auto', width: '100%',
        }}>

          {/* Badge */}
          <motion.div style={{ y: badgeY }}
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.65, delay: 0.4, ease: 'easeOut' }}
          >
            <div className="liquid-glass-mint" style={{ borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 6px' }}>
              <span style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#fff', borderRadius: 9999, fontSize: 11, fontWeight: 700, fontFamily: BARLOW, padding: '3px 10px', lineHeight: 1.4 }}>New</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', fontFamily: BARLOW, paddingRight: 6 }}>
                AI-powered scheduling · voice-first
              </span>
            </div>
          </motion.div>

          {/* Headline — deepest parallax layer */}
          <motion.div style={{ y: headlineY, marginTop: 28 }}>
            <BlurText
              text="Your Day Flows Like Liquid"
              className="lt-hero-headline"
              startDelay={0.3}
            />
          </motion.div>

          {/* Sub */}
          <motion.p
            style={{ y: subY, fontFamily: BARLOW, fontWeight: 300, fontSize: 'clamp(15px, 2.4vw, 18px)', color: 'rgba(255,255,255,0.82)', maxWidth: 520, lineHeight: 1.6, margin: '20px auto 0' }}
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.65, delay: 0.85, ease: 'easeOut' }}
          >
            Describe the life you want. AI generates your perfect schedule. Adjust with your voice in seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div
            style={{ y: ctaY, display: 'flex', alignItems: 'center', gap: 28, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center' }}
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.65, delay: 1.1, ease: 'easeOut' }}
          >
            <button
              onClick={onEnter}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 26px', borderRadius: 9999,
                background: 'linear-gradient(135deg, #059669 0%, #10b981 60%, #34d399 100%)',
                color: '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: 600,
                cursor: 'pointer', border: 'none', letterSpacing: '0.01em',
                boxShadow: '0 0 28px rgba(16,185,129,0.50), 0 0 56px rgba(16,185,129,0.18), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              Start Scheduling <ArrowUpRight size={16} />
            </button>
            <button
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'rgba(110,231,183,0.85)', fontSize: 14, fontFamily: BARLOW, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <PlayFill size={14} /> See how it works
            </button>
          </motion.div>

          {/* Stats — barely moves, anchored feel */}
          <motion.div
            style={{ y: statsY, display: 'flex', gap: 16, marginTop: 48, flexWrap: 'wrap', justifyContent: 'center' }}
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.65, delay: 1.3, ease: 'easeOut' }}
          >
            <StatCard value="&lt; 1s" label="Schedule generation" Icon={Clock} />
            <StatCard value="100%" label="On-device privacy" Icon={Shield} />
          </motion.div>
        </div>

        {/* trust strip */}
        <motion.div
          style={{ y: bottomY, position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 32 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.65, delay: 1.45 }}
        >
          <div className="liquid-glass-mint" style={{ borderRadius: 9999, padding: '7px 18px', fontSize: 12, color: 'rgba(110,231,183,0.7)', fontFamily: BARLOW }}>
            No sign-up required · All data stays on your device · Free forever
          </div>
        </motion.div>
      </section>

      {/* ══ MARQUEE STRIP ═══════════════════════════════════════════════════════ */}
      <MarqueeStrip />

      {/* ══ CAPABILITIES ═══════════════════════════════════════════════════════ */}
      <section style={{ minHeight: '100dvh', position: 'relative', display: 'flex', flexDirection: 'column', padding: 'clamp(64px,10vh,96px) clamp(20px,5vw,80px) clamp(40px,6vh,60px)' }}>
        <AmbientBg />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ fontSize: 13, color: 'rgba(52,211,153,0.65)', fontFamily: BARLOW, margin: '0 0 24px' }}
            >
              // Capabilities
            </motion.p>
            <BlurText text="Scheduling reinvented" className="lt-section-headline" startDelay={0} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginTop: 56 }}>
            {CAPABILITIES.map((cap, i) => (
              <CapabilityCard key={cap.title} cap={cap} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}
          >
            <button
              onClick={onEnter}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 9999,
                background: 'linear-gradient(135deg, #059669 0%, #10b981 60%, #34d399 100%)',
                color: '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 0 20px rgba(16,185,129,0.45), 0 0 40px rgba(16,185,129,0.15)',
              }}
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
