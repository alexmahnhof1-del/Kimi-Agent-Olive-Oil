import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const footerColumns = [
  {
    title: 'Shop',
    links: ['Koroneiki', 'Tsounati', 'Marioulas', 'Geschenkbox'],
  },
  {
    title: 'Über uns',
    links: ['Zakariyas Geschichte', 'Die Haine', 'Presse'],
  },
  {
    title: 'Service',
    links: ['Versand', 'Rückgabe', 'Händler werden', 'FAQ'],
  },
  {
    title: 'Kontakt',
    links: ['hello@zakariya-oil.com', 'Instagram', 'Newsletter'],
  },
]

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-column',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: footer, start: 'top 90%' },
        }
      )
    }, footer)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      id="kontakt"
      ref={footerRef}
      className="relative pt-20 pb-10 px-6 md:px-20"
      style={{ backgroundColor: '#1A1714' }}
    >
      {/* Top: Logo + Nav */}
      <div className="content-max-width flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="font-display text-[32px]"
          style={{ color: '#D4AF37' }}
        >
          ZAKARIYA
        </a>

        <nav className="flex flex-wrap gap-6 md:gap-10">
          {['Herkunft', 'Produkte', 'Qualität', 'Kontakt'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault()
                const id = item === 'Herkunft' ? 'herkunft' : item === 'Produkte' ? 'produkte' : item === 'Qualität' ? 'qualitaet' : 'kontakt'
                document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="font-body text-sm transition-colors duration-200 hover:text-[#D4AF37]"
              style={{ color: '#F5F1E8' }}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* Golden divider */}
      <div
        className="content-max-width mb-16"
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 50%, transparent 100%)',
        }}
      />

      {/* Columns */}
      <div className="content-max-width grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
        {footerColumns.map((column) => (
          <div key={column.title} className="footer-column opacity-0">
            <h4
              className="font-body text-xs uppercase tracking-[2px] mb-6"
              style={{ color: '#D4AF37' }}
            >
              {column.title}
            </h4>
            <ul className="flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="font-body text-[15px] transition-colors duration-200 hover:text-[#F5F1E8]"
                    style={{ color: '#8A7E66' }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="content-max-width flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
        style={{
          borderTop: '1px solid rgba(212, 175, 55, 0.15)',
        }}
      >
        <p className="font-body text-[13px]" style={{ color: '#8A7E66' }}>
          &copy; 2025 ZAKARIYA. Alle Rechte vorbehalten.
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="font-body text-[13px] transition-colors duration-200 hover:text-[#F5F1E8]"
            style={{ color: '#8A7E66' }}
          >
            Datenschutz
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="font-body text-[13px] transition-colors duration-200 hover:text-[#F5F1E8]"
            style={{ color: '#8A7E66' }}
          >
            Impressum
          </a>
        </div>
      </div>
    </footer>
  )
}