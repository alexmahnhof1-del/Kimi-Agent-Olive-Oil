import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const images = [
  { src: '/images/quality-pour.jpg', alt: 'Olivenöl wird in eine Schale gegossen', large: true },
  { src: '/images/quality-zakaria.jpg', alt: 'Zakaria prüft die Ölqualität', large: false },
  { src: '/images/quality-landscape.jpg', alt: 'Kretische Landschaft mit Olivenhain', large: false },
]

export default function Quality() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.quality-label',
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
        '.quality-headline-word',
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
        '.quality-description',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      )

      gsap.fromTo(
        '.quality-image',
        { opacity: 0, scale: 1.05, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.quality-grid', start: 'top 80%' },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="qualitaet"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-20"
      style={{ backgroundColor: '#F8F5EF' }}
    >
      {/* Warm glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
        }}
      />

      <div className="content-narrow relative z-10">
        {/* Text */}
        <div className="text-center mb-16 md:mb-24">
          <p
            className="quality-label opacity-0 font-body text-xs uppercase tracking-[4px] mb-6"
            style={{ color: '#B8941F' }}
          >
            Unsere Garantie
          </p>
          <h2 className="font-display text-[32px] md:text-[64px] leading-[1.1] tracking-[-2px] mb-6">
            {'Rein wie das Licht Kretas'.split(' ').map((word, i) => (
              <span
                key={i}
                className="quality-headline-word opacity-0 inline-block mr-[0.3em]"
                style={{ color: '#1A1714' }}
              >
                {word}
              </span>
            ))}
          </h2>
          <p
            className="quality-description opacity-0 font-body text-base md:text-[17px] max-w-[640px] mx-auto"
            style={{ color: '#7A7265', lineHeight: 1.65 }}
          >
            Jede Flasche ZAKARIA wird in kleinen Chargen hergestellt und von Hand abgefüllt. Wir pressen ausschließlich am Tag der Ernte, um den höchsten Polyphenolgehalt zu bewahren. Unser Öl wird nie gefiltert — nur natürlich decantiert, damit jeder Tropfen sein volles Aroma behält.
          </p>
        </div>

        {/* Image Grid */}
        <div className="quality-grid grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
          {/* Large image - left */}
          <div
            className="quality-image opacity-0 md:row-span-2 overflow-hidden shadow-lg"
            style={{ borderRadius: 12, border: '1px solid rgba(184, 148, 31, 0.12)' }}
          >
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              style={{ minHeight: 400 }}
              loading="lazy"
            />
          </div>

          {/* Top right image */}
          <div
            className="quality-image opacity-0 overflow-hidden shadow-md"
            style={{ borderRadius: 12, border: '1px solid rgba(184, 148, 31, 0.12)' }}
          >
            <img
              src={images[1].src}
              alt={images[1].alt}
              className="w-full h-48 md:h-64 object-cover transition-transform duration-500 hover:scale-[1.02]"
              loading="lazy"
            />
          </div>

          {/* Bottom right image */}
          <div
            className="quality-image opacity-0 overflow-hidden shadow-md"
            style={{ borderRadius: 12, border: '1px solid rgba(184, 148, 31, 0.12)' }}
          >
            <img
              src={images[2].src}
              alt={images[2].alt}
              className="w-full h-48 md:h-64 object-cover transition-transform duration-500 hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}