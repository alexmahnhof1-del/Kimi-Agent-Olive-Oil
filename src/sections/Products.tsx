import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { toast } from 'sonner'
import { useCart } from '@/context/CartContext'

gsap.registerPlugin(ScrollTrigger)

const products = [
  {
    name: 'Koroneiki',
    subtitle: 'Das klassische Kreta-Öl',
    description:
      'Intensiv fruchtig mit Noten von grünem Apfel und frisch gemähtem Gras. Unser meistverkauftes Öl, das die Essenz der kretischen Koroneiki-Olive einfängt.',
    details: '500ml · Kaltgepresst · Bio-zertifiziert',
    price: '€24,90',
    image: '/images/product-koroneiki.jpg',
  },
  {
    name: 'Tsounati',
    subtitle: 'Das sanfte Highlight',
    description:
      'Mild und samtig mit einem Hauch von Mandel und reifer Tomate. Aus der seltenen Tsounati-Olive, die nur in den höheren Lagen Kretas wächst.',
    details: '500ml · Kaltgepresst · Limitierte Auflage',
    price: '€29,90',
    image: '/images/product-tsounati.jpg',
  },
  {
    name: 'Marioulas',
    subtitle: 'Das kraftvolle Erbe',
    description:
      'Robust und würzig mit Noten von wilden Kräutern und Pfeffer. Von alten Marioulas-Bäumen, einige über 1.000 Jahre alt.',
    details: '500ml · Kaltgepresst · Ursprungsgeschützt',
    price: '€34,90',
    image: '/images/product-marioulas.jpg',
  },
]

function ProductCard({ product }: { product: typeof products[0] }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef({ x: 0, y: 0, currentX: 0, currentY: 0 })
  const rafRef = useRef<number>(0)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product.name, product.name, product.price)
    toast.success(`${product.name} zum Warenkorb hinzugefügt`)
  }

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) / (rect.width / 2)
    const deltaY = (e.clientY - centerY) / (rect.height / 2)

    tiltRef.current.x = deltaX * 8
    tiltRef.current.y = -deltaY * 8
  }, [])

  const handleMouseLeave = useCallback(() => {
    tiltRef.current.x = 0
    tiltRef.current.y = 0
  }, [])

  useEffect(() => {
    const animate = () => {
      const t = tiltRef.current
      t.currentX += (t.x - t.currentX) * 0.1
      t.currentY += (t.y - t.currentY) * 0.1

      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1200px) rotateX(${t.currentY}deg) rotateY(${t.currentX}deg)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div
      className="product-card opacity-0 group"
      style={{ perspective: 1200 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden transition-shadow duration-400"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          border: '1px solid rgba(184, 148, 31, 0.12)',
          boxShadow: '0 4px 24px rgba(26, 23, 20, 0.06), 0 -20px 60px rgba(212, 175, 55, 0.06)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative overflow-hidden" style={{ height: '55%' }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ borderRadius: '20px 20px 0 0' }}
            loading="lazy"
          />
        </div>

        <div className="p-6 md:p-8">
          <h3
            className="font-display text-[28px] md:text-[40px] leading-[1.2] tracking-[-1px] mb-1"
            style={{ color: '#1A1714' }}
          >
            {product.name}
          </h3>
          <p
            className="font-accent italic text-lg md:text-[24px] font-light mb-4"
            style={{ color: '#7A7265' }}
          >
            {product.subtitle}
          </p>
          <p
            className="font-body text-sm md:text-[17px] mb-6 line-clamp-2"
            style={{ color: '#7A7265', lineHeight: 1.65 }}
          >
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-6">
            <span
              className="font-body text-[13px] uppercase tracking-[0.5px]"
              style={{ color: '#7A7265' }}
            >
              {product.details}
            </span>
            <span
              className="font-display text-[24px] md:text-[32px]"
              style={{ color: '#B8941F' }}
            >
              {product.price}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full font-body text-[13px] uppercase tracking-[1.5px] font-medium py-3 rounded-pill transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(184,148,31,0.35)]"
            style={{ backgroundColor: '#B8941F', color: '#F8F5EF' }}
          >
            In den Warenkorb
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.products-label',
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
        '.products-headline-word',
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
        '.products-description',
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
        '.product-card',
        { opacity: 0, y: 80, rotateX: 15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.0,
          stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.products-grid', start: 'top 85%' },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="produkte"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-20"
      style={{ backgroundColor: '#F0EBE1' }}
    >
      {/* Header */}
      <div className="content-wide text-center mb-16 md:mb-24">
        <p
          className="products-label opacity-0 font-body text-xs uppercase tracking-[4px] mb-6"
          style={{ color: '#B8941F' }}
        >
          Unsere Öle
        </p>
        <h2 className="font-display text-[32px] md:text-[64px] leading-[1.1] tracking-[-2px] mb-6">
          {'Drei Charaktere, eine Herkunft'.split(' ').map((word, i) => (
            <span
              key={i}
              className="products-headline-word opacity-0 inline-block mr-[0.3em]"
              style={{ color: '#1A1714' }}
            >
              {word}
            </span>
          ))}
        </h2>
        <p
          className="products-description opacity-0 font-body text-base md:text-[17px] max-w-[560px] mx-auto"
          style={{ color: '#7A7265', lineHeight: 1.65 }}
        >
          Jedes unserer Öle erzählt eine andere Geschichte des kretischen Terroirs.
        </p>
      </div>

      {/* Product Grid */}
      <div className="products-grid content-wide grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  )
}