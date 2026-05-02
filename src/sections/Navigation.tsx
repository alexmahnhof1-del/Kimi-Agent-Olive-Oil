import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ShoppingCart, MessageCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { CartDropdown } from '@/components/CartDropdown'
import { useCart } from '@/context/CartContext'

const navLinks = [
  { label: 'Herkunft', href: '#herkunft' },
  { label: 'Produkte', href: '#produkte' },
  { label: 'Qualität', href: '#qualitaet' },
  { label: 'Kontakt', href: '#kontakt' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const { items } = useCart()
  const cartCount = items.length

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (linksRef.current) {
      const items = linksRef.current.querySelectorAll('.nav-item')
      gsap.fromTo(
        items,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'expo.out',
          delay: 2.8,
        }
      )
    }
  }, [])

  const scrollToSection = (href: string) => {
    setMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-400"
      style={{
        backgroundColor: scrolled ? 'rgba(248, 245, 239, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(184, 148, 31, 0.1)' : 'none',
      }}
    >
      <div className="flex items-center justify-between h-20 px-6 md:px-20 max-w-[1600px] mx-auto">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="font-display text-2xl tracking-wide nav-item opacity-0"
          style={{ color: '#B8941F' }}
        >
          ZAKARIYA
        </a>

        <div ref={linksRef} className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(link.href)
              }}
              className="nav-item opacity-0 relative font-body text-[13px] uppercase tracking-[2px] transition-colors duration-300 hover:text-[#B8941F]"
              style={{ color: '#1A1714' }}
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#B8941F] transition-all duration-300 hover:w-full" />
            </a>
          ))}
          <a
            href="https://wa.me/4915218585508"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-item opacity-0 flex items-center gap-2 font-body text-[13px] uppercase tracking-[1.5px] font-medium px-6 py-3.5 rounded-pill transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_20px_rgba(184,148,31,0.35)]"
            style={{
              backgroundColor: '#B8941F',
              color: '#F8F5EF',
            }}
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <Dialog open={cartOpen} onOpenChange={setCartOpen}>
            <DialogTrigger asChild>
              <button
                className="nav-item opacity-0 relative p-2 hover:opacity-80 transition-opacity"
                aria-label="Warenkorb"
              >
                <ShoppingCart
                  size={20}
                  style={{ color: '#B8941F' }}
                />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                    style={{ backgroundColor: '#B8941F' }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <CartDropdown />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <Dialog open={cartOpen} onOpenChange={setCartOpen}>
            <DialogTrigger asChild>
              <button
                className="relative p-2 hover:opacity-80 transition-opacity"
                aria-label="Warenkorb"
              >
                <ShoppingCart
                  size={20}
                  style={{ color: '#B8941F' }}
                />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                    style={{ backgroundColor: '#B8941F' }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <CartDropdown />
            </DialogContent>
          </Dialog>

          <button
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span
              className="w-6 h-[1.5px] transition-all duration-300"
              style={{
                backgroundColor: '#B8941F',
                transform: menuOpen ? 'rotate(45deg) translateY(4px)' : 'none',
              }}
            />
            <span
              className="w-6 h-[1.5px] transition-all duration-300"
              style={{
                backgroundColor: '#B8941F',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="w-6 h-[1.5px] transition-all duration-300"
              style={{
                backgroundColor: '#B8941F',
                transform: menuOpen ? 'rotate(-45deg) translateY(-4px)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden absolute top-20 left-0 right-0 py-8 px-6 flex flex-col gap-6"
          style={{ backgroundColor: 'rgba(248, 245, 239, 0.98)', backdropFilter: 'blur(20px)' }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(link.href)
              }}
              className="font-body text-sm uppercase tracking-[2px] transition-colors duration-300"
              style={{ color: '#1A1714' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}