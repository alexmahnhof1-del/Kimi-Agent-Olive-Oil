import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 3000, suffix: '+', label: 'Jahre Tradition' },
  { value: 100, suffix: '%', label: 'Handgepflückt' },
  { value: 0.3, suffix: '%', label: 'Säuregehalt', isDecimal: true },
]

export default function Origin() {
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.origin-label',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        }
      )

      gsap.fromTo(
        '.origin-headline-word',
        { opacity: 0, y: 60, rotateX: 20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.0,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      )

      gsap.fromTo(
        '.origin-description',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          delay: 0.3,
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      )

      const statNumbers = section.querySelectorAll('.stat-number')
      statNumbers.forEach((el) => {
        const target = parseFloat(el.getAttribute('data-target') || '0')
        const isDecimal = el.getAttribute('data-decimal') === 'true'
        const suffix = el.getAttribute('data-suffix') || ''

        gsap.fromTo(
          el,
          { innerText: isDecimal ? '0.0' : '0' },
          {
            innerText: target,
            duration: 1.5,
            ease: 'expo.out',
            snap: { innerText: isDecimal ? 0.1 : 1 },
            scrollTrigger: { trigger: el, start: 'top 85%' },
            onUpdate: function () {
              const current = parseFloat((el as HTMLElement).innerText)
              ;(el as HTMLElement).innerText = isDecimal
                ? current.toFixed(1) + suffix
                : Math.round(current) + suffix
            },
          }
        )
      })

      gsap.fromTo(
        '.stat-label',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
        }
      )

      gsap.fromTo(
        '.origin-main-image',
        { opacity: 0, scale: 0.95, x: 60 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      )

      gsap.fromTo(
        '.origin-overlay-image',
        { opacity: 0, scale: 0.9, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.0,
          delay: 0.3,
          ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      )

      gsap.to('.origin-main-image', {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to('.origin-overlay-image', {
        y: -140,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="herkunft"
      ref={sectionRef}
      className="relative min-h-screen py-24 md:py-32 px-6 md:px-20"
      style={{ backgroundColor: '#F8F5EF' }}
    >
      {/* Warm golden glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(212, 175, 55, 0.12) 0%, transparent 60%)',
        }}
      />

      <div className="content-max-width relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div>
            <p
              className="origin-label opacity-0 font-body text-xs uppercase tracking-[4px] mb-6"
              style={{ color: '#B8941F' }}
            >
              Die Herkunft
            </p>

            <h2 className="font-display text-[32px] md:text-[64px] leading-[1.1] tracking-[-2px] mb-8">
              {'Vom kretischen Hain in deine Küche'.split(' ').map((word, i) => (
                <span
                  key={i}
                  className="origin-headline-word opacity-0 inline-block mr-[0.3em]"
                  style={{ color: '#1A1714' }}
                >
                  {word}
                </span>
              ))}
            </h2>

            <p
              className="origin-description opacity-0 font-body text-base md:text-[17px] max-w-[480px] mb-12"
              style={{ color: '#7A7265', lineHeight: 1.65 }}
            >
              Auf den sonnendurchfluteten Hängen Kretas, wo Olivenbäume seit über 3.000 Jahren gedeihen, erntet Zakarias Familie die Früchte alten Wissens. Jede Olive wird mit der Hand gepflückt, jeder Tropfen mit der Geduld vergangener Generationen gepresst.
            </p>

            {/* Stats */}
            <div ref={statsRef} className="flex flex-wrap gap-8 md:gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-2">
                  <span
                    className="stat-number font-display text-[32px] md:text-[40px] leading-[1.2]"
                    style={{ color: '#B8941F' }}
                    data-target={stat.value}
                    data-suffix={stat.suffix}
                    data-decimal={stat.isDecimal ? 'true' : 'false'}
                  >
                    {stat.isDecimal ? '0.0' : '0'}{stat.suffix}
                  </span>
                  <span
                    className="stat-label opacity-0 font-body text-[13px] uppercase tracking-[0.5px]"
                    style={{ color: '#7A7265' }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Images */}
          <div className="relative">
            <div
              className="origin-main-image opacity-0 relative overflow-hidden shadow-lg"
              style={{ borderRadius: 20, border: '1px solid rgba(184, 148, 31, 0.2)' }}
            >
              <img
                src="/images/origin-olive-grove.jpg"
                alt="Kretischer Olivenhain bei goldener Stunde"
                className="w-full aspect-video object-cover"
                loading="lazy"
              />
            </div>
            <div
              className="origin-overlay-image opacity-0 absolute -bottom-10 -right-6 md:-right-10 w-[45%] overflow-hidden shadow-xl"
              style={{
                borderRadius: 20,
                border: '1px solid rgba(184, 148, 31, 0.2)',
              }}
            >
              <img
                src="/images/origin-harvest.jpg"
                alt="Zakaria bei der Olivenernte"
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}