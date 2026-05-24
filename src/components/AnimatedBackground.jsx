import { useEffect, useRef } from 'react'

function AnimatedBackground() {
  const canvasRef = useRef(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = window.innerWidth
    const height = window.innerHeight
    canvas.width = width
    canvas.height = height

    // Particle/node system for lattice
    const particles = []
    const particleCount = 40

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }

    // Connection distance threshold
    const connectionDistance = 200

    const animate = () => {
      timeRef.current += 1

      // Clear canvas with slight trails
      ctx.fillStyle = 'rgba(10, 14, 39, 0.05)'
      ctx.fillRect(0, 0, width, height)

      // Update particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.pulsePhase += 0.01

        // Wrap around edges
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Pulse effect
        const pulseFactor = Math.sin(p.pulsePhase) * 0.3 + 0.7
        const displayRadius = p.radius * pulseFactor

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, displayRadius * 3)
        gradient.addColorStop(0, `rgba(34, 211, 238, ${p.opacity * 0.6})`)
        gradient.addColorStop(0.5, `rgba(34, 211, 238, ${p.opacity * 0.2})`)
        gradient.addColorStop(1, 'rgba(34, 211, 238, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(p.x - displayRadius * 3, p.y - displayRadius * 3, displayRadius * 6, displayRadius * 6)

        // Draw core
        ctx.fillStyle = `rgba(251, 146, 60, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, displayRadius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.15
            const gradient = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
            )
            gradient.addColorStop(0, `rgba(34, 211, 238, ${opacity})`)
            gradient.addColorStop(0.5, `rgba(251, 146, 60, ${opacity * 0.5})`)
            gradient.addColorStop(1, `rgba(34, 211, 238, ${opacity})`)

            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Gradient ebb and flow - static CSS layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(34, 211, 238, 0.08) 0%, transparent 50%)',
          animation: 'flowGradient 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 70% 50%, rgba(251, 146, 60, 0.06) 0%, transparent 50%)',
          animation: 'flowGradient 25s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(168, 85, 247, 0.05) 0%, transparent 60%)',
          animation: 'flowGradient 22s ease-in-out infinite',
        }}
      />

      {/* Lattice of information - canvas layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.7 }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(30,144,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </>
  )
}

export default AnimatedBackground
