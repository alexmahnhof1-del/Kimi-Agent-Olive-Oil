import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio, 2)
    canvas.width = 200 * dpr
    canvas.height = 6 * dpr
    ctx.scale(dpr, dpr)

    let animProgress = 0
    let targetProgress = 0
    let droplets: { x: number; y: number; size: number; life: number; maxLife: number }[] = []
    let frame = 0
    let rafId: number

    const loadInterval = setInterval(() => {
      targetProgress = Math.min(targetProgress + 0.02 + Math.random() * 0.03, 1)
    }, 80)

    const draw = () => {
      animProgress += (targetProgress - animProgress) * 0.08
      frame++

      ctx.clearRect(0, 0, 200, 6)

      // Background bar - light
      ctx.fillStyle = 'rgba(184, 148, 31, 0.15)'
      ctx.beginPath()
      ctx.roundRect(0, 0, 200, 6, 3)
      ctx.fill()

      // Liquid gold wave
      if (animProgress > 0.01) {
        const barWidth = 200 * animProgress
        const t = frame * 0.02

        ctx.save()
        ctx.beginPath()
        ctx.moveTo(0, 6)

        for (let x = 0; x <= barWidth; x++) {
          const wave1 = Math.sin(x * 0.02 + t * 0.8) * 3
          const wave2 = Math.sin(x * 0.05 - t * 1.2) * 1.5
          const wave3 = Math.sin(x * 0.01 + t * 0.4) * 4
          const y = 3 + (wave1 + wave2 + wave3) * animProgress
          ctx.lineTo(x, y)
        }

        ctx.lineTo(barWidth, 6)
        ctx.lineTo(0, 6)
        ctx.closePath()

        ctx.fillStyle = `rgba(184, 148, 31, ${animProgress * 0.7})`
        ctx.fill()

        // Bright core
        ctx.beginPath()
        for (let x = 0; x <= barWidth; x++) {
          const wave1 = Math.sin(x * 0.02 + t * 0.8) * 3
          const y = 3 + wave1 * animProgress
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(212, 175, 55, ${animProgress * 0.9})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.restore()
      }

      // Oil droplets
      if (animProgress > 0.05 && animProgress < 0.95 && Math.random() < 0.15) {
        droplets.push({
          x: Math.random() * 200 * animProgress,
          y: Math.random() * 6,
          size: 1.5 + Math.random() * 2,
          life: 0,
          maxLife: 60 + Math.random() * 60,
        })
      }

      droplets = droplets.filter((d) => d.life < d.maxLife)
      droplets.forEach((d) => {
        d.life++
        const lifeRatio = d.life / d.maxLife
        const fadeIn = Math.min(lifeRatio * 3, 1)
        const fadeOut = Math.max(1 - Math.pow(lifeRatio - 0.7, 2) / 0.09, 0)
        const alpha = fadeIn * fadeOut * animProgress

        ctx.save()
        ctx.shadowBlur = 12
        ctx.shadowColor = '#B8941F'
        ctx.fillStyle = `rgba(184, 148, 31, ${alpha})`
        ctx.beginPath()
        ctx.ellipse(d.x, d.y, d.size, d.size * 0.8, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      setProgress(Math.round(animProgress * 100))

      if (animProgress >= 0.999) {
        clearInterval(loadInterval)

        gsap.to(canvas, {
          scaleX: 20,
          duration: 0.6,
          ease: 'expo.out',
          onComplete: () => {
            gsap.to(containerRef.current, {
              opacity: 0,
              y: -40,
              duration: 0.5,
              ease: 'expo.out',
              onComplete,
            })
          },
        })
        return
      }

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)

    return () => {
      clearInterval(loadInterval)
      cancelAnimationFrame(rafId)
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#F8F5EF' }}
    >
      <h1
        className="font-display text-5xl mb-12 tracking-wide"
        style={{ color: '#B8941F' }}
      >
        ZAKARIYA
      </h1>
      <canvas
        ref={canvasRef}
        style={{ width: 200, height: 6, borderRadius: 3 }}
      />
      <span
        className="font-accent text-sm mt-6 tracking-wider"
        style={{ color: '#7A7265' }}
      >
        {progress}%
      </span>
    </div>
  )
}