import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lines = [
  'Olivenöl ist nicht nur',
  'ein Zutat',
  'es ist Erinnerung',
  'an Heimat',
  'und Hingabe',
  'an das Land',
]

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.philosophy-label',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        }
      )

      const lineElements = section.querySelectorAll('.philosophy-line')
      lineElements.forEach((line, i) => {
        const startPositions = ['80%', '70%', '60%', '50%', '40%', '30%']

        gsap.fromTo(
          line,
          {
            opacity: 0,
            y: 50,
            clipPath: 'inset(0 100% 0 0)',
          },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: `top ${startPositions[i]}`,
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center justify-center py-24 md:py-32 px-6"
      style={{ backgroundColor: '#F0EBE1' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-[800px] mx-auto text-center">
        <p
          className="philosophy-label opacity-0 font-body text-xs uppercase tracking-[4px] mb-12 md:mb-20"
          style={{ color: '#B8941F' }}
        >
          Zakarias Versprechen
        </p>

        <div className="flex flex-col gap-4 md:gap-6">
          {lines.map((line, i) => (
            <p
              key={i}
              className="philosophy-line opacity-0 font-display text-[28px] md:text-[64px] leading-[1.1] tracking-[-2px]"
              style={{
                color: i % 2 === 0 ? '#1A1714' : '#B8941F',
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Decorative golden line */}
        <div
          className="mx-auto mt-16 md:mt-24"
          style={{
            height: 1,
            width: 120,
            background: 'linear-gradient(90deg, transparent 0%, #B8941F 50%, transparent 100%)',
            opacity: 0.4,
          }}
        />
      </div>
    </section>
  )
}