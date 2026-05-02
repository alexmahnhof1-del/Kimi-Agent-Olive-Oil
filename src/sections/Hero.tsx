import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'

interface HeroProps {
  isLoading: boolean
}

// Simplex noise helper
function simplexNoise2D(x: number, y: number): number {
  return Math.sin(x * 1.5 + y * 2.3) * 0.5 +
    Math.sin(x * 3.7 - y * 1.1) * 0.3 +
    Math.cos(x * 2.1 + y * 3.5) * 0.2
}

export default function Hero({ isLoading }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: -1, y: -1 })

  // Golden Sand Canvas Background - LIGHT VERSION
  const initGoldenSand = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio, 2)

    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const PARTICLE_COUNT = 4000
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * Math.min(width, height) * 0.6
      particles.push({
        x: width / 2 + Math.cos(angle) * r,
        y: height / 2 + Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        size: 0.5 + Math.random() * 2.5,
        alpha: 0.08 + Math.random() * 0.5,
      })
    }

    let time = 0

    const draw = () => {
      time += 0.005

      // Light warm background
      ctx.fillStyle = '#F8F5EF'
      ctx.fillRect(0, 0, width, height)

      // Subtle warm radial glow at center
      const bgGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.min(width, height) * 0.6
      )
      bgGradient.addColorStop(0, 'rgba(212, 175, 55, 0.12)')
      bgGradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.04)')
      bgGradient.addColorStop(1, 'rgba(248, 245, 239, 0)')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Draw flowing golden particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i]

        const noiseX = simplexNoise2D(p.x * 0.002, time)
        const noiseY = simplexNoise2D(p.y * 0.002, time + 100)

        p.vx += noiseX * 0.02
        p.vy += noiseY * 0.02
        p.vx *= 0.98
        p.vy *= 0.98

        p.x += p.vx
        p.y += p.vy

        if (mouseRef.current.x > 0) {
          const dx = p.x - mouseRef.current.x
          const dy = p.y - mouseRef.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            const force = (1 - dist / 150) * 0.5
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        const goldIntensity = 0.5 + simplexNoise2D(p.x * 0.003, p.y * 0.003) * 0.5
        const r = Math.floor(180 + goldIntensity * 40)
        const g = Math.floor(145 + goldIntensity * 35)
        const b = Math.floor(40 + goldIntensity * 15)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    let cleanup: (() => void) | undefined

    if (!isLoading) {
      cleanup = initGoldenSand()

      if (contentRef.current) {
        const tl = gsap.timeline({ delay: 0.3 })

        tl.fromTo(
          '.hero-label',
          { opacity: 0, y: 20 },
          { opacity: 0.7, y: 0, duration: 0.6, ease: 'expo.out' }
        )
          .fromTo(
            '.hero-title-line',
            { opacity: 0, y: 60, clipPath: 'inset(100% 0 0 0)' },
            {
              opacity: 1,
              y: 0,
              clipPath: 'inset(0% 0 0 0)',
              duration: 1.2,
              stagger: 0.15,
              ease: 'expo.out',
            },
            '-=0.3'
          )
          .fromTo(
            '.hero-subtitle',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
            '-=0.6'
          )
          .fromTo(
            '.hero-cta',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'expo.out' },
            '-=0.4'
          )
      }
    }

    return () => {
      if (cleanup) cleanup()
      cancelAnimationFrame(rafRef.current)
    }
  }, [isLoading, initGoldenSand])

  useEffect(() => {
    if (isLoading) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight
      if (contentRef.current && scrollY < heroHeight) {
        const opacity = 1 - (scrollY / heroHeight) * 1.5
        const translateY = -scrollY * 0.3
        contentRef.current.style.opacity = String(Math.max(0, opacity))
        contentRef.current.style.transform = `translateY(${translateY}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoading])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#F8F5EF' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      <div
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
      >
        <p
          className="hero-label opacity-0 font-body text-xs uppercase tracking-[4px] mb-8"
          style={{ color: '#B8941F' }}
        >
          Griechisches Extra Natives
        </p>

        <h1 className="font-display mb-8">
          <span
            className="hero-title-line opacity-0 block text-[48px] md:text-[80px] leading-[1.1] tracking-[-2.5px]"
            style={{ color: '#1A1714' }}
          >
            Flüssiges
          </span>
          <span
            className="hero-title-line opacity-0 block text-[48px] md:text-[80px] leading-[1.1] tracking-[-2.5px]"
            style={{ color: '#B8941F' }}
          >
            Gold
          </span>
        </h1>

        <p
          className="hero-subtitle opacity-0 font-body text-base md:text-[17px] max-w-[520px] mx-auto mb-10"
          style={{ color: '#7A7265', lineHeight: 1.65 }}
        >
          Kaltgepresst aus den alten Hainen Kretas, von Zakarias Familie mit Hingabe hergestellt.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#produkte"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#produkte')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="hero-cta opacity-0 font-body text-[13px] uppercase tracking-[1.5px] font-medium px-9 py-3.5 rounded-pill transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_20px_rgba(184,148,31,0.35)]"
            style={{ backgroundColor: '#B8941F', color: '#F8F5EF' }}
          >
            Entdecke unsere Öle
          </a>
          <a
            href="#herkunft"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#herkunft')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="hero-cta opacity-0 font-body text-[13px] uppercase tracking-[1.5px] font-medium px-9 py-3.5 rounded-pill transition-all duration-300 hover:bg-[rgba(184,148,31,0.1)]"
            style={{
              color: '#B8941F',
              border: '1px solid rgba(184, 148, 31, 0.5)',
            }}
          >
            Unsere Geschichte
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #F8F5EF, transparent)',
          zIndex: 5,
        }}
      />
    </section>
  )
}